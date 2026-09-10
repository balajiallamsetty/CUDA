import { body } from 'express-validator';
import {
  LEAD_SERVICE_VALUES,
  ORGANIZATION_TYPE_VALUES,
  CONTACT_METHOD_VALUES,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
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
  body('service').isIn(LEAD_SERVICE_VALUES).withMessage('Invalid service'),
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
