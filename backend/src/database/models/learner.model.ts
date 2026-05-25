/**
 * Learner Model
 * Database operations for learner profiles
 */

import { db } from '../db.js';

export interface Learner {
  id: number;
  user_id: number;
  name: string;
  avatar: string;
  grade: number;
  created_at: string;
  updated_at: string;
}

export async function createLearner(
  userId: number,
  name: string,
  avatar: string = '🦊'
): Promise<Learner> {
  const result = await db.run(
    `INSERT INTO learner_profiles (user_id, name, avatar) VALUES (?, ?, ?)`,
    [userId, name, avatar]
  );
  return getLearnerById(result.id);
}

export async function getLearnerById(id: number): Promise<Learner> {
  return db.get('SELECT * FROM learner_profiles WHERE id = ?', [id]);
}

export async function getLearnerByUserId(userId: number): Promise<Learner> {
  return db.get('SELECT * FROM learner_profiles WHERE user_id = ?', [userId]);
}

export async function updateLearner(
  id: number,
  updates: Partial<Learner>
): Promise<void> {
  const fields = Object.keys(updates)
    .filter(key => key !== 'id' && key !== 'created_at')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = Object.keys(updates)
    .filter(key => key !== 'id' && key !== 'created_at')
    .map(key => updates[key as keyof Learner]);

  if (fields) {
    await db.run(`UPDATE learner_profiles SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);
  }
}

export async function getAllLearners(): Promise<Learner[]> {
  return db.all('SELECT * FROM learner_profiles');
}
