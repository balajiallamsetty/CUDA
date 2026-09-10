import { getDbHealth } from '../config/db.js';

const startedAt = Date.now();

export function getHealth(req, res) {
  const db = getDbHealth();
  const healthy = db.connected;
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    service: 'vignak-api',
    status: healthy ? 'ok' : 'degraded',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    database: db.state,
    timestamp: new Date().toISOString(),
  });
}
