// The choice the visitor made (a pack or a budget), handed from those sections to the contact form.
import type { Config, EventType } from "./packs";
import { scrollToEl } from "./scroll";

export type Quote =
  | ({ mode: "pack"; estimate: number } & Config)
  | ({ mode: "budget"; budget: number; type: EventType; people: number } & Partial<Config>);

const KEY = "repeat:quote";
const EVENT = "repeat:quote";

/** Save the choice, tell the contact form, and scroll to it. */
export function sendToContact(quote: Quote) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(quote));
  } catch {
    // storage blocked (private mode): the event below still carries it for this visit
  }
  window.dispatchEvent(new CustomEvent<Quote>(EVENT, { detail: quote }));
  const form = document.getElementById("pedido");
  if (form) scrollToEl.run(form);
}

export function readQuote(): Quote | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Quote) : null;
  } catch {
    return null;
  }
}

export function onQuote(cb: (q: Quote) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Quote>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
