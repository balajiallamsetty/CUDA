import * as serviceRequestService from '../services/serviceRequestService.js';
import * as workProjectService from '../services/workProjectService.js';
import * as notificationService from '../services/notificationService.js';
import * as emailVerificationService from '../services/emailVerificationService.js';

function metaFrom(req) {
  return { ip: req.ip, userAgent: req.get('user-agent') };
}

export async function createMyServiceRequest(req, res, next) {
  try {
    const doc = await serviceRequestService.createServiceRequest(req.user, req.body, metaFrom(req));
    res.status(201).json({ success: true, message: 'Request submitted', data: doc });
  } catch (err) {
    next(err);
  }
}

export async function listMyServiceRequests(req, res, next) {
  try {
    const result = await serviceRequestService.listMyServiceRequests(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyServiceRequest(req, res, next) {
  try {
    const doc = await serviceRequestService.getMyServiceRequest(req.user._id, req.params.id);
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

export async function listMyWorkProjects(req, res, next) {
  try {
    const result = await workProjectService.listMyWorkProjects(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyWorkProject(req, res, next) {
  try {
    const data = await workProjectService.getMyWorkProjectBundle(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function postMyProjectMessage(req, res, next) {
  try {
    const message = await workProjectService.addProjectMessage({
      projectId: req.params.id,
      user: req.user,
      body: req.body.body,
      asStaff: false,
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

export async function myDashboardOverview(req, res, next) {
  try {
    const data = await workProjectService.dashboardOverview(req.user._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function listMyNotifications(req, res, next) {
  try {
    const items = await notificationService.listNotifications(req.user._id, {
      unreadOnly: req.query.unread === 'true',
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function readMyNotification(req, res, next) {
  try {
    const item = await notificationService.markNotificationRead(req.user._id, req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function readAllMyNotifications(req, res, next) {
  try {
    await notificationService.markAllNotificationsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked read' });
  } catch (err) {
    next(err);
  }
}

export async function downloadMyDocument(req, res, next) {
  try {
    const { doc, absolutePath } = await workProjectService.getDocumentForDownload(
      req.params.id,
      req.user,
    );
    res.download(absolutePath, doc.originalName);
  } catch (err) {
    next(err);
  }
}

export async function requestVerifyEmail(req, res, next) {
  try {
    const result = await emailVerificationService.requestEmailVerification(req.user, metaFrom(req));
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}

export async function confirmVerifyEmail(req, res, next) {
  try {
    const result = await emailVerificationService.confirmEmailVerification(
      req.body.token,
      metaFrom(req),
    );
    res.json({
      success: true,
      message: 'Email verified',
      data: { user: result.user.toSafeObject() },
    });
  } catch (err) {
    next(err);
  }
}
