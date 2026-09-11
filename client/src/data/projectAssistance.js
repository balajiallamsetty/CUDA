export const PROJECT_ASSISTANCE = {
  hero: {
    brand: 'Vignak Solutions',
    headline: 'Turn your project idea into a working technical project.',
    support:
      'Technical guidance, development assistance, documentation support, and demo preparation for B.Tech, B.E., and M.Tech students.',
    primaryCta: { label: 'Start Your Project', to: '/register' },
    secondaryCta: { label: 'Explore Project Assistance', to: '/project-assistance' },
    tertiaryCta: { label: 'Create Account', to: '/register' },
  },
  values: [
    { title: 'Project Guidance', text: 'Clarify scope, architecture, and a realistic build plan.' },
    { title: 'Technical Development', text: 'Hands-on help implementing web, full-stack, and AI features.' },
    { title: 'AI / ML Assistance', text: 'Support for models, pipelines, evaluation, and integration.' },
    { title: 'Documentation Support', text: 'Structure reports, diagrams, and submission-ready write-ups.' },
    { title: 'Presentation & Demo', text: 'Prepare slides, talking points, and a clean demo walkthrough.' },
  ],
  process: [
    { step: 1, title: 'Create your account', text: 'Register with your student details.' },
    { step: 2, title: 'Submit your requirement', text: 'Share idea, category, stack preference, and timeline.' },
    { step: 3, title: 'Discuss & plan', text: 'Align on scope, tech choices, and milestones.' },
    { step: 4, title: 'Build with guidance', text: 'Develop features with technical assistance.' },
    { step: 5, title: 'Test & refine', text: 'Debug, validate flows, and harden the demo path.' },
    { step: 6, title: 'Document & present', text: 'Finalize docs, slides, and presentation readiness.' },
  ],
  deliverables: [
    'Project idea discussion and technology selection',
    'Architecture and implementation guidance',
    'Development assistance for core features',
    'Database / API support where applicable',
    'Testing and debugging help',
    'Documentation structure and review',
    'Presentation and demo preparation',
  ],
  audiences: [
    'B.Tech / B.E. 4th-year students',
    'M.Tech students',
    'Students needing academic project development help',
    'Students seeking technical consultation and demos',
  ],
  faqs: [
    {
      q: 'What is Project Assistance?',
      a: 'Vignak helps students plan, build, document, and present technical academic projects with guidance and development support — not guaranteed grades or college approvals.',
    },
    {
      q: 'Who is it for?',
      a: 'Primarily final-year B.Tech/B.E. and M.Tech students who need structured help turning an idea into a working project.',
    },
    {
      q: 'Do I need an account?',
      a: 'Creating an account lets you submit requirements and track request status. You can also start with a public inquiry form.',
    },
    {
      q: 'What technologies do you support?',
      a: 'Common stacks include web/full-stack apps, AI/ML, data science, NLP, cloud, and related software engineering projects. Share your preference when you submit a request.',
    },
  ],
  ecosystemNote:
    'Project Assistance is our focus today. Vignak continues to grow other services and future ecosystem products — introduced carefully when ready.',
};

export const STUDENT_STATUS_LABELS = {
  NEW: 'Submitted',
  CONTACTED: 'Under review',
  QUALIFIED: 'Discussion',
  PROPOSAL: 'In progress',
  NEGOTIATION: 'In progress',
  WON: 'Completed',
  LOST: 'Cancelled',
};
