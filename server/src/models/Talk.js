import mongoose from 'mongoose';
import { TALK_STATUS_VALUES, TALK_STATUSES } from '@vignak/shared';

const talkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 8000 },
    speaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' },
    date: { type: Date },
    location: { type: String, trim: true, maxlength: 240 },
    status: {
      type: String,
      enum: TALK_STATUS_VALUES,
      default: TALK_STATUSES.UPCOMING,
      index: true,
    },
    registrationOpen: { type: Boolean, default: false },
    videoUrl: { type: String, trim: true },
    coverImage: { type: String },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Talk = mongoose.model('Talk', talkSchema);
