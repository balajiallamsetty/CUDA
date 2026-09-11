import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDatabase(uri = env.mongodbUri, { retries = 5, delayMs = 2000 } = {}) {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  mongoose.set('strictQuery', true);

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      return mongoose.connection;
    } catch (err) {
      lastError = err;
      logger.warn('db_connect_retry', {
        attempt,
        retries,
        message: err.message,
      });
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}

export function getDbHealth() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = states[mongoose.connection.readyState] || 'unknown';
  return {
    connected: mongoose.connection.readyState === 1,
    state,
  };
}
