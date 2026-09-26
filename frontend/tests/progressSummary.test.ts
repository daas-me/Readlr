import test from "node:test";
import assert from "node:assert/strict";
import { progressSummary } from "../src/app/components/progressSummary.ts";
test("progress separates guided training from bridge and word challenges",()=>{
  const result=progressSummary({1:20,2:8,3:0});
  assert.equal(result.total,28);assert.equal(result.bridges,3);assert.equal(result.vowels,5);assert.equal(result.next,2);
  assert.equal(progressSummary({2:4}).bridges,0);
});
test("crown completion is not counted as a twentieth CVC word",()=>{
  const result=progressSummary({1:20,2:20,3:20});
  assert.equal(result.words,19);assert.equal(result.finished,3);assert.equal(result.next,0);assert.equal(result.total,60);
});
test("empty and invalid progress do not create completion",()=>{
  assert.equal(progressSummary({}).total,0);
  assert.deepEqual(progressSummary({1:-5,2:NaN,3:200}).stages,[0,0,20]);
});
