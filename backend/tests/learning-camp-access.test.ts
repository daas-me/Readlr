import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isApprovedTester, normalizeTesterAllowlist } from '../src/modules/evidence/camp-access-policy.js';

test('Learning Camp tester allowlists use normalized exact email matches', () => {
  const allowlist = normalizeTesterAllowlist(' Pilot@One.test, pilot@one.test, second@example.test ');
  assert.deepEqual(allowlist, ['pilot@one.test', 'second@example.test']);
  assert.equal(isApprovedTester('PILOT@ONE.TEST', allowlist), true);
  assert.equal(isApprovedTester('attacker+pilot@one.test', allowlist), false);
  assert.equal(isApprovedTester('pilot@one.test.example', allowlist), false);
});

test('Learning Camp access is authenticated, learner-only and release-gated', () => {
  const route = readFileSync(new URL('../src/modules/evidence/evidence.route.ts', import.meta.url), 'utf8');
  const service = readFileSync(new URL('../src/modules/evidence/camp-access.ts', import.meta.url), 'utf8');
  assert.match(route, /camp-access[^\n]+authMiddleware[^\n]+requireRole\('learner'\)/);
  assert.match(service, /curriculum_releases/);
  assert.match(service, /release\?\.status !== 'approved'/);
  assert.match(service, /return DISABLED_ACCESS/);
});
