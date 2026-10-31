"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform } from "motion/react";
import type { Dictionary } from "@/i18n/pt";
import { useSectionProgress } from "@/components/useSectionProgress";
import { LOAD } from "@/lib/scroll";

const ACCENTS = ["text-amber", "text-cyan", "text-magenta", "text-cyan", "text-amber", "text-magenta"];

/** -1 = intro, 0..5 = cargo item being loaded, 6 = loaded */
function stepAt(p: number, items: number) {
  if (p >= LOAD.curtain[0]) return items;
  let step = -1;
  for (let i = 0; i < items; i++) if (p >= LOAD.item(i)[0] - 0.02) step = i;
  return step;
}

export default function WarehouseStory({ t }: { t: Dictionary["warehouse"] }) {
  const { ref, progress } = useSectionProgress("load");
  const [step, setStep] = useState(-1);
  useMotionValueEvent(progress, "change", (p) => setStep(stepAt(p, t.items.length)));
  // let the camera finish its flight into the warehouse before the text arrives
  const panel = useTransform(progress, [0.04, 0.09], [0, 1]);

  const item = step >= 0 && step < t.items.length ? t.items[step] : null;

  return (
    <section ref={ref} className="relative h-[700svh]">
      <motion.div
        style={{ opacity: panel }}
        className="sticky top-0 flex h-svh flex-col justify-end px-4 pb-10 sm:justify-center sm:px-10 sm:pb-0"
      >
        <div className="max-w-md rounded-2xl bg-stage/60 p-5 backdrop-blur-md sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45 }}
              className="[text-shadow:0_2px_18px_#000]"
            >
              {item ? (
                <>
                  <p className={`mb-3 font-display text-sm font-bold tracking-[0.3em] ${ACCENTS[step]}`}>
                    {String(step + 1).padStart(2, "0")} / {String(t.items.length).padStart(2, "0")}
                  </p>
                  <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-black leading-none">{item.title}</h2>
                  <p className="mt-4 text-base text-ink/85 sm:text-lg">{item.text}</p>
                </>
              ) : step < 0 ? (
                <>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber">{t.kicker}</p>
                  <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-black leading-none">{t.title}</h2>
                  <p className="mt-5 text-base text-ink/85 sm:text-lg">{t.lead}</p>
                </>
              ) : (
                <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-black leading-tight">{t.outro}</h2>
              )}
            </motion.div>
          </AnimatePresence>

          <ol className="mt-8 flex gap-2" aria-hidden>
            {t.items.map((it, i) => (
              <li
                key={it.title}
                className={`h-1 w-8 rounded-full transition-colors duration-500 ${i <= step ? "bg-ink" : "bg-ink/15"}`}
              />
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
