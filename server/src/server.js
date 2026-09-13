import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function start() {
  try {
    await connectDatabase();
    logger.info('db_connected');

    const app = createApp();
    // Local: 127.0.0.1 so Vite's proxy can reach the API on Windows.
    // Production (Render): 0.0.0.0 so the platform proxy can reach the process.
    const host = env.isProd ? '0.0.0.0' : '127.0.0.1';
    app.listen(env.port, host, () => {
      logger.info('server_listening', { port: env.port, host, env: env.nodeEnv });
    });
  } catch (err) {
    logger.error('server_start_failed', { message: err.message });
    process.exit(1);
  }
}

start();
