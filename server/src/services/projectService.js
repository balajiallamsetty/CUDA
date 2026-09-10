import { Project } from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slugify.js';
import { writeAuditLog } from './auditService.js';

export async function listAdminProjects(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'title', 'published'], '-createdAt');
  const filter = {};
  if (query.archived === 'true') filter.archived = true;
  else if (query.archived !== 'all') filter.archived = false;
  if (query.published === 'true') filter.published = true;
  if (query.published === 'false') filter.published = false;
  if (query.category) filter.category = query.category;
  if (query.q) filter.$text = { $search: query.q };

  const [items, total] = await Promise.all([
    Project.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Project.countDocuments(filter),
  ]);
  return { items, meta: buildMeta({ page, limit, total }) };
}

export async function getAdminProject(id) {
  const project = await Project.findById(id);
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function createProject(payload, user, meta = {}) {
  const slug = await uniqueSlug(Project, payload.slug || payload.title);
  const project = await Project.create({ ...payload, slug });
  await writeAuditLog({
    action: 'PROJECT_CREATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Project',
    resourceId: project._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: { slug, published: project.published },
  });
  return project;
}

export async function updateProject(id, payload, user, meta = {}) {
  const project = await getAdminProject(id);
  const fields = [
    'title', 'category', 'client', 'description', 'challenge', 'solution',
    'technologies', 'results', 'images', 'externalUrl', 'published', 'featured', 'archived',
  ];
  fields.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      project[key] = payload[key];
    }
  });
  if (payload.slug || payload.title) {
    project.slug = await uniqueSlug(Project, payload.slug || payload.title || project.title, project._id);
  }
  await project.save();

  const action = payload.published === true
    ? 'PROJECT_PUBLISHED'
    : payload.published === false
      ? 'PROJECT_UNPUBLISHED'
      : 'PROJECT_UPDATED';

  await writeAuditLog({
    action,
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'Project',
    resourceId: project._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: payload,
  });
  return project;
}

export async function listPublicProjects({ featuredOnly = false } = {}) {
  const filter = { published: true, archived: false };
  if (featuredOnly) filter.featured = true;
  return Project.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getPublicProjectBySlug(slug) {
  return Project.findOne({ slug, published: true, archived: false }).lean();
}
