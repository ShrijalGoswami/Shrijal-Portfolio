// A tiny mutable store shared between the scroll/pointer layer (GSAP + DOM events)
// and the R3F render loop. Written outside React on purpose: the scene reads these
// every frame via useFrame, so we never want them to trigger re-renders.

export interface HeroState {
  /** Raw scroll progress 0..1 from GSAP ScrollTrigger. */
  target: number;
  /** Smoothed progress the scene actually animates toward. */
  progress: number;
  /** Smoothed pointer in NDC space (-1..1), used for parallax + magnetism. */
  pointerX: number;
  pointerY: number;
  /** Raw pointer target (set on pointermove). */
  rawX: number;
  rawY: number;
  /** False on coarse/touch pointers — disables magnetism & hover. */
  hasPointer: boolean;
  /** Currently hovered node id, or null. */
  hovered: string | null;
  /** Honour prefers-reduced-motion: skip idle motion, reveal everything. */
  reduced: boolean;
}

export const hero: HeroState = {
  target: 0,
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  rawX: 0,
  rawY: 0,
  hasPointer: false,
  hovered: null,
  reduced: false,
};

/** Smoothstep with explicit edges; clamps outside [edge0, edge1]. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
