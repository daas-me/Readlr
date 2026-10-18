import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('restart targets current book checkpoints with explicit confirmation and scope',()=>{
  const source=readFileSync(new URL('../src/app/components/AdminProgressReset.tsx',import.meta.url),'utf8');
  assert.match(source,/scope: 'reading-checkpoints'/);
  assert.match(source,/word !== 'RESET'/);
  assert.match(source,/All ten book checkpoints/);
  assert.match(source,/does not erase guided practice/);
  assert.doesNotMatch(source,/Valley of Vowels|Blending Bridges|CVC Kingdom/);
});
test('a reading reset clears completion and access caches without erasing guided practice',()=>{
  const source=readFileSync(new URL('../src/app/components/progressReset.ts',import.meta.url),'utf8');
  assert.match(source,/readlr_aral_reading_v1_/);
  assert.match(source,/readlr_aral_book_access_v1_/);
  assert.match(source,/readlr_aral_book_unlock_v1_/);
  assert.doesNotMatch(source,/removeItem\(.*guided/);
});
