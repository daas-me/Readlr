/**
 * Progress Model
 * Database operations for learner progress tracking
 */

import { db } from '../db.js';

export interface Progress {
  id: number;
  learner_id: number;
  stage_id: number;
  completed_levels: number;
  total_levels: number;
  completion_percentage: number;
  last_updated: string;
}

export async function createProgress(
  learnerId: number,
  stageId: number,
  totalLevels: number
): Promise<Progress> {
  const result = await db.run(
    `INSERT INTO progress (learner_id, stage_id, total_levels, completed_levels, completion_percentage) 
     VALUES (?, ?, ?, 0, 0)`,
    [learnerId, stageId, totalLevels]
  );
  return getProgressById(result.id);
}

export async function getProgressById(id: number): Promise<Progress> {
  return db.get('SELECT * FROM progress WHERE id = ?', [id]);
}

export async function getProgressByLearnerAndStage(
  learnerId: number,
  stageId: number
): Promise<Progress> {
  return db.get(
    'SELECT * FROM progress WHERE learner_id = ? AND stage_id = ?',
    [learnerId, stageId]
  );
}

export async function getLearnerProgress(learnerId: number): Promise<Progress[]> {
  return db.all(
    'SELECT * FROM progress WHERE learner_id = ? ORDER BY stage_id',
    [learnerId]
  );
}

export async function updateProgress(
  learnerId: number,
  stageId: number,
  completedLevels: number,
  totalLevels: number
): Promise<void> {
  const percentage = Math.round((completedLevels / totalLevels) * 100);
  await db.run(
    `UPDATE progress 
     SET completed_levels = ?, completion_percentage = ?, last_updated = CURRENT_TIMESTAMP 
     WHERE learner_id = ? AND stage_id = ?`,
    [completedLevels, percentage, learnerId, stageId]
  );
}
