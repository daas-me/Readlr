/**
 * Learner Routes
 */

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import {
  handleSaveProfile,
  handleCreateLearner,
  handleGetLearnerById,
  handleGetLearnerByUserId,
  handleUpdateLearner,
  handleGetMyProfile,
  handleUpdateMyProfile,
} from './learner.controller.js';

const router = Router();

// Authenticated user's own profile
router.get('/me', authMiddleware, handleGetMyProfile);
router.put('/me', authMiddleware, handleUpdateMyProfile);

// Protected route for authenticated users
router.post('/profile', authMiddleware, handleSaveProfile);

// Public routes
router.post('/', handleCreateLearner);
router.get('/:id', handleGetLearnerById);
router.get('/user/:userId', handleGetLearnerByUserId);
router.put('/:id', handleUpdateLearner);

export default router;
