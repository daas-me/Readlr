import test from 'node:test';
import assert from 'node:assert/strict';
import { addBloomedWord, gardenSeedFits, gardenVowel, GARDEN_WORDS } from '../src/app/components/secretGardenLogic.ts';

test('garden seed beds accept the correct middle vowel including the contrast word',()=>{
  for(const word of GARDEN_WORDS){
    assert.equal(gardenSeedFits(word,gardenVowel(word)),true);
    assert.equal(gardenSeedFits(word,gardenVowel(word)==='o'?'i':'o'),false);
  }
  assert.equal(gardenVowel('bin'),'i');
  assert.equal(gardenVowel('mop'),'');
});

test('spoken garden words bloom once and only after a match',()=>{
  assert.deepEqual(addBloomedWord([],'pot','different'),[]);
  assert.deepEqual(addBloomedWord([],'map','matched'),[]);
  assert.deepEqual(addBloomedWord(addBloomedWord([],'pot','matched'),'pot','matched'),['pot']);
});
