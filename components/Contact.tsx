'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import resume from '@/data/resume.json';
import SectionLabel from './SectionLabel';
import { Reveal, Magnetic } from './motion';
import { MailIcon, GithubIcon, LinkedinIcon, FileIcon } from './icons';

const links = resume._EDIT_ME_FIRST;

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const RATE_KEY = 'shrijal_contact_submit_time';
const RATE_MS = 60_000;

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

const CHANNELS = [
  { Icon: MailIcon, label: links.EMAIL, href: `mailto:${links.EMAIL}`, external: false },
  { Icon: LinkedinIcon, label: 'linkedin.com/in/shrijal-goswami', href: links.LINKEDIN_URL, external: true },
  { Icon: GithubIcon, label: 'github.com/ShrijalGoswami', href: links.GITHUB_URL, external: true },
  { Icon: FileIcon, label: 'Résumé (PDF)', href: links.RESUME_PDF_URL, external: true },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const sending = status.state === 'sending';

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
    'w-full rounded-lg border border-ink/15 bg-paper/70 px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-rust focus:bg-paper disabled:opacity-60';

  return (
    <section id="contact" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="06" title="Contact" />
        </div>

        <div className="md:col-span-9 md:col-start-4">
          <Reveal>
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase text-rust">
              {resume.availability}
            </p>
            <h2 className="t-h2 mt-4 max-w-2xl">
              If you need someone who treats <em className="text-rust">“it works on my machine”</em>{' '}
              as a bug report — let&apos;s talk.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/75">
              Internships, research, hackathons, or production AI work — send a note right here and it
              lands in my inbox. No sign-in, no redirect.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-5">
            {/* Direct channels */}
            <Reveal className="md:col-span-2">
              <div className="glass flex h-full flex-col rounded-xl p-6">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                  Reach me directly
                </h3>
                <div className="mt-5 space-y-2.5">
                  {CHANNELS.map(({ Icon, label, href, external }) => (
                    <a
                      key={label}
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-3 rounded-lg border border-ink/10 bg-paper/50 px-3.5 py-3 text-[13.5px] text-ink/75 transition-colors hover:border-rust/50 hover:bg-rust/[0.06] hover:text-ink"
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0 text-rust" />
                      <span className="truncate">{label}</span>
                      <span className="ml-auto text-ink/30 transition-colors group-hover:text-rust">↗</span>
                    </a>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Typical reply</p>
                  <p className="mt-1 text-[15px] font-semibold text-ink">Within 12 hours</p>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.08} className="md:col-span-3">
              <form onSubmit={handleSubmit} className="glass rounded-xl p-6" noValidate>
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                      Name
                    </span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={sending}
                      placeholder="Jane Recruiter"
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      disabled={sending}
                      placeholder="jane@company.com"
                      className={field}
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                    Message
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    disabled={sending}
                    placeholder="Hi Shrijal — we're hiring for an AI/ML role and your retrieval work caught my eye…"
                    className={`${field} resize-none`}
                  />
                </label>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 rounded-lg bg-rust px-6 py-3 text-[15px] font-semibold text-paper shadow-[0_16px_36px_-14px_rgba(194,65,12,0.55)] transition-colors hover:bg-ochre disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {sending ? 'Sending…' : 'Send message'}
                      {!sending && <span aria-hidden>→</span>}
                    </button>
                  </Magnetic>

                  <AnimatePresence mode="wait">
                    {status.state === 'sent' && (
                      <motion.p
                        key="sent"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[13.5px] font-medium text-rust"
                      >
                        ✓ Message sent — I’ll be in touch{status.note ? '.' : ' soon.'}
                      </motion.p>
                    )}
                    {status.state === 'error' && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[13.5px] font-medium text-clay"
                      >
                        {status.note}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {status.state === 'sent' && status.note && (
                  <p className="mt-3 text-[12px] text-ink/45">{status.note}</p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
