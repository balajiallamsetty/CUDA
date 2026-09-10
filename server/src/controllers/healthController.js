import { getDbHealth } from '../config/db.js';
import { env } from '../config/env.js';

const startedAt = Date.now();

/** Liveness — minimal public signal */
export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'vignak-api',
    timestamp: new Date().toISOString(),
  });
}

/** Readiness — includes DB connectivity */
export function getReady(req, res) {
  const db = getDbHealth();
  const healthy = db.connected;
  const body = {
    success: healthy,
    status: healthy ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
  };
  if (!env.isProd) {
    body.uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);
    body.database = db.state;
  } else {
    body.database = healthy ? 'up' : 'down';
  }
  res.status(healthy ? 200 : 503).json(body);
}
