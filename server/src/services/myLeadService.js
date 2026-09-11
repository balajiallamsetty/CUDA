import { Lead } from '../models/Lead.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';

export async function listMyLeads(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { user: userId, archived: false };
  const [items, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyLead(userId, id) {
  const lead = await Lead.findOne({ _id: id, user: userId });
  if (!lead) throw new AppError('Request not found', 404);
  return lead;
}
