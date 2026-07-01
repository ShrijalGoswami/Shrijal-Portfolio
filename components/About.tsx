'use client';

import resume from '@/data/resume.json';
import { Reveal, Stagger, Item, MaskReveal } from './motion';
import SkillCloud from './SkillCloud';

/**
 * About — rebuilt as an asymmetric bento. Instead of one prose column in a margin
 * grid, the story is broken into tiles a hirer can scan in any order: the thesis,
 * the current role, the stack, the proof points, the education. Each tile is its
 * own glass panel with an ember wash; the grid reflows to a single column on mobile.
 */
const STACK = Object.values(resume.skills).flat();

// One-line "what is this / how I use it" for each chip — surfaced on hover/focus.
const SKILL_INFO: Record<string, string> = {
  Python: 'My primary language — ML, data work, and backend services.',
  SQL: 'Relational queries for pulling and shaping data.',
  'C++': 'Performance-critical logic and data-structure fundamentals.',
  TypeScript: 'Typed JavaScript for tooling and web frontends — including this site.',
  'Scikit-learn': 'Classic ML: pipelines, models, and cross-validation.',
  XGBoost: 'Gradient-boosted trees for strong tabular performance.',
  'stacked ensembles': 'Level-0 models feeding a meta-learner that generalizes better than any single one.',
  'cross-validation': 'K-fold evaluation that measures real generalization, not memorization.',
  explainability: 'Source attribution and feature importance — models you can audit.',
  'RAG pipelines': 'Retrieval-augmented generation: grounded, cited LLM answers.',
  'BM25 + dense hybrid retrieval': 'Sparse keyword search + dense vectors, fused for better recall.',
  LangChain: 'Orchestration for LLM chains, tools, and retrievers.',
  ChromaDB: 'Vector store for dense embeddings and similarity search.',
  Groq: 'Low-latency LLM inference for grounded generation.',
  'Vertex AI': 'Google Cloud platform for training and serving models.',
  'Anthropic Claude API': 'Claude models behind production systems — the LLM powering the AI Tutor.',
  'content moderation': 'Input/output screening pipelines — the safety layer that keeps LLM systems child-safe.',
  FastAPI: 'Async Python APIs that serve models behind real endpoints.',
  'REST API design': 'Clean, versioned contracts for production services.',
  'data pipelines': 'Ingestion → cleaning → transformation, built to scale.',
  Pandas: 'Tabular data wrangling and feature engineering.',
  NumPy: 'Vectorized numerical computing under the hood.',
  'WhatsApp Cloud API': 'Serving an LLM tutor over WhatsApp — equations rendered as images where LaTeX can’t.',
};

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      {/* Header — deliberately NOT the margin-number motif used elsewhere */}
      <Reveal>
        <p className="t-label text-rust glow-rust">01 — About</p>
      </Reveal>
      <h2 className="t-h2 mt-4 max-w-3xl">
        <MaskReveal>Most AI demos die the moment they meet real traffic.</MaskReveal>
        <MaskReveal delay={0.12} className="text-rust glow-rust">
          <em>I work on the part that survives.</em>
        </MaskReveal>
      </h2>

      <Stagger className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Thesis — the big tile */}
        <Item className="md:col-span-4 md:row-span-2">
          <article className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-7 md:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgba(44,59,142,0.22), transparent)' }}
            />
            <p className="t-label relative text-ink/45">The pattern</p>
            <p className="relative mt-4 text-[17px] leading-relaxed text-ink/85">
              I&apos;m a B.Tech CS student (AI &amp; ML) at VIT Bhopal, and the pattern in everything
              I build is the same: take a result that works in a notebook and make it{' '}
              <span className="font-semibold text-ink">inspectable, measurable, and deployable.</span>{' '}
              Dense retrieval that misses exact keywords gets a sparse BM25 partner. A classifier
              that overfits gets stacked under a cross-validated meta-learner. A model that
              can&apos;t explain itself gets source attribution.
            </p>
            <p className="relative mt-5 text-[15px] leading-relaxed text-ink/65">
              I work on the unglamorous part of AI that has to keep running after the demo ends.
            </p>
          </article>
        </Item>

        {/* Now */}
        <Item className="md:col-span-2">
          <article className="glass relative h-full overflow-hidden rounded-3xl p-7">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rust/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rust" />
              </span>
              <span className="t-label text-rust">Now</span>
            </span>
            <p className="mt-4 text-xl leading-tight text-ink" style={{ fontFamily: 'var(--font-display)' }}>
              AI Strategist
            </p>
            <p className="mt-1 text-[14px] text-ink/60">AKademy38 · Australia-based EdTech</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink/55">
              Rebuilt a manual AI booklet workflow into a structured pipeline — ~10× lower token cost,
              consistent at scale.
            </p>
          </article>
        </Item>

        {/* Education */}
        <Item className="md:col-span-2">
          <article className="glass relative h-full overflow-hidden rounded-3xl p-7">
            <p className="t-label text-ink/45">Studying</p>
            <p className="mt-4 text-[15px] font-semibold leading-snug text-ink">
              {resume.education.degree}
            </p>
            <p className="mt-1 text-[13.5px] text-ink/55">{resume.education.school}</p>
            <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-[12px] text-ochre">
              {resume.education.years}
            </p>
          </article>
        </Item>

        {/* Stack — chips with a single shared description rail below them */}
        <Item className="md:col-span-4">
          <article className="glass relative h-full overflow-hidden rounded-3xl p-7">
            <p className="t-label text-ink/45">What I reach for</p>
            <div className="mt-4">
              <SkillCloud skills={STACK} info={SKILL_INFO} />
            </div>
          </article>
        </Item>

        {/* Highlights */}
        <Item className="md:col-span-2">
          <article className="glass relative flex h-full flex-col justify-center overflow-hidden rounded-3xl p-7">
            <p className="t-label text-ink/45">On the record</p>
            <ul className="mt-4 space-y-3">
              {resume.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-[14px] leading-snug text-ink/80">
                  <span aria-hidden className="mt-0.5 text-rust">★</span>
                  {h}
                </li>
              ))}
            </ul>
          </article>
        </Item>
      </Stagger>
    </section>
  );
}
