// English practice sequence informed by ARAL KS1 LAS 1-46. These are Readlr
// activities, not the standardized CRLA instrument or a Filipino Marungko course.
export const ARAL_VERSION = 'readlr-aral-english-1';
export const ARAL_MEDIA_VERSION = 'readlr-existing-models-tts-1';
export interface ReadingChapter {
  id: string; title: string; skill: string; words: string[]; source: string; extension?: boolean;
}
export const READING_CHAPTERS: ReadingChapter[] = [
  { id: 'gate', title: 'The First Gate', skill: 'Join the first sounds', words: ['am', 'at', 'mat'], source: 'LAS 1-4, printed pp. 3-4' },
  { id: 'lanterns', title: 'Lantern Lane', skill: 'Short a, e, and i', words: ['sat', 'sit', 'set', 'met', 'let', 'lit'], source: 'LAS 5-8, printed pp. 5-6' },
  { id: 'market', title: 'The Word Market', skill: 'Read and build CVC words', words: ['pin', 'fin', 'tin', 'net', 'pen', 'map'], source: 'LAS 9-14, printed pp. 7-9' },
  { id: 'garden', title: 'The Secret Garden', skill: 'Listen for short o', words: ['pot', 'top', 'hop', 'hot', 'sob', 'bin'], source: 'LAS 11-18, printed pp. 8-11' },
  { id: 'bridge', title: 'The Castle Drawbridge', skill: 'Listen for short u', words: ['sun', 'bun', 'bug', 'hut', 'mud', 'bus'], source: 'LAS 19-24, printed pp. 12-14' },
  { id: 'hall', title: 'Hall of Changing Words', skill: 'Change one sound', words: ['rug', 'dug', 'cub', 'tub', 'sad', 'lad'], source: 'LAS 25-28, printed pp. 15-16' },
  { id: 'keys', title: 'The Key Keeper', skill: 'More beginning and ending sounds', words: ['web', 'wet', 'win', 'kid', 'kit', 'keg'], source: 'LAS 29-32, printed pp. 17-18' },
  { id: 'library', title: 'The Royal Library', skill: 'Words with a meaning', words: ['van', 'yam', 'wax', 'jet', 'fox', 'zip'], source: 'LAS 33-40, printed pp. 19-22' },
  { id: 'tower', title: 'The Vowel Tower', skill: 'Short vowels and long vowels', words: ['cap', 'cape', 'kit', 'kite', 'hop', 'hope', 'cub', 'cube', 'tree', 'seed', 'feet'], source: 'LAS 43-46, printed pp. 24-25 introduce later word/sentence work; Readlr extends contrasts to five vowels and ee', extension: true },
  { id: 'crown', title: 'The Crown Chamber', skill: 'Bring your word skills together', words: ['mat', 'pen', 'tin', 'pot', 'sun', 'web', 'van', 'kite'], source: 'Cumulative Readlr review; not an official CRLA test' },
];

export interface SoundCard { letter: string; word: string; category: 'consonants' | 'short' | 'long'; cue: string }
export const SOUND_CARDS: SoundCard[] = [
  ['m','mango','Keep your lips together and hum.'], ['t','top','Make a quick sound with your tongue.'],
  ['s','sun','Let air flow like a quiet hiss.'], ['l','log','Touch your tongue just behind your upper teeth.'],
  ['p','pen','Open your lips with a little puff.'], ['f','fan','Let air pass your lower lip and upper teeth.'],
  ['h','hat','Breathe out gently.'], ['n','net','Hum with your tongue behind your upper teeth.'],
  ['b','bag','Open your lips with a quick voiced sound.'], ['r','rug','Listen to the first sound.'],
  ['d','dog','Make a quick voiced sound with your tongue.'], ['g','goat','Make a quick voiced sound at the back of your mouth.'],
  ['c','cup','In cup, c has the same first sound as kite.'], ['w','web','Round your lips, then open them.'],
  ['k','kite','Make a quick sound at the back of your mouth.'], ['j','jet','Listen to the first sound.'],
  ['x','box','Listen at the end: x stands for two sounds here.'], ['v','van','Use your voice with your upper teeth on your lower lip.'],
  ['y','yam','Listen to the first sound.'], ['z','zip','Make a voiced buzzing sound.'],
  ['qu','quilt','These two letters work together at the start.'],
].map(([letter,word,cue]) => ({ letter,word,cue,category:'consonants' as const }));
SOUND_CARDS.push(
  {letter:'a',word:'apple',category:'short',cue:'Listen to the short a at the start of apple.'},
  {letter:'e',word:'egg',category:'short',cue:'Listen to the short e at the start of egg.'},
  {letter:'i',word:'insect',category:'short',cue:'Listen to the short i at the start of insect.'},
  {letter:'o',word:'octopus',category:'short',cue:'Listen to the short o at the start of octopus.'},
  {letter:'u',word:'umbrella',category:'short',cue:'Listen to the short u at the start of umbrella.'},
  {letter:'a',word:'cape',category:'long',cue:'Compare cap and cape. The silent e changes the vowel.'},
  {letter:'e',word:'tree',category:'long',cue:'The two e letters work together in tree.'},
  {letter:'i',word:'kite',category:'long',cue:'Compare kit and kite. The silent e changes the vowel.'},
  {letter:'o',word:'hope',category:'long',cue:'Compare hop and hope. The silent e changes the vowel.'},
  {letter:'u',word:'cube',category:'long',cue:'Compare cub and cube. Listen to the long u.'},
);
export type ReadingGame = 'build' | 'repair' | 'change' | 'listen' | 'meaning' | 'read';
export interface ReadingTask { word: string; kind: ReadingGame; options: string[]; clue?: string; fromWord?:string; missing: number }
const clues: Record<string,string> = {
  sat:'Milo ___ beside the lantern.', sit:'Please ___ on the little bench.', set:'Milo ___ the lamp on the table.',
  met:'Milo ___ a friend on Lantern Lane.', let:'Please ___ the warm light shine.', lit:'Milo ___ the lantern at dusk.',
  mat:'Milo wipes his feet on a ___.', pen:'Milo writes with a ___.', tin:'Milo keeps buttons in a ___.',
  pot:'A flower grows in a ___.', sun:'The ___ shines in the sky.', web:'A spider spins a ___.',
  top:'The toy ___ spins on the floor.', hop:'A rabbit can ___.', hot:'The soup is very ___.',
  sob:'To ___ is to cry.', bin:'Put the paper in the ___.',
  van:'Milo rides to town in a ___.', kite:'Milo flies a ___ in the wind.', net:'Milo catches a ball in a ___.',
  map:'A ___ shows Milo where to go.', rug:'A soft ___ covers the floor.', bus:'The children ride a ___.',
  bun:'Milo has a warm ___ for a snack.', bug:'A tiny ___ rests on the leaf.', hut:'A little ___ stands beside the river.',
  mud:'Rain makes soft ___ beside the path.',
  yam:'A purple ___ grows under the soil.', wax:'The candle is made of ___.',
  jet:'The ___ flies high above the clouds.', fox:'A red ___ runs past the trees.', zip:'Please ___ the little bag.',
};
export function shuffleReading<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export function makeReadingRound(chapter: ReadingChapter, checkpoint: boolean, random = Math.random): ReadingTask[] {
  if(chapter.id==='gate'&&!checkpoint)return [
    {word:'am',kind:'listen',options:shuffleReading(['am','at','mat'],random),missing:0},
    {word:'am',kind:'build',options:['am','at','mat'],missing:0},
    {word:'am',kind:'read',options:['am'],missing:0},
    {word:'at',kind:'repair',options:shuffleReading(['am','at','mat'],random),missing:1},
    {word:'at',kind:'build',options:['am','at','mat'],missing:0},
    {word:'at',kind:'read',options:['at'],missing:0},
    {word:'mat',kind:'build',options:['am','at','mat'],missing:0},
    {word:'mat',kind:'read',options:['mat'],missing:0},
    {word:'mat',kind:'meaning',options:shuffleReading(['mat','top','mango'],random),clue:'Milo wipes his feet on a ___.',missing:0},
  ];
  if(chapter.id==='lanterns'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return [
      {word:'sat',kind:'build',options:options('sat'),missing:1},
      {word:'sat',kind:'read',options:['sat'],missing:0},
      {word:'sit',kind:'repair',options:options('sit'),missing:1},
      {word:'sit',kind:'read',options:['sit'],missing:0},
      {word:'set',kind:'repair',options:options('set'),missing:1},
      {word:'set',kind:'read',options:['set'],missing:0},
      {word:'met',kind:'build',options:options('met'),missing:1},
      {word:'met',kind:'read',options:['met'],missing:0},
      {word:'let',kind:'meaning',options:options('let'),clue:clues.let,missing:1},
      {word:'let',kind:'read',options:['let'],missing:0},
      {word:'lit',kind:'meaning',options:options('lit'),clue:clues.lit,missing:1},
      {word:'lit',kind:'read',options:['lit'],missing:0},
    ];
  }
  if(chapter.id==='market'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return [
      {word:'pin',kind:'build',options:options('pin'),missing:0},
      {word:'pin',kind:'read',options:['pin'],missing:0},
      {word:'fin',kind:'repair',options:options('fin'),missing:0},
      {word:'fin',kind:'read',options:['fin'],missing:0},
      {word:'tin',kind:'build',options:options('tin'),missing:1},
      {word:'tin',kind:'read',options:['tin'],missing:0},
      {word:'net',kind:'meaning',options:options('net'),clue:clues.net,missing:1},
      {word:'net',kind:'read',options:['net'],missing:0},
      {word:'pen',kind:'meaning',options:options('pen'),clue:clues.pen,missing:1},
      {word:'pen',kind:'read',options:['pen'],missing:0},
      {word:'map',kind:'meaning',options:options('map'),clue:clues.map,missing:1},
      {word:'map',kind:'read',options:['map'],missing:0},
    ];
  }
  if(chapter.id==='garden'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return [
      {word:'pot',kind:'meaning',options:options('pot'),clue:clues.pot,missing:1},
      {word:'pot',kind:'read',options:['pot'],missing:0},
      {word:'top',kind:'repair',options:options('top'),missing:1},
      {word:'top',kind:'read',options:['top'],missing:0},
      {word:'hop',kind:'build',options:options('hop'),missing:1},
      {word:'hop',kind:'read',options:['hop'],missing:0},
      {word:'hot',kind:'listen',options:options('hot'),missing:1},
      {word:'hot',kind:'read',options:['hot'],missing:0},
      {word:'sob',kind:'repair',options:options('sob'),missing:1},
      {word:'sob',kind:'read',options:['sob'],missing:0},
      {word:'bin',kind:'meaning',options:options('bin'),clue:clues.bin,missing:1},
      {word:'bin',kind:'read',options:['bin'],missing:0},
    ];
  }
  if(chapter.id==='bridge'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return [
      {word:'sun',kind:'meaning',options:options('sun'),clue:clues.sun,missing:1},
      {word:'sun',kind:'read',options:['sun'],missing:0},
      {word:'bun',kind:'build',options:options('bun'),missing:1},
      {word:'bun',kind:'read',options:['bun'],missing:0},
      {word:'bug',kind:'meaning',options:options('bug'),clue:clues.bug,missing:1},
      {word:'bug',kind:'read',options:['bug'],missing:0},
      {word:'hut',kind:'repair',options:options('hut'),missing:1},
      {word:'hut',kind:'read',options:['hut'],missing:0},
      {word:'mud',kind:'listen',options:options('mud'),missing:1},
      {word:'mud',kind:'read',options:['mud'],missing:0},
      {word:'bus',kind:'meaning',options:options('bus'),clue:clues.bus,missing:1},
      {word:'bus',kind:'read',options:['bus'],missing:0},
    ];
  }
  if(chapter.id==='hall'&&!checkpoint){
    const pairings:Record<string,string>={rug:'dug',dug:'rug',cub:'tub',tub:'cub',sad:'lad',lad:'sad'};
    return chapter.words.flatMap(word=>{
      const fromWord=pairings[word];
      const missing=[...word].findIndex((letter,index)=>letter!==fromWord[index]);
      return [
        {word,kind:'change' as const,options:shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random),fromWord,missing},
        {word,kind:'read' as const,options:[word],missing:0},
      ];
    });
  }
  if(chapter.id==='keys'&&!checkpoint){
    const missingByWord:Record<string,number>={web:0,wet:2,win:2,kid:0,kit:2,keg:2};
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return chapter.words.flatMap(word=>[
      {word,kind:'repair' as const,options:options(word),missing:missingByWord[word]},
      {word,kind:'read' as const,options:[word],missing:0},
    ]);
  }
  if(chapter.id==='library'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    return chapter.words.flatMap(word=>[
      {word,kind:'meaning' as const,options:options(word),clue:clues[word],missing:0},
      {word,kind:'read' as const,options:[word],missing:0},
    ]);
  }
  if(chapter.id==='tower'&&!checkpoint){
    const pairs:Record<string,string>={cap:'cape',cape:'cap',kit:'kite',kite:'kit',hop:'hope',hope:'hop',cub:'cube',cube:'cub'};
    const missingByWord:Record<string,number>={cape:3,kite:3,hope:3,cube:3,tree:3,seed:2,feet:2};
    const options=(word:string,contrast?:string)=>shuffleReading([word,...[contrast,...chapter.words].filter((other,index,all):other is string=>Boolean(other)&&other!==word&&all.indexOf(other)===index).slice(0,2)],random);
    return chapter.words.flatMap(word=>[
      pairs[word]
        ? word.length===4
          ? {word,kind:'repair' as const,options:options(word,pairs[word]),missing:missingByWord[word]}
          : {word,kind:'listen' as const,options:options(word,pairs[word]),missing:1}
        : {word,kind:'repair' as const,options:options(word),missing:missingByWord[word]},
      {word,kind:'read' as const,options:[word],missing:0},
    ]);
  }
  if(chapter.id==='crown'&&!checkpoint){
    const options=(word:string)=>shuffleReading([word,...chapter.words.filter(other=>other!==word).slice(0,2)],random);
    const challenge:Record<string,ReadingTask>={
      mat:{word:'mat',kind:'meaning',options:options('mat'),clue:clues.mat,missing:1},
      pen:{word:'pen',kind:'build',options:options('pen'),missing:1},
      tin:{word:'tin',kind:'listen',options:options('tin'),missing:1},
      pot:{word:'pot',kind:'repair',options:options('pot'),missing:1},
      sun:{word:'sun',kind:'meaning',options:options('sun'),clue:clues.sun,missing:1},
      web:{word:'web',kind:'repair',options:options('web'),missing:0},
      van:{word:'van',kind:'build',options:options('van'),missing:1},
      kite:{word:'kite',kind:'listen',options:options('kite'),missing:1},
    };
    return chapter.words.flatMap(word=>[challenge[word],{word,kind:'read' as const,options:[word],missing:0}]);
  }
  // Assessment stays within taught content; retries create a new order, not a harder word bank.
  const bank=checkpoint&&chapter.id==='tower'?['cape','tree','kite','hope','cube']:chapter.words;
  const words=shuffleReading(bank,random).slice(0, checkpoint ? chapter.id==='crown'?8:['lanterns','market','garden','bridge','hall','keys','library'].includes(chapter.id)?6:5 : 6);
  const games: ReadingGame[] = shuffleReading(['build','repair','listen','meaning','read','build'],random);
  return words.map((word,index) => {
    const fromWord=chapter.id==='hall'?chapter.words.find(other=>other.length===word.length&&[...other].filter((letter,i)=>letter!==word[i]).length===1):undefined;
    return { word, kind:checkpoint?'read':fromWord?'change':games[index]==='meaning'&&!clues[word]?'repair':games[index],
    options:shuffleReading([word,...shuffleReading(chapter.words.filter(w=>w!==word),random).slice(0,2)],random),
    clue:clues[word], fromWord, missing:fromWord?[...word].findIndex((letter,i)=>letter!==fromWord[i]):Math.floor(random()*word.length) };
  });
}
export function readingEvidenceResult(status: 'matched'|'different'|'uncertain'|'unavailable') {
  return ({matched:'correct',different:'incorrect',uncertain:'unclear',unavailable:'unavailable'} as const)[status];
}
