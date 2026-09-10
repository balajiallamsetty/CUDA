import { ROLES, ROLE_VALUES } from '@vignak/shared';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, buildMeta, parseSort } from '../utils/pagination.js';
import { asEnum, asSearchText, assertScalar, escapeRegex } from '../utils/safeQuery.js';
import { writeAuditLog } from './auditService.js';

function assertCanManageRole(actor, targetRole, previousRole = null) {
  if (actor.role === ROLES.SUPER_ADMIN) return;

  if (actor.role !== ROLES.ADMIN) {
    throw new AppError('Insufficient permissions', 403);
  }

  if (targetRole === ROLES.SUPER_ADMIN || previousRole === ROLES.SUPER_ADMIN) {
    throw new AppError('Only SUPER_ADMIN can manage SUPER_ADMIN accounts', 403);
  }
}

export async function listUsers(query) {
  const { page, limit, skip } = parsePagination(query);
  const sort = parseSort(query, ['createdAt', 'name', 'role'], '-createdAt');
  const filter = {};
  const role = asEnum(query.role, ROLE_VALUES, 'role');
  if (role) filter.role = role;
  if (assertScalar(query.isActive, 'isActive') === 'true') filter.isActive = true;
  if (assertScalar(query.isActive, 'isActive') === 'false') filter.isActive = false;
  const q = asSearchText(query.q);
  if (q) {
    const safe = escapeRegex(q);
    filter.$or = [
      { name: new RegExp(safe, 'i') },
      { email: new RegExp(safe, 'i') },
    ];
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return {
    items: items.map((u) => u.toSafeObject()),
    meta: buildMeta({ page, limit, total }),
  };
}

export async function createUser(payload, actor, meta = {}) {
  assertCanManageRole(actor, payload.role);
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) throw new AppError('Email already in use', 409);

  const passwordHash = await User.hashPassword(payload.password);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role,
    isActive: payload.isActive !== false,
  });

  await writeAuditLog({
    action: 'USER_CREATED',
    actor: actor._id,
    actorEmail: actor.email,
    resourceType: 'User',
    resourceId: user._id.toString(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    metadata: { role: user.role, email: user.email },
  });

  return user.toSafeObject();
}

export async function updateUser(id, payload, actor, meta = {}) {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);

  if (payload.role && payload.role !== user.role) {
    assertCanManageRole(actor, payload.role, user.role);
    const previous = user.role;
    user.role = payload.role;
    await writeAuditLog({
      action: 'USER_ROLE_CHANGED',
      actor: actor._id,
      actorEmail: actor.email,
      resourceType: 'User',
      resourceId: user._id.toString(),
      ip: meta.ip,
      userAgent: meta.userAgent,
      metadata: { from: previous, to: payload.role },
    });
  }

  if (typeof payload.isActive === 'boolean' && payload.isActive !== user.isActive) {
    assertCanManageRole(actor, user.role, user.role);
    if (user._id.equals(actor._id) && payload.isActive === false) {
      throw new AppError('You cannot disable your own account', 400);
    }
    user.isActive = payload.isActive;
    await writeAuditLog({
      action: payload.isActive ? 'USER_ENABLED' : 'USER_DISABLED',
      actor: actor._id,
      actorEmail: actor.email,
      resourceType: 'User',
      resourceId: user._id.toString(),
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
  }

  if (payload.name) user.name = payload.name;
  await user.save();
  return user.toSafeObject();
}
