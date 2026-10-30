import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, GripVertical, Headphones, Sparkles } from 'lucide-react';
import { CharacterCompanion } from './CharacterCompanion';
import { ReadingAnchorArt } from './ReadingAnchorArt';
import { patchLearnerCurriculumState, readLearnerCurriculumState } from '../../hooks/learnerCurriculumState';
import './campOrientation.css';
import './campMicCheck.css';
import { useCvcRecorder } from '../../hooks/useCvcRecorder';
import { useBridgeAudio } from '../../hooks/useBridgeAudio';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

const lessons=[
  {title:'Tap the sound',copy:'Words are made of sounds. Tap m, the first sound in mango.',answer:['m']},
  {title:'Slide sounds forward',copy:'Drag m, then a, into the dotted spaces to build ma.',answer:['m','a']},
  {title:'Try the reverse',copy:'Now drag a, then m. The order changes the blend to am.',answer:['a','m']},
];
export function CampOrientation({learnerId,onReady,replay=false}:{learnerId:number;onReady:()=>void;replay?:boolean}) {
  const initial=replay?0:Math.min(2,readLearnerCurriculumState(learnerId).campOrientationStep);
  const recorder=useCvcRecorder(),audio=useBridgeAudio();
  const [micOpen,setMicOpen]=useState(false);
  const micRun=useRef(0);
  const closeMic=()=>{micRun.current++;recorder.stop();audio.stop();setMicOpen(false);setMic(current=>current==='recording'?'idle':current);};
  const [mic,setMic]=useState<'idle'|'recording'|'ready'|'skipped'|'error'>('idle');
  const [micMessage,setMicMessage]=useState(''),[remaining,setRemaining]=useState(0);
  const recording=useRef(''),alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;if(recording.current)URL.revokeObjectURL(recording.current);};},[]);
  const testMic=async()=>{
    const run=++micRun.current;
    audio.stop();setMic('recording');setRemaining(0);setMicMessage('Allow microphone access when your browser asks.');
    try{
      const blob=await recorder.capture(tick=>{setRemaining(tick);setMicMessage('Your turn! Say the sound or blend on the page.');},async()=>{});
      if(!alive.current||run!==micRun.current)return;
      if(recording.current)URL.revokeObjectURL(recording.current);
      recording.current=URL.createObjectURL(blob);setMic('ready');setMicMessage('We heard sound! Play it back to check that you can hear your voice. This is practice, not a score.');
    }catch(error){if(alive.current&&run===micRun.current){setMic('error');setMicMessage(error instanceof Error&&error.name==='NotAllowedError'?'Microphone permission was not allowed. Ask a grown-up to enable it, or practise without a microphone.':error instanceof Error?error.message:'Please check your microphone and try again.');}}
  };
  const [step,setStep]=useState(initial),[slots,setSlots]=useState<string[]>([]),[dragging,setDragging]=useState(''),[message,setMessage]=useState('');
  const lesson=lessons[step],complete=slots.join('')===lesson.answer.join('');
  const place=(letter:string)=>{if(complete||slots.length>=lesson.answer.length)return;if(letter!==lesson.answer[slots.length]){setMessage('Try the other sound in this space.');return;}setSlots([...slots,letter]);setMessage('That sound fits!');};
  const next=()=>{audio.stop();const saved=readLearnerCurriculumState(learnerId).campOrientationStep;const progress=Math.min(3,step+1);patchLearnerCurriculumState(learnerId,{campOrientationStep:Math.max(saved,progress)});if(progress===3){if(saved<3)localStorage.setItem(`readlr_camp_unlock_v1_${learnerId}`,'ready');onReady();return;}setStep(progress);setSlots([]);setMessage('');setMic('idle');setMicMessage('');if(recording.current){URL.revokeObjectURL(recording.current);recording.current='';}};
  return <main className="camp-orientation"><div className="camp-orientation-table" aria-hidden="true"><i/><i/><i/></div><section className="camp-orientation-card">
    <header><CharacterCompanion state={complete?'celebrating':'encouraging'} gesture="point" size={112}/><div><p>Welcome to Learning Camp</p><h1>{lesson.title}</h1><span>{step+1} of 3</span></div></header>
    <div className="camp-orientation-progress" aria-label={`Orientation ${step+1} of 3`}>{lessons.map((_,index)=><i key={index} className={index<=step?'is-ready':''}/>)}</div>
    <p className="camp-orientation-copy">{lesson.copy}</p>
    {step===0?<div className="camp-tap-challenge"><ReadingAnchorArt word="mango"/><div>{['a','m','t'].map(letter=><button key={letter} disabled={complete} onClick={()=>{if(letter==='m'){setSlots(['m']);setMessage('You found the first sound in mango!');}else setMessage('Listen again: mmmango starts with m.');}}>{letter}</button>)}</div></div>:
      <div className="camp-drag-challenge"><div className="camp-drag-slots" onDragOver={event=>event.preventDefault()} onDrop={()=>{if(dragging)place(dragging);setDragging('');}}>{lesson.answer.map((_,index)=><span key={index} className={slots[index]?'is-filled':''}>{slots[index]||'Drop here'}</span>)}</div><div className="camp-drag-tiles">{[...lesson.answer].reverse().map((letter,index)=><button draggable onDragStart={()=>setDragging(letter)} onClick={()=>place(letter)} key={`${letter}-${index}`} disabled={complete||slots.length>=lesson.answer.length}><GripVertical/>{letter}</button>)}</div><small>Drag a tile, or tap it, to place it.</small></div>}
    <p className="camp-orientation-message" role="status">{message||<><Headphones/> Milo will guide every challenge one step at a time.</>}</p>
    {complete&&<div className="camp-orientation-actions"><button className="world-primary camp-orientation-next" onClick={next}>{step===2?<><Sparkles/>{replay?'Explore Learning Camp':'Unlock Learning Camp'}</>:<><CheckCircle2/>Next practice</>}<ArrowRight/></button><button className="camp-optional-mic" onClick={()=>setMicOpen(true)}><Headphones/>Try my microphone (optional)</button></div>}
    <Dialog open={micOpen} onOpenChange={open=>{if(!open)closeMic();}}><DialogContent className="camp-mic-dialog"><DialogTitle>Say {lesson.answer.join('')}</DialogTitle><DialogDescription>Allow microphone access, then wait for your turn. Say {lesson.answer.join('')} once.</DialogDescription><section className="camp-mic-check" aria-label="Microphone practice"><button disabled={mic==='recording'} onClick={()=>void testMic()}>{mic==='recording'?(remaining?`Recording: ${remaining}`:'Waiting for microphone...'):'Check my microphone'}</button>{mic==='ready'&&<button onClick={()=>void audio.play(recording.current).catch(()=>setMicMessage('Playback could not start. Check your volume and try again.'))}>Hear my voice</button>}<p role="status">{micMessage}</p><button onClick={()=>{closeMic();if(mic!=='ready')setMic('skipped');}}>{mic==='ready'?'Continue':'Practise without a microphone'}</button></section></DialogContent></Dialog>
    <button className="camp-skip-practice" onClick={()=>{closeMic();const saved=readLearnerCurriculumState(learnerId);patchLearnerCurriculumState(learnerId,{campOrientationStep:3,guidedActivities:{...saved.guidedActivities,...Object.fromEntries(lessons.slice(step).map((_,offset)=>[`camp-orientation:skipped:${step+offset}`,true]))}});if(saved.campOrientationStep<3)localStorage.setItem(`readlr_camp_unlock_v1_${learnerId}`,'ready');onReady();}}>Skip orientation and open Book 1</button>
  </section></main>;
}
