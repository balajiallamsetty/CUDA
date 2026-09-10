import { validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

export function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(
      new AppError('Validation failed', 400, result.array().map((e) => ({
        field: e.path,
        message: e.msg,
      }))),
    );
  }
  return next();
}

/** Honeypot field: bots fill company_website; humans leave it empty. */
export function rejectHoneypot(req, res, next) {
  if (req.body?.company_website) {
    return res.status(200).json({ success: true, message: 'Thank you. We will be in touch soon.' });
  }
  return next();
}
