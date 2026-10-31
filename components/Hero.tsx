'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import { EASE, Magnetic, Pressable } from './motion';
import { GithubIcon, LinkedinIcon, FileIcon, MailIcon } from './icons';

const links = resume._EDIT_ME_FIRST;

/** A headline line that rises out of a clip mask. */
function MaskLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
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
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const ELSEWHERE = [
  { Icon: GithubIcon, label: 'GitHub', href: links.GITHUB_URL, external: true },
  { Icon: LinkedinIcon, label: 'LinkedIn', href: links.LINKEDIN_URL, external: true },
  { Icon: MailIcon, label: 'Email', href: `mailto:${links.EMAIL}`, external: false },
  { Icon: FileIcon, label: 'Résumé', href: links.RESUME_PDF_URL, external: true },
];

/**
 * The opening screen. No intro sequence and no scroll lock: the name, what I do
 * and the ways to reach me are readable in the first second, with a quiet
 * marginalia rail of facts beside them, like the margin of a field notebook.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto max-w-6xl overflow-x-clip px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20"
    >
      <div className="relative grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-8">
          <Rise delay={0.05}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-rust">
              {resume.availability}
            </p>
          </Rise>

          <h1
            className="mt-6 text-[clamp(2.9rem,9vw,6rem)] leading-[1] tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <MaskLine delay={0.12}>{resume.name}</MaskLine>
          </h1>

          <p
            className="mt-5 max-w-2xl text-[clamp(1.4rem,3.4vw,2.15rem)] leading-[1.18] text-ink/85"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <MaskLine delay={0.26}>
              I build AI systems that <em className="text-rust">hold up in production.</em>
            </MaskLine>
          </p>

          <Rise delay={0.45}>
            <p className="mt-7 max-w-xl text-[16.5px] leading-relaxed text-ink/75">
              Hybrid retrieval that finds the exact line <em className="pr-[0.18em]">and</em> the
              meaning. Ensembles that generalize instead of memorizing. Models you can audit, not just
              admire: research turned into systems that ship.
            </p>
          </Rise>

          <Rise delay={0.6} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Magnetic>
              <Pressable
                href="#work"
                className="inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-rust"
              >
                See the work
              </Pressable>
            </Magnetic>
            <a href="#terminal" className="nav-underline text-sm font-semibold text-rust">
              or query my résumé in the terminal ↓
            </a>
          </Rise>

          <Rise delay={0.72} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            {ELSEWHERE.map(({ Icon, label, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-1.5 text-ink/60 transition-colors hover:text-rust"
              >
                <Icon className="h-[15px] w-[15px]" />
                {label}
              </a>
            ))}
          </Rise>
        </div>

        {/* Marginalia rail */}
        <Rise
          delay={0.8}
          className="border-t border-ink/15 pt-6 md:col-span-4 md:border-l md:border-t-0 md:pl-8 md:pt-2"
        >
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Now</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                AI Strategist @ <span className="font-semibold">AKademy38</span>: the Booklet Engine
                pipeline (~10× lower token cost) and a child-safe AI tutor.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Shipped</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                <a
                  href="https://hirevo.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-underline font-semibold text-rust"
                >
                  Hirevo
                </a>
                , an AI resume-screening SaaS, live and indexed on Google.
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Studying</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                {resume.education.degree}, {resume.education.school} ({resume.education.years}).
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/50">On the record</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">
                GSSoC ’26 contributor · DataForge finalist, IITR E-Summit ’26
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ink/50">Based in</dt>
              <dd className="mt-1 leading-relaxed text-ink/85">{resume.location}</dd>
            </div>
          </dl>
        </Rise>
      </div>
    </section>
  );
}
