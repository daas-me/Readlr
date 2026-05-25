/**
 * Level Model
 * Database operations for learning levels
 */

import { db } from '../db.js';

export interface Level {
  id: number;
  stage_id: number;
  level_number: number;
  title: string;
  description: string;
  target_phoneme: string;
  difficulty: number;
  created_at: string;
}

export async function createLevel(
  stageId: number,
  levelNumber: number,
  title: string,
  description: string,
  targetPhoneme: string,
  difficulty: number = 1
): Promise<Level> {
  const result = await db.run(
    `INSERT INTO levels (stage_id, level_number, title, description, target_phoneme, difficulty) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [stageId, levelNumber, title, description, targetPhoneme, difficulty]
  );
  return getLevelById(result.id);
}

export async function getLevelById(id: number): Promise<Level> {
  return db.get('SELECT * FROM levels WHERE id = ?', [id]);
}

export async function getLevelsByStage(stageId: number): Promise<Level[]> {
  return db.all(
    'SELECT * FROM levels WHERE stage_id = ? ORDER BY level_number',
    [stageId]
  );
}

export async function getAllLevels(): Promise<Level[]> {
  return db.all('SELECT * FROM levels ORDER BY stage_id, level_number');
}
