const API_BASE = import.meta.env.VITE_API_URL || '';
const DEFAULT_TIMEOUT_MS = 30000;

let unauthorizedHandler = null;
let handlingUnauthorized = false;

/** Register once from AuthProvider — clears session on admin 401 */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function isAdminPath(path) {
  return typeof path === 'string' && path.startsWith('/api/admin');
}

async function request(path, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      ...fetchOptions,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      const timeoutError = new Error('Request timed out. Please try again.');
      timeoutError.status = 0;
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    const networkError = new Error('Network error. Check your connection and try again.');
    networkError.status = 0;
    networkError.code = 'NETWORK';
    throw networkError;
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    if (res.status === 401 && isAdminPath(path) && unauthorizedHandler && !handlingUnauthorized) {
      handlingUnauthorized = true;
      try {
        await unauthorizedHandler();
      } finally {
        handlingUnauthorized = false;
      }
    }
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

export function register(payload) {
  return request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

export function getMe() {
  return request('/api/auth/me');
}

export function getMyProfile() {
  return request('/api/auth/me/profile');
}

export function updateMyProfile(payload) {
  return request('/api/auth/me/profile', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function getMyLeads(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/leads${qs ? `?${qs}` : ''}`);
}

export function getMyLead(id) {
  return request(`/api/auth/me/leads/${id}`);
}

export function getMyOverview() {
  return request('/api/auth/me/overview');
}

export function getMyServiceRequests(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/service-requests${qs ? `?${qs}` : ''}`);
}

export function getMyServiceRequest(id) {
  return request(`/api/auth/me/service-requests/${id}`);
}

export function createMyServiceRequest(payload) {
  return request('/api/auth/me/service-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMyWorkProjects(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/work-projects${qs ? `?${qs}` : ''}`);
}

export function getMyWorkProject(id) {
  return request(`/api/auth/me/work-projects/${id}`);
}

export function postMyProjectMessage(id, body) {
  return request(`/api/auth/me/work-projects/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export function getMyNotifications(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/notifications${qs ? `?${qs}` : ''}`);
}

export function readMyNotification(id) {
  return request(`/api/auth/me/notifications/${id}/read`, { method: 'PATCH' });
}

export function readAllMyNotifications() {
  return request('/api/auth/me/notifications/read-all', { method: 'POST' });
}

export function downloadMyDocumentUrl(id) {
  return `/api/auth/me/documents/${id}/download`;
}

export function requestEmailVerification() {
  return request('/api/auth/verify-email/request', { method: 'POST' });
}

export function confirmEmailVerification(token) {
  return request('/api/auth/verify-email/confirm', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function getAdminServiceRequests(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/service-requests${qs ? `?${qs}` : ''}`);
}

export function getAdminServiceRequest(id) {
  return request(`/api/admin/service-requests/${id}`);
}

export function updateAdminServiceRequest(id, payload) {
  return request(`/api/admin/service-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function convertAdminServiceRequest(id) {
  return request(`/api/admin/service-requests/${id}/convert`, { method: 'POST' });
}

export function getAdminWorkProjects(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/work-projects${qs ? `?${qs}` : ''}`);
}

export function getAdminWorkProject(id) {
  return request(`/api/admin/work-projects/${id}`);
}

export function updateAdminWorkProject(id, payload) {
  return request(`/api/admin/work-projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function upsertAdminMilestone(projectId, payload) {
  return request(`/api/admin/work-projects/${projectId}/milestones`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function upsertAdminTask(projectId, payload) {
  return request(`/api/admin/work-projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function postAdminProjectMessage(projectId, body, visibility = 'CLIENT') {
  return request(`/api/admin/work-projects/${projectId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body, visibility }),
  });
}

export async function uploadAdminProjectDocument(projectId, formData) {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${API_BASE}/api/admin/work-projects/${projectId}/documents`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Upload failed');
  return data;
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

export function getCatalogServices() {
  return request('/api/catalog/services');
}

export function getCatalogService(slug) {
  return request(`/api/catalog/services/${slug}`);
}

export function getMyQuotations(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/quotations${qs ? `?${qs}` : ''}`);
}

export function getMyQuotation(id) {
  return request(`/api/auth/me/quotations/${id}`);
}

export function approveMyQuotation(id) {
  return request(`/api/auth/me/quotations/${id}/approve`, { method: 'POST' });
}

export function rejectMyQuotation(id, note = '') {
  return request(`/api/auth/me/quotations/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export function getMyPayments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/payments${qs ? `?${qs}` : ''}`);
}

export function getMyDeliverables(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/auth/me/deliverables${qs ? `?${qs}` : ''}`);
}

export function getMyDeliverable(id) {
  return request(`/api/auth/me/deliverables/${id}`);
}

export function approveMyDeliverable(id) {
  return request(`/api/auth/me/deliverables/${id}/approve`, { method: 'POST' });
}

export function requestMyDeliverableChanges(id, note = '') {
  return request(`/api/auth/me/deliverables/${id}/request-changes`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export function getAdminServiceDefinitions() {
  return request('/api/admin/service-definitions');
}

export function getAdminServiceDefinition(id) {
  return request(`/api/admin/service-definitions/${id}`);
}

export function updateAdminServiceDefinition(id, payload) {
  return request(`/api/admin/service-definitions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function createAdminQuotation(requestId, payload) {
  return request(`/api/admin/service-requests/${requestId}/quotations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function recordAdminPayment(payload) {
  return request('/api/admin/payments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAdminPayments(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/payments${qs ? `?${qs}` : ''}`);
}

export function createAdminDeliverable(projectId, payload) {
  return request(`/api/admin/work-projects/${projectId}/deliverables`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAdminProjectDeliverables(projectId) {
  return request(`/api/admin/work-projects/${projectId}/deliverables`);
}

export function getAdminAssignedOverview() {
  return request('/api/admin/assigned-overview');
}

export function getHealth() {
  return request('/api/health');
}
