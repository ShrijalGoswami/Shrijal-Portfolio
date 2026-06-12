'use client';

import SectionLabel from './SectionLabel';
import { Stagger, Item } from './motion';

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <SectionLabel n="01" title="About" />
        </div>

        <Stagger className="md:col-span-8 md:col-start-5">
          <Item>
            <h2 className="t-h2 max-w-2xl">
              Most AI demos die the moment they meet real traffic.
              <em className="text-rust"> I work on the part that survives.</em>
            </h2>
          </Item>

          <Item className="mt-8 max-w-2xl space-y-5 text-[16px] leading-relaxed text-ink/75">
            <p>
              I&apos;m a B.Tech CS student (AI &amp; ML specialization) at VIT Bhopal, and the
              pattern in everything I build is the same: take a result that works in a notebook and
              make it inspectable, measurable, and deployable. Dense retrieval that misses exact
              keywords gets a sparse BM25 partner. A classifier that overfits gets stacked under a
              cross-validated meta-learner. A model that can&apos;t explain itself gets source
              attribution.
            </p>
            <p>
              Right now that means working as an AI Strategist at AKademy38, an Australia-based
              EdTech startup — where I rebuilt their manual AI booklet-generation workflow into a
              structured pipeline that cut token usage roughly 10× per booklet (≈40% → ≈4%) while
              keeping output consistent at scale. That role grew out of an AI/ML internship at
              Pinnacle Labs, where I shipped Python AI components behind FastAPI backends and tuned
              retrieval against real latency budgets — plus open-source contribution through GSSoC
              &apos;26 and a finalist run at the DataForge hackathon.
            </p>
          </Item>

          <Item>
            <p className="mt-8 border-l-2 border-rust pl-4 text-[15px] italic text-ink/70">
              What I bring to a team: practical ML (Scikit-learn, XGBoost), retrieval/LLM plumbing
              (LangChain, ChromaDB, Groq, Vertex AI), and the FastAPI engineering to put both behind
              an endpoint that doesn&apos;t fall over.
            </p>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
