export const LANTERN_WORDS=['sat','sit','set','met','let','lit'] as const;
export type LanternWord=typeof LANTERN_WORDS[number];
export type LanternVowel='a'|'e'|'i';

export function lanternVowel(word:string):LanternVowel|null {
  const vowel=[...word].find(letter=>'aei'.includes(letter));
  return vowel==='a'||vowel==='e'||vowel==='i'?vowel:null;
}

export function addLitLantern(words:string[],word:string,status:string) {
  if(status!=='matched'||!LANTERN_WORDS.includes(word as LanternWord)||words.includes(word))return words;
  return [...words,word];
}
