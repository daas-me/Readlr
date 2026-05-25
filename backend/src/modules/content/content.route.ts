/**
 * Content Routes (Stages & Levels)
 */

import { Router } from 'express';
import {
  handleGetAllStages,
  handleGetStageWithLevels,
  handleGetLevelById,
  handleGetLevelsByStage,
} from './content.controller.js';

const router = Router();

router.get('/stages', handleGetAllStages);
router.get('/stages/:stageId', handleGetStageWithLevels);
router.get('/stages/:stageId/levels', handleGetLevelsByStage);
router.get('/levels/:levelId', handleGetLevelById);

export default router;
