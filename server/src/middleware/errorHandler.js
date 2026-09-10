import { logger } from '../utils/logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

export function notFoundHandler(req, res, next) {
  const message = process.env.NODE_ENV === 'production'
    ? 'Resource not found'
    : `Route not found: ${req.method} ${req.originalUrl}`;
  next(new AppError(message, 404));
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (statusCode >= 500) {
    logger.error('request_error', {
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message: err.message,
    });
  } else if (statusCode === 401) {
    logger.warn('auth_failure', {
      method: req.method,
      path: req.originalUrl,
      message: err.message,
    });
  }

  let message = err.message || 'Internal server error';
  if (isProd) {
    if (statusCode >= 500) message = 'Internal server error';
    else if (statusCode === 404) message = err.isOperational ? err.message : 'Resource not found';
  }

  const payload = {
    success: false,
    message,
  };

  if (err.details && statusCode < 500) {
    payload.errors = err.details;
  }

  if (!isProd && statusCode >= 500) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
