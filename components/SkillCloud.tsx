'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Skill chips with a single shared description rail below them. Hovering (or
 * keyboard-focusing) a chip writes its blurb into the fixed-height rail — so the
 * detail never floats over and hides the other chips, and the rail reserves its
 * height so nothing shifts as the text changes.
 */
export default function SkillCloud({
  skills,
  info,
}: {
  skills: string[];
  info: Record<string, string>;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  return (
    <div onMouseLeave={() => setActive(null)}>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setActive(s)}
            onFocus={() => setActive(s)}
            onBlur={() => setActive(null)}
            aria-describedby="skill-detail"
            className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium outline-none transition-colors ${
              active === s
                ? 'border-rust/70 bg-rust/12 text-ink'
                : 'border-ink/12 bg-ink/[0.04] text-ink/75 hover:border-rust/50 hover:text-ink focus-visible:border-rust/70'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Shared description rail — fixed min-height, so chips above never jump. */}
      <div
        id="skill-detail"
        aria-live="polite"
        className="mt-4 flex min-h-[3.25rem] items-center rounded-xl border border-line/80 bg-ink/[0.03] px-4 py-2.5"
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.p
              key={active}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-[13px] leading-snug text-ink/80"
            >
              <span className="font-semibold text-rust">{active}</span>
              <span className="mx-2 text-ink/30">—</span>
              {info[active] ?? 'Part of my day-to-day toolkit.'}
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={false}
              animate={{ opacity: 1 }}
              className="text-[13px] italic leading-snug text-ink/40"
            >
              Hover a skill to see what it is and how I use it.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
