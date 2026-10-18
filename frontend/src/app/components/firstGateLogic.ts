export const FIRST_GATE_WORDS = ['am', 'at', 'mat'] as const;
export const ORCHARD_ANCHORS = ['mango', 'apple', 'top'] as const;

export function bookOneAction(heard:boolean,done:boolean,checkpoint:boolean,kind='read'):'listen'|'respond'|'continue' {
  if(done)return 'continue';
  return checkpoint||kind==='meaning'||heard?'respond':'listen';
}

export function firstGateShowsWordModel(word:string):boolean {
  return word==='am';
}

export function orchardMatch(word:string,letter:string):boolean {
  return ORCHARD_ANCHORS.some(anchor=>anchor===word)&&word[0]===letter;
}

export function placeTrainTile(slots:readonly (string|null)[],ids:readonly string[],id:string,target:string):(string|null)[]|null {
  if(!/^\d+$/.test(target)||!ids.includes(id)||slots.includes(id))return null;
  const position=Number(target);
  if(position>=slots.length||slots[position]!==null)return null;
  return slots.map((value,index)=>index===position?id:value);
}

export function addSpokenStation(words:readonly string[],word:string,status:string):string[] {
  if(status!=='matched'||!FIRST_GATE_WORDS.some(target=>target===word))return [...words];
  return [...new Set([...words,word])];
}
