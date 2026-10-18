import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('learner reading detail is admin-only and scoped to current learner curriculum and epoch',()=>{
  const routes=readFileSync(new URL('../src/modules/admin/admin.route.ts',import.meta.url),'utf8');
  const detail=readFileSync(new URL('../src/modules/admin/learner-reading.controller.ts',import.meta.url),'utf8');
  assert.match(routes,/learners\/:id\/reading', authMiddleware, requireRole\('admin'\), getLearnerReadingDetail/);
  assert.match(detail,/getLearnerByUserId\(userId\)/);
  assert.match(detail,/eq\('learner_id',learner.id\)/);
  assert.match(detail,/eq\('epoch',state\?\.epoch\?\?0\)/);
  assert.match(detail,/eq\('curriculum_version',READING_VERSION\)/);
  assert.match(detail,/range\(start,start\+499\)/);
  assert.doesNotMatch(detail,/\.update\(|\.insert\(|\.upsert\(/);
});
