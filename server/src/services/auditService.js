import { AuditLog } from '../models/AuditLog.js';

export async function writeAuditLog({
  action,
  actor = null,
  actorEmail = null,
  resourceType = null,
  resourceId = null,
  ip = null,
  userAgent = null,
  metadata = null,
  success = true,
}) {
  try {
    await AuditLog.create({
      action,
      actor: actor || undefined,
      actorEmail,
      resourceType,
      resourceId,
      ip,
      userAgent,
      metadata,
      success,
    });
  } catch (err) {
    console.error('[audit] failed to write log', err.message);
  }
}
