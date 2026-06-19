'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import { EASE, Magnetic, DriftWash, Pressable } from './motion';

const links = resume._EDIT_ME_FIRST;

/** A headline line that rises out of a clip mask. */
function MaskLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? { opacity: 0 } : { y: '108%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={
          reduce
            ? { duration: 0.4, delay }
            : { type: 'spring', stiffness: 150, damping: 24, delay }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}

function Rise({ children, delay, className }: { children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl overflow-x-clip px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-24">
      {/* Ambient blueprint washes — drifting slowly, sitting behind the frosted header too */}
      <DriftWash className="-top-28 right-[-60px] h-[440px] w-[440px]" color="#2c3b8e" duration={24} />
      <DriftWash className="top-64 left-[-120px] h-[360px] w-[360px]" color="#6f7890" duration={30} delay={3} />

      <div className="relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <Rise delay={0.05}>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-rust">
              {resume.availability}
            </p>
          </Rise>

          <h1
            className="mt-6 text-[2.5rem] leading-[1.07] sm:text-6xl md:text-[4.3rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <MaskLine delay={0.15}>I build AI systems</MaskLine>
            <MaskLine delay={0.27}>
              that <em className="text-rust">hold up</em>
            </MaskLine>
            <MaskLine delay={0.39}>
              <em className="text-rust">in production.</em>
            </MaskLine>
          </h1>

          <Rise delay={0.55}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink/75">
              Hybrid retrieval that finds the exact line <em className="pr-[0.18em]">and</em> the meaning. Ensembles that
              generalize instead of memorizing. Models you can audit, not just admire. That&apos;s
              the work — research turned into systems that ship.
            </p>
          </Rise>

          <Rise delay={0.7} className="mt-9 flex flex-wrap items-center gap-5">
            <Magnetic>
              <Pressable
                href="#work"
                className="inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-rust"
              >
                See the work
              </Pressable>
            </Magnetic>
            <a
              href="#terminal"
              className="nav-underline text-sm font-semibold text-rust"
            >
              or query my résumé in the terminal ↓
            </a>
          </Rise>
        </div>

        {/* Marginalia rail */}
        <Rise
          delay={0.85}
          className="border-t border-ink/15 pt-6 md:col-span-4 md:border-l md:border-t-0 md:pl-8 md:pt-1"
        >
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-[11px] tracking-[0.2em] uppercase text-ink/50">Now</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                AI Strategist @ <span className="font-semibold">AKademy38</span> — AI content
                automation, Booklet Engine pipeline.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.2em] uppercase text-ink/50">Studying</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                {resume.education.degree}, {resume.education.school} ({resume.education.years}).
              </dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.2em] uppercase text-ink/50">Also</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">{resume.highlights.join(' · ')}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.2em] uppercase text-ink/50">Elsewhere</dt>
              <dd className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <a href={links.GITHUB_URL} className="nav-underline text-rust">GitHub</a>
                <a href={links.LINKEDIN_URL} className="nav-underline text-rust">LinkedIn</a>
                <a href={`mailto:${links.EMAIL}`} className="nav-underline text-rust">Email</a>
              </dd>
            </div>
          </dl>
        </Rise>
      </div>
    </section>
  );
}
