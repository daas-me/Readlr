import { Router } from 'express';
import { handleHealthCheck } from './health.controller.js';

const router = Router();

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', handleHealthCheck);

export default router;
