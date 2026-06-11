'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import resume from '@/data/resume.json';
import { Magnetic, Pressable } from '../motion';
import { GithubIcon, LinkedinIcon, FileIcon, MailIcon } from '../icons';
import { hero } from './store';

gsap.registerPlugin(ScrollTrigger);

const KnowledgeScene = dynamic(() => import('./KnowledgeScene'), { ssr: false });

const links = resume._EDIT_ME_FIRST;

export default function LivingHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion: everything is already revealed; skip the scroll choreography.
    if (reduce) {
      hero.target = 1;
      hero.reduced = true;
      gsap.set('.hero-identity', { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set('.hero-hint, .hero-cue', { opacity: 0 });
      gsap.set('.hero-veil', { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set('.hero-hint', { opacity: 0 });
      gsap.set('.hero-cue', { opacity: 1 });
      gsap.set('.hero-veil', { opacity: 0 });
      gsap.set('.hero-identity', { opacity: 0, y: 26, filter: 'blur(16px)' });

      // Feed smoothed scroll progress to the 3D scene.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          hero.target = self.progress;
        },
      });

      // Scrubbed DOM choreography across the same scroll range. Tween positions are
      // expressed as scroll fractions (timeline progress maps linearly under scrub).
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      });
      tl.to('.hero-hint', { opacity: 1, duration: 0.04 }, 0.03)
        .to('.hero-cue', { opacity: 0, duration: 0.05 }, 0.08)
        .to('.hero-hint', { opacity: 0, duration: 0.06 }, 0.18)
        .to('.hero-veil', { opacity: 1, duration: 0.12 }, 0.82)
        .to('.hero-identity', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.13 }, 0.84);

      // Layout settles after fonts/canvas mount.
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative"
      style={{ height: reduce ? '100svh' : '560vh', background: '#fcfbf8' }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <KnowledgeScene />

        {/* Depth vignette — pushes the network into the page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(43,26,18,0.05) 100%)',
          }}
        />

        {/* Soft veil that lifts the identity out of the network at the climax. */}
        <div
          aria-hidden
          className="hero-veil pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(75% 60% at 50% 50%, rgba(252,251,248,0.97) 0%, rgba(252,251,248,0.78) 40%, rgba(252,251,248,0.2) 70%, transparent 85%)',
          }}
        />

        {/* Opening invitation. */}
        <div className="hero-hint pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-ink/45">
            Move your cursor — then scroll
          </p>
        </div>

        {/* Scroll cue — tucked into the corner so it never fights the action dock. */}
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

        {/* Identity — resolves only once the system has formed. */}
        <div className="hero-identity pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-rust">
            {resume.availability}
          </p>
          <h1
            className="mt-5 text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98] tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
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
