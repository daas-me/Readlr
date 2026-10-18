import test from 'node:test';
import assert from 'node:assert/strict';
import { addTransformedWord, changedLetterIndex, changingTileFits, CHANGING_WORDS, WORD_TRANSFORMATIONS } from '../src/app/components/changingWordsLogic.ts';

test('Book 6 transformations change exactly one sound in each paired word',()=>{
  for(const word of CHANGING_WORDS){
    const from=WORD_TRANSFORMATIONS[word];
    const index=changedLetterIndex(from,word);
    assert.ok(index>=0);
    assert.equal(changingTileFits(from,word,word[index]),true);
    assert.equal(changingTileFits(from,word,from[index]),false);
  }
  assert.equal(changedLetterIndex('rug','sad'),-1);
});

test('spoken hall words transform once and only after a match',()=>{
  assert.deepEqual(addTransformedWord([],'rug','different'),[]);
  assert.deepEqual(addTransformedWord([],'map','matched'),[]);
  assert.deepEqual(addTransformedWord(addTransformedWord([],'rug','matched'),'rug','matched'),['rug']);
});
