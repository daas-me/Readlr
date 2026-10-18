export const KEY_WORDS=['web','wet','win','kid','kit','keg'] as const;
export type KeyWord=typeof KEY_WORDS[number];

export const KEY_LOCKS={
  web:{missing:0,letter:'w',choices:['w','k','r']},
  wet:{missing:2,letter:'t',choices:['b','t','n']},
  win:{missing:2,letter:'n',choices:['t','n','b']},
  kid:{missing:0,letter:'k',choices:['w','k','d']},
  kit:{missing:2,letter:'t',choices:['d','t','g']},
  keg:{missing:2,letter:'g',choices:['d','t','g']},
} as const;

export function isKeyWord(word:string):word is KeyWord {
  return KEY_WORDS.includes(word as KeyWord);
}

export function keyFitsLock(word:string,letter:string) {
  return isKeyWord(word)&&KEY_LOCKS[word].letter===letter;
}

export function addUnlockedWord(words:string[],word:string,status:string) {
  if(status!=='matched'||!isKeyWord(word)||words.includes(word))return words;
  return [...words,word];
}

const keeperStepKey=(learnerId:number)=>`readlr_aral_key_keeper_v1_${learnerId}`;

export function readKeyKeeperStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(keeperStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=KEY_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveKeyKeeperStep(learnerId:number,step:number) {
  localStorage.setItem(keeperStepKey(learnerId),String(Math.max(0,Math.min(KEY_WORDS.length,Math.floor(step)))));
}

export function clearKeyKeeperStep(learnerId:number) {
  localStorage.removeItem(keeperStepKey(learnerId));
}
