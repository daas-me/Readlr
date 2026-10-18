import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hasVoiceSignal } from '../src/app/components/stageTwoContent.ts';

const source = (file: string) => readFileSync(new URL(`../src/app/components/${file}`, import.meta.url), 'utf8');

test('voice energy gating distinguishes silence without claiming pronunciation', () => {
  assert.equal(hasVoiceSignal(.017, 20, 5000), false);
  assert.equal(hasVoiceSignal(.03, 4, 5000), false);
  assert.equal(hasVoiceSignal(.03, 10, 128), false);
  assert.equal(hasVoiceSignal(.03, 10, 5000), true);
});

test('Stage 1 applies the voice gate before completing guided practice', () => {
  const game = source('GameLevel.tsx');
  assert.match(game, /hasVoiceSignal\(stageOnePeakRef\.current, stageOneVoicedFramesRef\.current, blob\.size\)/);
  assert.match(game, /practice\.finish\(voiceDetected \? "voice_detected" : "silence"\)/);
});

test('guided Stage 1 and Stage 2 outcomes are labeled as unscored practice', () => {
  assert.match(source('VowelChallengeView.tsx'), /Practice complete\. Pronunciation was not scored\./);
  assert.match(source('BridgePractice.tsx'), /Guided practice complete\. Pronunciation was not scored\./);
  assert.doesNotMatch(source('BridgePractice.tsx'), /said .* correctly/i);
});
