import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ['NEW', 'READ', 'REPLIED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true },
);

inquirySchema.index({ email: 1, createdAt: -1 });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
