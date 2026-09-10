export function slugify(input) {
  return String(input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

export async function uniqueSlug(Model, base, excludeId = null) {
  let slug = slugify(base);
  let candidate = slug;
  let i = 2;
  while (true) {
    const filter = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await Model.exists(filter);
    if (!exists) return candidate;
    candidate = `${slug}-${i}`;
    i += 1;
  }
}
