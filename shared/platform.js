/**
 * Platform workflow enums — Project Assistance delivery (Part 1).
 * Lead CRM statuses remain in index.js and must NOT be used as development progress.
 */

export const SERVICE_SLUGS = Object.freeze({
  PROJECT_ASSISTANCE: 'project-assistance',
  WEB_DEVELOPMENT: 'web-development',
  AI_SOLUTIONS: 'ai-solutions',
  AI_AUTOMATION: 'ai-automation',
  AI_CHATBOTS: 'ai-chatbots',
  AI_VOICE_AGENTS: 'ai-voice-agents',
  CRM_AUTOMATION: 'crm-business-automation',
  CAMPUS_SOLUTIONS: 'student-campus-solutions',
  EVENT_MANAGEMENT: 'event-management',
  TED_TALKS: 'ted-talks',
  GIFTS_KITS: 'customized-gifts-conference-kits',
  JOY_BOX: 'joy-box',
  BUSINESS_DIGITAL: 'business-startup-digital',
});

export const SERVICE_SLUG_VALUES = Object.freeze(Object.values(SERVICE_SLUGS));

export const PA_DOMAINS = Object.freeze({
  GENERATIVE_AI: 'generative-ai',
  AI_AGENTS: 'ai-agents',
  AI_ML: 'ai-ml',
  DEEP_LEARNING: 'deep-learning',
  NLP: 'nlp',
  DATA_SCIENCE: 'data-science',
  WEB: 'web',
  FULL_STACK: 'full-stack',
  CLOUD: 'cloud',
  CYBERSECURITY: 'cybersecurity',
  COMPUTER_VISION: 'computer-vision',
  IOT: 'iot',
  SOFTWARE_ENGINEERING: 'software-engineering',
});

export const PA_DOMAIN_VALUES = Object.freeze(Object.values(PA_DOMAINS));

export const PA_DOMAIN_LABELS = Object.freeze({
  [PA_DOMAINS.GENERATIVE_AI]: 'Generative AI',
  [PA_DOMAINS.AI_AGENTS]: 'AI Agents / Agentic AI',
  [PA_DOMAINS.AI_ML]: 'AI & Machine Learning',
  [PA_DOMAINS.DEEP_LEARNING]: 'Deep Learning',
  [PA_DOMAINS.NLP]: 'NLP',
  [PA_DOMAINS.DATA_SCIENCE]: 'Data Science',
  [PA_DOMAINS.WEB]: 'Web Development',
  [PA_DOMAINS.FULL_STACK]: 'Full Stack Development',
  [PA_DOMAINS.CLOUD]: 'Cloud Computing',
  [PA_DOMAINS.CYBERSECURITY]: 'Cybersecurity',
  [PA_DOMAINS.COMPUTER_VISION]: 'Computer Vision',
  [PA_DOMAINS.IOT]: 'IoT / Software Projects',
  [PA_DOMAINS.SOFTWARE_ENGINEERING]: 'Software Engineering',
});

export const SERVICE_REQUEST_STATUSES = Object.freeze({
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  CONTACTED: 'CONTACTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
});

export const SERVICE_REQUEST_STATUS_VALUES = Object.freeze(Object.values(SERVICE_REQUEST_STATUSES));

export const SERVICE_REQUEST_STATUS_LABELS = Object.freeze({
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  CONTACTED: 'Contacted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
});

export const WORK_PROJECT_STATUSES = Object.freeze({
  PLANNING: 'PLANNING',
  REQUIREMENTS: 'REQUIREMENTS',
  TECH_SELECTION: 'TECH_SELECTION',
  DEVELOPMENT: 'DEVELOPMENT',
  TESTING: 'TESTING',
  DOCUMENTATION: 'DOCUMENTATION',
  PRESENTATION: 'PRESENTATION',
  REVIEW: 'REVIEW',
  COMPLETED: 'COMPLETED',
});

export const WORK_PROJECT_STATUS_VALUES = Object.freeze(Object.values(WORK_PROJECT_STATUSES));

/** Target progress % when a work project is at this stage (fallback if no milestones). */
export const WORK_PROJECT_STAGE_PROGRESS = Object.freeze({
  PLANNING: 10,
  REQUIREMENTS: 20,
  TECH_SELECTION: 30,
  DEVELOPMENT: 50,
  TESTING: 70,
  DOCUMENTATION: 85,
  PRESENTATION: 95,
  REVIEW: 98,
  COMPLETED: 100,
});

export const WORK_PROJECT_STATUS_LABELS = Object.freeze({
  PLANNING: 'Planning',
  REQUIREMENTS: 'Requirement Analysis',
  TECH_SELECTION: 'Technology Selection',
  DEVELOPMENT: 'Development',
  TESTING: 'Testing',
  DOCUMENTATION: 'Documentation',
  PRESENTATION: 'Presentation Preparation',
  REVIEW: 'Review',
  COMPLETED: 'Completed',
});

/** Default PA milestone template titles aligned to workflow stages. */
export const PA_DEFAULT_MILESTONES = Object.freeze([
  { title: 'Planning', stage: WORK_PROJECT_STATUSES.PLANNING, order: 1, weight: 10 },
  { title: 'Requirement Analysis', stage: WORK_PROJECT_STATUSES.REQUIREMENTS, order: 2, weight: 10 },
  { title: 'Technology Selection', stage: WORK_PROJECT_STATUSES.TECH_SELECTION, order: 3, weight: 10 },
  { title: 'Development', stage: WORK_PROJECT_STATUSES.DEVELOPMENT, order: 4, weight: 20 },
  { title: 'Testing', stage: WORK_PROJECT_STATUSES.TESTING, order: 5, weight: 20 },
  { title: 'Documentation', stage: WORK_PROJECT_STATUSES.DOCUMENTATION, order: 6, weight: 15 },
  { title: 'Presentation Preparation', stage: WORK_PROJECT_STATUSES.PRESENTATION, order: 7, weight: 10 },
  { title: 'Final Review', stage: WORK_PROJECT_STATUSES.REVIEW, order: 8, weight: 5 },
]);

export const MILESTONE_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED',
});

export const MILESTONE_STATUS_VALUES = Object.freeze(Object.values(MILESTONE_STATUSES));

export const TASK_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED',
});

export const TASK_STATUS_VALUES = Object.freeze(Object.values(TASK_STATUSES));

export const TASK_PRIORITIES = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const TASK_PRIORITY_VALUES = Object.freeze(Object.values(TASK_PRIORITIES));

export const TASK_VISIBILITY = Object.freeze({
  CLIENT: 'CLIENT',
  INTERNAL: 'INTERNAL',
});

export const TASK_VISIBILITY_VALUES = Object.freeze(Object.values(TASK_VISIBILITY));

export const NOTIFICATION_TYPES = Object.freeze({
  NEW_REQUEST: 'NEW_REQUEST',
  REQUEST_STATUS: 'REQUEST_STATUS',
  PROJECT_CREATED: 'PROJECT_CREATED',
  MILESTONE_UPDATED: 'MILESTONE_UPDATED',
  TASK_UPDATED: 'TASK_UPDATED',
  NEW_DOCUMENT: 'NEW_DOCUMENT',
  NEW_MESSAGE: 'NEW_MESSAGE',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
});

export const NOTIFICATION_TYPE_VALUES = Object.freeze(Object.values(NOTIFICATION_TYPES));

/**
 * Derive progress 0–100 from milestones.
 * Completed milestones contribute full weight; in-progress contribute half.
 */
export function progressFromMilestones(milestones = []) {
  if (!Array.isArray(milestones) || milestones.length === 0) return 0;
  const totalWeight = milestones.reduce((sum, m) => sum + (Number(m.weight) || 1), 0);
  if (totalWeight <= 0) return 0;
  const earned = milestones.reduce((sum, m) => {
    const w = Number(m.weight) || 1;
    if (m.status === MILESTONE_STATUSES.COMPLETED) return sum + w;
    if (m.status === MILESTONE_STATUSES.IN_PROGRESS) return sum + w * 0.5;
    return sum;
  }, 0);
  return Math.min(100, Math.round((earned / totalWeight) * 100));
}
