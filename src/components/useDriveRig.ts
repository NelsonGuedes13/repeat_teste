"use client";

import { useEffect, type RefObject } from "react";
import { useInView } from "motion/react";
import { rig } from "@/lib/scroll";
import type { Rig } from "@/lib/packs";

/** While `ref` is on screen, the 3D stage shows `target` (packs and budget sections take turns). */
export function useDriveRig(ref: RefObject<HTMLElement | null>, target: Rig | null) {
  const inView = useInView(ref, { amount: 0.35 });
  useEffect(() => {
    if (inView) Object.assign(rig, target ?? { heads: 1, sound: 0, truss: 0, led: 0, fx: 0, dj: 0 });
  }, [inView, target]);
}
