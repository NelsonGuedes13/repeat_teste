"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { Dictionary } from "@/i18n/pt";

const COLORS = ["text-magenta", "text-cyan", "text-amber", "text-ink"];

function Line({ text, i, n, progress }: { text: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = 0.1 + (i / n) * 0.6;
  const opacity = useTransform(progress, [start, start + 0.08], [0.08, 1]);
  const blur = useTransform(progress, [start, start + 0.08], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className={`block ${COLORS[i % COLORS.length]}`}>
      {text}
    </motion.span>
  );
}

/** Sticky sequence: each word "switches on" as the rig behind it lights up. */
export default function LightsCue({ t }: { t: Dictionary["lights"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const caption = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);

  return (
    <section ref={ref} className="relative h-[300svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-4 sm:px-10">
        <p className="font-display text-[clamp(3rem,11vw,10rem)] font-black leading-[0.9] tracking-tight">
          {t.lines.map((line, i) => (
            <Line key={line} text={line} i={i} n={t.lines.length} progress={scrollYProgress} />
          ))}
        </p>
        <motion.p style={{ opacity: caption }} className="mt-10 max-w-md text-base text-ink/85 [text-shadow:0_2px_16px_#000] sm:text-lg">
          {t.caption}
        </motion.p>
      </div>
    </section>
  );
}
