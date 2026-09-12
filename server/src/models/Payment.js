import mongoose from 'mongoose';
import { PAYMENT_STATUSES, PAYMENT_STATUS_VALUES } from '@vignak/shared';

const paymentSchema = new mongoose.Schema(
  {
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', index: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', maxlength: 8 },
    status: {
      type: String,
      enum: PAYMENT_STATUS_VALUES,
      default: PAYMENT_STATUSES.PENDING,
      index: true,
    },
    method: { type: String, trim: true, maxlength: 80, default: 'admin_recorded' },
    stage: { type: String, trim: true, maxlength: 80 },
    provider: { type: String, trim: true, maxlength: 40 },
    providerRef: { type: String, trim: true, maxlength: 160 },
    note: { type: String, trim: true, maxlength: 1000 },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

paymentSchema.index({ client: 1, createdAt: -1 });
paymentSchema.index({ workProject: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', paymentSchema);
