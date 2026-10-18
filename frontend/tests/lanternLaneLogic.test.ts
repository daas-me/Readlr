import test from 'node:test';
import assert from 'node:assert/strict';
import { addLitLantern, lanternVowel, LANTERN_WORDS } from '../src/app/components/lanternLaneLogic.ts';

test('Lantern Lane sorts every target into a short-vowel lantern',()=>{
  assert.deepEqual(LANTERN_WORDS.map(word=>[word,lanternVowel(word)]),[
    ['sat','a'],['sit','i'],['set','e'],['met','e'],['let','e'],['lit','i'],
  ]);
});

test('spoken lanterns light once and only after a match',()=>{
  assert.deepEqual(addLitLantern([], 'sat', 'different'),[]);
  assert.deepEqual(addLitLantern([], 'map', 'matched'),[]);
  assert.deepEqual(addLitLantern(addLitLantern([], 'sat', 'matched'),'sat','matched'),['sat']);
});
