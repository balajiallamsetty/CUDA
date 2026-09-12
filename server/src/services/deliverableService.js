import {
  DELIVERABLE_STATUSES,
  DELIVERABLE_STATUS_VALUES,
  NOTIFICATION_TYPES,
  ROLES,
} from '@vignak/shared';
import { Deliverable } from '../models/Deliverable.js';
import { WorkProject } from '../models/WorkProject.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { writeAuditLog } from './auditService.js';
import { createNotification } from './notificationService.js';
import { getAdminWorkProject } from './workProjectService.js';

export async function createDeliverable(projectId, payload, actor, meta = {}) {
  const project = await getAdminWorkProject(projectId, actor);
  const status = payload.submit
    ? DELIVERABLE_STATUSES.SUBMITTED
    : payload.status && DELIVERABLE_STATUS_VALUES.includes(payload.status)
      ? payload.status
      : DELIVERABLE_STATUSES.DRAFT;

  const deliverable = await Deliverable.create({
    workProject: project._id,
    client: project.client._id || project.client,
    title: String(payload.title || '').slice(0, 200),
    type: payload.type || 'file',
    version: Number(payload.version) || 1,
    status,
    document: payload.document || undefined,
    externalUrl: payload.externalUrl || '',
    notes: payload.notes || '',
    submittedAt: status === DELIVERABLE_STATUSES.SUBMITTED ? new Date() : undefined,
    submittedBy: actor._id,
  });

  if (status === DELIVERABLE_STATUSES.SUBMITTED) {
    await createNotification({
      userId: deliverable.client,
      type: NOTIFICATION_TYPES.REQUEST_STATUS,
      title: 'Deliverable ready for review',
      body: `“${deliverable.title}” is ready for your approval.`,
      link: `/dashboard/deliverables/${deliverable._id}`,
      resourceType: 'Deliverable',
      resourceId: deliverable._id,
    });
  }

  await writeAuditLog({
    action: 'DELIVERABLE_CREATED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'Deliverable',
    resourceId: deliverable._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return deliverable;
}

export async function listMyDeliverables(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {
    client: userId,
    status: { $ne: DELIVERABLE_STATUSES.DRAFT },
  };
  const [items, total] = await Promise.all([
    Deliverable.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('workProject', 'title serviceSlug')
      .lean(),
    Deliverable.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyDeliverable(userId, id) {
  const item = await Deliverable.findOne({
    _id: id,
    client: userId,
    status: { $ne: DELIVERABLE_STATUSES.DRAFT },
  })
    .populate('workProject', 'title serviceSlug')
    .lean();
  if (!item) throw new AppError('Deliverable not found', 404);
  return item;
}

export async function decideDeliverable(userId, id, decision, note = '', meta = {}) {
  const item = await Deliverable.findOne({ _id: id, client: userId });
  if (!item) throw new AppError('Deliverable not found', 404);
  if (item.status !== DELIVERABLE_STATUSES.SUBMITTED && item.status !== DELIVERABLE_STATUSES.CHANGES_REQUESTED) {
    throw new AppError('Deliverable is not awaiting decision', 400);
  }

  if (decision === 'approve') {
    item.status = DELIVERABLE_STATUSES.APPROVED;
    item.approvedAt = new Date();
    item.changeRequest = '';
  } else if (decision === 'changes') {
    item.status = DELIVERABLE_STATUSES.CHANGES_REQUESTED;
    item.changeRequest = String(note || '').slice(0, 2000);
  } else {
    throw new AppError('Invalid decision', 400);
  }
  item.decidedBy = userId;
  await item.save();

  await writeAuditLog({
    action: decision === 'approve' ? 'DELIVERABLE_APPROVED' : 'DELIVERABLE_CHANGES_REQUESTED',
    actor: userId,
    resourceType: 'Deliverable',
    resourceId: item._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return item;
}

export async function listAdminDeliverables(projectId, user) {
  await getAdminWorkProject(projectId, user);
  return Deliverable.find({ workProject: projectId }).sort({ createdAt: -1 }).lean();
}

export async function listStaffAssignedOverview(user) {
  if (![ROLES.STAFF, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SALES].includes(user.role)) {
    throw new AppError('Forbidden', 403);
  }
  const projectFilter = user.role === ROLES.STAFF ? { assignees: user._id, archived: false } : { archived: false };
  const requestFilter =
    user.role === ROLES.STAFF ? { assignedTo: user._id, archived: false } : { archived: false };

  const { ServiceRequest } = await import('../models/ServiceRequest.js');
  const [projects, requests] = await Promise.all([
    WorkProject.find(projectFilter).sort({ updatedAt: -1 }).limit(20).populate('client', 'name email').lean(),
    ServiceRequest.find(requestFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name email')
      .lean(),
  ]);
  return { projects, requests };
}
