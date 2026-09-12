import {
  SERVICE_SLUGS,
  SERVICE_REQUEST_STATUSES,
  SERVICE_REQUEST_STATUS_VALUES,
  ROLES,
  NOTIFICATION_TYPES,
  PA_DOMAIN_VALUES,
} from '@vignak/shared';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { asEnum, asObjectId, assertScalar } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';
import { createNotification } from './notificationService.js';
import { ensureDefaultServices } from '../models/ServiceDefinition.js';

export async function createServiceRequest(user, payload, meta = {}) {
  await ensureDefaultServices();
  if (!PA_DOMAIN_VALUES.includes(payload.domain)) {
    throw new AppError('Invalid project domain', 400);
  }

  const doc = await ServiceRequest.create({
    user: user._id,
    serviceSlug: payload.serviceSlug || SERVICE_SLUGS.PROJECT_ASSISTANCE,
    domain: payload.domain,
    title: payload.title,
    description: payload.description,
    requirements: payload.requirements || '',
    technologies: Array.isArray(payload.technologies) ? payload.technologies : [],
    timeline: payload.timeline || '',
    expectedCompletionDate: payload.expectedCompletionDate || undefined,
    phone: payload.phone || user.phone || '',
    organization: payload.organization || user.institution || '',
    course: payload.course || user.course || '',
    year: payload.year || user.year || '',
    status: SERVICE_REQUEST_STATUSES.SUBMITTED,
    statusHistory: [
      { from: null, to: SERVICE_REQUEST_STATUSES.SUBMITTED, by: user._id, at: new Date() },
    ],
    meta: { ip: meta.ip, userAgent: meta.userAgent },
  });

  await writeAuditLog({
    action: 'SERVICE_REQUEST_CREATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'ServiceRequest',
    resourceId: doc._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  await createNotification({
    userId: user._id,
    type: NOTIFICATION_TYPES.NEW_REQUEST,
    title: 'Request submitted',
    body: `Your Project Assistance request “${doc.title}” was received.`,
    link: `/dashboard/requests/${doc._id}`,
    resourceType: 'ServiceRequest',
    resourceId: doc._id,
  });

  return doc;
}

export async function listMyServiceRequests(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { user: userId, archived: false };
  const [items, total] = await Promise.all([
    ServiceRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ServiceRequest.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyServiceRequest(userId, id) {
  const doc = await ServiceRequest.findOne({ _id: id, user: userId });
  if (!doc) throw new AppError('Request not found', 404);
  return doc;
}

function staffRequestScope(user, filter = {}) {
  if (user.role === ROLES.STAFF) {
    return { ...filter, assignedTo: user._id };
  }
  return filter;
}

export async function listAdminServiceRequests(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const filter = staffRequestScope(user, {});
  const archivedFlag = assertScalar(query.archived, 'archived');
  if (archivedFlag === 'true') filter.archived = true;
  else if (archivedFlag !== 'all') filter.archived = false;

  const status = asEnum(query.status, SERVICE_REQUEST_STATUS_VALUES, 'status');
  if (status) filter.status = status;

  if (user.role !== ROLES.STAFF) {
    const assignedTo = asObjectId(query.assignedTo, 'assignedTo');
    if (assignedTo) filter.assignedTo = assignedTo;
  }

  const [items, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email role')
      .lean(),
    ServiceRequest.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getAdminServiceRequest(id, user) {
  const filter = staffRequestScope(user, { _id: id });
  const doc = await ServiceRequest.findOne(filter)
    .populate('user', 'name email phone institution course year')
    .populate('assignedTo', 'name email role')
    .populate('workProject');
  if (!doc) throw new AppError('Request not found', 404);
  return doc;
}

export async function updateAdminServiceRequest(id, payload, user, meta = {}) {
  const doc = await getAdminServiceRequest(id, user);

  if (payload.status && payload.status !== doc.status) {
    if (!SERVICE_REQUEST_STATUS_VALUES.includes(payload.status)) {
      throw new AppError('Invalid status', 400);
    }
    doc.statusHistory.push({
      from: doc.status,
      to: payload.status,
      by: user._id,
      at: new Date(),
      note: payload.statusNote || '',
    });
    doc.status = payload.status;
    await createNotification({
      userId: doc.user._id || doc.user,
      type: NOTIFICATION_TYPES.REQUEST_STATUS,
      title: 'Request status updated',
      body: `Status is now ${payload.status}.`,
      link: `/dashboard/requests/${doc._id}`,
      resourceType: 'ServiceRequest',
      resourceId: doc._id,
    });
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'assignedTo')) {
    if (![ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES].includes(user.role)) {
      throw new AppError('Insufficient permissions to assign requests', 403);
    }
    doc.assignedTo = payload.assignedTo || null;
  }

  if (typeof payload.archived === 'boolean') doc.archived = payload.archived;

  await doc.save();
  await writeAuditLog({
    action: 'SERVICE_REQUEST_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'ServiceRequest',
    resourceId: doc._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return doc;
}
