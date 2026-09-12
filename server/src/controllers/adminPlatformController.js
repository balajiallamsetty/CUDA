import * as serviceRequestService from '../services/serviceRequestService.js';
import * as workProjectService from '../services/workProjectService.js';

function metaFrom(req) {
  return { ip: req.ip, userAgent: req.get('user-agent') };
}

export async function listServiceRequests(req, res, next) {
  try {
    const result = await serviceRequestService.listAdminServiceRequests(req.query, req.user);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getServiceRequest(req, res, next) {
  try {
    const doc = await serviceRequestService.getAdminServiceRequest(req.params.id, req.user);
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

export async function patchServiceRequest(req, res, next) {
  try {
    const doc = await serviceRequestService.updateAdminServiceRequest(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

export async function convertServiceRequest(req, res, next) {
  try {
    const project = await workProjectService.convertRequestToWorkProject(
      req.params.id,
      req.user,
      metaFrom(req),
    );
    res.status(201).json({ success: true, message: 'Converted to work project', data: project });
  } catch (err) {
    next(err);
  }
}

export async function listWorkProjects(req, res, next) {
  try {
    const result = await workProjectService.listAdminWorkProjects(req.query, req.user);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getWorkProject(req, res, next) {
  try {
    const data = await workProjectService.getAdminWorkProjectBundle(req.params.id, req.user);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function patchWorkProject(req, res, next) {
  try {
    const project = await workProjectService.updateAdminWorkProject(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function upsertMilestone(req, res, next) {
  try {
    const milestone = await workProjectService.upsertMilestone(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.json({ success: true, data: milestone });
  } catch (err) {
    next(err);
  }
}

export async function upsertTask(req, res, next) {
  try {
    const task = await workProjectService.upsertTask(
      req.params.id,
      req.body,
      req.user,
      metaFrom(req),
    );
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function postWorkProjectMessage(req, res, next) {
  try {
    const message = await workProjectService.addProjectMessage({
      projectId: req.params.id,
      user: req.user,
      body: req.body.body,
      asStaff: true,
      visibility: req.body.visibility,
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}

export async function uploadWorkProjectDocument(req, res, next) {
  try {
    const doc = await workProjectService.uploadProjectDocument({
      projectId: req.params.id,
      user: req.user,
      file: req.file,
      title: req.body.title,
      category: req.body.category,
      clientVisible: req.body.clientVisible !== 'false',
      meta: metaFrom(req),
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

export async function downloadDocument(req, res, next) {
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
