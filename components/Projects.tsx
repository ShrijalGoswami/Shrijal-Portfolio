'use client';

import { motion, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';
import SectionLabel from './SectionLabel';
import { Stagger, Item } from './motion';

const WASHES = ['#e8927c', '#d97706', '#c2410c'];

export default function Projects() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="03" title="Selected work" />
        </div>

        <Stagger className="space-y-8 md:col-span-9 md:col-start-4" gap={0.12}>
          {resume.projects.map((project, i) => (
            <Item key={project.name}>
              <motion.article
                whileHover={reduce ? undefined : { y: -6, rotate: i % 2 === 0 ? -0.35 : 0.35 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="glass group relative overflow-hidden rounded-2xl p-6 md:p-9"
              >
                {/* Layered warm washes behind the frosted panel */}
                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-55 blur-3xl transition-all duration-700 group-hover:-translate-x-6 group-hover:translate-y-4 group-hover:opacity-85"
                  style={{ background: `radial-gradient(closest-side, ${WASHES[i % 3]}59, transparent)` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                  style={{ background: 'radial-gradient(closest-side, #f3e3d0aa, transparent)' }}
                />

                <div className="relative grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-7">
                    <p className="text-[12px] tracking-[0.18em] uppercase text-ink/45">
                      {String(i + 1).padStart(2, '0')} — {project.what}
                    </p>
                    <h3 className="mt-2 text-2xl md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                      {project.name}
                    </h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/75">{project.detail}</p>
                    <p className="mt-4 text-[13px] text-ink/55">{project.stack.join(' · ')}</p>
                  </div>

                  {/* Evidence: every number carries its label and context */}
                  <div className="md:col-span-5 md:border-l md:border-ink/15 md:pl-8">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-ink/50">Measured</p>
                    <dl className="mt-3 space-y-5">
                      {project.evidence.map((e) => (
                        <div key={e.value}>
                          <dt className="text-3xl text-rust" style={{ fontFamily: 'var(--font-display)' }}>
                            {e.value}
                          </dt>
                          <dd className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink/65">{e.label}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.article>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
