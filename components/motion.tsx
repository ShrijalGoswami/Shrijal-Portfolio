'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useSpring, type Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

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
