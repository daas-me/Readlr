export const READING_VERSION = 'readlr-aral-english-1';
export const READING_MEDIA = 'readlr-existing-models-tts-1';
export const READING_BANKS: Record<string, string[]> = {
  gate: ['am', 'at', 'mat'],
  lanterns: ['sat', 'sit', 'set', 'met', 'let', 'lit'],
  market: ['pin', 'fin', 'tin', 'net', 'pen', 'map'],
  garden: ['pot', 'top', 'hop', 'hot', 'sob', 'bin'],
  bridge: ['sun', 'bun', 'bug', 'hut', 'mud', 'bus'],
  hall: ['rug', 'dug', 'cub', 'tub', 'sad', 'lad'],
  keys: ['web', 'wet', 'win', 'kid', 'kit', 'keg'],
  library: ['van', 'yam', 'wax', 'jet', 'fox', 'zip'],
  tower: ['cape', 'tree', 'kite', 'hope', 'cube'],
  crown: ['mat', 'pen', 'tin', 'pot', 'sun', 'web', 'van', 'kite'],
};
export const CHAPTER_IDS = Object.keys(READING_BANKS);
export function checkpointWords(chapter: string, random = Math.random): string[] {
  if (!Object.prototype.hasOwnProperty.call(READING_BANKS, chapter)) throw new Error('Unknown chapter');
  const words = [...READING_BANKS[chapter]];
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.slice(0, chapter==='crown' ? 8 : ['lanterns','market','garden','bridge','hall','keys','library'].includes(chapter) ? 6 : 5);
}
export function chapterAvailable(chapter: string, completed: string[], unlockThrough = 0, openChallenges: number[] = []) {
  const index = CHAPTER_IDS.indexOf(chapter);
  return index >= 0 && (index === 0 || index < unlockThrough || openChallenges.includes(index + 1) || completed.includes(CHAPTER_IDS[index - 1]));
}
