import test from 'node:test';
import assert from 'node:assert/strict';
import { addRaisedPlank, drawbridgePlankFits, drawbridgeVowel, DRAWBRIDGE_WORDS } from '../src/app/components/castleDrawbridgeLogic.ts';

test('drawbridge planks practice short u across the complete Book 5 word bank',()=>{
  for(const word of DRAWBRIDGE_WORDS){
    assert.equal(drawbridgeVowel(word),'u');
    assert.equal(drawbridgePlankFits(word,'u'),true);
    assert.equal(drawbridgePlankFits(word,'o'),false);
  }
  assert.equal(drawbridgeVowel('sunny'),'');
});

test('spoken drawbridge words raise one plank only after a match',()=>{
  assert.deepEqual(addRaisedPlank([],'sun','different'),[]);
  assert.deepEqual(addRaisedPlank([],'pot','matched'),[]);
  assert.deepEqual(addRaisedPlank(addRaisedPlank([],'sun','matched'),'sun','matched'),['sun']);
});
