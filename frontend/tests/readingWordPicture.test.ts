import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { READING_CHAPTERS } from '../src/app/components/aralCurriculum.ts';

const read = (file: string) => readFileSync(new URL(`../src/app/components/${file}`, import.meta.url), 'utf8');
const keysOf = (source: string, start: string) => {
  const block = source.slice(source.indexOf(start));
  return new Set([...block.slice(0, block.indexOf('\n};')).matchAll(/^\s+([a-z]+):/gm)].map(m => m[1]));
};

test('every book word has a picture or a spoken context scene (FR-3.5)', () => {
  const picture = read('ReadingWordPicture.tsx'), anchor = read('ReadingAnchorArt.tsx'), cvc = read('CvcArt.tsx'), camp = read('CampObjectArt.tsx');
  const scenes = keysOf(picture, 'export const WORD_SCENES'), shapes = keysOf(picture, 'const SHAPES');
  const art = new Set([...shapes, ...keysOf(anchor, 'const shapes'),
    ...[...anchor.matchAll(/([a-z]+):'[a-z]+'/g)].map(m => m[1]),
    ...[...cvc.matchAll(/case "([a-z]+)"/g)].map(m => m[1]),
    ...(camp.match(/CAMP_OBJECT_WORDS=\[([^\]]+)\]/)?.[1].match(/[a-z]+/g) ?? [])]);
  const missing = [...new Set(READING_CHAPTERS.flatMap(chapter => chapter.words))].filter(word => !scenes.has(word) && !art.has(word));
  assert.deepEqual(missing, []);
  for (const [word, line] of [...picture.matchAll(/^\s+([a-z]+): ["'](.+)["'],$/gm)].map(m => [m[1], m[2]] as const).filter(([w]) => scenes.has(w)))
    assert.ok(line.split(/\s+/).length <= 12, `${word} scene is longer than 12 words (FR-5.4)`);
});

test('independent checkpoints hide the picture until after the response', () => {
  const journey = read('ReadingJourney.tsx');
  assert.match(journey, /\(!checkpoint\|\|done\)&&<ReadingWordPicture/);
  assert.match(journey, /done&&active\.kind!=='read'&&active\.kind!=='meaning'&&<ReadingWordPicture/);
  assert.match(journey, /function hearScene[\s\S]{0,120}setHeard\(true\);setHelped\(true\)/);
});
