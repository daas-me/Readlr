export const LANTERN_WORDS=['sat','sit','set','met','let','lit'] as const;
export type LanternWord=typeof LANTERN_WORDS[number];
export type LanternVowel='a'|'e'|'i';

export function lanternTaskPrompt(kind:string):string|undefined {
  switch(kind){
    case 'build':return 'Tap the letters in order to build the word.';
    case 'repair':return 'Hear the word, then tap the missing middle letter.';
    case 'meaning':return 'Hear the sentence, then choose what fits.';
    case 'read':return 'Tap the microphone and read the word aloud.';
  }
}

export function lanternRetryCue(kind:string):string {
  switch(kind){
    case 'build':return 'Try again. Start with the first letter and build from left to right.';
    case 'repair':return 'Hear the word again. Listen for the sound in the middle.';
    case 'meaning':return 'Hear the sentence again, then choose what fits the blank.';
    case 'read':return 'Milo heard a different word. Hear the word, then try the microphone again.';
    default:return 'Try again, or tap Help.';
  }
}

export function lanternVowel(word:string):LanternVowel|null {
  const vowel=[...word].find(letter=>'aei'.includes(letter));
  return vowel==='a'||vowel==='e'||vowel==='i'?vowel:null;
}

export function addLitLantern(words:string[],word:string,status:string) {
  if(status!=='matched'||!LANTERN_WORDS.includes(word as LanternWord)||words.includes(word))return words;
  return [...words,word];
}
