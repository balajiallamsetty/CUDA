import { ROLES } from '@vignak/shared';
import { Inquiry } from '../models/Inquiry.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { asEnum, asObjectId, asSearchText, assertScalar } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

const INQUIRY_STATUSES = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];

function staffInquiryListFilter(user, filter) {
  if (user.role === ROLES.STAFF) {
    return {
      ...filter,
      $or: [{ assignedTo: user._id }, { assignedTo: null }, { assignedTo: { $exists: false } }],
    };
  }
  return filter;
}

function canAccessInquiry(user, inquiry) {
  if (user.role !== ROLES.STAFF) return true;
  if (!inquiry.assignedTo) return true;
  return inquiry.assignedTo.toString() === user._id.toString()
    || inquiry.assignedTo?._id?.toString() === user._id.toString();
}

export async function listInquiries(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'status'], '-createdAt');
  let filter = {};
  const archivedFlag = assertScalar(query.archived, 'archived');
  if (archivedFlag === 'true') filter.archived = true;
  else if (archivedFlag !== 'all') filter.archived = false;

  const status = asEnum(query.status, INQUIRY_STATUSES, 'status');
  if (status) filter.status = status;

  const q = asSearchText(query.q);
  if (q) filter.$text = { $search: q };

  filter = staffInquiryListFilter(user, filter);

  const [items, total] = await Promise.all([
    Inquiry.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email')
      .select('-meta')
      .lean(),
    Inquiry.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getInquiryById(id, user) {
  const inquiry = await Inquiry.findById(id).populate('assignedTo', 'name email');
  if (!inquiry) throw new AppError('Inquiry not found', 404);
  if (!canAccessInquiry(user, inquiry)) {
    throw new AppError('Inquiry not found', 404);
  }
  return inquiry;
}

export async function updateInquiry(id, payload, user, meta = {}) {
  const inquiry = await getInquiryById(id, user);

  if (payload.status) {
    if (!INQUIRY_STATUSES.includes(payload.status)) {
      throw new AppError('Invalid status', 400);
    }
    inquiry.status = payload.status;
  }
  if (typeof payload.archived === 'boolean') inquiry.archived = payload.archived;

  if (Object.prototype.hasOwnProperty.call(payload, 'assignedTo')) {
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES].includes(user.role)) {
      throw new AppError('Insufficient permissions to assign inquiries', 403);
    }
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
    metadata: {
      status: payload.status,
      archived: payload.archived,
      assignedTo: payload.assignedTo,
    },
  });
  return inquiry;
}
