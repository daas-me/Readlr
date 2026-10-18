import test from 'node:test';
import assert from 'node:assert/strict';
import { chronicleSounds, chronicleBlendWords } from '../src/app/components/chronicleLessons.ts';
import { READING_CHAPTERS, makeReadingRound } from '../src/app/components/aralCurriculum.ts';

test('first book reintroduces m, short a, t with meaningful picture anchors',()=>{
  assert.deepEqual(chronicleSounds(0).map(c=>[c.letter,c.word]),[['m','mango'],['a','apple'],['t','top']]);
  assert.deepEqual(chronicleBlendWords(0),['am','at','mat']);
});
test('each book blends words from its own taught bank',()=>{
  READING_CHAPTERS.forEach((chapter,index)=>{
    assert.ok(chronicleBlendWords(index).every(word=>chapter.words.includes(word)));
    assert.ok(chronicleSounds(index).every(card=>card.cue&&card.word));
  });
});
test('first book scaffolds practice while checkpoint remains independent speech',()=>{
  const practice=makeReadingRound(READING_CHAPTERS[0],false);
  assert.deepEqual(practice.map(t=>t.kind),['listen','build','read','repair','build','read','build','read','meaning']);
  assert.deepEqual(practice.map(t=>t.word),['am','am','am','at','at','at','mat','mat','mat']);
  assert.ok(makeReadingRound(READING_CHAPTERS[0],true).every(t=>t.kind==='read'));
});

test('early CVC books introduce every letter before using it in their word bank',()=>{
  const taught=new Set<string>();
  READING_CHAPTERS.slice(0,8).forEach((chapter,index)=>{
    chronicleSounds(index).forEach(card=>taught.add(card.letter));
    for(const word of chapter.words)for(const letter of word)assert.ok(taught.has(letter),`${chapter.id}: ${word} needs ${letter}`);
  });
});
