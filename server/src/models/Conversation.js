import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    workProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkProject',
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

messageSchema.index({ workProject: 1, createdAt: 1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
