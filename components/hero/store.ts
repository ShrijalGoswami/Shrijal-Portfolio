import { useSyncExternalStore } from 'react';

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

/* ── Opening sequence ──────────────────────────────────────────────────────
   A deterministic, time-driven state machine for the landing intro. Nothing in
   the intro waits for scroll: NameIntro plays the greeting, LivingHero's
   director builds the network on a GSAP timeline, holds it, then resolves the
   identity — and only then releases page scrolling.
   ------------------------------------------------------------------------- */
export type IntroPhase =
  | 'initial'
  | 'hello'
  | 'network-build'
  | 'network-hold'
  | 'hero-transition'
  | 'hero'
  | 'normal';

let phase: IntroPhase = 'initial';
const phaseListeners = new Set<(p: IntroPhase) => void>();

export function getPhase(): IntroPhase {
  return phase;
}

export function setPhase(next: IntroPhase) {
  if (next === phase) return;
  phase = next;
  phaseListeners.forEach((l) => l(next));
}

export function subscribePhase(listener: (p: IntroPhase) => void): () => void {
  phaseListeners.add(listener);
  return () => {
    phaseListeners.delete(listener);
  };
}

/** React binding — re-renders a component when the intro phase changes. */
export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(subscribePhase, getPhase, () => 'initial');
}

// The 3D scene mounts lazily (dynamic import, no SSR). The director waits for
// it before building the network so the first nodes never appear mid-tween —
// bounded by a timeout so a WebGL-less fallback still finishes the sequence.
let sceneReady = false;
const readyListeners = new Set<() => void>();

export function markSceneReady() {
  sceneReady = true;
  readyListeners.forEach((cb) => cb());
  readyListeners.clear();
}

export function whenSceneReady(cb: () => void, timeoutMs = 2500): () => void {
  if (sceneReady) {
    cb();
    return () => {};
  }
  const wrapped = () => {
    clearTimeout(timer);
    cb();
  };
  const timer = setTimeout(() => {
    readyListeners.delete(wrapped);
    cb();
  }, timeoutMs);
  readyListeners.add(wrapped);
  return () => {
    clearTimeout(timer);
    readyListeners.delete(wrapped);
  };
}
