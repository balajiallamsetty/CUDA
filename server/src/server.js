import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function start() {
  try {
    await connectDatabase();
    logger.info('db_connected');

    const app = createApp();
    app.listen(env.port, () => {
      logger.info('server_listening', { port: env.port, env: env.nodeEnv });
    });
  } catch (err) {
    logger.error('server_start_failed', { message: err.message });
    process.exit(1);
  }
}

start();
