import { createInquiry } from '../services/inquiryService.js';
import { writeAuditLog } from '../services/auditService.js';

export async function postContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;
    const inquiry = await createInquiry(
      { name, email, phone, subject, message },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );

    await writeAuditLog({
      action: 'INQUIRY_CREATED',
      resourceType: 'Inquiry',
      resourceId: inquiry._id.toString(),
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { subject, email },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your message has been sent.',
      data: { id: inquiry._id.toString() },
    });
  } catch (err) {
    next(err);
  }
}
