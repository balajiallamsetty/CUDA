import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export function loadEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProd = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  const jwtSecret = process.env.JWT_SECRET || '';
  if (isProd) {
    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be set to a strong value (32+ characters) in production');
    }
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required in production');
    }
    if (!process.env.CLIENT_URL) {
      throw new Error('CLIENT_URL is required in production');
    }
  } else if (!isTest && !jwtSecret) {
    console.warn('[config] JWT_SECRET missing — using insecure development fallback');
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv,
    mongodbUri: process.env.MONGODB_URI || '',
    jwtSecret: jwtSecret || 'dev_insecure_secret_change_me_do_not_use_in_prod',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    uploadDir: process.env.UPLOAD_DIR || '',
    paymentProvider: process.env.PAYMENT_PROVIDER || '',
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || '',
    isProd,
    isTest,
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: Number(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'noreply@vignak.solutions',
    },
  };
}

export const env = loadEnv();
