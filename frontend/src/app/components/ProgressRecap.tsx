import { useEffect, useState } from 'react';
import { BookOpen, Footprints, Mic, Star, Sticker, X } from 'lucide-react';
import { loadRecap, sessionGain, showWeekly, type Recap, type RecapTotals } from '../../hooks/recap';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import './progressRecap.css';

export interface NextBook { number:number; title:string; teaser:string }
const plural=(n:number,one:string,many:string)=>`${n} ${n===1?one:many}`;
const read=(store:Storage,key:string)=>{try{return store.getItem(key);}catch{return null;}};
const write=(store:Storage,key:string,value:string)=>{try{store.setItem(key,value);}catch{/* Recaps are optional. */}};

function Tally({totals}:{totals:RecapTotals}) {
  const rows=[
    {icon:Footprints,value:totals.stops,label:plural(totals.stops,'stop finished','stops finished')},
    {icon:Mic,value:totals.words,label:plural(totals.words,'word read aloud','words read aloud')},
    {icon:Sticker,value:totals.stickers,label:plural(totals.stickers,'new sticker','new stickers')},
    {icon:BookOpen,value:totals.booksPassed,label:plural(totals.booksPassed,'book completed','books completed')},
  ].filter(row=>row.value>0);
  return <ul className="recap-tally">{rows.map(({icon:Icon,label})=><li key={label}><Icon aria-hidden="true"/>{label}</li>)}</ul>;
}

// Session summary (REQ-307) when the learner comes back home after playing, and a weekly summary (REQ-308) once a week.
export function ProgressRecap({learnerId,enabled=true,next}:{learnerId?:number|null;enabled?:boolean;next:NextBook|null}) {
  const [recap,setRecap]=useState<Recap|null>(null);
  const [gain,setGain]=useState<RecapTotals|null>(null);
  const [weeklyOpen,setWeeklyOpen]=useState(false);
  useEffect(()=>{
    if(!enabled||!learnerId)return;
    const controller=new AbortController();
    void loadRecap(controller.signal).then(result=>{
      if(controller.signal.aborted||!result)return;
      const sessionKey=`readlr_recap_seen_v1_${learnerId}`;
      let before=null;
      try{before=JSON.parse(read(sessionStorage,sessionKey)??'null');}catch{before=null;}
      setGain(sessionGain(before,result.today));
      write(sessionStorage,sessionKey,JSON.stringify(result.today));
      setRecap(result);
      setWeeklyOpen(showWeekly(result,read(localStorage,`readlr_week_recap_v1_${learnerId}`)));
    }).catch(()=>undefined);
    return()=>controller.abort();
  },[enabled,learnerId]);
  const closeWeekly=()=>{if(recap&&learnerId)write(localStorage,`readlr_week_recap_v1_${learnerId}`,recap.lastWeek.start);setWeeklyOpen(false);};
  if(!enabled||!recap)return null;
  return <>
    {gain&&!weeklyOpen&&<section className="session-recap" aria-label="What you just did" role="status">
      <Star className="session-recap-star" aria-hidden="true" fill="currentColor"/>
      <div><strong>You did it!</strong><Tally totals={gain}/>
        {next&&<p className="recap-next"><b>Next adventure:</b> Book {next.number}, {next.title}. <span>{next.teaser}</span></p>}</div>
      <button className="recap-close" onClick={()=>setGain(null)} aria-label="Close summary"><X/></button>
    </section>}
    <Dialog open={weeklyOpen} onOpenChange={open=>{if(!open)closeWeekly();}}>
      <DialogContent className="weekly-recap">
        <Star className="weekly-recap-star" aria-hidden="true" fill="currentColor"/>
        <DialogTitle>Your reading week!</DialogTitle>
        <DialogDescription>Here is what you did last week.</DialogDescription>
        <Tally totals={recap.lastWeek}/>
        {recap.lastWeek.dailyStars>0&&<p className="weekly-recap-stars" aria-label={plural(recap.lastWeek.dailyStars,'daily star','daily stars')}>{Array.from({length:Math.min(7,recap.lastWeek.dailyStars)},(_,i)=><Star key={i} aria-hidden="true" fill="currentColor"/>)}<span>{plural(recap.lastWeek.dailyStars,'daily star','daily stars')}</span></p>}
        {next&&<p className="recap-next"><b>Next adventure:</b> Book {next.number}, {next.title}.</p>}
        <button className="weekly-recap-go" onClick={closeWeekly}>Let's read!</button>
      </DialogContent>
    </Dialog>
  </>;
}
