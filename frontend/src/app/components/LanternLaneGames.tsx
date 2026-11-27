import { useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, Lightbulb, Volume2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useBridgeAudio } from '../../hooks/useBridgeAudio';
import { CharacterCompanion } from './CharacterCompanion';
import { lanternVowel, LANTERN_WORDS, type LanternVowel, type LanternWord } from './lanternLaneLogic';
import './lanternLaneGames.css';
import { MiloSays } from './MiloSays';

const VOWELS:LanternVowel[]=['a','e','i'];
const SORT_ORDER:LanternWord[]=['lit','sat','met','sit','let','set'];
const SORT_PROMPT='Choose a word. Listen for the middle sound, then tap its lantern. You can drag the word, too.';

export function LanternVowelSort({onAttempt,onComplete}:{onAttempt?:(word:LanternWord,vowel:LanternVowel,correct:boolean)=>void;onComplete:()=>void}) {
  const reduced=useReducedMotion();
  const sound=useBridgeAudio('/audio/stage3');
  const [placed,setPlaced]=useState<Partial<Record<LanternWord,LanternVowel>>>({});
  const [selected,setSelected]=useState<LanternWord|null>(null);
  const [message,setMessage]=useState(SORT_PROMPT);
  const [wrongVowel,setWrongVowel]=useState<LanternVowel|null>(null);
  const dragging=useRef(false);
  const sorted=SORT_ORDER.filter(word=>placed[word]).length;
  const finished=sorted===SORT_ORDER.length;
  function select(word:LanternWord){
    sound.stop();
    setSelected(word);setWrongVowel(null);
    setMessage('Hear the word, then choose its middle sound.');
  }
  function place(word:LanternWord,vowel:LanternVowel){
    if(placed[word])return;
    sound.stop();
    const correct=lanternVowel(word)===vowel;onAttempt?.(word,vowel,correct);
    if(!correct){
      setSelected(word);setWrongVowel(vowel);
      setMessage('Not that lantern. Hear the word and try a different middle sound.');
      return;
    }
    setPlaced({...placed,[word]:vowel});setSelected(null);setWrongVowel(null);
    setMessage(sorted+1===SORT_ORDER.length?'You lit every lantern!':`${word} lights its lantern! Choose another word.`);
  }
  function drop(word:LanternWord,event:MouseEvent|TouchEvent|PointerEvent){
    const point='changedTouches' in event?event.changedTouches[0]:event;
    if(!point)return;
    const {clientX:x,clientY:y}=point;
    const bin=document.elementsFromPoint(x,y).find(element=>element instanceof HTMLElement&&element.dataset.lanternVowel) as HTMLElement|undefined;
    if(!bin){setSelected(word);setWrongVowel(null);setMessage('Drop the word on a lantern, or tap a lantern to choose it.');return;}
    place(word,bin.dataset.lanternVowel as LanternVowel);
  }
  async function hearWord(){
    if(!selected)return;
    try{await sound.narrateText({file:`Pronounce${selected.toUpperCase()}.wav`,text:selected});}
    catch(error){if(!(error instanceof Error&&error.name==='AbortError'))setMessage('The sound did not play. Tap Hear the word to try again.');}
  }
  return <section className={`lantern-sort ${finished?'is-complete':''}`}>
    <header><CharacterCompanion state={finished?'celebrating':wrongVowel?'encouraging':'idle'} gesture="point" size={78}/><div><h2>Light the vowel lanterns</h2><MiloSays text={message}/></div></header>
    <div className="lantern-sort-scene">
      <div className="lantern-word-bank" role="group" aria-label="Words to sort">{SORT_ORDER.map((word,index)=><motion.button
        type="button" className="lantern-word-tile" key={word} aria-pressed={selected===word}
        aria-label={placed[word]?`${word}, sorted`:undefined}
        disabled={Boolean(placed[word])} drag={!placed[word]} dragSnapToOrigin dragMomentum={false} dragElastic={.08}
        whileDrag={{scale:reduced?1:1.08,zIndex:5}} onPointerDown={()=>{dragging.current=false;}}
        onDragStart={()=>{dragging.current=true;}} onDragEnd={event=>drop(word,event)}
        onClick={event=>{if(!event.detail||!dragging.current)select(word);}}
        style={{'--tile-turn':`${[-4,3,-2,4,-3,2][index]}deg`} as CSSProperties}
      >{placed[word]?<Check aria-hidden="true"/>:word}</motion.button>)}</div>
      <div className="lantern-vowel-row" role="group" aria-label="Middle sounds">{VOWELS.map(vowel=>{
        const words=SORT_ORDER.filter(word=>placed[word]===vowel);
        return <button type="button" className={`vowel-lantern ${words.length?'is-lit':''} ${wrongVowel===vowel?'is-retry':''}`}
          data-lantern-vowel={vowel} aria-label={`Short ${vowel} lantern`} aria-disabled={finished} key={vowel}
          onClick={()=>{if(!finished){if(selected)place(selected,vowel);else setMessage('Choose a word first.');}}}>
          <Lightbulb aria-hidden="true"/><strong>short {vowel}</strong>
          <span className="vowel-lantern-words">{words.map(word=><span key={word}>{word}</span>)}</span>
        </button>;
      })}</div>
    </div>
    <footer className="lantern-sort-controls">
      <span>{sorted} / {SORT_ORDER.length} sorted</span>
      {finished?<button type="button" className="reading-primary" onClick={onComplete}>Continue<ArrowRight aria-hidden="true"/></button>:
        <button type="button" className="reading-secondary" disabled={!selected||sound.isPlaying} onClick={()=>void hearWord()}><Volume2 aria-hidden="true"/>Hear the word</button>}
    </footer>
  </section>;
}

export function LanternVoiceTrail({active,lit}:{active:string;lit:string[]}) {
  return <div className="lantern-voice-trail" aria-label={`${lit.length} of ${LANTERN_WORDS.length} word lanterns lit`}>
    <div className="lantern-lane-line" aria-hidden="true"/>
    {LANTERN_WORDS.map(word=><div className={`voice-lantern ${lit.includes(word)?'is-lit':''} ${active===word?'is-active':''}`} key={word}><Lightbulb/><span>{word}</span>{lit.includes(word)&&<Check/>}</div>)}
  </div>;
}
