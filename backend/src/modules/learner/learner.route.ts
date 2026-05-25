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
} from './learner.controller.js';

const router = Router();

// Protected route for authenticated users
router.post('/profile', authMiddleware, handleSaveProfile);

// Public routes
router.post('/', handleCreateLearner);
router.get('/:id', handleGetLearnerById);
router.get('/user/:userId', handleGetLearnerByUserId);
router.put('/:id', handleUpdateLearner);

export default router;
