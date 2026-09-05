'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import resume from '@/data/resume.json';
import { Magnetic, Pressable } from '../motion';
import { GithubIcon, LinkedinIcon, FileIcon, MailIcon } from '../icons';
import { getLenis } from '../lenis-bridge';
import { hero, setPhase, subscribePhase, whenSceneReady } from './store';

const KnowledgeScene = dynamic(() => import('./KnowledgeScene'), { ssr: false });

const links = resume._EDIT_ME_FIRST;

/* ── Sequence timing (seconds) ───────────────────────────────────────────────
   The whole landing intro is one time-driven timeline; nothing waits for scroll.

     0.0  HELLO            "Hello / There" (NameIntro)
     2.0  NETWORK_BUILD    greeting collapses; core → spokes → heads → leaves →
                           cross-links, driven by tweening hero.target 0 → HOLD
     5.2  NETWORK_HOLD     complete system holds still
     7.2  HERO_TRANSITION  network recedes behind the veil, identity resolves
     7.55 HERO             name + hero content animating in
     8.55 NORMAL           scroll unlocked, scroll cue appears
   ------------------------------------------------------------------------- */
const BUILD_S = 3.2;
const HOLD_S = 2.0;
const TRANSITION_S = 1.0;
// Progress at which every node, spoke, leaf and cross-link has fully drawn but
// the "settle" (network receding behind the identity) has not yet begun.
const HOLD_PROGRESS = 0.8;

export default function LivingHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion: a static, already-resolved hero. No lock, no timeline.
    if (reduce) {
      hero.target = 1;
      hero.progress = 1;
      hero.reduced = true;
      gsap.set('.hero-identity', { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set('.hero-standfirst, .hero-cue', { opacity: 0 });
      gsap.set('.hero-veil', { opacity: 1 });
      setPhase('normal');
      return;
    }

    // ── Scroll lock for the duration of the sequence ──
    const root = document.documentElement;
    let locked = false;
    const lock = () => {
      locked = true;
      root.classList.add('intro-lock');
      window.scrollTo(0, 0);
      getLenis()?.stop();
    };
    const unlock = () => {
      if (!locked) return;
      locked = false;
      root.classList.remove('intro-lock');
      getLenis()?.start();
    };
    lock();
    // SmoothScroll mounts the Lenis instance one tick after us — stop it again then.
    const rafId = requestAnimationFrame(() => {
      if (locked) getLenis()?.stop();
    });

    hero.target = 0;
    hero.progress = 0;

    const ctx = gsap.context(() => {
      gsap.set('.hero-cue', { opacity: 0 });
      gsap.set('.hero-veil', { opacity: 0 });
      gsap.set('.hero-standfirst', { opacity: 1 });
      gsap.set('.hero-identity', { opacity: 0, y: 26, filter: 'blur(16px)' });
    }, section);

    setPhase('hello');

    // ── The director: builds the network, holds, then resolves the identity ──
    const startSequence = () => {
      ctx.add(() => {
        const tl = gsap.timeline();
        tl
          // NETWORK_BUILD — the scene reveals nodes/edges as progress crosses
          // their thresholds, so a steady tween reads as construction in order.
          .to(hero, { target: HOLD_PROGRESS, duration: BUILD_S, ease: 'power1.inOut' })
          .call(() => setPhase('network-hold'))
          // NETWORK_HOLD — the completed system, still.
          .to({}, { duration: HOLD_S })
          .call(() => setPhase('hero-transition'))
          .addLabel('transition')
          // HERO_TRANSITION — camera dollies back, network recedes, veil lifts.
          .to(hero, { target: 1, duration: TRANSITION_S, ease: 'power2.inOut' }, 'transition')
          .to('.hero-standfirst', { opacity: 0, duration: 0.45, ease: 'power1.out' }, 'transition')
          .to('.hero-veil', { opacity: 1, duration: 0.9, ease: 'power1.inOut' }, 'transition')
          // HERO — the identity resolves out of the veil.
          .call(() => setPhase('hero'), undefined, 'transition+=0.35')
          .to(
            '.hero-identity',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power3.out' },
            'transition+=0.35',
          )
          // NORMAL — the page is a page again.
          .call(
            () => {
              setPhase('normal');
              unlock();
            },
            undefined,
            'transition+=1.35',
          )
          .to('.hero-cue', { opacity: 1, duration: 0.6 }, 'transition+=1.35');
      });
    };

    // NameIntro flips the phase to 'network-build' as the greeting collapses;
    // we start constructing as soon as the 3D scene is mounted.
    let cancelReady: (() => void) | null = null;
    const unsubscribe = subscribePhase((p) => {
      if (p !== 'network-build') return;
      cancelReady = whenSceneReady(startSequence);
    });

    return () => {
      unsubscribe();
      cancelReady?.();
      cancelAnimationFrame(rafId);
      ctx.revert();
      unlock();
      setPhase('initial');
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative"
      style={{ height: '100svh', background: '#eff0eb' }}
    >
      <div className="relative h-[100svh] w-full overflow-hidden">
        <KnowledgeScene />

        {/* Depth vignette — pushes the network into the page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(44,59,142,0.06) 100%)',
          }}
        />

        {/* Soft veil that lifts the identity out of the network at the climax. */}
        <div
          aria-hidden
          className="hero-veil pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 60% at 50% 50%, rgba(239,240,235,0.97) 0%, rgba(239,240,235,0.82) 40%, rgba(239,240,235,0.25) 70%, transparent 85%)',
          }}
        />

        {/* Standfirst — a poised statement over the network while it constructs
            itself and holds. States who, what, and the shipped systems; fades as
            the identity climax resolves. */}
        <div className="hero-standfirst pointer-events-none absolute left-1/2 top-28 -translate-x-1/2 px-6 text-center md:top-[14%]">
          <p className="t-label text-rust">AI / ML Engineer</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
            I build production AI systems — creator of the{' '}
            <span className="font-semibold text-ink">Booklet Engine</span> and the{' '}
            <span className="font-semibold text-ink">Resume Intelligence Platform</span>. Currently
            AI Strategist at AKademy38.
          </p>
        </div>

        {/* Scroll cue — appears only once the sequence has finished and the page
            scrolls again. Tucked into the corner so it never fights the action dock. */}
        <div className="hero-cue pointer-events-none absolute bottom-8 right-6 text-center md:right-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-ink/40">scroll</p>
          <div className="mx-auto mt-2 h-7 w-px bg-ink/25" />
        </div>

        {/* Persistent recruiter actions — always reachable from the hero, never buried. */}
        <div className="pointer-events-auto absolute bottom-7 left-1/2 z-30 -translate-x-1/2">
          <nav
            aria-label="Quick links"
            className="glass flex items-center gap-1 rounded-full p-1.5 text-[13px]"
          >
            <a
              href={links.GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-ink/75 transition-colors hover:bg-rust/10 hover:text-ink"
            >
              <GithubIcon className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href={links.LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-ink/75 transition-colors hover:bg-rust/10 hover:text-ink"
            >
              <LinkedinIcon className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={links.RESUME_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-ink/75 transition-colors hover:bg-rust/10 hover:text-ink"
            >
              <FileIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </a>
            <a
              href="#contact"
              className="ml-1 flex items-center gap-2 rounded-full bg-rust px-4 py-2 font-semibold text-paper transition-colors hover:bg-ochre"
            >
              <MailIcon className="h-4 w-4" />
              Contact
            </a>
          </nav>
        </div>

        {/* Identity — resolves only once the system has formed and held.
            Starts hidden inline so there's no flash before the timeline takes over. */}
        <div
          className="hero-identity pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-rust">
            {resume.availability}
          </p>
          <h1
            className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98] tracking-tight text-ink"
            style={{
              fontFamily: 'var(--font-display)',
              textShadow: '0 1px 1px rgba(255,255,255,0.5), 0 6px 24px rgba(44,59,142,0.12)',
            }}
          >
            {resume.name}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/70 md:text-[17px]">
            I build the part of AI that survives real traffic — hybrid retrieval, ensembles that
            generalize, and models you can audit. Everything above is one system.
          </p>
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-5">
            <Magnetic>
              <Pressable
                href="#about"
                className="inline-block rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-rust"
              >
                Explore the work
              </Pressable>
            </Magnetic>
            <a href="#terminal" className="nav-underline text-sm font-semibold text-rust">
              or query my résumé ↓
            </a>
          </div>
          <div className="pointer-events-auto mt-7 flex items-center gap-5 text-[13px]">
            <a href={links.GITHUB_URL} className="nav-underline text-ink/60 hover:text-ink">
              GitHub
            </a>
            <a href={links.LINKEDIN_URL} className="nav-underline text-ink/60 hover:text-ink">
              LinkedIn
            </a>
            <a href={`mailto:${links.EMAIL}`} className="nav-underline text-ink/60 hover:text-ink">
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
