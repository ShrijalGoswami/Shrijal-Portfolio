'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './motion';

/**
 * The structural motif: a field-notes margin label.
 * The big number slides in from the left as the section enters view.
 */
export default function SectionLabel({ n, title }: { n: string; title: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-baseline gap-3 md:block md:sticky md:top-28">
      <motion.span
        className="inline-block text-4xl md:text-5xl text-clay font-light leading-none"
        style={{ fontFamily: 'var(--font-display)' }}
        aria-hidden="true"
        initial={{ opacity: 0, x: reduce ? 0 : -22 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-70px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {n}
      </motion.span>
      <p className="text-[11px] tracking-[0.22em] uppercase text-ink/60 md:mt-3">{title}</p>
      <motion.div
        className="hidden h-px w-10 origin-left bg-rust/60 md:mt-3 md:block"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-70px' }}
        transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
      />
    </div>
  );
}
