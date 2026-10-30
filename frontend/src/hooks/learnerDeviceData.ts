export interface DeviceStorage {
  readonly length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
}

// Keys suffixed with the learner profile id, sometimes followed by _<detail>.
const LEARNER_PREFIXES = [
  'readlr_aral_activity_v1_', 'readlr_aral_blend_v1_', 'readlr_aral_book_access_v1_', 'readlr_aral_book_unlock_v1_',
  'readlr_aral_carousel_v1_', 'readlr_aral_changing_hall_v1_', 'readlr_aral_crown_chamber_v1_', 'readlr_aral_drawbridge_planks_v1_',
  'readlr_aral_garden_seed_beds_v1_', 'readlr_aral_guided_v1_', 'readlr_aral_key_keeper_v1_', 'readlr_aral_market_builder_v1_',
  'readlr_aral_reading_v1_', 'readlr_aral_round_v1_', 'readlr_aral_royal_library_v1_', 'readlr_aral_vowel_tower_v1_',
  'readlr_bridge_v2_learner_', 'readlr_camp_orientation_v1_', 'readlr_camp_unlock_v1_', 'readlr_curriculum_state_v1_',
  'readlr_cvc_magic_v1_', 'readlr_earned_progress_', 'readlr_explanation_v1_', 'readlr_first_reward_v1_',
  'readlr_introduction_v1_', 'readlr_milo_guidance_v1_', 'readlr_practice_v1_', 'readlr_reset_epochs_',
];
const USER_PREFIXES = ['readlr_progress_user_', 'readlr_classroom_message_', 'readlr_practice_day_', 'readlr_reminder_day_', 'readlr-survey-draft:'];
// Older learner data that is not keyed by any id.
const SHARED_KEYS = ['readlr_attempt_records', 'readlr_vowel_powers', 'readlr_vowel_dojo_unlock_dismissed'];

export const evidenceQueueStorageKey = (learnerId: number) => `readlr_evidence_queue_v1_${learnerId}`;

const owned = (key: string, prefixes: string[], id: number | null) =>
  id !== null && prefixes.some(prefix => key === `${prefix}${id}` || key.startsWith(`${prefix}${id}_`));

// Removes this learner's device data; unsynced evidence stays queued so it can still reach the server.
export function clearLearnerDeviceData(storage: DeviceStorage, learnerId: number | null, userId: number | null, keepEvidenceQueue: boolean): string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key) keys.push(key);
  }
  const removed = keys.filter(key =>
    SHARED_KEYS.includes(key) || owned(key, LEARNER_PREFIXES, learnerId) || owned(key, USER_PREFIXES, userId) ||
    (!keepEvidenceQueue && learnerId !== null && key === evidenceQueueStorageKey(learnerId)));
  removed.forEach(key => storage.removeItem(key));
  return removed;
}
