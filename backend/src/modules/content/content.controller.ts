/**
 * Content Controller (Stages & Levels)
 * HTTP request handlers for learning content
 */

import { Request, Response } from 'express';
import {
  getAllStages,
  getStageWithLevels,
  getLevelById,
  getLevelsByStage,
} from './content.service.js';

/**
 * GET /api/content/stages
 * Get all stages
 */
export async function handleGetAllStages(req: Request, res: Response) {
  try {
    const stages = await getAllStages();
    res.json(stages);
  } catch (error) {
    console.error('Error fetching stages:', error);
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
}

/**
 * GET /api/content/stages/:stageId
 * Get stage with all its levels
 */
export async function handleGetStageWithLevels(req: Request, res: Response) {
  try {
    const { stageId } = req.params;
    const stage = await getStageWithLevels(parseInt(stageId));
    res.json(stage);
  } catch (error) {
    console.error('Error fetching stage:', error);
    res.status(404).json({ error: 'Stage not found' });
  }
}

/**
 * GET /api/content/levels/:levelId
 * Get a specific level
 */
export async function handleGetLevelById(req: Request, res: Response) {
  try {
    const { levelId } = req.params;
    const level = await getLevelById(parseInt(levelId));
    res.json(level);
  } catch (error) {
    console.error('Error fetching level:', error);
    res.status(404).json({ error: 'Level not found' });
  }
}

/**
 * GET /api/content/stages/:stageId/levels
 * Get all levels in a stage
 */
export async function handleGetLevelsByStage(req: Request, res: Response) {
  try {
    const { stageId } = req.params;
    const levels = await getLevelsByStage(parseInt(stageId));
    res.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
}
