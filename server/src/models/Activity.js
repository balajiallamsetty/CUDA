import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true, maxlength: 80 },
    message: { type: String, required: true, maxlength: 500 },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

activitySchema.index({ workProject: 1, createdAt: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
