import test from 'node:test';
import assert from 'node:assert/strict';
import { ReadingServiceError, devicePracticeNotice } from '../src/hooks/readingProgressError.ts';

test('release denial is not misreported as unavailable storage', () => {
  const notice = devicePracticeNotice(new ReadingServiceError(403, 'This reading journey is not released for your account.'));
  assert.match(notice, /not released for your account/);
  assert.match(notice, /only in this browser/);
  assert.doesNotMatch(notice, /storage is unavailable/);
});
test('old backends and network failures have distinct explanations', () => {
  assert.match(devicePracticeNotice(new ReadingServiceError(404, 'Not found')), /backend needs/);
  assert.match(devicePracticeNotice(new TypeError('Failed to fetch')), /could not be reached/);
  assert.match(devicePracticeNotice(new ReadingServiceError(503, 'Unavailable')), /could not complete/);
});
