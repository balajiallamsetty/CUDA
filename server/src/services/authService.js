import crypto from 'crypto';
import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { AppError } from '../middleware/errorHandler.js';
import { writeAuditLog } from './auditService.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../middleware/auth.js';
import { env } from '../config/env.js';
import { isSmtpConfigured, sendMail } from '../utils/mailer.js';
import { logger } from '../utils/logger.js';
import { ROLES } from '@vignak/shared';

const GENERIC_RESET_MESSAGE =
  'If an account exists for that email, password reset instructions have been sent.';

export async function registerUser(payload, meta = {}) {
  const email = String(payload.email || '').toLowerCase().trim();
  const password = payload.password;
  const name = String(payload.name || '').trim();

  if (!name || !email || !password) {
    throw new AppError('Name, email and password are required', 400);
  }
  if (password.length < 12) {
    throw new AppError('Password must be at least 12 characters', 400);
  }
  if (payload.passwordConfirm && payload.passwordConfirm !== password) {
    throw new AppError('Passwords do not match', 400);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: ROLES.USER,
    phone: payload.phone || '',
    institution: payload.institution || '',
    course: payload.course || '',
    year: payload.year || '',
  });

  const token = signToken(user);
  await writeAuditLog({
    action: 'AUTH_REGISTER',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { user, token };
}

export async function loginUser({ email, password }, meta = {}) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !user.isActive) {
    logger.warn('login_failed', { email, reason: 'unknown_user' });
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
    logger.warn('login_failed', { email: user.email, reason: 'bad_password' });
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
      userAgent: req.get?.('user-agent') || metaUserAgent(req),
      success: true,
    });
  }
}

function metaUserAgent(req) {
  return typeof req.get === 'function' ? req.get('user-agent') : undefined;
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

/** Deliver reset link via SMTP when configured; log in development. */
export async function sendPasswordResetEmail(email, resetUrl) {
  await sendMail({
    to: email,
    subject: 'Vignak password reset',
    text: `Reset your password using this link (expires in 1 hour):\n\n${resetUrl}\n`,
  });
}

export async function requestPasswordReset(email, meta = {}) {
  const normalized = String(email || '').toLowerCase().trim();

  // Production fail-closed: no token without SMTP (still generic response)
  if (env.isProd && !isSmtpConfigured()) {
    await writeAuditLog({
      action: 'AUTH_PASSWORD_RESET_REQUESTED',
      actorEmail: normalized,
      ip: meta.ip,
      userAgent: meta.userAgent,
      success: false,
      metadata: { reason: 'smtp_not_configured' },
    });
    return { message: GENERIC_RESET_MESSAGE };
  }

  const user = await User.findOne({ email: normalized, isActive: true });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });
    await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt });

    const resetUrl = `${env.clientUrl}/admin/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    await writeAuditLog({
      action: 'AUTH_PASSWORD_RESET_REQUESTED',
      actor: user._id,
      actorEmail: user.email,
      ip: meta.ip,
      userAgent: meta.userAgent,
      success: true,
    });
  } else {
    await writeAuditLog({
      action: 'AUTH_PASSWORD_RESET_REQUESTED',
      actorEmail: normalized,
      ip: meta.ip,
      userAgent: meta.userAgent,
      success: true,
      metadata: { matched: false },
    });
  }

  return { message: GENERIC_RESET_MESSAGE };
}

export async function resetPasswordWithToken({ token, password }, meta = {}) {
  if (!token || !password || password.length < 12) {
    throw new AppError('Invalid reset request', 400);
  }

  const tokenHash = hashToken(token);
  const record = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const user = await User.findById(record.user).select('+passwordHash');
  if (!user || !user.isActive) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.passwordHash = await User.hashPassword(password);
  user.passwordChangedAt = new Date();
  await user.save();

  record.usedAt = new Date();
  await record.save();
  await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });

  await writeAuditLog({
    action: 'AUTH_PASSWORD_RESET',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { message: 'Password updated successfully. You can sign in now.' };
}

export async function changePassword(userId, { currentPassword, newPassword }, meta = {}) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user || !user.isActive) {
    throw new AppError('Authentication required', 401);
  }

  const match = await user.comparePassword(currentPassword);
  if (!match) {
    throw new AppError('Current password is incorrect', 400);
  }

  if (!newPassword || newPassword.length < 12) {
    throw new AppError('New password must be at least 12 characters', 400);
  }

  user.passwordHash = await User.hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();

  await writeAuditLog({
    action: 'AUTH_PASSWORD_CHANGED',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { message: 'Password changed successfully.' };
}
