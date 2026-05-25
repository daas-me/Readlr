/**
 * Session Model
 * Database operations for learning sessions
 */

import { db } from '../db.js';

export interface Session {
  id: number;
  learner_id: number;
  level_id: number;
  stage_id: number;
  started_at: string;
  completed_at: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export async function createSession(
  learnerId: number,
  levelId: number,
  stageId: number
): Promise<Session> {
  const result = await db.run(
    `INSERT INTO sessions (learner_id, level_id, stage_id) VALUES (?, ?, ?)`,
    [learnerId, levelId, stageId]
  );
  return getSessionById(result.id);
}

export async function getSessionById(id: number): Promise<Session> {
  return db.get('SELECT * FROM sessions WHERE id = ?', [id]);
}

export async function getLearnerSessions(learnerId: number): Promise<Session[]> {
  return db.all(
    'SELECT * FROM sessions WHERE learner_id = ? ORDER BY started_at DESC',
    [learnerId]
  );
}

export async function completeSession(id: number): Promise<void> {
  await db.run(
    `UPDATE sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [id]
  );
}

export async function abandonSession(id: number): Promise<void> {
  await db.run(
    `UPDATE sessions SET status = 'abandoned', completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [id]
  );
}
