"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBeam } from "./Beam";
import { scroll, rig, rigLevel } from "@/lib/scroll";

type Props = {
  position: [number, number, number];
  color: string;
  /** scroll progress at which this fixture switches on */
  onAt: number;
  /** switch-on order (0 = first) when the configurator picks how many fixtures run */
  rank: number;
  phase: number;
};

const ease = (t: number) => t * t * (3 - 2 * t);
const target = new THREE.Vector3();

export default function MovingHead({ position, color, onAt, rank, phase }: Props) {
  const head = useRef<THREE.Group>(null);
  const level = useRef(0);
  const light = useRef<THREE.SpotLight>(null);
  const lens = useRef<THREE.MeshStandardMaterial>(null);
  const cone = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const beam = useBeam(color);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    const cue = ease(THREE.MathUtils.clamp((scroll.lights - onAt) / 0.1, 0, 1));
    // back at the stage for the packs: the configurator decides how many fixtures run
    const want = rank < rig.heads ? 1 : 0;
    level.current += (want - level.current) * 0.08;
    const on = scroll.packs > 0 ? level.current : cue;

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
    // haze makes the beams read thicker
    if (cone.current) cone.current.material.uniforms.uOpacity.value = on * (0.55 + rigLevel.fx * 0.3);
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
        <mesh ref={cone} geometry={beam.geometry} material={beam.material} position={[0, 0, 0.22]} />
      </group>
      <spotLight ref={light} color={color} angle={0.28} penumbra={0.6} distance={14} decay={1.4} intensity={0} />
    </group>
  );
}
