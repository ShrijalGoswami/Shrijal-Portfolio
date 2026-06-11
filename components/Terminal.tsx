'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import resume from '@/data/resume.json';

const links = resume._EDIT_ME_FIRST;

type Line = { id: number; kind: 'cmd' | 'out' | 'err'; text: string; delay: number };

const PROMPT = 'guest@shrijal:~$';

// Local résumé PDF lives in /public — used by the `resume` chip.
const RESUME_URL = '/Shrijal_Goswami_Resume.pdf';

// The clickable command palette — runs instantly, no typing required.
const CHIPS = [
  { label: 'projects', cmd: 'projects' },
  { label: 'research', cmd: 'research' },
  { label: 'experience', cmd: 'experience' },
  { label: 'hackathons', cmd: 'hackathons' },
  { label: 'resume', cmd: 'resume' },
  { label: 'github', cmd: 'github' },
  { label: 'linkedin', cmd: 'linkedin' },
  { label: 'contact', cmd: 'contact' },
] as const;

const BOOT_LINES = [
  'shrijal-shell v2.0 — warm boot',
  'mounting data/resume.json ............... ok',
  'loading indexes: bm25.sparse, dense.vec . ok',
  'ready. pick a command below ↓',
];

function out(text: string): Omit<Line, 'id' | 'delay'> {
  return { kind: 'out', text };
}

/** Pure command → output mapping. Side effects (opening links) live in the runner. */
function run(cmd: string): Omit<Line, 'id' | 'delay'>[] {
  switch (cmd) {
    case 'whoami':
      return [
        out(`${resume.name} — ${resume.role}`),
        out(resume.summary),
        out(`status: ${resume.availability.toLowerCase()}`),
      ];

    case 'skills':
      return Object.entries(resume.skills).map(([group, items]) =>
        out(`${group.padEnd(18)} ${(items as string[]).join(', ')}`),
      );

    case 'projects':
      return resume.projects.flatMap((p, i) => [
        out(`${i + 1}. ${p.name} — ${p.what}`),
        ...p.evidence.map((e) => out(`     ${e.value}  ${e.label}`)),
        out(`     stack: ${p.stack.join(', ')}`),
        out(''),
      ]);

    case 'research':
      return [
        out('research — retrieval & explainability'),
        out(''),
        out('  hybrid retrieval   BM25 (sparse) + dense vectors, fused'),
        out('  fusion weight      α = 0.65 → MRR 0.84 (swept 0→1)'),
        out('  explainability     source-attributed, auditable answers'),
        out('  serving            FastAPI, ~45 ms retrieval at scale'),
      ];

    case 'experience':
      return resume.experience.flatMap((j) => [
        out(`${j.when} — ${j.role}, ${j.org} (${j.where})${j.current ? '  [current]' : ''}`),
        ...j.points.map((pt) => out(`   - ${pt}`)),
        out(''),
      ]);

    case 'hackathons':
      return [out('hackathons & open source —'), ...resume.highlights.map((h) => out(`  • ${h}`))];

    case 'education':
      return [out(`${resume.education.degree}`), out(`${resume.education.school}, ${resume.education.years}`)];

    case 'contact':
      return [
        out(`email     ${links.EMAIL}`),
        out(`github    ${links.GITHUB_URL}`),
        out(`linkedin  ${links.LINKEDIN_URL}`),
        out(`resume    ${RESUME_URL}`),
      ];

    case 'resume':
      return [out('Résumé (PDF)'), out(`  ${RESUME_URL} — opening in a new tab`)];

    case 'github':
      return [out('GitHub'), out(`  ${links.GITHUB_URL}`)];

    case 'linkedin':
      return [out('LinkedIn'), out(`  ${links.LINKEDIN_URL}`)];

    default:
      return [{ kind: 'err', text: `command not found: ${cmd}` }];
  }
}

function openExternal(url: string) {
  if (/^https?:\/\//.test(url) || url.startsWith('/')) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export default function Terminal() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: '-120px' });

  // Boot: lines type out on first scroll-into-view, then the palette is live.
  const [bootChars, setBootChars] = useState(0);
  const [booted, setBooted] = useState(false);
  const bootTotal = BOOT_LINES.reduce((n, l) => n + l.length, 0);

  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inView || booted) return;
    if (reduce) {
      setBootChars(bootTotal);
      setBooted(true);
      return;
    }
    const timer = setInterval(() => {
      setBootChars((n) => {
        if (n >= bootTotal) {
          clearInterval(timer);
          setBooted(true);
          return n;
        }
        return n + 3;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [inView, booted, reduce, bootTotal]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [lines, bootChars, reduce]);

  // Render boot lines from the revealed-character budget.
  const bootRendered: string[] = [];
  let budget = bootChars;
  for (const line of BOOT_LINES) {
    if (budget <= 0) break;
    bootRendered.push(line.slice(0, budget));
    budget -= line.length;
  }

  const fastForwardBoot = () => {
    if (!booted) {
      setBootChars(bootTotal);
      setBooted(true);
    }
  };

  const runCommand = (cmd: string) => {
    if (busy) return;
    fastForwardBoot();

    // Side effects fire on the click gesture (so pop-ups aren't blocked).
    if (cmd === 'resume') openExternal(RESUME_URL);
    if (cmd === 'github') openExternal(links.GITHUB_URL);
    if (cmd === 'linkedin') openExternal(links.LINKEDIN_URL);

    const output = run(cmd);
    const step = reduce ? 0 : 0.04;
    const cmdLine: Line = { id: idRef.current++, kind: 'cmd', text: cmd, delay: 0 };
    const outLines: Line[] = output.map((l, i) => ({
      ...l,
      id: idRef.current++,
      delay: reduce ? 0 : Math.min(0.06 + i * step, 0.7),
    }));

    setLines((prev) => [...prev, cmdLine, ...outLines]);

    if (reduce) return;
    const total = (outLines.at(-1)?.delay ?? 0) + 0.3;
    setBusy(true);
    const t = setTimeout(() => setBusy(false), total * 1000);
    return () => clearTimeout(t);
  };

  const clear = () => {
    if (busy) return;
    setLines([]);
  };

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-xl bg-ink text-paper shadow-[0_28px_64px_-24px_rgba(43,26,18,0.5)]"
    >
      <div className="flex items-center justify-between border-b border-paper/10 px-4 py-2.5">
        <p className="text-[12px] text-paper/60" style={{ fontFamily: 'var(--font-mono)' }}>
          guest@shrijal — zsh
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-clay/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-ochre/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-sand/70" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-[360px] overflow-y-auto px-4 py-4 text-[13px] leading-relaxed"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {/* Boot output */}
        {bootRendered.map((line, i) => (
          <p key={`boot-${i}`} className={i === 0 ? 'text-ochre' : 'text-paper/70'}>
            {line}
          </p>
        ))}

        {/* Session output — each line fades/rises in on a quick stagger */}
        {lines.map((line) =>
          line.kind === 'cmd' ? (
            <motion.p
              key={line.id}
              className="mt-3"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: line.delay }}
            >
              <span className="text-ochre">{PROMPT}</span>{' '}
              <span className="text-paper">{line.text}</span>
            </motion.p>
          ) : (
            <motion.p
              key={line.id}
              className={`whitespace-pre-wrap ${line.kind === 'err' ? 'text-clay' : 'text-paper/80'}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: line.delay }}
            >
              {line.text}
            </motion.p>
          ),
        )}

        {/* Idle prompt — alive, but not editable */}
        {booted && (
          <p className="mt-3 flex items-center">
            <span className="text-ochre">{PROMPT}</span>
            <span
              className="term-cursor ml-2 inline-block h-[1.1em] w-[0.55em] translate-y-[2px] bg-sand"
              aria-hidden="true"
            />
          </p>
        )}
      </div>

      {/* Command palette — replaces manual entry */}
      <div className="flex flex-wrap items-center gap-2 border-t border-paper/10 px-4 py-3">
        {CHIPS.map((chip) => (
          <button
            key={chip.cmd}
            type="button"
            onClick={() => runCommand(chip.cmd)}
            disabled={busy}
            className="rounded-md border border-paper/15 bg-paper/[0.04] px-3 py-1.5 text-[12.5px] text-paper/85 transition-colors hover:border-rust/60 hover:bg-rust/15 hover:text-paper focus-visible:border-rust disabled:cursor-not-allowed disabled:opacity-40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {chip.label}
          </button>
        ))}
        {lines.length > 0 && (
          <button
            type="button"
            onClick={clear}
            disabled={busy}
            className="ml-auto rounded-md px-2.5 py-1.5 text-[12px] text-paper/40 transition-colors hover:text-paper/80 disabled:opacity-40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            clear
          </button>
        )}
      </div>
    </div>
  );
}
