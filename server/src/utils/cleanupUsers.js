/**
 * Maintenance: delete non-protected user accounts + auth dependents,
 * then create/verify protected SUPER_ADMIN.
 *
 * NEVER runs on server startup. Explicit invoke only:
 *   DB_CLEANUP_DRY_RUN=true npm run db:cleanup-users
 *   DB_CLEANUP_CONFIRM=true ADMIN_PASSWORD=... npm run db:cleanup-users
 *
 * Never logs passwords, hashes, or MongoDB credentials.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { ROLES } from '@vignak/shared';
import { connectDatabase } from '../config/db.js';
import { User } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import { Notification } from '../models/Notification.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PROTECTED_EMAIL = 'cudasolutionstech@gmail.com';

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase());
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getAdminPasswordFromEnv() {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || '';
}

async function ensureProtectedAdmin({ dryRun }) {
  const protectedEmail = normalizeEmail(PROTECTED_EMAIL);
  const password = getAdminPasswordFromEnv();
  const name = process.env.ADMIN_NAME || 'CUDA Solutions Admin';
  const resetPassword = isTruthy(process.env.ADMIN_RESET_PASSWORD);

  let admin = await User.findOne({ email: protectedEmail }).select('+passwordHash');

  if (!admin) {
    if (!password) {
      console.error('Protected admin does not exist. Set ADMIN_PASSWORD (or ADMIN_INITIAL_PASSWORD) to create it.');
      process.exit(1);
    }
    if (password.length < 12) {
      console.error('ADMIN_PASSWORD must be at least 12 characters.');
      process.exit(1);
    }
    if (dryRun) {
      console.log(`[dry-run] Would CREATE SUPER_ADMIN for ${protectedEmail}`);
      return { action: 'would_create' };
    }
    const passwordHash = await User.hashPassword(password);
    admin = await User.create({
      name,
      email: protectedEmail,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      isActive: true,
    });
    console.log(`Created SUPER_ADMIN: ${admin.email}`);
    return { action: 'created' };
  }

  const updates = {};
  if (admin.role !== ROLES.SUPER_ADMIN) updates.role = ROLES.SUPER_ADMIN;
  if (admin.isActive === false) updates.isActive = true;

  if (resetPassword) {
    if (!password) {
      console.error('ADMIN_RESET_PASSWORD=true requires ADMIN_PASSWORD (or ADMIN_INITIAL_PASSWORD).');
      process.exit(1);
    }
    if (password.length < 12) {
      console.error('ADMIN_PASSWORD must be at least 12 characters.');
      process.exit(1);
    }
    if (dryRun) {
      console.log(`[dry-run] Would RESET password hash for ${protectedEmail}`);
    } else {
      updates.passwordHash = await User.hashPassword(password);
      updates.passwordChangedAt = new Date();
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log(`Protected admin verified: ${admin.email} (${admin.role}), password hashed=${Boolean(admin.passwordHash)}`);
    return { action: 'verified' };
  }

  if (dryRun) {
    console.log(`[dry-run] Would UPDATE protected admin ${protectedEmail}: ${Object.keys(updates).join(', ')}`);
    return { action: 'would_update' };
  }

  Object.assign(admin, updates);
  await admin.save();
  console.log(`Updated protected admin: ${admin.email} (${admin.role})`);
  return { action: 'updated' };
}

async function main() {
  const dryRun = isTruthy(process.env.DB_CLEANUP_DRY_RUN);
  const confirm = isTruthy(process.env.DB_CLEANUP_CONFIRM);
  const protectedEmail = normalizeEmail(PROTECTED_EMAIL);

  await connectDatabase();
  const dbName = mongoose.connection.name;

  const allUsers = await User.find({}).select('_id email role isActive').lean();
  const protectedUsers = allUsers.filter((u) => normalizeEmail(u.email) === protectedEmail);
  const deletableUsers = allUsers.filter((u) => normalizeEmail(u.email) !== protectedEmail);
  const deletableIds = deletableUsers.map((u) => u._id);

  const [resetTokenCount, verifyTokenCount, notificationCount] = await Promise.all([
    deletableIds.length
      ? PasswordResetToken.countDocuments({ user: { $in: deletableIds } })
      : Promise.resolve(0),
    deletableIds.length
      ? EmailVerificationToken.countDocuments({ user: { $in: deletableIds } })
      : Promise.resolve(0),
    deletableIds.length
      ? Notification.countDocuments({ user: { $in: deletableIds } })
      : Promise.resolve(0),
  ]);

  console.log('');
  console.log('DATABASE CLEANUP PLAN');
  console.log('=====================');
  console.log(`Database: ${dbName}`);
  console.log('Collections affected: users, passwordresettokens, emailverificationtokens, notifications');
  console.log('Unrelated collections: untouched (leads, projects, CMS, payments, audit logs, etc.)');
  console.log(`Users found: ${allUsers.length}`);
  console.log(`Users to delete: ${deletableUsers.length}`);
  console.log(`Protected admin: ${PROTECTED_EMAIL}`);
  console.log(`Protected records: ${protectedUsers.length}`);
  console.log(`Related password reset tokens to delete: ${resetTokenCount}`);
  console.log(`Related email verification tokens to delete: ${verifyTokenCount}`);
  console.log(`Related notifications to delete: ${notificationCount}`);
  console.log(`DRY RUN: ${dryRun ? 'YES' : 'NO'}`);
  console.log(`CONFIRM: ${confirm ? 'YES' : 'NO'}`);
  console.log('');

  if (dryRun) {
    console.log('USER DATA CLEANUP — DRY RUN');
    console.log(`Users eligible for deletion: ${deletableUsers.length}`);
    console.log(`Users protected: ${protectedUsers.length}`);
    await ensureProtectedAdmin({ dryRun: true });
    console.log('No data was deleted.');
    await mongoose.disconnect();
    process.exit(0);
  }

  if (!confirm) {
    console.error('Refusing to delete. Set DB_CLEANUP_CONFIRM=true after reviewing a dry run.');
    console.error('Example: DB_CLEANUP_DRY_RUN=true npm run db:cleanup-users');
    await mongoose.disconnect();
    process.exit(1);
  }

  if (deletableIds.length > 0) {
    const userDelete = await User.deleteMany({ _id: { $in: deletableIds } });
    console.log(`Deleted users: ${userDelete.deletedCount}`);

    const [resetDel, verifyDel, notifDel] = await Promise.all([
      PasswordResetToken.deleteMany({ user: { $in: deletableIds } }),
      EmailVerificationToken.deleteMany({ user: { $in: deletableIds } }),
      Notification.deleteMany({ user: { $in: deletableIds } }),
    ]);
    console.log(`Deleted password reset tokens: ${resetDel.deletedCount}`);
    console.log(`Deleted email verification tokens: ${verifyDel.deletedCount}`);
    console.log(`Deleted notifications: ${notifDel.deletedCount}`);
  } else {
    console.log('No non-protected users to delete.');
  }

  await ensureProtectedAdmin({ dryRun: false });

  const remaining = await User.countDocuments();
  const admin = await User.findOne({ email: protectedEmail }).select('+passwordHash role isActive');
  console.log('');
  console.log('POST-CLEANUP VERIFICATION');
  console.log(`Users remaining: ${remaining}`);
  console.log(`Protected admin present: ${Boolean(admin)}`);
  console.log(`Protected admin role: ${admin?.role || 'N/A'}`);
  console.log(`Protected admin active: ${admin?.isActive}`);
  console.log(`Protected admin password hashed: ${Boolean(admin?.passwordHash)}`);
  console.log('Admin account verified.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Cleanup failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
