import test from 'node:test';
import assert from 'node:assert/strict';
import { VOWEL_TOWER_STEPS, VOWEL_TOWER_WORDS, addAwakenedVowelWord, vowelTileFits } from '../src/app/components/vowelTowerLogic.ts';

test('vowel lift covers four silent-e contrasts and three ee words',()=>{
  assert.deepEqual(VOWEL_TOWER_STEPS.slice(0,4).map(step=>[step.from,step.word]),[['cap','cape'],['kit','kite'],['hop','hope'],['cub','cube']]);
  assert.deepEqual(VOWEL_TOWER_STEPS.slice(4).map(step=>step.word),['tree','seed','feet']);
  VOWEL_TOWER_STEPS.forEach((step,index)=>assert.equal(vowelTileFits(index,step.tile),true));
});

test('tower voice trail saves only matched chapter words once',()=>{
  assert.deepEqual(addAwakenedVowelWord([],VOWEL_TOWER_WORDS[0],'different'),[]);
  assert.deepEqual(addAwakenedVowelWord([],VOWEL_TOWER_WORDS[0],'matched'),['cap']);
  assert.deepEqual(addAwakenedVowelWord(['cap'],'cap','matched'),['cap']);
  assert.deepEqual(addAwakenedVowelWord([], 'sat','matched'),[]);
});
