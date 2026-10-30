import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Normalize CRLF so the phase-boundary markers below also match on Windows checkouts.
const source = (name: string) => readFileSync(new URL(`../src/app/components/${name}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('Milo guidance exposes replay and a specified dismiss control', () => {
  const coach = source('MiloCoach.tsx');
  assert.match(coach, /Hear Milo/);
  assert.match(coach, /aria-label="Dismiss Milo's explanation"/);
  assert.match(coach, /if \(engaged \|\| dismissedCue === cue\) return null/);
  assert.match(coach, /speechSynthesis\?\.cancel/);
});

test('independent and delayed checks show guidance only outside active answers', () => {
  const check = source('CampIndependentCheck.tsx');
  const review = source('CampDelayedReview.tsx');
  assert.equal((check.match(/<MiloCoach/g) ?? []).length, 2);
  assert.equal((review.match(/<MiloCoach/g) ?? []).length, 2);
  for (const marker of ["phase === 'sound'", "phase === 'word-audio'", "phase === 'word-build'"]) {
    const checkStart = check.indexOf(`\n          {${marker}`, check.indexOf('return ('));
    const checkEnd = check.indexOf("\n\n          {phase ===", checkStart + marker.length);
    if (checkStart >= 0) assert.doesNotMatch(check.slice(checkStart, checkEnd < 0 ? check.length : checkEnd), /<MiloCoach/);
    const reviewStart = review.indexOf(`\n        {${marker}`, review.indexOf('return <main'));
    const reviewEnd = review.indexOf("\n        {phase ===", reviewStart + marker.length);
    if (reviewStart >= 0) assert.doesNotMatch(review.slice(reviewStart, reviewEnd < 0 ? review.length : reviewEnd), /<MiloCoach/);
  }
});

test('guided and adventure errors can request help without changing scores', () => {
  for (const name of ['GuidedBlendCamp.tsx', 'CampBridgeAdventure.tsx']) {
    const component = source(name);
    assert.match(component, /hintCount >= 2 \? 'repeated_error'/);
    assert.match(component, /hintCount === 1 \? 'first_error'/);
  }
  const coach = source('MiloCoach.tsx');
  for (const forbidden of ['queueEvidenceAttempt', 'setRecorded', 'setProgress', 'evidenceClass', 'mastery']) assert.equal(coach.includes(forbidden), false);
});
