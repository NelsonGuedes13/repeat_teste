"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { scroll, smooth, range, LOAD } from "@/lib/scroll";

const ALU = "#9a9aa6";
const BODY = "#15151b";

/** Flightcase: dark box with aluminium edges and an accent label that glows while it's being loaded. */
function Case({ size, accent, position = [0, 0, 0], glow }: {
  size: [number, number, number];
  accent: string;
  position?: [number, number, number];
  glow: React.RefObject<THREE.MeshStandardMaterial[]>;
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={BODY} roughness={0.7} metalness={0.2} />
        <Edges color={ALU} />
      </mesh>
      <mesh position={[0, h * 0.62, d / 2 + 0.005]}>
        <planeGeometry args={[w * 0.5, h * 0.12]} />
        <meshStandardMaterial
          ref={(m) => { if (m && !glow.current.includes(m)) glow.current.push(m); }}
          color="#000"
          emissive={accent}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

type Kind = "stage" | "truss" | "light" | "sound" | "desk" | "fx";

function Model({ kind, accent, glow }: { kind: Kind; accent: string; glow: React.RefObject<THREE.MeshStandardMaterial[]> }) {
  switch (kind) {
    case "stage": // stacked stage decks
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, 0.09 + i * 0.19, 0]}>
              <boxGeometry args={[1.1, 0.16, 2]} />
              <meshStandardMaterial color="#1d1d24" roughness={0.9} />
              <Edges color={ALU} />
            </mesh>
          ))}
          <Case size={[1.1, 0.35, 0.5]} accent={accent} position={[0, 0.76, 0.6]} glow={glow} />
        </>
      );
    case "truss": // two box-truss sections
      return (
        <>
          {[0, 1].map((i) => (
            <group key={i} position={[0, 0.2 + i * 0.42, 0]}>
              <mesh>
                <boxGeometry args={[0.38, 0.38, 2.1]} />
                <meshStandardMaterial color={ALU} metalness={0.9} roughness={0.3} wireframe />
              </mesh>
              {[-1, 1].flatMap((sx) =>
                [-1, 1].map((sy) => (
                  <mesh key={`${sx}${sy}`} position={[sx * 0.17, sy * 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.025, 0.025, 2.1, 6]} />
                    <meshStandardMaterial color={ALU} metalness={0.9} roughness={0.3} />
                  </mesh>
                )),
              )}
            </group>
          ))}
          <mesh position={[0, 1.06, 0.95]}>
            <boxGeometry args={[0.3, 0.04, 0.04]} />
            <meshStandardMaterial
              ref={(m) => { if (m && !glow.current.includes(m)) glow.current.push(m); }}
              color="#000"
              emissive={accent}
              emissiveIntensity={0.4}
            />
          </mesh>
        </>
      );
    case "light": // road case with a moving head on top
      return (
        <>
          <Case size={[1, 0.8, 1.2]} accent={accent} glow={glow} />
          <mesh position={[0, 0.9, 0]}>
            <boxGeometry args={[0.4, 0.16, 0.4]} />
            <meshStandardMaterial color="#1c1c24" />
          </mesh>
          <mesh position={[0, 1.15, 0]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 0.42, 12]} />
            <meshStandardMaterial color="#1c1c24" metalness={0.5} roughness={0.5} />
          </mesh>
        </>
      );
    case "sound": // line array hang
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, 0.17 + i * 0.32, 0]} rotation={[0, 0, (i - 1.5) * 0.04]}>
              <boxGeometry args={[0.7, 0.3, 1.3]} />
              <meshStandardMaterial color="#111116" roughness={0.9} />
              <Edges color="#333340" />
            </mesh>
          ))}
          <Case size={[0.72, 0.3, 1.3]} accent={accent} position={[0, 1.3, 0]} glow={glow} />
        </>
      );
    case "desk": // mixing console on a case
      return (
        <>
          <Case size={[1, 0.6, 1.6]} accent={accent} glow={glow} />
          <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0.25]}>
            <boxGeometry args={[0.7, 0.12, 1.5]} />
            <meshStandardMaterial color="#202028" />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[0.02, 0.83, -0.6 + i * 0.17]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.3, 0.02, 0.03]} />
              <meshStandardMaterial color="#000" emissive={i % 3 ? "#2ee6ff" : "#ffb02e"} emissiveIntensity={1.5} />
            </mesh>
          ))}
        </>
      );
    case "fx": // effects case + haze machine
      return (
        <>
          <Case size={[1, 0.7, 1.3]} accent={accent} glow={glow} />
          <mesh position={[0, 0.88, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.9, 12]} />
            <meshStandardMaterial color="#26262e" metalness={0.6} roughness={0.4} />
          </mesh>
        </>
      );
  }
}

const ITEMS: { kind: Kind; accent: string }[] = [
  { kind: "stage", accent: "#ffb02e" },
  { kind: "truss", accent: "#2ee6ff" },
  { kind: "light", accent: "#ff2e88" },
  { kind: "sound", accent: "#2ee6ff" },
  { kind: "desk", accent: "#ffb02e" },
  { kind: "fx", accent: "#ff2e88" },
];

const from = new THREE.Vector3();
const to = new THREE.Vector3();

function Piece({ index, children }: { index: number; children: (glow: React.RefObject<THREE.MeshStandardMaterial[]>) => ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshStandardMaterial[]>([]);
  // staged in a row in front of the truck → slotted from the cab end backwards
  const start: [number, number, number] = [-4.5 + index * 2.1, 0, 4.2];

  useFrame(() => {
    const [a, b] = LOAD.item(index);
    const p = range(scroll.load, a, b);
    const e = smooth(p);
    const g = group.current;
    if (!g) return;
    from.set(...start);
    to.set(5.2 - index * 1.3, 1.2, 0);
    g.position.lerpVectors(from, to, e);
    g.position.y += Math.sin(e * Math.PI) * 1.6; // lifted over the trailer floor
    g.rotation.y = (1 - e) * 0.35 * (index % 2 ? 1 : -1);
    const active = Math.sin(p * Math.PI);
    for (const m of glow.current) m.emissiveIntensity = 0.4 + active * 4;
  });

  return (
    <group ref={group} position={start}>
      {children(glow)}
    </group>
  );
}

export default function Cargo() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <Piece key={item.kind} index={i}>
          {(glow) => <Model kind={item.kind} accent={item.accent} glow={glow} />}
        </Piece>
      ))}
    </>
  );
}
