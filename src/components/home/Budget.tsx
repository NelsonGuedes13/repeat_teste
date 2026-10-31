"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import type { Dictionary } from "@/i18n/pt";
import type { Locale } from "@/i18n/config";
import { useDriveRig } from "@/components/useDriveRig";
import { sendToContact } from "@/lib/quote";
import { BUDGET, EVENT_TYPES, EXTRAS, rigFor, suggest, type EventType } from "@/lib/packs";

const PEOPLE = { min: 20, max: 5000, step: 10 } as const;

export default function Budget({ t, packs, lang }: { t: Dictionary["budget"]; packs: Dictionary["packs"]; lang: Locale }) {
  const ref = useRef<HTMLElement>(null);
  const [budget, setBudget] = useState(5000);
  const [type, setType] = useState<EventType>("concert");
  const [people, setPeople] = useState(300);

  const money = useMemo(
    () => new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang],
  );
  const number = useMemo(() => new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-GB"), [lang]);
  const result = useMemo(() => suggest(budget, people, type), [budget, people, type]);
  useDriveRig(ref, useMemo(() => (result.config ? rigFor(result.config) : null), [result.config]));

  const spring = useSpring(budget, { stiffness: 140, damping: 22 });
  const shown = useTransform(spring, (v) => money.format(Math.round(v / 100) * 100));
  useEffect(() => spring.set(budget), [budget, spring]);

  const lines = result.config
    ? [
        packs.items[result.config.pack].name,
        ...EXTRAS.filter((e) => result.config!.extras[e.id] > 0).map((e) => {
          const n = result.config!.extras[e.id];
          return `${n > 1 ? `${n} × ` : ""}${packs.extras[e.id].name}`;
        }),
      ]
    : [];

  const request = () => sendToContact({ mode: "budget", budget, type, people, ...result.config });

  const fill = ((budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100;

  return (
    <section ref={ref} id="orcamento" className="relative px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,32rem)_1fr]">
        <div className="rounded-2xl border border-ink/10 bg-stage/75 p-6 backdrop-blur-md sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber">{t.kicker}</p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-none">{t.title}</h2>
          <p className="mt-4 text-ink/85">{t.lead}</p>

          <label htmlFor="budget" className="mt-8 block text-xs uppercase tracking-[0.3em] text-mute">{t.amount}</label>
          <motion.output htmlFor="budget" className="block font-display text-[clamp(2.4rem,6vw,3.75rem)] font-black tabular-nums leading-tight">
            {shown}
          </motion.output>
          <input
            id="budget"
            type="range"
            min={BUDGET.min}
            max={BUDGET.max}
            step={BUDGET.step}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="range mt-2 w-full"
            style={{ ["--fill" as string]: `${fill}%` }}
          />

          <fieldset className="mt-8">
            <legend className="mb-3 text-xs uppercase tracking-[0.3em] text-mute">{t.type}</legend>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((et) => (
                <button
                  key={et}
                  type="button"
                  aria-pressed={type === et}
                  onClick={() => setType(et)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    type === et ? "border-magenta bg-magenta text-stage" : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {t.types[et]}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="people" className="mt-8 flex items-baseline justify-between text-xs uppercase tracking-[0.3em] text-mute">
            {t.people}
            <output htmlFor="people" className="font-display text-xl font-bold normal-case tracking-normal text-ink tabular-nums">
              {number.format(people)}
            </output>
          </label>
          <input
            id="people"
            type="range"
            min={PEOPLE.min}
            max={PEOPLE.max}
            step={PEOPLE.step}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="range mt-3 w-full"
            style={{ ["--fill" as string]: `${((people - PEOPLE.min) / (PEOPLE.max - PEOPLE.min)) * 100}%` }}
          />
        </div>

        {/* result floats over the stage, which builds up behind it */}
        <div className="flex flex-col justify-end lg:pb-4">
          <div className="rounded-2xl border border-ink/10 bg-stage/60 p-6 backdrop-blur-md lg:max-w-md lg:self-end" aria-live="polite">
            {result.config ? (
              <>
                <p className="text-xs uppercase tracking-[0.3em] text-mute">{t.fits}</p>
                <ul className="mt-3 space-y-1.5">
                  <AnimatePresence initial={false}>
                    {lines.map((line, i) => (
                      <motion.li
                        key={line}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={i === 0 ? "font-display text-2xl font-black" : "text-ink/85"}
                      >
                        {i === 0 ? line : `+ ${line}`}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <p className="mt-4 text-sm text-mute">
                  {t.left}: <span className="text-ink tabular-nums">{money.format(result.left)}</span>
                </p>
              </>
            ) : (
              <p className="text-ink/85">{t.below}</p>
            )}
            {result.short > 0 && result.config && (
              <p className="mt-4 rounded-lg bg-amber/10 p-3 text-sm text-amber">
                {t.short
                  .replace("{people}", number.format(people))
                  .replace("{pack}", packs.items[result.needed].name)
                  .replace("{amount}", money.format(result.short))}
              </p>
            )}
            <button
              type="button"
              onClick={request}
              className="mt-6 w-full rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-stage transition hover:bg-magenta hover:text-ink"
            >
              {t.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
