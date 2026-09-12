import crypto from 'crypto';
import { User } from '../models/User.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';
import { isSmtpConfigured, sendMail } from '../utils/mailer.js';
import { writeAuditLog } from './auditService.js';

export async function requestEmailVerification(user, meta = {}) {
  if (user.emailVerifiedAt) {
    return { message: 'Email is already verified.' };
  }

  const raw = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(raw).digest('hex');
  await EmailVerificationToken.create({
    user: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const link = `${env.clientUrl}/dashboard/profile?verify=${raw}`;

  if (env.isProd && !isSmtpConfigured()) {
    return { message: 'If SMTP is configured, a verification email will be sent.' };
  }

  await sendMail({
    to: user.email,
    subject: 'Verify your Vignak email',
    text: `Verify your email by opening: ${link}\nThis link expires in 24 hours.`,
  });

  await writeAuditLog({
    action: 'EMAIL_VERIFY_REQUESTED',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { message: 'Verification email sent if mail delivery is available.' };
}

export async function confirmEmailVerification(token, meta = {}) {
  if (!token) throw new AppError('Token is required', 400);
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = await EmailVerificationToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!record) throw new AppError('Invalid or expired verification token', 400);

  const user = await User.findById(record.user);
  if (!user) throw new AppError('User not found', 404);

  user.emailVerifiedAt = new Date();
  await user.save();
  record.usedAt = new Date();
  await record.save();

  await writeAuditLog({
    action: 'EMAIL_VERIFIED',
    actor: user._id,
    actorEmail: user.email,
    ip: meta.ip,
    userAgent: meta.userAgent,
    success: true,
  });

  return { user };
}
