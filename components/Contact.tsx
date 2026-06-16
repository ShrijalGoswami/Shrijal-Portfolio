'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import resume from '@/data/resume.json';
import { Reveal, Magnetic } from './motion';
import { MailIcon, GithubIcon, LinkedinIcon, FileIcon } from './icons';

const links = resume._EDIT_ME_FIRST;

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const RATE_KEY = 'shrijal_contact_submit_time';
const RATE_MS = 60_000;

// Drop your own clip at /public/contact-bg.mp4 (and an optional poster frame at
// /public/contact-poster.jpg). Until then the deep-ink backdrop stands in cleanly.
const VIDEO_SRC = '/contact-bg.mp4';
const VIDEO_POSTER = '/contact-poster.jpg';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; note?: string }
  | { state: 'error'; note: string };

function isConfigured() {
  const vals = [SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY];
  return vals.every((v) => v && !v.includes('placeholder') && !v.includes('your_emailjs'));
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Direct channels — every contact path preserved: email, LinkedIn, GitHub, résumé.
const CHANNELS = [
  { Icon: MailIcon, label: 'Email', href: `mailto:${links.EMAIL}`, external: false },
  { Icon: LinkedinIcon, label: 'LinkedIn', href: links.LINKEDIN_URL, external: true },
  { Icon: GithubIcon, label: 'GitHub', href: links.GITHUB_URL, external: true },
  { Icon: FileIcon, label: 'Résumé', href: links.RESUME_PDF_URL, external: true },
];

export default function Contact() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const sending = status.state === 'sending';
  const sent = status.state === 'sent';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus({ state: 'error', note: 'Please fill in your name, email, and a message.' });
      return;
    }
    if (!validEmail(email)) {
      setStatus({ state: 'error', note: 'That email address doesn’t look right.' });
      return;
    }

    // Silently absorb bots (honeypot) — pretend success, send nothing.
    if (honeypot) {
      setStatus({ state: 'sent' });
      setForm({ name: '', email: '', message: '' });
      return;
    }

    // Light client-side throttle.
    const last = Number(localStorage.getItem(RATE_KEY) || 0);
    const now = Date.now();
    if (last && now - last < RATE_MS) {
      const wait = Math.ceil((RATE_MS - (now - last)) / 1000);
      setStatus({ state: 'error', note: `Just sent one — give it ${wait}s before sending another.` });
      return;
    }

    setStatus({ state: 'sending' });

    const params = { from_name: name, from_email: email, message, time: new Date().toLocaleString() };

    // No credentials configured → graceful sandbox so the form never looks broken.
    if (!isConfigured()) {
      setTimeout(() => {
        localStorage.setItem(RATE_KEY, Date.now().toString());
        setForm({ name: '', email: '', message: '' });
        setStatus({
          state: 'sent',
          note: 'Preview mode — set NEXT_PUBLIC_EMAILJS_* in .env to deliver real email.',
        });
      }, 900);
      return;
    }

    try {
      await emailjs.send(SERVICE_ID!, TEMPLATE_ID!, params, PUBLIC_KEY!);
      localStorage.setItem(RATE_KEY, Date.now().toString());
      setForm({ name: '', email: '', message: '' });
      setStatus({ state: 'sent' });
    } catch (err) {
      const text =
        (err as { text?: string })?.text || (err as Error)?.message || 'Something went wrong.';
      setStatus({
        state: 'error',
        note: `Couldn’t send (${text}). You can email me directly instead.`,
      });
    }
  };

  const field =
    'w-full rounded-xl border border-ink/15 bg-ink/[0.04] px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-rust focus:bg-ink/[0.08] focus:ring-1 focus:ring-rust/30 disabled:opacity-60';

  return (
    <section id="contact" className="border-t border-ink/10">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {/* Section eyebrow — keeps the field-notes margin motif as a calm opener */}
        <Reveal>
          <div className="mb-8 flex items-baseline gap-3">
            <span
              className="text-4xl font-light leading-none text-clay md:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
              aria-hidden
            >
              06
            </span>
            <p className="t-label text-ink/60">Contact</p>
            <span className="ml-1 hidden h-px w-10 bg-rust/60 md:inline-block" aria-hidden />
          </div>
        </Reveal>

        {/* Cinematic card */}
        <Reveal y={32}>
          <div className="relative isolate overflow-hidden rounded-3xl bg-black shadow-[0_40px_90px_-40px_rgba(43,26,18,0.55)]">
            {/* Background video — autoplay paused for reduced-motion visitors */}
            <video
              ref={videoRef}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={VIDEO_POSTER}
              autoPlay={!reduce}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />

            {/* Neutral, readable treatments — keep the footage's true colour.
                No tint: a subtle black vignette for cinematic depth + a localized
                bottom scrim only where the copy sits. */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(125% 115% at 50% 28%, transparent 46%, rgba(0,0,0,0.50) 100%)',
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
              aria-hidden
            />

            <div className="relative flex min-h-[34rem] flex-col gap-10 p-6 sm:min-h-[40rem] sm:p-10 lg:min-h-[44rem] md:p-14">
              {/* Availability badge — openness, stated up front */}
              <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12.5px] font-medium tracking-wide text-paper/90">
                <span className="relative flex h-2 w-2" aria-hidden>
                  {!reduce && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-75" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
                </span>
                Open to 2026 internships, research &amp; AI collaboration
              </div>

              {/* Breathing room — lets the film carry the space */}
              <div className="flex-1" />

              {/* The close: headline + direct channels, alongside the form */}
              <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.05fr_minmax(360px,440px)] lg:items-end lg:gap-12">
                {/* Left — the invitation */}
                <div>
                  <h2
                    className="t-display max-w-xl text-[2.1rem] text-paper drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-[2.6rem] lg:text-[3.1rem]"
                    style={{ lineHeight: 1.06 }}
                  >
                    Good systems begin
                    <br />
                    with a good <em className="italic text-clay">question</em>.
                  </h2>

                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/80">
                    Hiring for an AI/ML role, weighing a research idea, or have a system worth
                    building? Write below and it reaches my inbox directly — no portal, no
                    auto-reply.
                  </p>

                  {/* Direct channels — email, LinkedIn, GitHub, résumé all preserved */}
                  <div className="mt-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/50">
                      Or reach me directly
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {CHANNELS.map(({ Icon, label, href, external }) => (
                        <a
                          key={label}
                          href={href}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-medium text-paper/90 transition-colors hover:border-white/35 hover:bg-white/20"
                        >
                          <Icon className="h-[15px] w-[15px] text-clay transition-colors group-hover:text-paper" />
                          {label}
                        </a>
                      ))}
                    </div>
                    <p className="mt-4 text-[12.5px] text-paper/55">
                      Direct:{' '}
                      <a
                        href={`mailto:${links.EMAIL}`}
                        className="text-paper/80 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper hover:decoration-clay"
                      >
                        {links.EMAIL}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Right — the form, on a solid panel for effortless readability */}
                <Reveal delay={0.1} y={20}>
                  <div className="glass rounded-2xl p-5 sm:p-7">
                    <AnimatePresence mode="wait" initial={false}>
                      {sent ? (
                        // ── Success state ──────────────────────────────────
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col items-center py-8 text-center"
                        >
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rust/12 text-xl text-rust">
                            ✓
                          </span>
                          <h3 className="mt-4 text-[17px] font-semibold text-ink">
                            Message sent
                          </h3>
                          <p className="mt-1.5 max-w-xs text-[14px] leading-relaxed text-ink/60">
                            Thanks for reaching out — I’ll be in touch within 12 hours.
                          </p>
                          {status.state === 'sent' && status.note && (
                            <p className="mt-3 text-[12px] text-ink/40">{status.note}</p>
                          )}
                        </motion.div>
                      ) : (
                        // ── Form state ─────────────────────────────────────
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          onSubmit={handleSubmit}
                          noValidate
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-[18px] font-semibold tracking-tight text-ink">
                              Send a note
                            </h3>
                            <span className="text-[12px] text-ink/45">Replies in ~12h</span>
                          </div>

                          {/* honeypot */}
                          <input
                            type="text"
                            name="company"
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden
                            className="absolute left-[-9999px] h-0 w-0 opacity-0"
                          />

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <label className="block flex-1">
                              <span className="sr-only">Name</span>
                              <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                disabled={sending}
                                placeholder="Your name"
                                className={field}
                              />
                            </label>
                            <label className="block flex-1">
                              <span className="sr-only">Email</span>
                              <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                disabled={sending}
                                placeholder="you@company.com"
                                className={field}
                              />
                            </label>
                          </div>

                          <label className="mt-3 block">
                            <span className="sr-only">Message</span>
                            <textarea
                              required
                              rows={4}
                              value={form.message}
                              onChange={(e) => setForm({ ...form, message: e.target.value })}
                              disabled={sending}
                              placeholder="A line about the role, problem, or system you have in mind…"
                              className={`${field} resize-none`}
                            />
                          </label>

                          <div className="mt-5">
                            <Magnetic className="w-full">
                              <button
                                type="submit"
                                disabled={sending}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rust px-6 py-3.5 text-[15px] font-semibold text-paper shadow-[0_16px_36px_-14px_rgba(194,65,12,0.55)] transition-colors hover:bg-ochre disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {sending ? 'Sending…' : 'Send message'}
                                {!sending && <span aria-hidden>→</span>}
                              </button>
                            </Magnetic>

                            <AnimatePresence>
                              {status.state === 'error' && (
                                <motion.p
                                  key="error"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="mt-3 text-[13px] font-medium text-clay"
                                >
                                  {status.note}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
