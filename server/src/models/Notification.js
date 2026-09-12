import mongoose from 'mongoose';
import { NOTIFICATION_TYPE_VALUES } from '@vignak/shared';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPE_VALUES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, trim: true, maxlength: 1000 },
    link: { type: String, trim: true, maxlength: 300 },
    resourceType: { type: String, maxlength: 80 },
    resourceId: { type: String, maxlength: 64 },
    readAt: { type: Date },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, readAt: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);
