"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scroll, smooth, range, TRIP } from "@/lib/scroll";
import { WAREHOUSE_Z } from "./Warehouse";
import { tripCam } from "./PortugalMap";

type Key = { at: number; pos: [number, number, number]; look: [number, number, number] };

const W = WAREHOUSE_Z;
// `at` is the story position: 0→1 lights cue, 1→2 warehouse, 2→3 road
const KEYS: Key[] = [
  { at: 0, pos: [0, 1.5, 10], look: [0, 2, -1] },
  { at: 1, pos: [0, 2.1, 6.5], look: [0, 1.6, -1] },
  { at: 1.08, pos: [-9, 7, W + 16], look: [1, 1.5, W] },
  { at: 1.18, pos: [-3, 4.2, W + 12], look: [1.5, 1.8, W] },
  { at: 1.82, pos: [2.5, 3.6, W + 11], look: [2.5, 1.8, W] },
  // pull back so the closed curtain, cab and roller door read together — sets up the departure
  { at: 1.96, pos: [-1, 3.4, W + 13], look: [6, 2, W] },
  { at: 2.04, pos: [4, 3, W + 13], look: [13, 2, W] },
  // swing round the outside of the wall (it ends at z = W + 10) and chase the truck
  { at: 2.08, pos: [17, 3.5, W + 11], look: [24, 1.5, W] },
  { at: 2.11, pos: [26, 4.5, W + 11], look: [40, 1.5, W] },
];

const STAGE_POS = new THREE.Vector3(0, 2.6, 9);
const STAGE_LOOK = new THREE.Vector3(0, 2.4, -1);

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
  useFrame(({ camera, pointer, size, scene }, delta) => {
    // portrait screens get a wider lens so the same shots still fit
    const cam = camera as THREE.PerspectiveCamera;
    const fov = size.width < size.height ? 62 : 40;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    sample(scroll.trip > 0 ? 2 + scroll.trip : scroll.load > 0 ? 1 + scroll.load : scroll.lights);

    // the map is seen from high up: hand over to the trip camera and push the fog back
    const back = smooth(scroll.packs);
    const onMap = smooth(range(scroll.trip, TRIP.toMap[0], TRIP.toMap[1])) * (1 - back);
    if (onMap > 0) {
      pos.lerp(tripCam.pos, onMap);
      look.lerp(tripCam.look, onMap);
    }
    // packs: back to the stage from the start — "this is your event"
    if (back > 0) {
      pos.lerp(STAGE_POS, back);
      look.lerp(STAGE_LOOK, back);
    }
    const fog = scene.fog as THREE.Fog;
    fog.far = 34 + onMap * 70;
    fog.near = 9 + onMap * 20;

    pos.x += pointer.x * 0.4;
    pos.y += pointer.y * 0.2;
    const k = 1 - Math.exp(-delta * 3);
    camera.position.lerp(pos, k);
    lookNow.lerp(look, k);
    camera.lookAt(lookNow);
  });
  return null;
}
