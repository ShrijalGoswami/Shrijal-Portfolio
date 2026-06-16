'use client';

import resume from '@/data/resume.json';

/**
 * Capabilities ribbon — a slow, continuous band of the real stack drifting across
 * the page. Gives a horizontal counter-motion to the vertical scroll and reads as
 * "alive" without ever stealing focus. Two identical groups loop seamlessly; the
 * track pauses on hover. Under reduced-motion the duplicate is hidden and the set
 * wraps statically (see globals.css).
 *
 * Skills are pulled straight from resume.json so this never drifts from the source.
 */
const ITEMS: string[] = Object.values(resume.skills).flat();

function Group({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="marquee__group flex shrink-0 items-center gap-0"
      aria-hidden={ariaHidden || undefined}
    >
      {ITEMS.map((skill, i) => (
        <li key={`${skill}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-[15px] font-medium text-ink/70 transition-colors">
            {skill}
          </span>
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-rust/60"
          />
        </li>
      ))}
    </ul>
  );
}

export default function StackMarquee() {
  return (
    <section
      aria-label="Core stack"
      className="marquee relative overflow-hidden border-y border-ink/10 bg-sand/35 py-5"
    >
      {/* Quiet kicker pinned to the left, over the drift */}
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 bg-paper/0 md:block">
        <span className="t-label rounded-full bg-surface-2 px-3 py-1.5 text-rust shadow-[0_8px_20px_-12px_rgba(0,0,0,0.5)] ring-1 ring-ink/10">
          Core stack
        </span>
      </span>

      <div className="marquee__track flex w-max items-center will-change-transform">
        <Group />
        <Group ariaHidden />
      </div>
    </section>
  );
}
