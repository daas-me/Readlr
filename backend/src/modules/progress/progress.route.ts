/**
 * Progress Routes
 */

import { Router } from 'express';
import {
  handleGetProgressSummary,
  handleGetStageProgress,
  handleUpdateProgress,
} from './progress.controller.js';

const router = Router();

router.get('/learners/:learnerId', handleGetProgressSummary);
router.get('/learners/:learnerId/stages/:stageId', handleGetStageProgress);
router.put('/learners/:learnerId/stages/:stageId', handleUpdateProgress);

export default router;
