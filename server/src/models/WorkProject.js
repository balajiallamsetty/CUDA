import mongoose from 'mongoose';
import {
  SERVICE_SLUG_VALUES,
  SERVICE_SLUGS,
  PA_DOMAIN_VALUES,
  WORK_PROJECT_STATUSES,
  WORK_PROJECT_STATUS_VALUES,
} from '@vignak/shared';

const workProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    serviceSlug: {
      type: String,
      enum: SERVICE_SLUG_VALUES,
      default: SERVICE_SLUGS.PROJECT_ASSISTANCE,
      index: true,
    },
    domain: { type: String, enum: PA_DOMAIN_VALUES, required: true, index: true },
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      unique: true,
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: WORK_PROJECT_STATUS_VALUES,
      default: WORK_PROJECT_STATUSES.PLANNING,
      index: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    summary: { type: String, trim: true, maxlength: 2000 },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

workProjectSchema.index({ client: 1, createdAt: -1 });
workProjectSchema.index({ status: 1, archived: 1, createdAt: -1 });
workProjectSchema.index({ assignees: 1, archived: 1 });

export const WorkProject = mongoose.model('WorkProject', workProjectSchema);
