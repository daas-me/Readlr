export const ACTIVITY_MODES = ['teaching', 'practice', 'guided', 'adventure', 'independent_check', 'delayed_review'] as const;
export const RESPONSE_TYPES = ['selection', 'construction', 'speech_prediction', 'nonvoice', 'none'] as const;
export const ATTEMPT_RESULTS = ['correct', 'incorrect', 'unclear', 'unavailable', 'no_response'] as const;
export const EVIDENCE_CLASSES = ['not_assessed', 'practiced', 'completed_with_help', 'independent_candidate'] as const;

export type ActivityMode = typeof ACTIVITY_MODES[number];
export type ResponseType = typeof RESPONSE_TYPES[number];
export type AttemptResult = typeof ATTEMPT_RESULTS[number];
export type EvidenceClass = typeof EVIDENCE_CLASSES[number];

export interface ClientEvidenceAttempt {
  schemaVersion: 1;
  attemptId: string;
  sessionId: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  activityId: string;
  skillId: string;
  contentId: string;
  mode: ActivityMode;
  responseType: ResponseType;
  responseValue: string | null;
  result: AttemptResult;
  hintCount: number;
  modelExposed: boolean;
  answerExposed: boolean;
  reducedChoices: boolean;
  mediaAssetIds: string[];
  startedAt: string;
  completedAt: string;
  capturedOffline: boolean;
}

export interface EvidenceRow {
  learner_id: number;
  client_attempt_id: string;
  session_id: string;
  schema_version: 1;
  curriculum_version: string;
  media_manifest_version: string;
  activity_id: string;
  skill_id: string;
  content_id: string;
  activity_mode: ActivityMode;
  response_type: ResponseType;
  response_value: string | null;
  result: AttemptResult;
  evidence_class: EvidenceClass;
  hint_count: number;
  model_exposed: boolean;
  answer_exposed: boolean;
  reduced_choices: boolean;
  media_asset_ids: string[];
  started_at: string;
  completed_at: string;
  captured_offline: boolean;
  payload_hash: string;
}

