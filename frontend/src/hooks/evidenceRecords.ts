export type EvidenceMode = 'teaching' | 'practice' | 'guided' | 'adventure' | 'independent_check' | 'delayed_review';
export type EvidenceResponseType = 'selection' | 'construction' | 'speech_prediction' | 'nonvoice' | 'none';
export type EvidenceResult = 'correct' | 'incorrect' | 'unclear' | 'unavailable' | 'no_response';

export interface EvidenceAttempt {
  schemaVersion: 1;
  attemptId: string;
  sessionId: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  activityId: string;
  skillId: string;
  contentId: string;
  mode: EvidenceMode;
  responseType: EvidenceResponseType;
  responseValue: string | null;
  result: EvidenceResult;
  hintCount: number;
  modelExposed: boolean;
  answerExposed: boolean;
  reducedChoices: boolean;
  mediaAssetIds: string[];
  startedAt: string;
  completedAt: string;
  capturedOffline: boolean;
}

interface EvidenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

type EvidenceDraft = Omit<EvidenceAttempt, 'schemaVersion' | 'attemptId'>;
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const MODES: EvidenceMode[] = ['teaching', 'practice', 'guided', 'adventure', 'independent_check', 'delayed_review'];
const RESPONSE_TYPES: EvidenceResponseType[] = ['selection', 'construction', 'speech_prediction', 'nonvoice', 'none'];
const RESULTS: EvidenceResult[] = ['correct', 'incorrect', 'unclear', 'unavailable', 'no_response'];
const MAX_QUEUED_ATTEMPTS = 1000;
const API = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || 'http://localhost:3000/api';

export const EVIDENCE_QUEUED = 'readlr:evidence-queued';
export const EVIDENCE_SYNCED = 'readlr:evidence-synced';
export const evidenceQueueKey = (learnerId: number) => `readlr_evidence_queue_v1_${learnerId}`;
const validLearner = (learnerId: number | null | undefined): learnerId is number => Number.isSafeInteger(learnerId) && Number(learnerId) > 0;
const browserStorage = (): EvidenceStorage => localStorage;

function validAttempt(value: unknown): value is EvidenceAttempt {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const item = value as Record<string, unknown>;
  return item.schemaVersion === 1 && typeof item.attemptId === 'string' && UUID.test(item.attemptId) &&
    typeof item.sessionId === 'string' && UUID.test(item.sessionId) &&
    ['curriculumVersion', 'mediaManifestVersion', 'activityId', 'skillId', 'contentId'].every(key => typeof item[key] === 'string' && IDENTIFIER.test(item[key] as string)) &&
    MODES.includes(item.mode as EvidenceMode) && RESPONSE_TYPES.includes(item.responseType as EvidenceResponseType) && RESULTS.includes(item.result as EvidenceResult) &&
    (item.responseValue === null || typeof item.responseValue === 'string' && /^[A-Za-z0-9 .'-]{1,64}$/.test(item.responseValue)) && Number.isInteger(item.hintCount) && Number(item.hintCount) >= 0 && Number(item.hintCount) <= 20 &&
    typeof item.modelExposed === 'boolean' && typeof item.answerExposed === 'boolean' && typeof item.reducedChoices === 'boolean' &&
    Array.isArray(item.mediaAssetIds) && item.mediaAssetIds.length <= 20 && item.mediaAssetIds.every(id => typeof id === 'string' && IDENTIFIER.test(id)) && new Set(item.mediaAssetIds).size === item.mediaAssetIds.length &&
    typeof item.startedAt === 'string' && Number.isFinite(Date.parse(item.startedAt)) && typeof item.completedAt === 'string' && Number.isFinite(Date.parse(item.completedAt)) &&
    Date.parse(item.completedAt) >= Date.parse(item.startedAt) && typeof item.capturedOffline === 'boolean';
}

export function createEvidenceAttempt(draft: EvidenceDraft, uuid: () => string = () => crypto.randomUUID()): EvidenceAttempt {
  const attempt: EvidenceAttempt = { schemaVersion: 1, attemptId: uuid(), ...draft };
  if (!validAttempt(attempt)) throw new Error('Invalid curriculum evidence attempt.');
  return attempt;
}

export function parseEvidenceQueue(raw: string | null): EvidenceAttempt[] {
  try {
    const value: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(validAttempt).filter((item, index, all) => all.findIndex(other => other.attemptId === item.attemptId) === index);
  } catch { return []; }
}

export function readEvidenceQueue(learnerId: number | null | undefined, storage: EvidenceStorage = browserStorage()): EvidenceAttempt[] {
  if (!validLearner(learnerId)) return [];
  try { return parseEvidenceQueue(storage.getItem(evidenceQueueKey(learnerId))); } catch { return []; }
}

export function queueEvidenceAttempt(learnerId: number | null | undefined, attempt: EvidenceAttempt, storage: EvidenceStorage = browserStorage()) {
  if (!validLearner(learnerId) || !validAttempt(attempt)) return false;
  try {
    const records = readEvidenceQueue(learnerId, storage);
    if (!records.some(item => item.attemptId === attempt.attemptId)) {
      if (records.length >= MAX_QUEUED_ATTEMPTS) return false;
      storage.setItem(evidenceQueueKey(learnerId), JSON.stringify([...records, attempt]));
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVIDENCE_QUEUED, { detail: learnerId }));
    return true;
  } catch { return false; }
}

export function acknowledgeEvidence(learnerId: number, attemptIds: string[], storage: EvidenceStorage = browserStorage()) {
  const acknowledged = new Set(attemptIds);
  const remaining = readEvidenceQueue(learnerId, storage).filter(item => !acknowledged.has(item.attemptId));
  storage.setItem(evidenceQueueKey(learnerId), JSON.stringify(remaining));
  return remaining;
}

export async function syncEvidenceQueue(learnerId: number | null | undefined, token: string | null, options: {
  storage?: EvidenceStorage; fetcher?: FetchLike; api?: string;
} = {}) {
  if (!validLearner(learnerId) || !token) return { sent: 0, acknowledged: 0, remaining: 0 };
  const storage = options.storage ?? browserStorage();
  const batch = readEvidenceQueue(learnerId, storage).slice(0, 100);
  if (!batch.length) return { sent: 0, acknowledged: 0, remaining: 0 };
  const response = await (options.fetcher ?? fetch)(`${options.api ?? API}/evidence/me/attempts/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemaVersion: 1, attempts: batch }),
  });
  const data = await response.json().catch(() => ({})) as { accepted?: string[]; alreadySynced?: string[]; message?: string };
  if (!response.ok) throw new Error(data.message || 'Evidence sync failed.');
  const sentIds = new Set(batch.map(item => item.attemptId));
  const acknowledged = [...(data.accepted ?? []), ...(data.alreadySynced ?? [])].filter(id => sentIds.has(id));
  const remaining = acknowledgeEvidence(learnerId, acknowledged, storage).length;
  if (acknowledged.length && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVIDENCE_SYNCED, { detail: learnerId }));
  return { sent: batch.length, acknowledged: new Set(acknowledged).size, remaining };
}

