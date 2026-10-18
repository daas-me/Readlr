import { useEffect, useState } from 'react';
import { Check, BookOpen, LockKeyhole, Sparkles } from 'lucide-react';
import { loadReadingProgress } from '../../hooks/readingCheckpoints';
import { readLocalReadingProgress } from '../../hooks/readingLocalProgress';
import { READING_CHAPTERS } from './aralCurriculum';
import { CHRONICLES } from './chronicleContent';
import { LandmarkArt } from './AdventureArt';

export function ChronicleCollection({learnerId}:{learnerId?:number|null}) {
  const [completed,setCompleted]=useState<string[]|null>(null);
  const [local,setLocal]=useState(false);
  useEffect(()=>{
    setCompleted(null);setLocal(false);
    if(!learnerId)return;
    const controller=new AbortController();
    void loadReadingProgress(controller.signal).then(p=>{if(!controller.signal.aborted)setCompleted(p.completed);}).catch(()=>{
      if(!controller.signal.aborted&&import.meta.env.DEV){setCompleted(readLocalReadingProgress(learnerId));setLocal(true);}
    });
    return()=>controller.abort();
  },[learnerId]);
  return <section className="chronicle-collection" aria-label="Chronicle stickers and skills">
    <header><BookOpen/><div><h2>My Chronicle Stickers</h2><p>{completed===null?'Chapter records are not available.':`${completed.length} of ${READING_CHAPTERS.length} book stickers earned${local?' on this device':''}.`} Stickers celebrate finished journeys; reading evidence remains separate.</p></div></header>
    <div>{READING_CHAPTERS.map((chapter,i)=>{const done=completed?.includes(chapter.id);return <article key={chapter.id} className={done?'is-complete chronicle-sticker-card':''}>{done&&<Sparkles className="chronicle-sticker-shine"/>}<LandmarkArt kind={CHRONICLES[i].emblem}/><span>Book {i+1}</span><h3>{done?CHRONICLES[i].prize:chapter.title}</h3><p>{done?chapter.title:CHRONICLES[i].skill}</p><small>{done?<><Check size={15}/>Sticker earned</>:completed===null?'Not available':<><LockKeyhole size={15}/>Not yet earned</>}</small></article>;})}</div>
  </section>;
}
