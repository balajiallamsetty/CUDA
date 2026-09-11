import { Router } from 'express';
import { postLead } from '../controllers/leadController.js';
import { createLeadValidators } from '../validators/index.js';
import { validateRequest, rejectHoneypot } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiters.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();
router.post(
  '/',
  formLimiter,
  optionalAuthenticate,
  rejectHoneypot,
  createLeadValidators,
  validateRequest,
  postLead,
);
export default router;
