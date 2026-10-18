import test from 'node:test';
import assert from 'node:assert/strict';
import { isLearningCampAccess, learningCampBuildEnabled } from '../src/hooks/learningCampAccess.ts';

test('Learning Camp frontend flag is explicit and defaults off', () => {
  assert.equal(learningCampBuildEnabled(undefined), false);
  assert.equal(learningCampBuildEnabled('false'), false);
  assert.equal(learningCampBuildEnabled('TRUE'), true);
});

test('Learning Camp access responses require the exact first group contract', () => {
  const valid = {
    enabled: true,
    curriculumVersion: 'readlr2-eng01-mat-v1',
    mediaManifestVersion: 'readlr2-eng01-mat-media-v1',
    group: { id: 'ENG-01', graphemes: ['m', 'a', 't'] },
  };
  assert.equal(isLearningCampAccess(valid), true);
  assert.equal(isLearningCampAccess({ ...valid, enabled: false }), false);
  assert.equal(isLearningCampAccess({ ...valid, group: { id: 'ENG-01', graphemes: ['m', 'e', 't'] } }), false);
});
