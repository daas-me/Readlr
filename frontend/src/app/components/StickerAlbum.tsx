import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { isStickerEarned, type Sticker } from "./stickers";
import "./stickerAlbum.css";

export function StickerAlbum({ stickers, title, progress, onSelect }: {
  stickers: Sticker[]; title: string; progress: Record<number,number>; onSelect: (sticker:Sticker)=>void;
}) {
  const [small,setSmall]=useState(()=>window.matchMedia("(max-width:700px)").matches);
  const [spread,setSpread]=useState(0);
  const [turning,setTurning]=useState<{from:number;to:number;direction:number}|null>(null);
  const busy=useRef(false);
  const reduced=useReducedMotion();
  const perSpread=small?3:6;
  const count=Math.ceil(stickers.length/perSpread);
  useEffect(()=>{
    const media=window.matchMedia("(max-width:700px)");
    const resize=()=>{setSmall(media.matches);setSpread(0);setTurning(null);busy.current=false;};
    media.addEventListener("change",resize);return()=>media.removeEventListener("change",resize);
  },[]);
  function finish(){if(turning)setSpread(turning.to);setTurning(null);busy.current=false;}
  useEffect(()=>{if(!turning)return;const timer=setTimeout(finish,800);return()=>clearTimeout(timer);},[turning]);
  function turn(to:number){
    if(busy.current||to<0||to>=count)return;
    if(reduced){setSpread(to);return;}
    busy.current=true;setTurning({from:spread,to,direction:to>spread?1:-1});
  }
  function leaf(index:number,side:number,decorative=false){
    const start=index*perSpread+side*3;
    const items=stickers.slice(start,start+3);
    return <section className="sticker-paper"><header><span>{title}</span><Sparkles size={16}/></header><div className="paper-stickers">
      {items.map(sticker=>{const earned=isStickerEarned(sticker,progress);return <button key={sticker.id} disabled={decorative||!!turning} tabIndex={decorative?-1:undefined} className={`paper-sticker ${earned?"is-collected":"is-uncollected"}`} aria-label={`${sticker.name}, ${earned?"collected":"locked"}`} onClick={()=>onSelect(sticker)}><div><span aria-hidden="true">{sticker.emoji}</span>{earned?<Check size={16}/>:<Lock size={15}/>}</div><strong>{sticker.name}</strong><small>{earned?"Collected":`Level ${sticker.at}`}</small></button>;})}
      {items.length===0&&<div className="album-endpaper"><Sparkles size={40}/><h3>A chapter of little wonders</h3><p>Every new sound brought you here.</p></div>}
    </div><footer>{start/3+1}</footer></section>;
  }
  return <div className="sticker-album">
    <div className={`album-binding ${small?"single-page":""}`} aria-busy={!!turning}>
      <div className="album-paper-stack"><div className="album-spread">
        {leaf(turning&&(small||turning.direction===-1)?turning.to:spread,0)}
        {!small&&leaf(turning?.direction===1?turning.to:spread,1)}
      </div>
      {turning&&<div className="album-turning-leaf" data-direction={turning.direction} aria-hidden="true" onAnimationEnd={event=>{if(event.target===event.currentTarget)finish();}}><div className="album-leaf-front">{leaf(turning.from,small?0:turning.direction===1?1:0,true)}</div><div className="album-leaf-back">{leaf(turning.to,small?0:turning.direction===1?0:1,true)}</div></div>}
      </div>
    </div>
    <nav className="album-page-controls" aria-label="Sticker book pages"><button className="rewards-back" title="Previous page" aria-label="Previous page" disabled={!!turning||spread===0} onClick={()=>turn(spread-1)}><ArrowLeft size={20}/></button><span aria-live="polite">{small?"Page":"Spread"} {spread+1} of {count}</span><button className="rewards-back" title="Next page" aria-label="Next page" disabled={!!turning||spread>=count-1} onClick={()=>turn(spread+1)}><ArrowRight size={20}/></button></nav>
  </div>;
}
