import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    category: { type: String, trim: true, maxlength: 80, default: 'general' },
    originalName: { type: String, required: true, maxlength: 255 },
    storageKey: { type: String, required: true },
    mimeType: { type: String, required: true, maxlength: 120 },
    size: { type: Number, required: true },
    clientVisible: { type: Boolean, default: true },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

documentSchema.index({ workProject: 1, archived: 1, createdAt: -1 });

export const Document = mongoose.model('Document', documentSchema);
