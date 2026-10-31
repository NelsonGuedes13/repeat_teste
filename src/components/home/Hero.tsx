"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Dictionary } from "@/i18n/pt";

export default function Hero({ t }: { t: Dictionary["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={ref} className="relative flex min-h-svh items-end px-4 pb-16 sm:px-10 sm:pb-24">
      <motion.div style={{ opacity, y }} className="max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-xs uppercase tracking-[0.35em] text-amber"
        >
          {t.kicker}
        </motion.p>
        <h1 className="font-display text-[clamp(2.4rem,7vw,6.5rem)] font-black leading-[0.95] tracking-tight">
          {t.title.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.4 + i * 0.35 }}
            >
              {line}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 max-w-xl text-base text-mute sm:text-lg"
        >
          {t.lead}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ duration: 2.4, delay: 1.8 }}
          className="mt-14 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-ink/70"
        >
          <span className="inline-block h-8 w-px bg-gradient-to-b from-transparent to-magenta" />
          {t.scroll}
        </motion.p>
      </motion.div>
    </section>
  );
}
