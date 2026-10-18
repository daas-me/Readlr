import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=(path:string)=>readFileSync(new URL(path,import.meta.url),'utf8');
test('review isolates checkpoint and practice persistence',()=>{
  const source=read('../src/app/components/ReadingJourney.tsx');
  assert.match(source,/if\(sandbox\|\|round\|\|initialTab==='camp'\)return/);
  assert.match(source,/if\(!checkpoint\|\|sandbox\|\|localMode\)return/);
  assert.match(source,/if\(sandbox\|\|localMode\|\|checkpoint\)return/);
  assert.match(source,/usePracticeSession\(sandbox\|\|localMode\?null:learnerId/);
  assert.match(source,/useCvcRecorder\(sandbox\|\|localMode\?undefined:practice\)/);
  assert.match(source,/if\(checkpoint&&!reviewMode&&!localMode&&!checkpointFallback\)/);
  assert.match(source,/remediation\s*\? await retryReadingWord/);
  assert.match(source,/if\(checkpoint&&!sandbox&&!localMode&&!checkpointFallback\)/);
});
test('review speech endpoint requires authentication and stored-role verification',()=>{
  const source=read('../../backend/src/modules/audio/audio.route.ts');
  assert.match(source,/post\('\/review-recognize',authMiddleware,requireRole/);
  assert.match(source,/config.nodeEnv==='development'\?\['admin','learner'\] as const:\['admin'\]/);
});
test('main app exposes review independently of curriculum release approval',()=>{
  const source=read('../src/app/App.tsx');
  assert.match(source,/path === "\/review"/);
  assert.match(source,/currentScreen !== "reading-review"/);
  assert.match(source,/user\?\.role==='admin'\|\|import.meta.env.DEV/);
});
