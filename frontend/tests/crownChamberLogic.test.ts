import test from 'node:test';
import assert from 'node:assert/strict';
import { CROWN_CHAMBER_STEPS, CROWN_CHAMBER_WORDS, addRestoredCrownWord, crownJewelFits } from '../src/app/components/crownChamberLogic.ts';

test('crown forge reviews every cumulative word with its vowel pattern',()=>{
  assert.deepEqual(CROWN_CHAMBER_WORDS,['mat','pen','tin','pot','sun','web','van','kite']);
  assert.deepEqual(CROWN_CHAMBER_STEPS.map(step=>step.vowel),['a','e','i','o','u','e','a','i...e']);
  CROWN_CHAMBER_STEPS.forEach((step,index)=>assert.equal(crownJewelFits(index,step.vowel),true));
});

test('crown trail restores matched words once',()=>{
  assert.deepEqual(addRestoredCrownWord([],'mat','different'),[]);
  assert.deepEqual(addRestoredCrownWord([],'mat','matched'),['mat']);
  assert.deepEqual(addRestoredCrownWord(['mat'],'mat','matched'),['mat']);
  assert.deepEqual(addRestoredCrownWord([],'cape','matched'),[]);
});
