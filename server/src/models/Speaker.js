import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, maxlength: 5000 },
    image: { type: String },
    title: { type: String, trim: true, maxlength: 160 },
  },
  { timestamps: true },
);

export const Speaker = mongoose.model('Speaker', speakerSchema);
