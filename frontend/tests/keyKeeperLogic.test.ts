import test from 'node:test';
import assert from 'node:assert/strict';
import { addUnlockedWord, KEY_LOCKS, KEY_WORDS, keyFitsLock } from '../src/app/components/keyKeeperLogic.ts';

test('Book 7 keys fit the intended beginning or ending sound',()=>{
  for(const word of KEY_WORDS){
    const lock=KEY_LOCKS[word];
    assert.equal(word[lock.missing],lock.letter);
    assert.equal(keyFitsLock(word,lock.letter),true);
    assert.equal(keyFitsLock(word,lock.choices.find(letter=>letter!==lock.letter)!),false);
  }
  assert.deepEqual(KEY_WORDS.map(word=>KEY_LOCKS[word].missing),[0,2,2,0,2,2]);
});

test('spoken key words unlock once and only after a match',()=>{
  assert.deepEqual(addUnlockedWord([],'web','different'),[]);
  assert.deepEqual(addUnlockedWord([],'map','matched'),[]);
  assert.deepEqual(addUnlockedWord(addUnlockedWord([],'web','matched'),'web','matched'),['web']);
});
