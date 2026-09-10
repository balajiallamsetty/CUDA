import { Router } from 'express';
import {
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  changePasswordHandler,
} from '../controllers/authController.js';
import {
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  changePasswordValidators,
} from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiters.js';

const router = Router();
router.post('/login', authLimiter, loginValidators, validateRequest, login);
router.post('/logout', optionalAuthenticate, logout);
router.get('/me', authenticate, me);
router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotPasswordValidators,
  validateRequest,
  forgotPassword,
);
router.post(
  '/reset-password',
  passwordResetLimiter,
  resetPasswordValidators,
  validateRequest,
  resetPassword,
);
router.post(
  '/change-password',
  authenticate,
  changePasswordValidators,
  validateRequest,
  changePasswordHandler,
);
export default router;
