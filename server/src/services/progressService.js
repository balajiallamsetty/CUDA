import {
  MILESTONE_STATUSES,
  WORK_PROJECT_STAGE_PROGRESS,
  progressFromMilestones,
} from '@vignak/shared';
import { Milestone } from '../models/Milestone.js';
import { WorkProject } from '../models/WorkProject.js';

export async function recalculateWorkProjectProgress(workProjectId) {
  const milestones = await Milestone.find({ workProject: workProjectId }).lean();
  let progress = progressFromMilestones(milestones);

  const project = await WorkProject.findById(workProjectId);
  if (!project) return 0;

  if (milestones.length === 0) {
    progress = WORK_PROJECT_STAGE_PROGRESS[project.status] ?? 0;
  }

  // Align status to latest completed stage when milestones exist
  if (milestones.length > 0) {
    const completed = milestones
      .filter((m) => m.status === MILESTONE_STATUSES.COMPLETED && m.stage)
      .sort((a, b) => (b.order || 0) - (a.order || 0));
    const inProgress = milestones.find((m) => m.status === MILESTONE_STATUSES.IN_PROGRESS && m.stage);
    if (progress >= 100) {
      project.status = 'COMPLETED';
    } else if (inProgress?.stage) {
      project.status = inProgress.stage;
    } else if (completed[0]?.stage) {
      project.status = completed[0].stage;
    }
  }

  project.progress = progress;
  await project.save();
  return progress;
}
