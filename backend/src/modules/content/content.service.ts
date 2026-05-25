/**
 * Content Service (Stages & Levels)
 * Business logic for learning content
 */

import {
  getAllStages as getAllStagesDB,
  getStageById as getStageByIdDB,
} from '../../database/models/stage.model.js';
import {
  getLevelsByStage as getLevelsByStageDB,
  getLevelById as getLevelByIdDB,
} from '../../database/models/level.model.js';
import { StageResponse, LevelResponse, StageWithLevelsResponse } from './content.types.js';

export async function getAllStages(): Promise<StageResponse[]> {
  const stages = await getAllStagesDB();
  return stages as StageResponse[];
}

export async function getStageWithLevels(stageId: number): Promise<StageWithLevelsResponse> {
  const stage = await getStageByIdDB(stageId);
  if (!stage) {
    throw new Error('Stage not found');
  }

  const levels = await getLevelsByStageDB(stageId);

  return {
    ...stage,
    levels: levels as LevelResponse[],
  } as StageWithLevelsResponse;
}

export async function getLevelById(levelId: number): Promise<LevelResponse> {
  const level = await getLevelByIdDB(levelId);
  if (!level) {
    throw new Error('Level not found');
  }
  return level as LevelResponse;
}

export async function getLevelsByStage(stageId: number): Promise<LevelResponse[]> {
  const levels = await getLevelsByStageDB(stageId);
  return levels as LevelResponse[];
}
