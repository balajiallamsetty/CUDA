import { Router } from 'express';
import { PERMISSIONS } from '@vignak/shared';
import { authenticate, requireStaff, authorizePermission } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  projectValidators,
  talkValidators,
  speakerValidators,
  leadUpdateValidators,
  leadNoteValidators,
  userCreateValidators,
  userUpdateValidators,
  inquiryUpdateValidators,
  settingsValidators,
  serviceValidators,
  serviceRequestUpdateValidators,
  workProjectUpdateValidators,
  milestoneValidators,
  taskValidators,
  messageValidators,
} from '../validators/index.js';
import * as admin from '../controllers/adminController.js';
import * as adminPlatform from '../controllers/adminPlatformController.js';
import { uploadDocumentMiddleware } from '../middleware/upload.js';

const router = Router();

router.use(authenticate, requireStaff);

router.get('/me', admin.adminMe);
router.get('/dashboard/stats', authorizePermission(PERMISSIONS.DASHBOARD_READ), admin.dashboardStats);

router.get('/leads', authorizePermission(PERMISSIONS.LEADS_READ), admin.listLeads);
router.get('/leads/:id', authorizePermission(PERMISSIONS.LEADS_READ), admin.getLead);
router.patch(
  '/leads/:id',
  authorizePermission(PERMISSIONS.LEADS_WRITE),
  leadUpdateValidators,
  validateRequest,
  admin.patchLead,
);
router.post(
  '/leads/:id/notes',
  authorizePermission(PERMISSIONS.LEADS_WRITE),
  leadNoteValidators,
  validateRequest,
  admin.postLeadNote,
);

router.get('/inquiries', authorizePermission(PERMISSIONS.INQUIRIES_READ), admin.listInquiries);
router.get('/inquiries/:id', authorizePermission(PERMISSIONS.INQUIRIES_READ), admin.getInquiry);
router.patch(
  '/inquiries/:id',
  authorizePermission(PERMISSIONS.INQUIRIES_WRITE),
  inquiryUpdateValidators,
  validateRequest,
  admin.patchInquiry,
);

router.get('/projects', authorizePermission(PERMISSIONS.PROJECTS_READ), admin.listProjects);
router.get('/projects/:id', authorizePermission(PERMISSIONS.PROJECTS_READ), admin.getProject);
router.post(
  '/projects',
  authorizePermission(PERMISSIONS.PROJECTS_WRITE),
  projectValidators,
  validateRequest,
  admin.createProject,
);
router.patch(
  '/projects/:id',
  authorizePermission(PERMISSIONS.PROJECTS_WRITE),
  projectValidators,
  validateRequest,
  admin.patchProject,
);

router.get('/speakers', authorizePermission(PERMISSIONS.SPEAKERS_READ), admin.listSpeakers);
router.post(
  '/speakers',
  authorizePermission(PERMISSIONS.SPEAKERS_WRITE),
  speakerValidators,
  validateRequest,
  admin.createSpeaker,
);
router.patch(
  '/speakers/:id',
  authorizePermission(PERMISSIONS.SPEAKERS_WRITE),
  speakerValidators,
  validateRequest,
  admin.patchSpeaker,
);

router.get('/talks', authorizePermission(PERMISSIONS.TALKS_READ), admin.listTalks);
router.get('/talks/:id', authorizePermission(PERMISSIONS.TALKS_READ), admin.getTalk);
router.post(
  '/talks',
  authorizePermission(PERMISSIONS.TALKS_WRITE),
  talkValidators,
  validateRequest,
  admin.createTalk,
);
router.patch(
  '/talks/:id',
  authorizePermission(PERMISSIONS.TALKS_WRITE),
  talkValidators,
  validateRequest,
  admin.patchTalk,
);
router.get(
  '/talks/:id/registrations',
  authorizePermission(PERMISSIONS.TALKS_READ),
  admin.listRegistrations,
);

router.get('/users', authorizePermission(PERMISSIONS.USERS_READ), admin.listUsers);
router.post(
  '/users',
  authorizePermission(PERMISSIONS.USERS_WRITE),
  userCreateValidators,
  validateRequest,
  admin.createUser,
);
router.patch(
  '/users/:id',
  authorizePermission(PERMISSIONS.USERS_WRITE),
  userUpdateValidators,
  validateRequest,
  admin.patchUser,
);

router.get('/settings', authorizePermission(PERMISSIONS.SETTINGS_READ), admin.getSettings);
router.patch(
  '/settings',
  authorizePermission(PERMISSIONS.SETTINGS_WRITE),
  settingsValidators,
  validateRequest,
  admin.patchSettings,
);
router.get('/audit-logs', authorizePermission(PERMISSIONS.AUDIT_READ), admin.listAuditLogs);
router.get('/services', authorizePermission(PERMISSIONS.SERVICES_READ), admin.listServices);
router.post(
  '/services',
  authorizePermission(PERMISSIONS.SERVICES_WRITE),
  serviceValidators,
  validateRequest,
  admin.upsertService,
);

router.get(
  '/service-requests',
  authorizePermission(PERMISSIONS.SERVICE_REQUESTS_READ),
  adminPlatform.listServiceRequests,
);
router.get(
  '/service-requests/:id',
  authorizePermission(PERMISSIONS.SERVICE_REQUESTS_READ),
  adminPlatform.getServiceRequest,
);
router.patch(
  '/service-requests/:id',
  authorizePermission(PERMISSIONS.SERVICE_REQUESTS_WRITE),
  serviceRequestUpdateValidators,
  validateRequest,
  adminPlatform.patchServiceRequest,
);
router.post(
  '/service-requests/:id/convert',
  authorizePermission(PERMISSIONS.WORK_PROJECTS_WRITE),
  adminPlatform.convertServiceRequest,
);

router.get(
  '/work-projects',
  authorizePermission(PERMISSIONS.WORK_PROJECTS_READ),
  adminPlatform.listWorkProjects,
);
router.get(
  '/work-projects/:id',
  authorizePermission(PERMISSIONS.WORK_PROJECTS_READ),
  adminPlatform.getWorkProject,
);
router.patch(
  '/work-projects/:id',
  authorizePermission(PERMISSIONS.WORK_PROJECTS_WRITE),
  workProjectUpdateValidators,
  validateRequest,
  adminPlatform.patchWorkProject,
);
router.post(
  '/work-projects/:id/milestones',
  authorizePermission(PERMISSIONS.MILESTONES_WRITE),
  milestoneValidators,
  validateRequest,
  adminPlatform.upsertMilestone,
);
router.post(
  '/work-projects/:id/tasks',
  authorizePermission(PERMISSIONS.TASKS_WRITE),
  taskValidators,
  validateRequest,
  adminPlatform.upsertTask,
);
router.post(
  '/work-projects/:id/messages',
  authorizePermission(PERMISSIONS.MESSAGES_WRITE),
  messageValidators,
  validateRequest,
  adminPlatform.postWorkProjectMessage,
);
router.post(
  '/work-projects/:id/documents',
  authorizePermission(PERMISSIONS.DOCUMENTS_WRITE),
  uploadDocumentMiddleware,
  adminPlatform.uploadWorkProjectDocument,
);
router.get(
  '/documents/:id/download',
  authorizePermission(PERMISSIONS.DOCUMENTS_READ),
  adminPlatform.downloadDocument,
);

export default router;
