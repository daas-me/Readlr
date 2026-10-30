import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('admin access presents current books, not retired stage controls',()=>{
  const source=readFileSync(new URL('../src/app/components/AdminClassroomControls.tsx',import.meta.url),'utf8');
  assert.doesNotMatch(source,/Valley of Vowels|Blending Bridges|CVC Kingdom|Earlier curriculum controls|Unlock selected stages/);
  assert.match(source,/Normal book progression/);
  assert.match(source,/<TabsTrigger value="reset">/);
  assert.match(source,/<AdminProgressReset/);
  assert.match(source,/READING_CHAPTERS.map/);
  assert.match(source,/readingOpenChallenges/);
  assert.match(source,/Previous access rule - choose a current setting/);
  assert.match(source,/if \(!inherit && \['stage','stages','survey'\].includes\(draft.mode\)\) return/);
});
