# Shrijal Goswami — Portfolio

A warm, editorial "engineering field-notes" portfolio. Next.js (App Router) + TypeScript +
Tailwind CSS, fully static, deployable to Vercel with zero config.

The centerpiece is a **real interactive terminal** — actual command parsing over structured
résumé data, with history (↑/↓), tab-completion, and a blinking cursor. No scripted typing.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

## Edit the content

**All content lives in [`data/resume.json`](data/resume.json).** The header, hero, experience,
projects, contact section, and every terminal command read from it.

Start with the `_EDIT_ME_FIRST` block at the top and replace the four placeholders:

| Placeholder      | Replace with                                  |
| ---------------- | --------------------------------------------- |
| `GITHUB_URL`     | your GitHub profile URL                       |
| `LINKEDIN_URL`   | your LinkedIn profile URL                     |
| `EMAIL`          | your email address                            |
| `RESUME_PDF_URL` | e.g. `/Shrijal_Goswami_Resume.pdf` (in `public/`) |

Then edit experience, projects, skills, etc. in the same file — the site and terminal update
automatically.

## Terminal commands

`help` · `whoami` · `skills` · `projects` · `experience` · `education` · `contact` · `ls` ·
`cat resume` · `clear` — plus ↑/↓ history and Tab completion.

A commented `// TODO: wire to /api/ask` seam in
[`components/Terminal.tsx`](components/Terminal.tsx) marks where a real LLM-backed API route
(RAG over the résumé) could be added later.

## Deploy to Vercel

```bash
npx vercel
```

Or push the repo to GitHub and import it at [vercel.com/new](https://vercel.com/new) —
no configuration needed.

## Design notes

- **Palette:** warm paper `#FBF6EE`, ink `#2B1A12`, rust `#C2410C`, ochre `#D97706`,
  clay `#E8927C`, sand `#F3E3D0`. One warm family + one dark — no blue, no purple.
- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display),
  [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) (body),
  JetBrains Mono (terminal/code only).
- **Motion (Framer Motion):** masked line-by-line hero reveal, staggered scroll reveals,
  card lift/tilt with shifting warm washes on hover, drifting ambient washes, magnetic
  CTAs, a flowing RAG-pipeline pulse, and an animated terminal boot sequence.
  `prefers-reduced-motion` falls back to simple fades / static.

## Verify

With the production server running on `:3000`:

```bash
npm run verify
```

Screenshots the site at mobile/tablet/desktop widths, checks for horizontal overflow and
console errors, and exercises every terminal command (including history, tab-completion,
and `clear`).
