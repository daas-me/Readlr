import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DISCOVERY_PLACES, DISCOVERY_STORY_PAGES, addLetterToAt, discoveryMayAffectMastery, isDiscoveryTrailChoice } from '../src/app/components/discoveryRealm.ts';

test('Discovery Realm provides five optional reading modes', () => {
  assert.deepEqual(DISCOVERY_PLACES.map((place) => place.id), ['library', 'puzzles', 'garden', 'trail', 'review']);
  assert.equal(new Set(DISCOVERY_PLACES.map((place) => place.title)).size, 5);
});

test('prototype interactions are deterministic and cannot change mastery', () => {
  assert.equal(addLetterToAt('m'), 'mat');
  assert.equal(addLetterToAt('t'), null);
  assert.equal(isDiscoveryTrailChoice('mat'), true);
  assert.equal(isDiscoveryTrailChoice('at'), false);
  assert.equal(discoveryMayAffectMastery(), false);
});

test('storybook is a real multi-page interaction without a streak mechanic', () => {
  const source = readFileSync(new URL('../src/app/components/DiscoveryRealmView.tsx', import.meta.url), 'utf8');
  assert.ok(DISCOVERY_STORY_PAGES.length >= 3);
  assert.match(source, /Previous story page/);
  assert.match(source, /Next story page/);
  assert.doesNotMatch(source, /streak|daily reward|lost reward/i);
  for (const forbidden of ['queueEvidenceAttempt', 'createEvidenceAttempt', 'setProgress']) assert.equal(source.includes(forbidden), false);
});
