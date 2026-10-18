import test from 'node:test';
import assert from 'node:assert/strict';
import { addRestoredStory, LIBRARY_STORIES, LIBRARY_WORDS, storyWordFits } from '../src/app/components/royalLibraryLogic.ts';

test('Book 8 story repairs each have one meaningful target',()=>{
  for(const word of LIBRARY_WORDS){
    const story=LIBRARY_STORIES[word];
    assert.ok(story.clue.includes('___'));
    assert.equal(story.choices.filter(choice=>storyWordFits(word,choice)).length,1);
  }
});

test('spoken library words restore once and only after a match',()=>{
  assert.deepEqual(addRestoredStory([],'van','different'),[]);
  assert.deepEqual(addRestoredStory([],'map','matched'),[]);
  assert.deepEqual(addRestoredStory(addRestoredStory([],'van','matched'),'van','matched'),['van']);
});
