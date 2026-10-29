import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../../middleware/auth.js';
import { dailyGoal, deleteLearner, learnerRecap, endClassSession, setStartDate, startClassSession, studyData, studySettings } from './study.service.js';
import { studyWorkbook } from './study-workbook.js';

const unavailable = (res: Response) => res.status(503).json({ message: 'Study data is unavailable. Check that the study migration has been applied.' });
const userId = (req: Request) => (req as AuthenticatedRequest).userId!;

export async function getDailyGoal(req: Request, res: Response) {
  try { res.json(await dailyGoal(userId(req))); } catch { unavailable(res); }
}

export async function getRecap(req: Request, res: Response) {
  try { res.json(await learnerRecap(userId(req))); } catch { unavailable(res); }
}

export async function getStudy(_req: Request, res: Response) {
  try {
    const [settings, metrics] = await Promise.all([studySettings(), studyData()]);
    res.json({ ...settings, summary: metrics.summary, weekly: metrics.weekly, books: metrics.books });
  } catch { unavailable(res); }
}
export async function saveStudy(req: Request, res: Response) {
  const { startDate } = req.body ?? {};
  if (!(startDate === null || (typeof startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDate) && Number.isFinite(Date.parse(startDate))))) {
    res.status(400).json({ message: 'Choose a valid start date.' }); return;
  }
  try { await setStartDate(startDate); res.json(await studySettings()); } catch { unavailable(res); }
}
export async function classSession(req: Request, res: Response) {
  const action = req.body?.action;
  if (action !== 'start' && action !== 'end') { res.status(400).json({ message: 'Choose start or end.' }); return; }
  try {
    if (action === 'start') await startClassSession(userId(req)); else await endClassSession();
    res.json(await studySettings());
  } catch { unavailable(res); }
}
export async function exportStudy(_req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const [{ startDate }, metrics] = await Promise.all([studySettings(), studyData()]);
    const buffer = await studyWorkbook(metrics, startDate).xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="readlr-study-data-${new Date().toISOString().slice(0, 10)}.xlsx"`);
    res.send(Buffer.from(buffer));
  } catch { unavailable(res); }
}
export async function removeLearner(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) { res.status(400).json({ message: 'Invalid learner.' }); return; }
  try {
    if (!await deleteLearner(id)) { res.status(404).json({ message: 'Learner not found.' }); return; }
    res.json({ success: true });
  } catch { res.status(503).json({ message: 'The learner could not be deleted. Nothing was changed.' }); }
}
