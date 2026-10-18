import { chronicleSounds } from './chronicleLessons.ts';

export function adminReadingStops(index:number) {
  return [
    ...chronicleSounds(index).map(card=>({id:card.word,label:`${card.letter} for ${card.word}`,kind:'Sound lesson'})),
    {id:'blend',label:'Sound joining',kind:'Guided practice'},
    {id:'games',label:'Word adventure',kind:'Guided practice'},
    {id:'check',label:'Final gate',kind:'Independent checkpoint'},
  ];
}
