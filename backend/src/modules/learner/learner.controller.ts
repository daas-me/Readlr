/**
 * Learner Controller
 * HTTP request handlers for learner operations
 */

import { Request, Response } from 'express';
import { supabase, unwrap } from '../../database/db.js';
import { AVATAR_REWARDS, curriculumRewardAccess } from '../frames/curriculum-rewards.js';
import {
  createLearner,
  getLearnerByUserId,
  updateLearner,
} from './learner.service.js';

const MAX_NAME_LENGTH = 20;
const AVATAR_OPTIONS = [
  '🦊', '🐻', '🐼', '🐨', '🦁', '🐯',
  '🐸', '🐧', '🦋', '🐝', '🦄', '🐙',
  '🐳', '🦕', '🐢', '🐬',
];
const STARTER_AVATARS: string[] = AVATAR_REWARDS.filter(([, , goal]) => goal === 'free').map(([avatar]) => avatar);

// Returns the trimmed nickname, or null when it is empty or too long.
function validNickname(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= MAX_NAME_LENGTH ? trimmed : null;
}

/**
 * POST /api/learner/profile
 * Child setup: create the profile once for a new account (nickname and starter avatar only)
 */
export async function handleSaveProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const name = validNickname(req.body?.name);
    const avatar = req.body?.avatar;

    if (!name) {
      return res.status(400).json({ error: `Nickname must be 1 to ${MAX_NAME_LENGTH} characters` });
    }
    if (typeof avatar !== 'string' || !STARTER_AVATARS.includes(avatar)) {
      return res.status(400).json({ error: 'avatar must be one of the starter options' });
    }

    const existing = await getLearnerByUserId(userId).catch(() => null);
    if (existing) {
      return res.status(409).json({ error: 'Profile already exists' });
    }

    const learner = await createLearner({ user_id: userId, name, avatar });
    return res.status(201).json({ success: true, learner });
  } catch (error) {
    console.error('Error saving learner profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
}

/**
 * GET /api/learner/user/:userId
 * Get learner profile by user ID (own account, or an admin)
 */
export async function handleGetLearnerByUserId(req: Request, res: Response) {
  const callerId = (req as any).userId;
  const requestedId = Number(req.params.userId);
  if (!Number.isInteger(requestedId) || requestedId <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  if (requestedId !== callerId) {
    // Recheck the stored role so a revoked admin token cannot read other profiles.
    try {
      const caller = unwrap(await supabase.from('users').select('role').eq('id', callerId).maybeSingle());
      if (caller?.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    } catch {
      return res.status(503).json({ error: 'Could not verify access' });
    }
  }
  try {
    const learner = await getLearnerByUserId(requestedId);
    res.json(learner);
  } catch (error) {
    console.error('Error fetching learner:', error);
    res.status(404).json({ error: 'Learner profile not found' });
  }
}

/**
 * GET /api/learner/me
 * Get the authenticated learner's own profile
 */
export async function handleGetMyProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const learner = await getLearnerByUserId(userId);
    return res.json({ success: true, learner });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(404).json({ error: 'Learner profile not found' });
  }
}

/**
 * PUT /api/learner/me
 * Update the authenticated learner's own profile (name and avatar only)
 */
export async function handleUpdateMyProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { name, avatar } = req.body;

    const updates: { name?: string; avatar?: string } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
      }
      const trimmed = name.trim();
      if (trimmed.length > MAX_NAME_LENGTH) {
        return res.status(400).json({ error: `name must be ${MAX_NAME_LENGTH} characters or fewer` });
      }
      updates.name = trimmed;
    }

    if (avatar !== undefined) {
      if (typeof avatar !== 'string' || !AVATAR_OPTIONS.includes(avatar)) {
        return res.status(400).json({ error: 'avatar must be one of the supported options' });
      }
      updates.avatar = avatar;
      const rewards=await curriculumRewardAccess(userId);
      if(!rewards.avatars.some(option=>option.avatar===avatar&&option.unlocked))return res.status(403).json({error:'Keep practising to unlock this avatar.'});
    }

    const existing = await getLearnerByUserId(userId);
    const updated = await updateLearner(existing.id, updates);

    return res.json({ success: true, learner: updated });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
