import { useId, type ReactNode } from 'react';
import { Volume2 } from 'lucide-react';
import { IllustrationSurface } from './IllustrationSurface';
import { ReadingAnchorArt } from './ReadingAnchorArt';

// Picture beside each word (SRS FR-3.5). Words with no clear picture get a short
// spoken context scene instead. Scene lines are drafts for educator review.
export const WORD_SCENES: Record<string, string> = {
  am: 'I am Milo. I am happy to read with you!',
  at: 'Look at the gate. Milo is at the gate.',
  sat: 'Milo sat down on the mat.',
  sit: 'Please sit down. Sit with Milo.',
  set: 'Milo set the cup on the table.',
  met: 'Milo met a new friend today.',
  let: "Let me help you. Let's read!",
  lit: 'Milo lit the lantern. Now it glows.',
  hop: 'The frog can hop, hop, hop!',
  hot: 'The sun is hot today.',
  sob: 'The baby began to sob. Milo gave a hug.',
  dug: 'The dog dug a hole in the sand.',
  wet: 'The rain made Milo wet.',
  win: 'We did it! We win the game!',
};

// Original Readlr illustrations for book words that had no artwork yet.
const SHAPES: Record<string, ReactNode> = {
  mat: <><rect x="32" y="58" width="136" height="70" rx="8" fill="#ffb347" stroke="#d9822b" strokeWidth="4"/>{[52, 76, 100, 124, 148].map(x => <path key={x} d={`M${x} 62v62`} stroke="#ffd79a" strokeWidth="6"/>)}{[40, 60, 80, 100, 120, 140, 160].map(x => <path key={x} d={`M${x} 128v12m0-82v-12`} stroke="#d9822b" strokeWidth="4"/>)}</>,
  bin: <><path d="M58 52h84l-9 98H67Z" fill="#5fb7a6" stroke="#3b8d7e" strokeWidth="4"/><rect x="48" y="38" width="104" height="16" rx="6" fill="#3b8d7e"/><path d="M88 38q12-16 24 0" fill="none" stroke="#3b8d7e" strokeWidth="6"/><path d="M83 70l3 62m14-62v62m14-62-3 62" stroke="#d5f3ec" strokeWidth="5"/></>,
  bun: <><path d="M38 112q0-62 62-62t62 62Z" fill="#e8a75b" stroke="#c07b34" strokeWidth="4"/><rect x="38" y="110" width="124" height="22" rx="10" fill="#f5c785" stroke="#c07b34" strokeWidth="4"/>{[[78, 78], [100, 68], [122, 80], [90, 92], [112, 94]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="5" ry="3" fill="#fff4d6"/>)}</>,
  hut: <><path d="M48 92h104v58H48Z" fill="#d9a36a" stroke="#a66f38" strokeWidth="4"/><path d="M30 96 100 28l70 68Z" fill="#f2c94c" stroke="#c9952a" strokeWidth="4"/><path d="M58 70l-8 10m30-30-10 12m48 8 10 10m-30-30 10 12" stroke="#c9952a" strokeWidth="4"/><rect x="86" y="112" width="28" height="38" rx="4" fill="#7a4b26"/></>,
  mud: <><path d="M30 120q10-26 46-22 14-18 44-8 34-6 48 18 10 22-28 26H58q-34-2-28-14" fill="#8a5a33" stroke="#6b4425" strokeWidth="4"/><ellipse cx="88" cy="114" rx="18" ry="6" fill="#a87348"/><circle cx="52" cy="84" r="7" fill="#8a5a33"/><circle cx="150" cy="80" r="5" fill="#8a5a33"/><circle cx="128" cy="66" r="4" fill="#8a5a33"/></>,
  bus: <><rect x="28" y="44" width="148" height="80" rx="14" fill="#f9c74f" stroke="#d99a1e" strokeWidth="4"/><path d="M40 58h26v26H40Zm34 0h26v26H74Zm34 0h26v26h-26Zm34 0h24v26h-24Z" fill="#dff3ff"/><path d="M28 98h148" stroke="#e76f51" strokeWidth="6"/><circle cx="62" cy="128" r="15" fill="#4a4e69"/><circle cx="144" cy="128" r="15" fill="#4a4e69"/></>,
  cub: <><circle cx="62" cy="52" r="18" fill="#8d5a3b"/><circle cx="138" cy="52" r="18" fill="#8d5a3b"/><circle cx="100" cy="90" r="52" fill="#a86d47"/><ellipse cx="100" cy="108" rx="24" ry="18" fill="#e2b48f"/><circle cx="82" cy="82" r="6" fill="#3a2a20"/><circle cx="118" cy="82" r="6" fill="#3a2a20"/><ellipse cx="100" cy="100" rx="9" ry="6" fill="#3a2a20"/><path d="M92 114q8 7 16 0" stroke="#3a2a20" strokeWidth="3" fill="none"/></>,
  tub: <><path d="M32 82h136v18q0 38-40 38H72q-40 0-40-38Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="4"/><path d="M58 138v14m84-14v14" stroke="#94a3b8" strokeWidth="8"/>{[[60, 70, 12], [86, 62, 16], [116, 68, 11], [140, 72, 9]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#bfe8ff" stroke="#7cc6ee" strokeWidth="3"/>)}<path d="M150 82V48q0-12 12-12" fill="none" stroke="#94a3b8" strokeWidth="6"/></>,
  kid: <><circle cx="100" cy="80" r="44" fill="#f2c19a"/><path d="M56 74q4-46 44-46t44 46q-18-22-44-22T56 74" fill="#5b3a29"/><circle cx="56" cy="62" r="12" fill="#5b3a29"/><circle cx="144" cy="62" r="12" fill="#5b3a29"/><circle cx="84" cy="84" r="5" fill="#3a2a20"/><circle cx="116" cy="84" r="5" fill="#3a2a20"/><path d="M86 102q14 12 28 0" stroke="#c0593f" strokeWidth="4" fill="none"/><path d="M70 124q30 30 60 0v30H70Z" fill="#7c3aed"/></>,
  kit: <><rect x="40" y="54" width="120" height="86" rx="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="4"/><path d="M80 54V40h40v14" fill="none" stroke="#b91c1c" strokeWidth="6"/><path d="M100 72v50M75 97h50" stroke="#fff" strokeWidth="14" strokeLinecap="round"/></>,
  keg: <><ellipse cx="100" cy="40" rx="44" ry="12" fill="#c58b4f" stroke="#8a5a2b" strokeWidth="4"/><path d="M56 40q-10 50 0 100h88q10-50 0-100" fill="#d9a066" stroke="#8a5a2b" strokeWidth="4"/><ellipse cx="100" cy="140" rx="44" ry="12" fill="#b77a40" stroke="#8a5a2b" strokeWidth="4"/><path d="M52 66h96M50 114h100" stroke="#5f6b7a" strokeWidth="8"/></>,
  cap: <><path d="M44 104q0-62 56-62t56 62Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="4"/><path d="M100 42v62" stroke="#93c5fd" strokeWidth="4"/><circle cx="100" cy="42" r="6" fill="#1d4ed8"/><path d="M44 104h112q26 0 30 14H56q-12 0-12-14" fill="#1d4ed8"/></>,
  seed: <><path d="M100 150v-40" stroke="#3f9d5a" strokeWidth="6"/><path d="M100 118q-34-6-38-36 32 2 38 36m0-8q30-4 36-32-30 0-36 32" fill="#5ccf7d"/>{[[52, 138], [76, 146], [124, 146], [148, 138]].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="9" ry="6" fill="#a16207" transform={`rotate(-20 ${x} ${y})`}/>)}<path d="M40 152h120" stroke="#8b5a2b" strokeWidth="6"/></>,
  feet: <>{[64, 136].map(x => <g key={x}><path d={`M${x - 20} 150q-6-50 4-78 16-20 32 0 10 28 4 78Z`} fill="#f2c19a" stroke="#d99a6c" strokeWidth="4"/>{[0, 1, 2, 3, 4].map(t => <circle key={t} cx={x - 16 + t * 8} cy={t === 0 ? 54 : 58} r={t === 0 ? 7 : 5} fill="#f2c19a" stroke="#d99a6c" strokeWidth="3"/>)}</g>)}</>,
  lad: <><circle cx="100" cy="82" r="42" fill="#e8b48e"/><path d="M58 76q2-40 42-40t42 40q-12-14-42-14T58 76" fill="#2f2a26"/><path d="M58 56q42-32 84 0v-8q-42-26-84 0Z" fill="#16a34a"/><path d="M140 56h26" stroke="#16a34a" strokeWidth="8" strokeLinecap="round"/><circle cx="85" cy="86" r="5" fill="#2f2a26"/><circle cx="115" cy="86" r="5" fill="#2f2a26"/><path d="M88 104q12 10 24 0" stroke="#b45309" strokeWidth="4" fill="none"/><path d="M68 124q32 26 64 0v30H68Z" fill="#0ea5e9"/></>,
  sad: <><circle cx="100" cy="84" r="60" fill="#ffd166" stroke="#e0a526" strokeWidth="4"/><path d="M74 72q8-6 16 0m20 0q8-6 16 0" stroke="#5b3a29" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M76 116q24-22 48 0" stroke="#5b3a29" strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M84 86q-4 14 2 18 6-4 2-18" fill="#60a5fa"/></>,
};

export function hasWordScene(word: string) { return Boolean(WORD_SCENES[word]); }

export function ReadingWordPicture({ word, onHear, hearDisabled }: { word: string; onHear?: (line: string) => void; hearDisabled?: boolean }) {
  const surface = `book-${useId().replace(/:/g, '')}`;
  const scene = WORD_SCENES[word];
  if (scene) return <div className="reading-word-scene" role="note" aria-label={`Picture this: ${scene}`}>
    <p>{scene}</p>
    {onHear && <button type="button" className="reading-icon" title="Hear the scene" aria-label="Hear the scene" disabled={hearDisabled} onClick={() => onHear(scene)}><Volume2/></button>}
  </div>;
  const art = SHAPES[word]
    ? <svg className="storybook-object-art" viewBox="0 0 200 170" role="img" aria-label={word}><defs><IllustrationSurface id={surface}/></defs><ellipse cx="100" cy="160" rx="57" ry="6" fill="#51318a" opacity=".1"/><g filter={`url(#${surface})`} strokeLinejoin="round" strokeLinecap="round">{SHAPES[word]}</g></svg>
    : <ReadingAnchorArt word={word}/>;
  return <div className="reading-word-picture">{art}</div>;
}
