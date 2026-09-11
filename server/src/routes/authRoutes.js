import { Router } from 'express';
import {
  login,
  logout,
  me,
  register,
  forgotPassword,
  resetPassword,
  changePasswordHandler,
  getMyProfile,
  patchMyProfile,
  getMyLeads,
  getMyLeadById,
} from '../controllers/authController.js';
import {
  loginValidators,
  registerValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  changePasswordValidators,
  profileUpdateValidators,
} from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/register', authLimiter, registerValidators, validateRequest, register);
router.post('/login', authLimiter, loginValidators, validateRequest, login);
router.post('/logout', optionalAuthenticate, logout);
router.get('/me', authenticate, me);
router.get('/me/profile', authenticate, getMyProfile);
router.patch('/me/profile', authenticate, profileUpdateValidators, validateRequest, patchMyProfile);
router.get('/me/leads', authenticate, getMyLeads);
router.get('/me/leads/:id', authenticate, getMyLeadById);
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
