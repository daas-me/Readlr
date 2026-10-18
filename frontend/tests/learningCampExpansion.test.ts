import test from 'node:test';
import assert from 'node:assert/strict';
import { canReleaseCampGroup, completedCampGroupGates, ENG02_CAMP_GROUP } from '../src/app/components/learningCampGroups.ts';

test('Step 13 expands only the next official group and keeps it cumulative', () => {
  assert.equal(ENG02_CAMP_GROUP.id, 'ENG-02');
  assert.deepEqual(ENG02_CAMP_GROUP.graphemes, ['e', 's', 'i', 'l']);
  assert.deepEqual(ENG02_CAMP_GROUP.prerequisites, ['ENG-01']);
  assert.deepEqual(ENG02_CAMP_GROUP.cumulativeGraphemes, ['m', 'a', 't', 'e', 's', 'i', 'l']);
  assert.equal(ENG02_CAMP_GROUP.route.length, 7);
});

test('provisional Group 2 cannot release while any review gate remains open', () => {
  assert.equal(ENG02_CAMP_GROUP.status, 'provisional');
  assert.equal(completedCampGroupGates(ENG02_CAMP_GROUP), 1);
  assert.equal(canReleaseCampGroup(ENG02_CAMP_GROUP), false);
  assert.equal(canReleaseCampGroup({
    ...ENG02_CAMP_GROUP,
    status: 'approved',
    gates: { ...ENG02_CAMP_GROUP.gates, educatorSignoff: true },
  }), false);
});

test('Group 2 candidate words use only cumulative graphemes', () => {
  const allowed = new Set(ENG02_CAMP_GROUP.cumulativeGraphemes);
  for (const word of ENG02_CAMP_GROUP.candidateWords) {
    assert.ok([...word].every((letter) => allowed.has(letter)), `${word} uses an untaught grapheme`);
  }
});
