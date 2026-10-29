import ExcelJS from 'exceljs';
import type { computeMetrics } from './study-metrics.js';

type Metrics = ReturnType<typeof computeMetrics>;
// Learners appear only as codes; names and emails never leave the database.
export const learnerCode = (userId: number) => `L-${String(userId).padStart(3, '0')}`;

function sheet(book: ExcelJS.Workbook, name: string, columns: Array<[string, string, number, string?]>) {
  const ws = book.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = columns.map(([header, key, width, numFmt]) => ({ header, key, width, style: numFmt ? { numFmt } : {} }));
  ws.getRow(1).font = { bold: true };
  return ws;
}

export function studyWorkbook(m: Metrics, startDate: string | null, generatedAt = new Date()) {
  const book = new ExcelJS.Workbook();
  book.created = generatedAt;
  const summary = sheet(book, 'Summary', [['Goal', 'goal', 8], ['Measure', 'label', 48], ['Target', 'target', 26], ['Numerator', 'numerator', 12],
    ['Denominator', 'denominator', 13], ['Result', 'value', 12], ['Met?', 'met', 8], ['Note', 'note', 80]]);
  for (const row of m.summary) {
    const added = summary.addRow({ ...row, met: row.met === null ? 'n/a' : row.met ? 'Yes' : 'No' });
    added.getCell('value').numFmt = row.id === 'response-3s' ? '0" ms"' : '0.0%';
  }
  summary.addRow({});
  summary.addRow({ label: `Study start date: ${startDate ?? 'not set'} (weeks 1-4, Asia/Manila calendar)` });
  summary.addRow({ label: `Generated: ${generatedAt.toISOString()}` });
  summary.addRow({ label: 'Learning outcomes (CVC accuracy, decoding, mispronunciations) come from the paper tests, not this file.' });

  const weekly = sheet(book, 'Weekly', [['Week', 'week', 8], ['Learners with voluntary use', 'voluntaryLearners', 26],
    ['Week-1 learners still active', 'retainedFromWeek1', 26], ['Week-1 learners', 'week1Learners', 16], ['Retention', 'retention', 12, '0.0%']]);
  m.weekly.forEach(w => weekly.addRow(w));

  const books = sheet(book, 'Books', [['Book', 'bookId', 12], ['Stops per learner', 'stopsPerLearner', 17], ['Completed stops', 'completedStops', 16],
    ['Assigned stops', 'assignedStops', 15], ['Stop completion', 'stopCompletion', 16, '0.0%'], ['Passed final gate', 'learnersPassedFinalGate', 17], ['Learners', 'learners', 10]]);
  m.books.forEach(b => books.addRow(b));

  const goals = sheet(book, 'Daily goals', [['Learner', 'learner', 10], ['Day', 'day', 12], ['Week', 'week', 8], ['Goal shown', 'shown', 11],
    ['Stops', 'stops', 8], ['Words read', 'words', 11], ['Goal met', 'completed', 10]]);
  m.dailyGoals.forEach(d => goals.addRow({ ...d, learner: learnerCode(d.userId), shown: d.shown ? 'Yes' : 'No', completed: d.completed ? 'Yes' : 'No' }));

  const sessions = sheet(book, 'Sessions', [['Learner', 'learner', 10], ['Started', 'startedAt', 24], ['Last seen', 'lastSeenAt', 24],
    ['Minutes', 'minutes', 9], ['Day', 'day', 12], ['Week', 'week', 8], ['Use', 'context', 11]]);
  m.sessions.forEach(s => sessions.addRow({ ...s, learner: learnerCode(s.userId) }));

  const speech = sheet(book, 'Speech checks', [['Learner', 'learner', 10], ['Time', 'occurredAt', 24], ['Day', 'studyDay', 12], ['Book', 'bookId', 10],
    ['Word', 'target', 10], ['Activity', 'activity', 16], ['Attempt', 'attemptNumber', 9], ['Result', 'result', 12], ['Response ms', 'latencyMs', 13]]);
  m.speech.forEach(e => speech.addRow({ ...e, learner: learnerCode(e.userId) }));
  return book;
}
