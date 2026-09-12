import mongoose from 'mongoose';
import {
  SERVICE_SLUG_VALUES,
  SERVICE_SLUGS,
  PA_DOMAIN_VALUES,
  SERVICE_REQUEST_STATUSES,
  SERVICE_REQUEST_STATUS_VALUES,
  TIMELINE_OPTIONS,
  CUSTOMER_TYPE_VALUES,
  CUSTOMER_TYPES,
} from '@vignak/shared';

const serviceRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    serviceSlug: {
      type: String,
      enum: SERVICE_SLUG_VALUES,
      default: SERVICE_SLUGS.PROJECT_ASSISTANCE,
      index: true,
    },
    customerType: {
      type: String,
      enum: CUSTOMER_TYPE_VALUES,
      default: CUSTOMER_TYPES.STUDENT,
    },
    domain: { type: String, enum: PA_DOMAIN_VALUES, required: false, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    requirements: { type: String, trim: true, maxlength: 5000 },
    technologies: [{ type: String, trim: true, maxlength: 60 }],
    timeline: { type: String, enum: [...TIMELINE_OPTIONS, ''] },
    expectedCompletionDate: { type: Date },
    phone: { type: String, trim: true, maxlength: 30 },
    organization: { type: String, trim: true, maxlength: 160 },
    course: { type: String, trim: true, maxlength: 120 },
    year: { type: String, trim: true, maxlength: 40 },
    /** Extra fields allowlisted by service workflowConfig.requestFields */
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: SERVICE_REQUEST_STATUS_VALUES,
      default: SERVICE_REQUEST_STATUSES.SUBMITTED,
      index: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject' },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    archived: { type: Boolean, default: false, index: true },
    statusHistory: [
      {
        from: String,
        to: { type: String, required: true },
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        at: { type: Date, default: Date.now },
        note: { type: String, maxlength: 1000 },
      },
    ],
    meta: { ip: String, userAgent: String },
  },
  { timestamps: true },
);

serviceRequestSchema.index({ user: 1, createdAt: -1 });
serviceRequestSchema.index({ status: 1, archived: 1, createdAt: -1 });
serviceRequestSchema.index({ assignedTo: 1, archived: 1, createdAt: -1 });
serviceRequestSchema.index({ serviceSlug: 1, status: 1, archived: 1 });

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
