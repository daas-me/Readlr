import { READING_CHAPTERS } from './aralCurriculum.ts';

export const CAMP_BLEND_CONSONANTS=['m','s','p','t'] as const;
export const CAMP_BLEND_VOWELS=['a','e','i','o','u'] as const;
export type LibraryCollection='short'|'long'|'consonants'|'blends'|'words';
export const PHONEME_LIBRARY=[
  ['m','mango','Keep your lips together and hum.',0],['a','apple','Short a opens wide in apple.',0],['t','top','Make a quick sound with your tongue.',0],
  ['s','sun','Let air flow like a quiet hiss.',1],['e','egg','Short e starts egg.',1],['l','log','Touch behind your upper teeth.',1],['i','insect','Short i starts insect.',1],
  ['p','pen','Open your lips with a little puff.',2],['f','fan','Let air pass your lower lip and upper teeth.',2],['n','net','Hum with your tongue behind your upper teeth.',2],
  ['o','octopus','Short o starts octopus.',3],['b','bag','Open your lips with a quick voiced sound.',3],['h','hat','Breathe out gently.',3],
  ['u','umbrella','Short u starts umbrella.',4],['g','goat','Make the sound at the back of your mouth.',4],['d','dog','Make a quick voiced tongue sound.',4],
  ['r','rug','Listen to the first sound in rug.',5],['k','kite','Make a quick sound at the back of your mouth.',5],
  ['w','web','Round your lips, then open them.',6],['v','van','Use your voice with your teeth on your lower lip.',6],['y','yam','Listen to the first sound in yam.',6],['z','zip','Make a voiced buzzing sound.',6],
  ['j','jet','Listen to the first sound in jet.',7],['x','box','At the end of box, x carries two sounds.',7],['qu','quilt','These two letters work together.',7],
  ['sh','ship','Two letters make the quiet sh sound.',7],['ch','chair','Two letters make the quick ch sound.',7],['th','thumb','Let air pass gently between your teeth.',7],['th','this','Use your voice for th in this.',7],['ng','ring','Listen to the last sound in ring.',7],['zh','treasure','Hear the soft middle sound in treasure.',7],
  ['a_e','cape','Silent e helps a say its name.',8],['ee','tree','Two e letters work together in tree.',8],['i_e','kite','Silent e changes kit into kite.',8],['o_e','hope','Silent e changes hop into hope.',8],['u_e','cube','Silent e helps u say its name.',8],
  ['oo','book','Hear the short oo in book.',9],['oo','moon','Hear the long oo in moon.',9],['ar','star','The letters ar work together in star.',9],['or','fork','The letters or work together in fork.',9],['er','fern','Hear the turning er sound in fern.',9],
  ['ow','cow','The letters ow can sound like cow.',9],['oy','toy','The letters oy work together in toy.',9],['air','chair','The letters air work together in chair.',9],
] as const;
export function curriculumLibraryItems(group:LibraryCollection,unlockedBooks=10) {
  if(group==='words')return [...new Set(READING_CHAPTERS.slice(0,Math.min(READING_CHAPTERS.length,unlockedBooks+1)).flatMap(c=>c.words))].map(word=>({word,label:word,cue:READING_CHAPTERS.filter(c=>c.words.includes(word)).map(c=>c.title).join(' / ')}));
  if(group==='blends'){
    const learned=new Set<string>(PHONEME_LIBRARY.filter(([, , ,book])=>book<=unlockedBooks).map(([sound])=>sound));
    return CAMP_BLEND_CONSONANTS.filter(c=>learned.has(c)).flatMap(c=>CAMP_BLEND_VOWELS.filter(v=>learned.has(v)).flatMap(v=>[
    {word:c+v,label:`${c} + ${v}`,cue:'Start with the consonant, then join the vowel.'},
    {word:v+c,label:`${v} + ${c}`,cue:'Start with the vowel, then join the consonant.'},
  ]));
  }
  if(group==='consonants')return PHONEME_LIBRARY.filter(([, , ,book],index)=>index<31&&![1,4,6,10,13].includes(index)&&book<=unlockedBooks).map(([sound,word,cue])=>({word,label:`${sound} · ${word}`,cue}));
  const vowels=PHONEME_LIBRARY.filter((_,index)=>index>=31||[1,4,6,10,13].includes(index));
  return vowels.filter((_,index)=>(group==='short'?index<5:index>=5)).filter(([, , ,book])=>book<=unlockedBooks).map(([sound,word,cue])=>({word,label:`${sound.replace('_','-')} · ${word}`,cue}));
}
