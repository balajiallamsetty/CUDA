import { createLead } from '../services/leadService.js';
import { writeAuditLog } from '../services/auditService.js';
import { LEAD_SERVICES } from '@vignak/shared';

export async function postLead(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      organization,
      organizationType,
      service,
      description,
      budget,
      timeline,
      preferredContactMethod,
      projectCategory,
      technologies,
      projectTitle,
      course,
      year,
    } = req.body;

    const lead = await createLead(
      {
        name,
        email,
        phone,
        organization,
        organizationType,
        service: service || LEAD_SERVICES.PROJECT_ASSISTANCE,
        description,
        budget,
        timeline,
        preferredContactMethod,
        projectCategory,
        technologies: Array.isArray(technologies) ? technologies : undefined,
        projectTitle,
        user: req.user?._id,
        source: req.user ? 'dashboard-request' : 'start-project',
        // stash course/year into organization fields when useful
        ...(course || year
          ? {
              organization: organization || [course, year].filter(Boolean).join(' · '),
              organizationType: organizationType || 'College',
            }
          : {}),
      },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );

    await writeAuditLog({
      action: 'LEAD_CREATED',
      actor: req.user?._id,
      actorEmail: req.user?.email || email,
      resourceType: 'Lead',
      resourceId: lead._id.toString(),
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { service: lead.service, email, projectCategory },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your project inquiry has been received.',
      data: { id: lead._id.toString() },
    });
  } catch (err) {
    next(err);
  }
}
