import mongoose from 'mongoose';

const talkRegistrationSchema = new mongoose.Schema(
  {
    talk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talk',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    organization: { type: String, trim: true, maxlength: 160 },
    notes: { type: String, maxlength: 2000 },
    status: {
      type: String,
      enum: ['REGISTERED', 'WAITLISTED', 'CANCELLED', 'ATTENDED'],
      default: 'REGISTERED',
    },
  },
  { timestamps: true },
);

talkRegistrationSchema.index({ talk: 1, email: 1 }, { unique: true });

export const TalkRegistration = mongoose.model('TalkRegistration', talkRegistrationSchema);
