import { Router } from 'express';
import express from 'express';
import * as ecosystem from '../controllers/ecosystemController.js';

const router = Router();

/** Raw JSON body preferred for signature verification when provider is configured. */
router.post(
  '/webhook/:provider',
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    },
  }),
  (req, res, next) => {
    if (req.rawBody) req.body = req.rawBody;
    return ecosystem.paymentWebhook(req, res, next);
  },
);

export default router;
