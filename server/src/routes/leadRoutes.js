import { Router } from 'express';
import { postLead } from '../controllers/leadController.js';
import { createLeadValidators } from '../validators/index.js';
import { validateRequest, rejectHoneypot } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/', formLimiter, rejectHoneypot, createLeadValidators, validateRequest, postLead);
export default router;
