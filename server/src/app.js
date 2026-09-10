import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicContentRoutes from './routes/publicContentRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './config/openapi.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(globalLimiter);

  if (!env.isTest) {
    app.use(morgan(env.isProd ? 'combined' : 'dev'));
  }

  if (!env.isProd) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  }

  app.get('/', (req, res) => {
    res.json({
      success: true,
      name: 'Vignak Solutions API',
      version: '2.0.0-phase2',
      docs: env.isProd ? '/api/health' : '/api/docs',
    });
  });

  app.use('/api/health', healthRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', publicContentRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
