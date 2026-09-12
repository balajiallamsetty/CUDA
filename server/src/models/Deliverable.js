import mongoose from 'mongoose';
import { DELIVERABLE_STATUSES, DELIVERABLE_STATUS_VALUES } from '@vignak/shared';

const deliverableSchema = new mongoose.Schema(
  {
    workProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkProject',
      required: true,
      index: true,
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, trim: true, maxlength: 80, default: 'file' },
    version: { type: Number, default: 1, min: 1 },
    status: {
      type: String,
      enum: DELIVERABLE_STATUS_VALUES,
      default: DELIVERABLE_STATUSES.DRAFT,
      index: true,
    },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    externalUrl: { type: String, trim: true, maxlength: 500 },
    notes: { type: String, trim: true, maxlength: 2000 },
    changeRequest: { type: String, trim: true, maxlength: 2000 },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    decidedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

deliverableSchema.index({ workProject: 1, version: -1 });
deliverableSchema.index({ client: 1, createdAt: -1 });

export const Deliverable = mongoose.model('Deliverable', deliverableSchema);
