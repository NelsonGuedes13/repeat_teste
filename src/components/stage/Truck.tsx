"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll, smooth, range, LOAD, TRIP } from "@/lib/scroll";
import { useBeam } from "./Beam";
import Cargo from "./Cargo";

// light paint so the truck reads as the hero object against the dark warehouse
const PAINT = "#d4d4da";
const STEEL = "#2a2a33";

/** Curtain-sider: the near side is open so the cargo stays visible; the curtain closes when the load is done. */
export default function Truck() {
  const curtain = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  // both headlights share one material, so one mesh ref is enough to fade them
  const beam = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const headBeam = useBeam("#fff4e0", 9, 1.6);

  useFrame(() => {
    const c = smooth(range(scroll.load, ...LOAD.curtain));
    if (curtain.current) {
      curtain.current.scale.x = Math.max(c, 0.0001);
      curtain.current.visible = c > 0.001;
    }
    // ease-in only: the truck accelerates out of the door and keeps going
    const d = range(scroll.trip, ...TRIP.drive);
    if (body.current) body.current.position.x = d * d * 34;
    const lights = range(scroll.trip, 0.01, 0.04) * 0.22;
    if (beam.current) beam.current.material.uniforms.uOpacity.value = lights;
  });

  return (
    <group ref={body}>
      <Cargo />
      {[-0.85, 0.85].map((z, i) => (
        <mesh
          key={z}
          ref={i === 0 ? beam : undefined}
          geometry={headBeam.geometry}
          material={headBeam.material}
          position={[8.65, 1.25, z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
      {/* wheels */}
      {[-1.8, -0.6, 5.3, 7.7].flatMap((x) =>
        [-1.1, 1.1].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.35, 16]} />
            <meshStandardMaterial color="#0b0b0e" roughness={0.9} />
          </mesh>
        )),
      )}
      {/* chassis */}
      <mesh position={[2.8, 0.85, 0]}>
        <boxGeometry args={[11.5, 0.3, 1.9]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.5} />
      </mesh>

      {/* trailer: floor, roof, far wall, front wall, posts */}
      <mesh position={[1.5, 1.1, 0]}>
        <boxGeometry args={[9, 0.2, 2.5]} />
        <meshStandardMaterial color={STEEL} roughness={0.8} />
      </mesh>
      <mesh position={[1.5, 3.95, 0]}>
        <boxGeometry args={[9.1, 0.12, 2.6]} />
        <meshStandardMaterial color={PAINT} />
      </mesh>
      <mesh position={[1.5, 2.55, -1.24]}>
        <boxGeometry args={[9, 2.7, 0.06]} />
        <meshStandardMaterial color={PAINT} roughness={0.8} />
      </mesh>
      <mesh position={[6, 2.55, 0]}>
        <boxGeometry args={[0.08, 2.7, 2.5]} />
        <meshStandardMaterial color={PAINT} />
      </mesh>
      {[-3, 1.5].map((x) => (
        <mesh key={x} position={[x, 2.55, 1.22]}>
          <boxGeometry args={[0.08, 2.7, 0.08]} />
          <meshStandardMaterial color="#9a9aa6" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* warm interior strip so the load reads inside the box */}
      <mesh position={[1.5, 3.87, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.6, 0.08]} />
        <meshStandardMaterial color="#000" emissive="#ffcf8a" emissiveIntensity={2} side={THREE.DoubleSide} />
      </mesh>

      {/* curtain, anchored at the cab end and pulled toward the rear */}
      <group ref={curtain} position={[6, 0, 1.25]}>
        <mesh position={[-4.5, 2.55, 0]}>
          <boxGeometry args={[9, 2.7, 0.04]} />
          <meshStandardMaterial color="#121217" roughness={0.95} />
        </mesh>
        <mesh position={[-4.5, 1.55, 0.03]}>
          <boxGeometry args={[9, 0.12, 0.01]} />
          <meshStandardMaterial color="#000" emissive="#ff2e88" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* cab */}
      <mesh position={[7.4, 2.1, 0]}>
        <boxGeometry args={[2.4, 2.6, 2.5]} />
        <meshStandardMaterial color={PAINT} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[8.61, 2.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 1]} />
        <meshStandardMaterial color="#0a1418" metalness={0.9} roughness={0.1} />
      </mesh>
      {[-0.85, 0.85].map((z) => (
        <mesh key={z} position={[8.62, 1.25, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.16]} />
          <meshStandardMaterial color="#000" emissive="#fff4e0" emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
}
