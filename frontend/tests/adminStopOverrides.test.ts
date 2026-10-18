import test from 'node:test';
import assert from 'node:assert/strict';
import { chronicleStopLocked } from '../src/app/components/chronicleRoute.ts';
import { adminReadingStops } from '../src/app/components/adminReadingStops.ts';
import { READING_CHAPTERS } from '../src/app/components/aralCurriculum.ts';
import { READING_STOPS } from '../../backend/src/modules/evidence/reading-stops.ts';

test('admin and backend stop catalogues match all ten books',()=>{
  READING_CHAPTERS.forEach((book,index)=>assert.deepEqual(adminReadingStops(index).map(stop=>stop.id),READING_STOPS[book.id]));
});
test('individual override opens only the chosen blocked stop, including the gate',()=>{
  const stops=adminReadingStops(0).map(stop=>({...stop,done:false}));
  const access={available:true,completed:false,reviewMode:false,practiceDone:false,challengesOpen:false,openStops:['check']};
  assert.deepEqual(stops.map((_,i)=>chronicleStopLocked(stops,i,access)),[false,true,true,true,true,false]);
  assert.ok(stops.every(stop=>!stop.done));
  assert.equal(chronicleStopLocked(stops,5,{...access,openStops:[]}),true);
  assert.equal(chronicleStopLocked(stops,5,{...access,available:false}),true);
});
