import test from 'node:test';
import assert from 'node:assert/strict';
import { CHRONICLES, highlightedWord } from '../src/app/components/chronicleContent.ts';
import { READING_CHAPTERS, SOUND_CARDS } from '../src/app/components/aralCurriculum.ts';

test('each campaign chapter has its own book, story and skill',()=>{
  assert.equal(CHRONICLES.length,READING_CHAPTERS.length);
  assert.equal(new Set(CHRONICLES.map(book=>book.prize)).size,10);
  for(const book of CHRONICLES){assert.equal(book.story.length,2);assert.ok(book.skill&&book.mission&&book.emblem);}
});
test('letter and sound-team highlights preserve the complete word',()=>{
  for(const card of SOUND_CARDS){
    const parts=highlightedWord(card.word,card.letter);
    assert.equal(parts.join(''),card.word);
    assert.ok(parts[1],`${card.letter} must be present in ${card.word}`);
  }
  assert.deepEqual(highlightedWord('tree','e'),['tr','ee','']);
  assert.deepEqual(highlightedWord('mat','ma'),['','ma','t']);
});
