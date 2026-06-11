import resume from '@/data/resume.json';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[13px] text-ink/55 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          © 2026 {resume.name}. Set in Fraunces &amp; Hanken Grotesk on warm paper.
        </p>
        <p>
          {resume.location} · content lives in{' '}
          <code className="rounded bg-sand px-1 py-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            data/resume.json
          </code>
        </p>
      </div>
    </footer>
  );
}
