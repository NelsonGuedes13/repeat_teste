"use client";

import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import MovingHead from "./MovingHead";
import { scroll } from "@/lib/scroll";

const COLORS = ["#ff2e88", "#2ee6ff", "#ffb02e"];
const HEADS = Array.from({ length: 6 }, (_, i) => ({
  x: -3.75 + i * 1.5,
  color: COLORS[i % 3],
  // one fixture already on for the welcome, then centre-out — reads like a lighting cue
  onAt: i === 2 ? -1 : 0.04 + [2, 1, 0, 0, 1, 2][i] * 0.07,
  phase: i * 1.1,
}));

const camTarget = new THREE.Vector3();

export default function StageScene({ lowPower }: { lowPower: boolean }) {
  useFrame(({ camera, pointer }, delta) => {
    const p = scroll.progress;
    // dolly in toward the stage as the cue builds
    camTarget.set(pointer.x * 0.4, 1.5 + p * 0.6 + pointer.y * 0.2, 10 - p * 3.5);
    camera.position.lerp(camTarget, 1 - Math.exp(-delta * 3));
    camera.lookAt(0, 2 - p * 0.4, -1);
  });

  return (
    <>
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 7, 24]} />
      <ambientLight intensity={0.05} />

      {/* truss */}
      <mesh position={[0, 5.6, -1]}>
        <boxGeometry args={[10, 0.3, 0.3]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.8} roughness={0.35} wireframe />
      </mesh>
      <mesh position={[0, 5.6, -1]}>
        <boxGeometry args={[10, 0.06, 0.06]} />
        <meshStandardMaterial color="#2a2a33" metalness={0.8} roughness={0.3} />
      </mesh>

      {HEADS.map((h) => (
        <MovingHead key={h.x} position={[h.x, 5.3, -1]} color={h.color} onAt={h.onAt} phase={h.phase} />
      ))}

      {/* stage riser */}
      <mesh position={[0, 0.25, -1.5]}>
        <boxGeometry args={[8, 0.5, 4]} />
        <meshStandardMaterial color="#0d0d12" roughness={0.8} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 4, -6]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#08080b" roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <MeshReflectorMaterial
          resolution={lowPower ? 256 : 512}
          blur={[300, 80]}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0e"
          metalness={0.6}
        />
      </mesh>
    </>
  );
}
