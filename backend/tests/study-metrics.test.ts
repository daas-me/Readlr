import test from 'node:test';
import assert from 'node:assert/strict';
import { computeMetrics, manilaDay, studyWeek, type StudyEvent } from '../src/modules/study/study-metrics.js';
import { parseLabels, summarizeAccuracy } from '../src/modules/audio/asr-accuracy.js';

const event = (e: Partial<StudyEvent> & Pick<StudyEvent, 'userId' | 'type' | 'occurredAt'>): StudyEvent => ({
  bookId: null, stopId: null, target: null, activity: null, result: null, attemptNumber: null, latencyMs: null,
  studyDay: manilaDay(e.occurredAt), ...e,
});
const metric = (m: ReturnType<typeof computeMetrics>, id: string) => m.summary.find(row => row.id === id)!;

test('study days and weeks follow the Philippine calendar', () => {
  assert.equal(manilaDay('2026-11-01T17:00:00Z'), '2026-11-02');
  assert.equal(studyWeek('2026-11-01T15:59:00Z', '2026-11-02'), null);
  assert.equal(studyWeek('2026-11-08T15:59:00Z', '2026-11-02'), 1);
  assert.equal(studyWeek('2026-11-08T16:00:00Z', '2026-11-02'), 2);
  assert.equal(studyWeek('2026-11-02T00:00:00Z', null), null);
});

test('SMART metrics report numerators and denominators from the pilot rules', () => {
  const m = computeMetrics({
    learners: [1, 2, 3], startDate: '2026-11-02', now: '2026-12-01T00:00:00Z',
    sessions: [
      { userId: 1, startedAt: '2026-11-02T01:00:00Z', lastSeenAt: '2026-11-02T01:20:00Z' },
      { userId: 1, startedAt: '2026-11-09T01:00:00Z', lastSeenAt: '2026-11-09T01:10:00Z' },
      { userId: 1, startedAt: '2026-11-16T01:00:00Z', lastSeenAt: '2026-11-16T01:10:00Z' },
      { userId: 2, startedAt: '2026-11-03T02:00:00Z', lastSeenAt: '2026-11-03T02:05:00Z' },
      { userId: 2, startedAt: '2026-11-10T02:00:00Z', lastSeenAt: '2026-11-10T02:30:00Z' },
      { userId: 9, startedAt: '2026-11-03T02:00:00Z', lastSeenAt: '2026-11-03T02:05:00Z' },
    ],
    classWindows: [{ startedAt: '2026-11-10T01:30:00Z', endedAt: '2026-11-10T03:00:00Z' }],
    events: [
      event({ userId: 1, type: 'daily_goal_shown', occurredAt: '2026-11-02T01:00:00Z' }),
      event({ userId: 1, type: 'stop_complete', bookId: 'gate', stopId: 'gate:mango', occurredAt: '2026-11-02T01:05:00Z' }),
      event({ userId: 1, type: 'speech_attempt', target: 'mat', result: 'different', latencyMs: 1000, occurredAt: '2026-11-02T01:06:00Z' }),
      event({ userId: 1, type: 'speech_attempt', target: 'mat', result: 'matched', latencyMs: 2500, occurredAt: '2026-11-02T01:07:00Z' }),
      event({ userId: 2, type: 'daily_goal_shown', occurredAt: '2026-11-03T02:00:00Z' }),
      event({ userId: 2, type: 'speech_attempt', target: 'sun', result: 'different', latencyMs: 4000, occurredAt: '2026-11-03T02:01:00Z' }),
      event({ userId: 2, type: 'speech_attempt', target: 'pen', result: 'uncertain', occurredAt: '2026-11-03T02:02:00Z' }),
      event({ userId: 3, type: 'speech_attempt', target: 'sun', result: 'matched', latencyMs: 900, occurredAt: '2026-10-30T02:00:00Z' }),
    ],
    checkpoints: [{ userId: 2, bookId: 'gate', passed: true, completedAt: '2026-11-04T02:00:00Z' }],
    books: { gate: ['gate:mango', 'gate:check'] },
  });
  assert.deepEqual(m.weekly.map(w => w.retention), [null, .5, .5, 0]);
  assert.equal(metric(m, 'weekly-retention').met, false);
  assert.deepEqual([metric(m, 'voluntary-consistency').numerator, metric(m, 'voluntary-consistency').denominator], [1, 3]);
  assert.deepEqual([metric(m, 'daily-goal').numerator, metric(m, 'daily-goal').denominator], [1, 2]);
  assert.deepEqual([metric(m, 'correction-on-retry').numerator, metric(m, 'correction-on-retry').denominator], [1, 2]);
  assert.equal(metric(m, 'response-3s').value, 4000);
  assert.equal(metric(m, 'response-3s').numerator, 2);
  assert.deepEqual([m.books[0].completedStops, m.books[0].assignedStops, m.books[0].learnersPassedFinalGate], [2, 6, 1]);
  assert.equal(m.speech.length, 4, 'events before the start date and from non-learners are excluded');
  assert.equal(m.sessions.find(s => s.userId === 2 && s.week === 2)?.context, 'required');
});

test('metrics stay unjudged until there is data and a start date', () => {
  const m = computeMetrics({ learners: [1], startDate: null, sessions: [], classWindows: [], events: [], checkpoints: [], books: {} });
  for (const row of m.summary) assert.equal(row.met, null, row.id);
});

test('ASR accuracy counts only clearly-said target words and reports false accepts', () => {
  const labels = parseLabels('﻿file,target,heard,clarity,modelled,rater\r\nR-1_mat.webm,mat,mat,clear,no,TR\nR-1_sun.webm,sun,son,clear,no,TR\nR-1_pen.webm,pen,,silent,yes,TR\nR-2_mat.webm,mat,mat,clear,no,AL\n');
  const status = { 'R-1_mat.webm': 'matched', 'R-1_sun.webm': 'matched', 'R-1_pen.webm': 'uncertain', 'R-2_mat.webm': 'different' } as const;
  const s = summarizeAccuracy(labels.map(l => ({ ...l, status: status[l.file as keyof typeof status] })));
  assert.deepEqual(s.primary, { accepted: 1, total: 2, rate: .5, pass: false });
  assert.deepEqual([s.falseAccepts.accepted, s.falseAccepts.total], [1, 1]);
  assert.equal(s.excluded.silent, 1);
  assert.throws(() => parseLabels('file,target,heard,clarity\na.webm,mat,mat,clear\na.webm,mat,mat,clear'), /one final label/);
  assert.throws(() => parseLabels('file,target\na.webm,mat'), /missing column/);
});

test('export workbook identifies learners by code only', async () => {
  const ExcelJS = (await import('exceljs')).default;
  const { studyWorkbook } = await import('../src/modules/study/study-workbook.js');
  const m = computeMetrics({ learners: [7], startDate: '2026-11-02', now: '2026-12-01T00:00:00Z', classWindows: [], checkpoints: [], books: {},
    sessions: [{ userId: 7, startedAt: '2026-11-02T01:00:00Z', lastSeenAt: '2026-11-02T01:30:00Z' }],
    events: [event({ userId: 7, type: 'speech_attempt', target: 'mat', result: 'matched', latencyMs: 800, occurredAt: '2026-11-02T01:05:00Z' })] });
  const read = new ExcelJS.Workbook();
  await read.xlsx.load(await studyWorkbook(m, '2026-11-02').xlsx.writeBuffer());
  assert.deepEqual(read.worksheets.map(s => s.name), ['Summary', 'Weekly', 'Books', 'Daily goals', 'Sessions', 'Speech checks']);
  assert.equal(read.getWorksheet('Speech checks')!.getCell('A2').value, 'L-007');
  assert.equal(read.getWorksheet('Sessions')!.getCell('D2').value, 30);
});

test('speech checks are logged only for learners on marked routes', async () => {
  process.env.SUPABASE_URL ??= 'http://127.0.0.1:1'; process.env.SUPABASE_SERVICE_ROLE_KEY ??= 'test-only';
  const { supabase } = await import('../src/database/db.js');
  const { logSpeechOnFinish, markSpeechStart } = await import('../src/modules/study/study.service.js');
  const original = supabase.rpc, calls: any[] = [];
  supabase.rpc = (async (name: string, args: any) => { calls.push({ name, args }); return { data: 1, error: null }; }) as any;
  const response = () => { const handlers: Array<() => void> = []; return { locals: {} as Record<string, unknown>, once: (_: string, f: () => void) => handlers.push(f), finish: () => handlers.forEach(f => f()) }; };
  const entry = { target: 'mat', bookId: 'gate', activity: 'checkpoint' as const, result: 'matched' as const };
  try {
    const marked = response(); markSpeechStart({} as any, marked as any, () => undefined);
    logSpeechOnFinish({ userId: 4, userRole: 'learner' } as any, marked as any, entry); marked.finish();
    const unmarked = response(); logSpeechOnFinish({ userId: 4, userRole: 'learner' } as any, unmarked as any, entry); unmarked.finish();
    const admin = response(); markSpeechStart({} as any, admin as any, () => undefined);
    logSpeechOnFinish({ userId: 1, userRole: 'admin' } as any, admin as any, entry); admin.finish();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].name, 'record_speech_attempt');
    assert.equal(calls[0].args.p_user, 4);
    assert.ok(calls[0].args.p_latency >= 0);
  } finally { supabase.rpc = original; }
});

test('recaps count today, this week and last week on the Philippine calendar', async () => {
  const { summarizeRecap, weekStart } = await import('../src/modules/study/recap.js');
  assert.equal(weekStart('2026-11-04'), '2026-11-02'); // Wednesday -> Monday
  assert.equal(weekStart('2026-11-08'), '2026-11-02'); // Sunday stays in the same week
  assert.equal(weekStart('2026-11-09'), '2026-11-09');
  const now = '2026-11-10T03:00:00Z'; // Tuesday 11:00 in Manila
  const r = summarizeRecap([
    event({ userId: 1, type: 'stop_complete', stopId: 'gate:mango', occurredAt: '2026-11-03T01:00:00Z' }),
    event({ userId: 1, type: 'stop_complete', stopId: 'gate:games', occurredAt: '2026-11-03T01:05:00Z' }),
    ...['mat', 'am', 'at', 'sat', 'sit'].map(target => event({ userId: 1, type: 'speech_attempt', target, result: 'different', occurredAt: '2026-11-04T01:00:00Z' })),
    event({ userId: 1, type: 'speech_attempt', target: 'pen', result: 'uncertain', occurredAt: '2026-11-10T01:00:00Z' }),
    event({ userId: 1, type: 'stop_complete', stopId: 'lanterns:blend', occurredAt: '2026-11-10T02:00:00Z' }),
  ], ['2026-11-07T05:00:00Z'], now);
  assert.deepEqual(r.lastWeek, { start: '2026-11-02', end: '2026-11-08', stops: 2, words: 5, stickers: 2, booksPassed: 1, dailyStars: 2 });
  assert.deepEqual(r.thisWeek, { start: '2026-11-09', end: '2026-11-15', stops: 1, words: 0, stickers: 1, booksPassed: 0, dailyStars: 1 });
  assert.deepEqual(r.today, { day: '2026-11-10', stops: 1, words: 0, stickers: 1, booksPassed: 0, dailyStars: 1 });
});
