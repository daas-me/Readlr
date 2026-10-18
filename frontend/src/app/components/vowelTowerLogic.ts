export const VOWEL_TOWER_STEPS=[
  {word:'cape',from:'cap',tile:'e',display:'cap_',cue:'Add silent e. The a says its long sound.',choices:['e','ee','a']},
  {word:'kite',from:'kit',tile:'e',display:'kit_',cue:'Add silent e. The i says its long sound.',choices:['i','e','ee']},
  {word:'hope',from:'hop',tile:'e',display:'hop_',cue:'Add silent e. The o says its long sound.',choices:['ee','o','e']},
  {word:'cube',from:'cub',tile:'e',display:'cub_',cue:'Add silent e. The u says its long sound.',choices:['e','u','ee']},
  {word:'tree',from:'',tile:'ee',display:'tr__',cue:'Two e letters team up to make the long e sound.',choices:['e','ee','i']},
  {word:'seed',from:'',tile:'ee',display:'s__d',cue:'Choose the vowel team that makes long e.',choices:['ea','e','ee']},
  {word:'feet',from:'',tile:'ee',display:'f__t',cue:'Finish the last long e word.',choices:['ee','e','i']},
] as const;

export const VOWEL_TOWER_WORDS=['cap','cape','kit','kite','hop','hope','cub','cube','tree','seed','feet'] as const;
export type VowelTowerWord=typeof VOWEL_TOWER_WORDS[number];

export function isVowelTowerWord(word:string):word is VowelTowerWord {
  return VOWEL_TOWER_WORDS.includes(word as VowelTowerWord);
}

export function vowelTileFits(step:number,tile:string) {
  return VOWEL_TOWER_STEPS[step]?.tile===tile;
}

export function addAwakenedVowelWord(words:string[],word:string,status:string) {
  if(status!=='matched'||!isVowelTowerWord(word)||words.includes(word))return words;
  return [...words,word];
}

const towerStepKey=(learnerId:number)=>`readlr_aral_vowel_tower_v1_${learnerId}`;

export function readVowelTowerStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(towerStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=VOWEL_TOWER_STEPS.length?value:0;
  } catch { return 0; }
}

export function saveVowelTowerStep(learnerId:number,step:number) {
  localStorage.setItem(towerStepKey(learnerId),String(Math.max(0,Math.min(VOWEL_TOWER_STEPS.length,Math.floor(step)))));
}

export function clearVowelTowerStep(learnerId:number) {
  localStorage.removeItem(towerStepKey(learnerId));
}
