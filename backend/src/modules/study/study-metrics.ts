// SMART-target calculations for the four-week pilot. Rules follow SMART_Objective_Measurement_Addendum.md:
// each target is reported with its numerator and denominator, and ASR results are never a pronunciation score.
export const STUDY_WEEKS = 4;
export const DAILY_GOAL = { stops: 1, words: 5 } as const;
const DAY_MS = 864e5, MANILA_OFFSET_MS = 8 * 36e5, RETRY_WINDOW_MS = 30 * 6e4;

export interface StudySession { userId: number; startedAt: string; lastSeenAt: string }
export interface ClassWindow { startedAt: string; endedAt: string | null }
export interface StudyEvent {
  userId: number; type: 'speech_attempt' | 'stop_complete' | 'daily_goal_shown';
  bookId: string | null; stopId: string | null; target: string | null; activity: string | null;
  result: string | null; attemptNumber: number | null; latencyMs: number | null; studyDay: string; occurredAt: string;
}
export interface CheckpointRow { userId: number; bookId: string; passed: boolean; completedAt: string | null }
export interface StudyInput {
  learners: number[]; startDate: string | null; sessions: StudySession[]; classWindows: ClassWindow[];
  events: StudyEvent[]; checkpoints: CheckpointRow[]; books: Record<string, string[]>; now?: string;
}
export interface MetricRow {
  id: string; goal: string; label: string; target: string;
  numerator: number | null; denominator: number | null; value: number | null; met: boolean | null; note: string;
}

export function manilaDay(iso: string) { return new Date(Date.parse(iso) + MANILA_OFFSET_MS).toISOString().slice(0, 10); }
export function studyWeek(iso: string, startDate: string | null) {
  if (!startDate) return null;
  const days = Math.floor((Date.parse(manilaDay(iso)) - Date.parse(startDate)) / DAY_MS);
  return days < 0 ? null : Math.floor(days / 7) + 1;
}
export function inClassWindow(iso: string, windows: ClassWindow[], now = new Date().toISOString()) {
  const t = Date.parse(iso);
  return windows.some(w => t >= Date.parse(w.startedAt) && t <= Date.parse(w.endedAt ?? now));
}
export const dailyGoalMet = (stops: number, words: number) => stops >= DAILY_GOAL.stops || words >= DAILY_GOAL.words;
// Words count when the recognizer gave a real answer; uncertain or unavailable checks are not the child's attempt.
export const countsAsWord = (e: StudyEvent) => e.type === 'speech_attempt' && (e.result === 'matched' || e.result === 'different');

const ratio = (n: number, d: number) => d > 0 ? n / d : null;
function percentile(values: number[], p: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}

export function computeMetrics(input: StudyInput) {
  const now = input.now ?? new Date().toISOString();
  const enrolled = new Set(input.learners);
  const week = (iso: string) => studyWeek(iso, input.startDate);
  const inStudy = (iso: string) => !input.startDate || ((week(iso) ?? 0) >= 1 && (week(iso) ?? 0) <= STUDY_WEEKS);
  const events = input.events.filter(e => enrolled.has(e.userId) && inStudy(e.occurredAt));

  const sessions = input.sessions.filter(s => enrolled.has(s.userId) && inStudy(s.startedAt)).map(s => ({
    ...s, week: week(s.startedAt), day: manilaDay(s.startedAt),
    minutes: Math.round((Date.parse(s.lastSeenAt) - Date.parse(s.startedAt)) / 6e4 * 10) / 10,
    context: inClassWindow(s.startedAt, input.classWindows, now) ? 'required' as const : 'voluntary' as const,
  }));
  const voluntaryWeeks = new Map<number, Set<number>>();
  for (const s of sessions) if (s.context === 'voluntary' && s.week) {
    if (!voluntaryWeeks.has(s.userId)) voluntaryWeeks.set(s.userId, new Set());
    voluntaryWeeks.get(s.userId)!.add(s.week);
  }
  const activeIn = (w: number) => [...voluntaryWeeks].filter(([, weeks]) => weeks.has(w)).map(([id]) => id);
  const base = new Set(activeIn(1));
  const weekly = Array.from({ length: STUDY_WEEKS }, (_, i) => {
    const w = i + 1, active = activeIn(w);
    const retained = w === 1 ? active.length : active.filter(id => base.has(id)).length;
    return { week: w, voluntaryLearners: active.length, retainedFromWeek1: retained, week1Learners: base.size,
      retention: w === 1 ? null : ratio(retained, base.size) };
  });
  const followUp = weekly.slice(1).filter(w => w.retention !== null);
  const lowest = followUp.length ? followUp.reduce((a, b) => (b.retention! < a.retention! ? b : a)) : null;
  const consistent = [...voluntaryWeeks.values()].filter(weeks => weeks.size >= 3).length;

  // Daily goal: an eligible learner-day is one where the goal was shown; absence is never a failure.
  const days = new Map<string, { userId: number; day: string; week: number | null; stops: number; words: number; shown: boolean }>();
  const dayRow = (e: StudyEvent) => {
    const key = `${e.userId}|${e.studyDay}`;
    if (!days.has(key)) days.set(key, { userId: e.userId, day: e.studyDay, week: week(e.occurredAt), stops: 0, words: 0, shown: false });
    return days.get(key)!;
  };
  for (const e of events) {
    if (e.type === 'daily_goal_shown') dayRow(e).shown = true;
    else if (e.type === 'stop_complete') dayRow(e).stops++;
    else if (countsAsWord(e)) dayRow(e).words++;
  }
  const dailyGoals = [...days.values()].map(d => ({ ...d, completed: dailyGoalMet(d.stops, d.words) }))
    .sort((a, b) => a.userId - b.userId || a.day.localeCompare(b.day));
  const eligibleDays = dailyGoals.filter(d => d.shown);

  // Stage (book) completion: completed stops / assigned stops for every enrolled learner.
  // Guided stops arrive as events; the final gate ("check") is a passed reading checkpoint.
  const stopsDone = new Map<string, Set<string>>();
  const markDone = (bookId: string, key: string) => {
    if (!stopsDone.has(bookId)) stopsDone.set(bookId, new Set());
    stopsDone.get(bookId)!.add(key);
  };
  for (const e of events) if (e.type === 'stop_complete' && e.bookId && e.stopId && !e.stopId.endsWith(':check')) markDone(e.bookId, `${e.userId}|${e.stopId}`);
  const gates = input.checkpoints.filter(c => c.passed && enrolled.has(c.userId) && (!c.completedAt || inStudy(c.completedAt)));
  for (const c of gates) markDone(c.bookId, `${c.userId}|${c.bookId}:check`);
  const books = Object.entries(input.books).map(([bookId, stops]) => {
    const assigned = stops.length * enrolled.size, completed = stopsDone.get(bookId)?.size ?? 0;
    const passed = new Set(gates.filter(c => c.bookId === bookId).map(c => c.userId)).size;
    return { bookId, stopsPerLearner: stops.length, completedStops: completed, assignedStops: assigned,
      stopCompletion: ratio(completed, assigned), learnersPassedFinalGate: passed, learners: enrolled.size };
  });
  const startedBooks = books.filter(b => b.completedStops > 0);
  const weakestBook = startedBooks.length ? startedBooks.reduce((a, b) => (b.stopCompletion! < a.stopCompletion! ? b : a)) : null;

  // Correction: a confirmed incorrect word followed, within 30 minutes, by a matched try of the same word.
  const speech = events.filter(e => e.type === 'speech_attempt').sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  const byWord = new Map<string, StudyEvent[]>();
  for (const e of speech) {
    const key = `${e.userId}|${e.target}`;
    if (!byWord.has(key)) byWord.set(key, []);
    byWord.get(key)!.push(e);
  }
  let incorrect = 0, corrected = 0, noRetry = 0;
  for (const tries of byWord.values()) tries.forEach((e, i) => {
    if (e.result !== 'different') return;
    incorrect++;
    const next = tries.at(i + 1);
    if (!next || Date.parse(next.occurredAt) - Date.parse(e.occurredAt) > RETRY_WINDOW_MS) { noRetry++; return; }
    if (next.result === 'matched') corrected++;
  });
  const latencies = speech.map(e => e.latencyMs).filter((v): v is number => typeof v === 'number');
  const within = (ms: number) => latencies.filter(v => v <= ms).length;
  const p95 = percentile(latencies, .95);
  const results = Object.fromEntries(['matched', 'different', 'uncertain', 'unavailable'].map(r => [r, speech.filter(e => e.result === r).length]));

  const met = (value: number | null, threshold: number) => value === null ? null : value >= threshold;
  const summary: MetricRow[] = [
    { id: 'weekly-retention', goal: 'G3', label: 'Weekly active-user retention (lowest of weeks 2-4)', target: '>= 75% each week',
      numerator: lowest?.retainedFromWeek1 ?? null, denominator: lowest?.week1Learners ?? null, value: lowest?.retention ?? null,
      met: followUp.length ? followUp.every(w => w.retention! >= .75) : null,
      note: input.startDate ? `Lowest is week ${lowest?.week ?? '-'}; see the Weekly sheet. Voluntary sessions only.` : 'Set the study start date to calculate.' },
    { id: 'daily-goal', goal: 'G3', label: 'Daily goal achievement on days the goal was shown', target: '>= 70%',
      numerator: eligibleDays.filter(d => d.completed).length, denominator: eligibleDays.length,
      value: ratio(eligibleDays.filter(d => d.completed).length, eligibleDays.length),
      met: met(ratio(eligibleDays.filter(d => d.completed).length, eligibleDays.length), .7),
      note: `Goal: finish ${DAILY_GOAL.stops} stop or read ${DAILY_GOAL.words} words in a day.` },
    { id: 'voluntary-consistency', goal: 'G3', label: 'Learners with voluntary use in at least 3 of 4 weeks', target: '>= 60%',
      numerator: consistent, denominator: enrolled.size, value: ratio(consistent, enrolled.size),
      met: input.startDate ? met(ratio(consistent, enrolled.size), .6) : null,
      note: 'Denominator is every learner account in the study.' },
    { id: 'stage-completion', goal: 'G1', label: 'Stop completion in the weakest started book', target: '>= 75% in each book',
      numerator: weakestBook?.completedStops ?? null, denominator: weakestBook?.assignedStops ?? null, value: weakestBook?.stopCompletion ?? null,
      met: startedBooks.length ? startedBooks.every(b => b.stopCompletion! >= .75) : null,
      note: weakestBook ? `Weakest: ${weakestBook.bookId}. Only books learners started are judged; see the Books sheet.` : 'No stops completed yet.' },
    { id: 'correction-on-retry', goal: 'G2', label: 'Incorrect words corrected on the next try', target: '>= 75%',
      numerator: corrected, denominator: incorrect, value: ratio(corrected, incorrect), met: met(ratio(corrected, incorrect), .75),
      note: `${noRetry} incorrect words had no retry within 30 minutes. Uncertain and unavailable checks are excluded.` },
    { id: 'response-3s', goal: 'G2', label: 'Speech checks answered within 3 seconds', target: '95th percentile <= 3000 ms',
      numerator: within(3000), denominator: latencies.length, value: p95, met: p95 === null ? null : p95 <= 3000,
      note: `Server time from upload to answer, in ms. ${within(2000)} of ${latencies.length} were within 2 seconds.` },
    { id: 'asr-results', goal: 'G1', label: 'Speech check results during gameplay', target: 'Information only',
      numerator: results.matched, denominator: speech.length, value: ratio(results.matched, speech.length), met: null,
      note: `matched ${results.matched}, different ${results.different}, uncertain ${results.uncertain}, unavailable ${results.unavailable}. Not a pronunciation score; the >= 85% ASR target uses the labelled accuracy test.` },
  ];
  return { summary, weekly, books, dailyGoals, sessions, speech };
}
