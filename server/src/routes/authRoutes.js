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
import * as platform from '../controllers/platformController.js';
import {
  loginValidators,
  registerValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  changePasswordValidators,
  profileUpdateValidators,
  serviceRequestCreateValidators,
  messageValidators,
  verifyEmailConfirmValidators,
} from '../validators/index.js';
import { validateRequest } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiters.js';
import * as ecosystem from '../controllers/ecosystemController.js';

const router = Router();

router.post('/register', authLimiter, registerValidators, validateRequest, register);
router.post('/login', authLimiter, loginValidators, validateRequest, login);
router.post('/logout', optionalAuthenticate, logout);
router.get('/me', authenticate, me);
router.get('/me/profile', authenticate, getMyProfile);
router.patch('/me/profile', authenticate, profileUpdateValidators, validateRequest, patchMyProfile);
router.get('/me/leads', authenticate, getMyLeads);
router.get('/me/leads/:id', authenticate, getMyLeadById);

router.get('/me/overview', authenticate, platform.myDashboardOverview);
router.get('/me/service-requests', authenticate, platform.listMyServiceRequests);
router.post(
  '/me/service-requests',
  authenticate,
  serviceRequestCreateValidators,
  validateRequest,
  platform.createMyServiceRequest,
);
router.get('/me/service-requests/:id', authenticate, platform.getMyServiceRequest);
router.get('/me/work-projects', authenticate, platform.listMyWorkProjects);
router.get('/me/work-projects/:id', authenticate, platform.getMyWorkProject);
router.post(
  '/me/work-projects/:id/messages',
  authenticate,
  messageValidators,
  validateRequest,
  platform.postMyProjectMessage,
);
router.get('/me/notifications', authenticate, platform.listMyNotifications);
router.patch('/me/notifications/:id/read', authenticate, platform.readMyNotification);
router.post('/me/notifications/read-all', authenticate, platform.readAllMyNotifications);
router.get('/me/documents/:id/download', authenticate, platform.downloadMyDocument);

router.get('/me/quotations', authenticate, ecosystem.listMyQuotations);
router.get('/me/quotations/:id', authenticate, ecosystem.getMyQuotation);
router.post('/me/quotations/:id/approve', authenticate, ecosystem.approveQuotation);
router.post('/me/quotations/:id/reject', authenticate, ecosystem.rejectQuotation);

router.get('/me/payments', authenticate, ecosystem.listMyPayments);
router.get('/me/payments/:id', authenticate, ecosystem.getMyPayment);

router.get('/me/deliverables', authenticate, ecosystem.listMyDeliverables);
router.get('/me/deliverables/:id', authenticate, ecosystem.getMyDeliverable);
router.post('/me/deliverables/:id/approve', authenticate, ecosystem.approveDeliverable);
router.post('/me/deliverables/:id/request-changes', authenticate, ecosystem.requestDeliverableChanges);

router.post('/verify-email/request', authenticate, platform.requestVerifyEmail);
router.post(
  '/verify-email/confirm',
  authenticate,
  verifyEmailConfirmValidators,
  validateRequest,
  platform.confirmVerifyEmail,
);

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
