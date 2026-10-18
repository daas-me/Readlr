import test from 'node:test';
import assert from 'node:assert/strict';
import { ARAL_VERSION, READING_CHAPTERS, SOUND_CARDS, makeReadingRound, readingEvidenceResult } from '../src/app/components/aralCurriculum.ts';
import { READING_TARGETS, judgeCvcWord } from '../../backend/src/modules/audio/cvcRecognition.ts';
import { READING_BANKS, CHAPTER_IDS } from '../../backend/src/modules/evidence/reading-catalog.ts';

test('server chapter IDs and checkpoint inventories match the teaching catalog',()=>{
  assert.deepEqual(CHAPTER_IDS,READING_CHAPTERS.map(c=>c.id));
  for(const chapter of READING_CHAPTERS)assert.ok(READING_BANKS[chapter.id].every(word=>chapter.words.includes(word)));
});

test('all campaign words have a bounded speech target and source mapping',()=>{
  assert.equal(ARAL_VERSION,'readlr-aral-english-1');
  assert.equal(new Set(READING_CHAPTERS.map(c=>c.id)).size,READING_CHAPTERS.length);
  for(const c of READING_CHAPTERS){assert.ok(c.source);for(const w of c.words)assert.ok(READING_TARGETS.has(w),w);}
});
test('checkpoints hide scaffolds and sample without duplicate words inside the chapter',()=>{
  for(const c of READING_CHAPTERS){
    const round=makeReadingRound(c,true);
    assert.equal(round.length,c.id==='crown'?8:['lanterns','market','garden','bridge','hall','keys','library'].includes(c.id)?6:Math.min(5,c.words.length));
    assert.equal(new Set(round.map(t=>t.word)).size,round.length);
    assert.ok(round.every(t=>t.kind==='read'&&c.words.includes(t.word)));
  }
});
test('practice has varied modes, valid missing positions and exactly one correct choice',()=>{
  const kinds=new Set<string>();
  for(const c of READING_CHAPTERS)for(const t of makeReadingRound(c,false)){
    kinds.add(t.kind);assert.equal(t.options.filter(w=>w===t.word).length,1);
    assert.ok(t.missing>=0&&t.missing<t.word.length);
    assert.ok(t.options.every(w=>c.words.includes(w)||c.id==='gate'&&['mango','top'].includes(w)));
    if(t.kind==='meaning')assert.ok(t.clue);
  }
  assert.ok(kinds.has('build')&&kinds.has('repair')&&kinds.has('listen')&&kinds.has('read'));
});
test('Book 1 moves from modeled words to independent reading and meaning',()=>{
  const round=makeReadingRound(READING_CHAPTERS[0],false,()=>0);
  assert.deepEqual(round.map(task=>`${task.kind}:${task.word}`),[
    'listen:am','build:am','read:am','repair:at','build:at','read:at','build:mat','read:mat','meaning:mat',
  ]);
  assert.deepEqual(new Set(round.at(-1)!.options),new Set(['mat','top','mango']));
});
test('Book 2 practices every target through manipulation and spoken reading',()=>{
  const round=makeReadingRound(READING_CHAPTERS[1],false,()=>0);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),['sat','sit','set','met','let','lit']);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(READING_CHAPTERS[1].words));
});
test('Book 3 stocks every market word through construction or meaning and spoken reading',()=>{
  const round=makeReadingRound(READING_CHAPTERS[2],false,()=>0);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),READING_CHAPTERS[2].words);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(READING_CHAPTERS[2].words));
});
test('Book 4 grows every garden word and keeps bin as an explicit vowel contrast',()=>{
  const round=makeReadingRound(READING_CHAPTERS[3],false,()=>0);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),READING_CHAPTERS[3].words);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(READING_CHAPTERS[3].words));
  assert.equal(round.find(task=>task.word==='bin'&&task.kind!=='read')?.kind,'meaning');
});
test('Book 5 rebuilds the drawbridge with every short-u word before independent reading',()=>{
  const round=makeReadingRound(READING_CHAPTERS[4],false,()=>0);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),READING_CHAPTERS[4].words);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(READING_CHAPTERS[4].words));
  assert.ok(round.filter(task=>task.kind!=='read').every(task=>task.word[1]==='u'));
});
test('a new random draw changes order without changing the permitted skill bank',()=>{
  const c=READING_CHAPTERS[1];
  assert.notDeepEqual(makeReadingRound(c,true,()=>0).map(t=>t.word),makeReadingRound(c,true,()=>.99).map(t=>t.word));
});
test('short and long vowels have distinct cards; sound anchors include mango',()=>{
  assert.equal(SOUND_CARDS.filter(c=>c.category==='short').length,5);
  assert.equal(SOUND_CARDS.filter(c=>c.category==='long').length,5);
  assert.ok(SOUND_CARDS.some(c=>c.letter==='m'&&c.word==='mango'));
});
test('Hall practice actually substitutes exactly one letter without changing the other sounds',()=>{
  const chapter=READING_CHAPTERS.find(c=>c.id==='hall')!;
  const round=makeReadingRound(chapter,false);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),chapter.words);
  for(const task of round.filter(task=>task.kind==='change')){
    assert.equal(task.kind,'change');assert.ok(task.fromWord);
    assert.equal([...task.word].filter((letter,i)=>letter!==task.fromWord![i]).length,1);
    assert.notEqual(task.word[task.missing],task.fromWord![task.missing]);
  }
});
test('Book 7 fits beginning and ending sound keys before independent reading',()=>{
  const chapter=READING_CHAPTERS.find(c=>c.id==='keys')!;
  const round=makeReadingRound(chapter,false,()=>0);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),chapter.words);
  assert.deepEqual(round.filter(task=>task.kind!=='read').map(task=>[task.word,task.missing]),[
    ['web',0],['wet',2],['win',2],['kid',0],['kit',2],['keg',2],
  ]);
});
test('Book 8 repairs a meaningful sentence for every word before independent reading',()=>{
  const chapter=READING_CHAPTERS.find(c=>c.id==='library')!;
  const round=makeReadingRound(chapter,false,()=>0);
  assert.equal(round.length,12);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),chapter.words);
  const stories=round.filter(task=>task.kind==='meaning');
  assert.deepEqual(stories.map(task=>task.word),chapter.words);
  assert.ok(stories.every(task=>task.clue?.includes('___')&&task.options.includes(task.word)));
});
test('Book 9 compares short and long vowels before reading every tower word',()=>{
  const chapter=READING_CHAPTERS.find(c=>c.id==='tower')!;
  const round=makeReadingRound(chapter,false,()=>0);
  assert.equal(round.length,22);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),chapter.words);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(chapter.words));
  assert.deepEqual(round.filter(task=>task.kind==='listen').map(task=>task.word),['cap','kit','hop','cub']);
  assert.deepEqual(round.filter(task=>task.kind==='repair'&&task.word.length===4).map(task=>task.word),['cape','kite','hope','cube','tree','seed','feet']);
});
test('Book 10 reviews every crown word through a varied challenge and independent reading',()=>{
  const chapter=READING_CHAPTERS.find(c=>c.id==='crown')!;
  const round=makeReadingRound(chapter,false,()=>0);
  assert.equal(round.length,16);
  assert.deepEqual(round.filter(task=>task.kind==='read').map(task=>task.word),chapter.words);
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.kind)),new Set(['meaning','build','listen','repair']));
  assert.deepEqual(new Set(round.filter(task=>task.kind!=='read').map(task=>task.word)),new Set(chapter.words));
  assert.equal(makeReadingRound(chapter,true,()=>0).length,8);
});
test('unclear audio is unassessed and a different long-vowel word cannot match a short one',()=>{
  assert.equal(readingEvidenceResult('uncertain'),'unclear');
  assert.equal(readingEvidenceResult('unavailable'),'unavailable');
  const metadata=[{avg_logprob:-.2,no_speech_prob:.02,compression_ratio:1}];
  assert.equal(judgeCvcWord('cap','cape',metadata).status,'different');
  assert.equal(judgeCvcWord('cap','cap',[]).status,'uncertain');
});
