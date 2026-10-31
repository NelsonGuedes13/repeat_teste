"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { scroll, type Section } from "@/lib/scroll";

/** Progress of a sticky section (top hits viewport top → bottom hits viewport bottom), mirrored into the 3D scroll store. */
export function useSectionProgress(section: Section) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scroll[section] = v;
  });
  return { ref, progress: scrollYProgress };
}
