export function parsePagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit) || 1),
  };
}

export function parseSort(query, allowed = ['createdAt'], defaultSort = '-createdAt') {
  const sortBy = query.sortBy && allowed.includes(query.sortBy) ? query.sortBy : null;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  if (sortBy) return { [sortBy]: sortOrder };
  if (defaultSort.startsWith('-')) return { [defaultSort.slice(1)]: -1 };
  return { [defaultSort]: 1 };
}
