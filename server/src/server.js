import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await connectDatabase();
    console.log('[db] Connected to MongoDB');

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`[server] Vignak API listening on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
