'use client';

import resume from '@/data/resume.json';
import SectionLabel from './SectionLabel';
import { Reveal, Stagger, Item } from './motion';

/**
 * Research credibility layer — visible and scannable, no terminal required.
 * Framed as evidence of technical depth: each method links to something shipped.
 * Reuses the site's existing reveal choreography (no new motion).
 */
export default function Research() {
  return (
    <section id="research" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="04" title="Applied research" />
        </div>

        <div className="md:col-span-9 md:col-start-4">
          <Reveal>
            <h2 className="t-h2 max-w-2xl">
              The methods <em className="text-rust">behind</em> the systems.
            </h2>
            <p className="t-body mt-4 max-w-xl text-ink/75">
              Applied explorations, not formal publications — the ideas I reach for when a model
              has to generalize, an answer has to be auditable, or a lookup has to stay fast. Each
              one shows up in something I shipped; code is linked where it&apos;s public.
            </p>
          </Reveal>

          <Stagger className="mt-10">
            {resume.research.map((r) => (
              <Item key={r.id}>
                <article className="grid gap-x-8 gap-y-3 border-t border-ink/12 py-7 md:grid-cols-[5rem_1fr]">
                  <div className="t-figure text-[15px] leading-none text-rust">{r.id}</div>

                  <div>
                    <h3
                      className="text-xl leading-tight tracking-tight md:text-2xl"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {r.title}
                    </h3>
                    <p className="t-meta mt-1.5 text-ink/55">{r.focus}</p>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/75">{r.detail}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {r.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink/15 bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-ink/65"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <p className="inline-flex items-center gap-2 text-[13px] text-ink/70">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden="true" />
                        <span className="font-medium">{r.outcome}</span>
                      </p>
                      {(() => {
                        const link = (r as { link?: { label: string; href: string } }).link;
                        return link ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-underline text-[13px] font-semibold text-rust"
                          >
                            {link.label} ↗
                          </a>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </article>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
