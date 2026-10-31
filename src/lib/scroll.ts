// Shared mutable scroll state read by the 3D scene every frame (no React re-renders).
// Each value is the 0 → 1 progress of one story section.
export const scroll = {
  lights: 0,
  load: 0,
  trip: 0,
  /** 0 → 1 while the packs section scrolls into view (camera returns to the stage) */
  packs: 0,
};

export type Section = keyof typeof scroll;

/** What the configurator / budget asks the stage to show (whichever section is on screen writes it). */
export const rig = { heads: 4, sound: 2, truss: 0, led: 0, fx: 0, dj: 0 };
/** `rig` eased over time — what the 3D actually draws. */
export const rigLevel = { sound: 0, truss: 0, led: 0, fx: 0, dj: 0 };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
/** 0 → 1 as `v` goes from `a` to `b` */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/** Loading timeline (fractions of the warehouse section). Shared by the 3D cargo and the text overlay. */
export const LOAD = {
  lightsOn: [0, 0.08] as const,
  item: (i: number) => [0.15 + i * 0.115, 0.15 + i * 0.115 + 0.09] as const,
  curtain: [0.86, 0.94] as const,
};

/** Trip timeline (fractions of the road section). */
export const TRIP = {
  door: [0, 0.045] as const,
  drive: [0.04, 0.11] as const,
  toMap: [0.1, 0.17] as const,
  /** stop i: drive to it, then stay while its gallery shows */
  travel: (i: number) => [0.17 + i * 0.19, 0.17 + i * 0.19 + 0.08] as const,
  dwell: (i: number) => [0.17 + i * 0.19 + 0.08, 0.17 + (i + 1) * 0.19] as const,
  outro: [0.93, 1] as const,
};
