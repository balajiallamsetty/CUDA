import mongoose from 'mongoose';

const serviceOfferingSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    summary: { type: String, required: true, trim: true, maxlength: 500 },
    body: { type: String, trim: true, maxlength: 8000 },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const ServiceOffering = mongoose.model('ServiceOffering', serviceOfferingSchema);
