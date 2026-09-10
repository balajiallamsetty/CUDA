import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(uri = env.mongodbUri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

export function getDbHealth() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const state = states[mongoose.connection.readyState] || 'unknown';
  return {
    connected: mongoose.connection.readyState === 1,
    state,
  };
}
