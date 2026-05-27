/**
 * Progress Controller
 * HTTP request handlers for progress tracking
 */

import { Request, Response } from 'express';
import {
  getLearnerProgressSummary,
  getStageProgress,
  updateStageProgress,
} from './progress.service.js';

/**
 * GET /api/progress/learners/:learnerId
 * Get learner's progress summary
 */
export async function handleGetProgressSummary(req: Request, res: Response) {
  try {
    const { learnerId } = req.params;
    const summary = await getLearnerProgressSummary(parseInt(learnerId));
    res.json(summary);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}

/**
 * GET /api/progress/learners/:learnerId/stages/:stageId
 * Get progress for a specific stage
 */
export async function handleGetStageProgress(req: Request, res: Response) {
  try {
    const { learnerId, stageId } = req.params;
    const progress = await getStageProgress(parseInt(learnerId), parseInt(stageId));
    res.json(progress);
  } catch (error) {
    console.error('Error fetching stage progress:', error);
    res.status(404).json({ error: 'Progress not found' });
  }
}

/**
 * PUT /api/progress/learners/:learnerId/stages/:stageId
 * Update progress for a stage
 */
export async function handleUpdateProgress(req: Request, res: Response) {
  try {
    const { learnerId, stageId } = req.params;
    const { completed_levels, total_levels } = req.body;

    if (completed_levels === undefined || total_levels === undefined) {
      return res.status(400).json({
        error: 'completed_levels and total_levels are required',
      });
    }

    const progress = await updateStageProgress(
      parseInt(learnerId),
      parseInt(stageId),
      completed_levels,
      total_levels
    );
    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
}

/**
 * GET /api/progress/me
 * Get the authenticated learner's own progress summary
 */
export async function handleGetMyProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    // Get learner profile from user id
    const { getLearnerByUserId } = await import('../learner/learner.service.js');
    const learner = await getLearnerByUserId(userId);

    const summary = await getLearnerProgressSummary(learner.id);
    res.json({ success: true, ...summary });
  } catch (error) {
    console.error('Error fetching my progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
}