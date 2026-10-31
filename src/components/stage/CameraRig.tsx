"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll, smooth } from "@/lib/scroll";
import { WAREHOUSE_Z } from "./Warehouse";

type Key = { at: number; pos: [number, number, number]; look: [number, number, number] };

const W = WAREHOUSE_Z;
// `at` is the story position: 0→1 = lights cue, 1→2 = warehouse section
const KEYS: Key[] = [
  { at: 0, pos: [0, 1.5, 10], look: [0, 2, -1] },
  { at: 1, pos: [0, 2.1, 6.5], look: [0, 1.6, -1] },
  { at: 1.08, pos: [-9, 7, W + 16], look: [1, 1.5, W] },
  { at: 1.18, pos: [-3, 4.2, W + 12], look: [1.5, 1.8, W] },
  { at: 1.82, pos: [2.5, 3.6, W + 11], look: [2.5, 1.8, W] },
  // pull back so the closed curtain, cab and roller door read together — sets up the departure
  { at: 1.96, pos: [-1, 3.4, W + 13], look: [6, 2, W] },
];

const pos = new THREE.Vector3();
const look = new THREE.Vector3();
const a = new THREE.Vector3();
const b = new THREE.Vector3();
const lookNow = new THREE.Vector3(0, 2, -1);

function sample(story: number) {
  let i = 0;
  while (i < KEYS.length - 2 && story > KEYS[i + 1].at) i++;
  const k0 = KEYS[i];
  const k1 = KEYS[i + 1];
  const t = smooth((story - k0.at) / (k1.at - k0.at));
  pos.lerpVectors(a.set(...k0.pos), b.set(...k1.pos), t);
  look.lerpVectors(a.set(...k0.look), b.set(...k1.look), t);
}

export default function CameraRig() {
  useFrame(({ camera, pointer, size }, delta) => {
    // portrait screens get a wider lens so the same shots still fit
    const cam = camera as THREE.PerspectiveCamera;
    const fov = size.width < size.height ? 62 : 40;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    sample(scroll.load > 0 ? 1 + scroll.load : scroll.lights);
    pos.x += pointer.x * 0.4;
    pos.y += pointer.y * 0.2;
    const k = 1 - Math.exp(-delta * 3);
    camera.position.lerp(pos, k);
    lookNow.lerp(look, k);
    camera.lookAt(lookNow);
  });
  return null;
}
