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

// Authenticated routes
router.post('/', authMiddleware, handleCreateLearner);
router.get('/user/:userId', authMiddleware, handleGetLearnerByUserId);
router.get('/:id', authMiddleware, handleGetLearnerById);
router.put('/:id', authMiddleware, handleUpdateLearner);

export default router;
