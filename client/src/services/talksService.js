import { talks } from '../data/talks';

export async function listTalks() {
  return [...talks];
}

export async function getTalkBySlug(slug) {
  return talks.find((t) => t.slug === slug) || null;
}
