import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculumLibraryItems, CAMP_BLEND_CONSONANTS, CAMP_BLEND_VOWELS, PHONEME_LIBRARY } from '../src/app/components/curriculumLibraryContent.ts';
import { READING_CHAPTERS } from '../src/app/components/aralCurriculum.ts';

test('library contains every current chapter word exactly once',()=>{
  const words=curriculumLibraryItems('words').map(i=>i.word);
  assert.deepEqual(words,[...new Set(READING_CHAPTERS.flatMap(c=>c.words))]);
  assert.equal(words.length,new Set(words).size);
});
test('library has 44 phoneme examples and distinguishes vowel shelves',()=>{
  assert.equal(PHONEME_LIBRARY.length,44);
  assert.equal(curriculumLibraryItems('short').length,5);
  assert.equal(curriculumLibraryItems('long').length,13);
  assert.equal(curriculumLibraryItems('consonants').length,26);
  assert.equal(curriculumLibraryItems('short').length+curriculumLibraryItems('long').length+curriculumLibraryItems('consonants').length,44);
});
test('sound shelves reveal only examples reached in the current journey',()=>{
  assert.deepEqual(curriculumLibraryItems('short',0).map(item=>item.word),['apple']);
  assert.deepEqual(curriculumLibraryItems('long',0),[]);
  assert.ok(curriculumLibraryItems('long',8).length>0);
  assert.ok(curriculumLibraryItems('words',0).every(item=>READING_CHAPTERS[0].words.includes(item.word)));
});
test('library blends use precisely the Camp sound teams',()=>{
  const words=curriculumLibraryItems('blends').map(i=>i.word);
  assert.deepEqual(words,CAMP_BLEND_CONSONANTS.flatMap(c=>CAMP_BLEND_VOWELS.flatMap(v=>[c+v,v+c])));
  assert.equal(new Set(words).size,40);
  assert.ok(words.includes('am')&&words.includes('ma'));
});
test('both sound-team directions unlock only when both letters are introduced',()=>{
  assert.deepEqual(curriculumLibraryItems('blends',0).map(i=>i.word),['ma','am','ta','at']);
  for(const [book,count] of [[0,4],[1,18],[2,24],[3,32],[4,40]]){
    const words=curriculumLibraryItems('blends',book).map(i=>i.word);
    assert.equal(words.length,count);
    for(const word of words)assert.ok(words.includes(word.split('').reverse().join('')));
    if(book<3)assert.ok(words.every(word=>!word.includes('o')));
    if(book<4)assert.ok(words.every(word=>!word.includes('u')));
  }
});
