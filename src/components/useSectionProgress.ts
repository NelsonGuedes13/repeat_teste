"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll, type UseScrollOptions } from "motion/react";
import { scroll, type Section } from "@/lib/scroll";

/**
 * Progress of a section, mirrored into the 3D scroll store.
 * Default range suits sticky sections: top hits viewport top → bottom hits viewport bottom.
 */
export function useSectionProgress(
  section: Section,
  offset: UseScrollOptions["offset"] = ["start start", "end end"],
) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scroll[section] = v;
  });
  return { ref, progress: scrollYProgress };
}
