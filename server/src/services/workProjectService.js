import {
  PA_DEFAULT_MILESTONES,
  MILESTONE_STATUSES,
  TASK_VISIBILITY,
  NOTIFICATION_TYPES,
  ROLES,
  WORK_PROJECT_STATUS_VALUES,
  SERVICE_REQUEST_STATUSES,
} from '@vignak/shared';
import { WorkProject } from '../models/WorkProject.js';
import { Milestone } from '../models/Milestone.js';
import { Task } from '../models/Task.js';
import { Document } from '../models/Document.js';
import { Conversation, Message } from '../models/Conversation.js';
import { Activity } from '../models/Activity.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { writeAuditLog } from './auditService.js';
import { createNotification } from './notificationService.js';
import { recalculateWorkProjectProgress } from './progressService.js';
import { storageService } from './storageService.js';
import { getAdminServiceRequest } from './serviceRequestService.js';

function staffProjectScope(user, filter = {}) {
  if (user.role === ROLES.STAFF) {
    return { ...filter, assignees: user._id };
  }
  return filter;
}

export async function convertRequestToWorkProject(requestId, actor, meta = {}) {
  const request = await getAdminServiceRequest(requestId, actor);
  if (request.workProject) {
    throw new AppError('Request already converted to a project', 409);
  }
  if ([SERVICE_REQUEST_STATUSES.REJECTED, SERVICE_REQUEST_STATUSES.CANCELLED].includes(request.status)) {
    throw new AppError('Cannot convert a rejected or cancelled request', 400);
  }

  const project = await WorkProject.create({
    title: request.title,
    serviceSlug: request.serviceSlug,
    domain: request.domain,
    serviceRequest: request._id,
    client: request.user._id || request.user,
    assignees: request.assignedTo ? [request.assignedTo._id || request.assignedTo] : [actor._id],
    summary: request.description,
    status: 'PLANNING',
    progress: 0,
  });

  await Milestone.insertMany(
    PA_DEFAULT_MILESTONES.map((m) => ({
      workProject: project._id,
      title: m.title,
      stage: m.stage,
      order: m.order,
      weight: m.weight,
      status: m.order === 1 ? MILESTONE_STATUSES.IN_PROGRESS : MILESTONE_STATUSES.PENDING,
      description: `Project Assistance milestone: ${m.title}`,
    })),
  );

  await Conversation.create({ workProject: project._id });

  request.workProject = project._id;
  request.statusHistory.push({
    from: request.status,
    to: SERVICE_REQUEST_STATUSES.APPROVED,
    by: actor._id,
    at: new Date(),
    note: 'Converted to work project',
  });
  request.status = SERVICE_REQUEST_STATUSES.APPROVED;
  if (!request.assignedTo) request.assignedTo = actor._id;
  await request.save();

  await recalculateWorkProjectProgress(project._id);

  await Activity.create({
    workProject: project._id,
    actor: actor._id,
    type: 'PROJECT_CREATED',
    message: 'Project created from service request',
  });

  await createNotification({
    userId: project.client,
    type: NOTIFICATION_TYPES.PROJECT_CREATED,
    title: 'Your project has started',
    body: `“${project.title}” is now an active Project Assistance work order.`,
    link: `/dashboard/projects/${project._id}`,
    resourceType: 'WorkProject',
    resourceId: project._id,
  });

  await writeAuditLog({
    action: 'WORK_PROJECT_CREATED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'WorkProject',
    resourceId: project._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return WorkProject.findById(project._id)
    .populate('client', 'name email')
    .populate('assignees', 'name email role');
}

export async function listMyWorkProjects(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { client: userId, archived: false };
  const [items, total] = await Promise.all([
    WorkProject.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    WorkProject.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyWorkProject(userId, id) {
  const project = await WorkProject.findOne({ _id: id, client: userId, archived: false })
    .populate('assignees', 'name email')
    .lean();
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function getMyWorkProjectBundle(userId, id) {
  const project = await getMyWorkProject(userId, id);
  const [milestones, tasks, documents, messages, activity] = await Promise.all([
    Milestone.find({ workProject: id }).sort({ order: 1 }).lean(),
    Task.find({ workProject: id, visibility: TASK_VISIBILITY.CLIENT }).sort({ createdAt: -1 }).lean(),
    Document.find({ workProject: id, archived: false, clientVisible: true })
      .select('-storageKey')
      .sort({ createdAt: -1 })
      .lean(),
    Message.find({ workProject: id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email role')
      .lean(),
    Activity.find({ workProject: id }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  return { project, milestones, tasks, documents, messages, activity };
}

export async function listAdminWorkProjects(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const filter = staffProjectScope(user, { archived: false });
  const [items, total] = await Promise.all([
    WorkProject.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'name email')
      .populate('assignees', 'name email role')
      .lean(),
    WorkProject.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getAdminWorkProject(id, user) {
  const filter = staffProjectScope(user, { _id: id });
  const project = await WorkProject.findOne(filter)
    .populate('client', 'name email phone')
    .populate('assignees', 'name email role')
    .populate('serviceRequest');
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function getAdminWorkProjectBundle(id, user) {
  const project = await getAdminWorkProject(id, user);
  const [milestones, tasks, documents, messages, activity] = await Promise.all([
    Milestone.find({ workProject: id }).sort({ order: 1 }).lean(),
    Task.find({ workProject: id }).sort({ createdAt: -1 }).populate('assignee', 'name email').lean(),
    Document.find({ workProject: id, archived: false }).sort({ createdAt: -1 }).lean(),
    Message.find({ workProject: id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email role')
      .lean(),
    Activity.find({ workProject: id }).sort({ createdAt: -1 }).limit(80).lean(),
  ]);
  return { project, milestones, tasks, documents, messages, activity };
}

export async function updateAdminWorkProject(id, payload, user, meta = {}) {
  const project = await getAdminWorkProject(id, user);
  if (payload.status) {
    if (!WORK_PROJECT_STATUS_VALUES.includes(payload.status)) {
      throw new AppError('Invalid project status', 400);
    }
    project.status = payload.status;
  }
  if (Array.isArray(payload.assignees)) {
    project.assignees = payload.assignees;
  }
  if (typeof payload.summary === 'string') project.summary = payload.summary;
  if (typeof payload.archived === 'boolean') project.archived = payload.archived;
  await project.save();
  await recalculateWorkProjectProgress(project._id);
  await writeAuditLog({
    action: 'WORK_PROJECT_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'WorkProject',
    resourceId: project._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return project;
}

export async function upsertMilestone(projectId, payload, user, meta = {}) {
  await getAdminWorkProject(projectId, user);
  let milestone;
  if (payload.id) {
    milestone = await Milestone.findOne({ _id: payload.id, workProject: projectId });
    if (!milestone) throw new AppError('Milestone not found', 404);
    if (payload.title) milestone.title = payload.title;
    if (payload.description !== undefined) milestone.description = payload.description;
    if (payload.status) {
      milestone.status = payload.status;
      milestone.completedAt =
        payload.status === MILESTONE_STATUSES.COMPLETED ? new Date() : null;
    }
    if (payload.dueDate !== undefined) milestone.dueDate = payload.dueDate || null;
    if (payload.order !== undefined) milestone.order = payload.order;
    if (payload.weight !== undefined) milestone.weight = payload.weight;
    await milestone.save();
  } else {
    milestone = await Milestone.create({
      workProject: projectId,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || MILESTONE_STATUSES.PENDING,
      stage: payload.stage,
      order: payload.order ?? 99,
      weight: payload.weight ?? 10,
      dueDate: payload.dueDate,
    });
  }
  await recalculateWorkProjectProgress(projectId);
  await Activity.create({
    workProject: projectId,
    actor: user._id,
    type: 'MILESTONE_UPDATED',
    message: `Milestone “${milestone.title}” updated`,
  });
  const project = await WorkProject.findById(projectId);
  await createNotification({
    userId: project.client,
    type: NOTIFICATION_TYPES.MILESTONE_UPDATED,
    title: 'Milestone update',
    body: `${milestone.title} is now ${milestone.status}.`,
    link: `/dashboard/projects/${projectId}`,
    resourceType: 'Milestone',
    resourceId: milestone._id,
  });
  await writeAuditLog({
    action: 'MILESTONE_UPSERT',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Milestone',
    resourceId: milestone._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return milestone;
}

export async function upsertTask(projectId, payload, user, meta = {}) {
  await getAdminWorkProject(projectId, user);
  let task;
  if (payload.id) {
    task = await Task.findOne({ _id: payload.id, workProject: projectId });
    if (!task) throw new AppError('Task not found', 404);
    ['title', 'description', 'status', 'priority', 'visibility', 'dueDate'].forEach((k) => {
      if (payload[k] !== undefined) task[k] = payload[k];
    });
    if (payload.assignee !== undefined) task.assignee = payload.assignee || null;
    if (payload.milestone !== undefined) task.milestone = payload.milestone || null;
    await task.save();
  } else {
    task = await Task.create({
      workProject: projectId,
      title: payload.title,
      description: payload.description || '',
      status: payload.status,
      priority: payload.priority,
      visibility: payload.visibility || TASK_VISIBILITY.CLIENT,
      assignee: payload.assignee,
      milestone: payload.milestone,
      dueDate: payload.dueDate,
    });
  }
  await Activity.create({
    workProject: projectId,
    actor: user._id,
    type: 'TASK_UPDATED',
    message: `Task “${task.title}” updated`,
  });
  if (task.visibility === TASK_VISIBILITY.CLIENT) {
    const project = await WorkProject.findById(projectId);
    await createNotification({
      userId: project.client,
      type: NOTIFICATION_TYPES.TASK_UPDATED,
      title: 'Task update',
      body: task.title,
      link: `/dashboard/projects/${projectId}`,
      resourceType: 'Task',
      resourceId: task._id,
    });
  }
  await writeAuditLog({
    action: 'TASK_UPSERT',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Task',
    resourceId: task._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return task;
}

export async function addProjectMessage({ projectId, user, body, asStaff }) {
  let project;
  if (asStaff) {
    project = await getAdminWorkProject(projectId, user);
  } else {
    project = await WorkProject.findOne({ _id: projectId, client: user._id, archived: false });
    if (!project) throw new AppError('Project not found', 404);
  }

  let conversation = await Conversation.findOne({ workProject: projectId });
  if (!conversation) {
    conversation = await Conversation.create({ workProject: projectId });
  }

  const message = await Message.create({
    conversation: conversation._id,
    workProject: projectId,
    sender: user._id,
    body,
    readBy: [user._id],
  });

  await Activity.create({
    workProject: projectId,
    actor: user._id,
    type: 'NEW_MESSAGE',
    message: 'New project message',
  });

  const recipientId = asStaff ? project.client : project.assignees?.[0];
  if (recipientId) {
    await createNotification({
      userId: recipientId,
      type: NOTIFICATION_TYPES.NEW_MESSAGE,
      title: 'New project message',
      body: body.slice(0, 120),
      link: asStaff ? `/admin/work-projects/${projectId}` : `/dashboard/projects/${projectId}`,
      resourceType: 'Message',
      resourceId: message._id,
    });
  }

  return Message.findById(message._id).populate('sender', 'name email role');
}

export async function uploadProjectDocument({
  projectId,
  user,
  file,
  title,
  category,
  clientVisible = true,
  meta = {},
}) {
  await getAdminWorkProject(projectId, user);
  if (!file?.buffer) throw new AppError('File required', 400);

  const saved = await storageService.saveBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    prefix: `work-projects/${projectId}`,
  });

  const doc = await Document.create({
    workProject: projectId,
    uploadedBy: user._id,
    title: title || saved.originalName,
    category: category || 'general',
    originalName: saved.originalName,
    storageKey: saved.storageKey,
    mimeType: saved.mimeType,
    size: saved.size,
    clientVisible: Boolean(clientVisible),
  });

  const project = await WorkProject.findById(projectId);
  if (doc.clientVisible) {
    await createNotification({
      userId: project.client,
      type: NOTIFICATION_TYPES.NEW_DOCUMENT,
      title: 'New document available',
      body: doc.title,
      link: `/dashboard/projects/${projectId}`,
      resourceType: 'Document',
      resourceId: doc._id,
    });
  }

  await Activity.create({
    workProject: projectId,
    actor: user._id,
    type: 'NEW_DOCUMENT',
    message: `Document uploaded: ${doc.title}`,
  });

  await writeAuditLog({
    action: 'DOCUMENT_UPLOADED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Document',
    resourceId: doc._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return doc;
}

export async function getDocumentForDownload(docId, user) {
  const doc = await Document.findOne({ _id: docId, archived: false });
  if (!doc) throw new AppError('Document not found', 404);
  const project = await WorkProject.findById(doc.workProject);
  if (!project) throw new AppError('Document not found', 404);

  const isClient = String(project.client) === String(user._id);
  const isAssignee = project.assignees.some((a) => String(a) === String(user._id));
  const isElevated = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.SALES].includes(user.role);

  if (isClient) {
    if (!doc.clientVisible) throw new AppError('Document not found', 404);
  } else if (!(isAssignee || isElevated || user.role === ROLES.STAFF)) {
    throw new AppError('Document not found', 404);
  } else if (user.role === ROLES.STAFF && !isAssignee && !isElevated) {
    throw new AppError('Document not found', 404);
  }

  return { doc, absolutePath: storageService.absolutePath(doc.storageKey) };
}

export async function dashboardOverview(userId) {
  const [
    pendingRequests,
    activeProjects,
    completedProjects,
    unread,
  ] = await Promise.all([
    ServiceRequest.countDocuments({
      user: userId,
      archived: false,
      status: {
        $in: [
          SERVICE_REQUEST_STATUSES.SUBMITTED,
          SERVICE_REQUEST_STATUSES.UNDER_REVIEW,
          SERVICE_REQUEST_STATUSES.CONTACTED,
        ],
      },
    }),
    WorkProject.countDocuments({
      client: userId,
      archived: false,
      status: { $ne: 'COMPLETED' },
    }),
    WorkProject.countDocuments({ client: userId, archived: false, status: 'COMPLETED' }),
    (await import('./notificationService.js')).unreadNotificationCount(userId),
  ]);

  const upcomingMilestones = await Milestone.find({
    workProject: { $in: await WorkProject.find({ client: userId, archived: false }).distinct('_id') },
    status: { $in: [MILESTONE_STATUSES.PENDING, MILESTONE_STATUSES.IN_PROGRESS] },
  })
    .sort({ dueDate: 1, order: 1 })
    .limit(5)
    .lean();

  const recentProjects = await WorkProject.find({ client: userId, archived: false })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

  return {
    pendingRequests,
    activeProjects,
    completedProjects,
    unreadNotifications: unread,
    upcomingMilestones,
    recentProjects,
  };
}
