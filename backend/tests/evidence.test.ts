import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { deriveEvidenceClass, evidenceRow, parseEvidenceBatch } from '../src/modules/evidence/evidence.validation.js';
import type { ClientEvidenceAttempt } from '../src/modules/evidence/evidence.types.js';

const base: ClientEvidenceAttempt = {
  schemaVersion: 1,
  attemptId: '11111111-1111-4111-8111-111111111111',
  sessionId: '22222222-2222-4222-8222-222222222222',
  curriculumVersion: 'readlr2-eng01-mat-draft-1',
  mediaManifestVersion: 'readlr2-eng01-mat-media-draft-1',
  activityId: 'ENG01-MAT-I01', skillId: 'eng01.letter.m', contentId: 'eng01.grapheme.m',
  mode: 'independent_check', responseType: 'selection', responseValue: 'm', result: 'correct', hintCount: 0,
  modelExposed: false, answerExposed: false, reducedChoices: false, mediaAssetIds: ['media.eng01.m.phoneme.v1'],
  startedAt: '2026-10-13T01:00:00.000Z', completedAt: '2026-10-13T01:00:03.000Z', capturedOffline: false,
};

test('server derives evidence context and never accepts assistance as independent', () => {
  assert.equal(deriveEvidenceClass(base), 'independent_candidate');
  assert.equal(deriveEvidenceClass({ ...base, hintCount: 1 }), 'completed_with_help');
  assert.equal(deriveEvidenceClass({ ...base, modelExposed: true }), 'completed_with_help');
  assert.equal(deriveEvidenceClass({ ...base, reducedChoices: true }), 'completed_with_help');
  assert.equal(deriveEvidenceClass({ ...base, mode: 'guided' }), 'completed_with_help');
  assert.equal(deriveEvidenceClass({ ...base, mode: 'adventure' }), 'completed_with_help');
  assert.equal(deriveEvidenceClass({ ...base, mode: 'delayed_review' }), 'independent_candidate');
  assert.equal(deriveEvidenceClass({ ...base, result: 'incorrect' }), 'practiced');
  assert.equal(deriveEvidenceClass({ ...base, result: 'unclear' }), 'not_assessed');
  assert.equal(deriveEvidenceClass({ ...base, result: 'unavailable' }), 'not_assessed');
});

test('delayed review schedule is server-only, learner-scoped and requires a complete prior check', () => {
  const sql = readFileSync(new URL('../supabase/migrations/202610130003_curriculum_delayed_review.sql', import.meta.url), 'utf8');
  const route = readFileSync(new URL('../src/modules/evidence/evidence.route.ts', import.meta.url), 'utf8');
  const service = readFileSync(new URL('../src/modules/evidence/evidence.service.ts', import.meta.url), 'utf8');
  assert.match(sql, /attempt\.learner_id = p_learner/);
  assert.match(sql, /attempt\.curriculum_version = p_curriculum/);
  assert.match(sql, /activity_mode = 'independent_check'/);
  assert.match(sql, /having count\(distinct attempt\.skill_id\) = 4/);
  assert.match(sql, /activity_mode = 'delayed_review'/);
  assert.match(sql, /when review_at is not null and last_review_correct then 3 else 1/);
  assert.match(sql, /revoke all on function public\.get_curriculum_review_status\(bigint, text\) from public, anon, authenticated/);
  assert.match(sql, /grant execute on function public\.get_curriculum_review_status\(bigint, text\) to service_role/);
  assert.match(route, /me\/review-status[^\n]+authMiddleware[^\n]+requireRole\('learner'\)/);
  assert.match(service, /activity_mode === 'delayed_review'/);
  assert.match(service, /review_status !== 'due'/);
  assert.match(service, /row\.activity_id !== 'ENG01-MAT-R01'/);
  assert.doesNotMatch(sql, /mastered|educator_verified/);
});

test('Step 12 upgrades the summary in its own migration instead of rewriting Step 11', () => {
  const step11 = readFileSync(new URL('../supabase/migrations/202610130002_curriculum_evidence_summary.sql', import.meta.url), 'utf8');
  const step12 = readFileSync(new URL('../supabase/migrations/202610130003_curriculum_delayed_review.sql', import.meta.url), 'utf8');
  assert.doesNotMatch(step11, /delayed_review_count|latest_review_result/);
  assert.match(step12, /drop function if exists public\.get_curriculum_evidence_summary\(bigint\)/);
  assert.match(step12, /delayed_review_count/);
  assert.match(step12, /latest_review_result/);
});

test('evidence batches reject ownership, raw voice and client mastery fields', () => {
  for (const injected of [{ learnerId: 8 }, { userId: 8 }, { rawAudio: 'data' }, { transcript: 'mat' }, { evidenceClass: 'educator_verified' }]) {
    assert.throws(() => parseEvidenceBatch({ schemaVersion: 1, attempts: [{ ...base, ...injected }] }, Date.parse('2026-10-13T02:00:00Z')), /unsupported fields/);
  }
});

test('attempt IDs are immutable through deterministic payload hashes', () => {
  const first = evidenceRow(9, base), replay = evidenceRow(9, { ...base }), changed = evidenceRow(9, { ...base, result: 'incorrect' });
  assert.equal(first.payload_hash, replay.payload_hash);
  assert.notEqual(first.payload_hash, changed.payload_hash);
  assert.equal(first.learner_id, 9);
  assert.equal(first.evidence_class, 'independent_candidate');
});

test('timestamps, media identifiers and duplicate IDs are bounded', () => {
  const now = Date.parse('2026-10-13T02:00:00Z');
  assert.throws(() => parseEvidenceBatch({ schemaVersion: 1, attempts: [{ ...base, completedAt: '2027-01-01T00:00:00Z' }] }, now), /time range/);
  assert.throws(() => parseEvidenceBatch({ schemaVersion: 1, attempts: [{ ...base, mediaAssetIds: ['../secret'] }] }, now), /mediaAssetIds/);
  assert.throws(() => parseEvidenceBatch({ schemaVersion: 1, attempts: [base, base] }, now), /Duplicate attemptId/);
});

test('migration is additive, learner-owned, idempotent and contains no raw audio column', () => {
  const sql = readFileSync(new URL('../supabase/migrations/202610130001_curriculum_evidence.sql', import.meta.url), 'utf8');
  assert.match(sql, /learner_id bigint not null references public\.learner_profiles/);
  assert.match(sql, /unique \(learner_id, client_attempt_id\)/);
  assert.match(sql, /references public\.curriculum_releases\(curriculum_version, media_manifest_version\)/);
  assert.match(sql, /status in \('approved','revoked'\)/);
  assert.doesNotMatch(sql, /insert into public\.curriculum_releases/i);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /revoke all on public\.curriculum_attempts from public, anon, authenticated/);
  assert.doesNotMatch(sql, /raw_audio|audio_blob|recording_url/i);
});

test('summary aggregation is server-only, learner-scoped and never awards mastery', () => {
  const sql = readFileSync(new URL('../supabase/migrations/202610130002_curriculum_evidence_summary.sql', import.meta.url), 'utf8');
  const route = readFileSync(new URL('../src/modules/evidence/evidence.route.ts', import.meta.url), 'utf8');
  const service = readFileSync(new URL('../src/modules/evidence/evidence.service.ts', import.meta.url), 'utf8');
  assert.match(sql, /where attempt\.learner_id = p_learner/);
  assert.match(sql, /independent_candidate_count/);
  assert.match(sql, /best_evidence_class/);
  assert.doesNotMatch(sql, /mastered|demonstrated_independently|educator_verified/);
  assert.match(sql, /revoke all on function public\.get_curriculum_evidence_summary\(bigint\) from public, anon, authenticated/);
  assert.match(sql, /grant execute on function public\.get_curriculum_evidence_summary\(bigint\) to service_role/);
  assert.match(route, /me\/summary[^\n]+authMiddleware[^\n]+requireRole\('learner'\)/);
  assert.match(service, /getLearnerByUserId\(userId\)/);
  assert.match(service, /get_curriculum_evidence_summary/);
});

