import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveUploadRoot() {
  if (env.uploadDir) return path.resolve(env.uploadDir);
  return path.resolve(__dirname, '../../uploads');
}

/**
 * Local disk storage abstraction (S3-compatible swap later).
 */
export const storageService = {
  async ensureReady() {
    const root = resolveUploadRoot();
    await fs.mkdir(root, { recursive: true });
    return root;
  },

  async saveBuffer({ buffer, originalName, mimeType, prefix = 'docs' }) {
    const root = await this.ensureReady();
    const safeBase = String(originalName || 'file')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);
    const key = path
      .join(prefix, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${safeBase}`)
      .replace(/\\/g, '/');
    const fullPath = path.join(root, key);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, buffer);
    return { storageKey: key, mimeType, size: buffer.length, originalName: safeBase };
  },

  async openReadStream(storageKey) {
    const root = resolveUploadRoot();
    const fullPath = path.join(root, storageKey);
    // Prevent path traversal
    const resolved = path.resolve(fullPath);
    if (!resolved.startsWith(path.resolve(root))) {
      throw new Error('Invalid storage key');
    }
    const { createReadStream } = await import('fs');
    return createReadStream(resolved);
  },

  absolutePath(storageKey) {
    const root = resolveUploadRoot();
    const resolved = path.resolve(path.join(root, storageKey));
    if (!resolved.startsWith(path.resolve(root))) {
      throw new Error('Invalid storage key');
    }
    return resolved;
  },
};
