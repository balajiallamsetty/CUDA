import { Inquiry } from '../models/Inquiry.js';

export async function createInquiry(payload, meta = {}) {
  return Inquiry.create({
    ...payload,
    meta: {
      ip: meta.ip,
      userAgent: meta.userAgent,
    },
  });
}
