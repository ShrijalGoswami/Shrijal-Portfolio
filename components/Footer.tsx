import resume from '@/data/resume.json';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[13px] text-ink/55 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>© 2026 {resume.name} · {resume.location}</p>
        <p>Open to 2026 AI/ML internships · graduating 2028</p>
      </div>
    </footer>
  );
}
