import test from 'node:test';
import assert from 'node:assert/strict';
import { OPEN_POLICY, parsePolicy } from '../src/modules/admin/classroom.policy.js';
import { validReadingStop } from '../src/modules/evidence/reading-stops.js';

test('stop overrides are validated, deduplicated and retained',()=>{
  const policy=parsePolicy({...OPEN_POLICY,readingOpenStops:['gate:check','gate:apple','gate:check']});
  assert.deepEqual(policy.readingOpenStops,['gate:apple','gate:check']);
  assert.equal(policy.readingOpenChallenges,undefined);
});
test('stop overrides reject malformed, unknown and wrong-book stops',()=>{
  for(const value of [null,{},['gate:banana'],['crown:mango'],['gate:check:extra'],['__proto__:check'],[1],Array(101).fill('gate:check')])
    assert.throws(()=>parsePolicy({...OPEN_POLICY,readingOpenStops:value}));
  assert.equal(validReadingStop('gate:check:'),false);
});
