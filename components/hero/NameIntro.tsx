'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import { getLenis } from '../lenis-bridge';

/**
 * The opening moment: the name is the first thing on screen. It rises out of a
 * clip mask, the tracking settles, the blur clears — then the whole word collapses
 * toward the center of the viewport (where the 3D core node lives) while thin indigo
 * connectors radiate outward, seeding the Living Knowledge System behind it.
 *
 * No loading-screen feel, no typewriter — pure typographic motion that hands off
 * to the network.
 */

const [FIRST, ...REST] = resume.name.split(' ');
const LAST = REST.join(' ');

// Directions the seed-connectors fire toward — matched to the network's four clusters
// (research ↖, projects ↗, experience ↘, achievements ↙).
const SEEDS = [
  { x: 26, y: 28 },
  { x: 74, y: 28 },
  { x: 76, y: 74 },
  { x: 24, y: 74 },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN: [number, number, number, number] = [0.7, 0, 0.84, 0];

export default function NameIntro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShow(false);
      return;
    }

    const root = document.documentElement;
    root.classList.add('intro-lock');
    window.scrollTo(0, 0);
    // SmoothScroll mounts the Lenis instance one tick after us — stop it on the
    // next frame, and again immediately in case it's already there.
    getLenis()?.stop();
    const rafId = requestAnimationFrame(() => getLenis()?.stop());

    const toCollapse = setTimeout(() => setCollapse(true), 2200);
    const toEnd = setTimeout(() => setShow(false), 3450);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(toCollapse);
      clearTimeout(toEnd);
    };
  }, [reduce]);

  // Release scroll once the overlay has fully exited.
  const release = () => {
    document.documentElement.classList.remove('intro-lock');
    getLenis()?.start();
  };

  if (reduce) return null;

  return (
    <AnimatePresence onExitComplete={release}>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ backgroundColor: 'rgba(239,240,235,1)' }}
          animate={{ backgroundColor: collapse ? 'rgba(239,240,235,0)' : 'rgba(239,240,235,1)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: collapse ? 1 : 0, ease: EASE_OUT }}
        >
          {/* Seed connectors — drawn only during the collapse, bridging the
              typography into the network's spoke structure. */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {SEEDS.map((s, i) => (
              <g key={i}>
                <motion.line
                  x1="50"
                  y1="50"
                  x2={s.x}
                  y2={s.y}
                  stroke="#2c3b8e"
                  strokeWidth="0.12"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    collapse
                      ? { pathLength: 1, opacity: [0, 0.5, 0] }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{ duration: 1, delay: 0.15 + i * 0.05, ease: EASE_OUT }}
                />
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r="0.5"
                  fill="#2c3b8e"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={collapse ? { scale: [0, 1, 0], opacity: [0, 0.7, 0] } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.05, ease: EASE_OUT }}
                />
              </g>
            ))}
          </svg>

          {/* The name itself */}
          <motion.div
            className="relative px-6 text-center"
            animate={
              collapse
                ? { scale: 0.18, opacity: 0, filter: 'blur(7px)' }
                : { scale: 1, opacity: 1, filter: 'blur(0px)' }
            }
            transition={{ duration: collapse ? 1 : 0.6, ease: collapse ? EASE_IN : EASE_OUT }}
          >
            <motion.p
              className="mb-4 text-[12px] font-semibold uppercase tracking-[0.34em] text-rust md:mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: collapse ? 0 : 1, y: 0 }}
              transition={{ duration: 0.6, delay: collapse ? 0 : 1.15, ease: EASE_OUT }}
            >
              {resume.role}
            </motion.p>

            <motion.h1
              className="leading-[0.92] tracking-[-0.02em] text-ink"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ letterSpacing: '0.22em' }}
              animate={{ letterSpacing: '-0.02em' }}
              transition={{ duration: 1.4, ease: EASE_OUT }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-[clamp(2.8rem,12vw,8.5rem)]"
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 20, delay: 0.1 }}
                >
                  {FIRST}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-[clamp(2.8rem,12vw,8.5rem)]"
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 20, delay: 0.22 }}
                >
                  {LAST}
                </motion.span>
              </span>
            </motion.h1>

            {/* Hairline that draws beneath the name */}
            <motion.div
              className="mx-auto mt-7 h-px w-40 origin-center bg-rust/60 md:w-56"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: collapse ? 0 : 1, opacity: collapse ? 0 : 1 }}
              transition={{ duration: 0.9, delay: collapse ? 0 : 0.9, ease: EASE_OUT }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
