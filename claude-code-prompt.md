# Claude Code prompt — Portfolio rebuild, ONE-SHOT (use with Fable 5)

> Attach the 4 screenshots of my current portfolio first, select Fable 5, paste this,
> and let it run end-to-end without stopping.

---

Build my personal portfolio site completely, in one autonomous session — plan, build,
test, self-verify, and fix, all the way to a working deployable site. Do NOT stop to ask
me questions or wait for approval between steps; make reasonable decisions and keep going
until it's done and verified. The 4 attached screenshots are the CURRENT version and
represent what I do NOT want — study them, then replace them entirely.

## Who I am (real content — use this, do not invent placeholders)
- **Name:** Shrijal Goswami
- **Role:** AI/ML engineer. B.Tech CS (AI & ML specialization) @ VIT Bhopal.
- **Focus:** turning research into production-grade systems — hybrid retrieval (RAG:
  dense vector + sparse BM25), stacked ensembles, explainable/inspectable AI.
- **Current:** AI Intern @ Pinnacle Labs (Kolkata, remote, May 2026). Architecting modular
  Python AI components, integrating ML workflows with FastAPI REST backends, tuning
  hybrid-retrieval weights and chunk-sizing to cut latency at scale.
- **Also:** GSSoC '26 contributor, Data Science Club @ VIT Bhopal, DataForge finalist.
- **Stack:** Python, FastAPI, Scikit-learn, XGBoost, LangChain, Groq, Vertex AI, ChromaDB,
  RAG pipelines, data pipelines.
- **Open to:** 2026 AI/ML internships & new-grad roles.
- **Links:** use these placeholders and leave them clearly marked at the top of
  `data/resume.json` so I can swap them: GITHUB_URL, LINKEDIN_URL, EMAIL, RESUME_PDF_URL.

## What's wrong with the current version (fix all of these)
1. Indigo/violet (#6366F1-family) everywhere — the most overused AI-portfolio color. Gone entirely.
2. Purple gradient text on headings ("Goswami", "anything", "shipped"). Cut it.
3. Giant 3D wireframe sphere/orb in the hero — pure decoration, means nothing. Remove it.
4. Decorative noise: starfield dots, glow orbs, mesh backgrounds. Strip to atmosphere that serves the design.
5. Unlabeled stat row (89.13% / 0.94 / Hybrid / Pinnacle) — reads as filler. Give each a real label + context, or cut it.
6. Monospace used as decoration everywhere to look "techy". Mono belongs ONLY in the terminal and inline code.
7. It tries to LOOK sophisticated instead of BEING substantive. Invert that.

## Design direction (commit fully — no drifting to defaults)
- **Aesthetic:** warm "engineering field-notes" — confident, restrained, editorial, not flashy.
- **Palette (warm light):** ground `#FBF6EE` (warm paper, NOT cream-white, NOT pure white);
  ink `#2B1A12` (deep roasted brown); primary `#C2410C` (rust); support `#D97706` (ochre),
  `#E8927C` (clay), `#F3E3D0` (sand). One warm family + one dark. NO blue, NO purple.
- **Type:** a DISTINCTIVE display face with real character — NOT Inter, Roboto, Arial, system
  fonts, and explicitly NOT Space Grotesk (overused). Pair with a clean readable body sans, plus
  a real monospace (JetBrains Mono or IBM Plex Mono) for terminal/code only.
- **Light glass done right:** if using frosted panels, put soft warm color washes behind them so
  the glass refracts something; add `saturate()` to the blur. White-on-white is not glass.
- **Layout:** asymmetric and intentional, generous negative space, one memorable structural idea.
  Avoid the centered-everything template look.
- **Motion:** restrained — one orchestrated staggered page-load reveal over scattered micro-anims.
  Respect `prefers-reduced-motion`.

## The terminal — make it REAL (no scripted typing)
Replace the fake "Ask my resume anything" terminal with a genuinely interactive one,
client-side, no backend:
- Resume stored as structured JSON in `data/resume.json`.
- Real commands that look the data up live: `help`, `whoami`, `skills`, `projects`,
  `experience`, `education`, `contact`, `ls`, `cat resume`, `clear`.
- Real input handling: command history (up/down arrows), tab-completion if feasible,
  unknown-command handling, blinking cursor. No fake typing animation.
- Keep a "pipeline" visual ONLY as an honest, static diagram of my actual RAG architecture;
  if it would just be decoration, cut it.
- Leave a commented `// TODO: wire to /api/ask` seam where a real LLM endpoint could later be
  added as a Next.js API route — do NOT build that backend now.

## Sections
Hero, About, Experience/Timeline (Pinnacle Labs current + Data Science Club), Projects
(use my real focus areas — RAG/hybrid retrieval, stacking ensembles, FastAPI ML services),
the real Terminal, Contact. Header nav + resume button.

## Tech & quality bar
- Next.js 14 (App Router) + Tailwind + TypeScript. Deployable to Vercel with zero config.
- Fully responsive (mobile/tablet/desktop). Accessible: semantic HTML, keyboard nav, visible
  focus states, AA contrast, alt text, reduced-motion.
- Clean component structure, no dead code, no unused deps.
- `README.md`: how to run, how to edit content (`data/resume.json`), how to deploy to Vercel.

## Execute autonomously, then self-verify before finishing
Work straight through without pausing for me. When the build is complete:
1. Run the dev server and confirm it builds with no errors.
2. Use your vision capability to screenshot the result at mobile, tablet, and desktop widths.
3. Critique your own screenshots against every point in this brief — especially the palette
   (no purple/blue), fonts (distinctive, not Space Grotesk), removed sphere/noise, and the
   terminal actually working. Fix anything that falls short, then re-verify.
4. Manually test each terminal command works.
Only report back when it's built, verified, and passing your own critique. Give me a short
summary of what you built, your font/layout choices, and the exact commands to run and deploy.
```
npm install && npm run dev
```
