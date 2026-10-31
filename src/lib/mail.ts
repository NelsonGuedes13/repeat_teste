// Builds the pre-filled email for a quote request (opened with mailto: — no server, no stored data).
import type { Dictionary } from "../i18n/pt";

export type RequestFields = { name: string; date: string; place: string; people: string; message: string };

export function buildRequestMail(to: string, f: RequestFields, summary: string[], c: Dictionary["contact"]) {
  const v = (s: string) => s.trim() || c.mail.notSet;
  const rows = [
    `${c.fields.name}: ${f.name.trim()}`,
    `${c.fields.date}: ${v(f.date)}`,
    `${c.fields.place}: ${v(f.place)}`,
    `${c.fields.people}: ${v(f.people)}`,
    ...summary,
  ];
  const message = f.message.trim();
  const subject = `${c.mail.subject} — ${f.name.trim()}`;
  const body = [c.mail.greeting, "", ...rows, ...(message ? ["", message] : []), "", c.mail.thanks, f.name.trim()].join("\n");
  return {
    href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `${subject}\n\n${body}`,
  };
}
