import { supabase, unwrap } from '../../database/db.js';
import { getLearnerByUserId } from '../learner/learner.service.js';
import { recordStopCompletions } from '../study/study.service.js';

export interface CurriculumState {
  schemaVersion: 1;
  campOrientationStep: number;
  guidedStops: string[];
  guidedActivities: Record<string, boolean>;
  guidedRounds: Record<string, { step: number; spoken: string[] }>;
  carouselFocus: number;
  stickerBookOpened: boolean;
  soundRecordings: Array<{ word: string; recordedAt: string }>;
  updatedAt: string;
}

const emptyState = (): CurriculumState => ({
  schemaVersion: 1, campOrientationStep: 0, guidedStops: [], guidedActivities: {}, guidedRounds: {},
  carouselFocus: 0, stickerBookOpened: false, soundRecordings: [], updatedAt: new Date(0).toISOString(),
});

function cleanStringList(value: unknown, limit: number, length = 80) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length <= length))].slice(0, limit);
}
function cleanActivities(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, enabled]) => key.length <= 100 && enabled === true).slice(0, 300));
}
function cleanRounds(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([key, round]) => {
    if (key.length > 60 || !round || typeof round !== 'object' || Array.isArray(round)) return [];
    const item = round as { step?: unknown; spoken?: unknown };
    if (!Number.isInteger(item.step) || Number(item.step) < 0 || Number(item.step) > 50) return [];
    return [[key, { step: Number(item.step), spoken: cleanStringList(item.spoken, 30, 20) }]];
  }).slice(0, 30));
}
function cleanRecordings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    const record = item as { word?: unknown; recordedAt?: unknown };
    if (typeof record.word !== 'string' || record.word.length > 24 || typeof record.recordedAt !== 'string' || !Number.isFinite(Date.parse(record.recordedAt))) return [];
    return [{ word: record.word, recordedAt: record.recordedAt }];
  }).slice(-200);
}
function fromRow(row: Record<string, unknown> | null): CurriculumState {
  if (!row) return emptyState();
  return {
    schemaVersion: 1,
    campOrientationStep: Math.max(0, Math.min(3, Number(row.camp_orientation_step) || 0)),
    guidedStops: cleanStringList(row.guided_stops, 500), guidedActivities: cleanActivities(row.guided_activities),
    guidedRounds: cleanRounds(row.guided_rounds), carouselFocus: Math.max(0, Math.min(9, Number(row.carousel_focus) || 0)),
    stickerBookOpened: row.sticker_book_opened === true, soundRecordings: cleanRecordings(row.sound_recordings),
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : new Date(0).toISOString(),
  };
}

export function parseCurriculumState(value: unknown): Omit<CurriculumState, 'schemaVersion'|'updatedAt'> {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    campOrientationStep: Math.max(0, Math.min(3, Number(input.campOrientationStep) || 0)),
    guidedStops: cleanStringList(input.guidedStops, 500), guidedActivities: cleanActivities(input.guidedActivities),
    guidedRounds: cleanRounds(input.guidedRounds), carouselFocus: Math.max(0, Math.min(9, Number(input.carouselFocus) || 0)),
    stickerBookOpened: input.stickerBookOpened === true, soundRecordings: cleanRecordings(input.soundRecordings),
  };
}

function mergeState(current: CurriculumState, incoming: ReturnType<typeof parseCurriculumState>) {
  const roundKeys = new Set([...Object.keys(current.guidedRounds), ...Object.keys(incoming.guidedRounds)]);
  const guidedRounds = Object.fromEntries([...roundKeys].map(key => {
    const left = current.guidedRounds[key], right = incoming.guidedRounds[key];
    if (!left) return [key, right];
    if (!right) return [key, left];
    return [key, {
      step: Math.max(left.step, right.step),
      spoken: [...new Set([...left.spoken, ...right.spoken])].slice(0, 30),
    }];
  }));
  const recordings = [...current.soundRecordings, ...incoming.soundRecordings];
  return {
    campOrientationStep: Math.max(current.campOrientationStep, incoming.campOrientationStep),
    guidedStops: [...new Set([...current.guidedStops, ...incoming.guidedStops])].slice(0, 500),
    guidedActivities: { ...current.guidedActivities, ...incoming.guidedActivities },
    guidedRounds,
    carouselFocus: incoming.carouselFocus,
    stickerBookOpened: current.stickerBookOpened || incoming.stickerBookOpened,
    soundRecordings: [...new Map(recordings.map(item => [`${item.word}:${item.recordedAt}`, item])).values()].slice(-200),
  };
}

export async function getCurriculumState(userId: number) {
  const learner = await getLearnerByUserId(userId);
  const row = unwrap<Record<string, unknown> | null>(await supabase.from('learner_curriculum_state').select('*').eq('learner_id', learner.id).maybeSingle());
  return fromRow(row);
}
export async function saveCurriculumState(userId: number, input: unknown) {
  const learner = await getLearnerByUserId(userId), incoming = parseCurriculumState(input), updatedAt = new Date().toISOString();
  const existing = unwrap<Record<string, unknown> | null>(await supabase.from('learner_curriculum_state').select('*').eq('learner_id', learner.id).maybeSingle());
  const previous = fromRow(existing), state = mergeState(previous, incoming);
  const result = await supabase.from('learner_curriculum_state').upsert({
    learner_id: learner.id, camp_orientation_step: state.campOrientationStep, guided_stops: state.guidedStops,
    guided_activities: state.guidedActivities, guided_rounds: state.guidedRounds, carousel_focus: state.carouselFocus,
    sticker_book_opened: state.stickerBookOpened, sound_recordings: state.soundRecordings, updated_at: updatedAt,
  }, { onConflict: 'learner_id' }).select('*').single();
  if(result.error||!result.data)throw new Error(result.error?.message||'Curriculum state was not saved');
  await recordStopCompletions(userId, previous.guidedStops, state.guidedStops);
  return fromRow(result.data as Record<string, unknown>);
}
