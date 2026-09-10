import { ROLES } from '@vignak/shared';

const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.STAFF,
  ROLES.CONTENT_MANAGER,
  ROLES.SALES,
];

export async function adminMe(req, res) {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
      allowedRoles: STAFF_ROLES,
      message: 'Admin API access granted. Full dashboard arrives in a later phase.',
    },
  });
}
