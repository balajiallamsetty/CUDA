import { createLead } from '../services/leadService.js';
import { writeAuditLog } from '../services/auditService.js';

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
    } = req.body;

    const lead = await createLead(
      {
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
      },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );

    await writeAuditLog({
      action: 'LEAD_CREATED',
      resourceType: 'Lead',
      resourceId: lead._id.toString(),
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { service, email },
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
