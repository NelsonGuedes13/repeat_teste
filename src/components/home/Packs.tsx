"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import type { Dictionary } from "@/i18n/pt";
import type { Locale } from "@/i18n/config";
import { useSectionProgress } from "@/components/useSectionProgress";
import { useDriveRig } from "@/components/useDriveRig";
import { PACKS, EXTRAS, MAX_DAYS, emptyExtras, estimate, rigFor, type Config, type PackId, type ExtraId } from "@/lib/packs";

/** Read by the contact form (phase 6) to pre-fill the request. */
export const QUOTE_KEY = "repeat:quote";

const ACCENT: Record<PackId, string> = { essencial: "#2ee6ff", pro: "#ff2e88", espetaculo: "#ffb02e" };

function Stepper({ value, max, onChange, labels }: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  labels: { add: string; remove: string; name: string };
}) {
  const btn = "grid h-8 w-8 place-items-center rounded-full border border-ink/20 text-lg leading-none transition hover:border-ink disabled:opacity-30";
  return (
    <div className="flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 0} aria-label={`${labels.remove}: ${labels.name}`}>−</button>
      <span className="w-4 text-center font-display font-bold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${labels.add}: ${labels.name}`}>+</button>
    </div>
  );
}

export default function Packs({ t, lang }: { t: Dictionary["packs"]; lang: Locale }) {
  // 0 as the section's top enters the screen → 1 when it reaches the top: the camera flies back to the stage
  const { ref } = useSectionProgress("packs", ["start end", "start start"]);
  const [config, setConfig] = useState<Config>({ pack: "pro", extras: emptyExtras(), days: 1 });

  const money = useMemo(
    () => new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang],
  );
  const total = estimate(config);
  const spring = useSpring(total, { stiffness: 120, damping: 20 });
  const shown = useTransform(spring, (v) => money.format(Math.round(v)));

  useEffect(() => spring.set(total), [total, spring]);
  useDriveRig(ref, useMemo(() => rigFor(config), [config]));

  const setExtra = (id: ExtraId, v: number) =>
    setConfig((c) => ({ ...c, extras: { ...c.extras, [id]: v } }));

  const request = () => {
    try {
      sessionStorage.setItem(QUOTE_KEY, JSON.stringify({ mode: "pack", ...config, estimate: total }));
    } catch {
      // storage blocked (private mode): the form just starts empty
    }
    document.getElementById("pedido")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="packs" className="relative px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber">{t.kicker}</p>
        <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black leading-none [text-shadow:0_2px_18px_#000]">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-base text-ink/85 sm:text-lg [text-shadow:0_2px_18px_#000]">{t.lead}</p>

        <div role="radiogroup" className="mt-12 grid gap-4 md:grid-cols-3">
          {PACKS.map((p, i) => {
            const item = t.items[p.id];
            const active = config.pack === p.id;
            return (
              <motion.button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setConfig((c) => ({ ...c, pack: p.id }))}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-2xl border p-6 text-left backdrop-blur-md transition-colors ${
                  active ? "border-ink/60 bg-stage/80" : "border-ink/10 bg-stage/55 hover:border-ink/30"
                }`}
                style={active ? { boxShadow: `0 0 0 1px ${ACCENT[p.id]}, 0 20px 60px -20px ${ACCENT[p.id]}` } : undefined}
              >
                {p.id === "pro" && (
                  <span className="absolute right-5 top-5 rounded-full bg-magenta px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-stage">
                    {t.popular}
                  </span>
                )}
                <span className="font-display text-2xl font-black" style={{ color: ACCENT[p.id] }}>{item.name}</span>
                <span className="mt-1 text-sm text-mute">{item.capacity}</span>
                <span className="mt-6 text-xs uppercase tracking-widest text-mute">{t.from}</span>
                <span className="font-display text-3xl font-bold">{money.format(p.price)}</span>
                <ul className="mt-6 space-y-2 text-sm text-ink/85">
                  {item.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-3 shrink-0 rounded-full" style={{ background: ACCENT[p.id] }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 rounded-2xl border border-ink/10 bg-stage/75 p-6 backdrop-blur-md md:grid-cols-[1fr_auto] md:gap-12 md:p-8">
          <div>
            <h3 className="mb-4 font-display text-lg font-bold">{t.extrasTitle}</h3>
            <ul className="divide-y divide-ink/10">
              {EXTRAS.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm sm:text-base">
                    {t.extras[e.id].name}
                    <span className="ml-2 text-mute">+{money.format(e.price)} {t.extras[e.id].unit}</span>
                  </span>
                  <Stepper
                    value={config.extras[e.id]}
                    max={e.max}
                    onChange={(v) => setExtra(e.id, v)}
                    labels={{ add: t.add, remove: t.remove, name: t.extras[e.id].name }}
                  />
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm sm:text-base">{t.days}</span>
                <Stepper
                  value={config.days}
                  max={MAX_DAYS}
                  onChange={(v) => setConfig((c) => ({ ...c, days: Math.max(1, v) }))}
                  labels={{ add: t.add, remove: t.remove, name: t.days }}
                />
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-end md:min-w-72">
            <p className="text-xs uppercase tracking-[0.3em] text-mute">{t.estimate}</p>
            <motion.p className="font-display text-[clamp(2.4rem,5vw,3.5rem)] font-black tabular-nums leading-tight" aria-live="polite">
              {shown}
            </motion.p>
            <p className="mt-2 max-w-xs text-xs text-mute">{t.note}</p>
            <button
              type="button"
              onClick={request}
              className="mt-6 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-stage transition hover:bg-magenta hover:text-ink"
            >
              {t.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
