import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { handleCurriculumState, handleDelayedReviewStatus, handleEvidenceSummary, handleLearningCampAccess, handleListEvidence, handleSaveCurriculumState, handleSyncEvidence } from './evidence.controller.js';
import { readingProgress, startReadingCheckpoint, skipReadingCheckpoint, recordReadingMeaning } from './reading-checkpoints.js';

const router = Router();
router.get('/me/reading-progress', authMiddleware, requireRole('learner'), readingProgress);
router.post('/me/reading-checkpoints', authMiddleware, requireRole('learner'), startReadingCheckpoint);
router.post('/me/reading-checkpoints/:sessionId/:item/skip', authMiddleware, requireRole('learner'), skipReadingCheckpoint);
router.post('/me/reading-checkpoints/:sessionId/meaning', authMiddleware, requireRole('learner'), recordReadingMeaning);
router.get('/me/curriculum-state', authMiddleware, requireRole('learner'), handleCurriculumState);
router.put('/me/curriculum-state', authMiddleware, requireRole('learner'), handleSaveCurriculumState);
router.get('/me/camp-access', authMiddleware, requireRole('learner'), handleLearningCampAccess);
router.get('/me/attempts', authMiddleware, requireRole('learner'), handleListEvidence);
router.get('/me/summary', authMiddleware, requireRole('learner'), handleEvidenceSummary);
router.get('/me/review-status', authMiddleware, requireRole('learner'), handleDelayedReviewStatus);
router.post('/me/attempts/sync', authMiddleware, requireRole('learner'), handleSyncEvidence);
export default router;

