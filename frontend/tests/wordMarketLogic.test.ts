import test from 'node:test';
import assert from 'node:assert/strict';
import { addStockedLabel, marketLetterFits, MARKET_WORDS } from '../src/app/components/wordMarketLogic.ts';

test('market crates only fit the matching ordered letter space',()=>{
  for(const word of MARKET_WORDS)for(const [slot,letter] of [...word].entries()){
    assert.equal(marketLetterFits(word,letter,slot),true);
    assert.equal(marketLetterFits(word,letter,(slot+1)%word.length),word[(slot+1)%word.length]===letter);
  }
  assert.equal(marketLetterFits('mop','m',0),false);
});

test('spoken market labels stock once and only after a match',()=>{
  assert.deepEqual(addStockedLabel([],'pin','different'),[]);
  assert.deepEqual(addStockedLabel([],'sat','matched'),[]);
  assert.deepEqual(addStockedLabel(addStockedLabel([],'pin','matched'),'pin','matched'),['pin']);
});
