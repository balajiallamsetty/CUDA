const SENSITIVE_KEYS = /password|token|authorization|cookie|secret|smtp_pass|jwt/i;

function sanitize(value, depth = 0) {
  if (depth > 4 || value == null) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => sanitize(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = SENSITIVE_KEYS.test(k) ? '[redacted]' : sanitize(v, depth + 1);
  }
  return out;
}

function emit(level, message, meta = {}) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...sanitize(meta),
  };
  const line = process.env.NODE_ENV === 'production'
    ? JSON.stringify(entry)
    : `[${entry.level}] ${entry.message}${Object.keys(meta).length ? ` ${JSON.stringify(sanitize(meta))}` : ''}`;

  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message, meta) => emit('info', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  error: (message, meta) => emit('error', message, meta),
};
