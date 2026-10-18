import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, Crown, Flag, Lock, Sparkles, Star, Zap } from "lucide-react";
import { VowelPowerSymbol } from "./VowelPowerSymbol";
import { CvcCrown } from "./CvcArt";
import { STICKERS, isStickerEarned } from "./stickers";
import { progressSummary } from "./progressSummary";
import { MyPractice } from "./MyPractice";
import { CurriculumProgress } from "./CurriculumProgress";
import { ChronicleCollection } from './ChronicleCollection';
import type { CurriculumSkillSummary } from "../../hooks/curriculumProgress";
import { earnedProgress } from './progressReset';
import { loadReadingProgress } from '../../hooks/readingCheckpoints';
import { readLocalReadingProgress } from '../../hooks/readingLocalProgress';
import "./rewardsCollection.css";
import "./readingProgress.css";

const STAGES=[
  {title:"Valley of Vowels",color:"#b45309",tint:"#fff3d0",icon:Star,skill:"Five vowel powers. Fifteen trails.",finish:"The valley is alive!"},
  {title:"Blending Bridges",color:"#6550c5",tint:"#eeeaff",icon:Zap,skill:"Two sounds become a team.",finish:"Every bridge is restored!"},
  {title:"CVC Kingdom",color:"#087f68",tint:"#ddf7eb",icon:Crown,skill:"Three sounds become a word.",finish:"The crown shines again!"},
];
export function UnifiedDashboard({learnerId,token,userName="Student",completedByStage={},curriculumEvidencePreview,onBack,onContinue,expandedKingdom=false}: {
  learnerId?:number|null;token?:string|null;userName?:string;completedByStage?:Record<number,number>;curriculumEvidencePreview?:CurriculumSkillSummary[];onBack?:()=>void;onContinue?:(stage:number)=>void;expandedKingdom?:boolean;
}) {
  const [tab,setTab]=useState<"journey"|"skills"|"milestones"|"practice">(curriculumEvidencePreview?"skills":"journey");
  const [readingCompleted,setReadingCompleted]=useState<number|null>(null);
  useEffect(()=>{
    if(!expandedKingdom||!learnerId)return;
    const controller=new AbortController();
    void loadReadingProgress(controller.signal).then(value=>{if(!controller.signal.aborted)setReadingCompleted(value.completed.length);}).catch(()=>{
      if(!controller.signal.aborted)setReadingCompleted(import.meta.env.DEV?readLocalReadingProgress(learnerId).length:null);
    });
    return()=>controller.abort();
  },[expandedKingdom,learnerId]);
  const summary=progressSummary(completedByStage);
  const rewardProgress=Object.fromEntries([1,2,3].map(stage=>[stage,Math.max(completedByStage[stage]??0,earnedProgress(learnerId)[stage]??0)]));
  const earned=STICKERS.filter(sticker=>isStickerEarned(sticker,rewardProgress));
  const stages=expandedKingdom?[summary.stages[0],summary.stages[1],readingCompleted??0]:summary.stages;
  const readingUnknown=expandedKingdom&&readingCompleted===null;
  const journeyTotal=expandedKingdom?readingCompleted??0:stages.reduce((sum,count)=>sum+count,0);
  const journeyMaximum=expandedKingdom?10:60;
  const finished=stages.filter((count,index)=>count===(expandedKingdom&&index===2?10:20)).length;
  const nextStage=expandedKingdom?(readingCompleted===10?0:3):stages.findIndex(count=>count<20)+1;
  const next=STAGES[(nextStage||3)-1];
  const nextCount=stages[(nextStage||3)-1];
  return <main className="rewards-page reading-progress"><div className="rewards-inner">
    <div className="rewards-topline">{onBack?<button className="rewards-back" onClick={onBack}><ArrowLeft size={17}/>Stages</button>:<span/>}<span><Flag size={17}/>My journey</span></div>
    <header className="rewards-heading"><div><p className="rewards-eyebrow">From first sounds to whole words</p><h1>{userName}'s Progress</h1></div><p>{journeyTotal===journeyMaximum?"Look how far your voice has taken you.":"One little step. A little more confidence."}</p></header>
    <section className="reading-summary" aria-label="Reading progress summary">
      <div className="reading-total"><span className="reading-completion" style={{"--completion":`${readingUnknown?0:journeyTotal/journeyMaximum*100}%`} as CSSProperties}><strong>{readingUnknown?'--':Math.round(journeyTotal/journeyMaximum*100)}{!readingUnknown&&<small>%</small>}</strong></span><div><h2>{readingUnknown?'Kingdom progress unavailable':`${journeyTotal} of ${journeyMaximum} ${expandedKingdom?'chapters':'activities'}`}</h2><p>{readingUnknown?'Completed Kingdom chapters will appear when available.':expandedKingdom?'Kingdom journey':`${finished} of 3 stages complete`}</p></div></div>
      <div className="reading-stat"><Star size={22}/><strong>{summary.vowels}<small>/ 5</small></strong><span>{expandedKingdom?'Earlier vowel powers':'Vowel powers'}</span></div>
      <div className="reading-stat"><Zap size={22}/><strong>{summary.bridges}<small>/ 15</small></strong><span>{expandedKingdom?'Earlier bridges restored':'Bridges restored'}</span></div>
      <div className="reading-stat"><BookOpen size={22}/><strong>{expandedKingdom?readingCompleted??'--':summary.words}<small>/ {expandedKingdom?10:19}</small></strong><span>{expandedKingdom?'Kingdom chapters':'Word challenges'}</span></div>
    </section>
    <nav className="rewards-tabs reading-tabs" aria-label="Progress views"><button aria-pressed={tab==="journey"} onClick={()=>setTab("journey")}>My journey</button><button aria-pressed={tab==="skills"} onClick={()=>setTab("skills")}>Camp skills</button><button aria-pressed={tab==="practice"} onClick={()=>setTab("practice")}>My Practice</button><button aria-pressed={tab==="milestones"} onClick={()=>setTab("milestones")}>My milestones<span>{earned.length}</span></button></nav>
    {tab==="skills"?<CurriculumProgress learnerId={learnerId} token={token} previewSkills={curriculumEvidencePreview}/>:tab==="practice"?<MyPractice learnerId={learnerId}/>:tab==="journey"?<>
      {expandedKingdom&&<ChronicleCollection learnerId={learnerId}/>}
      <div className="reading-stage-list">{(expandedKingdom?[]:STAGES).map((stage,index)=>{const count=stages[index];const maximum=20;const locked=index>0&&stages[index-1]<20&&count===0;const Icon=stage.icon;return <section key={stage.title} className={`reading-stage ${locked?"is-locked":""}`} style={{"--reward-color":stage.color,"--reward-tint":stage.tint} as CSSProperties}>
        <div className="reading-stage-art" aria-hidden="true">{index===0?<div className="reading-vowel-art"><VowelPowerSymbol vowel="A"/><VowelPowerSymbol vowel="E"/></div>:index===1?<div className="reading-blend-art"><b>m</b><b>a</b><span/></div>:<CvcCrown jewels={expandedKingdom?[3,6,10].filter(milestone=>count>=milestone).length:count===20?3:0}/>}</div>
        <div className="reading-stage-info"><p className="reading-stage-kicker"><Icon size={15}/>Stage {index+1}<span>{readingUnknown&&index===2?'Checking progress':count===maximum?<><Check size={14}/>Complete</>:locked?<><Lock size={14}/>Coming next</>:count===0?"Ready to begin":"In progress"}</span></p><h2>{stage.title}</h2><p>{count===maximum?stage.finish:expandedKingdom&&index===2?'Ten word quests from the gates to the crown.':stage.skill}</p><div className="reading-stage-count"><span>{readingUnknown&&index===2?'Not available':`${count} / ${maximum} ${expandedKingdom&&index===2?'chapters':'lessons'}`}</span><span>{readingUnknown&&index===2?'':count===maximum?"All done":`${maximum-count} to go`}</span></div><progress value={count} max={maximum} aria-label={`${stage.title} completion`}/>{expandedKingdom&&index===2&&summary.stages[2]>0&&<small>Earlier Kingdom journey: {summary.stages[2]} / 20 levels saved</small>}</div>
        {onContinue&&<button className="reading-stage-link" disabled={locked} onClick={()=>onContinue(index+1)}>{count===maximum?"Visit again":count?"Continue":"Start"}<ArrowRight size={18}/></button>}
      </section>;})}</div>
      <section className="reading-next"><Sparkles size={27}/><div><p>{nextStage?"Your next little step":"Your reading adventure"}</p><h2>{nextStage?next.title:expandedKingdom?"The crown is restored!":"All three stages complete!"}</h2><span>{nextStage?`${expandedKingdom&&nextStage===3?'Chapter':'Lesson'} ${nextCount+1} is waiting for you.`:"Vowel powers, sound teams, and word magic. All yours."}</span></div>{onContinue&&<button className="rewards-back" onClick={()=>onContinue(nextStage||3)}>{nextStage?"Keep going":"Visit the kingdom"}<ArrowRight size={18}/></button>}</section>
    </>:<section className="reading-milestones" aria-label="Earned milestones"><header><h2>Your collected memories</h2><p>{earned.length} of {STICKERS.length} stickers earned</p></header>{earned.length===0?<div className="rewards-empty"><Award size={40}/><h2>Your story is just beginning</h2><p>Complete your first vowel lesson to earn your first sticker.</p></div>:<div>{earned.map(sticker=><article key={sticker.id}><span aria-hidden="true">{sticker.emoji}</span><div><h3>{sticker.name}</h3><p>{STAGES[sticker.stageId-1].title} / Level {sticker.at}</p></div><Check size={17}/></article>)}</div>}</section>}
  </div></main>;
}
