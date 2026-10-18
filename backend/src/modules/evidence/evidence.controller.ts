import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.js';
import { getDelayedReviewStatus, listEvidenceAttempts, listEvidenceSummary, syncEvidenceAttempts, EvidenceConflictError, EvidenceContentUnavailableError, EvidenceReviewNotDueError, EvidenceUnavailableError } from './evidence.service.js';
import { parseEvidenceBatch, EvidenceValidationError } from './evidence.validation.js';
import { getLearningCampAccess } from './camp-access.js';
import { getCurriculumState, saveCurriculumState } from './curriculum-state.js';

export async function handleLearningCampAccess(req: Request, res: Response) {
  res.json({
    schemaVersion: 1,
    ...await getLearningCampAccess((req as AuthenticatedRequest).userId!),
  });
}

export async function handleCurriculumState(req: Request, res: Response) {
  try { res.json(await getCurriculumState((req as AuthenticatedRequest).userId!)); }
  catch { res.status(503).json({ message: 'Your reading journey could not be loaded.' }); }
}

export async function handleSaveCurriculumState(req: Request, res: Response) {
  try { res.json(await saveCurriculumState((req as AuthenticatedRequest).userId!, req.body)); }
  catch { res.status(503).json({ message: 'Your reading journey could not be saved.' }); }
}

export async function handleSyncEvidence(req: Request, res: Response) {
  try {
    const attempts = parseEvidenceBatch(req.body);
    const result = await syncEvidenceAttempts((req as AuthenticatedRequest).userId!, attempts);
    res.json({ schemaVersion: 1, ...result });
  } catch (error) {
    if (error instanceof EvidenceValidationError) { res.status(400).json({ code: 'invalid_evidence', message: error.message }); return; }
    if (error instanceof EvidenceConflictError) { res.status(409).json({ code: 'attempt_conflict', message: error.message }); return; }
    if (error instanceof EvidenceContentUnavailableError) { res.status(409).json({ code: 'content_not_released', message: 'This learning content is not released for evidence collection.' }); return; }
    if (error instanceof EvidenceReviewNotDueError) { res.status(409).json({ code: 'review_not_due', message: 'This delayed review is not available yet.' }); return; }
    if (error instanceof EvidenceUnavailableError) { res.status(503).json({ code: 'evidence_unavailable', message: 'Evidence storage is unavailable. Check the curriculum evidence migration.' }); return; }
    console.error('Evidence sync failed:', error);
    res.status(500).json({ code: 'evidence_sync_failed', message: 'Evidence could not be saved.' });
  }
}

export async function handleListEvidence(req: Request, res: Response) {
  try {
    const afterId = req.query.afterId === undefined ? 0 : Number(req.query.afterId);
    const limit = req.query.limit === undefined ? 100 : Number(req.query.limit);
    if (!Number.isSafeInteger(afterId) || afterId < 0 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
      res.status(400).json({ code: 'invalid_cursor', message: 'afterId and limit are invalid.' }); return;
    }
    res.json({ schemaVersion: 1, ...await listEvidenceAttempts((req as AuthenticatedRequest).userId!, afterId, limit) });
  } catch (error) {
    if (error instanceof EvidenceUnavailableError) { res.status(503).json({ code: 'evidence_unavailable', message: 'Evidence storage is unavailable. Check the curriculum evidence migration.' }); return; }
    console.error('Evidence load failed:', error);
    res.status(500).json({ code: 'evidence_load_failed', message: 'Evidence could not be loaded.' });
  }
}

export async function handleEvidenceSummary(req: Request, res: Response) {
  try {
    res.json({ schemaVersion: 1, ...await listEvidenceSummary((req as AuthenticatedRequest).userId!) });
  } catch (error) {
    if (error instanceof EvidenceUnavailableError) { res.status(503).json({ code: 'evidence_unavailable', message: 'Learning evidence is unavailable. Check the curriculum evidence migrations.' }); return; }
    console.error('Evidence summary failed:', error);
    res.status(500).json({ code: 'evidence_summary_failed', message: 'Learning evidence could not be summarized.' });
  }
}

export async function handleDelayedReviewStatus(req: Request, res: Response) {
  try {
    const curriculumVersion = typeof req.query.curriculumVersion === 'string' ? req.query.curriculumVersion : '';
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(curriculumVersion)) {
      res.status(400).json({ code: 'invalid_curriculum', message: 'A valid curriculumVersion is required.' }); return;
    }
    res.json({ schemaVersion: 1, ...await getDelayedReviewStatus((req as AuthenticatedRequest).userId!, curriculumVersion) });
  } catch (error) {
    if (error instanceof EvidenceUnavailableError) { res.status(503).json({ code: 'evidence_unavailable', message: 'Delayed review scheduling is unavailable. Check the curriculum evidence migrations.' }); return; }
    console.error('Delayed review status failed:', error);
    res.status(500).json({ code: 'review_status_failed', message: 'Delayed review status could not be loaded.' });
  }
}

