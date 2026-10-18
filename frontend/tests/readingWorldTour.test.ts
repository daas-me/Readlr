import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shouldShowWorldTour, WORLD_TOUR_COMPLETED } from '../src/hooks/readingWorldTour.ts';
import { emptyLearnerCurriculumState, mergeLearnerCurriculumState, curriculumUnlocks } from '../src/hooks/learnerCurriculumState.ts';
import { SOUND_CARDS } from '../src/app/components/aralCurriculum.ts';

test('new learners receive a world tour without granting lesson completion',()=>{
  const fresh=emptyLearnerCurriculumState();
  assert.equal(shouldShowWorldTour(fresh),true);
  const toured={...fresh,guidedActivities:{[WORLD_TOUR_COMPLETED]:true}};
  assert.equal(shouldShowWorldTour(toured),false);
  assert.deepEqual(curriculumUnlocks(toured,[]),curriculumUnlocks(fresh,[]));
  assert.equal(shouldShowWorldTour(mergeLearnerCurriculumState(toured,fresh)),false);
  assert.equal(shouldShowWorldTour({...fresh,campOrientationStep:1}),false);
  assert.equal(shouldShowWorldTour({...fresh,guidedStops:['gate:mango']}),false);
  assert.equal(shouldShowWorldTour(emptyLearnerCurriculumState()),true);
});

test('all Camp sound cards have dedicated new object illustrations',()=>{
  const objects=readFileSync(new URL('../src/app/components/CampObjectArt.tsx',import.meta.url),'utf8');
  const stickers=readFileSync(new URL('../src/app/components/RewardStickerArt.tsx',import.meta.url),'utf8');
  for(const {word} of SOUND_CARDS){
    assert.ok((['mango','apple','top'].includes(word)?stickers:objects).includes(`${word}:<>`),`Missing artwork: ${word}`);
  }
  for(const name of ['ReadingAnchorArt','CvcArt']){
    const source=readFileSync(new URL(`../src/app/components/${name}.tsx`,import.meta.url),'utf8');
    assert.match(source,/<CampObjectArt word=/);
  }
});

test('tour uses a clear spotlight and replays Camp without lowering saved progress',()=>{
  const tour=readFileSync(new URL('../src/app/components/ReadingWorldTour.tsx',import.meta.url),'utf8');
  assert.match(tour,/polygon\(evenodd/);
  assert.match(tour,/ResizeObserver/);
  assert.match(tour,/clipPath:layout.clip/);
  const app=readFileSync(new URL('../src/app/App.tsx',import.meta.url),'utf8');
  assert.match(app,/<CampOrientation learnerId=\{learnerId\} replay/);
  const camp=readFileSync(new URL('../src/app/components/CampOrientation.tsx',import.meta.url),'utf8');
  assert.match(camp,/Math.max\(saved,progress\)/);
  assert.match(camp,/recorder.capture/);
  assert.match(camp,/Practise without a microphone/);
  assert.match(camp,/URL.revokeObjectURL/);
  assert.match(camp,/<Dialog open=\{micOpen\}/);
  assert.match(camp,/Skip this practice/);
  assert.match(camp,/run!==micRun.current/);
  assert.match(camp,/\{complete&&<div className="camp-orientation-actions"/);
  assert.match(camp,/Try my microphone \(optional\)/);
  assert.doesNotMatch(camp,/complete&&\(mic==='ready'\|\|mic==='skipped'\)/);
});

test('avatar editor contains the border picker without repeated wear labels',()=>{
  const profile=readFileSync(new URL('../src/app/components/ProfilePage.tsx',import.meta.url),'utf8');
  assert.doesNotMatch(profile,/Ready to wear|Wear this border|Wearing now/);
  const editor=profile.slice(profile.indexOf('{isPickingAvatar &&'),profile.indexOf('{/* Account info */}'));
  assert.match(editor,/avatars.map/);
  assert.match(editor,/frames.map/);
});
