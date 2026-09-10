import mongoose from 'mongoose';
import { TALK_STATUSES, TALK_STATUS_VALUES } from '@vignak/shared';
import { Speaker } from '../models/Speaker.js';
import { Talk } from '../models/Talk.js';
import { TalkRegistration } from '../models/TalkRegistration.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slugify.js';
import { asEnum, asSearchText, assertScalar, pickFields } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

const SPEAKER_FIELDS = [
  'name', 'bio', 'image', 'title', 'designation', 'organization', 'socialLinks', 'archived',
];
const TALK_FIELDS = [
  'title', 'description', 'speaker', 'date', 'location', 'status',
  'registrationOpen', 'videoUrl', 'coverImage', 'published', 'archived', 'slug',
];
const SPEAKER_POPULATE = 'name title designation organization image';

export async function listSpeakers(query = {}) {
  const filter = assertScalar(query.archived, 'archived') === 'true'
    ? { archived: true }
    : { archived: false };
  const q = asSearchText(query.q);
  if (q) filter.$text = { $search: q };
  return Speaker.find(filter).sort({ name: 1 }).limit(100).lean();
}

export async function createSpeaker(payload, user, meta = {}) {
  const data = pickFields(payload, SPEAKER_FIELDS);
  const speaker = await Speaker.create(data);
  await writeAuditLog({
    action: 'SPEAKER_CREATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Speaker',
    resourceId: speaker._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return speaker;
}

export async function updateSpeaker(id, payload, user, meta = {}) {
  const speaker = await Speaker.findById(id);
  if (!speaker) throw new AppError('Speaker not found', 404);
  Object.assign(speaker, pickFields(payload, SPEAKER_FIELDS));
  await speaker.save();
  await writeAuditLog({
    action: 'SPEAKER_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Speaker',
    resourceId: speaker._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return speaker;
}

export async function listAdminTalks(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'date', 'status'], '-date');
  const filter = {};
  const archivedFlag = assertScalar(query.archived, 'archived');
  if (archivedFlag === 'true') filter.archived = true;
  else if (archivedFlag !== 'all') filter.archived = false;
  const status = asEnum(query.status, TALK_STATUS_VALUES, 'status');
  if (status) filter.status = status;
  if (assertScalar(query.published, 'published') === 'true') filter.published = true;
  if (assertScalar(query.published, 'published') === 'false') filter.published = false;
  const q = asSearchText(query.q);
  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Talk.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('speaker', SPEAKER_POPULATE)
      .lean(),
    Talk.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getAdminTalk(id) {
  const talk = await Talk.findById(id).populate('speaker', SPEAKER_POPULATE);
  if (!talk) throw new AppError('Talk not found', 404);
  return talk;
}

export async function createTalk(payload, user, meta = {}) {
  const data = pickFields(payload, TALK_FIELDS);
  const slug = await uniqueSlug(Talk, data.slug || data.title);
  const talk = await Talk.create({ ...data, slug });
  await writeAuditLog({
    action: 'TALK_CREATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Talk',
    resourceId: talk._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
  });
  return getAdminTalk(talk._id);
}

export async function updateTalk(id, payload, user, meta = {}) {
  const talk = await Talk.findById(id);
  if (!talk) throw new AppError('Talk not found', 404);
  const data = pickFields(payload, TALK_FIELDS);
  Object.assign(talk, data);
  if (data.slug || data.title) {
    talk.slug = await uniqueSlug(Talk, data.slug || data.title || talk.title, talk._id);
  }
  if (talk.status === TALK_STATUSES.REGISTRATION_OPEN) talk.registrationOpen = true;
  await talk.save();
  await writeAuditLog({
    action: 'TALK_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Talk',
    resourceId: talk._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: data,
  });
  return getAdminTalk(id);
}

export async function listTalkRegistrations(talkId, query) {
  const talk = await Talk.findById(talkId);
  if (!talk) throw new AppError('Talk not found', 404);
  const { page, limit, skip } = parsePagination(query);
  const filter = { talk: talkId };
  const [items, total] = await Promise.all([
    TalkRegistration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    TalkRegistration.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }), talk };
}

export async function listPublicTalks({ limit = 50 } = {}) {
  return Talk.find({ published: true, archived: false })
    .sort({ date: -1 })
    .limit(Math.min(limit, 100))
    .populate('speaker', SPEAKER_POPULATE)
    .lean();
}

export async function getPublicTalkBySlug(slug) {
  return Talk.findOne({ slug, published: true, archived: false })
    .populate('speaker', SPEAKER_POPULATE)
    .lean();
}

export async function registerForTalk(idOrSlug, payload, meta = {}) {
  const filter = mongoose.isValidObjectId(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const talk = await Talk.findOne({ ...filter, published: true, archived: false });
  if (!talk) throw new AppError('Talk not found', 404);

  const open =
    talk.registrationOpen || talk.status === TALK_STATUSES.REGISTRATION_OPEN;
  if (!open || talk.status === TALK_STATUSES.CANCELLED || talk.status === TALK_STATUSES.COMPLETED) {
    throw new AppError('Registration is not open for this talk', 400);
  }

  try {
    const registration = await TalkRegistration.create({
      talk: talk._id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      organization: payload.organization,
      notes: payload.notes,
    });
    await writeAuditLog({
      action: 'TALK_REGISTRATION_CREATED',
      resourceType: 'TalkRegistration',
      resourceId: registration._id.toString(),
      ip: meta.ip,
      userAgent: meta.userAgent,
      metadata: { talkId: talk._id.toString(), email: payload.email },
    });
    return registration;
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('You are already registered for this talk', 409);
    }
    throw err;
  }
}
