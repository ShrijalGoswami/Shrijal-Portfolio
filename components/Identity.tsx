'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import resume from '@/data/resume.json';
import { EASE } from './motion';

/**
 * The identity bridge — placed immediately after the Living Knowledge System.
 * Once the network has formed and the name has resolved, this is the person
 * behind it: an editorial portrait plate (offset registration frame, warm
 * treatment, scroll parallax) set against a tight, trust-building statement.
 * Deliberately not an avatar, not a profile card.
 */
export default function Identity() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Parallax: the portrait drifts slower than the page as the section passes.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);

  return (
    <section id="identity" className="mx-auto max-w-6xl overflow-x-clip px-5 py-20 md:px-8 md:py-28">
      <div ref={ref} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        {/* Portrait plate with an offset registration frame */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="md:col-span-5"
        >
          <div className="relative mx-auto max-w-[360px] md:mx-0">
            {/* Registration frame — the editorial "print" cue */}
            <div
              aria-hidden="true"
              className="absolute left-4 top-4 bottom-0 right-0 rounded-2xl border border-rust/30"
            />

            {/* The plate */}
            <div className="relative mb-4 mr-4 aspect-[4/5] overflow-hidden rounded-2xl bg-sand shadow-[0_30px_60px_-28px_rgba(43,26,18,0.45)]">
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src="/portrait.jpg"
                  alt="Shrijal Goswami — AI/ML engineer"
                  fill
                  sizes="(max-width: 768px) 80vw, 30vw"
                  className="object-cover object-[50%_22%]"
                  style={{ filter: 'contrast(1.04) saturate(0.92)' }}
                />
              </motion.div>

              {/* Warm wash so the photo reads as part of the palette, not pasted on */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-multiply"
                style={{
                  background:
                    'linear-gradient(150deg, rgba(217,119,6,0.10) 0%, transparent 38%, rgba(194,65,12,0.16) 100%)',
                }}
              />
              {/* Bottom scrim for the caption */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                style={{ background: 'linear-gradient(to top, rgba(43,26,18,0.55), transparent)' }}
              />

              {/* Status caption — quiet, on-narrative */}
              <div className="absolute bottom-3.5 left-4 flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  {!reduce && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
                </span>
                <span
                  className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/90"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  In the loop · {resume.location}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statement */}
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            className="text-[12px] font-semibold uppercase tracking-[0.24em] text-rust"
          >
            The human in the loop
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-5 max-w-2xl text-3xl leading-[1.12] md:text-[2.9rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Behind every node above, the same person — <em className="text-rust">building it,
            shipping it,</em> and standing behind it in production.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink/75"
          >
            I&apos;m {resume.name}. The hybrid retrieval, the ensembles, the pipelines in the map
            above are all things I&apos;ve taken from a notebook to a live endpoint — I work on the
            unglamorous part of AI that has to keep running after the demo ends.
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
            className="mt-9 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-ink/15 pt-7 text-sm sm:grid-cols-3"
          >
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Role</dt>
              <dd className="mt-1 font-semibold text-ink">{resume.role}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Now</dt>
              <dd className="mt-1 font-semibold text-ink">AI Strategist · AKademy38</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Status</dt>
              <dd className="mt-1 font-semibold text-rust">Open to 2026 internships</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
