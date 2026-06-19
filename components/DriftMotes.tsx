'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Drifting sample points — a sparse scatter-plot quietly settling across the
 * whole viewport. A fixed, pointer-transparent layer behind the content. Reads
 * computational (rings, plus-marks, dots, diamonds), not floral, and stays
 * deliberately faint so it's atmosphere, not decoration. Distinct from the
 * connected node web in AmbientField — these marks are unconnected samples.
 *
 * Seeded with a fixed PRNG so server and client render identically (no
 * hydration mismatch); each mote starts with a negative animation-delay so on
 * load they're already spread top-to-bottom rather than all dropping from the
 * top edge.
 */

// Blueprint palette — graphite ink, indigo signal, slate. Quiet, cool, technical.
const COLORS = ['#20262b', '#2c3b8e', '#6f7890', '#2c3b8e', '#3a4154'];
const COUNT = 20;

// mulberry32 — tiny deterministic PRNG so motes are stable across SSR/CSR.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Four sample-mark glyphs — each drawn in a 16×16 box so sizes stay consistent.
function Mark({ kind, color, s, opacity }: { kind: number; color: string; s: number; opacity: number }) {
  const common = { width: s, height: s, viewBox: '0 0 16 16', fill: 'none', style: { opacity } } as const;
  switch (kind) {
    case 0: // hollow ring
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="5.2" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 1: // plus / crosshair
      return (
        <svg {...common}>
          <path d="M8 1.5 V14.5 M1.5 8 H14.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 2: // diamond outline
      return (
        <svg {...common}>
          <path d="M8 2 L14 8 L8 14 L2 8 Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    default: // filled dot
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" fill={color} />
        </svg>
      );
  }
}

export default function DriftMotes() {
  const reduce = useReducedMotion();

  const motes = useMemo(() => {
    const rnd = mulberry32(0x5f3a17);
    return Array.from({ length: COUNT }, () => {
      const fallDur = 30 + rnd() * 26; // 30–56s top-to-bottom — very slow
      const driftDur = 6 + rnd() * 5; // 6–11s lateral sway
      const size = 7 + rnd() * 7; // 7–14px
      return {
        left: rnd() * 100, // %
        fallDur,
        fallDelay: -rnd() * fallDur, // negative → already mid-fall on load
        driftDur,
        driftDelay: -rnd() * driftDur,
        size,
        kind: Math.floor(rnd() * 4),
        color: COLORS[Math.floor(rnd() * COLORS.length)],
        opacity: 0.1 + rnd() * 0.16, // 0.10–0.26 — felt, not seen
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
      {motes.map((m, i) => (
        <span
          key={i}
          className="mote-fall"
          style={{
            left: `${m.left}%`,
            animationDuration: `${m.fallDur}s`,
            animationDelay: `${m.fallDelay}s`,
          }}
        >
          <span
            className="mote-drift block"
            style={{ animationDuration: `${m.driftDur}s`, animationDelay: `${m.driftDelay}s` }}
          >
            <Mark kind={m.kind} color={m.color} s={m.size} opacity={m.opacity} />
          </span>
        </span>
      ))}
    </div>
  );
}
