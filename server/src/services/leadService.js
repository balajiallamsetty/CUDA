import { Lead } from '../models/Lead.js';
import { LEAD_STATUSES } from '@vignak/shared';

export async function createLead(payload, meta = {}) {
  const lead = await Lead.create({
    ...payload,
    status: LEAD_STATUSES.NEW,
    meta: {
      ip: meta.ip,
      userAgent: meta.userAgent,
    },
  });
  return lead;
}
