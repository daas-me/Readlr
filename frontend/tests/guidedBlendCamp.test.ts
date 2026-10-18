import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acceptGuidedTile,
  createGuidedBlendEvidence,
  GUIDED_BLEND_LESSONS,
  resolveGuidedLessonMedia,
  verifyGuidedMedia,
} from '../src/app/components/learningCampCurriculum.ts';

const UUIDS = {
  attempt: '11111111-1111-4111-8111-111111111111',
  session: '22222222-2222-4222-8222-222222222222',
};

test('guided blending follows am, at, mat with exact approved media roles', () => {
  assert.deepEqual(GUIDED_BLEND_LESSONS.map((lesson) => lesson.word), ['am', 'at', 'mat']);
  assert.deepEqual(GUIDED_BLEND_LESSONS.map((lesson) => lesson.activityId), ['ENG01-MAT-B01', 'ENG01-MAT-B02', 'ENG01-MAT-B03']);
  for (const lesson of GUIDED_BLEND_LESSONS) {
    assert.equal(lesson.media.filter((asset) => asset.kind === 'audio').length, 3);
    assert.deepEqual(lesson.media.filter((asset) => asset.kind === 'audio').map((asset) => asset.label), ['Sound by sound', 'Slide together', 'Whole word']);
  }
  assert.equal(GUIDED_BLEND_LESSONS[2].media.some((asset) => asset.assetId === 'media.eng01.mat.meaning-image.v1'), true);
});

test('tile construction accepts only the next reading-order letter', () => {
  assert.deepEqual(acceptGuidedTile(['m', 'a', 't'], [], 'a'), { correct: false, placed: [] });
  assert.deepEqual(acceptGuidedTile(['m', 'a', 't'], [], 'm'), { correct: true, placed: ['m'] });
  assert.deepEqual(acceptGuidedTile(['m', 'a', 't'], ['m'], 'a'), { correct: true, placed: ['m', 'a'] });
});

test('guided attempts disclose model and answer exposure and cannot look independent', () => {
  const lesson = resolveGuidedLessonMedia(GUIDED_BLEND_LESSONS[2], 'readlr2-eng01-mat-media-v1');
  const attempt = createGuidedBlendEvidence({
    lesson,
    sessionId: UUIDS.session,
    curriculumVersion: 'readlr2-eng01-mat-v1',
    mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
    hintCount: 1,
    startedAt: '2026-10-13T01:00:00.000Z',
    completedAt: '2026-10-13T01:00:10.000Z',
    capturedOffline: false,
  }, () => UUIDS.attempt);
  assert.equal(attempt.mode, 'guided');
  assert.equal(attempt.modelExposed, true);
  assert.equal(attempt.answerExposed, true);
  assert.equal(attempt.hintCount, 1);
  assert.equal(attempt.responseType, 'construction');
  assert.deepEqual(attempt.mediaAssetIds, lesson.media.map((asset) => asset.assetId));
});

test('runtime paths use the released manifest version rather than a mutable folder', () => {
  const lesson = resolveGuidedLessonMedia(GUIDED_BLEND_LESSONS[0], 'approved-media-7');
  assert.equal(lesson.media.every((asset) => asset.url.includes('/approved-media-7/')), true);
  assert.equal(GUIDED_BLEND_LESSONS[0].media.every((asset) => asset.url.includes('{manifest}')), true);
});

test('media verification fails closed for missing and wrong content types', async () => {
  const lesson = resolveGuidedLessonMedia(GUIDED_BLEND_LESSONS[0], 'approved-media-7');
  const good = await verifyGuidedMedia(lesson, async () => new Response('audio', { status: 200, headers: { 'Content-Type': 'audio/wav' } }));
  assert.equal(good, true);
  const htmlFallback = await verifyGuidedMedia(lesson, async () => new Response('<html/>', { status: 200, headers: { 'Content-Type': 'text/html' } }));
  assert.equal(htmlFallback, false);
  const missing = await verifyGuidedMedia(lesson, async () => new Response('', { status: 404 }));
  assert.equal(missing, false);
});
