import { createHash } from 'node:crypto';
import {
  ACTIVITY_MODES, ATTEMPT_RESULTS, RESPONSE_TYPES,
  type ClientEvidenceAttempt, type EvidenceClass, type EvidenceRow,
} from './evidence.types.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const RESPONSE = /^[A-Za-z0-9 .'-]{1,64}$/;
const MAX_BATCH = 100;
const MAX_DURATION_MS = 2 * 60 * 60 * 1000;
const EARLIEST = Date.parse('2020-01-01T00:00:00.000Z');
const ALLOWED_KEYS = new Set([
  'schemaVersion', 'attemptId', 'sessionId', 'curriculumVersion', 'mediaManifestVersion',
  'activityId', 'skillId', 'contentId', 'mode', 'responseType', 'responseValue', 'result',
  'hintCount', 'modelExposed', 'answerExposed', 'reducedChoices', 'mediaAssetIds',
  'startedAt', 'completedAt', 'capturedOffline',
]);

export class EvidenceValidationError extends Error {}

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === 'string' && options.includes(value as T[number]);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function deriveEvidenceClass(attempt: ClientEvidenceAttempt): EvidenceClass {
  if (attempt.result === 'unavailable' || attempt.result === 'unclear' || attempt.result === 'no_response') return 'not_assessed';
  if (attempt.result !== 'correct') return 'practiced';
  const assisted = attempt.hintCount > 0 || attempt.modelExposed || attempt.answerExposed || attempt.reducedChoices;
  if (assisted || attempt.mode === 'guided' || attempt.mode === 'adventure') return 'completed_with_help';
  if (attempt.mode === 'independent_check' || attempt.mode === 'delayed_review') return 'independent_candidate';
  return 'practiced';
}

export function parseEvidenceBatch(input: unknown, now = Date.now()): ClientEvidenceAttempt[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new EvidenceValidationError('Request body must be an object.');
  const body = input as Record<string, unknown>;
  if (body.schemaVersion !== 1 || !Array.isArray(body.attempts) || body.attempts.length < 1 || body.attempts.length > MAX_BATCH) {
    throw new EvidenceValidationError(`schemaVersion 1 and 1-${MAX_BATCH} attempts are required.`);
  }
  const seen = new Set<string>();
  return body.attempts.map((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new EvidenceValidationError(`Attempt ${index + 1} must be an object.`);
    const item = value as Record<string, unknown>;
    const unexpected = Object.keys(item).filter(key => !ALLOWED_KEYS.has(key));
    if (unexpected.length) throw new EvidenceValidationError(`Attempt ${index + 1} has unsupported fields: ${unexpected.join(', ')}.`);
    if (item.schemaVersion !== 1 || typeof item.attemptId !== 'string' || !UUID.test(item.attemptId) || typeof item.sessionId !== 'string' || !UUID.test(item.sessionId)) {
      throw new EvidenceValidationError(`Attempt ${index + 1} has invalid version or identifiers.`);
    }
    if (seen.has(item.attemptId)) throw new EvidenceValidationError(`Duplicate attemptId in batch: ${item.attemptId}.`);
    seen.add(item.attemptId);
    for (const key of ['curriculumVersion', 'mediaManifestVersion', 'activityId', 'skillId', 'contentId'] as const) {
      if (typeof item[key] !== 'string' || !IDENTIFIER.test(item[key])) throw new EvidenceValidationError(`Attempt ${index + 1} has invalid ${key}.`);
    }
    if (!isOneOf(item.mode, ACTIVITY_MODES) || !isOneOf(item.responseType, RESPONSE_TYPES) || !isOneOf(item.result, ATTEMPT_RESULTS)) {
      throw new EvidenceValidationError(`Attempt ${index + 1} has an unsupported mode, response type, or result.`);
    }
    if (item.responseValue !== null && (typeof item.responseValue !== 'string' || !RESPONSE.test(item.responseValue))) {
      throw new EvidenceValidationError(`Attempt ${index + 1} has an invalid responseValue.`);
    }
    if (!Number.isInteger(item.hintCount) || Number(item.hintCount) < 0 || Number(item.hintCount) > 20 ||
      typeof item.modelExposed !== 'boolean' || typeof item.answerExposed !== 'boolean' || typeof item.reducedChoices !== 'boolean' || typeof item.capturedOffline !== 'boolean') {
      throw new EvidenceValidationError(`Attempt ${index + 1} has invalid assistance metadata.`);
    }
    if (!Array.isArray(item.mediaAssetIds) || item.mediaAssetIds.length > 20 ||
      item.mediaAssetIds.some(id => typeof id !== 'string' || !IDENTIFIER.test(id)) || new Set(item.mediaAssetIds).size !== item.mediaAssetIds.length) {
      throw new EvidenceValidationError(`Attempt ${index + 1} has invalid mediaAssetIds.`);
    }
    if (!validDate(item.startedAt) || !validDate(item.completedAt)) throw new EvidenceValidationError(`Attempt ${index + 1} has invalid timestamps.`);
    const started = Date.parse(item.startedAt), completed = Date.parse(item.completedAt);
    if (started < EARLIEST || completed < started || completed - started > MAX_DURATION_MS || completed > now + 5 * 60 * 1000) {
      throw new EvidenceValidationError(`Attempt ${index + 1} has an invalid time range.`);
    }
    return item as unknown as ClientEvidenceAttempt;
  });
}

export function evidenceRow(learnerId: number, attempt: ClientEvidenceAttempt): EvidenceRow {
  const withoutHash = {
    learner_id: learnerId,
    client_attempt_id: attempt.attemptId,
    session_id: attempt.sessionId,
    schema_version: 1 as const,
    curriculum_version: attempt.curriculumVersion,
    media_manifest_version: attempt.mediaManifestVersion,
    activity_id: attempt.activityId,
    skill_id: attempt.skillId,
    content_id: attempt.contentId,
    activity_mode: attempt.mode,
    response_type: attempt.responseType,
    response_value: attempt.responseValue,
    result: attempt.result,
    evidence_class: deriveEvidenceClass(attempt),
    hint_count: attempt.hintCount,
    model_exposed: attempt.modelExposed,
    answer_exposed: attempt.answerExposed,
    reduced_choices: attempt.reducedChoices,
    media_asset_ids: attempt.mediaAssetIds,
    started_at: new Date(attempt.startedAt).toISOString(),
    completed_at: new Date(attempt.completedAt).toISOString(),
    captured_offline: attempt.capturedOffline,
  };
  return { ...withoutHash, payload_hash: createHash('sha256').update(JSON.stringify(withoutHash)).digest('hex') };
}

