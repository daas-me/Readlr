import { useCallback, useEffect, useState } from 'react';
import { CURRICULUM_STATE_CHANGED, emptyLearnerCurriculumState, mergeLearnerCurriculumState, readLearnerCurriculumState, saveLearnerCurriculumState, type LearnerCurriculumState } from '../../hooks/learnerCurriculumState';

const API=import.meta.env.VITE_API_URL||'http://localhost:3000/api';
function hydrateLegacy(learnerId:number,state:LearnerCurriculumState) {
  localStorage.setItem(`readlr_aral_guided_v1_${learnerId}`,JSON.stringify(state.guidedStops));
  localStorage.setItem(`readlr_aral_carousel_v1_${learnerId}`,String(state.carouselFocus));
  Object.entries(state.guidedActivities).forEach(([key,done])=>{if(done){const split=key.indexOf(':');if(split>0)localStorage.setItem(`readlr_aral_activity_v1_${learnerId}_${key.slice(0,split)}_${key.slice(split+1)}`,'done');}});
  Object.entries(state.guidedRounds).forEach(([chapter,round])=>localStorage.setItem(`readlr_aral_round_v1_${learnerId}_${chapter}`,JSON.stringify(round)));
}
export function useLearnerCurriculumState(learnerId:number|null,token:string|null) {
  const [state,setState]=useState<LearnerCurriculumState>(()=>learnerId?readLearnerCurriculumState(learnerId):emptyLearnerCurriculumState());
  const [loading,setLoading]=useState(Boolean(learnerId&&token));
  const [message,setMessage]=useState('');
  const persist=useCallback(async(next:LearnerCurriculumState)=>{
    if(!learnerId||!token)return;
    try{const response=await fetch(`${API}/evidence/me/curriculum-state`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(next)});if(!response.ok)throw new Error();setMessage('');}
    catch{setMessage('Your latest activity is safe on this device and will sync when you reconnect.');}
  },[learnerId,token]);
  useEffect(()=>{
    if(!learnerId||!token){setState(emptyLearnerCurriculumState());setMessage('');setLoading(false);return;}
    const controller=new AbortController();setLoading(true);
    void fetch(`${API}/evidence/me/curriculum-state`,{headers:{Authorization:`Bearer ${token}`},signal:controller.signal}).then(async response=>{if(!response.ok)throw new Error();return response.json();}).then(remote=>{
      if(controller.signal.aborted)return;
      const merged=mergeLearnerCurriculumState(readLearnerCurriculumState(learnerId),remote as LearnerCurriculumState);
      saveLearnerCurriculumState(learnerId,merged,false);hydrateLegacy(learnerId,merged);setState(merged);void persist(merged);
    }).catch(()=>{if(!controller.signal.aborted){const local=readLearnerCurriculumState(learnerId);setState(local);setMessage('Using progress saved on this device.');}}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[learnerId,token,persist]);
  useEffect(()=>{
    if(!learnerId)return;
    let timer=0;
    const changed=(event:Event)=>{if((event as CustomEvent).detail?.learnerId!==learnerId)return;const next=readLearnerCurriculumState(learnerId);setState(next);window.clearTimeout(timer);timer=window.setTimeout(()=>void persist(next),450);};
    window.addEventListener(CURRICULUM_STATE_CHANGED,changed);return()=>{window.removeEventListener(CURRICULUM_STATE_CHANGED,changed);window.clearTimeout(timer);};
  },[learnerId,persist]);
  return {state,loading,message};
}
