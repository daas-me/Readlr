import test from 'node:test';
import assert from 'node:assert/strict';
import { clearLearnerDeviceData, evidenceQueueStorageKey } from '../src/hooks/learnerDeviceData.ts';

class MemoryStorage {
  values = new Map<string, string>();
  constructor(keys: string[]) { keys.forEach(key => this.values.set(key, '1')); }
  get length() { return this.values.size; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
}

const keys = [
  'auth_token', 'readlr_offline_packs_v1', 'readlr_pending_recovery', 'readlr_attempt_records',
  'readlr_aral_reading_v1_7', 'readlr_aral_activity_v1_7_gate_mango', 'readlr_aral_reading_v1_70', 'readlr_aral_reading_v1_8',
  'readlr_practice_v1_7', 'readlr_progress_user_3', 'readlr_progress_user_30', 'readlr-survey-draft:3',
  evidenceQueueStorageKey(7), evidenceQueueStorageKey(8),
];

test('logout clears only this learner and account data plus shared legacy keys', () => {
  const storage = new MemoryStorage(keys);
  clearLearnerDeviceData(storage, 7, 3, false);
  assert.deepEqual([...storage.values.keys()].sort(), [
    'auth_token', 'readlr_aral_reading_v1_70', 'readlr_aral_reading_v1_8', 'readlr_offline_packs_v1',
    'readlr_pending_recovery', 'readlr_progress_user_30', evidenceQueueStorageKey(8),
  ].sort());
});

test('unsynced evidence stays queued when the final sync did not finish', () => {
  const storage = new MemoryStorage(keys);
  clearLearnerDeviceData(storage, 7, 3, true);
  assert.ok(storage.values.has(evidenceQueueStorageKey(7)));
  assert.ok(!storage.values.has('readlr_aral_reading_v1_7'));
});

test('without a learner profile only account and shared keys are cleared', () => {
  const storage = new MemoryStorage(keys);
  clearLearnerDeviceData(storage, null, 3, false);
  assert.ok(storage.values.has('readlr_aral_reading_v1_7'));
  assert.ok(storage.values.has(evidenceQueueStorageKey(7)));
  assert.ok(!storage.values.has('readlr_progress_user_3'));
});
