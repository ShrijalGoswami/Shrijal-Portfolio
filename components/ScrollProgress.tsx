'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Reading-position rail — a hairline that fills warm as the page scrolls. Springs
 * so it eases into place rather than tracking pixel-for-pixel. Sits above the
 * header; purely decorative, so it stays even under reduced-motion (no vestibular
 * load from a 2px progress line).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-rust via-ochre to-clay"
      style={{ scaleX }}
    />
  );
}
