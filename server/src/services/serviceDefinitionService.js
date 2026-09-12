import { SERVICE_SLUG_VALUES, CUSTOMER_TYPE_VALUES } from '@vignak/shared';
import { ServiceDefinition, ensureDefaultServices } from '../models/ServiceDefinition.js';
import { AppError } from '../middleware/errorHandler.js';
import { pickFields } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

const ALLOWED = [
  'title',
  'summary',
  'flagship',
  'active',
  'public',
  'order',
  'category',
  'ctaLabel',
  'audience',
  'process',
  'faq',
  'workflowKey',
  'workflowConfig',
];

function sanitizeWorkflowConfig(raw) {
  if (!raw || typeof raw !== 'object') return undefined;
  const milestones = Array.isArray(raw.milestones)
    ? raw.milestones.slice(0, 30).map((m, i) => ({
        title: String(m.title || '').slice(0, 160),
        order: Number(m.order) || i + 1,
        weight: Math.min(100, Math.max(1, Number(m.weight) || 10)),
        stage: m.stage ? String(m.stage).slice(0, 40) : undefined,
      }))
    : [];
  const requestFields = Array.isArray(raw.requestFields)
    ? raw.requestFields.slice(0, 40).map((f) => ({
        key: String(f.key || '')
          .replace(/[^a-zA-Z0-9_]/g, '')
          .slice(0, 80),
        label: String(f.label || '').slice(0, 160),
        type: String(f.type || 'text').slice(0, 40),
        required: Boolean(f.required),
      }))
    : [];
  return {
    requiresQuotation: Boolean(raw.requiresQuotation),
    milestones,
    requestFields: requestFields.filter((f) => f.key && f.label),
    paymentStages: Array.isArray(raw.paymentStages)
      ? raw.paymentStages.map((s) => String(s).slice(0, 40)).slice(0, 10)
      : [],
    deliverableTypes: Array.isArray(raw.deliverableTypes)
      ? raw.deliverableTypes.map((s) => String(s).slice(0, 40)).slice(0, 20)
      : [],
  };
}

export async function listAdminServiceDefinitions() {
  await ensureDefaultServices();
  return ServiceDefinition.find().sort({ order: 1, title: 1 }).lean();
}

export async function getAdminServiceDefinition(idOrSlug) {
  await ensureDefaultServices();
  const doc = SERVICE_SLUG_VALUES.includes(idOrSlug)
    ? await ServiceDefinition.findOne({ slug: idOrSlug })
    : await ServiceDefinition.findById(idOrSlug);
  if (!doc) throw new AppError('Service definition not found', 404);
  return doc;
}

export async function updateServiceDefinition(idOrSlug, payload, actor, meta = {}) {
  const doc = await getAdminServiceDefinition(idOrSlug);
  const data = pickFields(payload, ALLOWED);
  if (data.workflowConfig) {
    data.workflowConfig = sanitizeWorkflowConfig(data.workflowConfig);
  }
  if (typeof data.active === 'boolean') doc.active = data.active;
  if (typeof data.public === 'boolean') doc.public = data.public;
  if (typeof data.flagship === 'boolean') doc.flagship = data.flagship;
  if (data.title) doc.title = data.title;
  if (data.summary !== undefined) doc.summary = data.summary;
  if (data.order !== undefined) doc.order = Number(data.order) || 0;
  if (data.category !== undefined) doc.category = data.category;
  if (data.ctaLabel !== undefined) doc.ctaLabel = data.ctaLabel;
  if (Array.isArray(data.audience)) doc.audience = data.audience.slice(0, 20);
  if (Array.isArray(data.process)) doc.process = data.process.slice(0, 20);
  if (Array.isArray(data.faq)) doc.faq = data.faq.slice(0, 20);
  if (data.workflowKey) doc.workflowKey = data.workflowKey;
  if (data.workflowConfig) doc.workflowConfig = data.workflowConfig;
  await doc.save();

  await writeAuditLog({
    action: 'SERVICE_DEFINITION_UPDATED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'ServiceDefinition',
    resourceId: doc._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return doc;
}

export { CUSTOMER_TYPE_VALUES };
