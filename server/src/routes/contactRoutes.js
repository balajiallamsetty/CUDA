import { Router } from 'express';
import { postContact } from '../controllers/contactController.js';
import { createContactValidators } from '../validators/index.js';
import { validateRequest, rejectHoneypot } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/', formLimiter, rejectHoneypot, createContactValidators, validateRequest, postContact);
export default router;
