import mongoose from 'mongoose';
import { QUOTATION_STATUSES, QUOTATION_STATUS_VALUES } from '@vignak/shared';

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 300 },
    quantity: { type: Number, default: 1, min: 0 },
    unitAmount: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const quotationSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      index: true,
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lineItems: { type: [lineItemSchema], default: [] },
    currency: { type: String, default: 'INR', maxlength: 8 },
    subtotal: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: QUOTATION_STATUS_VALUES,
      default: QUOTATION_STATUSES.DRAFT,
      index: true,
    },
    validUntil: { type: Date },
    terms: { type: String, trim: true, maxlength: 4000 },
    customerNote: { type: String, trim: true, maxlength: 2000 },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

quotationSchema.index({ client: 1, createdAt: -1 });
quotationSchema.index({ serviceRequest: 1, status: 1 });

export const Quotation = mongoose.model('Quotation', quotationSchema);
