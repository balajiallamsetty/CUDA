export const PROJECT_CATEGORIES = [
  {
    id: 'generative-ai',
    title: 'Generative AI',
    description: 'LLM apps, prompt workflows, RAG demos, and generative academic projects.',
    color: 'bg-indigo-50 text-indigo-900 border-indigo-100',
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
    color: 'bg-emerald-50 text-accent border-emerald-100',
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Neural models, training workflows, and experiment tracking basics.',
    color: 'bg-teal-50 text-teal-800 border-teal-100',
  },
  {
    id: 'nlp',
    title: 'NLP',
    description: 'Text classification, chat-style interfaces, and language pipelines.',
    color: 'bg-sky-50 text-sky-900 border-sky-100',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    description: 'Analysis, visualization, notebooks, and insight storytelling.',
    color: 'bg-blue-50 text-blue-900 border-blue-100',
  },
  {
    id: 'web',
    title: 'Web Development',
    description: 'Responsive sites and frontend experiences with clean UX.',
    color: 'bg-violet-50 text-violet-900 border-violet-100',
  },
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    description: 'APIs, auth, databases, and end-to-end application flows.',
    color: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-100',
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
    color: 'bg-rose-50 text-rose-900 border-rose-100',
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    description: 'Image pipelines, detection/classification demos, and evaluation.',
    color: 'bg-orange-50 text-orange-900 border-orange-100',
  },
  {
    id: 'iot',
    title: 'IoT / Software Projects',
    description: 'Device-to-cloud style software layers and dashboards.',
    color: 'bg-lime-50 text-lime-900 border-lime-100',
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Architecture, modular codebases, testing, and delivery hygiene.',
    color: 'bg-stone-50 text-stone-800 border-stone-200',
  },
];

export const PROJECT_CATEGORY_OPTIONS = PROJECT_CATEGORIES.map((c) => ({
  value: c.id,
  label: c.title,
}));

export function getCategoryById(id) {
  return PROJECT_CATEGORIES.find((c) => c.id === id) || null;
}
