"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { scroll, rig, rigLevel } from "@/lib/scroll";

// The extra kit that builds up on the stage when a pack or a budget asks for it.
// Each piece eases in (scale / drop / opacity) from `rigLevel`, which this component keeps in sync with `rig`.

const ALU = "#9a9aa6";

function Speakers() {
  const ground = useRef<THREE.Group>(null);
  const flown = useRef<THREE.Group>(null);
  useFrame(() => {
    const s = rigLevel.sound;
    const g = THREE.MathUtils.clamp(s, 0, 1);
    const f = THREE.MathUtils.clamp(s - 1, 0, 1);
    if (ground.current) {
      ground.current.scale.setScalar(Math.max(g * (1 - f), 0.0001));
    }
    if (flown.current) {
      flown.current.position.y = 6 + (1 - f) * 4; // drops in from the fly tower
      flown.current.visible = f > 0.01;
    }
  });
  return (
    <>
      <group ref={ground}>
        {[-4.6, 4.6].map((x) => (
          <group key={x} position={[x, 0, -0.6]}>
            {[0, 1].map((i) => (
              <mesh key={i} position={[0, 0.45 + i * 0.85, 0]}>
                <boxGeometry args={[0.8, 0.8, 0.7]} />
                <meshStandardMaterial color="#111116" roughness={0.9} />
                <Edges color="#33333f" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <group ref={flown}>
        {[-4.8, 4.8].map((x) => (
          <group key={x} position={[x, 0, -0.6]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.6, 4]} />
              <meshStandardMaterial color={ALU} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} position={[0, -0.3 - i * 0.36, 0.02 * i * i]} rotation={[0.03 * i * i, 0, 0]}>
                <boxGeometry args={[1, 0.32, 0.6]} />
                <meshStandardMaterial color="#111116" roughness={0.9} />
                <Edges color="#33333f" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}

function TrussTowers() {
  const towers = useRef<THREE.Group>(null);
  useFrame(() => {
    if (towers.current) towers.current.scale.y = Math.max(rigLevel.truss, 0.0001);
  });
  return (
    <group ref={towers}>
      {[-5.6, 5.6].map((x) => (
        <mesh key={x} position={[x, 2.8, -1]}>
          <boxGeometry args={[0.35, 5.6, 0.35]} />
          <meshStandardMaterial color={ALU} metalness={0.9} roughness={0.3} wireframe />
        </mesh>
      ))}
    </group>
  );
}

const ledVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const ledFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOn;
  varying vec2 vUv;
  void main() {
    vec3 magenta = vec3(1.0, 0.18, 0.53);
    vec3 cyan = vec3(0.18, 0.9, 1.0);
    vec3 amber = vec3(1.0, 0.69, 0.18);
    float w = sin(vUv.x * 9.0 - uTime * 1.4) * 0.5 + 0.5;
    vec3 col = mix(mix(magenta, cyan, w), amber, smoothstep(0.6, 1.0, sin(vUv.y * 4.0 + uTime) * 0.5 + 0.5) * 0.5);
    // LED pixel grid
    vec2 cell = fract(vUv * vec2(96.0, 48.0));
    float dot = step(0.18, cell.x) * step(0.18, cell.y);
    gl_FragColor = vec4(col * (0.35 + 0.65 * dot) * uOn, 1.0);
  }
`;

function LedWall() {
  const screen = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: ledVertex, fragmentShader: ledFragment, uniforms: { uTime: { value: 0 }, uOn: { value: 0 } } }),
    [],
  );
  useFrame(({ clock }) => {
    const m = screen.current;
    if (!m) return;
    m.visible = rigLevel.led > 0.01;
    m.material.uniforms.uTime.value = clock.elapsedTime;
    m.material.uniforms.uOn.value = rigLevel.led;
    m.scale.y = Math.max(rigLevel.led, 0.0001); // unrolls from the middle
  });
  return <mesh ref={screen} position={[0, 2.8, -3.4]} material={material}><planeGeometry args={[6.4, 3.2]} /></mesh>;
}

function DjBooth() {
  const booth = useRef<THREE.Group>(null);
  useFrame(() => {
    if (booth.current) booth.current.scale.setScalar(Math.max(rigLevel.dj, 0.0001));
  });
  return (
    <group ref={booth} position={[0, 0.5, -0.4]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 1, 0.7]} />
        <meshStandardMaterial color="#15151b" roughness={0.6} />
        <Edges color={ALU} />
      </mesh>
      <mesh position={[0, 0.7, 0.36]}>
        <planeGeometry args={[1.6, 0.06]} />
        <meshStandardMaterial color="#000" emissive="#2ee6ff" emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

function Haze() {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  const puffs = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ x: -6 + i * 2, z: 0.5 + (i % 3) * 0.8, s: 4 + (i % 2) * 2, phase: i * 1.7 })),
    [],
  );
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.visible = rigLevel.fx > 0.01;
    g.children.forEach((child, i) => {
      const m = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
      m.position.x = puffs[i].x + Math.sin(clock.elapsedTime * 0.2 + puffs[i].phase) * 0.8;
      m.material.opacity = rigLevel.fx * 0.07;
    });
  });
  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p.x, 0.9, p.z]} scale={[p.s, 1.6, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#c8c8ff" />
        </mesh>
      ))}
    </group>
  );
}

export default function StageRig() {
  useFrame((_, delta) => {
    // kit only shows once we're back at the stage for the packs / budget
    const active = scroll.packs > 0;
    const k = 1 - Math.exp(-delta * 2.5);
    for (const key of Object.keys(rigLevel) as (keyof typeof rigLevel)[]) {
      rigLevel[key] += ((active ? rig[key] : 0) - rigLevel[key]) * k;
    }
  });
  return (
    <>
      <Speakers />
      <TrussTowers />
      <LedWall />
      <DjBooth />
      <Haze />
    </>
  );
}
