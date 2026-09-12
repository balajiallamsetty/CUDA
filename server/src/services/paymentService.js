import crypto from 'crypto';
import { PAYMENT_STATUSES, PAYMENT_STATUS_VALUES, ROLES } from '@vignak/shared';
import { Payment } from '../models/Payment.js';
import { WorkProject } from '../models/WorkProject.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta } from '../utils/pagination.js';
import { writeAuditLog } from './auditService.js';
import { env } from '../config/env.js';

/** Admin-recorded payments only until provider secrets are configured. */
export async function recordPayment(payload, actor, meta = {}) {
  if (!PAYMENT_STATUS_VALUES.includes(payload.status)) {
    throw new AppError('Invalid payment status', 400);
  }
  // Mass-assignment guard: never accept client-claimed Paid without staff
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount < 0) throw new AppError('Invalid amount', 400);

  let clientId = payload.client;
  if (payload.workProject) {
    const project = await WorkProject.findById(payload.workProject);
    if (!project) throw new AppError('Work project not found', 404);
    if (actor.role === ROLES.STAFF && !project.assignees.some((a) => String(a) === String(actor._id))) {
      throw new AppError('Not assigned to this project', 403);
    }
    clientId = project.client;
  }
  if (!clientId) throw new AppError('Client is required', 400);

  const payment = await Payment.create({
    workProject: payload.workProject || undefined,
    quotation: payload.quotation || undefined,
    client: clientId,
    recordedBy: actor._id,
    amount,
    currency: payload.currency || 'INR',
    status: payload.status,
    method: payload.method || 'admin_recorded',
    stage: payload.stage || '',
    provider: payload.provider || env.paymentProvider || '',
    providerRef: payload.providerRef || '',
    note: String(payload.note || '').slice(0, 1000),
    paidAt: payload.status === PAYMENT_STATUSES.PAID ? new Date() : undefined,
  });

  await writeAuditLog({
    action: 'PAYMENT_RECORDED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'Payment',
    resourceId: payment._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: { status: payment.status, amount: payment.amount },
  });

  return payment;
}

export async function listMyPayments(userId, query = {}) {
  const { page, limit, skip } = parsePagination(query);
  const filter = { client: userId };
  const [items, total] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('workProject', 'title serviceSlug')
      .lean(),
    Payment.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getMyPayment(userId, id) {
  const payment = await Payment.findOne({ _id: id, client: userId })
    .populate('workProject', 'title serviceSlug')
    .lean();
  if (!payment) throw new AppError('Payment not found', 404);
  return payment;
}

export async function listAdminPayments(query, user) {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (user.role === ROLES.STAFF) {
    const projects = await WorkProject.find({ assignees: user._id }).select('_id').lean();
    filter.workProject = { $in: projects.map((p) => p._id) };
  }
  const [items, total] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('client', 'name email')
      .populate('workProject', 'title')
      .lean(),
    Payment.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

/**
 * Provider webhook skeleton. Marks nothing Paid without signature verification.
 * Configure PAYMENT_PROVIDER + PAYMENT_WEBHOOK_SECRET to enable.
 */
export async function handlePaymentWebhook(provider, rawBody, signatureHeader) {
  const configured = env.paymentProvider;
  const secret = env.paymentWebhookSecret;
  if (!configured || !secret) {
    throw new AppError('Payment provider is not configured', 503);
  }
  if (provider !== configured) {
    throw new AppError('Unknown payment provider', 400);
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const provided = String(signatureHeader || '').replace(/^sha256=/, '');
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new AppError('Invalid webhook signature', 401);
  }

  let event;
  try {
    event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  } catch {
    throw new AppError('Invalid webhook payload', 400);
  }

  const providerRef = event?.id || event?.providerRef;
  if (!providerRef) throw new AppError('Missing provider reference', 400);

  const payment = await Payment.findOne({ providerRef: String(providerRef) });
  if (!payment) {
    return { accepted: true, matched: false };
  }

  const nextStatus = event.status && PAYMENT_STATUS_VALUES.includes(event.status) ? event.status : null;
  if (nextStatus) {
    payment.status = nextStatus;
    if (nextStatus === PAYMENT_STATUSES.PAID) payment.paidAt = new Date();
    await payment.save();
  }

  return { accepted: true, matched: true, paymentId: payment._id.toString() };
}
