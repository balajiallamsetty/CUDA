const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed');
    error.status = res.status;
    error.details = data?.errors || null;
    throw error;
  }

  return data;
}

export function createLead(payload) {
  return request('/api/leads', { method: 'POST', body: JSON.stringify(payload) });
}

export function createContact(payload) {
  return request('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
}

export function login(payload) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

export function getMe() {
  return request('/api/auth/me');
}

export function forgotPassword(payload) {
  return request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) });
}

export function resetPassword(payload) {
  return request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) });
}

export function changePassword(payload) {
  return request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(payload) });
}

export function getAdminMe() {
  return request('/api/admin/me');
}

export function getDashboardStats() {
  return request('/api/admin/dashboard/stats');
}

export function getAdminLeads(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/leads${qs ? `?${qs}` : ''}`);
}

export function getAdminLead(id) {
  return request(`/api/admin/leads/${id}`);
}

export function updateAdminLead(id, payload) {
  return request(`/api/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function addAdminLeadNote(id, body) {
  return request(`/api/admin/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ body }) });
}

export function getAdminInquiries(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/inquiries${qs ? `?${qs}` : ''}`);
}

export function getAdminInquiry(id) {
  return request(`/api/admin/inquiries/${id}`);
}

export function updateAdminInquiry(id, payload) {
  return request(`/api/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getAdminProjects(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/projects${qs ? `?${qs}` : ''}`);
}

export function getAdminProject(id) {
  return request(`/api/admin/projects/${id}`);
}

export function createAdminProject(payload) {
  return request('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateAdminProject(id, payload) {
  return request(`/api/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getAdminTalks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/talks${qs ? `?${qs}` : ''}`);
}

export function getAdminTalk(id) {
  return request(`/api/admin/talks/${id}`);
}

export function createAdminTalk(payload) {
  return request('/api/admin/talks', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateAdminTalk(id, payload) {
  return request(`/api/admin/talks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getTalkRegistrations(id, params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/talks/${id}/registrations${qs ? `?${qs}` : ''}`);
}

export function getAdminSpeakers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/speakers${qs ? `?${qs}` : ''}`);
}

export function createAdminSpeaker(payload) {
  return request('/api/admin/speakers', { method: 'POST', body: JSON.stringify(payload) });
}

export function getAdminUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/users${qs ? `?${qs}` : ''}`);
}

export function createAdminUser(payload) {
  return request('/api/admin/users', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateAdminUser(id, payload) {
  return request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getAdminSettings() {
  return request('/api/admin/settings');
}

export function updateAdminSettings(payload) {
  return request('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getAuditLogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/audit-logs${qs ? `?${qs}` : ''}`);
}

export function getPublicProjects(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/projects${qs ? `?${qs}` : ''}`);
}

export function getPublicProject(slug) {
  return request(`/api/projects/${slug}`);
}

export function getPublicTalks() {
  return request('/api/talks');
}

export function getPublicTalk(slug) {
  return request(`/api/talks/${slug}`);
}

export function registerForTalk(idOrSlug, payload) {
  return request(`/api/talks/${idOrSlug}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getPublicServices() {
  return request('/api/services');
}

export function getHealth() {
  return request('/api/health');
}
