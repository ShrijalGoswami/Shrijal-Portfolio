'use client';

import { CountUp } from './motion';

/**
 * Credential punch — a row of the hardest numbers right after the intro, before
 * any prose. Big glowing ember figures that count up as they enter view. This is
 * the first thing a hirer's eye locks onto: proof, not adjectives.
 */
const STATS: { value: string; label: string; sub: string }[] = [
  { value: '~10×', label: 'lower token cost', sub: 'Booklet Engine pipeline · ≈40% → ≈4%' },
  { value: '89.13%', label: 'CV accuracy', sub: 'Heart-disease stacking ensemble' },
  { value: '~45 ms', label: 'retrieval latency', sub: 'Hybrid BM25 + dense, at scale' },
  { value: '3', label: 'systems in production', sub: 'Resume Intelligence · Booklet Engine · AI Tutor' },
];

export default function StatsBand() {
  return (
    <section aria-label="By the numbers" className="mx-auto max-w-6xl px-5 md:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="group relative flex flex-col justify-between gap-6 bg-paper px-5 py-7 transition-colors hover:bg-surface md:px-7 md:py-9"
          >
            {/* hover signal bloom */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: 'radial-gradient(closest-side, rgba(44,59,142,0.28), transparent)' }}
            />
            <CountUp
              value={s.value}
              className="t-figure glow-rust relative text-4xl text-rust md:text-[3.25rem]"
            />
            <div className="relative">
              <p className="text-[14px] font-semibold text-ink md:text-[15px]">{s.label}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink/45">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
