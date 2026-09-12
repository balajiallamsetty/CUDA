import { body } from 'express-validator';
import {
  LEAD_SERVICE_VALUES,
  LEAD_STATUS_VALUES,
  ORGANIZATION_TYPE_VALUES,
  CONTACT_METHOD_VALUES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
  PROJECT_CATEGORY_VALUES,
  TALK_STATUS_VALUES,
  ROLE_VALUES,
  PA_DOMAIN_VALUES,
  SERVICE_REQUEST_STATUS_VALUES,
  WORK_PROJECT_STATUS_VALUES,
  MILESTONE_STATUS_VALUES,
  TASK_STATUS_VALUES,
  TASK_PRIORITY_VALUES,
  TASK_VISIBILITY_VALUES,
} from '@vignak/shared';

export const createLeadValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('organization').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('organizationType')
    .optional({ checkFalsy: true })
    .isIn(ORGANIZATION_TYPE_VALUES)
    .withMessage('Invalid organization type'),
  body('service').optional({ checkFalsy: true }).isIn(LEAD_SERVICE_VALUES).withMessage('Invalid service'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 5000 }),
  body('budget').optional({ checkFalsy: true }).isIn([...BUDGET_RANGES]),
  body('timeline').optional({ checkFalsy: true }).isIn([...TIMELINE_OPTIONS]),
  body('preferredContactMethod')
    .optional({ checkFalsy: true })
    .isIn(CONTACT_METHOD_VALUES),
  body('projectCategory').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body('projectTitle').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('technologies').optional().isArray({ max: 20 }),
  body('technologies.*').optional().isString().isLength({ max: 60 }),
  body('course').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('year').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
];

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 12, max: 128 }).withMessage('Password must be at least 12 characters'),
  body('passwordConfirm').optional().isString(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('institution').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('course').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('year').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
];

export const profileUpdateValidators = [
  body('name').optional().trim().isLength({ min: 1, max: 120 }),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('institution').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('course').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('year').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
];

export const createContactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
];

export const loginValidators = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8, max: 128 }),
];

export const forgotPasswordValidators = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetPasswordValidators = [
  body('token').trim().notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 12, max: 128 })
    .withMessage('Password must be at least 12 characters'),
];

export const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 12, max: 128 })
    .withMessage('New password must be at least 12 characters'),
];

export const talkRegisterValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('organization').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
];

export const projectValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('category').isIn(PROJECT_CATEGORY_VALUES).withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('client').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('challenge').optional({ checkFalsy: true }).isLength({ max: 5000 }),
  body('solution').optional({ checkFalsy: true }).isLength({ max: 5000 }),
  body('results').optional({ checkFalsy: true }).isLength({ max: 5000 }),
  body('externalUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid URL'),
  body('technologies').optional().isArray(),
  body('images').optional().isArray(),
  body('published').optional().isBoolean(),
  body('featured').optional().isBoolean(),
  body('archived').optional().isBoolean(),
  body('slug').optional({ checkFalsy: true }).trim().isSlug().withMessage('Invalid slug'),
];

export const talkValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 8000 }),
  body('status').optional().isIn(TALK_STATUS_VALUES),
  body('location').optional({ checkFalsy: true }).trim().isLength({ max: 240 }),
  body('registrationOpen').optional().isBoolean(),
  body('published').optional().isBoolean(),
  body('archived').optional().isBoolean(),
  body('videoUrl').optional({ checkFalsy: true }).isURL(),
  body('coverImage').optional({ checkFalsy: true }).isString(),
  body('speaker').optional({ checkFalsy: true }).isMongoId(),
  body('date').optional({ checkFalsy: true }).isISO8601(),
];

export const speakerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('bio').optional({ checkFalsy: true }).isLength({ max: 5000 }),
  body('title').optional({ checkFalsy: true }).isLength({ max: 160 }),
  body('designation').optional({ checkFalsy: true }).isLength({ max: 160 }),
  body('organization').optional({ checkFalsy: true }).isLength({ max: 160 }),
  body('image').optional({ checkFalsy: true }).isString(),
];

export const leadUpdateValidators = [
  body('status').optional().isIn(LEAD_STATUS_VALUES),
  body('assignedTo').optional({ nullable: true }).isMongoId(),
  body('archived').optional().isBoolean(),
];

export const leadNoteValidators = [
  body('body').trim().notEmpty().withMessage('Note is required').isLength({ max: 4000 }),
];

export const userCreateValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 12, max: 128 }).withMessage('Password must be at least 12 characters'),
  body('role').isIn(ROLE_VALUES).withMessage('Invalid role'),
];

export const userUpdateValidators = [
  body('name').optional().trim().isLength({ max: 120 }),
  body('role').optional().isIn(ROLE_VALUES),
  body('isActive').optional().isBoolean(),
];

export const inquiryUpdateValidators = [
  body('status').optional().isIn(['NEW', 'READ', 'REPLIED', 'ARCHIVED']),
  body('assignedTo').optional({ nullable: true }).isMongoId(),
  body('archived').optional().isBoolean(),
];

export const settingsValidators = [
  body('publicContactEmail').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('publicPhone').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
  body('companyName').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
];

export const serviceValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 160 }),
  body('summary').trim().notEmpty().withMessage('Summary is required').isLength({ max: 500 }),
  body('body').optional({ checkFalsy: true }).isLength({ max: 8000 }),
  body('slug').optional({ checkFalsy: true }).trim().isSlug(),
  body('order').optional().isInt({ min: 0, max: 1000 }),
  body('published').optional().isBoolean(),
  body('id').optional().isMongoId(),
];

export const serviceRequestCreateValidators = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('domain').isIn(PA_DOMAIN_VALUES).withMessage('Invalid domain'),
  body('requirements').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
  body('technologies').optional().isArray({ max: 20 }),
  body('technologies.*').optional().isString().isLength({ max: 60 }),
  body('timeline').optional({ checkFalsy: true }).isIn([...TIMELINE_OPTIONS]),
  body('expectedCompletionDate').optional({ checkFalsy: true }).isISO8601(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body('organization').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('course').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('year').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
];

export const serviceRequestUpdateValidators = [
  body('status').optional().isIn(SERVICE_REQUEST_STATUS_VALUES),
  body('assignedTo').optional({ nullable: true }).isMongoId(),
  body('archived').optional().isBoolean(),
  body('statusNote').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

export const workProjectUpdateValidators = [
  body('status').optional().isIn(WORK_PROJECT_STATUS_VALUES),
  body('assignees').optional().isArray(),
  body('assignees.*').optional().isMongoId(),
  body('summary').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('archived').optional().isBoolean(),
];

export const milestoneValidators = [
  body('id').optional().isMongoId(),
  body('title').optional().trim().isLength({ max: 160 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('status').optional().isIn(MILESTONE_STATUS_VALUES),
  body('stage').optional().isIn(WORK_PROJECT_STATUS_VALUES),
  body('order').optional().isInt({ min: 0, max: 1000 }),
  body('weight').optional().isInt({ min: 1, max: 100 }),
  body('dueDate').optional({ checkFalsy: true }).isISO8601(),
];

export const taskValidators = [
  body('id').optional().isMongoId(),
  body('title').optional().trim().isLength({ max: 200 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 4000 }),
  body('status').optional().isIn(TASK_STATUS_VALUES),
  body('priority').optional().isIn(TASK_PRIORITY_VALUES),
  body('visibility').optional().isIn(TASK_VISIBILITY_VALUES),
  body('assignee').optional({ nullable: true }).isMongoId(),
  body('milestone').optional({ nullable: true }).isMongoId(),
  body('dueDate').optional({ checkFalsy: true }).isISO8601(),
];

export const messageValidators = [
  body('body').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
];

export const verifyEmailConfirmValidators = [
  body('token').trim().notEmpty().withMessage('Token is required'),
];
