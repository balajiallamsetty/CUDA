import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler.js';

/** Reject Mongo operator injection via query objects like status[$ne]=x */
export function assertScalar(value, fieldName) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') {
    throw new AppError(`Invalid query parameter: ${fieldName}`, 400);
  }
  return String(value);
}

export function asEnum(value, allowed, fieldName) {
  const scalar = assertScalar(value, fieldName);
  if (scalar === undefined) return undefined;
  if (!allowed.includes(scalar)) {
    throw new AppError(`Invalid value for ${fieldName}`, 400);
  }
  return scalar;
}

export function asObjectId(value, fieldName) {
  const scalar = assertScalar(value, fieldName);
  if (scalar === undefined) return undefined;
  if (!mongoose.isValidObjectId(scalar)) {
    throw new AppError(`Invalid id for ${fieldName}`, 400);
  }
  return scalar;
}

export function asBooleanFlag(value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') {
    throw new AppError('Invalid boolean query parameter', 400);
  }
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
}

export function asSearchText(value) {
  const scalar = assertScalar(value, 'q');
  if (!scalar) return undefined;
  return scalar.slice(0, 200);
}

export function escapeRegex(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function pickFields(source, allowed) {
  const out = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out;
}
