import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { classifyAudioTranscript, normalizeAudioTranscript } from '../src/modules/audio/audio.service.js';

test('legacy transcription matching never treats substrings as the target', () => {
  assert.equal(normalizeAudioTranscript('  MAP!  '), 'map');
  assert.equal(classifyAudioTranscript('map', ['map'], .8), 'matched');
  assert.equal(classifyAudioTranscript('mapping', ['map'], .8), 'different');
  assert.equal(classifyAudioTranscript('a map', ['map'], .8), 'different');
});

test('missing or weak transcription evidence is uncertain', () => {
  assert.equal(classifyAudioTranscript('', ['map'], .9), 'uncertain');
  assert.equal(classifyAudioTranscript('map', ['map'], .34), 'uncertain');
  assert.equal(classifyAudioTranscript('map', ['map'], Number.NaN), 'uncertain');
});

test('the exposed audio service cannot manufacture a passing score', () => {
  const source = readFileSync(new URL('../src/modules/audio/audio.service.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /score:\s*95|Mock response|matched:\s*true/);
  assert.match(source, /throw new AudioAssessmentUnavailableError/);
  assert.match(source, /pronunciationAccuracy:\s*null/);
  assert.match(source, /score:\s*null/);
});
