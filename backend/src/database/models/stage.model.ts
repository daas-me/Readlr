/**
 * Stage Model
 * Database operations for learning stages
 */

import { db } from '../db.js';

export interface Stage {
  id: number;
  stage_number: number;
  title: string;
  description: string;
  difficulty: number;
  created_at: string;
}

export async function createStage(
  stageNumber: number,
  title: string,
  description: string,
  difficulty: number = 1
): Promise<Stage> {
  const result = await db.run(
    `INSERT INTO stages (stage_number, title, description, difficulty) VALUES (?, ?, ?, ?)`,
    [stageNumber, title, description, difficulty]
  );
  return getStageById(result.id);
}

export async function getStageById(id: number): Promise<Stage> {
  return db.get('SELECT * FROM stages WHERE id = ?', [id]);
}

export async function getStageByNumber(stageNumber: number): Promise<Stage> {
  return db.get('SELECT * FROM stages WHERE stage_number = ?', [stageNumber]);
}

export async function getAllStages(): Promise<Stage[]> {
  return db.all('SELECT * FROM stages ORDER BY stage_number');
}
