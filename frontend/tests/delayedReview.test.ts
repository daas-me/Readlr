import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDelayedSoundEvidence,
  createDelayedWordEvidence,
  parseDelayedReviewStatus,
  verifyDelayedReviewMedia,
} from '../src/hooks/delayedReview.ts';
import { SOUND_CHECK_ITEMS } from '../src/app/components/learningCampIndependent.ts';

const context = {
  sessionId: '11111111-1111-4111-8111-111111111111',
  curriculumVersion: 'readlr2-eng01-mat-v1',
  mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
  startedAt: '2026-10-13T01:00:00.000Z',
  completedAt: '2026-10-13T01:00:03.000Z',
  capturedOffline: false,
};

test('delayed review status accepts server bigint strings and preserves due dates', () => {
  assert.deepEqual(parseDelayedReviewStatus({
    schemaVersion: 1, review_status: 'waiting', independent_completed_at: '2026-10-13T01:00:00.000Z',
    due_at: '2026-10-14T01:00:00.000Z', latest_review_at: null, review_count: '0', interval_days: 1,
  }), {
    status: 'waiting', independentCompletedAt: '2026-10-13T01:00:00.000Z', dueAt: '2026-10-14T01:00:00.000Z',
    latestReviewAt: null, reviewCount: 0, intervalDays: 1,
  });
  assert.equal(parseDelayedReviewStatus({ schemaVersion: 1, review_status: 'mastered' }), null);
});

test('sound and word review attempts are delayed evidence with no disclosed help', () => {
  const sound = createDelayedSoundEvidence({ ...context, item: SOUND_CHECK_ITEMS[0], response: 'm' }, () => '22222222-2222-4222-8222-222222222222');
  const word = createDelayedWordEvidence({ ...context, response: 'mat', status:'matched' }, () => '33333333-3333-4333-8333-333333333333');
  for (const attempt of [sound, word]) {
    assert.equal(attempt.mode, 'delayed_review');
    assert.equal(attempt.activityId, 'ENG01-MAT-R01');
    assert.equal(attempt.result, 'correct');
    assert.equal(attempt.modelExposed, false);
    assert.equal(attempt.answerExposed, false);
    assert.equal(attempt.hintCount, 0);
  }
  assert.equal(word.responseType,'speech_prediction');
});

test('an incorrect delayed answer stays incorrect instead of being replaced by practice', () => {
  const sound = createDelayedSoundEvidence({ ...context, item: SOUND_CHECK_ITEMS[0], response: 'a' }, () => '44444444-4444-4444-8444-444444444444');
  const word = createDelayedWordEvidence({ ...context, response: 'tam' }, () => '55555555-5555-4555-8555-555555555555');
  assert.equal(sound.result, 'incorrect');
  assert.equal(word.result, 'incorrect');
});

test('delayed review verifies only approved sound audio because the final word is read independently', async () => {
  const requested: string[] = [];
  const available = await verifyDelayedReviewMedia('manifest-v1', async (input) => {
    requested.push(String(input));
    return new Response('', { status: 200, headers: { 'Content-Type': 'audio/wav' } });
  });
  assert.equal(available, true);
  assert.equal(requested.length, 3);
  assert.equal(requested.some((url) => url.includes('meaning')), false);
});
