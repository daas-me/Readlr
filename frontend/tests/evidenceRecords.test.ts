import test from 'node:test';
import assert from 'node:assert/strict';
import {
  acknowledgeEvidence, createEvidenceAttempt, evidenceQueueKey, parseEvidenceQueue,
  queueEvidenceAttempt, readEvidenceQueue, syncEvidenceQueue, type EvidenceAttempt,
} from '../src/hooks/evidenceRecords.ts';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

const IDs = [
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
];
const attempt = (id = IDs[0], overrides: Partial<EvidenceAttempt> = {}) => createEvidenceAttempt({
  sessionId: IDs[1], curriculumVersion: 'readlr2-eng01-mat-draft-1', mediaManifestVersion: 'readlr2-eng01-mat-media-draft-1',
  activityId: 'ENG01-MAT-I01', skillId: 'eng01.letter.m', contentId: 'eng01.grapheme.m', mode: 'independent_check',
  responseType: 'selection', responseValue: 'm', result: 'correct', hintCount: 0, modelExposed: false,
  answerExposed: false, reducedChoices: false, mediaAssetIds: ['media.eng01.m.phoneme.v1'],
  startedAt: '2026-10-13T01:00:00.000Z', completedAt: '2026-10-13T01:00:03.000Z', capturedOffline: false,
  ...overrides,
}, () => id);

test('evidence queues are learner-scoped and idempotent', () => {
  const storage = new MemoryStorage(), record = attempt();
  assert.equal(queueEvidenceAttempt(1, record, storage), true);
  assert.equal(queueEvidenceAttempt(1, record, storage), true);
  assert.equal(readEvidenceQueue(1, storage).length, 1);
  assert.equal(readEvidenceQueue(2, storage).length, 0);
  assert.notEqual(evidenceQueueKey(1), evidenceQueueKey(2));
});

test('malformed records and duplicate IDs do not survive parsing', () => {
  const record = attempt();
  assert.deepEqual(parseEvidenceQueue(JSON.stringify([record, record, { ...record, attemptId: 'bad' }])), [record]);
  assert.deepEqual(parseEvidenceQueue('broken'), []);
});

test('offline failure preserves the exact queued attempt for replay', async () => {
  const storage = new MemoryStorage(), record = attempt();
  queueEvidenceAttempt(4, record, storage);
  await assert.rejects(syncEvidenceQueue(4, 'token', { storage, fetcher: async () => { throw new Error('offline'); } }));
  assert.deepEqual(readEvidenceQueue(4, storage), [record]);
});

test('server acknowledgements remove accepted and already-synced attempts only', async () => {
  const storage = new MemoryStorage(), first = attempt(), second = attempt(IDs[2], { activityId: 'ENG01-MAT-I02' });
  queueEvidenceAttempt(5, first, storage); queueEvidenceAttempt(5, second, storage);
  let sent: unknown;
  const result = await syncEvidenceQueue(5, 'token', { storage, api: 'https://readlr.test/api', fetcher: async (_url, init) => {
    sent = JSON.parse(String(init?.body));
    return new Response(JSON.stringify({ accepted: [first.attemptId], alreadySynced: [second.attemptId] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } });
  assert.deepEqual((sent as { attempts: EvidenceAttempt[] }).attempts, [first, second]);
  assert.deepEqual(result, { sent: 2, acknowledged: 2, remaining: 0 });
  assert.deepEqual(readEvidenceQueue(5, storage), []);
});

test('acknowledgement cannot delete an unrelated queued attempt', () => {
  const storage = new MemoryStorage(), record = attempt();
  queueEvidenceAttempt(6, record, storage);
  assert.deepEqual(acknowledgeEvidence(6, [IDs[2]], storage), [record]);
});

test('blocked local storage reports failure without interrupting the activity', () => {
  const storage = { getItem: () => null, setItem: () => { throw new Error('quota'); } };
  assert.equal(queueEvidenceAttempt(7, attempt(), storage), false);
});

