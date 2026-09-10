import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { loginValidators } from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/login', authLimiter, loginValidators, validateRequest, login);
router.post('/logout', logout);
router.get('/me', authenticate, me);
export default router;
