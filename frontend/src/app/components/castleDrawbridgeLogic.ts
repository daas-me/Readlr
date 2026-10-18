export const DRAWBRIDGE_WORDS=['sun','bun','bug','hut','mud','bus'] as const;
export type DrawbridgeWord=typeof DRAWBRIDGE_WORDS[number];

export function isDrawbridgeWord(word:string):word is DrawbridgeWord {
  return DRAWBRIDGE_WORDS.includes(word as DrawbridgeWord);
}

export function drawbridgeVowel(word:string) {
  return isDrawbridgeWord(word)?word[1]:'';
}

export function drawbridgePlankFits(word:string,vowel:string) {
  return vowel==='u'&&drawbridgeVowel(word)===vowel;
}

export function addRaisedPlank(words:string[],word:string,status:string) {
  if(status!=='matched'||!isDrawbridgeWord(word)||words.includes(word))return words;
  return [...words,word];
}

const plankStepKey=(learnerId:number)=>`readlr_aral_drawbridge_planks_v1_${learnerId}`;

export function readDrawbridgePlankStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(plankStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=DRAWBRIDGE_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveDrawbridgePlankStep(learnerId:number,step:number) {
  localStorage.setItem(plankStepKey(learnerId),String(Math.max(0,Math.min(DRAWBRIDGE_WORDS.length,Math.floor(step)))));
}

export function clearDrawbridgePlankStep(learnerId:number) {
  localStorage.removeItem(plankStepKey(learnerId));
}
