"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent } from "motion/react";
import type { Dictionary } from "@/i18n/pt";
import { useSectionProgress } from "@/components/useSectionProgress";
import { TRIP } from "@/lib/scroll";
import { STOPS } from "@/lib/trip";

type Beat =
  | { kind: "depart" }
  | { kind: "intro" }
  | { kind: "travel"; i: number }
  | { kind: "stop"; i: number }
  | { kind: "outro" };

function beatAt(p: number, stops: number): Beat {
  if (p >= TRIP.outro[0]) return { kind: "outro" };
  for (let i = stops - 1; i >= 0; i--) {
    if (p >= TRIP.dwell(i)[0]) return { kind: "stop", i };
    if (p >= TRIP.travel(i)[0]) return { kind: "travel", i };
  }
  return p >= TRIP.toMap[0] ? { kind: "intro" } : { kind: "depart" };
}

const key = (b: Beat) => ("i" in b ? `${b.kind}${b.i}` : b.kind);

export default function TripStory({ t }: { t: Dictionary["trip"] }) {
  const { ref, progress } = useSectionProgress("trip");
  const [beat, setBeat] = useState<Beat>({ kind: "depart" });
  useMotionValueEvent(progress, "change", (p) => {
    const next = beatAt(p, t.stops.length);
    if (key(next) !== key(beat)) setBeat(next);
  });

  return (
    <section ref={ref} className="relative h-[900svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end px-4 pb-10 sm:justify-center sm:px-10 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={key(beat)}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
            className="max-w-xl [text-shadow:0_2px_18px_#000]"
          >
            {beat.kind === "depart" && (
              <p className="max-w-md font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight">{t.depart}</p>
            )}
            {beat.kind === "intro" && (
              <>
                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber">{t.kicker}</p>
                <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-none">{t.title}</h2>
              </>
            )}
            {beat.kind === "travel" && (
              <p className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-ink/80">
                <span className="inline-block h-px w-10 bg-magenta" />
                {t.enRoute} <span className="font-display font-bold text-ink">{t.stops[beat.i].city}</span>
              </p>
            )}
            {beat.kind === "stop" && <StopCard t={t} i={beat.i} />}
            {beat.kind === "outro" && (
              <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-black leading-tight">{t.outro}</h2>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function StopCard({ t, i }: { t: Dictionary["trip"]; i: number }) {
  const stop = t.stops[i];
  const { accent, images } = STOPS[i];
  return (
    <div className="rounded-2xl bg-stage/70 p-5 backdrop-blur-md sm:p-6">
      <p className="mb-3 font-display text-sm font-bold tracking-[0.3em]" style={{ color: accent }}>
        {t.stop} {String(i + 1).padStart(2, "0")} · {stop.city}
      </p>
      <h2 className="font-display text-[clamp(1.8rem,4.5vw,3.25rem)] font-black leading-none">{stop.type}</h2>
      <p className="mt-4 text-base text-ink/85">{stop.text}</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {images.map((src, k) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + k * 0.1 }}
            className="relative aspect-[4/5] overflow-hidden rounded-lg"
          >
            <Image src={src} alt="" fill sizes="(max-width: 640px) 30vw, 180px" className="object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
