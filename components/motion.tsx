'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  type Variants,
} from 'framer-motion';

export const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Single-element scroll reveal: fade + rise as it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its <Item> children as the group scrolls into view. */
export function Stagger({
  children,
  className,
  gap = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-70px' }}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  className,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

/** Magnetic wrapper: the child leans toward the cursor, springs back on leave. */
export function Magnetic({
  children,
  className,
  strength = 0.32,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 16 });
  const y = useSpring(0, { stiffness: 180, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}

/** Slowly drifting warm wash blob — ambient, looping, GPU-only transforms. */
export function DriftWash({
  className,
  color = '#e8927c',
  duration = 22,
  delay = 0,
}: {
  className?: string;
  color?: string;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ''}`}
      style={{ background: `radial-gradient(closest-side, ${color}55 0%, ${color}22 55%, transparent 100%)` }}
      animate={
        reduce
          ? undefined
          : { x: [0, 36, -22, 0], y: [0, -28, 30, 0], scale: [1, 1.08, 0.95, 1] }
      }
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/**
 * Masked headline reveal — the line rises out of a clip mask as it enters view.
 * Reuses the opening NameIntro language so section headlines feel of-a-piece with
 * the intro. Preserves any inner markup (e.g. <em>) since it animates the whole line.
 * Render one per visual line of a headline; stagger with `delay`.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={`block ${className ?? ''}`}>{children}</span>;
  }

  return (
    <span className={`block overflow-hidden pb-[0.12em] ${className ?? ''}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '115%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Animated figure — counts up to the value when it scrolls into view. Parses the
 * first number out of a label ("89.13%", "~10×", "α = 0.65", "~45 ms") and animates
 * just that number, preserving prefix, suffix, and decimal precision. Non-numeric
 * values ("Live", "5-stage" keeps its 5) render statically / partially as sensible.
 */
export function CountUp({
  value,
  className,
  duration = 1.5,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const match = value.match(/-?\d+(?:\.\d+)?/);
  const hasNum = !!match;
  const target = match ? parseFloat(match[0]) : 0;
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0;
  const prefix = match ? value.slice(0, match.index!) : '';
  const suffix = match ? value.slice(match.index! + match[0].length) : '';

  const [display, setDisplay] = useState(() =>
    !hasNum || reduce ? value : prefix + (0).toFixed(decimals) + suffix,
  );

  useEffect(() => {
    if (!hasNum || reduce || !inView) return;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(prefix + v.toFixed(decimals) + suffix),
    });
    return () => controls.stop();
  }, [hasNum, reduce, inView, target, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/** Springy press/hover for buttons and pills. */
export function Pressable({
  children,
  className,
  href,
  lift = -3,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  lift?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={reduce ? undefined : { y: lift, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      {children}
    </motion.a>
  );
}
