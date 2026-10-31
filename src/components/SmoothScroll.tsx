"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scroll, prefersReducedMotion } from "@/lib/scroll";

export default function SmoothScroll() {
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress = max > 0 ? window.scrollY / max : 0;
    };

    if (prefersReducedMotion()) {
      window.addEventListener("scroll", update, { passive: true });
      update();
      return () => window.removeEventListener("scroll", update);
    }

    const lenis = new Lenis({ autoRaf: true, lerp: 0.08 });
    lenis.on("scroll", update);
    update();
    return () => lenis.destroy();
  }, []);

  return null;
}
