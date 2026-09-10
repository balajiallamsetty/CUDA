import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { writeAuditLog } from './auditService.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../middleware/auth.js';

export async function loginUser({ email, password }, meta = {}) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.isActive) {
    await writeAuditLog({
      action: 'AUTH_LOGIN_FAILED',
      actorEmail: email,
      ip: meta.ip,
      userAgent: meta.userAgent,
      success: false,
    });
    throw new AppError('Invalid email or password', 401);
  }

  const match = await user.comparePassword(password);
  if (!match) {
    await writeAuditLog({
      action: 'AUTH_LOGIN_FAILED',
      actor: user._id,
      actorEmail: user.email,
      ip: meta.ip,
      userAgent: meta.userAgent,
      success: false,
    });
    throw new AppError('Invalid email or password', 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);
  await writeAuditLog({
    action: 'AUTH_LOGIN',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { user, token };
}

export function attachAuthCookie(res, token) {
  setAuthCookie(res, token);
}

export async function logoutUser(req, res) {
  clearAuthCookie(res);
  if (req.user) {
    await writeAuditLog({
      action: 'AUTH_LOGOUT',
      actor: req.user._id,
      actorEmail: req.user.email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      success: true,
    });
  }
}
