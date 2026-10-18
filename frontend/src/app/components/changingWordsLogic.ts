export const CHANGING_WORDS=['rug','dug','cub','tub','sad','lad'] as const;
export type ChangingWord=typeof CHANGING_WORDS[number];

export const WORD_TRANSFORMATIONS={rug:'dug',dug:'rug',cub:'tub',tub:'cub',sad:'lad',lad:'sad'} as const;

export function isChangingWord(word:string):word is ChangingWord {
  return CHANGING_WORDS.includes(word as ChangingWord);
}

export function changedLetterIndex(fromWord:string,toWord:string) {
  if(fromWord.length!==toWord.length)return -1;
  const changed=[...toWord].reduce<number[]>((items,letter,index)=>letter===fromWord[index]?items:[...items,index],[]);
  return changed.length===1?changed[0]:-1;
}

export function changingTileFits(fromWord:string,toWord:string,letter:string) {
  const index=changedLetterIndex(fromWord,toWord);
  return index>=0&&letter===toWord[index];
}

export function addTransformedWord(words:string[],word:string,status:string) {
  if(status!=='matched'||!isChangingWord(word)||words.includes(word))return words;
  return [...words,word];
}

const changeStepKey=(learnerId:number)=>`readlr_aral_changing_hall_v1_${learnerId}`;

export function readChangingHallStep(learnerId:number) {
  try {
    const value=Number(localStorage.getItem(changeStepKey(learnerId))||0);
    return Number.isInteger(value)&&value>=0&&value<=CHANGING_WORDS.length?value:0;
  } catch { return 0; }
}

export function saveChangingHallStep(learnerId:number,step:number) {
  localStorage.setItem(changeStepKey(learnerId),String(Math.max(0,Math.min(CHANGING_WORDS.length,Math.floor(step)))));
}

export function clearChangingHallStep(learnerId:number) {
  localStorage.removeItem(changeStepKey(learnerId));
}
