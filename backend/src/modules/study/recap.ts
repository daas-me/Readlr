// Learner-facing progress recaps (session and weekly summaries). Weeks run Monday to Sunday on the Philippine calendar.
import { countsAsWord, dailyGoalMet, manilaDay, type StudyEvent } from './study-metrics.js';

const DAY_MS = 864e5;
// Stops that award a Sticker Book sticker; every passed book awards one more (StickerBook.tsx).
const STICKER_STOPS = new Set(['gate:mango', 'gate:apple', 'gate:top']);
export const isStickerStop = (stopId: string) => STICKER_STOPS.has(stopId) || stopId.endsWith(':blend');

export const addDays = (day: string, n: number) => new Date(Date.parse(day) + n * DAY_MS).toISOString().slice(0, 10);
export function weekStart(day: string) {
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  return addDays(day, -((weekday + 6) % 7));
}

export interface RecapTotals { stops: number; words: number; stickers: number; booksPassed: number; dailyStars: number }
export interface Recap {
  today: RecapTotals & { day: string };
  thisWeek: RecapTotals & { start: string; end: string };
  lastWeek: RecapTotals & { start: string; end: string };
}

export function summarizeRecap(events: StudyEvent[], booksPassedAt: string[], now = new Date().toISOString()): Recap {
  const today = manilaDay(now), start = weekStart(today), lastStart = addDays(start, -7);
  const passedDays = booksPassedAt.map(manilaDay);
  const totals = (from: string, to: string): RecapTotals => {
    const inRange = (day: string) => day >= from && day <= to;
    const perDay = new Map<string, { stops: number; words: number }>();
    let stops = 0, words = 0, stickers = 0;
    for (const e of events) {
      if (!inRange(e.studyDay)) continue;
      const day = perDay.get(e.studyDay) ?? { stops: 0, words: 0 };
      if (e.type === 'stop_complete') { stops++; day.stops++; if (e.stopId && isStickerStop(e.stopId)) stickers++; }
      else if (countsAsWord(e)) { words++; day.words++; }
      perDay.set(e.studyDay, day);
    }
    const booksPassed = passedDays.filter(inRange).length;
    const dailyStars = [...perDay.values()].filter(d => dailyGoalMet(d.stops, d.words)).length;
    return { stops, words, stickers: stickers + booksPassed, booksPassed, dailyStars };
  };
  return {
    today: { day: today, ...totals(today, today) },
    thisWeek: { start, end: addDays(start, 6), ...totals(start, addDays(start, 6)) },
    lastWeek: { start: lastStart, end: addDays(lastStart, 6), ...totals(lastStart, addDays(lastStart, 6)) },
  };
}
