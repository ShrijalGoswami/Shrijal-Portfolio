'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Spring blossom — soft petals drifting down across the whole viewport. A fixed,
 * pointer-transparent layer behind the content. Petals are seeded with a fixed
 * PRNG so server and client render identically (no hydration mismatch), and each
 * starts with a negative animation-delay so on load they're already spread top-to-
 * bottom rather than all raining from the top edge.
 */

// Blush spring palette
const COLORS = ['#f6bcc9', '#f1a7bd', '#f8d2db', '#eeb0c4', '#ffd6df', '#f4c4d0'];
const COUNT = 26;

// mulberry32 — tiny deterministic PRNG so petals are stable across SSR/CSR.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A single cherry-blossom petal — pointed at the stem, gently notched at the tip.
function Petal({ color, w, h, opacity }: { color: string; w: number; h: number; opacity: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 20 24" fill="none" style={{ opacity }}>
      <path
        d="M10 1.5 C 3.5 6, 2.8 14, 7.5 21 C 8.4 22.4, 9 23, 10 22.2 C 11 23, 11.6 22.4, 12.5 21 C 17.2 14, 16.5 6, 10 1.5 Z"
        fill={color}
      />
      {/* soft highlight down the spine */}
      <path
        d="M10 3 C 7 7, 6.8 13, 9 19"
        stroke="#fff"
        strokeOpacity="0.35"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BlossomPetals() {
  const reduce = useReducedMotion();

  const petals = useMemo(() => {
    const rnd = mulberry32(0x5f3a17);
    return Array.from({ length: COUNT }, () => {
      const fallDur = 13 + rnd() * 13; // 13–26s top-to-bottom
      const swayDur = 2.6 + rnd() * 2.6; // 2.6–5.2s flutter
      const scale = 0.55 + rnd() * 0.95;
      return {
        left: rnd() * 100, // %
        fallDur,
        fallDelay: -rnd() * fallDur, // negative → already mid-fall on load
        swayDur,
        swayDelay: -rnd() * swayDur,
        w: 13 * scale,
        h: 16 * scale,
        color: COLORS[Math.floor(rnd() * COLORS.length)],
        opacity: 0.4 + rnd() * 0.45,
      };
    });
  }, []);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal-fall"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.fallDur}s`,
            animationDelay: `${p.fallDelay}s`,
          }}
        >
          <span
            className="petal-sway block"
            style={{ animationDuration: `${p.swayDur}s`, animationDelay: `${p.swayDelay}s` }}
          >
            <Petal color={p.color} w={p.w} h={p.h} opacity={p.opacity} />
          </span>
        </span>
      ))}
    </div>
  );
}
