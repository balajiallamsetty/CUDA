import * as quotationService from '../services/quotationService.js';
import * as paymentService from '../services/paymentService.js';
import * as deliverableService from '../services/deliverableService.js';
import * as serviceDefinitionService from '../services/serviceDefinitionService.js';
import * as serviceRequestService from '../services/serviceRequestService.js';

function metaFrom(req) {
  return { ip: req.ip, userAgent: req.get('user-agent'), note: req.body?.note };
}

export async function listCatalogServices(req, res, next) {
  try {
    const items = await serviceRequestService.listPublicServiceDefinitions();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getCatalogService(req, res, next) {
  try {
    const item = await serviceRequestService.getPublicServiceDefinition(req.params.slug);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function listAdminServiceDefinitions(req, res, next) {
  try {
    const items = await serviceDefinitionService.listAdminServiceDefinitions();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getAdminServiceDefinition(req, res, next) {
  try {
    const item = await serviceDefinitionService.getAdminServiceDefinition(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function patchAdminServiceDefinition(req, res, next) {
  try {
    const item = await serviceDefinitionService.updateServiceDefinition(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function createQuotation(req, res, next) {
  try {
    const quote = await quotationService.createQuotation(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    next(err);
  }
}

export async function listAdminQuotations(req, res, next) {
  try {
    const result = await quotationService.listAdminQuotations(req.query, req.user);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function listMyQuotations(req, res, next) {
  try {
    const result = await quotationService.listMyQuotations(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyQuotation(req, res, next) {
  try {
    const item = await quotationService.getMyQuotation(req.user._id, req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function approveQuotation(req, res, next) {
  try {
    const item = await quotationService.decideQuotation(req.user._id, req.params.id, 'approve', metaFrom(req));
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function rejectQuotation(req, res, next) {
  try {
    const item = await quotationService.decideQuotation(req.user._id, req.params.id, 'reject', {
      ...metaFrom(req),
      note: req.body?.note,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function recordPayment(req, res, next) {
  try {
    const payment = await paymentService.recordPayment(req.body, req.user, metaFrom(req));
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
}

export async function listAdminPayments(req, res, next) {
  try {
    const result = await paymentService.listAdminPayments(req.query, req.user);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function listMyPayments(req, res, next) {
  try {
    const result = await paymentService.listMyPayments(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyPayment(req, res, next) {
  try {
    const item = await paymentService.getMyPayment(req.user._id, req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function paymentWebhook(req, res, next) {
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const result = await paymentService.handlePaymentWebhook(
      req.params.provider,
      raw,
      req.get('x-signature') || req.get('x-vignak-signature'),
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function createDeliverable(req, res, next) {
  try {
    const item = await deliverableService.createDeliverable(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function listProjectDeliverables(req, res, next) {
  try {
    const items = await deliverableService.listAdminDeliverables(req.params.id, req.user);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function listMyDeliverables(req, res, next) {
  try {
    const result = await deliverableService.listMyDeliverables(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyDeliverable(req, res, next) {
  try {
    const item = await deliverableService.getMyDeliverable(req.user._id, req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function approveDeliverable(req, res, next) {
  try {
    const item = await deliverableService.decideDeliverable(
      req.user._id,
      req.params.id,
      'approve',
      '',
      metaFrom(req),
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function requestDeliverableChanges(req, res, next) {
  try {
    const item = await deliverableService.decideDeliverable(
      req.user._id,
      req.params.id,
      'changes',
      req.body?.note || '',
      metaFrom(req),
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function staffAssignedOverview(req, res, next) {
  try {
    const data = await deliverableService.listStaffAssignedOverview(req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
