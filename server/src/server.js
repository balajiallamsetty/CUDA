import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function start() {
  try {
    await connectDatabase();
    logger.info('db_connected');

    const app = createApp();
    // Bind IPv4 explicitly so the Vite proxy on 127.0.0.1 can reach the API
    app.listen(env.port, '127.0.0.1', () => {
      logger.info('server_listening', { port: env.port, host: '127.0.0.1', env: env.nodeEnv });
    });
  } catch (err) {
    logger.error('server_start_failed', { message: err.message });
    process.exit(1);
  }
}

start();
