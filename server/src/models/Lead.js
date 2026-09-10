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

const noteSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true, maxlength: 4000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const statusHistorySchema = new mongoose.Schema(
  {
    from: { type: String, enum: LEAD_STATUS_VALUES },
    to: { type: String, enum: LEAD_STATUS_VALUES, required: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    at: { type: Date, default: Date.now },
    note: { type: String, maxlength: 1000 },
  },
  { _id: false },
);

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
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    archived: { type: Boolean, default: false, index: true },
    notes: [noteSchema],
    statusHistory: [statusHistorySchema],
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
leadSchema.index({ archived: 1, createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', organization: 'text', description: 'text' });

export const Lead = mongoose.model('Lead', leadSchema);
