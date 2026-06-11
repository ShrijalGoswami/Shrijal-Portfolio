'use client';

import resume from '@/data/resume.json';
import { Pressable } from './motion';
import { GithubIcon, LinkedinIcon } from './icons';

const links = resume._EDIT_ME_FIRST;

const nav = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#terminal', label: 'Terminal' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a
          href="#top"
          className="text-lg italic font-semibold text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Shrijal Goswami
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-underline text-[13px] text-ink/70 hover:text-ink">
              {item.label}
            </a>
          ))}
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
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="whitespace-nowrap py-1 text-[13px] text-ink/70">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
