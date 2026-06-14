'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// ─── node tiers ─────────────────────────────────────────────────────────────
// Three size classes produce visual depth through parallax-like speed separation.
// Fine = many · small · fast · faint.  Large = few · slow · prominent.
interface TierDef {
  nFine: number; nCoarse: number;
  rMin: number;  rMax: number;
  spdMul: number;           // multiplied against BASE_SPD
  baseAlpha: number;        // base fill opacity
  flowStr: number;          // flow-field force strength
}

const TIERS: TierDef[] = [
  { nFine: 54, nCoarse: 30, rMin: 0.7, rMax: 2.0, spdMul: 1.5, baseAlpha: 0.14, flowStr: 0.032 },
  { nFine: 28, nCoarse: 15, rMin: 2.2, rMax: 3.9, spdMul: 0.9, baseAlpha: 0.21, flowStr: 0.022 },
  { nFine: 12, nCoarse:  6, rMin: 4.2, rMax: 6.6, spdMul: 0.4, baseAlpha: 0.28, flowStr: 0.016 },
];
// Total: 94 desktop · 51 mobile

// ─── physics ─────────────────────────────────────────────────────────────────
const BASE_SPD   = 1.20;   // px/frame at 60fps — 2.2× prior; drives visible ambient drift
const DAMP       = 0.976;  // less aggressive kill; sustains flow-field velocity
const CURSOR_D   = 180;    // perturbation zone radius (px)
const CURSOR_F   = 0.022;  // perturbation force — noticeable but not magnetic
const SPRING_K   = 0.0006; // return-to-origin spring — 4× softer; flow field dominates

// ─── visuals ─────────────────────────────────────────────────────────────────
const CONNECT_D  = 212;    // standard connection threshold (px)
const CURSOR_CD  = 220;    // extended connection range for active nodes
const ACTIVE_THR = 0.18;   // minimum active level to join the cursor web
const LINE_A     = 0.11;   // standard line max alpha
const LINE_A_ACT = 0.13;   // cursor-zone extended line max alpha (subtler)
const ACT_BOOST  = 1.5;    // opacity multiplier at full activation (was 2.8)

const INK = '#2b1a12';    // site's warm ink colour

// ─── particle ────────────────────────────────────────────────────────────────
interface Pt {
  x: number; y: number;
  ox: number; oy: number; // home position — spring pulls back here
  vx: number; vy: number;
  r: number;
  maxSpd: number;    // pre-computed speed cap (tier-specific)
  baseAlpha: number; // tier's base opacity
  flowStr: number;   // tier's flow-field coefficient
  w: number;         // per-node weight [0.6–1.0]
  phase: number;
  active: number;    // cursor proximity [0–1]
}

// ─── build ───────────────────────────────────────────────────────────────────
function build(W: number, H: number, fine: boolean): Pt[] {
  const pts: Pt[] = [];
  for (const tier of TIERS) {
    const n   = fine ? tier.nFine : tier.nCoarse;
    const spd = BASE_SPD * tier.spdMul;
    for (let i = 0; i < n; i++) {
      const ox = Math.random() * W;
      const oy = Math.random() * H;
      pts.push({
        x:         ox,
        y:         oy,
        ox,
        oy,
        vx:        (Math.random() - 0.5) * spd,
        vy:        (Math.random() - 0.5) * spd,
        r:         tier.rMin + Math.random() * (tier.rMax - tier.rMin),
        maxSpd:    spd * 2.5,
        baseAlpha: tier.baseAlpha,
        flowStr:   tier.flowStr,
        w:         0.6 + Math.random() * 0.4,
        phase:     Math.random() * Math.PI * 2,
        active:    0,
      });
    }
  }
  return pts;
}

// ─── component ───────────────────────────────────────────────────────────────
export default function AmbientField() {
  const ref    = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isFinePt = window.matchMedia('(pointer: fine)').matches;
    let W = 0, H = 0;
    let pts: Pt[] = [];
    let cx = -9999, cy = -9999;
    let raf = 0, prevTs = 0;

    // ── canvas sizing ──────────────────────────────────────────────────────
    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
    };

    applySize();
    pts = build(W, H, isFinePt);

    const onResize  = () => applySize();
    const onPointer = (e: PointerEvent) => { if (isFinePt) { cx = e.clientX; cy = e.clientY; } };
    const onLeave   = () => { cx = -9999; cy = -9999; };

    window.addEventListener('resize',       onResize,  { passive: true });
    window.addEventListener('pointermove',  onPointer, { passive: true });
    window.addEventListener('pointerleave', onLeave,   { passive: true });

    // ── frame loop ────────────────────────────────────────────────────────
    const tick = (ts: number) => {
      raf = requestAnimationFrame(tick);
      const dt = prevTs ? Math.min((ts - prevTs) / 16.667, 2.5) : 1;
      prevTs = ts;

      ctx.clearRect(0, 0, W, H);

      // ── physics ─────────────────────────────────────────────────────────
      for (const p of pts) {
        // Flow field — coherent lane-like drift, evolving slowly via phase.
        // Each tier has its own flowStr so fine particles stream more visibly
        // than the slow large anchor nodes.
        const flow  = (p.x / W - 0.5) * Math.PI * 1.8
                    + (p.y / H - 0.5) * Math.PI * 0.9
                    + p.phase * 0.17;
        p.vx += Math.cos(flow) * p.flowStr * dt;
        p.vy += Math.sin(flow) * p.flowStr * dt;

        // Return-to-origin spring — keeps distribution uniform over time
        p.vx += (p.ox - p.x) * SPRING_K * dt;
        p.vy += (p.oy - p.y) * SPRING_K * dt;

        // Cursor perturbation — radial push + tangential swirl so particles
        // bend around the cursor rather than shooting straight out.
        if (isFinePt) {
          const dxC = p.x - cx; // outward from cursor
          const dyC = p.y - cy;
          const dC2 = dxC * dxC + dyC * dyC;

          if (dC2 < CURSOR_D * CURSOR_D && dC2 > 1) {
            const dC  = Math.sqrt(dC2);
            const s   = (1 - dC / CURSOR_D) ** 2;
            const rad = s * CURSOR_F * dt;
            const tan = rad * 0.45; // clockwise swirl — particles curve around cursor
            p.vx += (dxC / dC) * rad + (dyC / dC) * tan;
            p.vy += (dyC / dC) * rad - (dxC / dC) * tan;
            const target = (1 - dC / CURSOR_D) ** 1.4;
            p.active += (target - p.active) * 0.11 * dt;
          } else {
            p.active += (0 - p.active) * 0.025 * dt;
          }
        }

        p.vx *= DAMP;
        p.vy *= DAMP;

        const spd2 = p.vx * p.vx + p.vy * p.vy;
        if (spd2 > p.maxSpd * p.maxSpd) {
          const sc = p.maxSpd / Math.sqrt(spd2);
          p.vx *= sc;
          p.vy *= sc;
        }

        p.x     += p.vx * dt;
        p.y     += p.vy * dt;
        p.phase += 0.014 * dt;

        // Torus wrap
        if      (p.x < -32)    p.x = W + 32;
        else if (p.x > W + 32) p.x = -32;
        if      (p.y < -32)    p.y = H + 32;
        else if (p.y > H + 32) p.y = -32;
      }

      // ── pass 1: standard field connections ──────────────────────────────
      // Always present at base opacity; boosted when near cursor.
      ctx.strokeStyle = INK;
      ctx.lineWidth   = 0.65;
      const cd2  = CONNECT_D * CONNECT_D;
      const ccd2 = CURSOR_CD * CURSOR_CD;

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - pts[i].x;
          const dy = pts[j].y - pts[i].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > cd2) continue;

          const t   = 1 - Math.sqrt(d2) / CONNECT_D;
          const avg = (pts[i].active + pts[j].active) * 0.5;
          const boost = 1 + avg * (ACT_BOOST - 1);
          ctx.globalAlpha = t * t * t * LINE_A * 1.9 * boost;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }

      // ── pass 2: cursor-activated extended connections ────────────────────
      // Only drawn between pairs where both nodes have crossed ACTIVE_THR.
      // These emerge in the extended range (beyond CONNECT_D) creating a
      // temporary web that materialises exactly where the cursor is present.
      ctx.lineWidth = 0.85;

      for (let i = 0; i < pts.length; i++) {
        if (pts[i].active < ACTIVE_THR) continue;
        for (let j = i + 1; j < pts.length; j++) {
          if (pts[j].active < ACTIVE_THR) continue;
          const dx = pts[j].x - pts[i].x;
          const dy = pts[j].y - pts[i].y;
          const d2 = dx * dx + dy * dy;
          if (d2 <= cd2 || d2 > ccd2) continue; // only the extended zone

          const d   = Math.sqrt(d2);
          const t   = 1 - d / CURSOR_CD;
          const avg = (pts[i].active + pts[j].active) * 0.5;
          ctx.globalAlpha = t * t * avg * LINE_A_ACT;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }

      // ── nodes ────────────────────────────────────────────────────────────
      ctx.fillStyle = INK;
      for (const p of pts) {
        // Large nodes pulse more expressively when activated.
        const pulseAmp = 0.11 + p.active * 0.20;
        const pulse    = 1 + Math.sin(p.phase) * pulseAmp;
        const boost    = 1 + p.active * (ACT_BOOST * 0.72 - 1);
        ctx.globalAlpha = Math.min(p.w * p.baseAlpha * boost, 0.54);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',       onResize);
      window.removeEventListener('pointermove',  onPointer);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
