import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rewardGoalReached } from '../src/modules/frames/reward-policy.js';

test('cosmetics unlock from current curriculum milestones',()=>{
  const none=new Set<string>();
  assert.equal(rewardGoalReached('free',0,[],none),true);
  assert.equal(rewardGoalReached('camp',2,[],none),false);
  assert.equal(rewardGoalReached('camp',3,[],none),true);
  assert.equal(rewardGoalReached('sounds',3,['a','a','a','a','a'],none),false);
  assert.equal(rewardGoalReached('sounds',3,['a','e','i','o','u'],none),true);
  assert.equal(rewardGoalReached('gate',3,[],none),false);
  assert.equal(rewardGoalReached('gate',3,[],new Set(['gate'])),true);
  assert.equal(rewardGoalReached('crown',3,[],new Set(['gate'])),false);
});

test('missing border catalog repairs preserve existing rewards and do not grant gated defaults',()=>{
  const model=readFileSync(new URL('../src/database/models/frame.model.ts',import.meta.url),'utf8');
  for(const key of ['purple-heart','ice-crystal','purple-star','fire-and-water','purple-dragon','red-ring'])assert.ok(model.includes(key));
  assert.match(model,/ignoreDuplicates:true/);
  const service=readFileSync(new URL('../src/modules/frames/frames.service.ts',import.meta.url),'utf8');
  assert.match(service,/!FRAME_REWARDS\[f.asset_key\]/);
});
