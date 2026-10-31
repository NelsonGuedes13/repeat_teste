// Shared mutable scroll state read by the 3D scene every frame (no React re-renders).
// Each value is the 0 → 1 progress of one story section.
export const scroll = {
  lights: 0,
  load: 0,
};

export type Section = keyof typeof scroll;

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
