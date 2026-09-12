import mongoose from 'mongoose';
import { SERVICE_SLUG_VALUES, SERVICE_CATALOG } from '@vignak/shared';

const requestFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, maxlength: 80 },
    label: { type: String, required: true, maxlength: 160 },
    type: { type: String, required: true, maxlength: 40 },
    required: { type: Boolean, default: false },
  },
  { _id: false },
);

const milestoneTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 160 },
    order: { type: Number, required: true },
    weight: { type: Number, required: true, min: 1, max: 100 },
    stage: { type: String, maxlength: 40 },
  },
  { _id: false },
);

const faqSchema = new mongoose.Schema(
  {
    q: { type: String, maxlength: 300 },
    a: { type: String, maxlength: 2000 },
  },
  { _id: false },
);

const workflowConfigSchema = new mongoose.Schema(
  {
    requiresQuotation: { type: Boolean, default: false },
    milestones: { type: [milestoneTemplateSchema], default: [] },
    requestFields: { type: [requestFieldSchema], default: [] },
    paymentStages: { type: [String], default: [] },
    deliverableTypes: { type: [String], default: [] },
  },
  { _id: false },
);

const serviceDefinitionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, enum: SERVICE_SLUG_VALUES },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    summary: { type: String, trim: true, maxlength: 500 },
    flagship: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    public: { type: Boolean, default: true },
    workflowKey: { type: String, default: 'default', maxlength: 80 },
    order: { type: Number, default: 0 },
    category: { type: String, trim: true, maxlength: 80, default: 'General' },
    ctaLabel: { type: String, trim: true, maxlength: 80, default: 'Request this service' },
    audience: [{ type: String, trim: true, maxlength: 120 }],
    process: [{ type: String, trim: true, maxlength: 160 }],
    faq: { type: [faqSchema], default: [] },
    workflowConfig: { type: workflowConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const ServiceDefinition = mongoose.model('ServiceDefinition', serviceDefinitionSchema);

function catalogToDoc(entry) {
  return {
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    flagship: Boolean(entry.flagship),
    active: true,
    public: true,
    workflowKey: entry.slug,
    order: entry.order ?? 0,
    category: entry.category || 'General',
    ctaLabel: entry.ctaLabel || 'Request this service',
    audience: entry.audience || [],
    process: entry.process || [],
    faq: entry.faq || [],
    workflowConfig: entry.workflowConfig || {},
  };
}

export async function ensureDefaultServices() {
  for (const entry of SERVICE_CATALOG) {
    const doc = catalogToDoc(entry);
    const existing = await ServiceDefinition.findOne({ slug: entry.slug });
    if (!existing) {
      await ServiceDefinition.create(doc);
      continue;
    }
    // Backfill workflow for legacy rows; do not wipe admin edits once milestones exist
    if (!existing.workflowConfig?.milestones?.length) {
      existing.workflowConfig = doc.workflowConfig;
      existing.category = existing.category || doc.category;
      existing.ctaLabel = existing.ctaLabel || doc.ctaLabel;
      existing.audience = existing.audience?.length ? existing.audience : doc.audience;
      existing.process = existing.process?.length ? existing.process : doc.process;
      existing.faq = existing.faq?.length ? existing.faq : doc.faq;
      existing.workflowKey = existing.workflowKey || doc.workflowKey;
      if (existing.order === 0 && doc.order) existing.order = doc.order;
      await existing.save();
    }
  }
}

export async function getServiceWorkflow(slug) {
  await ensureDefaultServices();
  const def = await ServiceDefinition.findOne({ slug, active: true }).lean();
  if (!def) return null;
  return def;
}
