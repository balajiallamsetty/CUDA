import { getDashboardStats } from '../services/dashboardService.js';
import * as leadService from '../services/adminLeadService.js';
import * as inquiryService from '../services/adminInquiryService.js';
import * as projectService from '../services/projectService.js';
import * as talkService from '../services/talkService.js';
import * as userService from '../services/userService.js';
import * as settingsService from '../services/settingsService.js';
import { permissionsForRole, ALL_STAFF } from '@vignak/shared';

function metaFrom(req) {
  return { ip: req.ip, userAgent: req.get('user-agent') };
}

export async function adminMe(req, res) {
  res.json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
      permissions: permissionsForRole(req.user.role),
      allowedRoles: ALL_STAFF,
      message: 'Admin API access granted.',
    },
  });
}

export async function dashboardStats(req, res, next) {
  try {
    const stats = await getDashboardStats(req.user);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function listLeads(req, res, next) {
  try {
    const result = await leadService.listLeads(req.query, req.user);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getLead(req, res, next) {
  try {
    const lead = await leadService.getLeadById(req.params.id, req.user);
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function patchLead(req, res, next) {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function postLeadNote(req, res, next) {
  try {
    const lead = await leadService.addLeadNote(req.params.id, req.body.body, req.user, metaFrom(req));
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function listInquiries(req, res, next) {
  try {
    const result = await inquiryService.listInquiries(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getInquiry(req, res, next) {
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
}

export async function patchInquiry(req, res, next) {
  try {
    const inquiry = await inquiryService.updateInquiry(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
}

export async function listProjects(req, res, next) {
  try {
    const result = await projectService.listAdminProjects(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await projectService.getAdminProject(req.params.id);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.body, req.user, metaFrom(req));
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function patchProject(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function listSpeakers(req, res, next) {
  try {
    const speakers = await talkService.listSpeakers(req.query);
    res.json({ success: true, data: speakers });
  } catch (err) {
    next(err);
  }
}

export async function createSpeaker(req, res, next) {
  try {
    const speaker = await talkService.createSpeaker(req.body, req.user, metaFrom(req));
    res.status(201).json({ success: true, data: speaker });
  } catch (err) {
    next(err);
  }
}

export async function patchSpeaker(req, res, next) {
  try {
    const speaker = await talkService.updateSpeaker(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: speaker });
  } catch (err) {
    next(err);
  }
}

export async function listTalks(req, res, next) {
  try {
    const result = await talkService.listAdminTalks(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getTalk(req, res, next) {
  try {
    const talk = await talkService.getAdminTalk(req.params.id);
    res.json({ success: true, data: talk });
  } catch (err) {
    next(err);
  }
}

export async function createTalk(req, res, next) {
  try {
    const talk = await talkService.createTalk(req.body, req.user, metaFrom(req));
    res.status(201).json({ success: true, data: talk });
  } catch (err) {
    next(err);
  }
}

export async function patchTalk(req, res, next) {
  try {
    const talk = await talkService.updateTalk(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: talk });
  } catch (err) {
    next(err);
  }
}

export async function listRegistrations(req, res, next) {
  try {
    const result = await talkService.listTalkRegistrations(req.params.id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const result = await userService.listUsers(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body, req.user, metaFrom(req));
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function patchUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user, metaFrom(req));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await settingsService.getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function patchSettings(req, res, next) {
  try {
    const settings = await settingsService.updateSettings(req.body, req.user, metaFrom(req));
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function listAuditLogs(req, res, next) {
  try {
    const result = await settingsService.listAuditLogs(req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function listServices(req, res, next) {
  try {
    const services = await settingsService.listAdminServices();
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

export async function upsertService(req, res, next) {
  try {
    const service = await settingsService.upsertService(req.body, req.user, metaFrom(req));
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}
