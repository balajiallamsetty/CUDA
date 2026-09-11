import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { pickFields } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

const PROFILE_FIELDS = ['name', 'phone', 'institution', 'course', 'year'];

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user || !user.isActive) throw new AppError('Authentication required', 401);
  return user;
}

export async function updateProfile(userId, payload, meta = {}) {
  const user = await getProfile(userId);
  const data = pickFields(payload, PROFILE_FIELDS);
  Object.assign(user, data);
  await user.save();
  await writeAuditLog({
    action: 'USER_PROFILE_UPDATED',
    actor: user._id,
    actorEmail: user.email,
    resourceType: 'User',
    resourceId: user._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: data,
  });
  return user;
}
