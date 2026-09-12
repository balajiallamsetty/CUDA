import mongoose from 'mongoose';
import { SERVICE_SLUG_VALUES, SERVICE_SLUGS } from '@vignak/shared';

const serviceDefinitionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, enum: SERVICE_SLUG_VALUES },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    summary: { type: String, trim: true, maxlength: 500 },
    flagship: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    public: { type: Boolean, default: true },
    workflowKey: { type: String, default: 'default', maxlength: 80 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ServiceDefinition = mongoose.model('ServiceDefinition', serviceDefinitionSchema);

export async function ensureDefaultServices() {
  await ServiceDefinition.findOneAndUpdate(
    { slug: SERVICE_SLUGS.PROJECT_ASSISTANCE },
    {
      slug: SERVICE_SLUGS.PROJECT_ASSISTANCE,
      title: 'Project Assistance',
      summary: 'Academic project guidance, development, docs, and demo preparation.',
      flagship: true,
      active: true,
      public: true,
      workflowKey: 'project-assistance',
      order: 0,
    },
    { upsert: true, new: true },
  );
}
