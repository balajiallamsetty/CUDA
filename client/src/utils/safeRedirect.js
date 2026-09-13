/**
 * Allow only same-app relative paths for post-auth redirects (open-redirect safe).
 */
const ALLOWED_PREFIXES = ['/dashboard', '/services', '/project-assistance', '/portfolio', '/talks', '/contact', '/about'];

export function sanitizeInternalPath(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return null;
  if (trimmed.includes('\\') || trimmed.includes('@')) return null;
  const pathOnly = trimmed.split('?')[0].split('#')[0];
  const ok = ALLOWED_PREFIXES.some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`));
  return ok ? trimmed : null;
}

export function buildPostAuthPath({ next, service }) {
  const safeNext = sanitizeInternalPath(next);
  if (safeNext) return safeNext;
  if (service && /^[a-z0-9-]+$/i.test(service)) {
    return `/dashboard/requests/new?service=${encodeURIComponent(service)}`;
  }
  return '/dashboard';
}
