import { READING_CHAPTERS } from '../app/components/aralCurriculum.ts';
import { curriculumStateKey, patchLearnerCurriculumState, readLearnerCurriculumState } from './learnerCurriculumState.ts';

const key=(learnerId:number)=>`readlr_aral_reading_v1_${learnerId}`;
const guidedKey=(learnerId:number)=>`readlr_aral_guided_v1_${learnerId}`;
const blendKey=(learnerId:number,chapter:number)=>`readlr_aral_blend_v1_${learnerId}_${chapter}`;
const activityKey=(learnerId:number,chapter:string,activity:string)=>`readlr_aral_activity_v1_${learnerId}_${chapter}_${activity}`;
const roundKey=(learnerId:number,chapter:string)=>`readlr_aral_round_v1_${learnerId}_${chapter}`;
const accessKey=(learnerId:number)=>`readlr_aral_book_access_v1_${learnerId}`;
const carouselKey=(learnerId:number)=>`readlr_aral_carousel_v1_${learnerId}`;
const unlockTransitionKey=(learnerId:number)=>`readlr_aral_book_unlock_v1_${learnerId}`;
const chapterIds=new Set(READING_CHAPTERS.map(chapter=>chapter.id));

export interface ReadingAccessSnapshot {completed:string[];available:string[];openChallenges:number[]}

export function readReadingCarouselFocus(learnerId:number|null|undefined) {
  if(learnerId===null||learnerId===undefined)return null;
  try{
    const stored=localStorage.getItem(carouselKey(learnerId));
    if(stored===null){
      if(localStorage.getItem(curriculumStateKey(learnerId))===null)return null;
      const value=readLearnerCurriculumState(learnerId).carouselFocus;
      return Number.isInteger(value)&&value>=0&&value<READING_CHAPTERS.length?value:null;
    }
    const value=Number(stored);
    return Number.isInteger(value)&&value>=0&&value<READING_CHAPTERS.length?value:null;
  }catch{return null;}
}

export function saveReadingCarouselFocus(learnerId:number|null|undefined,index:number) {
  if(learnerId===null||learnerId===undefined)return;
  const safe=Math.max(0,Math.min(READING_CHAPTERS.length-1,Math.floor(index)));
  try{localStorage.setItem(carouselKey(learnerId),String(safe));}catch{}
  try{patchLearnerCurriculumState(learnerId,{carouselFocus:safe});}catch{}
}

export interface ReadingBookUnlockTransition {from:number;to:number}

export function queueReadingBookUnlock(learnerId:number|null|undefined,from:number,to:number) {
  if(learnerId===null||learnerId===undefined)return;
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to!==from+1||to>=READING_CHAPTERS.length)return;
  try{localStorage.setItem(unlockTransitionKey(learnerId),JSON.stringify({from,to}));}catch{}
}

export function consumeReadingBookUnlock(learnerId:number|null|undefined):ReadingBookUnlockTransition|null {
  if(learnerId===null||learnerId===undefined)return null;
  try{
    const storageKey=unlockTransitionKey(learnerId);
    const parsed=JSON.parse(localStorage.getItem(storageKey)||'null');
    localStorage.removeItem(storageKey);
    return parsed&&Number.isInteger(parsed.from)&&Number.isInteger(parsed.to)&&parsed.from>=0&&parsed.to===parsed.from+1&&parsed.to<READING_CHAPTERS.length?parsed:null;
  }catch{return null;}
}

export function readReadingAccessSnapshot(learnerId:number):ReadingAccessSnapshot|null {
  try{
    const parsed=JSON.parse(localStorage.getItem(accessKey(learnerId))||'null');
    if(!parsed||!Array.isArray(parsed.completed)||!Array.isArray(parsed.available)||!Array.isArray(parsed.openChallenges))return null;
    const completed=[...new Set<string>((parsed.completed as unknown[]).filter((id:unknown):id is string=>typeof id==='string'&&chapterIds.has(id)))];
    const available=[...new Set<string>((parsed.available as unknown[]).filter((id:unknown):id is string=>typeof id==='string'&&chapterIds.has(id)))];
    const openChallenges=[...new Set<number>((parsed.openChallenges as unknown[]).filter((book:unknown):book is number=>typeof book==='number'&&Number.isInteger(book)&&book>=1&&book<=READING_CHAPTERS.length))];
    return {completed,available,openChallenges};
  }catch{return null;}
}

export function saveReadingAccessSnapshot(learnerId:number,snapshot:ReadingAccessSnapshot) {
  const known={
    completed:[...new Set(snapshot.completed.filter(id=>chapterIds.has(id)))],
    available:[...new Set(snapshot.available.filter(id=>chapterIds.has(id)))],
    openChallenges:[...new Set(snapshot.openChallenges.filter(book=>Number.isInteger(book)&&book>=1&&book<=READING_CHAPTERS.length))],
  };
  localStorage.setItem(accessKey(learnerId),JSON.stringify(known));
  return known;
}

export function readLocalReadingProgress(learnerId:number) {
  try {
    const parsed=JSON.parse(localStorage.getItem(key(learnerId))||'[]');
    if(!Array.isArray(parsed))return [];
    const completed=new Set(parsed.filter((id):id is string=>typeof id==='string'));
    const ordered:string[]=[];
    for(const chapter of READING_CHAPTERS){if(!completed.has(chapter.id))break;ordered.push(chapter.id);}
    return ordered;
  } catch { return []; }
}

export function completeLocalReadingChapter(learnerId:number,chapterId:string) {
  const completed=[...new Set([...readLocalReadingProgress(learnerId),chapterId])];
  localStorage.setItem(key(learnerId),JSON.stringify(completed));
  return completed;
}

export function availableLocalReadingChapters(completed:string[]) {
  const next=Math.min(completed.length,READING_CHAPTERS.length-1);
  return READING_CHAPTERS.slice(0,next+1).map(chapter=>chapter.id);
}

export function readGuidedReadingStops(learnerId:number) {
  try {
    const parsed=JSON.parse(localStorage.getItem(guidedKey(learnerId))||'[]');
    return Array.isArray(parsed)?[...new Set(parsed.filter((stop):stop is string=>typeof stop==='string'&&stop.length>0))]:[];
  } catch { return []; }
}

export function saveGuidedReadingStop(learnerId:number,stop:string) {
  const visited=[...new Set([...readGuidedReadingStops(learnerId),stop])];
  localStorage.setItem(guidedKey(learnerId),JSON.stringify(visited));
  patchLearnerCurriculumState(learnerId,{guidedStops:visited});
  return visited;
}

export function readGuidedBlendStep(learnerId:number,chapter:number) {
  const value=Number(localStorage.getItem(blendKey(learnerId,chapter))||0);
  return Number.isInteger(value)&&value>=0&&value<20?value:0;
}

export function saveGuidedBlendStep(learnerId:number,chapter:number,step:number) {
  localStorage.setItem(blendKey(learnerId,chapter),String(Math.max(0,Math.floor(step))));
}

export function clearGuidedBlendStep(learnerId:number,chapter:number) {
  localStorage.removeItem(blendKey(learnerId,chapter));
}

export function readGuidedActivity(learnerId:number,chapter:string,activity:string) {
  try{return localStorage.getItem(activityKey(learnerId,chapter,activity))==='done';}catch{return false;}
}

export function saveGuidedActivity(learnerId:number,chapter:string,activity:string) {
  localStorage.setItem(activityKey(learnerId,chapter,activity),'done');
  const state=readLearnerCurriculumState(learnerId);
  patchLearnerCurriculumState(learnerId,{guidedActivities:{...state.guidedActivities,[`${chapter}:${activity}`]:true}});
}

export function clearGuidedActivity(learnerId:number,chapter:string,activity:string) {
  localStorage.removeItem(activityKey(learnerId,chapter,activity));
}

export interface GuidedRoundStep {step:number;spoken:string[]}
export function readGuidedRoundStep(learnerId:number,chapter:string):GuidedRoundStep|null {
  try{
    const parsed=JSON.parse(localStorage.getItem(roundKey(learnerId,chapter))||'null');
    if(!parsed||!Number.isInteger(parsed.step)||parsed.step<0||parsed.step>50||!Array.isArray(parsed.spoken))return null;
    return {step:parsed.step,spoken:[...new Set<string>(parsed.spoken.filter((word:unknown):word is string=>typeof word==='string'&&word.length<=20))]};
  }catch{return null;}
}
export function saveGuidedRoundStep(learnerId:number,chapter:string,state:GuidedRoundStep) {
  localStorage.setItem(roundKey(learnerId,chapter),JSON.stringify(state));
  const curriculum=readLearnerCurriculumState(learnerId);
  patchLearnerCurriculumState(learnerId,{guidedRounds:{...curriculum.guidedRounds,[chapter]:state}});
}
export function clearGuidedRoundStep(learnerId:number,chapter:string) {
  localStorage.removeItem(roundKey(learnerId,chapter));
}
