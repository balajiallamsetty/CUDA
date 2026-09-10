import { Inquiry } from '../models/Inquiry.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { writeAuditLog } from './auditService.js';

export async function listInquiries(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'status'], '-createdAt');
  const filter = {};
  if (query.archived === 'true') filter.archived = true;
  else if (query.archived !== 'all') filter.archived = false;
  if (query.status) filter.status = query.status;
  if (query.q) filter.$text = { $search: query.q };

  const [items, total] = await Promise.all([
    Inquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .lean(),
    Inquiry.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getInquiryById(id) {
  const inquiry = await Inquiry.findById(id).populate('assignedTo', 'name email');
  if (!inquiry) throw new AppError('Inquiry not found', 404);
  return inquiry;
}

export async function updateInquiry(id, payload, user, meta = {}) {
  const inquiry = await getInquiryById(id);
  if (payload.status) inquiry.status = payload.status;
  if (typeof payload.archived === 'boolean') inquiry.archived = payload.archived;
  if (Object.prototype.hasOwnProperty.call(payload, 'assignedTo')) {
    inquiry.assignedTo = payload.assignedTo || null;
  }
  await inquiry.save();
  await writeAuditLog({
    action: 'INQUIRY_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Inquiry',
    resourceId: inquiry._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: payload,
  });
  return inquiry;
}
