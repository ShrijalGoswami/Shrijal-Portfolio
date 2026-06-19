'use client';

import { useEffect, useState } from 'react';
import resume from '@/data/resume.json';
import { Pressable } from './motion';
import { GithubIcon, LinkedinIcon } from './icons';

const links = resume._EDIT_ME_FIRST;

const nav = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#research', label: 'Applied R&D' },
  { href: '#terminal', label: 'Terminal' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  // Condense the bar once the hero scrolls away.
  const [scrolled, setScrolled] = useState(false);
  // Live "you are here" — the section currently crossing the upper third.
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // The band sits near the top: a section is "active" while it's crossing
      // roughly the upper third of the viewport.
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-ink/10 bg-[#eff0eb]/95 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.6)]'
          : 'border-transparent bg-[#eff0eb]/80'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 md:px-8 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <a
          href="#top"
          className="text-lg italic font-semibold text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shrijal Goswami
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {nav.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={`nav-underline text-[13px] transition-colors ${
                  isActive ? 'is-active font-medium text-ink' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={links.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden text-ink/55 transition-colors hover:text-rust sm:inline-flex"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={links.LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hidden text-ink/55 transition-colors hover:text-rust sm:inline-flex"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <Pressable
            href={links.RESUME_PDF_URL}
            lift={-2}
            className="rounded-md bg-rust px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-ochre"
          >
            Resume
          </Pressable>
        </div>
      </div>

      <nav
        aria-label="Primary mobile"
        className="flex items-center gap-5 overflow-x-auto border-t border-ink/10 px-5 py-2 sm:hidden"
      >
        {nav.map((item) => {
          const isActive = active === item.href.slice(1);
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'true' : undefined}
              className={`whitespace-nowrap py-1 text-[13px] transition-colors ${
                isActive ? 'font-medium text-rust' : 'text-ink/70'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
