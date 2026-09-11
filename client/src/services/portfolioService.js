import * as api from './api';

/**
 * Portfolio repository — API-backed.
 * Does not silently substitute static CMS data (that masked outages).
 */
export async function listProjects({ featuredOnly = false } = {}) {
  const params = featuredOnly ? { featured: 'true' } : {};
  const res = await api.getPublicProjects(params);
  return (res.data || []).map(normalizeProject);
}

export async function getProjectBySlug(slug) {
  const res = await api.getPublicProject(slug);
  return normalizeProject(res.data);
}

function normalizeProject(p) {
  if (!p) return null;
  return {
    ...p,
    id: p.id || p._id,
  };
}
