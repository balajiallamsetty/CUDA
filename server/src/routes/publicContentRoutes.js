import { Router } from 'express';
import * as projectService from '../services/projectService.js';
import * as talkService from '../services/talkService.js';
import * as settingsService from '../services/settingsService.js';
import * as ecosystem from '../controllers/ecosystemController.js';
import { talkRegisterValidators } from '../validators/index.js';
import { validateRequest, rejectHoneypot } from '../middleware/validate.js';
import { registrationLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.get('/projects', async (req, res, next) => {
  try {
    const featuredOnly = req.query.featured === 'true';
    const items = await projectService.listPublicProjects({ featuredOnly });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.get('/projects/:slug', async (req, res, next) => {
  try {
    const item = await projectService.getPublicProjectBySlug(req.params.slug);
    if (!item) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.get('/talks', async (req, res, next) => {
  try {
    const items = await talkService.listPublicTalks();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.get('/talks/:slug', async (req, res, next) => {
  try {
    const item = await talkService.getPublicTalkBySlug(req.params.slug);
    if (!item) return res.status(404).json({ success: false, message: 'Talk not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/talks/:id/register',
  registrationLimiter,
  rejectHoneypot,
  talkRegisterValidators,
  validateRequest,
  async (req, res, next) => {
    try {
      const registration = await talkService.registerForTalk(req.params.id, req.body, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      res.status(201).json({
        success: true,
        message: 'Registration successful. We will confirm details soon.',
        data: { id: registration._id.toString() },
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get('/services', async (req, res, next) => {
  try {
    const items = await settingsService.listPublicServices();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.get('/catalog/services', ecosystem.listCatalogServices);
router.get('/catalog/services/:slug', ecosystem.getCatalogService);

export default router;
