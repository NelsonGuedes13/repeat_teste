// Shared mutable scroll state read by the 3D scene every frame (no React re-renders).
export const scroll = {
  /** 0 → 1 across the whole page */
  progress: 0,
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
