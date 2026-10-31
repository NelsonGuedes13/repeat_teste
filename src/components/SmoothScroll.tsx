"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion, scrollToEl } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.08 });
    const native = scrollToEl.run;
    scrollToEl.run = (el) => lenis.scrollTo(el, { duration: 2.2 });
    return () => {
      scrollToEl.run = native;
      lenis.destroy();
    };
  }, []);

  return null;
}
