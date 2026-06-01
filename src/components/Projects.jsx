import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal, Brain, Sliders, CheckCircle2, ChevronRight, FileText, Activity, Zap, User, BookOpen, Briefcase, Code2, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { use3DTilt } from '../hooks/use3DTilt';

const Github = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// HTML5 Canvas ECG Heartbeat Wave Simulator
const EKGCanvas = ({ riskScore = 20 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let x = 0;
    const points = [];
    
    // Heart frequency calculated from risk score:
    // Safe/normal risk = ~65 bpm, High Risk = ~110 bpm (tachycardia EKG readout)
    const bpm = riskScore > 50 ? 110 : 65;
    const speed = (bpm / 60) * 2.8;

    const draw = () => {
      // Create trailing blur effect
      ctx.fillStyle = 'rgba(7, 7, 10, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Color coding wave: Red warning for high risk, bright cyber emerald for safe
      ctx.strokeStyle = riskScore > 50 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(52, 211, 153, 0.85)';
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      
      x += speed;
      if (x > width) x = 0;

      // Draw ECG PQRST complex structure mathematically
      let y = height / 2;
      const cycle = 70;
      const phase = x % cycle;

      if (phase > 12 && phase < 18) { // P-Wave (atrial depolarization)
        y -= Math.sin((phase - 12) * Math.PI / 6) * 3;
      } else if (phase >= 20 && phase < 22) { // Q-Wave
        y += (phase - 20) * 2.5;
      } else if (phase >= 22 && phase < 25) { // R-Wave (ventricular depolarization peak)
        y -= (25 - phase) * 7.5 - (phase - 22) * 7.5;
      } else if (phase >= 25 && phase < 27) { // S-Wave
        y += (phase - 25) * 3.5;
      } else if (phase >= 34 && phase < 45) { // T-Wave (ventricular repolarization)
        y -= Math.sin((phase - 34) * Math.PI / 11) * 4.5;
      }

      points.push({ x, y });
      if (points.length > 220) points.shift();

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(points[i].x, points[i].y);
        } else {
          // If cursor wrapped around, break current path stroke to avoid vertical lines
          if (points[i].x > points[i - 1].x) {
            ctx.lineTo(points[i].x, points[i].y);
          } else {
            ctx.moveTo(points[i].x, points[i].y);
          }
        }
      }
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [riskScore]);

  return (
    <div className="space-y-1">
      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block flex justify-between">
        <span>EKG REAL-TIME DIAGNOSTIC READOUT</span>
        <span className={riskScore > 50 ? "text-red-400" : "text-emerald-400"}>
          {riskScore > 50 ? "TACHYCARDIA_TRIGGER" : "NORMAL_SINUS_RHYTHM"}
        </span>
      </span>
      <canvas ref={canvasRef} className="w-full h-12 bg-[#050508] border border-white/[0.03] rounded-lg" />
    </div>
  );
};

const ProjectContainer = ({ children }) => {
  const { tiltStyle, glareStyle, handleMouseMove, handleMouseLeave } = use3DTilt(3, 1.005);
  return (
    <div
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-panel border border-white/[0.04] rounded-2xl overflow-hidden grid lg:grid-cols-12 gap-0 relative shadow-xl bg-[#0b0b12]/40"
    >
      <div style={{ ...glareStyle, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
      {children}
    </div>
  );
};

// NLP pipeline stages displayed in the resume parsing animation
const NLP_STAGES = [
  { id: 'parse',   label: 'PDF Text Extraction',     color: 'text-amber-400',   icon: '📄', detail: 'PyMuPDF / pdfplumber layer' },
  { id: 'ner',     label: 'Named Entity Recognition', color: 'text-teal-400',    icon: '🏷️', detail: 'spaCy NER + custom patterns' },
  { id: 'skills',  label: 'Skills Detection',         color: 'text-cyan-400',    icon: '⚡', detail: 'Token classification + taxonomy' },
  { id: 'edu',     label: 'Education Extraction',     color: 'text-purple-400',  icon: '🎓', detail: 'Regex + section-heading parser' },
  { id: 'exp',     label: 'Experience Analysis',      color: 'text-indigo-400',  icon: '💼', detail: 'Date chunker + org classifier' },
  { id: 'profile', label: 'Candidate Profiling',      color: 'text-emerald-400', icon: '✅', detail: 'Structured JSON output → ATS' },
];

const DEMO_RESUME_FIELDS = [
  { key: 'name',       val: 'Shrijal Goswami',              label: 'Candidate',    color: 'text-amber-300' },
  { key: 'email',      val: 'shrijal@example.com',           label: 'Email',        color: 'text-teal-300' },
  { key: 'skills',     val: 'Python · NLP · FastAPI · ML',  label: 'Skills',       color: 'text-cyan-300' },
  { key: 'education',  val: 'B.Tech CS – 2026',             label: 'Education',    color: 'text-purple-300' },
  { key: 'experience', val: 'AI Intern – Pinnacle Labs',    label: 'Experience',   color: 'text-indigo-300' },
  { key: 'ats_score',  val: '91 / 100',                     label: 'ATS Score',    color: 'text-emerald-400' },
];

const Projects = () => {
  const [activeTabs, setActiveTabs] = useState({
    rag: 'specs',
    heart: 'specs',
    resume: 'specs',
  });

  // --- PLAYGROUND 1 STATE (Explainable RAG) ---
  const [hybridAlpha, setHybridAlpha] = useState(0.65);

  const ragDataset = [
    {
      id: "doc_1",
      title: "Pinnacle Labs AI Internship Profile",
      denseMatch: 0.94,
      sparseMatch: 0.21,
      snippet: "Role includes building modular Python AI components, designing production-grade FastAPI backends, and tuning retrieval weights."
    },
    {
      id: "doc_2",
      title: "Skills & Core Technologies List",
      denseMatch: 0.72,
      sparseMatch: 0.88,
      snippet: "Strong core language skills in Python, C++, and SQL, with libraries Scikit-learn, XGBoost, and FastAPI backend frameworks."
    },
    {
      id: "doc_3",
      title: "Heart Disease Predictor Spec",
      denseMatch: 0.65,
      sparseMatch: 0.45,
      snippet: "Employs a hybrid stacking generalization ensemble over UCI database. Integrated ChromaDB and LangChain for patient Q&A."
    }
  ];

  const calculateHybridScore = (dense, sparse) => {
    return (hybridAlpha * dense + (1 - hybridAlpha) * sparse).toFixed(3);
  };

  const sortedRAGResults = [...ragDataset]
    .map(doc => ({
      ...doc,
      score: parseFloat(calculateHybridScore(doc.denseMatch, doc.sparseMatch))
    }))
    .sort((a, b) => b.score - a.score);

  // --- PLAYGROUND 2 STATE (Heart Disease Predictor) ---
  const [patientAge, setPatientAge] = useState(58);
  const [patientChol, setPatientChol] = useState(254);
  const [patientHR, setPatientHR] = useState(132);
  const [angina, setAngina] = useState(true);
  const [evalLogs, setEvalLogs] = useState([]);
  const [predResult, setPredResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const runHeartInference = () => {
    setEvaluating(true);
    setPredResult(null);
    setEvalLogs([
      "1. Triggering inference endpoint `/api/v1/predict/heart`...",
      "2. Loaded Patient Profile variables. Initializing feature tensors...",
      "3. Applying StandardScaler normalization: mapped Age -> 0.42, Chol -> 0.68, MaxHR -> -0.32",
      "4. Feeding features to Level-0 base estimators...",
    ]);

    setTimeout(() => {
      setEvalLogs(prev => [
        ...prev,
        "5. RF Estimator probability: 0.762 | XGBoost Estimator probability: 0.841 | Logistic Reg probability: 0.785",
        "6. Feeding Level-0 probabilities vector [0.762, 0.841, 0.785] to Level-1 Meta-Learner (Logistic Regression)..."
      ]);
    }, 700);

    setTimeout(() => {
      let baseRisk = 20;
      if (patientAge > 55) baseRisk += 20;
      if (patientChol > 240) baseRisk += 15;
      if (patientHR < 140) baseRisk += 15;
      if (angina) baseRisk += 22;

      const finalRisk = Math.min(baseRisk, 98);

      setPredResult({
        risk: finalRisk,
        classification: finalRisk > 50 ? "High Diagnostic Priority" : "Normal / Low Priority",
        rfVal: 0.762,
        xgbVal: 0.841,
        lrVal: 0.785,
        contributor: angina ? "Angina (Exercise Induced)" : patientChol > 240 ? "Hypercholesterolemia (Chol > 240)" : "Age (> 55)"
      });
      setEvalLogs(prev => [...prev, `7. Ensemble Output synthesized. Prediction successfully cached. Status 200 OK.`]);
      setEvaluating(false);

      if (finalRisk > 50) {
        confetti({
          particleCount: 30,
          spread: 40,
          colors: ['#ef4444', '#f97316']
        });
      }
    }, 1400);
  };

  // --- PLAYGROUND 3 STATE (Resume Intelligence) ---
  const [resumeParsing, setResumeParsing] = useState(false);
  const [resumeStageIdx, setResumeStageIdx] = useState(-1);
  const [resumeFields, setResumeFields] = useState([]);
  const [resumeDone, setResumeDone] = useState(false);

  const runResumeParser = () => {
    if (resumeParsing) return;
    setResumeParsing(true);
    setResumeStageIdx(0);
    setResumeFields([]);
    setResumeDone(false);

    NLP_STAGES.forEach((_, i) => {
      setTimeout(() => {
        setResumeStageIdx(i);
        if (i < DEMO_RESUME_FIELDS.length) {
          setResumeFields(prev => [...prev, DEMO_RESUME_FIELDS[i]]);
        }
        if (i === NLP_STAGES.length - 1) {
          setTimeout(() => {
            setResumeParsing(false);
            setResumeDone(true);
            confetti({ particleCount: 45, spread: 55, colors: ['#f59e0b', '#2dd4bf', '#818cf8'] });
          }, 400);
        }
      }, i * 520);
    });
  };

  return (
    <section id="projects" className="py-20 border-t border-white/[0.04] relative">
      <div className="max-w-6xl mx-auto z-10 relative">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-white/[0.04] bg-[#0e0e14] px-3 py-1 rounded-full text-[10px] text-zinc-400 font-mono mb-4">
            <Brain className="h-3.5 w-3.5 text-indigo-400" />
            <span>/system/core/projects</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            CORE AI SYSTEMS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-mono">
            Engineering-first projects featuring system architectures, metrics, and fully-functional live model playgrounds.
          </p>
        </div>

        {/* PROJECTS CONTAINER */}
        <div className="space-y-16">

          {/* PROJECT 1: EXPLAINABLE RAG QA */}
          <ProjectContainer>

            {/* Project Info Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.04] z-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono bg-indigo-950/20 text-indigo-400 border border-indigo-900/30 rounded px-2.5 py-0.5">
                    RETRIEVAL ENGINE
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/Shri-AI-ML/Explainable-RAG-QA-System"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-md hover:border-indigo-500/20 text-zinc-400 hover:text-white transition-all"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Explainable RAG QA System</h3>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Python · FastAPI · ChromaDB · BM25 · Groq API · LangChain</p>

                {/* Tab Switcher */}
                <div className="flex gap-2 border-b border-white/[0.04] py-3 mt-4">
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, rag: 'specs' }))}
                    className={`text-[10px] font-mono pb-1 border-b cursor-pointer ${activeTabs.rag === 'specs' ? 'border-indigo-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    System Architecture
                  </button>
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, rag: 'playground' }))}
                    className={`text-[10px] font-mono pb-1 border-b flex items-center gap-1.5 cursor-pointer ${activeTabs.rag === 'playground' ? 'border-indigo-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                    Live Playground
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="mt-4 min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeTabs.rag === 'specs' ? (
                      <motion.div
                        key="specs-rag"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-xs text-zinc-400"
                      >
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">PROBLEM:</span>
                          <p className="leading-relaxed">
                            Dense vectors capture semantic context but miss exact keyword identifiers (e.g., function names, model codes). Plain LLMs hallucinate sources.
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">ARCHITECTURE:</span>
                          <p className="leading-relaxed">
                            A hybrid retrieval chain routing queries via parallel pathways: BM25 (sparse tf-idf) + Sentence-Transformers (dense Cosine embeddings over ChromaDB). Merges scores linearly before Groq synthesis.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Retrieval Latency</span>
                            <span className="text-emerald-400 font-mono font-bold text-xs">~45ms at scale</span>
                          </div>
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Context Grounding</span>
                            <span className="text-indigo-400 font-mono font-bold text-xs">100% Attributed</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play-rag"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-xs font-mono text-zinc-450"
                      >
                        <p className="leading-normal text-zinc-500">
                          // Simulate the linear hybrid combination weights in real-time. Slide the Alpha parameter below to observe rank-reversal.
                        </p>
                        <div className="p-4 bg-black/40 border border-white/[0.03] rounded-lg space-y-3">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-zinc-400">Hybrid Alpha Weight (α):</span>
                            <span className="text-indigo-400 font-bold">{hybridAlpha.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={hybridAlpha}
                            onChange={(e) => setHybridAlpha(parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                          <div className="flex justify-between text-[8px] text-zinc-650">
                            <span>100% BM25 (Keyword)</span>
                            <span>50/50 Balanced</span>
                            <span>100% Vector (Semantic)</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Specs Footer */}
              <div className="pt-4 border-t border-white/[0.04] text-[9px] text-zinc-550 font-mono flex items-center justify-between">
                <span>Scalability: Incremental indexing chunks</span>
                <span>Future: Cohere Rerank integration</span>
              </div>
            </div>

            {/* Playground / Visual Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-white/[0.01] flex flex-col justify-center z-10">
              {activeTabs.rag === 'specs' ? (
                /* Static Architecture Graph */
                <div className="p-5 bg-black/50 border border-white/[0.03] rounded-xl space-y-3 font-mono text-[10px]">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold block text-[8px] border-b border-white/[0.03] pb-2">Pipeline execution stack</span>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-white/[0.03] rounded">
                      <span className="text-zinc-400">1. Input Query Parsing</span>
                      <span className="text-indigo-400 font-semibold">FastAPI</span>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-zinc-500 block text-[8px]">BM25 (Sparse)</span>
                        <span className="text-amber-400">Keyword Index</span>
                      </div>
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-zinc-500 block text-[8px]">ChromaDB (Dense)</span>
                        <span className="text-indigo-400">Cosine Vector</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-white/[0.03] rounded">
                      <span className="text-zinc-400">2. Linear Hybrid Fusion</span>
                      <span className="text-emerald-400">Score Re-ranking</span>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-white/[0.03] rounded">
                      <span className="text-zinc-400">3. Source-Attributed Answer</span>
                      <span className="text-purple-400">Groq LLM Generation</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dynamic Hybrid Search Results Playground with segmented bar visualization */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold uppercase text-zinc-500">Live Search Rank Output:</span>
                    <span className="text-[9px] font-mono text-zinc-600">Query: "Pinnacle Labs"</span>
                  </div>
                  <div className="space-y-2.5 font-mono text-[10px]">
                    {sortedRAGResults.map((doc, idx) => {
                      const vectorPct = doc.denseMatch * hybridAlpha;
                      const sparsePct = doc.sparseMatch * (1 - hybridAlpha);
                      const sum = vectorPct + sparsePct;
                      const vectorRatio = sum > 0 ? (vectorPct / sum) * 100 : 0;
                      const sparseRatio = sum > 0 ? (sparsePct / sum) * 100 : 0;

                      return (
                        <div
                          key={doc.id}
                          className={`p-3.5 border rounded-lg transition-all duration-300 ${idx === 0
                              ? 'bg-indigo-950/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.08)]'
                              : 'bg-[#0a0a0f] border-white/[0.03]'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-semibold text-xs ${idx === 0 ? 'text-indigo-300' : 'text-zinc-400'}`}>
                              #{idx + 1} {doc.title}
                            </span>
                            <span className={`text-[9px] border px-1.5 py-0.2 rounded ${idx === 0 ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                              Score: {doc.score}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2 mb-2.5">{doc.snippet}</p>
                          
                          {/* Segmented Weight Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden flex">
                              <div 
                                className="bg-indigo-500 h-full transition-all duration-200"
                                style={{ width: `${vectorRatio}%` }}
                                title={`Vector component: ${vectorRatio.toFixed(1)}%`}
                              />
                              <div 
                                className="bg-purple-500 h-full transition-all duration-200"
                                style={{ width: `${sparseRatio}%` }}
                                title={`BM25 component: ${sparseRatio.toFixed(1)}%`}
                              />
                            </div>
                            <div className="flex justify-between text-[8px] text-zinc-600">
                              <span>Vector Weight: {vectorPct.toFixed(3)}</span>
                              <span>BM25 Weight: {sparsePct.toFixed(3)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </ProjectContainer>

          {/* PROJECT 2: HEART DISEASE ENSEMBLE */}
          <ProjectContainer>

            {/* Project Info Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.04] z-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono bg-purple-950/20 text-purple-400 border border-purple-900/30 rounded px-2.5 py-0.5">
                    DIAGNOSTIC ENSEMBLE
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/Shri-AI-ML/Heart-Disease-Prediction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-md hover:border-indigo-500/20 text-zinc-400 hover:text-white transition-all"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Heart Disease Prediction System</h3>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Python · Scikit-learn · XGBoost · FastAPI · Streamlit · ChromaDB</p>

                {/* Tab Switcher */}
                <div className="flex gap-2 border-b border-white/[0.04] py-3 mt-4">
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, heart: 'specs' }))}
                    className={`text-[10px] font-mono pb-1 border-b cursor-pointer ${activeTabs.heart === 'specs' ? 'border-indigo-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    System Architecture
                  </button>
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, heart: 'playground' }))}
                    className={`text-[10px] font-mono pb-1 border-b flex items-center gap-1.5 cursor-pointer ${activeTabs.heart === 'playground' ? 'border-indigo-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    <Activity className="h-3.5 w-3.5 text-indigo-400" />
                    Live Playground
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="mt-4 min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeTabs.heart === 'specs' ? (
                      <motion.div
                        key="specs-heart"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-xs text-zinc-400"
                      >
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">PROBLEM:</span>
                          <p className="leading-relaxed">
                            Single classifiers suffer from generalization gaps on medical diagnostic datasets. Black-box models cannot offer explanations of decision boundaries.
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">SOLUTION:</span>
                          <p className="leading-relaxed">
                            Stacked Generalization combining Level-0 classifiers (Random Forest + XGBoost + Logistic Regression) via a meta-learner. Integrated local RAG for contextual patient file reference.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Ensemble Accuracy</span>
                            <span className="text-emerald-400 font-mono font-bold text-xs">89.13% Cross-Validated</span>
                          </div>
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Generalization AUC</span>
                            <span className="text-indigo-400 font-mono font-bold text-xs">0.94 ROC-AUC Score</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play-heart"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-3.5 text-xs font-mono text-zinc-450"
                      >
                        <p className="text-zinc-500">// Configure the patient metrics slider to trigger the stacking generalizer inference pipeline.</p>

                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-500">Patient Age ({patientAge})</span>
                            <input
                              type="range" min="30" max="80" value={patientAge}
                              onChange={(e) => setPatientAge(parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-500">Cholesterol ({patientChol} mg/dL)</span>
                            <input
                              type="range" min="150" max="380" value={patientChol}
                              onChange={(e) => setPatientChol(parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-zinc-500">Max Heart Rate ({patientHR} bpm)</span>
                            <input
                              type="range" min="90" max="200" value={patientHR}
                              onChange={(e) => setPatientHR(parseInt(e.target.value))}
                              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="text-[9px] text-zinc-500 mb-1">Exercise Angina</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setAngina(true)}
                                className={`px-2 py-0.5 border text-[9px] rounded cursor-pointer ${angina ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300' : 'bg-[#0a0a0f] border-white/[0.03] text-zinc-500'}`}
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setAngina(false)}
                                className={`px-2 py-0.5 border text-[9px] rounded cursor-pointer ${!angina ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300' : 'bg-[#0a0a0f] border-white/[0.03] text-zinc-500'}`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={runHeartInference}
                          disabled={evaluating}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-semibold py-2.5 rounded-md transition-colors shadow-[0_0_15px_rgba(99,102,241,0.15)] cursor-pointer"
                        >
                          {evaluating ? "Evaluating Stacked Generalization..." : "Evaluate Stacking Generalization"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Specs Footer */}
              <div className="pt-4 border-t border-white/[0.04] text-[9px] text-zinc-550 font-mono flex items-center justify-between">
                <span>Scalability: Decoupled REST microservices</span>
                <span>Future: SHAP value feature mapping</span>
              </div>
            </div>

            {/* Playground / Visual Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-white/[0.01] flex flex-col justify-center z-10">
              {activeTabs.heart === 'specs' ? (
                /* Static Architecture Graph */
                <div className="p-5 bg-black/50 border border-white/[0.03] rounded-xl space-y-4 font-mono text-[10px]">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold block text-[8px] border-b border-white/[0.03] pb-2">Stacked Generalizer Architecture</span>
                  <div className="space-y-3.5">
                    <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                      <span className="text-zinc-400">Raw Data Tensors</span>
                      <span className="text-[9px] text-zinc-500 block">Age, Chol, MaxHR, Angina</span>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-[8px] text-zinc-500 block">Level-0</span>
                        <span className="text-indigo-400 font-semibold">RandomForest</span>
                      </div>
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-[8px] text-zinc-500 block">Level-0</span>
                        <span className="text-purple-400 font-semibold">XGBoost</span>
                      </div>
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-[8px] text-zinc-500 block">Level-0</span>
                        <span className="text-emerald-400 font-semibold">LogReg</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                      <span className="text-zinc-550 block text-[8px]">Level-1 Meta-Learner</span>
                      <span className="text-indigo-400 font-bold">Logistic Regression Classifier</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Dynamic Playground Output logs & EKG simulation */
                <div className="space-y-4 font-mono text-[10px]">
                  <div className="p-3 bg-black/60 border border-white/[0.03] rounded-lg h-[125px] overflow-y-auto space-y-1.5 text-[9px] text-zinc-400 terminal-scroll">
                    {evalLogs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-relaxed">
                        {log.startsWith('Risk') || log.startsWith('Ensemble') ? (
                          <span className="text-emerald-400 font-semibold">{log}</span>
                        ) : log.includes('Estimator') ? (
                          <span className="text-purple-400">{log}</span>
                        ) : (
                          <span className="text-zinc-550">{log}</span>
                        )}
                      </div>
                    ))}
                    {evaluating && (
                      <div className="flex items-center gap-1.5 text-zinc-500 italic">
                        <span className="w-1 h-3 bg-indigo-500 animate-pulse"></span>
                        <span>Executing cross-validation evaluation...</span>
                      </div>
                    )}
                    {evalLogs.length === 0 && (
                      <span className="text-zinc-600 italic">// Click 'Evaluate' to initialize models...</span>
                    )}
                  </div>

                  {/* EKG heartbeat canvas simulation */}
                  <EKGCanvas riskScore={predResult ? predResult.risk : 20} />

                  {predResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-3.5 border rounded-lg flex items-center justify-between gap-4 ${predResult.risk > 50
                          ? 'bg-red-950/10 border-red-500/30'
                          : 'bg-emerald-950/10 border-emerald-500/30'
                        }`}
                    >
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase tracking-wider block font-bold">Ensemble Diagnostic Output:</span>
                        <span className={`text-sm font-extrabold ${predResult.risk > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {predResult.risk}% Risk Probability
                        </span>
                        <p className="text-[9px] text-zinc-400 mt-0.5">Classification: {predResult.classification}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-500 block uppercase font-bold">Primary Contributor:</span>
                        <span className="text-[9px] text-zinc-300 font-semibold">{predResult.contributor}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

          </ProjectContainer>

          {/* PROJECT 3: RESUME INTELLIGENCE PLATFORM */}
          <ProjectContainer>

            {/* Project Info Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.04] z-10">
              <div>
                {/* Header row: badge + links */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-amber-950/25 text-amber-400 border border-amber-900/35 rounded px-2.5 py-0.5">
                      NLP · DOCUMENT INTELLIGENCE
                    </span>
                    <span className="text-[9px] font-mono bg-teal-950/20 text-teal-400 border border-teal-900/30 rounded px-2 py-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
                      LIVE
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="https://resume-intelligence-platform.streamlit.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Demo"
                      className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-md hover:border-amber-500/30 text-zinc-400 hover:text-amber-300 transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="https://github.com/ShrijalGoswami/Resume-Parser"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub Repository"
                      className="p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-md hover:border-amber-500/30 text-zinc-400 hover:text-white transition-all"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Resume Intelligence Platform</h3>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">Python · Streamlit · spaCy · NLP · PDF Processing · Groq LLM · ATS Engine</p>

                {/* Engineering Narrative */}
                <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed border-l-2 border-amber-500/40 pl-3 italic">
                  Transforming unstructured resume documents into structured candidate intelligence — automating the full parsing → extraction → scoring → profiling pipeline.
                </p>

                {/* Tab Switcher */}
                <div className="flex gap-3 border-b border-white/[0.04] py-3 mt-4">
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, resume: 'specs' }))}
                    className={`text-[10px] font-mono pb-1 border-b cursor-pointer ${activeTabs.resume === 'specs' ? 'border-amber-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    System Architecture
                  </button>
                  <button
                    onClick={() => setActiveTabs(prev => ({ ...prev, resume: 'playground' }))}
                    className={`text-[10px] font-mono pb-1 border-b flex items-center gap-1.5 cursor-pointer ${activeTabs.resume === 'playground' ? 'border-amber-500 text-white font-semibold' : 'border-transparent text-zinc-550 hover:text-zinc-300'}`}
                  >
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    NLP Parser Demo
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="mt-4 min-h-[200px]">
                  <AnimatePresence mode="wait">
                    {activeTabs.resume === 'specs' ? (
                      <motion.div
                        key="specs-resume"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4 text-xs text-zinc-400"
                      >
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">PROBLEM:</span>
                          <p className="leading-relaxed">
                            Recruiters spend 6–8 seconds per resume. Manual screening is bottlenecked, error-prone, and misses key signal. ATS systems lack semantic understanding.
                          </p>
                        </div>
                        <div>
                          <span className="text-zinc-200 font-semibold font-mono block text-[10px]">ARCHITECTURE:</span>
                          <p className="leading-relaxed">
                            Multi-stage NLP pipeline: PDF extraction → Named Entity Recognition → skills taxonomy matching → section-aware education/experience parsing → ATS scoring via Groq LLM synthesis. Deployed on Streamlit Cloud.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Capabilities</span>
                            <span className="text-amber-400 font-mono font-bold text-xs">9 Intelligence Modules</span>
                          </div>
                          <div className="p-2.5 bg-black/40 border border-white/[0.03] rounded">
                            <span className="text-zinc-500 font-mono block text-[8px] uppercase">Deployment</span>
                            <span className="text-teal-400 font-mono font-bold text-xs">Streamlit Cloud ✓ Live</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play-resume"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-3 text-xs font-mono text-zinc-450"
                      >
                        <p className="text-zinc-500">// Upload a resume PDF — watch the NLP pipeline extract structured candidate intelligence in real-time.</p>
                        <div className="p-3.5 bg-black/40 border border-white/[0.03] rounded-lg space-y-2.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400">Pipeline status:</span>
                            <span className={resumeDone ? 'text-emerald-400' : resumeParsing ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}>
                              {resumeDone ? 'EXTRACTION_COMPLETE' : resumeParsing ? 'PARSING...' : 'IDLE'}
                            </span>
                          </div>
                          {/* NLP Stage Progress */}
                          <div className="space-y-1">
                            {NLP_STAGES.map((stage, i) => (
                              <div key={stage.id} className={`flex items-center gap-2 text-[9px] transition-all duration-300 ${i <= resumeStageIdx ? stage.color : 'text-zinc-700'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i < resumeStageIdx ? 'bg-current' : i === resumeStageIdx && resumeParsing ? 'bg-current animate-pulse' : i === resumeStageIdx && resumeDone ? 'bg-current' : 'bg-zinc-800'}`} />
                                <span>{stage.label}</span>
                                {i < resumeStageIdx && <CheckCircle2 className="h-2.5 w-2.5 ml-auto" />}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={runResumeParser}
                          disabled={resumeParsing}
                          className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-mono text-[10px] font-semibold py-2.5 rounded-md transition-colors shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
                        >
                          {resumeParsing ? 'Parsing Resume Document...' : resumeDone ? 'Re-run NLP Pipeline' : 'Run NLP Pipeline'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Specs Footer */}
              <div className="pt-4 border-t border-white/[0.04] text-[9px] text-zinc-550 font-mono flex items-center justify-between">
                <span>ATS-Oriented · Recruiter-Ready Output</span>
                <span>Future: Multi-resume batch comparison</span>
              </div>
            </div>

            {/* Visual / Playground Panel */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-white/[0.01] flex flex-col justify-center z-10">
              {activeTabs.resume === 'specs' ? (
                /* Architecture Pipeline Graph */
                <div className="p-5 bg-black/50 border border-white/[0.03] rounded-xl space-y-3 font-mono text-[10px]">
                  <span className="text-zinc-500 uppercase tracking-widest font-bold block text-[8px] border-b border-white/[0.03] pb-2">NLP Extraction Pipeline</span>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-white/[0.03] rounded">
                      <span className="text-zinc-400">1. PDF Ingestion Layer</span>
                      <span className="text-amber-400 font-semibold">PyMuPDF</span>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-zinc-500 block text-[8px]">NER Engine</span>
                        <span className="text-teal-400">spaCy NLP</span>
                      </div>
                      <div className="p-2 bg-[#0a0a0f] border border-white/[0.03] rounded text-center">
                        <span className="text-zinc-500 block text-[8px]">Skills Taxonomy</span>
                        <span className="text-cyan-400">Token Classify</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-white/[0.03] rounded">
                      <span className="text-zinc-400">3. Section Parser</span>
                      <span className="text-purple-400">Edu + Exp + Contact</span>
                    </div>
                    <div className="flex items-center justify-center text-zinc-700"><ChevronRight className="h-3.5 w-3.5 rotate-90" /></div>
                    <div className="flex justify-between items-center p-2 bg-[#0a0a0f] border border-amber-900/20 rounded bg-amber-950/5">
                      <span className="text-zinc-300 font-semibold">4. ATS Scoring + Profiling</span>
                      <span className="text-amber-400 font-semibold">Groq LLM</span>
                    </div>
                  </div>
                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.03]">
                    {['Python', 'Streamlit', 'spaCy', 'PDF Processing', 'Groq LLM', 'ATS Engine'].map(tech => (
                      <span key={tech} className="text-[8px] font-mono px-2 py-0.5 rounded bg-amber-950/15 text-amber-400/80 border border-amber-900/20">{tech}</span>
                    ))}
                  </div>
                </div>
              ) : (
                /* Dynamic NLP Output Display */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold uppercase text-zinc-500">Structured Candidate Profile:</span>
                    <span className="text-[9px] font-mono text-zinc-600">resume_input.pdf</span>
                  </div>
                  {/* Extracted fields terminal */}
                  <div className="p-3.5 bg-black/60 border border-white/[0.03] rounded-lg min-h-[160px] space-y-2 font-mono text-[10px] terminal-scroll overflow-y-auto">
                    {resumeFields.length === 0 && !resumeParsing && (
                      <span className="text-zinc-600 italic">// Run pipeline to extract candidate intelligence...</span>
                    )}
                    {resumeParsing && resumeFields.length === 0 && (
                      <div className="flex items-center gap-1.5 text-amber-500/70 italic text-[9px]">
                        <span className="w-1 h-3 bg-amber-500 animate-pulse" />
                        <span>Initializing NLP extraction pipeline...</span>
                      </div>
                    )}
                    <AnimatePresence>
                      {resumeFields.map((field) => (
                        <motion.div
                          key={field.key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-2"
                        >
                          <span className="text-zinc-600 shrink-0">{field.label}:</span>
                          <span className={`${field.color} font-semibold`}>{field.val}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {resumeDone && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2"
                    >
                      <a
                        href="https://resume-intelligence-platform.streamlit.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-mono text-[10px] font-semibold py-2.5 rounded-md transition-colors shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Launch Live Demo
                      </a>
                      <a
                        href="https://github.com/ShrijalGoswami/Resume-Parser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/30 text-zinc-300 hover:text-amber-300 font-mono text-[10px] font-semibold py-2.5 rounded-md transition-all"
                      >
                        <Github className="h-3 w-3" />
                        View Source
                      </a>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

          </ProjectContainer>

        </div>

      </div>
    </section>
  );
};

export default Projects;
