import { ROLES, LEAD_STATUSES, TALK_STATUSES } from '@vignak/shared';
import { Lead } from '../models/Lead.js';
import { Inquiry } from '../models/Inquiry.js';
import { Project } from '../models/Project.js';
import { Talk } from '../models/Talk.js';

export async function getDashboardStats(user) {
  const leadFilter = { archived: false };
  if (user.role === ROLES.STAFF) {
    leadFilter.assignedTo = user._id;
  }

  const [
    totalLeads,
    newLeads,
    qualifiedLeads,
    projects,
    upcomingTalks,
    inquiries,
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
  ]);

  const statusBreakdown = await Lead.aggregate([
    { $match: leadFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return {
    totalLeads,
    newLeads,
    qualifiedLeads,
    projects,
    upcomingTalks,
    inquiries,
    leadStatusBreakdown: statusBreakdown.map((row) => ({
      status: row._id,
      count: row.count,
    })),
  };
}
