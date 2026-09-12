import {
  QUOTATION_STATUSES,
  QUOTATION_STATUS_VALUES,
  NOTIFICATION_TYPES,
  ROLES,
} from '@vignak/shared';
import { Quotation } from '../models/Quotation.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { getServiceWorkflow } from '../models/ServiceDefinition.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { writeAuditLog } from './auditService.js';
import { createNotification } from './notificationService.js';
import { getAdminServiceRequest } from './serviceRequestService.js';
import { convertRequestToWorkProject } from './workProjectService.js';

function computeTotals(lineItems, tax = 0) {
  const items = (lineItems || []).map((item) => {
    const quantity = Number(item.quantity) || 1;
    const unitAmount = Number(item.unitAmount) || 0;
    const amount = Number(item.amount != null ? item.amount : quantity * unitAmount);
    return {
      description: String(item.description || '').slice(0, 300),
      quantity,
      unitAmount,
      amount,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const taxAmount = Number(tax) || 0;
  return { lineItems: items, subtotal, tax: taxAmount, total: subtotal + taxAmount };
}

export async function createQuotation(requestId, payload, actor, meta = {}) {
  const request = await getAdminServiceRequest(requestId, actor);
  const def = await getServiceWorkflow(request.serviceSlug);
  if (!def?.workflowConfig?.requiresQuotation && payload.force !== true) {
    // Allow quotes optionally, but warn via status only for required flows
  }

  const totals = computeTotals(payload.lineItems, payload.tax);
  if (!totals.lineItems.length) throw new AppError('At least one line item is required', 400);

  const status = payload.send
    ? QUOTATION_STATUSES.SENT
    : payload.status && QUOTATION_STATUS_VALUES.includes(payload.status)
      ? payload.status
      : QUOTATION_STATUSES.DRAFT;

  const quote = await Quotation.create({
    serviceRequest: request._id,
    client: request.user._id || request.user,
    createdBy: actor._id,
    ...totals,
    currency: payload.currency || 'INR',
    status,
    validUntil: payload.validUntil || undefined,
    terms: payload.terms || '',
  });

  request.quotation = quote._id;
  await request.save();

  if (status === QUOTATION_STATUSES.SENT) {
    await createNotification({
      userId: quote.client,
      type: NOTIFICATION_TYPES.REQUEST_STATUS,
      title: 'Quotation ready',
      body: `A quotation for “${request.title}” is ready for your review.`,
      link: `/dashboard/quotations/${quote._id}`,
      resourceType: 'Quotation',
      resourceId: quote._id,
    });
  }

  await writeAuditLog({
    action: 'QUOTATION_CREATED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'Quotation',
    resourceId: quote._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  return quote;
}

export async function listMyQuotations(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { client: userId, status: { $ne: QUOTATION_STATUSES.DRAFT } };
  const [items, total] = await Promise.all([
    Quotation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('serviceRequest', 'title serviceSlug status')
      .lean(),
    Quotation.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyQuotation(userId, id) {
  const quote = await Quotation.findOne({
    _id: id,
    client: userId,
    status: { $ne: QUOTATION_STATUSES.DRAFT },
  })
    .populate('serviceRequest', 'title serviceSlug status workProject')
    .lean();
  if (!quote) throw new AppError('Quotation not found', 404);
  return quote;
}

export async function decideQuotation(userId, id, decision, meta = {}) {
  const quote = await Quotation.findOne({ _id: id, client: userId });
  if (!quote) throw new AppError('Quotation not found', 404);
  if (quote.status !== QUOTATION_STATUSES.SENT) {
    throw new AppError('Only sent quotations can be approved or rejected', 400);
  }

  if (decision === 'approve') {
    quote.status = QUOTATION_STATUSES.APPROVED;
  } else if (decision === 'reject') {
    quote.status = QUOTATION_STATUSES.REJECTED;
    quote.customerNote = meta.note || '';
  } else {
    throw new AppError('Invalid decision', 400);
  }
  quote.decidedAt = new Date();
  await quote.save();

  await writeAuditLog({
    action: decision === 'approve' ? 'QUOTATION_APPROVED' : 'QUOTATION_REJECTED',
    actor: userId,
    resourceType: 'Quotation',
    resourceId: quote._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });

  if (decision === 'approve') {
    const request = await ServiceRequest.findById(quote.serviceRequest).populate('user assignedTo');
    if (request && !request.workProject) {
      const actorId = request.assignedTo?._id || request.assignedTo || userId;
      const staffActor = {
        _id: actorId,
        email: 'quotation-auto-convert',
        role: ROLES.ADMIN,
      };
      try {
        await convertRequestToWorkProject(request._id, staffActor, meta);
      } catch {
        // Quotation stays approved; staff can convert manually
      }
    }
  }

  return quote;
}

export async function listAdminQuotations(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (user.role === ROLES.STAFF) {
    const assigned = await ServiceRequest.find({ assignedTo: user._id }).select('_id').lean();
    filter.serviceRequest = { $in: assigned.map((r) => r._id) };
  }
  const [items, total] = await Promise.all([
    Quotation.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'name email')
      .populate('serviceRequest', 'title serviceSlug')
      .lean(),
    Quotation.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}
