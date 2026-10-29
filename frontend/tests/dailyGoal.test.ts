import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyGoalProgress, parseDailyGoal } from '../src/hooks/dailyGoal.ts';

const goal={day:'2026-11-02',goal:{stops:1,words:5},stops:0,words:3,completed:false};
test('daily goal accepts only well-formed server answers',()=>{
  assert.deepEqual(parseDailyGoal(goal),goal);
  for(const bad of [null,{},{...goal,day:'today'},{...goal,words:-1},{...goal,stops:1.5},{...goal,completed:'yes'},{...goal,goal:null}])
    assert.equal(parseDailyGoal(bad),null);
});
test('progress follows the closer half of the goal and is full once met',()=>{
  assert.equal(dailyGoalProgress(goal),.6);
  assert.equal(dailyGoalProgress({...goal,stops:1,words:0,completed:true}),1);
  assert.equal(dailyGoalProgress({...goal,words:0}),0);
});
