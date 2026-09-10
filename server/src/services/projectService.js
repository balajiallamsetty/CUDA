import { PROJECT_CATEGORY_VALUES } from '@vignak/shared';
import { Project } from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { uniqueSlug } from '../utils/slugify.js';
import { asEnum, asSearchText, assertScalar, pickFields } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

const PROJECT_WRITE_FIELDS = [
  'title', 'category', 'client', 'description', 'challenge', 'solution',
  'technologies', 'results', 'images', 'externalUrl', 'published', 'featured', 'archived', 'slug',
];

export async function listAdminProjects(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'title', 'published'], '-createdAt');
  const filter = {};
  const archivedFlag = assertScalar(query.archived, 'archived');
  if (archivedFlag === 'true') filter.archived = true;
  else if (archivedFlag !== 'all') filter.archived = false;
  if (assertScalar(query.published, 'published') === 'true') filter.published = true;
  if (assertScalar(query.published, 'published') === 'false') filter.published = false;
  const category = asEnum(query.category, PROJECT_CATEGORY_VALUES, 'category');
  if (category) filter.category = category;
  const q = asSearchText(query.q);
  if (q) filter.$text = { $search: q };

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
  const data = pickFields(payload, PROJECT_WRITE_FIELDS);
  const slug = await uniqueSlug(Project, data.slug || data.title);
  const project = await Project.create({ ...data, slug });
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
  const data = pickFields(payload, PROJECT_WRITE_FIELDS);
  Object.assign(project, data);
  if (data.slug || data.title) {
    project.slug = await uniqueSlug(Project, data.slug || data.title || project.title, project._id);
  }
  await project.save();

  const action = data.published === true
    ? 'PROJECT_PUBLISHED'
    : data.published === false
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
    metadata: data,
  });
  return project;
}

export async function listPublicProjects({ featuredOnly = false, limit = 50 } = {}) {
  const filter = { published: true, archived: false };
  if (featuredOnly) filter.featured = true;
  return Project.find(filter).sort({ createdAt: -1 }).limit(Math.min(limit, 100)).lean();
}

export async function getPublicProjectBySlug(slug) {
  return Project.findOne({ slug, published: true, archived: false }).lean();
}
