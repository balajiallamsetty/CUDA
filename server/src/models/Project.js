import mongoose from 'mongoose';
import { PROJECT_CATEGORY_VALUES } from '@vignak/shared';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, enum: PROJECT_CATEGORY_VALUES, index: true },
    client: { type: String, trim: true, maxlength: 160 },
    description: { type: String, required: true, maxlength: 5000 },
    challenge: { type: String, maxlength: 5000 },
    solution: { type: String, maxlength: 5000 },
    technologies: [{ type: String, trim: true }],
    results: { type: String, maxlength: 5000 },
    images: [{ type: String }],
    externalUrl: { type: String, trim: true },
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Project = mongoose.model('Project', projectSchema);
