import { READING_CHAPTERS, SOUND_CARDS, type SoundCard } from './aralCurriculum.ts';

const introductions=[['m','short:a','t'],['s','short:e','l','short:i'],['p','f','n'],['short:o','b','h'],['short:u','g','d'],['r','c'],['w','k'],['v','y','x','j','z'],['long:a','long:e','long:i','long:o','long:u'],[]];
export function chronicleSounds(index:number):SoundCard[] {
  return (introductions[index]??[]).map(key=>{
    const [category,letter]=key.includes(':')?key.split(':'):['consonants',key];
    return SOUND_CARDS.find(card=>card.category===category&&card.letter===letter)!;
  }).filter(Boolean);
}
export function chronicleBlendWords(index:number) {
  return index===0?['am','at','mat']:READING_CHAPTERS[index].words.slice(0,3);
}
