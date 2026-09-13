export const PROJECT_CATEGORIES = [
  {
    id: 'generative-ai',
    title: 'Generative AI',
    description: 'LLM apps, prompt workflows, RAG demos, and generative academic projects.',
    color: 'bg-accent-soft text-accent-hover border-accent/20',
  },
  {
    id: 'ai-agents',
    title: 'AI Agents / Agentic AI',
    description: 'Tool-using agents, multi-step planners, and autonomous demo flows.',
    color: 'bg-cyan-50 text-cyan-900 border-cyan-100',
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Classical ML pipelines, feature work, evaluation, and app integration.',
    color: 'bg-accent-soft text-accent border-line-soft',
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Neural models, training workflows, and experiment tracking basics.',
    color: 'bg-slate-50 text-slate-800 border-slate-200',
  },
  {
    id: 'nlp',
    title: 'NLP',
    description: 'Text classification, chat-style interfaces, and language pipelines.',
    color: 'bg-cyan-50 text-slate-800 border-cyan-100',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Analysis, visualization, notebooks, and insight storytelling.',
    color: 'bg-accent-soft text-accent-hover border-line-soft',
  },
  {
    id: 'web',
    title: 'Web Development',
    description: 'Responsive sites and frontend experiences with clean UX.',
    color: 'bg-slate-50 text-ink border-slate-200',
  },
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    description: 'APIs, auth, databases, and end-to-end application flows.',
    color: 'bg-accent-soft text-accent border-accent/15',
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    description: 'Deployments, cloud services, and scalable app foundations.',
    color: 'bg-slate-50 text-slate-800 border-slate-200',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Secure design patterns, auth hardening, and threat-aware demos.',
    color: 'bg-slate-100 text-ink-soft border-slate-200',
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    description: 'Image pipelines, detection/classification demos, and evaluation.',
    color: 'bg-cyan-50 text-cyan-900 border-line-soft',
  },
  {
    id: 'iot',
    title: 'IoT / Software Projects',
    description: 'Device-to-cloud style software layers and dashboards.',
    color: 'bg-slate-50 text-slate-800 border-slate-200',
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Architecture, modular codebases, testing, and delivery hygiene.',
    color: 'bg-line-soft text-ink-soft border-line',
  },
];

export const PROJECT_CATEGORY_OPTIONS = PROJECT_CATEGORIES.map((c) => ({
  value: c.id,
  label: c.title,
}));

export function getCategoryById(id) {
  return PROJECT_CATEGORIES.find((c) => c.id === id) || null;
}
