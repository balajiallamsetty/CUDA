/**
 * Opt-in migration: copy owned Project Assistance leads into ServiceRequest.
 * Does not delete leads.
 *
 * Usage: node server/scripts/migrateLeadsToServiceRequests.js
 */
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Lead } from '../src/models/Lead.js';
import { ServiceRequest } from '../src/models/ServiceRequest.js';
import { SERVICE_SLUGS, SERVICE_REQUEST_STATUSES, PA_DOMAINS } from '@vignak/shared';

async function main() {
  if (!env.mongodbUri) {
    console.error('MONGODB_URI required');
    process.exit(1);
  }
  await mongoose.connect(env.mongodbUri);
  const leads = await Lead.find({ user: { $ne: null }, archived: false });
  let created = 0;
  for (const lead of leads) {
    const exists = await ServiceRequest.findOne({
      user: lead.user,
      title: lead.projectTitle || lead.service,
      description: lead.description,
    });
    if (exists) continue;
    await ServiceRequest.create({
      user: lead.user,
      lead: lead._id,
      serviceSlug: SERVICE_SLUGS.PROJECT_ASSISTANCE,
      domain: lead.projectCategory && Object.values(PA_DOMAINS).includes(lead.projectCategory)
        ? lead.projectCategory
        : PA_DOMAINS.SOFTWARE_ENGINEERING,
      title: lead.projectTitle || lead.service || 'Migrated request',
      description: lead.description,
      technologies: lead.technologies || [],
      timeline: lead.timeline || '',
      phone: lead.phone || '',
      organization: lead.organization || '',
      status: SERVICE_REQUEST_STATUSES.SUBMITTED,
      assignedTo: lead.assignedTo,
      statusHistory: [{ to: SERVICE_REQUEST_STATUSES.SUBMITTED, at: new Date(), note: 'Migrated from Lead' }],
    });
    created += 1;
  }
  console.log(`Migrated ${created} leads into service requests (${leads.length} candidates).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
