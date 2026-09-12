import mongoose from 'mongoose';
import {
  TASK_STATUSES,
  TASK_STATUS_VALUES,
  TASK_PRIORITIES,
  TASK_PRIORITY_VALUES,
  TASK_VISIBILITY,
  TASK_VISIBILITY_VALUES,
} from '@vignak/shared';

const taskSchema = new mongoose.Schema(
  {
    workProject: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkProject', required: true, index: true },
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 4000 },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: TASK_PRIORITIES.MEDIUM,
    },
    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: TASK_STATUSES.PENDING,
      index: true,
    },
    visibility: {
      type: String,
      enum: TASK_VISIBILITY_VALUES,
      default: TASK_VISIBILITY.CLIENT,
      index: true,
    },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

taskSchema.index({ workProject: 1, createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);
