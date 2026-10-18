export const GARDEN_WORDS=['pot','top','hop','hot','sob','bin'] as const;
export type GardenWord=typeof GARDEN_WORDS[number];

export function isGardenWord(word:string):word is GardenWord {
  return GARDEN_WORDS.includes(word as GardenWord);
}

export function gardenVowel(word:string) {
  return isGardenWord(word)?word[1]:'';
}

export function gardenSeedFits(word:string,vowel:string) {
  return ['a','e','i','o','u'].includes(vowel)&&gardenVowel(word)===vowel;
}

export function addBloomedWord(words:string[],word:string,status:string) {
  if(status!=='matched'||!isGardenWord(word)||words.includes(word))return words;
  return [...words,word];
}

const gardenStepKey=(learnerId:number)=>`readlr_aral_garden_seed_beds_v1_${learnerId}`;

export function readGardenSeedStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(gardenStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=GARDEN_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveGardenSeedStep(learnerId:number,step:number) {
  localStorage.setItem(gardenStepKey(learnerId),String(Math.max(0,Math.min(GARDEN_WORDS.length,Math.floor(step)))));
}

export function clearGardenSeedStep(learnerId:number) {
  localStorage.removeItem(gardenStepKey(learnerId));
}
