'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import SectionLabel from './SectionLabel';
import Terminal from './Terminal';
import { Reveal } from './motion';

/**
 * Signature moment: the honest RAG diagram, but alive — a retrieval "pulse"
 * travels the pipeline on loop, splitting across the parallel retrievers.
 */
function FlowingPipeline() {
  const reduce = useReducedMotion();
  const steps = resume.ragPipeline.steps;

  return (
    <figure className="mt-10">
      <figcaption className="text-[11px] tracking-[0.2em] uppercase text-ink/50">
        For the record — the real architecture behind the Explainable RAG project
      </figcaption>

      <div className="glass relative mt-3 overflow-hidden rounded-xl px-5 pb-5 pt-4">
        {/* wash behind the frosted panel */}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-14 h-44 w-44 rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, #e07a5f55, transparent)' }}
        />

        <div className="relative flex flex-wrap items-center gap-y-2 text-[13px] text-ink/80">
          {steps.map((step, i) => (
            <span key={step} className="flex items-center">
              <motion.span
                className={i === 2 ? 'font-semibold text-rust' : ''}
                animate={
                  reduce
                    ? undefined
                    : { opacity: [0.55, 1, 0.55], y: [0, -1.5, 0] }
                }
                transition={{
                  duration: 4.2,
                  times: [0, 0.5, 1],
                  delay: (i / steps.length) * 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {step}
              </motion.span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="mx-2.5 text-ochre">
                  →
                </span>
              )}
            </span>
          ))}
        </div>

        {/* The traveling retrieval pulse */}
        <div className="relative mt-4 h-px w-full bg-ink/15" aria-hidden="true">
          {!reduce && (
            <>
              <motion.span
                className="absolute -top-[2.5px] h-1.5 w-1.5 rounded-full bg-rust"
                animate={{ left: ['0%', '99%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="absolute -top-[5px] h-2.5 w-10 -translate-x-1/2 rounded-full bg-rust/30 blur-sm"
                animate={{ left: ['0%', '99%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}
        </div>
      </div>
    </figure>
  );
}

export default function TerminalSection() {
  return (
    <section id="terminal" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="05" title="Terminal" />
        </div>

        <div className="md:col-span-9 md:col-start-4">
          <Reveal>
            <h2 className="t-h2">
              Query the résumé <em className="text-rust">yourself.</em>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/75">
              A real shell over my résumé data — it boots when you arrive, then just{' '}
              <em className="text-rust">click a command</em>. Each one runs instantly and the
              output streams back, live. Try{' '}
              <code className="rounded bg-sand px-1.5 py-0.5 text-[13px]" style={{ fontFamily: 'var(--font-mono)' }}>
                projects
              </code>{' '}
              or{' '}
              <code className="rounded bg-sand px-1.5 py-0.5 text-[13px]" style={{ fontFamily: 'var(--font-mono)' }}>
                research
              </code>
              .
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-8">
            <Terminal />
          </Reveal>

          <Reveal delay={0.2}>
            <FlowingPipeline />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
