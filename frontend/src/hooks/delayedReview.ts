import { createEvidenceAttempt, type EvidenceAttempt } from './evidenceRecords.ts';
import { SOUND_CHECK_ITEMS, WORD_CHECK, type CampLetter, type SoundCheckItem } from '../app/components/learningCampIndependent.ts';

export type ReviewState = 'not_scheduled' | 'waiting' | 'due';

export interface DelayedReviewStatus {
  status: ReviewState;
  independentCompletedAt: string | null;
  dueAt: string | null;
  latestReviewAt: string | null;
  reviewCount: number;
  intervalDays: number;
}

const STATES: ReviewState[] = ['not_scheduled', 'waiting', 'due'];
const validDate = (value: unknown) => value === null || typeof value === 'string' && Number.isFinite(Date.parse(value));
const count = (value: unknown) => {
  const parsed = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  return typeof parsed === 'number' && Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
};

export function parseDelayedReviewStatus(value: unknown): DelayedReviewStatus | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const reviewCount = count(row.review_count), intervalDays = count(row.interval_days);
  if (row.schemaVersion !== 1 || !STATES.includes(row.review_status as ReviewState) ||
    !validDate(row.independent_completed_at) || !validDate(row.due_at) || !validDate(row.latest_review_at) ||
    reviewCount === null || intervalDays === null || intervalDays < 1 || intervalDays > 30) return null;
  return {
    status: row.review_status as ReviewState,
    independentCompletedAt: row.independent_completed_at as string | null,
    dueAt: row.due_at as string | null,
    latestReviewAt: row.latest_review_at as string | null,
    reviewCount,
    intervalDays,
  };
}

interface EvidenceContext {
  sessionId: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  startedAt: string;
  completedAt?: string;
  capturedOffline: boolean;
}

export function createDelayedSoundEvidence(input: EvidenceContext & { item: SoundCheckItem; response: CampLetter }, uuid?: () => string): EvidenceAttempt {
  return createEvidenceAttempt({
    sessionId: input.sessionId, curriculumVersion: input.curriculumVersion, mediaManifestVersion: input.mediaManifestVersion,
    activityId: 'ENG01-MAT-R01', skillId: input.item.skillId, contentId: input.item.contentId,
    mode: 'delayed_review', responseType: 'selection', responseValue: input.response,
    result: input.response === input.item.letter ? 'correct' : 'incorrect', hintCount: 0,
    modelExposed: false, answerExposed: false, reducedChoices: false, mediaAssetIds: [input.item.assetId],
    startedAt: input.startedAt, completedAt: input.completedAt ?? new Date().toISOString(), capturedOffline: input.capturedOffline,
  }, uuid);
}

export function createDelayedWordEvidence(input: EvidenceContext & { response: string; status?: 'matched'|'different'|'uncertain'|'unavailable' }, uuid?: () => string): EvidenceAttempt {
  const status=input.status??(input.response===WORD_CHECK.word?'matched':'different');
  return createEvidenceAttempt({
    sessionId: input.sessionId, curriculumVersion: input.curriculumVersion, mediaManifestVersion: input.mediaManifestVersion,
    activityId: 'ENG01-MAT-R01', skillId: 'eng01.decode.mat', contentId: 'eng01.word.mat',
    mode: 'delayed_review', responseType: 'speech_prediction', responseValue: input.response||null,
    result: status==='matched'?'correct':status==='different'?'incorrect':status==='uncertain'?'unclear':'unavailable', hintCount: 0,
    modelExposed: false, answerExposed: false, reducedChoices: false, mediaAssetIds: [],
    startedAt: input.startedAt, completedAt: input.completedAt ?? new Date().toISOString(), capturedOffline: input.capturedOffline,
  }, uuid);
}

const DELAYED_SOUND_URLS:Record<CampLetter,string>={
  m:'/audio/stage2/classic-milo/SoundShelf-M.wav',
  a:'/audio/stage1/classic-milo/A.wav',
  t:'/audio/stage2/classic-milo/SoundShelf-T.wav',
};

export function delayedSoundUrl(letter:CampLetter){return DELAYED_SOUND_URLS[letter];}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function verifyDelayedReviewMedia(mediaManifestVersion: string, fetcher: FetchLike = fetch) {
  try {
    void mediaManifestVersion;
    const assets = SOUND_CHECK_ITEMS.map((item) => delayedSoundUrl(item.letter));
    const responses = await Promise.all(assets.map((url) => fetcher(url, { cache: 'force-cache' })));
    return responses.every((response) => response.ok && (response.headers.get('Content-Type') ?? '').toLowerCase().startsWith('audio/'));
  } catch { return false; }
}

export const DELAYED_REVIEW_ITEMS = SOUND_CHECK_ITEMS;
