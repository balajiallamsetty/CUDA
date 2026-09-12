import multer from 'multer';
import { AppError } from './errorHandler.js';

const ALLOWED = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new AppError('File type not allowed', 400));
    }
    return cb(null, true);
  },
});

export const uploadDocumentMiddleware = upload.single('file');
