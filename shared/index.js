export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  CONTENT_MANAGER: 'CONTENT_MANAGER',
  SALES: 'SALES',
  USER: 'USER',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

export const LEAD_STATUSES = Object.freeze({
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  WON: 'WON',
  LOST: 'LOST',
});

export const LEAD_STATUS_VALUES = Object.freeze(Object.values(LEAD_STATUSES));

export const LEAD_SERVICES = Object.freeze({
  WEBSITE: 'Website',
  WEB_APPLICATION: 'Web Application',
  AI_SOLUTION: 'AI Solution',
  AUTOMATION: 'Automation',
  CUSTOMIZED_GIFTS: 'Customized Gifts',
  CONFERENCE_KIT: 'Conference Kit',
  EVENT: 'Event',
  VIGNAK_TALKS: 'Vignak Talks',
  OTHER: 'Other',
});

export const LEAD_SERVICE_VALUES = Object.freeze(Object.values(LEAD_SERVICES));

export const ORGANIZATION_TYPES = Object.freeze({
  COLLEGE: 'College',
  BUSINESS: 'Business',
  STARTUP: 'Startup',
  INDIVIDUAL: 'Individual',
  NONPROFIT: 'Nonprofit',
  OTHER: 'Other',
});

export const ORGANIZATION_TYPE_VALUES = Object.freeze(Object.values(ORGANIZATION_TYPES));

export const CONTACT_METHODS = Object.freeze({
  EMAIL: 'Email',
  PHONE: 'Phone',
  WHATSAPP: 'WhatsApp',
});

export const CONTACT_METHOD_VALUES = Object.freeze(Object.values(CONTACT_METHODS));

export const TALK_STATUSES = Object.freeze({
  UPCOMING: 'UPCOMING',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

export const TALK_STATUS_VALUES = Object.freeze(Object.values(TALK_STATUSES));

export const PROJECT_CATEGORIES = Object.freeze({
  WEB: 'Web',
  DIGITAL_SOLUTIONS: 'Digital Solutions',
  EVENTS: 'Events',
  CONFERENCE_KITS: 'Conference Kits',
  BRANDING: 'Branding',
});

export const PROJECT_CATEGORY_VALUES = Object.freeze(Object.values(PROJECT_CATEGORIES));

export const BUDGET_RANGES = Object.freeze([
  'Under ₹25,000',
  '₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000',
  '₹2,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
  'Not sure yet',
]);

export const TIMELINE_OPTIONS = Object.freeze([
  'ASAP',
  '2–4 weeks',
  '1–2 months',
  '3+ months',
  'Flexible',
]);
