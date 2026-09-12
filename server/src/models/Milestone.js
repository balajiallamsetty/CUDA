import mongoose from 'mongoose';
import { MILESTONE_STATUSES, MILESTONE_STATUS_VALUES, WORK_PROJECT_STATUS_VALUES } from '@vignak/shared';

const milestoneSchema = new mongoose.Schema(
  {
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: MILESTONE_STATUS_VALUES,
      default: MILESTONE_STATUSES.PENDING,
      index: true,
    },
    stage: { type: String, enum: WORK_PROJECT_STATUS_VALUES },
    order: { type: Number, default: 0 },
    weight: { type: Number, default: 10, min: 1, max: 100 },
    dueDate: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

milestoneSchema.index({ workProject: 1, order: 1 });

export const Milestone = mongoose.model('Milestone', milestoneSchema);
