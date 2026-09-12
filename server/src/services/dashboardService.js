import { ROLES, LEAD_STATUSES, TALK_STATUSES, WORK_PROJECT_STATUSES, MILESTONE_STATUSES, TASK_STATUSES } from '@vignak/shared';
import { Lead } from '../models/Lead.js';
import { Inquiry } from '../models/Inquiry.js';
import { Project } from '../models/Project.js';
import { Talk } from '../models/Talk.js';
import { User } from '../models/User.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { WorkProject } from '../models/WorkProject.js';
import { Milestone } from '../models/Milestone.js';
import { Task } from '../models/Task.js';
import { Payment } from '../models/Payment.js';

export async function getDashboardStats(user) {
  const leadFilter = { archived: false };
  const requestFilter = { archived: false };
  const projectFilter = { archived: false };
  if (user.role === ROLES.STAFF) {
    leadFilter.assignedTo = user._id;
    requestFilter.assignedTo = user._id;
    projectFilter.assignees = user._id;
  }

  const now = new Date();

  const [
    totalLeads,
    newLeads,
    qualifiedLeads,
    projects,
    upcomingTalks,
    inquiries,
    totalUsers,
    totalRequests,
    activeProjects,
    completedProjects,
  ] = await Promise.all([
    Lead.countDocuments(leadFilter),
    Lead.countDocuments({ ...leadFilter, status: LEAD_STATUSES.NEW }),
    Lead.countDocuments({ ...leadFilter, status: LEAD_STATUSES.QUALIFIED }),
    Project.countDocuments({ archived: false, published: true }),
    Talk.countDocuments({
      archived: false,
      published: true,
      status: { $in: [TALK_STATUSES.UPCOMING, TALK_STATUSES.REGISTRATION_OPEN] },
    }),
    Inquiry.countDocuments({ archived: false, status: 'NEW' }),
    User.countDocuments({ role: ROLES.USER, isActive: true }),
    ServiceRequest.countDocuments(requestFilter),
    WorkProject.countDocuments({
      ...projectFilter,
      status: { $ne: WORK_PROJECT_STATUSES.COMPLETED },
    }),
    WorkProject.countDocuments({ ...projectFilter, status: WORK_PROJECT_STATUSES.COMPLETED }),
  ]);

  const [statusBreakdown, requestsByService, requestsByStatus, overdueMilestones, overdueTasks, workload] =
    await Promise.all([
      Lead.aggregate([{ $match: leadFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      ServiceRequest.aggregate([
        { $match: requestFilter },
        { $group: { _id: '$serviceSlug', count: { $sum: 1 } } },
      ]),
      ServiceRequest.aggregate([
        { $match: requestFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Milestone.countDocuments({
        status: { $ne: MILESTONE_STATUSES.COMPLETED },
        dueDate: { $lt: now },
      }),
      Task.countDocuments({
        status: { $nin: [TASK_STATUSES.COMPLETED] },
        dueDate: { $lt: now },
      }),
      WorkProject.aggregate([
        { $match: projectFilter },
        { $unwind: '$assignees' },
        { $group: { _id: '$assignees', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ]);

  const paymentCount = await Payment.countDocuments({});
  let paymentsTotals = null;
  if (paymentCount > 0) {
    const totals = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
    ]);
    paymentsTotals = totals.map((row) => ({
      status: row._id,
      count: row.count,
      amount: row.amount,
    }));
  }

  const assigneeIds = workload.map((w) => w._id);
  const assignees = await User.find({ _id: { $in: assigneeIds } })
    .select('name email role')
    .lean();
  const assigneeMap = Object.fromEntries(assignees.map((a) => [String(a._id), a]));

  return {
    totalLeads,
    newLeads,
    qualifiedLeads,
    projects,
    upcomingTalks,
    inquiries,
    totalUsers,
    totalRequests,
    activeProjects,
    completedProjects,
    overdueMilestones,
    overdueTasks,
    leadStatusBreakdown: statusBreakdown.map((row) => ({
      status: row._id,
      count: row.count,
    })),
    requestsByService: requestsByService.map((row) => ({
      serviceSlug: row._id,
      count: row.count,
    })),
    requestsByStatus: requestsByStatus.map((row) => ({
      status: row._id,
      count: row.count,
    })),
    workloadByAssignee: workload.map((row) => ({
      user: assigneeMap[String(row._id)] || { id: row._id },
      count: row.count,
    })),
    paymentsTotals,
  };
}
