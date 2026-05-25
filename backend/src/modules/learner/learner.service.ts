/**
 * Learner Service
 * Business logic for learner operations
 */

import { 
  createLearner as createLearnerDB,
  getLearnerById as getLearnerByIdDB,
  getLearnerByUserId as getLearnerByUserIdDB,
  updateLearner as updateLearnerDB,
} from '../../database/models/learner.model.js';
import { CreateLearnerRequest, UpdateLearnerRequest, LearnerResponse } from './learner.types.js';

export async function createLearner(data: CreateLearnerRequest): Promise<LearnerResponse> {
  const learner = await createLearnerDB(data.user_id, data.name, data.avatar);
  return learner as LearnerResponse;
}

export async function getLearnerById(id: number): Promise<LearnerResponse> {
  const learner = await getLearnerByIdDB(id);
  if (!learner) {
    throw new Error('Learner not found');
  }
  return learner as LearnerResponse;
}

export async function getLearnerByUserId(userId: number): Promise<LearnerResponse> {
  const learner = await getLearnerByUserIdDB(userId);
  if (!learner) {
    throw new Error('Learner profile not found for this user');
  }
  return learner as LearnerResponse;
}

export async function updateLearner(
  id: number,
  data: UpdateLearnerRequest
): Promise<LearnerResponse> {
  await updateLearnerDB(id, data);
  return getLearnerById(id);
}
