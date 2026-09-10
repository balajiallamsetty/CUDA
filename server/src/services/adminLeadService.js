import { ROLES, LEAD_STATUSES, LEAD_STATUS_VALUES, LEAD_SERVICE_VALUES } from '@vignak/shared';
import { Lead } from '../models/Lead.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { asEnum, asObjectId, asSearchText, assertScalar } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

function staffLeadScope(user, filter = {}) {
  if (user.role === ROLES.STAFF) {
    return { ...filter, assignedTo: user._id };
  }
  return filter;
}

export async function listLeads(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'status', 'name'], '-createdAt');

  const filter = staffLeadScope(user, {});
  const archivedFlag = assertScalar(query.archived, 'archived');
  if (archivedFlag === 'true') filter.archived = true;
  else if (archivedFlag !== 'all') filter.archived = false;

  const status = asEnum(query.status, LEAD_STATUS_VALUES, 'status');
  if (status) filter.status = status;

  const service = asEnum(query.service, LEAD_SERVICE_VALUES, 'service');
  if (service) filter.service = service;

  // STAFF must never override assignedTo via query (IDOR)
  if (user.role !== ROLES.STAFF) {
    const assignedTo = asObjectId(query.assignedTo, 'assignedTo');
    if (assignedTo) filter.assignedTo = assignedTo;
  }

  const q = asSearchText(query.q);
  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Lead.find(filter)
      .select('-notes -statusHistory -meta')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email role')
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getLeadById(id, user) {
  const filter = staffLeadScope(user, { _id: id });
  const lead = await Lead.findOne(filter)
    .populate('assignedTo', 'name email role')
    .populate('notes.author', 'name email')
    .populate('statusHistory.by', 'name email');
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
}

export async function updateLead(id, payload, user, meta = {}) {
  const lead = await getLeadById(id, user);
  const updates = {};

  if (payload.status && payload.status !== lead.status) {
    if (!Object.values(LEAD_STATUSES).includes(payload.status)) {
      throw new AppError('Invalid status', 400);
    }
    lead.statusHistory.push({
      from: lead.status,
      to: payload.status,
      by: user._id,
      at: new Date(),
      note: payload.statusNote || '',
    });
    updates.status = payload.status;
    lead.status = payload.status;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'assignedTo')) {
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES].includes(user.role)) {
      throw new AppError('Insufficient permissions to assign leads', 403);
    }
    lead.assignedTo = payload.assignedTo || null;
    updates.assignedTo = lead.assignedTo;
  }

  if (typeof payload.archived === 'boolean') {
    lead.archived = payload.archived;
    updates.archived = payload.archived;
  }

  await lead.save();
  await writeAuditLog({
    action: 'LEAD_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Lead',
    resourceId: lead._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: updates,
  });

  return getLeadById(id, user);
}

export async function addLeadNote(id, body, user, meta = {}) {
  const lead = await getLeadById(id, user);
  lead.notes.push({ body, author: user._id, createdAt: new Date() });
  await lead.save();
  await writeAuditLog({
    action: 'LEAD_NOTE_ADDED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Lead',
    resourceId: lead._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return getLeadById(id, user);
}
