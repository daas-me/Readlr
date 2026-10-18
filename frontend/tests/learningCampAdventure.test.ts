import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMP_ADVENTURE,
  createAdventureEvidence,
  placeAdventureTile,
  resolveAdventureMedia,
  verifyAdventureMedia,
} from '../src/app/components/learningCampAdventure.ts';

const UUIDS = {
  attempt: '11111111-1111-4111-8111-111111111111',
  session: '22222222-2222-4222-8222-222222222222',
};

test('adventure uses the approved mat activity and picture clue', () => {
  assert.equal(CAMP_ADVENTURE.activityId, 'ENG01-MAT-A01');
  assert.deepEqual(CAMP_ADVENTURE.letters, ['m', 'a', 't']);
  assert.equal(CAMP_ADVENTURE.meaningAsset.assetId, 'media.eng01.mat.meaning-image.v1');
});

test('adventure bridge accepts only the next reading-order letter', () => {
  assert.deepEqual(placeAdventureTile([], 'a'), { correct: false, placed: [] });
  assert.deepEqual(placeAdventureTile([], 'm'), { correct: true, placed: ['m'] });
  assert.deepEqual(placeAdventureTile(['m'], 'a'), { correct: true, placed: ['m', 'a'] });
  assert.deepEqual(placeAdventureTile(['m', 'a'], 't'), { correct: true, placed: ['m', 'a', 't'] });
});

test('adventure evidence stays separate from independent assessment', () => {
  const attempt = createAdventureEvidence({
    sessionId: UUIDS.session,
    curriculumVersion: 'readlr2-eng01-mat-v1',
    mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
    hintCount: 0,
    startedAt: '2026-10-13T01:00:00.000Z',
    completedAt: '2026-10-13T01:00:10.000Z',
    capturedOffline: false,
  }, () => UUIDS.attempt);

  assert.equal(attempt.mode, 'adventure');
  assert.equal(attempt.responseType, 'construction');
  assert.equal(attempt.modelExposed, false);
  assert.equal(attempt.answerExposed, false);
  assert.equal(attempt.reducedChoices, true);
  assert.deepEqual(attempt.mediaAssetIds, ['media.eng01.mat.meaning-image.v1']);
});

test('using a hint is disclosed as answer exposure', () => {
  const attempt = createAdventureEvidence({
    sessionId: UUIDS.session,
    curriculumVersion: 'readlr2-eng01-mat-v1',
    mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
    hintCount: 1,
    startedAt: '2026-10-13T01:00:00.000Z',
    completedAt: '2026-10-13T01:00:10.000Z',
    capturedOffline: false,
  }, () => UUIDS.attempt);
  assert.equal(attempt.answerExposed, true);
});

test('adventure media is immutable and fails closed for wrong content', async () => {
  const resolved = resolveAdventureMedia('approved-media-8');
  assert.equal(resolved.meaningAsset.url.includes('/approved-media-8/'), true);
  assert.equal(await verifyAdventureMedia('approved-media-8', async () => new Response('image', { status: 200, headers: { 'Content-Type': 'image/webp' } })), true);
  assert.equal(await verifyAdventureMedia('approved-media-8', async () => new Response('<html/>', { status: 200, headers: { 'Content-Type': 'text/html' } })), false);
});
