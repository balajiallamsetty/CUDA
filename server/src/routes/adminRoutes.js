import { Router } from 'express';
import { ROLES } from '@vignak/shared';
import { authenticate, authorize } from '../middleware/auth.js';
import { adminMe } from '../controllers/adminController.js';

const router = Router();

const staffRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.STAFF,
  ROLES.CONTENT_MANAGER,
  ROLES.SALES,
];

router.use(authenticate, authorize(...staffRoles));
router.get('/me', adminMe);

export default router;
