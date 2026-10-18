export const LIBRARY_WORDS=['van','yam','wax','jet','fox','zip'] as const;
export type LibraryWord=typeof LIBRARY_WORDS[number];

export const LIBRARY_STORIES={
  van:{clue:'Milo rides to town in a ___.',choices:['van','jet','yam']},
  yam:{clue:'A purple ___ grows under the soil.',choices:['wax','yam','fox']},
  wax:{clue:'The candle is made of ___.',choices:['zip','van','wax']},
  jet:{clue:'The ___ flies high above the clouds.',choices:['fox','jet','van']},
  fox:{clue:'A red ___ runs past the trees.',choices:['fox','yam','wax']},
  zip:{clue:'Please ___ the little bag.',choices:['jet','zip','fox']},
} as const;

export function isLibraryWord(word:string):word is LibraryWord {
  return LIBRARY_WORDS.includes(word as LibraryWord);
}

export function storyWordFits(word:string,answer:string) {
  return isLibraryWord(word)&&word===answer;
}

export function addRestoredStory(words:string[],word:string,status:string) {
  if(status!=='matched'||!isLibraryWord(word)||words.includes(word))return words;
  return [...words,word];
}

const libraryStepKey=(learnerId:number)=>`readlr_aral_royal_library_v1_${learnerId}`;

export function readRoyalLibraryStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(libraryStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=LIBRARY_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveRoyalLibraryStep(learnerId:number,step:number) {
  localStorage.setItem(libraryStepKey(learnerId),String(Math.max(0,Math.min(LIBRARY_WORDS.length,Math.floor(step)))));
}

export function clearRoyalLibraryStep(learnerId:number) {
  localStorage.removeItem(libraryStepKey(learnerId));
}
