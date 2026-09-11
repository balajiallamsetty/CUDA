import * as api from './api';

export async function listTalks() {
  const res = await api.getPublicTalks();
  return (res.data || []).map(normalizeTalk);
}

export async function getTalkBySlug(slug) {
  const res = await api.getPublicTalk(slug);
  return normalizeTalk(res.data);
}

export async function registerForTalk(idOrSlug, payload) {
  return api.registerForTalk(idOrSlug, payload);
}

function normalizeTalk(t) {
  if (!t) return null;
  const speaker = t.speaker && typeof t.speaker === 'object'
    ? {
        name: t.speaker.name,
        bio: t.speaker.bio,
        image: t.speaker.image,
        title: t.speaker.designation || t.speaker.title,
      }
    : t.speaker;
  return {
    ...t,
    id: t.id || t._id,
    speaker,
  };
}
