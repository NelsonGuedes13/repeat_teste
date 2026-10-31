"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import type { Dictionary } from "@/i18n/pt";
import { CONTACT, type Locale } from "@/i18n/config";
import { EXTRAS, PACKS } from "@/lib/packs";
import { onQuote, readQuote, type Quote } from "@/lib/quote";
import { buildRequestMail } from "@/lib/mail";

type T = Pick<Dictionary, "contact" | "packs" | "budget">;

/** Plain-text summary of the visitor's choice, one line per fact (used on screen and in the email). */
function describe(q: Quote, t: T, money: Intl.NumberFormat): string[] {
  const m = t.contact.mail;
  const extras = (e: Quote["extras"]) =>
    EXTRAS.filter((x) => (e?.[x.id] ?? 0) > 0)
      .map((x) => `${e![x.id] > 1 ? `${e![x.id]} × ` : ""}${t.packs.extras[x.id].name}`)
      .join(", ");
  if (q.mode === "pack") {
    return [
      `${m.pack}: ${t.packs.items[q.pack].name} (${t.packs.from} ${money.format(PACKS.find((p) => p.id === q.pack)!.price)})`,
      `${m.extras}: ${extras(q.extras) || m.notSet}`,
      `${m.days}: ${q.days}`,
      `${m.estimate}: ${money.format(q.estimate)}`,
    ];
  }
  const lines = [`${m.budget}: ${money.format(q.budget)}`, `${m.type}: ${t.budget.types[q.type]}`];
  if (q.pack) lines.push(`${m.suggestion}: ${[t.packs.items[q.pack].name, extras(q.extras)].filter(Boolean).join(" + ")}`);
  return lines;
}

export default function Contact({ t, lang }: { t: T; lang: Locale }) {
  const c = t.contact;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [people, setPeople] = useState("");

  const money = useMemo(
    () => new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang],
  );

  useEffect(() => {
    const apply = (q: Quote | null) => {
      setQuote(q);
      if (q?.mode === "budget") setPeople(String(q.people));
    };
    apply(readQuote()); // a choice made before a reload
    return onQuote(apply);
  }, []);

  const summary = quote ? describe(quote, t, money) : [];

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const field = (k: string) => String(f.get(k) ?? "");
    const mail = buildRequestMail(
      CONTACT.email,
      { name: field("name"), date: field("date"), place: field("place"), people: field("people"), message: field("message") },
      summary,
      c,
    );
    window.location.assign(mail.href);
    setSent(mail.text);
    setCopied(false);
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent);
      setCopied(true);
    } catch {
      // clipboard blocked: the visitor can still select the address and write by hand
    }
  };

  const input =
    "mt-1.5 w-full rounded-xl border border-ink/15 bg-stage/60 px-4 py-3 text-ink placeholder:text-mute/70 outline-none transition focus:border-cyan";
  const label = "block text-xs uppercase tracking-[0.25em] text-mute";

  return (
    <section id="pedido" className="relative px-4 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_22rem]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-ink/10 bg-stage/80 p-6 backdrop-blur-md sm:p-8"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-amber">{c.kicker}</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-black leading-none">{c.title}</h2>
          <p className="mt-4 max-w-2xl text-ink/85">{c.lead}</p>

          <div className="mt-8 rounded-xl border border-ink/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-mute">{c.choice}</p>
              {quote && (
                <button type="button" onClick={() => setQuote(null)} className="text-xs text-mute underline-offset-4 hover:text-ink hover:underline">
                  {c.clear}
                </button>
              )}
            </div>
            {quote ? (
              <ul className="mt-2 space-y-1 text-sm">
                {summary.map((line) => <li key={line}>{line}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink/70">{c.none}</p>
            )}
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={label}>
              {c.fields.name} *
              <input name="name" required maxLength={80} autoComplete="name" className={input} />
            </label>
            <label className={label}>
              {c.fields.date}
              <input name="date" type="date" className={input} />
            </label>
            <label className={label}>
              {c.fields.place}
              <input name="place" maxLength={120} className={input} />
            </label>
            <label className={label}>
              {c.fields.people}
              <input name="people" type="number" min={1} max={100000} value={people} onChange={(e) => setPeople(e.target.value)} className={input} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              {c.fields.message}
              <textarea name="message" rows={4} maxLength={1500} placeholder={c.fields.messageHint} className={`${input} resize-y normal-case tracking-normal`} />
            </label>
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-stage transition hover:bg-magenta hover:text-ink sm:col-span-2 sm:justify-self-start"
            >
              {c.send}
            </button>
          </form>

          {sent && (
            <div className="mt-6 rounded-xl bg-cyan/10 p-4 text-sm text-ink/90" role="status">
              {c.sent} <a href={`mailto:${CONTACT.email}`} className="font-bold text-cyan underline-offset-4 hover:underline">{CONTACT.email}</a>.
              <button type="button" onClick={copy} className="ml-3 rounded-full border border-ink/25 px-3 py-1 text-xs hover:border-ink">
                {copied ? c.copied : c.copy}
              </button>
            </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col gap-3 self-end"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-mute [text-shadow:0_2px_12px_#000]">{c.or}</p>
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
            className="group rounded-2xl border border-ink/10 bg-stage/75 p-5 backdrop-blur-md transition hover:border-amber"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-amber">{c.call}</span>
            <span className="mt-1 block font-display text-2xl font-bold">{CONTACT.phone}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(c.mail.subject)}`}
            className="group rounded-2xl border border-ink/10 bg-stage/75 p-5 backdrop-blur-md transition hover:border-cyan"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-cyan">{c.write}</span>
            <span className="mt-1 block break-all font-display text-lg font-bold">{CONTACT.email}</span>
          </a>
        </motion.aside>
      </div>
    </section>
  );
}
