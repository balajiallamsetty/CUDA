import { SiteSettings } from '../models/SiteSettings.js';
import { ServiceOffering } from '../models/ServiceOffering.js';
import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slugify.js';
import { writeAuditLog } from './auditService.js';

export async function getSettings() {
  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) {
    settings = await SiteSettings.create({ key: 'default' });
  }
  return {
    publicContactEmail: settings.publicContactEmail,
    publicPhone: settings.publicPhone,
    companyName: settings.companyName,
    updatedAt: settings.updatedAt,
  };
}

export async function updateSettings(payload, user, meta = {}) {
  let settings = await SiteSettings.findOne({ key: 'default' });
  if (!settings) settings = new SiteSettings({ key: 'default' });
  if (payload.publicContactEmail !== undefined) settings.publicContactEmail = payload.publicContactEmail;
  if (payload.publicPhone !== undefined) settings.publicPhone = payload.publicPhone;
  if (payload.companyName !== undefined) settings.companyName = payload.companyName;
  await settings.save();
  await writeAuditLog({
    action: 'SETTINGS_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'SiteSettings',
    resourceId: settings._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return getSettings();
}

export async function listAdminServices() {
  return ServiceOffering.find().sort({ order: 1, title: 1 }).lean();
}

export async function listPublicServices() {
  return ServiceOffering.find({ published: true }).sort({ order: 1, title: 1 }).lean();
}

export async function upsertService(payload, user, meta = {}) {
  const slug = payload.slug || (await uniqueSlug(ServiceOffering, payload.title));
  let service = payload.id ? await ServiceOffering.findById(payload.id) : null;
  if (!service) {
    service = await ServiceOffering.create({
      slug,
      title: payload.title,
      summary: payload.summary,
      body: payload.body || '',
      order: payload.order || 0,
      published: Boolean(payload.published),
    });
    await writeAuditLog({
      action: 'SERVICE_CREATED',
      actor: user._id,
      actorEmail: user.email,
      resourceType: 'ServiceOffering',
      resourceId: service._id.toString(),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  } else {
    Object.assign(service, {
      title: payload.title ?? service.title,
      summary: payload.summary ?? service.summary,
      body: payload.body ?? service.body,
      order: payload.order ?? service.order,
      published: payload.published ?? service.published,
    });
    if (payload.slug) service.slug = await uniqueSlug(ServiceOffering, payload.slug, service._id);
    await service.save();
    await writeAuditLog({
      action: 'SERVICE_UPDATED',
      actor: user._id,
      actorEmail: user.email,
      resourceType: 'ServiceOffering',
      resourceId: service._id.toString(),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  }
  return service;
}

export async function listAuditLogs(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'action'], '-createdAt');
  const filter = {};
  if (query.action) filter.action = query.action;
  if (query.actorEmail) filter.actorEmail = query.actorEmail;
  if (query.success === 'true') filter.success = true;
  if (query.success === 'false') filter.success = false;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort(sort).skip(skip).limit(limit).populate('actor', 'name email').lean(),
    AuditLog.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getSpeakerOrFail(id) {
  const { Speaker } = await import('../models/Speaker.js');
  const speaker = await Speaker.findById(id);
  if (!speaker) throw new AppError('Speaker not found', 404);
  return speaker;
}
