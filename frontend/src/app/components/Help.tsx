import { useState } from "react";
import { BookOpen, Mic, Trophy, Map, Search, ChevronDown, Volume2, Headphones, Heart, X, RotateCcw, ArrowRight } from "lucide-react";
import "./help.css";

const topics = [
  { id:"journey", title:"Your reading world", icon:Map, answers:[
    ["Where do I begin?", "Begin at Learning Camp. Milo guides you through three short practices: tap a sound, build ma, and build am. Finishing them opens the full Camp and unlocks Book 1, The First Gate."],
    ["What happens inside a book?", "Each book is a new place with a trail of reading stops. Complete the available stop to open the next one. You will meet sounds, join or build words, play a word activity, and finish at a reading checkpoint."],
    ["Why is a stop or book locked?", "The trail opens in reading order. Finish the available stop before the next stop, and finish the current book before the next book. Your completed work is saved to your learner account and also kept on this device while you are offline."],
    ["How many books are there?", "The Reading World currently has ten chronicles, from The First Gate to The Crown of Words. Book 10 ends with a road toward a future reading world, so the adventure can grow later."],
  ]},
  { id:"voice", title:"Voice & listening", icon:Mic, answers:[
    ["When should I speak?", "Listen to Milo first, then tap the recording button and wait for the clear recording cue. Say only the sound or word shown on the page. You can listen to your voice and try again without losing progress."],
    ["Why can't Milo hear me?", "Ask a grown-up to check microphone permission for Readlr in the browser and select the correct microphone. Find a quiet spot and record again. A quiet recording is not a wrong answer."],
    ["Why are am, at, and mat harder to check?", "Very short words give speech recognition less sound to work with. Wait for the recording cue, keep the vowel short, and say only the word once. Readlr gives the recognizer the word on the page as context, but it still requires that exact word."],
    ["Can I continue without a microphone?", "Yes. When microphone practice is unavailable, use the practice-without-microphone choice. Listen, say the word aloud with a grown-up if possible, and continue. Readlr records this as guided practice rather than an assessed pronunciation result."],
    ["Why can't I hear the narration?", "Check your device volume and Readlr's volume in Settings. Tap a speaker or Listen to Milo if your browser blocked automatic sound. Check your headphones. Success narration also follows the voice-feedback setting."],
    ["Does hearing my voice mean I said it correctly?", "Not always. Reading checkpoints compare the recognized word with the exact word on the page. Recognition can make mistakes and is not a phoneme-by-phoneme pronunciation score, so unclear results invite another try rather than calling the learner wrong."],
    ["Can I listen without a challenge?", "Yes. The Sound Library opens after the first three stops in Book 1. It contains the 44 phonemes, example words, sound blends, and a place to record and compare your voice. More examples appear as you progress."],
  ]},
  { id:"progress", title:"Books & rewards", icon:Trophy, answers:[
    ["When do rewards open?", "The first three stops in Book 1 unlock the Sticker Book and Sound Library. Completing all of Book 1 unlocks Progress and Achievements. Later books unlock one at a time as each previous book is completed."],
    ["How do I collect stickers?", "Your first three Book 1 sounds award the first stickers. More stickers are placed in the book for learning a chapter skill and completing a chronicle. The first time Sticker Book opens, tap the book to unwrap the collection."],
    ["What can I see in Progress?", "After Book 1, Progress shows Camp completion, finished chronicles, reading stops, Sound Library recordings, and activity across the current curriculum. It does not turn completion into a pronunciation score."],
    ["Why can completion and assessment differ?", "Finishing a guided activity shows that it was practised. An independent reading check is separate evidence. Readlr keeps those ideas separate instead of inventing an accuracy percentage from completion alone."],
    ["Where is my journey saved?", "Book access, completed stops, Camp orientation, carousel position, stickers, and Sound Library visits are saved for the signed-in learner and synchronized across their account. If the connection drops, the latest activity stays on this device until it can sync."],
  ]},
  { id:"grownups", title:"For grown-ups", icon:Heart, answers:[
    ["How can I support a learner?", "Listen to the model together and let the child try before giving the answer. Replay their voice and celebrate their effort. Keep practice comfortable and take a break when they are tired."],
    ["How can I tell what they have learned?", "After Book 1, use Progress to see completed Camp practices, book stops, chronicles, and listening activity. Then invite the learner to try a sound or word without the model. Completion and voice detection are not proof of mastery."],
    ["What if a recording is interrupted?", "Return to the same book stop and try again when ready. Leaving the page can pause a recording. A microphone, connection, or playback problem should not be treated as a reading mistake."],
  ]},
] as const;

export function Help({ onTutorial }: { onTutorial?: () => void }) {
  const [topic,setTopic]=useState<string>("journey");
  const [query,setQuery]=useState("");
  const search=query.trim().toLowerCase();
  const selected=topics.find(item=>item.id===topic)!;
  const results=topics.flatMap(item=>item.answers.map(([question,answer])=>({question,answer,topic:item.title,id:item.id})))
    .filter(item=>search?`${item.question} ${item.answer} ${item.topic}`.toLowerCase().includes(search):item.id===topic);
  return <div className="readlr-help"><main className="help-inner">
    <header className="help-heading"><div><p className="help-eyebrow">A little help along the way</p><h1>Help & guidance</h1><p>For young readers and the grown-ups beside them.</p></div>
      {onTutorial ? <button onClick={onTutorial} className="help-tutorial" aria-label="Replay Milo's Reading World tour">
        <span className="help-tutorial__icon"><RotateCcw size={22} aria-hidden="true"/></span>
        <span className="help-tutorial__label"><strong>Take a tour with Milo</strong><small>Your Reading World, then Learning Camp</small></span>
        <ArrowRight size={19} className="help-tutorial__arrow" aria-hidden="true"/>
      </button> : <BookOpen size={48} aria-hidden="true"/>}
    </header>
    <ol className="help-voice-flow" aria-label="Voice practice sequence">{[{icon:Volume2,title:"Listen to Milo",text:"Hear the sound first."},{icon:Mic,title:"Your turn",text:"Wait for the listening cue."},{icon:Headphones,title:"Hear your voice",text:"Listen back together."}].map(({icon:Icon,title,text},i)=><li key={title}><span className={`help-step step-${i}`}><Icon size={23}/></span><div><h2>{title}</h2><p>{text}</p></div></li>)}</ol>
    <div className="help-search"><Search size={20} aria-hidden="true"/><input aria-label="Search help" placeholder="Search books, sounds, rewards..." value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="Clear search" title="Clear search" onClick={()=>setQuery("")}><X size={18}/></button>}</div>
    <div className="help-layout"><nav aria-label="Help topics">{topics.map(({id,title,icon:Icon})=><button key={id} aria-current={!search&&topic===id?"page":undefined} onClick={()=>{setTopic(id);setQuery("");}}><Icon size={19}/>{title}</button>)}</nav>
      <section className="help-answers" aria-label="Help answers"><header><h2>{search?"Search results":selected.title}</h2><span role="status">{results.length} answers</span></header>
        {results.length===0?<div className="help-empty"><Search size={28}/><h3>No matching answers</h3><p>Try a shorter phrase, such as microphone or progress.</p></div>:results.map(item=><details key={`${search}-${item.question}`}><summary>{item.question}<ChevronDown size={18} aria-hidden="true"/></summary><p>{item.answer}</p></details>)}
      </section></div>
    <footer><Heart size={23}/><div><h2>Still feeling stuck?</h2><p>Ask your teacher or a grown-up to help. You can take a break and come back together.</p></div></footer>
  </main></div>;
}
