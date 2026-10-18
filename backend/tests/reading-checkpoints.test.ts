import test from 'node:test';
import assert from 'node:assert/strict';
import { checkpointWords, chapterAvailable, CHAPTER_IDS, READING_BANKS } from '../src/modules/evidence/reading-catalog.js';
import { parsePolicy, stagePermitted, OPEN_POLICY } from '../src/modules/admin/classroom.policy.js';
import { READING_TARGETS } from '../src/modules/audio/cvcRecognition.js';
import fs from 'node:fs';

test('server issues unique permitted words, never an arbitrary client word',()=>{
  for(const chapter of CHAPTER_IDS){
    const words=checkpointWords(chapter,()=>0.4);
    assert.equal(words.length,chapter==='crown'?8:['lanterns','market','garden','bridge','hall','keys','library'].includes(chapter)?6:Math.min(5,READING_BANKS[chapter].length));
    assert.equal(new Set(words).size,words.length);
    assert.ok(words.every(word=>READING_BANKS[chapter].includes(word)&&READING_TARGETS.has(word)));
  }
  assert.throws(()=>checkpointWords('constructor'));
  assert.throws(()=>checkpointWords('unknown'));
});
test('Lantern Lane checks every taught vowel word',()=>{
  assert.deepEqual(checkpointWords('lanterns',()=>0).sort(),['let','lit','met','sat','set','sit']);
  const sql=fs.readFileSync(new URL('../supabase/migrations/202610170002_lantern_lane_checkpoint.sql',import.meta.url),'utf8');
  assert.match(sql,/cardinality\(words\) between 1 and 6/);
});
test('The Word Market checks every taught CVC label',()=>{
  assert.deepEqual(checkpointWords('market',()=>0).sort(),['fin','map','net','pen','pin','tin']);
});

test('secret garden checkpoint includes every taught and contrast word',()=>{
  assert.deepEqual(checkpointWords('garden',()=>0).sort(),['bin','hop','hot','pot','sob','top']);
});
test('checkpoint order varies while long vowels retain coverage',()=>{
  assert.notDeepEqual(checkpointWords('tower',()=>0),checkpointWords('tower',()=>0.99));
  assert.deepEqual(checkpointWords('tower').sort(),['cape','cube','hope','kite','tree']);
});
test('Crown Chamber checks all eight cumulative words',()=>{
  assert.deepEqual(checkpointWords('crown',()=>0).sort(),['kite','mat','pen','pot','sun','tin','van','web']);
  const sql=fs.readFileSync(new URL('../supabase/migrations/202610180001_crown_chamber_checkpoint.sql',import.meta.url),'utf8');
  assert.match(sql,/cardinality\(words\) between 1 and 8/);
});
test('chapter progression needs previous checkpoint or explicit chapter grant',()=>{
  assert.equal(chapterAvailable('gate',[]),true);
  assert.equal(chapterAvailable('lanterns',[]),false);
  assert.equal(chapterAvailable('lanterns',['gate']),true);
  assert.equal(chapterAvailable('crown',['gate']),false);
  assert.equal(chapterAvailable('crown',[],10),true);
  assert.equal(chapterAvailable('crown',[],9),false);
  assert.equal(chapterAvailable('unknown',[],10),false);
});
test('chapter overrides are bounded and do not bypass stage restrictions',()=>{
  assert.equal(parsePolicy({...OPEN_POLICY,readingUnlockThrough:10}).readingUnlockThrough,10);
  for(const value of [-1,11,1.5,'10',null])assert.throws(()=>parsePolicy({...OPEN_POLICY,readingUnlockThrough:value}));
  assert.equal(stagePermitted({...OPEN_POLICY,mode:'paused',readingUnlockThrough:10},3),false);
  assert.equal(stagePermitted({...OPEN_POLICY,mode:'stages',stages:[1],readingUnlockThrough:10},3),false);
});

test('book challenge overrides validate, round-trip, and grant only selected books',()=>{
  const policy=parsePolicy({...OPEN_POLICY,readingOpenChallenges:[10,3,3]});
  assert.deepEqual(policy.readingOpenChallenges,[3,10]);
  assert.deepEqual(parsePolicy(policy),policy);
  assert.deepEqual(parsePolicy({...policy,readingOpenChallenges:[]}).readingOpenChallenges,[]);
  for(const value of [null,{},[0],[11],[1.5],['2'],Array(11).fill(1)])
    assert.throws(()=>parsePolicy({...OPEN_POLICY,readingOpenChallenges:value}));
  const done:string[]=[];
  assert.equal(chapterAvailable('crown',done,0,policy.readingOpenChallenges),true);
  assert.equal(chapterAvailable('lanterns',done,0,policy.readingOpenChallenges),false);
  assert.equal(chapterAvailable('unknown',done,0,policy.readingOpenChallenges),false);
  assert.equal(chapterAvailable('crown',done,0,[]),false);
  assert.deepEqual(done,[]);
  assert.equal(stagePermitted({...policy,mode:'paused'},3),false);
  assert.equal(stagePermitted({...policy,mode:'stages',stages:[1]},3),false);
});

test('Book 1 checkpoint migration requires all spoken words and meaning before passing',()=>{
  const sql=fs.readFileSync(new URL('../supabase/migrations/202610170001_book_one_meaning_checkpoint.sql',import.meta.url),'utf8');
  assert.match(sql,/chapter_id='gate'.*updated->>'meaning'='matched'/s);
  assert.match(sql,/matched=cardinality\(words\).*outcome='matched'/s);
  assert.match(sql,/aral\.meaning\.mat/);
  assert.match(sql,/response_type,response_value/);
  const preflight=fs.readFileSync(new URL('../scripts/checkReadingRollout.ts',import.meta.url),'utf8');
  assert.match(preflight,/record_reading_checkpoint_meaning/);
});

test('checkpoint remediation can replace a terminal miss and recompute completion',()=>{
  const sql=fs.readFileSync(new URL('../supabase/migrations/202610180002_learner_curriculum_state.sql',import.meta.url),'utf8');
  assert.match(sql,/create or replace function public\.retry_reading_checkpoint/);
  assert.match(sql,/s\.results->>p_item::text not in \('different','uncertain','unavailable'\)/);
  assert.match(sql,/jsonb_set\(s\.results,array\[p_item::text\],to_jsonb\(p_result\)\)/);
  assert.match(sql,/chapter_id='gate'.*updated->>'meaning'='matched'/s);
  assert.match(sql,/grant execute on function public\.retry_reading_checkpoint/);
});
