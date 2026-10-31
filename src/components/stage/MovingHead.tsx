"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBeam } from "./Beam";
import { scroll } from "@/lib/scroll";

type Props = {
  position: [number, number, number];
  color: string;
  /** scroll progress at which this fixture switches on */
  onAt: number;
  phase: number;
};

const ease = (t: number) => t * t * (3 - 2 * t);
const target = new THREE.Vector3();

export default function MovingHead({ position, color, onAt, phase }: Props) {
  const head = useRef<THREE.Group>(null);
  const light = useRef<THREE.SpotLight>(null);
  const lens = useRef<THREE.MeshStandardMaterial>(null);
  const beam = useBeam(color);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    const on = ease(THREE.MathUtils.clamp((scroll.progress - onAt) / 0.06, 0, 1));

    // slow sweep + a pull toward the pointer so the rig feels alive
    target.set(
      Math.sin(t * 0.4 + phase) * 2.6 + pointer.x * 2,
      0,
      Math.cos(t * 0.3 + phase) * 1.6 - 0.5 - pointer.y * 1.2,
    );
    head.current?.lookAt(target);
    if (light.current) {
      light.current.target.position.copy(target);
      light.current.target.updateMatrixWorld();
      light.current.intensity = on * 60;
    }
    beam.material.uniforms.uOpacity.value = on * 0.55;
    if (lens.current) lens.current.emissiveIntensity = on * 6;
  });

  return (
    <group position={position}>
      {/* yoke */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.36, 0.12, 0.36]} />
        <meshStandardMaterial color="#16161c" roughness={0.6} metalness={0.4} />
      </mesh>
      <group ref={head}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.4, 12]} />
          <meshStandardMaterial color="#1c1c24" roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.21]}>
          <circleGeometry args={[0.13, 16]} />
          <meshStandardMaterial ref={lens} color="#000" emissive={color} emissiveIntensity={0} />
        </mesh>
        <mesh geometry={beam.geometry} material={beam.material} position={[0, 0, 0.22]} />
      </group>
      <spotLight ref={light} color={color} angle={0.28} penumbra={0.6} distance={14} decay={1.4} intensity={0} />
    </group>
  );
}
