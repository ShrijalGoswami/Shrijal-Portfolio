'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import { Reveal, CountUp } from './motion';

const WASHES = ['#2c3b8e', '#233072', '#6f7890', '#2c3b8e'];

/**
 * Selected work — rebuilt from uniform stacked cards into large, editorial
 * case-study blocks. Each carries a giant ghosted index, a full-width split of
 * narrative vs. measured evidence, and alternates the evidence side so the eye
 * zig-zags down the page instead of scanning identical cards.
 */
export default function Projects() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="t-label text-rust glow-rust">03 — Selected work</p>
        <h2 className="t-h2 mt-4 max-w-2xl">
          Four systems, <em className="text-rust">measured.</em>
        </h2>
      </Reveal>

      <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
        {resume.projects.map((project, i) => {
          const flip = i % 2 === 1;
          const links = (project as {
            links?: { live?: string; code?: string; internal?: string; note?: string };
          }).links;

          return (
            <Reveal key={project.name} y={40}>
              <article className="group relative">
                {/* Giant ghosted index */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-12 select-none text-[7rem] font-light leading-none text-ink/[0.05] md:-top-20 md:text-[11rem]"
                  style={{ fontFamily: 'var(--font-display)', [flip ? 'right' : 'left']: '-0.5rem' } as React.CSSProperties}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* signal bar that grows on hover */}
                <div
                  aria-hidden
                  className="absolute left-0 top-1 h-0 w-[3px] rounded-full bg-gradient-to-b from-rust to-ochre transition-all duration-500 group-hover:h-full"
                  style={{ boxShadow: '0 0 16px rgba(44,59,142,0.55)' }}
                />

                <div className={`relative grid items-start gap-8 pl-6 md:grid-cols-12 md:gap-12 ${flip ? 'md:[direction:rtl]' : ''}`}>
                  {/* Narrative */}
                  <div className={`md:col-span-7 ${flip ? '[direction:ltr]' : ''}`}>
                    <p className="t-label text-ink/45">{project.what}</p>
                    <h3
                      className="mt-3 text-3xl leading-tight md:text-[2.6rem]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {project.name}
                    </h3>
                    <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink/75">{project.detail}</p>
                    <p className="mt-5 font-mono text-[12.5px] tracking-wide text-ink/45" style={{ fontFamily: 'var(--font-mono)' }}>
                      {project.stack.join('  ·  ')}
                    </p>

                    {links && (
                      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px]">
                        {links.live && (
                          <a
                            href={links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-rust px-5 py-2.5 font-semibold text-onaccent shadow-[0_12px_30px_-10px_rgba(44,59,142,0.6)] transition-colors hover:bg-ochre"
                          >
                            <span className="relative flex h-1.5 w-1.5" aria-hidden>
                              {!reduce && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-onaccent/70" />
                              )}
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-onaccent" />
                            </span>
                            Live demo ↗
                          </a>
                        )}
                        {links.code && (
                          <a
                            href={links.code}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-underline font-semibold text-ink/70 hover:text-rust"
                          >
                            View code ↗
                          </a>
                        )}
                        {links.internal && !links.live && (
                          <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/45">
                            <span className="h-1.5 w-1.5 rounded-full bg-ink/30" aria-hidden />
                            {links.internal}
                          </span>
                        )}
                        {links.note && <span className="text-[12px] text-ink/40">{links.note}</span>}
                      </div>
                    )}
                  </div>

                  {/* Evidence panel */}
                  <div className={`md:col-span-5 ${flip ? '[direction:ltr]' : ''}`}>
                    <motion.div
                      whileHover={reduce ? undefined : { y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="glass relative overflow-hidden rounded-3xl p-7"
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
                        style={{ background: `radial-gradient(closest-side, ${WASHES[i]}55, transparent)` }}
                      />
                      <p className="relative t-label text-ink/45">Measured</p>
                      <dl className="relative mt-5 space-y-6">
                        {project.evidence.map((e) => (
                          <div key={e.value}>
                            <dt className="t-figure glow-rust text-[2.5rem] leading-none text-rust">
                              <CountUp value={e.value} />
                            </dt>
                            <dd className="mt-2 text-[13px] leading-relaxed text-ink/65">{e.label}</dd>
                          </div>
                        ))}
                      </dl>
                    </motion.div>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
