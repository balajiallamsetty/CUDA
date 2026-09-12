import {
  SERVICE_SLUGS,
  SERVICE_SLUG_VALUES,
  SERVICE_REQUEST_STATUSES,
  SERVICE_REQUEST_STATUS_VALUES,
  ROLES,
  NOTIFICATION_TYPES,
  PA_DOMAIN_VALUES,
  CUSTOMER_TYPES,
  TIMELINE_OPTIONS,
} from '@vignak/shared';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { ServiceDefinition, ensureDefaultServices, getServiceWorkflow } from '../models/ServiceDefinition.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { asEnum, asObjectId, assertScalar } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';
import { createNotification } from './notificationService.js';

const CORE_KEYS = new Set([
  'title',
  'description',
  'domain',
  'requirements',
  'technologies',
  'timeline',
  'expectedCompletionDate',
  'phone',
  'organization',
  'course',
  'year',
  'serviceSlug',
  'customerType',
  'payload',
]);

function allowlistedPayload(fields, body) {
  const allowed = new Set((fields || []).map((f) => f.key));
  const raw = body.payload && typeof body.payload === 'object' ? body.payload : {};
  const out = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!allowed.has(key) || CORE_KEYS.has(key)) continue;
    if (typeof value === 'string') out[key] = value.slice(0, 5000);
    else if (typeof value === 'number' || typeof value === 'boolean') out[key] = value;
  }
  // Also pull top-level extras that match field keys
  for (const field of fields || []) {
    if (CORE_KEYS.has(field.key)) continue;
    if (Object.prototype.hasOwnProperty.call(body, field.key) && body[field.key] != null) {
      const value = body[field.key];
      if (typeof value === 'string') out[field.key] = value.slice(0, 5000);
      else if (typeof value === 'number' || typeof value === 'boolean') out[field.key] = value;
    }
  }
  return out;
}

function validateAgainstFields(fields, body) {
  for (const field of fields || []) {
    if (!field.required) continue;
    let value;
    if (CORE_KEYS.has(field.key)) {
      value = body[field.key];
    } else {
      value = body[field.key] ?? body.payload?.[field.key];
    }
    if (field.key === 'technologies') {
      if (!Array.isArray(body.technologies) || body.technologies.length === 0) {
        throw new AppError(`${field.label} is required`, 400);
      }
      continue;
    }
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new AppError(`${field.label} is required`, 400);
    }
  }
}

export async function createServiceRequest(user, payload, meta = {}) {
  await ensureDefaultServices();
  const serviceSlug = payload.serviceSlug || SERVICE_SLUGS.PROJECT_ASSISTANCE;
  if (!SERVICE_SLUG_VALUES.includes(serviceSlug)) {
    throw new AppError('Invalid service', 400);
  }

  const def = await getServiceWorkflow(serviceSlug);
  if (!def || !def.active) {
    throw new AppError('This service is not currently accepting requests', 400);
  }

  const fields = def.workflowConfig?.requestFields || [];
  validateAgainstFields(fields, payload);

  if (serviceSlug === SERVICE_SLUGS.PROJECT_ASSISTANCE) {
    if (!PA_DOMAIN_VALUES.includes(payload.domain)) {
      throw new AppError('Invalid project domain', 400);
    }
  } else if (payload.domain && !PA_DOMAIN_VALUES.includes(payload.domain)) {
    throw new AppError('Invalid project domain', 400);
  }

  if (payload.timeline && !TIMELINE_OPTIONS.includes(payload.timeline)) {
    throw new AppError('Invalid timeline', 400);
  }

  const extra = allowlistedPayload(fields, payload);
  const customerType = payload.customerType || user.customerType || CUSTOMER_TYPES.STUDENT;

  const doc = await ServiceRequest.create({
    user: user._id,
    serviceSlug,
    customerType,
    domain: payload.domain || undefined,
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
    payload: extra,
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
    body: `Your ${def.title} request “${doc.title}” was received.`,
    link: `/dashboard/requests/${doc._id}`,
    resourceType: 'ServiceRequest',
    resourceId: doc._id,
  });

  return doc;
}

export async function listMyServiceRequests(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { user: userId, archived: false };
  const serviceSlug = asEnum(query.serviceSlug, SERVICE_SLUG_VALUES, 'serviceSlug');
  if (serviceSlug) filter.serviceSlug = serviceSlug;
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

  const serviceSlug = asEnum(query.serviceSlug, SERVICE_SLUG_VALUES, 'serviceSlug');
  if (serviceSlug) filter.serviceSlug = serviceSlug;

  if (user.role !== ROLES.STAFF) {
    const assignedTo = asObjectId(query.assignedTo, 'assignedTo');
    if (assignedTo) filter.assignedTo = assignedTo;
  }

  if (query.q) {
    const q = String(query.q).trim().slice(0, 80);
    if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) filter.createdAt.$lte = new Date(query.to);
  }

  const [items, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email customerType')
      .populate('assignedTo', 'name email role')
      .lean(),
    ServiceRequest.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getAdminServiceRequest(id, user) {
  const filter = staffRequestScope(user, { _id: id });
  const doc = await ServiceRequest.findOne(filter)
    .populate('user', 'name email phone institution course year customerType')
    .populate('assignedTo', 'name email role')
    .populate('workProject')
    .populate('quotation');
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

export async function listPublicServiceDefinitions() {
  await ensureDefaultServices();
  return ServiceDefinition.find({ active: true, public: true })
    .sort({ order: 1, title: 1 })
    .select('-__v')
    .lean();
}

export async function getPublicServiceDefinition(slug) {
  await ensureDefaultServices();
  const doc = await ServiceDefinition.findOne({ slug, active: true, public: true }).lean();
  if (!doc) throw new AppError('Service not found', 404);
  return doc;
}
