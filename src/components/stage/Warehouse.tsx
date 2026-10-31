"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { useBeam } from "./Beam";
import Truck from "./Truck";
import { scroll, smooth, range, LOAD, TRIP } from "@/lib/scroll";

/** World z of the warehouse — far enough from the stage that fog hides one from the other. */
export const WAREHOUSE_Z = -44;

const WALL = "#0f0f14";
const WARM = "#ffcf8a";

function Lamp({ position, withLight }: { position: [number, number, number]; withLight: boolean }) {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const cone = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const beam = useBeam(WARM, 6.5, 2.2);

  useFrame(() => {
    const on = smooth(range(scroll.load, ...LOAD.lightsOn));
    if (light.current) light.current.intensity = on * 70;
    if (bulb.current) bulb.current.emissiveIntensity = on * 5;
    if (cone.current) cone.current.material.uniforms.uOpacity.value = on * 0.12;
  });

  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 2, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.45, 0.35, 12, 1, true]} />
        <meshStandardMaterial color="#2a2a33" side={THREE.DoubleSide} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial ref={bulb} color="#000" emissive={WARM} emissiveIntensity={0} />
      </mesh>
      <mesh ref={cone} geometry={beam.geometry} material={beam.material} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} />
      {withLight && <pointLight ref={light} position={[0, -0.4, 0]} color={WARM} distance={16} decay={1.5} intensity={0} />}
    </group>
  );
}

function RollerDoor({ children }: { children: React.ReactNode }) {
  const door = useRef<THREE.Group>(null);
  useFrame(() => {
    if (door.current) door.current.position.y = 2.75 + smooth(range(scroll.trip, ...TRIP.door)) * 5.3;
  });
  return (
    <group ref={door} position={[13.05, 2.75, 0]}>
      {children}
    </group>
  );
}

function Rack({ x }: { x: number }) {
  const cases = [0, 1, 2].flatMap((shelf) => [-0.8, 0, 0.8].map((cx) => ({ shelf, cx })));
  return (
    <group position={[x, 0, -8.6]}>
      {[-1.25, 1.25].map((ux) => (
        <mesh key={ux} position={[ux, 2.4, 0]}>
          <boxGeometry args={[0.08, 4.8, 1.2]} />
          <meshStandardMaterial color="#2b4a7a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {[0, 1, 2].map((s) => (
        <mesh key={s} position={[0, 0.15 + s * 1.6, 0]}>
          <boxGeometry args={[2.6, 0.08, 1.2]} />
          <meshStandardMaterial color="#c9771c" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      {cases.map(({ shelf, cx }, i) => (
        <mesh key={i} position={[cx, 0.19 + shelf * 1.6 + 0.35, 0]}>
          <boxGeometry args={[0.7, 0.7 - (i % 3) * 0.12, 0.9]} />
          <meshStandardMaterial color="#15151b" roughness={0.7} />
          <Edges color="#5a5a66" />
        </mesh>
      ))}
    </group>
  );
}

export default function Warehouse({ lowPower }: { lowPower: boolean }) {
  return (
    <group position={[0, 0, WAREHOUSE_Z]}>
      {/* shell — front left open like a diorama */}
      <mesh position={[0, 4.5, -10]}>
        <boxGeometry args={[26.6, 9, 0.3]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <mesh position={[-13.15, 4.5, 0]}>
        <boxGeometry args={[0.3, 9, 20]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      {/* right wall with the roller-door opening the truck will drive through */}
      {[-6.75, 6.75].map((z) => (
        <mesh key={z} position={[13.15, 4.5, z]}>
          <boxGeometry args={[0.3, 9, 6.5]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[13.15, 7.25, 0]}>
        <boxGeometry args={[0.3, 3.5, 7]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>
      <RollerDoor>
        <mesh>
          <boxGeometry args={[0.12, 5.5, 7]} />
          <meshStandardMaterial color="#1b1b22" metalness={0.5} roughness={0.6} />
        </mesh>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[-0.07, -2.5 + i * 0.55, 0]}>
            <boxGeometry args={[0.02, 0.03, 6.9]} />
            <meshStandardMaterial color="#2c2c36" />
          </mesh>
        ))}
      </RollerDoor>
      {/* wall ribs */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-12 + i * 4, 4.5, -9.8]}>
          <boxGeometry args={[0.25, 9, 0.2]} />
          <meshStandardMaterial color="#17171e" />
        </mesh>
      ))}
      {/* roof beams */}
      {[-6, 0, 6].map((z) => (
        <mesh key={z} position={[0, 8.7, z]}>
          <boxGeometry args={[26.6, 0.35, 0.25]} />
          <meshStandardMaterial color="#17171e" />
        </mesh>
      ))}

      {/* floor markings around the loading bay */}
      {[
        { p: [1.5, 0.012, 2.4], s: [12, 0.1] },
        { p: [1.5, 0.012, 6], s: [12, 0.1] },
        { p: [-4.5, 0.012, 4.2], s: [0.1, 3.6] },
        { p: [7.5, 0.012, 4.2], s: [0.1, 3.6] },
      ].map((l, i) => (
        <mesh key={i} position={l.p as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={l.s as [number, number]} />
          <meshStandardMaterial color="#000" emissive="#c9a21c" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {[-9, -5.6].map((x) => (
        <Rack key={x} x={x} />
      ))}

      {[
        [-7, 7, -2],
        [0, 7, 2],
        [7, 7, -2],
      ].map((p, i) => (
        <Lamp key={i} position={p as [number, number, number]} withLight={!lowPower || i === 1} />
      ))}

      {/* cool fill from the open front so silhouettes read */}
      <directionalLight position={[-6, 8, 14]} intensity={0.35} color="#9fb4ff" target-position={[0, 0, WAREHOUSE_Z]} />

      <Truck />
    </group>
  );
}
