import test from 'node:test';
import assert from 'node:assert/strict';
import { orchardMatch,placeTrainTile,addSpokenStation,bookOneAction,firstGateShowsWordModel } from '../src/app/components/firstGateLogic.ts';
import { readFileSync } from 'node:fs';

test('Book 1 reveals listening, response and continuation in order without modeling checkpoints',()=>{
  assert.equal(bookOneAction(false,false,false),'listen');
  assert.equal(bookOneAction(true,false,false),'respond');
  assert.equal(bookOneAction(true,true,false),'continue');
  assert.equal(bookOneAction(false,false,true),'respond');
  assert.equal(bookOneAction(false,true,true),'continue');
  assert.equal(bookOneAction(false,false,false,'meaning'),'respond');
  assert.equal(firstGateShowsWordModel('am'),true);
  assert.equal(firstGateShowsWordModel('at'),false);
  assert.equal(firstGateShowsWordModel('mat'),false);
});

test('orchard only matches taught picture anchors to their beginning letters',()=>{
  assert.equal(orchardMatch('mango','m'),true);
  assert.equal(orchardMatch('apple','t'),false);
  assert.equal(orchardMatch('moon','m'),false);
});
test('train placement rejects occupied, duplicate, unknown and invalid drops',()=>{
  const slots=[null,'1',null];const ids=['0','1','2'];
  assert.deepEqual(placeTrainTile(slots,ids,'0','0'),['0','1',null]);
  for(const [id,target] of [['1','0'],['0','1'],['3','2'],['0','-1'],['0','3'],['0',''],['0','m']])assert.equal(placeTrainTile(slots,ids,id,target),null);
  assert.deepEqual(slots,[null,'1',null]);
});
test('only a recognized taught word advances the train, once per word',()=>{
  for(const status of ['different','uncertain','unavailable','skipped'])assert.deepEqual(addSpokenStation(['am'],'at',status),['am']);
  assert.deepEqual(addSpokenStation(['am'],'am','matched'),['am']);
  assert.deepEqual(addSpokenStation(['am'],'at','matched'),['am','at']);
  assert.deepEqual(addSpokenStation([],'cat','matched'),[]);
});

test('Book 1 uses direct sound-tile dragging, compact replay and visible train travel',()=>{
  const blend=readFileSync(new URL('../src/app/components/ChronicleBlendLesson.tsx',import.meta.url),'utf8');
  const journey=readFileSync(new URL('../src/app/components/ReadingJourney.tsx',import.meta.url),'utf8');
  const soundLesson=readFileSync(new URL('../src/app/components/SoundLearningCamp.tsx',import.meta.url),'utf8');
  const train=readFileSync(new URL('../src/app/components/FirstGateGames.tsx',import.meta.url),'utf8');
  assert.match(blend,/data-blend-slot=\{i\}/);
  assert.match(blend,/document\.elementsFromPoint/);
  assert.match(blend,/layoutId=\{`blend-\$\{word\}-\$\{i\}`\}/);
  assert.match(blend,/Drag every colored tile into its dotted space/);
  assert.match(blend,/blend-word-dock/);
  assert.doesNotMatch(journey,/<audio controls/);
  assert.doesNotMatch(soundLesson,/<audio controls/);
  assert.match(soundLesson,/data-recording=\{recording\}/);
  assert.match(journey,/reading-voice-replay/);
  assert.match(journey,/reading-answer-banner/);
  assert.match(journey,/Correct! Milo heard/);
  assert.doesNotMatch(journey,/Milo heard “\$\{result\.transcript\}”/);
  assert.match(journey,/We can try this again/);
  assert.match(train,/gate-rail-progress/);
  assert.match(train,/Finish reached!/);
  assert.match(train,/Station \$\{count\} reached!/);
  assert.match(train,/trainStops=\[1,14,47,84\]/);
  assert.match(journey,/The word train reached the First Gate!/);
  assert.match(journey,/We can try this one again soon/);
  assert.match(journey,/setRetryQueue/);
  assert.match(journey,/reading-answer-banner/);
  assert.match(journey,/Saved on this device while online checkpoint storage is unavailable/);
});
