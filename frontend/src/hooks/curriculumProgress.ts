export type EvidenceClass = 'not_assessed' | 'practiced' | 'completed_with_help' | 'independent_candidate';
export type AttemptResult = 'correct' | 'incorrect' | 'unclear' | 'unavailable' | 'no_response';

export interface CurriculumSkillSummary {
  curriculumVersion: string;
  skillId: string;
  attemptCount: number;
  correctCount: number;
  helpedCount: number;
  independentCandidateCount: number;
  delayedReviewCount: number;
  delayedReviewCorrectCount: number;
  bestEvidenceClass: EvidenceClass;
  latestResult: AttemptResult;
  latestMode: string;
  latestActivityId: string;
  latestAt: string;
  latestReviewResult: AttemptResult | null;
  latestReviewAt: string | null;
}

export interface CurriculumSummaryResponse {
  schemaVersion: 1;
  skills: CurriculumSkillSummary[];
  generatedAt: string;
}

export const CAMP_SKILLS = [
  { id: 'eng01.sound.discriminate', group: 'Listening', title: 'Tell sounds apart', detail: 'Notice when the three Camp sounds are different.' },
  { id: 'eng01.letter.m', group: 'Letters', title: 'Sound and letter m', detail: 'Connect the approved humming sound with m.' },
  { id: 'eng01.letter.a', group: 'Letters', title: 'Sound and letter a', detail: 'Connect the approved short-a sound with a.' },
  { id: 'eng01.letter.t', group: 'Letters', title: 'Sound and letter t', detail: 'Connect the approved quick ending sound with t.' },
  { id: 'eng01.blend.am', group: 'Blending', title: 'Blend am', detail: 'Join a and m smoothly.' },
  { id: 'eng01.blend.at', group: 'Blending', title: 'Blend at', detail: 'Join a and t smoothly.' },
  { id: 'eng01.decode.mat', group: 'Words', title: 'Build and decode mat', detail: 'Use all three sounds to make the word.' },
  { id: 'eng01.meaning.mat', group: 'Meaning', title: 'Understand mat', detail: 'Connect the word with its familiar meaning.' },
] as const;

const CLASSES: EvidenceClass[] = ['not_assessed', 'practiced', 'completed_with_help', 'independent_candidate'];
const RESULTS: AttemptResult[] = ['correct', 'incorrect', 'unclear', 'unavailable', 'no_response'];
const MODES = ['teaching', 'practice', 'guided', 'adventure', 'independent_check', 'delayed_review'];
const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;

function wholeNumber(value: unknown): number | null {
  const parsed = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
  return typeof parsed === 'number' && Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function parseCurriculumSummary(value: unknown): CurriculumSummaryResponse | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const payload = value as Record<string, unknown>;
  if (payload.schemaVersion !== 1 || typeof payload.generatedAt !== 'string' || !Number.isFinite(Date.parse(payload.generatedAt)) || !Array.isArray(payload.skills)) return null;
  const skills: CurriculumSkillSummary[] = [];
  for (const raw of payload.skills) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const row = raw as Record<string, unknown>;
    const attemptCount = wholeNumber(row.attempt_count);
    const correctCount = wholeNumber(row.correct_count);
    const helpedCount = wholeNumber(row.helped_count);
    const independentCandidateCount = wholeNumber(row.independent_candidate_count);
    const delayedReviewCount = wholeNumber(row.delayed_review_count);
    const delayedReviewCorrectCount = wholeNumber(row.delayed_review_correct_count);
    if (typeof row.curriculum_version !== 'string' || !IDENTIFIER.test(row.curriculum_version) ||
      typeof row.skill_id !== 'string' || !IDENTIFIER.test(row.skill_id) ||
      attemptCount === null || correctCount === null || helpedCount === null || independentCandidateCount === null || delayedReviewCount === null || delayedReviewCorrectCount === null ||
      !CLASSES.includes(row.best_evidence_class as EvidenceClass) || !RESULTS.includes(row.latest_result as AttemptResult) ||
      typeof row.latest_mode !== 'string' || !MODES.includes(row.latest_mode) ||
      typeof row.latest_activity_id !== 'string' || !IDENTIFIER.test(row.latest_activity_id) ||
      typeof row.latest_at !== 'string' || !Number.isFinite(Date.parse(row.latest_at)) ||
      !(row.latest_review_result === null || RESULTS.includes(row.latest_review_result as AttemptResult)) ||
      !(row.latest_review_at === null || typeof row.latest_review_at === 'string' && Number.isFinite(Date.parse(row.latest_review_at)))) return null;
    skills.push({
      curriculumVersion: row.curriculum_version,
      skillId: row.skill_id,
      attemptCount,
      correctCount,
      helpedCount,
      independentCandidateCount,
      delayedReviewCount,
      delayedReviewCorrectCount,
      bestEvidenceClass: row.best_evidence_class as EvidenceClass,
      latestResult: row.latest_result as AttemptResult,
      latestMode: row.latest_mode,
      latestActivityId: row.latest_activity_id,
      latestAt: row.latest_at,
      latestReviewResult: row.latest_review_result as AttemptResult | null,
      latestReviewAt: row.latest_review_at as string | null,
    });
  }
  return { schemaVersion: 1, skills, generatedAt: payload.generatedAt };
}

export function summarizeCurriculumSkills(skills: CurriculumSkillSummary[]) {
  return {
    withEvidence: new Set(skills.map((skill) => skill.skillId)).size,
    independentlyChecked: skills.filter((skill) => skill.independentCandidateCount > 0).length,
    reviewedLater: skills.filter((skill) => skill.delayedReviewCount > 0).length,
    completedWithHelp: skills.filter((skill) => skill.independentCandidateCount === 0 && skill.bestEvidenceClass === 'completed_with_help').length,
    latestNeedsPractice: skills.filter((skill) => skill.latestResult === 'incorrect').length,
  };
}

export function evidenceLabel(evidenceClass: EvidenceClass) {
  if (evidenceClass === 'independent_candidate') return 'Independent check recorded';
  if (evidenceClass === 'completed_with_help') return 'Completed with help';
  if (evidenceClass === 'practiced') return 'Practiced';
  return 'Not assessed';
}
