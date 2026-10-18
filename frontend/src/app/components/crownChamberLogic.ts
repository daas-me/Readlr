export const CROWN_CHAMBER_STEPS=[
  {word:'mat',display:'m_t',vowel:'a',choices:['a','e','i'],cue:'short a'},
  {word:'pen',display:'p_n',vowel:'e',choices:['i','e','a'],cue:'short e'},
  {word:'tin',display:'t_n',vowel:'i',choices:['e','a','i'],cue:'short i'},
  {word:'pot',display:'p_t',vowel:'o',choices:['u','o','a'],cue:'short o'},
  {word:'sun',display:'s_n',vowel:'u',choices:['o','i','u'],cue:'short u'},
  {word:'web',display:'w_b',vowel:'e',choices:['a','e','o'],cue:'short e'},
  {word:'van',display:'v_n',vowel:'a',choices:['u','i','a'],cue:'short a'},
  {word:'kite',display:'k_t_',vowel:'i...e',choices:['i','i...e','ee'],cue:'long i with silent e'},
] as const;

export const CROWN_CHAMBER_WORDS=CROWN_CHAMBER_STEPS.map(step=>step.word);

export function isCrownChamberWord(word:string):word is (typeof CROWN_CHAMBER_WORDS)[number] {
  return CROWN_CHAMBER_WORDS.some(crownWord=>crownWord===word);
}

export function crownJewelFits(step:number,vowel:string) {
  return CROWN_CHAMBER_STEPS[step]?.vowel===vowel;
}

export function addRestoredCrownWord(words:string[],word:string,status:string) {
  if(status!=='matched'||!isCrownChamberWord(word)||words.includes(word))return words;
  return [...words,word];
}

const crownStepKey=(learnerId:number)=>`readlr_aral_crown_chamber_v1_${learnerId}`;

export function readCrownChamberStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(crownStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=CROWN_CHAMBER_STEPS.length?value:0;
  } catch { return 0; }
}

export function saveCrownChamberStep(learnerId:number,step:number) {
  localStorage.setItem(crownStepKey(learnerId),String(Math.max(0,Math.min(CROWN_CHAMBER_STEPS.length,Math.floor(step)))));
}

export function clearCrownChamberStep(learnerId:number) {
  localStorage.removeItem(crownStepKey(learnerId));
}
