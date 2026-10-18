import test from 'node:test';
import assert from 'node:assert/strict';
import { canMiloPerform, getMiloGuidance, miloGuidanceSeenKey } from '../src/hooks/miloGuidance.ts';

test('Milo guidance is deterministic, concise and context specific', () => {
  assert.equal(getMiloGuidance('guided_blend', 'intro', 'concise').text, 'Hear it. Then build it.');
  assert.notEqual(getMiloGuidance('guided_blend', 'intro', 'full').text, getMiloGuidance('adventure', 'intro', 'full').text);
  assert.equal(getMiloGuidance('guided_blend', 'repeated_error', 'concise').action, 'play_sound_model');
});

test('Milo can request only bounded curriculum actions', () => {
  for (const action of ['none', 'play_sound_model', 'offer_hint', 'suggest_review'] as const) assert.equal(canMiloPerform(action), true);
  assert.equal(canMiloPerform('change_score' as never), false);
  assert.equal(canMiloPerform('invent_word' as never), false);
});

test('guidance history is learner and activity scoped', () => {
  assert.notEqual(miloGuidanceSeenKey(3, 'guided_blend'), miloGuidanceSeenKey(4, 'guided_blend'));
  assert.notEqual(miloGuidanceSeenKey(3, 'guided_blend'), miloGuidanceSeenKey(3, 'adventure'));
});
