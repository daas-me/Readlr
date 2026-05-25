/**
 * Session Result Model
 * Database operations for session results (per attempt)
 */

import { db } from '../db.js';

export interface SessionResult {
  id: number;
  session_id: number;
  attempt_number: number;
  transcription: string | null;
  detected_phoneme: string | null;
  target_phoneme: string;
  score: number;
  matched: boolean;
  feedback: string | null;
  created_at: string;
}

export async function createResult(
  sessionId: number,
  attemptNumber: number,
  targetPhoneme: string,
  detectedPhoneme?: string,
  transcription?: string,
  score: number = 0,
  matched: boolean = false,
  feedback?: string
): Promise<SessionResult> {
  const result = await db.run(
    `INSERT INTO session_results 
     (session_id, attempt_number, transcription, detected_phoneme, target_phoneme, score, matched, feedback) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sessionId, attemptNumber, transcription, detectedPhoneme, targetPhoneme, score, matched ? 1 : 0, feedback]
  );
  return getResultById(result.id);
}

export async function getResultById(id: number): Promise<SessionResult> {
  const result = await db.get('SELECT * FROM session_results WHERE id = ?', [id]);
  if (result) {
    result.matched = !!result.matched;
  }
  return result;
}

export async function getSessionResults(sessionId: number): Promise<SessionResult[]> {
  const results = await db.all(
    'SELECT * FROM session_results WHERE session_id = ? ORDER BY attempt_number',
    [sessionId]
  );
  return results.map(r => ({ ...r, matched: !!r.matched }));
}

export async function getLatestAttemptNumber(sessionId: number): Promise<number> {
  const result = await db.get(
    'SELECT MAX(attempt_number) as max_attempt FROM session_results WHERE session_id = ?',
    [sessionId]
  );
  return result?.max_attempt || 0;
}
