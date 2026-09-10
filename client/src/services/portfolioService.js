import { portfolioProjects } from '../data/portfolio';

/**
 * Portfolio repository interface.
 * Today: local mock data. Tomorrow: replace body with API calls without changing pages.
 */
export async function listProjects({ featuredOnly = false, publishedOnly = true } = {}) {
  let items = [...portfolioProjects];
  if (publishedOnly) items = items.filter((p) => p.published);
  if (featuredOnly) items = items.filter((p) => p.featured);
  return items;
}

export async function getProjectBySlug(slug) {
  const items = await listProjects({ publishedOnly: true });
  return items.find((p) => p.slug === slug) || null;
}
