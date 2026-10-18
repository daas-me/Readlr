import { supabase } from '../../database/db.js';
import { getLearnerByUserId } from '../learner/learner.service.js';
import type { ClientEvidenceAttempt, EvidenceRow } from './evidence.types.js';
import { evidenceRow } from './evidence.validation.js';

export class EvidenceConflictError extends Error {}
export class EvidenceUnavailableError extends Error {}
export class EvidenceContentUnavailableError extends Error {}
export class EvidenceReviewNotDueError extends Error {}

type StoredAttempt = EvidenceRow & { id: number; received_at: string };

async function readStored(learnerId: number, ids: string[]): Promise<StoredAttempt[]> {
  const result = await supabase.from('curriculum_attempts').select('*').eq('learner_id', learnerId).in('client_attempt_id', ids);
  if (result.error) throw new EvidenceUnavailableError(result.error.message);
  return (result.data ?? []) as StoredAttempt[];
}

export async function syncEvidenceAttempts(userId: number, attempts: ClientEvidenceAttempt[]) {
  if(attempts.some(a=>a.curriculumVersion==='readlr-aral-english-1' && (a.mode==='independent_check'||a.mode==='delayed_review')))
    throw new EvidenceContentUnavailableError('Expanded reading checkpoints must be recorded by the server.');
  const learner = await getLearnerByUserId(userId);
  const rows = attempts.map(attempt => evidenceRow(learner.id, attempt));
  const delayed = rows.filter(row => row.activity_mode === 'delayed_review');
  if (delayed.length) {
    const allowedSkills = new Set(['eng01.letter.m', 'eng01.letter.a', 'eng01.letter.t', 'eng01.decode.mat']);
    const versions = [...new Set(delayed.map(row => row.curriculum_version))];
    if (versions.length !== 1 || delayed.some(row => row.activity_id !== 'ENG01-MAT-R01' || !allowedSkills.has(row.skill_id))) {
      throw new EvidenceReviewNotDueError('Delayed review content is not approved.');
    }
    const status = await supabase.rpc('get_curriculum_review_status', { p_learner: learner.id, p_curriculum: versions[0] });
    if (status.error) throw new EvidenceUnavailableError(status.error.message);
    if (status.data?.[0]?.review_status !== 'due') throw new EvidenceReviewNotDueError('Delayed review is not due.');
  }
  const curriculumVersions = [...new Set(rows.map(row => row.curriculum_version))];
  const releasesResult = await supabase.from('curriculum_releases')
    .select('curriculum_version,media_manifest_version,status').in('curriculum_version', curriculumVersions);
  if (releasesResult.error) throw new EvidenceUnavailableError(releasesResult.error.message);
  const releases = new Map((releasesResult.data ?? []).map(row => [`${row.curriculum_version}:${row.media_manifest_version}`, row.status]));
  for (const row of rows) {
    if (releases.get(`${row.curriculum_version}:${row.media_manifest_version}`) !== 'approved') {
      throw new EvidenceContentUnavailableError(`Curriculum ${row.curriculum_version} with media ${row.media_manifest_version} is not released.`);
    }
  }
  const ids = rows.map(row => row.client_attempt_id);
  const before = await readStored(learner.id, ids);
  const beforeById = new Map(before.map(row => [row.client_attempt_id, row]));
  for (const row of rows) {
    const existing = beforeById.get(row.client_attempt_id);
    if (existing && existing.payload_hash !== row.payload_hash) throw new EvidenceConflictError(`Attempt ${row.client_attempt_id} was already stored with different data.`);
  }
  const missing = rows.filter(row => !beforeById.has(row.client_attempt_id));
  if (missing.length) {
    const inserted = await supabase.from('curriculum_attempts').upsert(missing, {
      onConflict: 'learner_id,client_attempt_id', ignoreDuplicates: true,
    });
    if (inserted.error) throw new EvidenceUnavailableError(inserted.error.message);
  }
  const after = await readStored(learner.id, ids);
  const afterById = new Map(after.map(row => [row.client_attempt_id, row]));
  for (const row of rows) {
    const stored = afterById.get(row.client_attempt_id);
    if (!stored) throw new EvidenceUnavailableError(`Attempt ${row.client_attempt_id} was not stored.`);
    if (stored.payload_hash !== row.payload_hash) throw new EvidenceConflictError(`Attempt ${row.client_attempt_id} conflicts with stored data.`);
  }
  return {
    accepted: missing.map(row => row.client_attempt_id),
    alreadySynced: rows.filter(row => beforeById.has(row.client_attempt_id)).map(row => row.client_attempt_id),
  };
}

export async function listEvidenceAttempts(userId: number, afterId: number, limit: number) {
  const learner = await getLearnerByUserId(userId);
  const result = await supabase.from('curriculum_attempts')
    .select('id,client_attempt_id,session_id,schema_version,curriculum_version,media_manifest_version,activity_id,skill_id,content_id,activity_mode,response_type,response_value,result,evidence_class,hint_count,model_exposed,answer_exposed,reduced_choices,media_asset_ids,started_at,completed_at,captured_offline,received_at')
    .eq('learner_id', learner.id).gt('id', afterId).order('id', { ascending: true }).limit(limit);
  if (result.error) throw new EvidenceUnavailableError(result.error.message);
  const rows = (result.data ?? []) as Array<Record<string, unknown> & { id: number }>;
  return { attempts: rows, nextAfterId: rows.length ? rows[rows.length - 1].id : afterId };
}

export async function listEvidenceSummary(userId: number) {
  const learner = await getLearnerByUserId(userId);
  const result = await supabase.rpc('get_curriculum_evidence_summary', { p_learner: learner.id });
  if (result.error) throw new EvidenceUnavailableError(result.error.message);
  return { skills: result.data ?? [], generatedAt: new Date().toISOString() };
}

export async function getDelayedReviewStatus(userId: number, curriculumVersion: string) {
  const learner = await getLearnerByUserId(userId);
  const result = await supabase.rpc('get_curriculum_review_status', {
    p_learner: learner.id,
    p_curriculum: curriculumVersion,
  });
  if (result.error) throw new EvidenceUnavailableError(result.error.message);
  return result.data?.[0] ?? {
    review_status: 'not_scheduled', independent_completed_at: null, due_at: null,
    latest_review_at: null, review_count: 0, interval_days: 1,
  };
}

