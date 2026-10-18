import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createMeaningCheckEvidence,
  createSoundCheckEvidence,
  createWordConstructionEvidence,
  resolveIndependentMedia,
  shuffleItems,
  SOUND_CHECK_ITEMS,
  verifyIndependentMedia,
} from '../src/app/components/learningCampIndependent.ts';

const UUIDS = {
  attempt: '11111111-1111-4111-8111-111111111111',
  session: '22222222-2222-4222-8222-222222222222',
};

const context = {
  sessionId: UUIDS.session,
  curriculumVersion: 'readlr2-eng01-mat-v1',
  mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
  startedAt: '2026-10-13T01:00:00.000Z',
  completedAt: '2026-10-13T01:00:10.000Z',
  capturedOffline: false,
};

test('sound check covers each approved correspondence once', () => {
  assert.deepEqual(SOUND_CHECK_ITEMS.map((item) => item.letter).sort(), ['a', 'm', 't']);
  assert.equal(new Set(SOUND_CHECK_ITEMS.map((item) => item.skillId)).size, 3);
  assert.equal(SOUND_CHECK_ITEMS.every((item) => item.activityId === 'ENG01-MAT-I01'), true);
});

test('assessment order uses an injected shuffle without changing the source', () => {
  const original = ['m', 'a', 't'] as const;
  assert.deepEqual(shuffleItems(original, () => 0), ['a', 't', 'm']);
  assert.deepEqual(original, ['m', 'a', 't']);
});

test('unprompted correct sound selection is an independent candidate input', () => {
  const attempt = createSoundCheckEvidence({ ...context, item: SOUND_CHECK_ITEMS[0], response: 'm' }, () => UUIDS.attempt);
  assert.equal(attempt.mode, 'independent_check');
  assert.equal(attempt.result, 'correct');
  assert.equal(attempt.modelExposed, false);
  assert.equal(attempt.answerExposed, false);
  assert.equal(attempt.reducedChoices, false);
  assert.deepEqual(attempt.mediaAssetIds, ['media.eng01.m.phoneme.v1']);
});

test('wrong selection remains raw incorrect evidence and does not reveal the answer', () => {
  const attempt = createSoundCheckEvidence({ ...context, item: SOUND_CHECK_ITEMS[0], response: 'a' }, () => UUIDS.attempt);
  assert.equal(attempt.result, 'incorrect');
  assert.equal(attempt.responseValue, 'a');
  assert.equal(attempt.answerExposed, false);
});

test('dictated construction and meaning are stored as separate evidence', () => {
  const construction = createWordConstructionEvidence({ ...context, response: 'mat', result: 'correct' }, () => UUIDS.attempt);
  const meaning = createMeaningCheckEvidence({ ...context, response: 'yes' }, () => UUIDS.attempt);
  assert.equal(construction.skillId, 'eng01.decode.mat');
  assert.equal(construction.responseType, 'construction');
  assert.equal(construction.reducedChoices, false);
  assert.deepEqual(construction.mediaAssetIds, ['media.eng01.mat.word.v1']);
  assert.equal(meaning.skillId, 'eng01.meaning.mat');
  assert.equal(meaning.responseType, 'selection');
  assert.equal(meaning.answerExposed, true);
  assert.equal(meaning.reducedChoices, true);
  assert.deepEqual(meaning.mediaAssetIds, ['media.eng01.mat.meaning-image.v1']);
});

test('independent media uses immutable paths and fails closed', async () => {
  const resolved = resolveIndependentMedia('approved-media-10');
  assert.equal(resolved.soundItems.every((item) => item.url.includes('/approved-media-10/')), true);
  assert.equal(resolved.wordAudio.url.includes('/approved-media-10/'), true);
  const responses = ['audio/wav', 'audio/wav', 'audio/wav', 'audio/wav', 'image/webp'];
  let index = 0;
  assert.equal(await verifyIndependentMedia('approved-media-10', async () => new Response('asset', { status: 200, headers: { 'Content-Type': responses[index++] } })), true);
  assert.equal(await verifyIndependentMedia('approved-media-10', async () => new Response('<html/>', { status: 200, headers: { 'Content-Type': 'text/html' } })), false);
});
