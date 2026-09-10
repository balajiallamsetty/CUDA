import * as api from './api';

/**
 * Portfolio repository — API-backed with local fallback for offline/dev.
 */
export async function listProjects({ featuredOnly = false } = {}) {
  try {
    const params = featuredOnly ? { featured: 'true' } : {};
    const res = await api.getPublicProjects(params);
    return (res.data || []).map(normalizeProject);
  } catch {
    const { portfolioProjects } = await import('../data/portfolio');
    let items = [...portfolioProjects];
    if (featuredOnly) items = items.filter((p) => p.featured);
    return items.filter((p) => p.published);
  }
}

export async function getProjectBySlug(slug) {
  try {
    const res = await api.getPublicProject(slug);
    return normalizeProject(res.data);
  } catch {
    const { portfolioProjects } = await import('../data/portfolio');
    return portfolioProjects.find((p) => p.slug === slug && p.published) || null;
  }
}

function normalizeProject(p) {
  if (!p) return null;
  return {
    ...p,
    id: p.id || p._id,
  };
}
