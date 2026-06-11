'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import SectionLabel from './SectionLabel';
import { Stagger, Item } from './motion';

export default function Experience() {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="02" title="Experience" />
          <p className="mt-4 hidden max-w-[12rem] text-[13px] leading-relaxed text-ink/55 md:block">
            From student projects to a hands-on internship to leading AI strategy — each step built
            on the last.
          </p>
        </div>

        <div className="md:col-span-8 md:col-start-5">
          {/* Timeline: a single spine threads every role, brightest at the top where the
              current work sits, fading down toward the earliest student activity. */}
          <Stagger className="relative space-y-6">
            <div
              aria-hidden="true"
              className="absolute left-[4px] top-2 bottom-2 w-0.5 rounded bg-gradient-to-b from-rust via-ochre/50 to-ink/15"
            />

            {resume.experience.map((job) => (
              <Item key={job.org}>
                <div className="relative pl-9 md:pl-12">
                  {/* Node marker on the spine */}
                  <span className="absolute left-0 top-7 flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
                    {job.current ? (
                      <>
                        {!reduce && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust/60" />
                        )}
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rust ring-4 ring-paper" />
                      </>
                    ) : (
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-rust/55 bg-paper ring-4 ring-paper" />
                    )}
                  </span>

                  <motion.article
                    whileHover={reduce ? undefined : { y: -5, rotate: -0.3 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    className="glass group relative overflow-hidden rounded-2xl p-6 md:p-8"
                  >
                    {/* Warm wash behind the frosted surface; shifts on hover */}
                    <div
                      aria-hidden="true"
                      className="absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-60 blur-3xl transition-all duration-700 group-hover:-translate-x-4 group-hover:translate-y-3 group-hover:opacity-90"
                      style={{ background: 'radial-gradient(closest-side, #e8927c66, transparent)' }}
                    />

                    <div className="relative grid gap-2 sm:grid-cols-[140px_1fr] sm:gap-8">
                      <div className="text-[13px] leading-relaxed text-ink/55">
                        <p>{job.when}</p>
                        {job.current ? (
                          <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-rust">
                            <span className="h-1.5 w-1.5 rounded-full bg-rust" aria-hidden="true" />
                            current
                          </p>
                        ) : (
                          <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-ink/40">
                            <span className="h-1.5 w-1.5 rounded-full border border-ink/40" aria-hidden="true" />
                            completed
                          </p>
                        )}
                      </div>

                      <div>
                        {'stage' in job && job.stage && (
                          <p
                            className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                              job.current ? 'text-rust' : 'text-ink/45'
                            }`}
                          >
                            {job.stage}
                          </p>
                        )}
                        <h3 className="mt-1 text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                          {job.role} · <span className="text-rust">{job.org}</span>
                        </h3>
                        <p className="mt-0.5 text-[13px] text-ink/55">{job.where}</p>
                        <ul className="mt-3 max-w-xl space-y-2 text-[15px] leading-relaxed text-ink/75">
                          {job.points.map((p) => (
                            <li key={p} className="flex gap-2.5">
                              <span className="mt-[9px] h-px w-4 shrink-0 bg-ochre" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Key delivered product — recruiters should tie this role to it instantly. */}
                        {'keyProject' in job && job.keyProject && (
                          <div className="mt-5 max-w-xl rounded-xl border border-rust/25 bg-rust/[0.06] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-rust">
                                <span aria-hidden="true">★</span> Key project
                              </span>
                              <a
                                href={job.keyProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full bg-rust px-2.5 py-1 text-[11px] font-semibold text-paper transition-colors hover:bg-ochre"
                              >
                                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                  {!reduce && (
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper/80" />
                                  )}
                                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-paper" />
                                </span>
                                Live demo
                              </a>
                            </div>

                            <h4 className="mt-2 text-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                              {job.keyProject.name}{' '}
                              <span className="text-[14px] text-ink/55">({job.keyProject.alias})</span>
                            </h4>
                            <p className="mt-1 text-[13px] leading-relaxed text-ink/70">{job.keyProject.tagline}</p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {job.keyProject.tags.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full border border-ink/15 bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink/70"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px]">
                              <a
                                href={job.keyProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-underline font-semibold text-rust"
                              >
                                Live demo ↗
                              </a>
                              <a
                                href={job.keyProject.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-underline text-ink/65 hover:text-ink"
                              >
                                Code ↗
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
