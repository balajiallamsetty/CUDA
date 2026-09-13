import { SERVICE_SLUGS } from '@vignak/shared';

/** Services that accept live request CTAs. Add slugs here when a line goes live. */
export const LIVE_SERVICE_SLUGS = new Set([
  SERVICE_SLUGS.PROJECT_ASSISTANCE,
  SERVICE_SLUGS.WEB_DEVELOPMENT,
]);

export function isLiveService(slug) {
  return LIVE_SERVICE_SLUGS.has(slug);
}
