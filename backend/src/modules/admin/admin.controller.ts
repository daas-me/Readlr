import { Request, Response } from 'express';
import { getLearnersForAdmin, setStudyParticipant } from './admin.service.js';

/**
 * PUT /api/admin/learners/:id/study-participant
 * Mark a learner account (user id) as a consented study participant
 */
export async function handleSetStudyParticipant(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.id);
  const { studyParticipant } = req.body ?? {};
  if (!Number.isInteger(userId) || userId <= 0 || typeof studyParticipant !== 'boolean') {
    res.status(400).json({ success: false, message: 'studyParticipant must be true or false' }); return;
  }
  try {
    if (!(await setStudyParticipant(userId, studyParticipant))) {
      res.status(404).json({ success: false, message: 'Learner profile not found' }); return;
    }
    res.json({ success: true, studyParticipant });
  } catch (error) {
    console.error('Error updating study participant flag:', error);
    res.status(500).json({ success: false, message: 'Could not update the study participant flag' });
  }
}

export async function handleGetLearners(req: Request, res: Response): Promise<void> {
  try {
    const learners = await getLearnersForAdmin();
    res.json({ success: true, learners });
  } catch (error) {
    console.error('Error fetching admin learner data:', error);
    if (error instanceof Error && error.message === 'Stage definitions are missing. Run stage setup.') {
      res.status(503).json({ success: false, message: error.message }); return;
    }
    res.status(500).json({ success: false, message: 'Failed to load learners' });
  }
}
