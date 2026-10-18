import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evidenceLabel,
  parseCurriculumSummary,
  summarizeCurriculumSkills,
  type CurriculumSkillSummary,
} from '../src/hooks/curriculumProgress.ts';

const serverRow = {
  curriculum_version: 'readlr2-eng01-mat-v1',
  skill_id: 'eng01.letter.m',
  attempt_count: '3',
  correct_count: 2,
  helped_count: 1,
  independent_candidate_count: 1,
  delayed_review_count: 1,
  delayed_review_correct_count: 1,
  best_evidence_class: 'independent_candidate',
  latest_result: 'correct',
  latest_mode: 'independent_check',
  latest_activity_id: 'ENG01-MAT-I01',
  latest_at: '2026-10-13T03:18:00.000Z',
  latest_review_result: 'correct',
  latest_review_at: '2026-10-13T03:18:00.000Z',
};

test('curriculum summary parses server rows and normalizes bigint strings', () => {
  const parsed = parseCurriculumSummary({ schemaVersion: 1, skills: [serverRow], generatedAt: '2026-10-13T03:20:00.000Z' });
  assert.equal(parsed?.skills[0].attemptCount, 3);
  assert.equal(parsed?.skills[0].bestEvidenceClass, 'independent_candidate');
});

test('curriculum summary rejects invented mastery states and malformed counts', () => {
  assert.equal(parseCurriculumSummary({ schemaVersion: 1, skills: [{ ...serverRow, best_evidence_class: 'mastered' }], generatedAt: '2026-10-13T03:20:00.000Z' }), null);
  assert.equal(parseCurriculumSummary({ schemaVersion: 1, skills: [{ ...serverRow, attempt_count: '-1' }], generatedAt: '2026-10-13T03:20:00.000Z' }), null);
});

test('progress summary keeps help, independent checks and latest errors distinct', () => {
  const base: CurriculumSkillSummary = {
    curriculumVersion: 'v1', skillId: 'eng01.letter.m', attemptCount: 2, correctCount: 1,
    helpedCount: 1, independentCandidateCount: 1, delayedReviewCount: 1, delayedReviewCorrectCount: 1, bestEvidenceClass: 'independent_candidate',
    latestResult: 'correct', latestMode: 'independent_check', latestActivityId: 'I01', latestAt: '2026-10-13T03:18:00.000Z', latestReviewResult: 'correct', latestReviewAt: '2026-10-13T03:18:00.000Z',
  };
  assert.deepEqual(summarizeCurriculumSkills([
    base,
    { ...base, skillId: 'eng01.letter.a', independentCandidateCount: 0, bestEvidenceClass: 'completed_with_help', latestResult: 'incorrect' },
  ]), { withEvidence: 2, independentlyChecked: 1, reviewedLater: 2, completedWithHelp: 1, latestNeedsPractice: 1 });
});

test('independent evidence is described as a recorded check, not mastery', () => {
  assert.equal(evidenceLabel('independent_candidate'), 'Independent check recorded');
  assert.doesNotMatch(evidenceLabel('independent_candidate'), /master/i);
});
