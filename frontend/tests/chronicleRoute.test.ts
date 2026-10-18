import test from 'node:test';
import assert from 'node:assert/strict';
import { chronicleStopLocked, trailLayout, trailPageSegments, trailSegments } from '../src/app/components/chronicleRoute.ts';

const access={available:true,completed:false,reviewMode:false,practiceDone:false,challengesOpen:false};

test('every book unlocks exactly one new stop at a time',()=>{
  const bookOne=['mango','apple','top','blend','games','check'].map(id=>({id,done:false}));
  const bookTwo=['sun','egg','log','igloo','blend','games','check'].map(id=>({id,done:false}));
  assert.deepEqual(bookOne.map((_,index)=>chronicleStopLocked(bookOne,index,access)),[false,true,true,true,true,true]);
  assert.deepEqual(bookTwo.map((_,index)=>chronicleStopLocked(bookTwo,index,access)),[false,true,true,true,true,true,true]);
  bookOne[0].done=true;
  bookTwo[0].done=true;
  assert.deepEqual(bookOne.map((_,index)=>chronicleStopLocked(bookOne,index,access)),[false,false,true,true,true,true]);
  assert.deepEqual(bookTwo.map((_,index)=>chronicleStopLocked(bookTwo,index,access)),[false,false,true,true,true,true,true]);
});

test('the final gate waits for practice while completed books remain replayable',()=>{
  const stops=['sun','egg','log','igloo','blend','games','check'].map(id=>({id,done:id!=='check'}));
  assert.equal(chronicleStopLocked(stops,6,access),true);
  assert.equal(chronicleStopLocked(stops,6,{...access,practiceDone:true}),false);
  assert.ok(stops.every((_,index)=>!chronicleStopLocked(stops,index,{...access,completed:true})));
});

test('teacher whole-book access opens every stop without completing them',()=>{
  const stops=['sun','egg','log','igloo','blend','games','check'].map((id,index)=>({id,done:index===0}));
  const teacherAccess={...access,challengesOpen:true};
  assert.equal(chronicleStopLocked(stops,1,teacherAccess),false);
  assert.ok(stops.every((_,index)=>!chronicleStopLocked(stops,index,teacherAccess)));
  assert.equal(stops.filter(stop=>stop.done).length,1);
});

test('a trail grows only after its starting stop is completed',()=>{
  const routes=trailSegments([{locked:false,done:true},{locked:false,done:false},{locked:true,done:false}]);
  assert.deepEqual(routes.map(route=>route.unlocked),[true,false]);
  assert.deepEqual(routes.map(route=>route.active),[true,false]);
});
test('trail only connects existing stops, without dangling page-edge roads',()=>{
  assert.equal(trailSegments([{locked:false,done:false}]).length,0);
  const routes=trailSegments([{locked:false,done:false},{locked:false,done:false}]);
  assert.equal(routes.length,1);
  assert.ok(routes[0].path.startsWith('M153 173'));
  assert.ok(routes[0].path.endsWith('450 144'));
});
test('trail layouts are stable, varied, and always move left to right',()=>{
  const first=trailLayout(0,0,3);
  assert.equal(first.length,3);
  assert.deepEqual(first,trailLayout(0,0,3));
  assert.equal(new Set(first.map(point=>point.x)).size,3);
  assert.equal(new Set(first.map(point=>point.y)).size,3);
  assert.ok(first[0].x<first[1].x&&first[1].x<first[2].x);
  const layouts=Array.from({length:10},(_,chapter)=>trailLayout(chapter,chapter%3,3));
  assert.ok(new Set(layouts.map(layout=>layout.map(point=>point.y).join(','))).size>1);
  assert.ok(layouts.every(layout=>layout[0].x<layout[1].x&&layout[1].x<layout[2].x));
});

test('completed trail segments stay lit while only the newest segment travels',()=>{
  const routes=trailSegments([{locked:false,done:true},{locked:false,done:true},{locked:false,done:false}]);
  assert.equal(routes[0].completed,true);
  assert.equal(routes[0].active,false);
  assert.equal(routes[1].completed,false);
  assert.equal(routes[1].active,true);
});

test('adjacent trail pages meet at one continuous edge position',()=>{
  const firstStops=[{locked:false,done:true},{locked:false,done:true},{locked:false,done:true}];
  const secondStops=[{locked:false,done:false},{locked:true,done:false},{locked:true,done:false}];
  const first=trailPageSegments(firstStops,trailLayout(0,0,3),{hasPrevious:false,hasNext:true,previousDone:false,nextDone:false});
  const second=trailPageSegments(secondStops,trailLayout(0,1,3),{hasPrevious:true,hasNext:false,previousDone:true,nextDone:false});
  assert.ok(first.at(-1)?.path.endsWith('922 180'));
  assert.ok(second[0].path.startsWith('M-22 180'));
  assert.equal(first.at(-1)?.active,true);
  assert.equal(second[0].completed,true);
});

test('a final single-stop page receives the trail from the previous page',()=>{
  const final=trailPageSegments([{locked:true,done:false}],trailLayout(1,2,1),{hasPrevious:true,hasNext:false,previousDone:true,nextDone:false});
  assert.equal(final.length,1);
  assert.ok(final[0].path.startsWith('M-22 180'));
  assert.equal(final[0].revealed,true);
});
