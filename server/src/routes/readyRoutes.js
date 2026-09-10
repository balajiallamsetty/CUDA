import { Router } from 'express';
import { getReady } from '../controllers/healthController.js';

const router = Router();
router.get('/', getReady);
export default router;
