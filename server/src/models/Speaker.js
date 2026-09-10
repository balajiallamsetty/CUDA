import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, maxlength: 5000 },
    image: { type: String },
    title: { type: String, trim: true, maxlength: 160 },
    designation: { type: String, trim: true, maxlength: 160 },
    organization: { type: String, trim: true, maxlength: 160 },
    socialLinks: {
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

speakerSchema.index({ name: 'text', organization: 'text' });

export const Speaker = mongoose.model('Speaker', speakerSchema);
