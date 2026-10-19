/**
 * Learner Routes
 */

import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import {
  handleSaveProfile,
  handleGetLearnerByUserId,
  handleGetMyProfile,
  handleUpdateMyProfile,
} from './learner.controller.js';

const router = Router();

// Authenticated user's own profile
router.get('/me', authMiddleware, handleGetMyProfile);
router.put('/me', authMiddleware, handleUpdateMyProfile);

// Child setup for a new learner account
router.post('/profile', authMiddleware, requireRole('learner'), handleSaveProfile);

// Own profile by user id, or any profile for an admin
router.get('/user/:userId', authMiddleware, handleGetLearnerByUserId);

export default router;
