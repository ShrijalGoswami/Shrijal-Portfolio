// The "Living Knowledge System" graph — derived from the résumé, laid out in 3D.
// Nodes reveal progressively as the intro timeline's progress (0..1) crosses their `reveal` threshold.
// Kept framework-agnostic (plain data); the scene turns positions into THREE vectors.

export type NodeKind = 'core' | 'head' | 'leaf';
export type Cluster = 'core' | 'research' | 'projects' | 'experience' | 'achievements';

export interface GraphNode {
  id: string;
  kind: NodeKind;
  cluster: Cluster;
  label: string;
  /** Optional second line shown under heads / core. */
  sub?: string;
  pos: [number, number, number];
  /** Scroll progress at which this node begins to materialise. */
  reveal: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  reveal: number;
  /** Curvature of the connection; cross-links sag more for an organic web. */
  sag?: number;
}

export const NODES: GraphNode[] = [
  { id: 'core', kind: 'core', cluster: 'core', label: 'Shrijal Goswami', sub: 'AI/ML Engineer', pos: [0, 0, 0], reveal: 0 },

  // — Research / methods —
  { id: 'research', kind: 'head', cluster: 'research', label: 'Research', sub: 'Retrieval & explainability', pos: [-3.6, 1.9, -0.4], reveal: 0.10 },
  { id: 'r-hyb', kind: 'leaf', cluster: 'research', label: 'Hybrid retrieval', pos: [-5.6, 2.7, 0.4], reveal: 0.14 },
  { id: 'r-bm', kind: 'leaf', cluster: 'research', label: 'BM25 + dense', pos: [-5.7, 1.0, -0.7], reveal: 0.16 },
  { id: 'r-fuse', kind: 'leaf', cluster: 'research', label: 'Fusion α = 0.65', pos: [-4.4, 3.2, -0.2], reveal: 0.18 },
  { id: 'r-xai', kind: 'leaf', cluster: 'research', label: 'Explainable AI', pos: [-2.6, 3.1, 0.5], reveal: 0.20 },

  // — Projects —
  { id: 'projects', kind: 'head', cluster: 'projects', label: 'Projects', sub: 'Systems that ship', pos: [3.8, 1.7, 0.5], reveal: 0.27 },
  { id: 'p-rag', kind: 'leaf', cluster: 'projects', label: 'Explainable RAG QA', pos: [5.8, 2.6, -0.3], reveal: 0.32 },
  { id: 'p-heart', kind: 'leaf', cluster: 'projects', label: 'Heart-disease 89.1%', pos: [5.9, 0.8, 0.6], reveal: 0.34 },
  { id: 'p-fastapi', kind: 'leaf', cluster: 'projects', label: 'Booklet Engine', pos: [4.6, 3.2, 0.1], reveal: 0.36 },
  { id: 'p-chroma', kind: 'leaf', cluster: 'projects', label: 'ChromaDB ~45 ms', pos: [2.7, 3.0, -0.5], reveal: 0.38 },

  // — Experience —
  { id: 'exp', kind: 'head', cluster: 'experience', label: 'Experience', sub: 'In production, now', pos: [3.5, -2.0, -0.8], reveal: 0.44 },
  { id: 'e-pinnacle', kind: 'leaf', cluster: 'experience', label: 'AKademy38', pos: [5.4, -2.7, 0.2], reveal: 0.48 },
  { id: 'e-intern', kind: 'leaf', cluster: 'experience', label: 'AI Strategist', pos: [5.6, -1.1, -0.6], reveal: 0.50 },
  { id: 'e-dsc', kind: 'leaf', cluster: 'experience', label: 'Data Science Club', pos: [3.0, -3.5, 0.4], reveal: 0.52 },
  { id: 'e-backend', kind: 'leaf', cluster: 'experience', label: 'Pinnacle Labs', pos: [1.9, -1.4, -0.2], reveal: 0.54 },

  // — Achievements / hackathons —
  { id: 'ach', kind: 'head', cluster: 'achievements', label: 'Achievements', sub: 'Beyond the brief', pos: [-3.5, -2.0, 0.7], reveal: 0.58 },
  { id: 'a-dataforge', kind: 'leaf', cluster: 'achievements', label: 'DataForge finalist', pos: [-5.5, -2.7, -0.2], reveal: 0.62 },
  { id: 'a-gssoc', kind: 'leaf', cluster: 'achievements', label: "GSSoC '26", pos: [-5.6, -1.0, 0.5], reveal: 0.64 },
  { id: 'a-vit', kind: 'leaf', cluster: 'achievements', label: 'VIT Bhopal', pos: [-2.7, -3.4, 0.3], reveal: 0.66 },
];

export const EDGES: GraphEdge[] = [
  // core → cluster heads
  { from: 'core', to: 'research', reveal: 0.11, sag: 0.35 },
  { from: 'core', to: 'projects', reveal: 0.28, sag: 0.35 },
  { from: 'core', to: 'exp', reveal: 0.45, sag: 0.35 },
  { from: 'core', to: 'ach', reveal: 0.59, sag: 0.35 },

  // research head → leaves
  { from: 'research', to: 'r-hyb', reveal: 0.14 },
  { from: 'research', to: 'r-bm', reveal: 0.16 },
  { from: 'research', to: 'r-fuse', reveal: 0.18 },
  { from: 'research', to: 'r-xai', reveal: 0.20 },

  // projects head → leaves
  { from: 'projects', to: 'p-rag', reveal: 0.32 },
  { from: 'projects', to: 'p-heart', reveal: 0.34 },
  { from: 'projects', to: 'p-fastapi', reveal: 0.36 },
  { from: 'projects', to: 'p-chroma', reveal: 0.38 },

  // experience head → leaves
  { from: 'exp', to: 'e-pinnacle', reveal: 0.48 },
  { from: 'exp', to: 'e-intern', reveal: 0.50 },
  { from: 'exp', to: 'e-dsc', reveal: 0.52 },
  { from: 'exp', to: 'e-backend', reveal: 0.54 },

  // achievements head → leaves
  { from: 'ach', to: 'a-dataforge', reveal: 0.62 },
  { from: 'ach', to: 'a-gssoc', reveal: 0.64 },
  { from: 'ach', to: 'a-vit', reveal: 0.66 },

  // cross-links — the system closes into a single web before the identity climax
  { from: 'r-hyb', to: 'p-rag', reveal: 0.68, sag: 0.8 },
  { from: 'r-xai', to: 'p-rag', reveal: 0.68, sag: 0.8 },
  { from: 'e-backend', to: 'p-fastapi', reveal: 0.68, sag: 0.8 },
  { from: 'e-pinnacle', to: 'core', reveal: 0.68, sag: 0.6 },
  { from: 'research', to: 'projects', reveal: 0.70, sag: 0.9 },
  { from: 'projects', to: 'exp', reveal: 0.70, sag: 0.9 },
  { from: 'exp', to: 'ach', reveal: 0.70, sag: 0.9 },
  { from: 'ach', to: 'research', reveal: 0.70, sag: 0.9 },
];
