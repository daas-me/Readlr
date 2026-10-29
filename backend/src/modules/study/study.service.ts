import type { NextFunction, Request, Response } from 'express';
import { supabase, unwrap } from '../../database/db.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';
import { READING_STOPS, validReadingStop } from '../evidence/reading-stops.js';
import { computeMetrics, countsAsWord, dailyGoalMet, DAILY_GOAL, manilaDay, type StudyEvent } from './study-metrics.js';
import { addDays, summarizeRecap, weekStart } from './recap.js';
import { getLearnerByUserId } from '../learner/learner.service.js';

// Study logging must never interrupt a learner, so write failures are logged and dropped.
const skip = (what: string) => (error: unknown) =>
  console.warn(`Study logging skipped (${what}): ${error instanceof Error ? error.message : String(error)}`);
const check = ({ error }: { error: { message: string; code?: string } | null }) => {
  if (error && error.code !== '23505') throw new Error(error.message); // 23505: already recorded
};

export type SpeechActivity = 'practice' | 'checkpoint' | 'checkpoint_retry';
export type SpeechResult = 'matched' | 'different' | 'uncertain' | 'unavailable';

export async function recordPresence(userId: number) {
  await Promise.resolve(supabase.rpc('record_study_presence', { p_user: userId })).then(check).catch(skip('presence'));
}
export async function recordSpeechAttempt(a: { userId: number; target: string; bookId: string | null; activity: SpeechActivity; result: SpeechResult; latencyMs: number }) {
  await Promise.resolve(supabase.rpc('record_speech_attempt', {
    p_user: a.userId, p_target: a.target, p_book: a.bookId, p_activity: a.activity, p_result: a.result,
    p_latency: Math.max(0, Math.min(600000, Math.round(a.latencyMs))),
  })).then(check).catch(skip('speech attempt'));
}
// Response time runs from the request's arrival, before the recording upload is parsed, to the response finishing.
export function markSpeechStart(_req: Request, res: Response, next: NextFunction) {
  res.locals.studyStart = performance.now();
  next();
}
export function logSpeechOnFinish(req: Request, res: Response, entry: { target: string; bookId: string | null; activity: SpeechActivity; result: SpeechResult }) {
  const { userId, userRole } = req as AuthenticatedRequest, start = res.locals.studyStart;
  // Only learner routes marked with markSpeechStart are logged, so admin review checks stay out of the data.
  if (!userId || userRole !== 'learner' || typeof start !== 'number') return;
  res.once('finish', () => void recordSpeechAttempt({ userId, ...entry, latencyMs: performance.now() - start }));
}
export async function recordStopCompletions(userId: number, before: string[], after: string[]) {
  const known = new Set(before), fresh = after.filter(stop => !known.has(stop) && validReadingStop(stop));
  await Promise.all(fresh.map(stop => Promise.resolve(supabase.from('study_events')
    .insert({ user_id: userId, event_type: 'stop_complete', book_id: stop.split(':')[0], stop_id: stop })).then(check).catch(skip('stop'))));
}

export async function dailyGoal(userId: number) {
  const day = manilaDay(new Date().toISOString());
  await Promise.resolve(supabase.from('study_events').insert({ user_id: userId, event_type: 'daily_goal_shown' })).then(check).catch(skip('daily goal'));
  const rows = unwrap(await supabase.from('study_events').select('event_type,result')
    .eq('user_id', userId).eq('study_day', day).in('event_type', ['stop_complete', 'speech_attempt'])) as Array<{ event_type: string; result: string | null }>;
  const stops = rows.filter(r => r.event_type === 'stop_complete').length;
  const words = rows.filter(r => countsAsWord({ type: r.event_type, result: r.result } as StudyEvent)).length;
  return { day, goal: DAILY_GOAL, stops, words, completed: dailyGoalMet(stops, words) };
}

export async function learnerRecap(userId: number) {
  const since = addDays(weekStart(manilaDay(new Date().toISOString())), -7);
  const events = unwrap(await supabase.from('study_events').select('event_type,stop_id,result,study_day,occurred_at')
    .eq('user_id', userId).gte('study_day', since).in('event_type', ['stop_complete', 'speech_attempt']).limit(5000)) as Array<Record<string, any>>;
  const learner = await getLearnerByUserId(userId);
  const books = unwrap(await supabase.from('reading_checkpoints').select('chapter_id,completed_at').eq('learner_id', learner.id)
    .eq('passed', true).gte('completed_at', `${addDays(since, -1)}T16:00:00Z`)) as Array<{ chapter_id: string; completed_at: string | null }>;
  // Repeat passes of the same book count once, on the first pass.
  const firstPass = new Map<string, string>();
  for (const b of books) if (b.completed_at && (!firstPass.has(b.chapter_id) || b.completed_at < firstPass.get(b.chapter_id)!)) firstPass.set(b.chapter_id, b.completed_at);
  return summarizeRecap(events.map(e => ({ userId, type: e.event_type, bookId: null, stopId: e.stop_id, target: null, activity: null,
    result: e.result, attemptNumber: null, latencyMs: null, studyDay: e.study_day, occurredAt: e.occurred_at })), [...firstPass.values()]);
}

export async function studySettings() {
  const settings = unwrap(await supabase.from('study_settings').select('start_date').eq('id', 1).maybeSingle()) as { start_date: string | null } | null;
  const open = unwrap(await supabase.from('study_class_sessions').select('id,started_at').is('ended_at', null).maybeSingle()) as { id: number; started_at: string } | null;
  return { startDate: settings?.start_date ?? null, classSession: open ? { startedAt: open.started_at } : null };
}
export async function setStartDate(startDate: string | null) {
  unwrap(await supabase.from('study_settings').upsert({ id: 1, start_date: startDate, updated_at: new Date().toISOString() }));
}
export async function startClassSession(adminId: number) {
  check(await supabase.from('study_class_sessions').insert({ started_by: adminId })); // one open window at a time
}
export async function endClassSession() {
  unwrap(await supabase.from('study_class_sessions').update({ ended_at: new Date().toISOString() }).is('ended_at', null));
}
export async function deleteLearner(userId: number) {
  const user = unwrap(await supabase.from('users').select('id,role').eq('id', userId).maybeSingle()) as { role: string } | null;
  if (!user || user.role !== 'learner') return false;
  unwrap(await supabase.from('users').delete().eq('id', userId)); // cascades to profiles, progress and study data
  return true;
}

async function everyRow<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const batch = unwrap(await page(from, from + 999)) ?? [];
    rows.push(...batch);
    if (batch.length < 1000) return rows;
  }
}
export async function studyData() {
  const { startDate } = await studySettings();
  const learners = await everyRow<{ id: number }>((a, b) => supabase.from('users').select('id').eq('role', 'learner').order('id').range(a, b));
  const profiles = await everyRow<{ id: number; user_id: number }>((a, b) => supabase.from('learner_profiles').select('id,user_id').order('id').range(a, b));
  const userOf = new Map(profiles.map(p => [p.id, p.user_id]));
  const sessions = await everyRow<{ user_id: number; started_at: string; last_seen_at: string }>((a, b) =>
    supabase.from('study_sessions').select('user_id,started_at,last_seen_at').order('id').range(a, b));
  const windows = await everyRow<{ started_at: string; ended_at: string | null }>((a, b) =>
    supabase.from('study_class_sessions').select('started_at,ended_at').order('id').range(a, b));
  const events = await everyRow<Record<string, any>>((a, b) => supabase.from('study_events').select('*').order('id').range(a, b));
  const checkpoints = await everyRow<{ learner_id: number; chapter_id: string; passed: boolean; completed_at: string | null }>((a, b) =>
    supabase.from('reading_checkpoints').select('learner_id,chapter_id,passed,completed_at').eq('passed', true).order('id').range(a, b));
  return computeMetrics({
    learners: learners.map(l => l.id), startDate,
    sessions: sessions.map(s => ({ userId: s.user_id, startedAt: s.started_at, lastSeenAt: s.last_seen_at })),
    classWindows: windows.map(w => ({ startedAt: w.started_at, endedAt: w.ended_at })),
    events: events.map(e => ({ userId: e.user_id, type: e.event_type, bookId: e.book_id, stopId: e.stop_id, target: e.target, activity: e.activity,
      result: e.result, attemptNumber: e.attempt_number, latencyMs: e.latency_ms, studyDay: e.study_day, occurredAt: e.occurred_at })),
    checkpoints: checkpoints.flatMap(c => userOf.has(c.learner_id) ? [{ userId: userOf.get(c.learner_id)!, bookId: c.chapter_id, passed: c.passed, completedAt: c.completed_at }] : []),
    books: Object.fromEntries(Object.entries(READING_STOPS).map(([book, stops]) => [book, stops.map(stop => `${book}:${stop}`)])),
  });
}
