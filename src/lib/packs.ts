// Service packs and extras. Prices are PLACEHOLDERS (EUR, VAT excluded) until the company confirms them.

export const PACKS = [
  { id: "essencial", price: 1200, heads: 2 },
  { id: "pro", price: 3500, heads: 4 },
  { id: "espetaculo", price: 8000, heads: 6 },
] as const;

export type PackId = (typeof PACKS)[number]["id"];

export const EXTRAS = [
  { id: "led", price: 900, max: 1 },
  { id: "heads", price: 250, max: 4, heads: 1 }, // per extra moving head
  { id: "dj", price: 300, max: 1 },
  { id: "fx", price: 350, max: 1 },
  { id: "tech", price: 200, max: 3 }, // per extra technician per day
] as const;

export type ExtraId = (typeof EXTRAS)[number]["id"];
export type Config = { pack: PackId; extras: Record<ExtraId, number>; days: number };

export const MAX_DAYS = 5;
/** Each extra day costs this share of a full day (rig stays built, crew stays on). */
const EXTRA_DAY = 0.6;

export const emptyExtras = (): Record<ExtraId, number> =>
  Object.fromEntries(EXTRAS.map((e) => [e.id, 0])) as Record<ExtraId, number>;

export function estimate({ pack, extras, days }: Config) {
  const base = PACKS.find((p) => p.id === pack)!.price;
  const add = EXTRAS.reduce((sum, e) => sum + e.price * Math.min(extras[e.id] ?? 0, e.max), 0);
  const d = Math.min(Math.max(Math.round(days), 1), MAX_DAYS);
  return Math.round((base + add) * (1 + EXTRA_DAY * (d - 1)));
}

/** Moving heads lit on the 3D stage for a config (the rig has 6). */
export const headsFor = ({ pack, extras }: Config) =>
  Math.min(6, PACKS.find((p) => p.id === pack)!.heads + (extras.heads ?? 0));
