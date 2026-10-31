// Service packs and extras. Prices are PLACEHOLDERS (EUR, VAT excluded) until the company confirms them.

export const PACKS = [
  { id: "essencial", price: 1200, heads: 2, capacity: 150 },
  { id: "pro", price: 3500, heads: 4, capacity: 800 },
  { id: "espetaculo", price: 8000, heads: 6, capacity: 5000 },
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

/** Everything the 3D stage shows for a config. */
export function rigFor(config: Config) {
  const big = config.pack === "espetaculo";
  return {
    heads: headsFor(config),
    sound: config.pack === "essencial" ? 1 : 2, // 1 = ground stacks, 2 = flown line array
    truss: big ? 1 : 0,
    led: big || config.extras.led ? 1 : 0,
    fx: big || config.extras.fx ? 1 : 0,
    dj: config.extras.dj ? 1 : 0,
  };
}
export type Rig = ReturnType<typeof rigFor>;

export const EVENT_TYPES = ["concert", "conference", "festival", "private", "corporate"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

/** Which extras matter most for each kind of event — spent first when there's budget left. */
const PRIORITY: Record<EventType, ExtraId[]> = {
  concert: ["heads", "fx", "led", "tech", "dj"],
  conference: ["led", "tech"],
  festival: ["heads", "led", "fx", "tech", "dj"],
  private: ["dj", "heads", "fx", "led"],
  corporate: ["led", "heads", "tech", "dj"],
};

export const BUDGET = { min: 500, max: 20000, step: 100 } as const;

/**
 * What a budget buys: the biggest affordable pack, then extras in the event's priority order (one unit at a time,
 * round-robin) while money is left. `short` > 0 means the crowd needs a bigger pack than the budget covers.
 */
export function suggest(budget: number, people: number, type: EventType) {
  const affordable = [...PACKS].reverse().find((p) => p.price <= budget);
  const needed = PACKS.find((p) => p.capacity >= people) ?? PACKS[PACKS.length - 1];
  if (!affordable) return { config: null, left: budget, short: PACKS[0].price - budget, needed: needed.id };

  const extras = emptyExtras();
  let left = budget - affordable.price;
  for (let added = true; added; ) {
    added = false;
    for (const id of PRIORITY[type]) {
      const e = EXTRAS.find((x) => x.id === id)!;
      if (extras[id] < e.max && e.price <= left) {
        extras[id]++;
        left -= e.price;
        added = true;
      }
    }
  }
  const config: Config = { pack: affordable.id, extras, days: 1 };
  const short = needed.price > affordable.price ? needed.price - budget : 0;
  return { config, left, short, needed: needed.id };
}
