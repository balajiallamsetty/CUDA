import { Notification } from '../models/Notification.js';

export async function createNotification({
  userId,
  type,
  title,
  body = '',
  link = '',
  resourceType = '',
  resourceId = '',
}) {
  if (!userId) return null;
  return Notification.create({
    user: userId,
    type,
    title,
    body,
    link,
    resourceType,
    resourceId: resourceId ? String(resourceId) : '',
  });
}

export async function listNotifications(userId, { unreadOnly = false } = {}) {
  const filter = { user: userId };
  if (unreadOnly) filter.readAt = null;
  return Notification.find(filter).sort({ createdAt: -1 }).limit(100).lean();
}

export async function markNotificationRead(userId, id) {
  return Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { readAt: new Date() },
    { new: true },
  );
}

export async function markAllNotificationsRead(userId) {
  await Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() });
  return { success: true };
}

export async function unreadNotificationCount(userId) {
  return Notification.countDocuments({ user: userId, readAt: null });
}
