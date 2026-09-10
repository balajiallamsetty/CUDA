import mongoose from 'mongoose';
import {
  LEAD_SERVICE_VALUES,
  LEAD_STATUS_VALUES,
  LEAD_STATUSES,
  ORGANIZATION_TYPE_VALUES,
  CONTACT_METHOD_VALUES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
} from '@vignak/shared';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    organization: { type: String, trim: true, maxlength: 160 },
    organizationType: { type: String, enum: ORGANIZATION_TYPE_VALUES },
    service: { type: String, required: true, enum: LEAD_SERVICE_VALUES },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    budget: { type: String, enum: [...BUDGET_RANGES, ''] },
    timeline: { type: String, enum: [...TIMELINE_OPTIONS, ''] },
    preferredContactMethod: { type: String, enum: CONTACT_METHOD_VALUES },
    status: {
      type: String,
      enum: LEAD_STATUS_VALUES,
      default: LEAD_STATUSES.NEW,
      index: true,
    },
    source: { type: String, default: 'start-project' },
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true },
);

leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
