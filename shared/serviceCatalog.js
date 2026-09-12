/**
 * Part 2 — multi-service catalog metadata + workflow templates.
 * Progress still derived from milestones via progressFromMilestones.
 */
import { SERVICE_SLUGS, PA_DEFAULT_MILESTONES } from './platform.js';

export const CUSTOMER_TYPES = Object.freeze({
  STUDENT: 'STUDENT',
  INDIVIDUAL: 'INDIVIDUAL',
  BUSINESS: 'BUSINESS',
  STARTUP: 'STARTUP',
  COLLEGE: 'COLLEGE',
  INSTITUTION: 'INSTITUTION',
  EVENT_ORGANIZER: 'EVENT_ORGANIZER',
  ORGANIZATION: 'ORGANIZATION',
});

export const CUSTOMER_TYPE_VALUES = Object.freeze(Object.values(CUSTOMER_TYPES));

export const CUSTOMER_TYPE_LABELS = Object.freeze({
  STUDENT: 'Student',
  INDIVIDUAL: 'Individual',
  BUSINESS: 'Business',
  STARTUP: 'Startup',
  COLLEGE: 'College',
  INSTITUTION: 'Institution',
  EVENT_ORGANIZER: 'Event Organizer',
  ORGANIZATION: 'Organization',
});

export const QUOTATION_STATUSES = Object.freeze({
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
});

export const QUOTATION_STATUS_VALUES = Object.freeze(Object.values(QUOTATION_STATUSES));

export const PAYMENT_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
});

export const PAYMENT_STATUS_VALUES = Object.freeze(Object.values(PAYMENT_STATUSES));

export const DELIVERABLE_STATUSES = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
});

export const DELIVERABLE_STATUS_VALUES = Object.freeze(Object.values(DELIVERABLE_STATUSES));

export const MESSAGE_VISIBILITY = Object.freeze({
  CLIENT: 'CLIENT',
  INTERNAL: 'INTERNAL',
});

export const MESSAGE_VISIBILITY_VALUES = Object.freeze(Object.values(MESSAGE_VISIBILITY));

function milestonesFromTitles(titles) {
  const weights = titles.map(() => Math.max(5, Math.round(100 / titles.length)));
  const sum = weights.reduce((a, b) => a + b, 0);
  weights[weights.length - 1] += 100 - sum;
  return titles.map((title, i) => ({
    title,
    order: i + 1,
    weight: weights[i],
    stage: i === titles.length - 1 ? 'COMPLETED' : 'DEVELOPMENT',
  }));
}

const commonBusinessFields = [
  { key: 'title', label: 'Project title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'organization', label: 'Organization', type: 'text', required: false },
  { key: 'timeline', label: 'Timeline', type: 'timeline', required: false },
];

export const SERVICE_CATALOG = Object.freeze([
  {
    slug: SERVICE_SLUGS.PROJECT_ASSISTANCE,
    title: 'Project Assistance',
    summary: 'Academic project guidance, development, docs, and demo preparation.',
    flagship: true,
    category: 'Education',
    order: 0,
    ctaLabel: 'Start Your Project',
    audience: ['B.Tech / B.E. students', 'M.Tech students'],
    process: ['Submit requirement', 'Discussion', 'Build with guidance', 'Docs & demo'],
    faq: [
      { q: 'Who is it for?', a: 'Primarily final-year and postgraduate technical students.' },
    ],
    workflowConfig: {
      requiresQuotation: false,
      milestones: PA_DEFAULT_MILESTONES.map((m) => ({
        title: m.title,
        order: m.order,
        weight: m.weight,
        stage: m.stage,
      })),
      requestFields: [
        { key: 'title', label: 'Project title', type: 'text', required: true },
        { key: 'domain', label: 'Domain', type: 'pa_domain', required: true },
        { key: 'description', label: 'Description', type: 'textarea', required: true },
        { key: 'requirements', label: 'Additional requirements', type: 'textarea', required: false },
        { key: 'technologies', label: 'Technologies', type: 'tags', required: false },
        { key: 'timeline', label: 'Timeline', type: 'timeline', required: false },
        { key: 'expectedCompletionDate', label: 'Expected completion', type: 'date', required: false },
        { key: 'course', label: 'Course', type: 'text', required: false },
        { key: 'year', label: 'Year', type: 'text', required: false },
        { key: 'organization', label: 'College / institution', type: 'text', required: false },
        { key: 'phone', label: 'Phone', type: 'text', required: false },
      ],
      paymentStages: [],
      deliverableTypes: ['report', 'presentation', 'source'],
    },
  },
  {
    slug: SERVICE_SLUGS.WEB_DEVELOPMENT,
    title: 'Web Development & Digital Solutions',
    summary: 'Websites, web apps, and digital foundations for teams and institutions.',
    category: 'Digital',
    order: 10,
    audience: ['Businesses', 'Startups', 'Institutions'],
    process: ['Inquiry', 'Requirements', 'Proposal', 'Build', 'Launch'],
    faq: [{ q: 'What do you build?', a: 'Marketing sites, portals, and custom web applications.' }],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Requirement Collection',
        'Proposal',
        'Planning',
        'UI/UX',
        'Development',
        'Testing',
        'Deployment',
        'Handover',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'websiteType', label: 'Website / app type', type: 'text', required: false },
        { key: 'features', label: 'Key features', type: 'textarea', required: false },
      ],
      paymentStages: ['deposit', 'mid', 'final'],
      deliverableTypes: ['design', 'staging', 'production'],
    },
  },
  {
    slug: SERVICE_SLUGS.AI_SOLUTIONS,
    title: 'AI Solutions',
    summary: 'Custom AI/ML systems, NLP, vision, generative AI, and analytics solutions.',
    category: 'AI',
    order: 20,
    audience: ['Businesses', 'Research teams', 'Startups'],
    process: ['Problem definition', 'Architecture', 'Prototype', 'Development', 'Evaluation'],
    faq: [{ q: 'Do you guarantee model accuracy?', a: 'No — we report measured results only.' }],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Problem Definition',
        'Data / Requirement Analysis',
        'Solution Architecture',
        'Prototype',
        'Development',
        'Testing',
        'Evaluation',
        'Deployment',
        'Handover',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'aiProblem', label: 'Problem to solve', type: 'textarea', required: true },
        { key: 'dataAvailability', label: 'Data availability', type: 'text', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['prototype', 'model', 'docs'],
    },
  },
  {
    slug: SERVICE_SLUGS.AI_AUTOMATION,
    title: 'AI Automation',
    summary: 'Process discovery, workflow automation, and integration-ready delivery.',
    category: 'AI',
    order: 30,
    audience: ['Operations teams', 'Businesses'],
    process: ['Discovery', 'Design', 'Integration', 'Testing', 'Monitoring'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Process Discovery',
        'Automation Analysis',
        'Workflow Design',
        'Integration',
        'Testing',
        'Deployment',
        'Monitoring',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'processDescription', label: 'Process to automate', type: 'textarea', required: true },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['workflow', 'runbook'],
    },
  },
  {
    slug: SERVICE_SLUGS.AI_CHATBOTS,
    title: 'AI Chatbots',
    summary: 'FAQ, support, and knowledge-base chatbots for web and internal use.',
    category: 'AI',
    order: 40,
    audience: ['Support teams', 'Businesses'],
    process: ['Requirements', 'Conversation design', 'Build', 'Test', 'Deploy'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Knowledge Sources',
        'Requirements',
        'Conversation Design',
        'Development',
        'Testing',
        'Deployment',
        'Maintenance Setup',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'botType', label: 'Bot type', type: 'text', required: false },
        { key: 'knowledgeSources', label: 'Knowledge sources', type: 'textarea', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['bot', 'kb'],
    },
  },
  {
    slug: SERVICE_SLUGS.AI_VOICE_AGENTS,
    title: 'AI Voice / Calling Agents',
    summary: 'Call-flow design and voice agent delivery with privacy-minded handling.',
    category: 'AI',
    order: 50,
    audience: ['Support', 'Sales ops'],
    process: ['Use case', 'Call flow', 'Build', 'Test', 'Deploy'],
    faq: [{ q: 'Do you store call recordings?', a: 'Only if explicitly required and configured — minimize PII.' }],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Use Case',
        'Call Flow Design',
        'Agent Design',
        'Integration',
        'Testing',
        'Deployment',
        'Monitoring',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'useCase', label: 'Use case', type: 'textarea', required: true },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['agent', 'flow'],
    },
  },
  {
    slug: SERVICE_SLUGS.CRM_AUTOMATION,
    title: 'CRM & Business Automation',
    summary: 'CRM workflows, enquiry pipelines, and business process automation.',
    category: 'Business',
    order: 60,
    audience: ['Businesses', 'Sales teams'],
    process: ['Discovery', 'Design', 'Build', 'Train', 'Handover'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Discovery',
        'Requirements',
        'Architecture',
        'Development',
        'Testing',
        'Training',
        'Handover',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'crmGoals', label: 'CRM / automation goals', type: 'textarea', required: true },
      ],
      paymentStages: ['deposit', 'mid', 'final'],
      deliverableTypes: ['system', 'docs'],
    },
  },
  {
    slug: SERVICE_SLUGS.CAMPUS_SOLUTIONS,
    title: 'Student / Campus Solutions',
    summary: 'Portals, attendance, academic workflows, and campus automation.',
    category: 'Education',
    order: 70,
    audience: ['Colleges', 'Departments', 'Institutions'],
    process: ['Needs assessment', 'Design', 'Build', 'Pilot', 'Rollout'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Needs Assessment',
        'Requirements',
        'Design',
        'Development',
        'Pilot',
        'Rollout',
        'Handover',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'campusScope', label: 'Campus scope', type: 'textarea', required: true },
        { key: 'stakeholder', label: 'Primary stakeholder', type: 'text', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['portal', 'docs'],
    },
  },
  {
    slug: SERVICE_SLUGS.EVENT_MANAGEMENT,
    title: 'Event Management & Conferences',
    summary: 'Event planning, logistics coordination, timelines, and execution support.',
    category: 'Events',
    order: 80,
    audience: ['Event organizers', 'Institutions'],
    process: ['Inquiry', 'Planning', 'Coordination', 'Execution', 'Wrap-up'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Inquiry Review',
        'Requirement Collection',
        'Planning',
        'Vendor Coordination',
        'Execution',
        'Event Completion',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'eventDate', label: 'Event date', type: 'date', required: false },
        { key: 'expectedAttendees', label: 'Expected attendees', type: 'text', required: false },
        { key: 'venueNotes', label: 'Venue / logistics notes', type: 'textarea', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['plan', 'runbook'],
    },
  },
  {
    slug: SERVICE_SLUGS.TED_TALKS,
    title: 'TED Talks / Speaking Events',
    summary: 'Talk programming, speaker coordination, and registration-oriented delivery.',
    category: 'Events',
    order: 90,
    audience: ['Campuses', 'Organizers'],
    process: ['Brief', 'Programming', 'Registration', 'Delivery', 'Follow-up'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Brief',
        'Programming',
        'Speaker Coordination',
        'Registration Setup',
        'Event Delivery',
        'Follow-up',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'talkTheme', label: 'Theme', type: 'text', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['schedule', 'assets'],
    },
  },
  {
    slug: SERVICE_SLUGS.GIFTS_KITS,
    title: 'Customized Gifts & Conference Kits',
    summary: 'Branded gifts and conference kits with quotation and fulfillment tracking.',
    category: 'Products',
    order: 100,
    audience: ['Event organizers', 'Institutions'],
    process: ['Request', 'Quotation', 'Production', 'Dispatch', 'Delivery'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Requirement Review',
        'Quotation',
        'Approval',
        'Production',
        'Quality Check',
        'Dispatch',
        'Delivery',
      ]),
      requestFields: [
        { key: 'title', label: 'Order title', type: 'text', required: true },
        { key: 'description', label: 'Customization notes', type: 'textarea', required: true },
        { key: 'quantity', label: 'Quantity', type: 'text', required: true },
        { key: 'deliveryDate', label: 'Needed by', type: 'date', required: false },
        { key: 'eventInfo', label: 'Event information', type: 'textarea', required: false },
      ],
      paymentStages: ['deposit', 'final'],
      deliverableTypes: ['sample', 'shipment'],
    },
  },
  {
    slug: SERVICE_SLUGS.JOY_BOX,
    title: 'Joy Box',
    summary: 'Configurable gifting packages with fulfillment and delivery tracking.',
    category: 'Products',
    order: 110,
    audience: ['Individuals', 'Organizations'],
    process: ['Select package', 'Customize', 'Confirm', 'Fulfill', 'Deliver'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Package Selection',
        'Customization Review',
        'Confirmation',
        'Fulfillment',
        'Delivery',
      ]),
      requestFields: [
        { key: 'title', label: 'Order name', type: 'text', required: true },
        { key: 'description', label: 'Notes', type: 'textarea', required: true },
        { key: 'packageType', label: 'Package / category', type: 'text', required: true },
        { key: 'quantity', label: 'Quantity', type: 'text', required: true },
      ],
      paymentStages: ['full'],
      deliverableTypes: ['box'],
    },
  },
  {
    slug: SERVICE_SLUGS.BUSINESS_DIGITAL,
    title: 'Business & Startup Digital Solutions',
    summary: 'Websites, internal tools, dashboards, and digital systems for growing teams.',
    category: 'Business',
    order: 120,
    audience: ['Startups', 'SMBs'],
    process: ['Discovery', 'Proposal', 'Build', 'Launch', 'Support'],
    faq: [],
    workflowConfig: {
      requiresQuotation: true,
      milestones: milestonesFromTitles([
        'Discovery',
        'Requirements',
        'Proposal',
        'Development',
        'Testing',
        'Launch',
        'Support Handover',
      ]),
      requestFields: [
        ...commonBusinessFields,
        { key: 'businessGoals', label: 'Business goals', type: 'textarea', required: true },
      ],
      paymentStages: ['deposit', 'mid', 'final'],
      deliverableTypes: ['product', 'docs'],
    },
  },
]);

export function getServiceCatalogEntry(slug) {
  return SERVICE_CATALOG.find((s) => s.slug === slug) || null;
}

export function getWorkflowTemplate(slug) {
  const entry = getServiceCatalogEntry(slug);
  return entry?.workflowConfig || null;
}
