"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, Line } from "@react-three/drei";
import * as THREE from "three";
import { useBeam } from "./Beam";
import { scroll, smooth, range, TRIP } from "@/lib/scroll";
import { MAP_ORIGIN, OUTLINE, ROUTE, STOPS, project } from "@/lib/trip";

const TOP = 0.4; // map thickness — the route and pins sit on top of it
const SEGMENTS = 400;

/** Camera pose the rig blends into once the trip reaches the map. */
export const tripCam = { pos: new THREE.Vector3(), look: new THREE.Vector3() };

function useRoute() {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      ROUTE.map((p) => {
        const [x, z] = project(p.lon, p.lat);
        return new THREE.Vector3(x, TOP + 0.02, z);
      }),
    );
    // arc-length fraction of each gallery stop (CatmullRom control point j sits at t = j / (n - 1))
    const lengths = curve.getLengths(SEGMENTS);
    const total = lengths[SEGMENTS];
    const stopU = ROUTE.flatMap((p, j) =>
      p.stop === undefined ? [] : [lengths[Math.round((j / (ROUTE.length - 1)) * SEGMENTS)] / total],
    );
    return { curve, stopU };
  }, []);
}

/** Where the truck is along the route (0 → 1) for a given trip progress. */
function routeU(p: number, stopU: number[]) {
  let u = 0;
  stopU.forEach((target, i) => {
    const [a, b] = TRIP.travel(i);
    if (p >= a) u = THREE.MathUtils.lerp(i ? stopU[i - 1] : 0, target, smooth(range(p, a, b)));
  });
  return u;
}

function MiniTruck({ truck }: { truck: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={truck}>
      <mesh position={[-0.12, 0.2, 0]}>
        <boxGeometry args={[0.95, 0.3, 0.3]} />
        <meshStandardMaterial color="#d4d4da" />
      </mesh>
      <mesh position={[-0.12, 0.1, 0.152]}>
        <boxGeometry args={[0.95, 0.03, 0.005]} />
        <meshStandardMaterial color="#000" emissive="#ff2e88" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.48, 0.17, 0]}>
        <boxGeometry args={[0.24, 0.26, 0.3]} />
        <meshStandardMaterial color="#d4d4da" />
      </mesh>
      <pointLight position={[0.9, 0.6, 0]} color="#fff4e0" intensity={4} distance={4} decay={1.5} />
    </group>
  );
}

function Stop({ index, position }: { index: number; position: THREE.Vector3 }) {
  const { accent } = STOPS[index];
  const beam = useBeam(accent, 5, 0.9);
  const cone = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const stage = useRef<THREE.Group>(null);
  const ring = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const [a, b] = TRIP.dwell(index);
    const arrived = smooth(range(scroll.trip, a - 0.02, a + 0.02));
    const here = scroll.trip >= a - 0.02 && scroll.trip < b;
    const glow = here ? 0.65 : arrived ? 0.22 : 0.06;
    if (cone.current) {
      const u = cone.current.material.uniforms.uOpacity;
      u.value += (glow - u.value) * 0.1;
    }
    if (stage.current) stage.current.scale.setScalar(Math.max(arrived, 0.0001));
    if (ring.current) ring.current.emissiveIntensity = 1 + (here ? Math.sin(clock.elapsedTime * 4) * 0.8 + 1.5 : 0);
  });

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.32, 0.42, 32]} />
        <meshStandardMaterial ref={ring} color="#000" emissive={accent} emissiveIntensity={1} />
      </mesh>
      <mesh ref={cone} geometry={beam.geometry} material={beam.material} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      {/* tiny stage that "builds" when the truck arrives */}
      <group ref={stage} position={[0.9, 0, -0.5]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.9, 0.12, 0.55]} />
          <meshStandardMaterial color="#1d1d24" />
        </mesh>
        {[-0.42, 0.42].map((x) => (
          <mesh key={x} position={[x, 0.45, -0.22]}>
            <boxGeometry args={[0.04, 0.8, 0.04]} />
            <meshStandardMaterial color="#9a9aa6" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.85, -0.22]}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
          <meshStandardMaterial color="#000" emissive={accent} emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}

const truckPos = new THREE.Vector3();
const tangent = new THREE.Vector3();
const world = new THREE.Vector3();
const OVERVIEW_POS = new THREE.Vector3(0, 40, 24);
const followPos = new THREE.Vector3();
const followLook = new THREE.Vector3();

export default function PortugalMap() {
  const { curve, stopU } = useRoute();
  const truck = useRef<THREE.Group>(null);
  const road = useRef<THREE.Mesh>(null);
  const moon = useRef<THREE.DirectionalLight>(null);
  const grid = useRef<THREE.Mesh>(null);

  const land = useMemo(() => {
    const shape = new THREE.Shape(OUTLINE.map(([lon, lat]) => {
      const [x, z] = project(lon, lat);
      return new THREE.Vector2(x, -z);
    }));
    const g = new THREE.ExtrudeGeometry(shape, { depth: TOP, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const coast = useMemo(
    () => [...OUTLINE, OUTLINE[0]].map(([lon, lat]) => {
      const [x, z] = project(lon, lat);
      return new THREE.Vector3(x, TOP + 0.01, z);
    }),
    [],
  );
  const roadGeo = useMemo(() => new THREE.TubeGeometry(curve, SEGMENTS, 0.07, 6, false), [curve]);
  const stops = useMemo(
    () => ROUTE.filter((p) => p.stop !== undefined).map((p) => {
      const [x, z] = project(p.lon, p.lat);
      return new THREE.Vector3(x, TOP, z);
    }),
    [],
  );

  useFrame(({ size }) => {
    const p = scroll.trip;
    const u = routeU(p, stopU);
    curve.getPointAt(u, truckPos);
    curve.getTangentAt(u, tangent);
    if (truck.current) {
      truck.current.position.copy(truckPos);
      truck.current.rotation.y = Math.atan2(-tangent.z, tangent.x);
    }
    road.current?.geometry.setDrawRange(0, Math.floor(u * SEGMENTS) * 6 * 6);

    const onMap = range(p, TRIP.toMap[0] - 0.02, TRIP.toMap[0]);
    // moonlight comes on with the door so the truck is visible outside, then lights the map
    if (moon.current) moon.current.intensity = range(p, ...TRIP.door) * 1.6;
    if (grid.current) grid.current.visible = onMap > 0;

    // camera: overview of the country → follow the truck (closer while parked) → overview again
    const dwelling = stopU.some((_, i) => {
      const [a, b] = TRIP.dwell(i);
      return p >= a && p < b;
    });
    const near = dwelling ? 0.85 : 1;
    // on wide screens keep the truck right of centre so the gallery has room on the left
    const side = size.width > size.height ? -4 * near : 0;
    followPos.set(truckPos.x + side, truckPos.y + 11 * near, truckPos.z + 9 * near);
    followLook.set(truckPos.x + side, truckPos.y, truckPos.z);
    const follow = range(p, TRIP.toMap[1], TRIP.toMap[1] + 0.04) * (1 - range(p, ...TRIP.outro));
    tripCam.pos.lerpVectors(OVERVIEW_POS, followPos, smooth(follow));
    tripCam.look.lerpVectors(world.set(0, 0, 2), followLook, smooth(follow));
    tripCam.pos.add(world.set(...MAP_ORIGIN));
    tripCam.look.add(world.set(...MAP_ORIGIN));
  });

  return (
    <group position={MAP_ORIGIN}>
      <directionalLight ref={moon} position={[-30, 30, 30]} intensity={0} color="#b8c6ff" target-position={[-40, 0, 0]} />
      <Grid
        ref={grid}
        position={[0, -0.02, 0]}
        args={[10, 10]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        cellColor="#14141c"
        sectionSize={6}
        sectionThickness={1}
        sectionColor="#1d2a3c"
        fadeDistance={70}
        fadeStrength={1.5}
        visible={false}
      />
      <mesh geometry={land}>
        <meshStandardMaterial color="#1c1c28" roughness={0.85} />
      </mesh>
      <Line points={coast} color="#2ee6ff" lineWidth={1.5} transparent opacity={0.7} />
      <mesh ref={road} geometry={roadGeo}>
        <meshStandardMaterial color="#000" emissive="#ff2e88" emissiveIntensity={2.5} />
      </mesh>
      {stops.map((pos, i) => (
        <Stop key={i} index={i} position={pos} />
      ))}
      <MiniTruck truck={truck} />
    </group>
  );
}
