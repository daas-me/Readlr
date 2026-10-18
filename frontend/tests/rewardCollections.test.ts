import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("current Sticker Book uses the authored first-open ritual and curriculum rewards", () => {
  const source = readFileSync(new URL("../src/app/components/StickerBook.tsx",import.meta.url),"utf8");
  assert.match(source,/Tap the book to unwrap your first sticker/);
  assert.match(source,/patchLearnerCurriculumState\(learnerId,\{stickerBookOpened:true\}\)/);
  assert.match(source,/Collected by \{learnerName\}/);
  assert.match(source,/\['mango','Mango Sound'\].*\['apple','Apple Sound'\].*\['top','Top Sound'\]/s);
  assert.match(source,/earned:state\.guidedStops\.includes\(`gate:\$\{word\}`\)/);
  assert.match(source,/completedBooks\.includes\(chapter\.id\)/);
});
test("current achievements use account curriculum state rather than old recording storage", () => {
  const source = readFileSync(new URL("../src/app/components/CurriculumAchievements.tsx",import.meta.url),"utf8");
  assert.match(source,/state\.soundRecordings\.length/);
  assert.match(source,/completedBooks\.includes\(/);
  assert.doesNotMatch(source,/IDBKeyRange|readlr_attempt_records|completedByStage/);
});

test("sticker cover and album are never mounted together during arrival", () => {
  const source=readFileSync(new URL("../src/app/components/StickerBook.tsx",import.meta.url),"utf8");
  assert.match(source,/!albumOpen&&<button className=\{`sticker-table-book/);
  assert.match(source,/\{albumOpen&&<div className="sticker-album-reveal"/);
  assert.doesNotMatch(source,/unwrapping\|\|albumOpen/);
  const css=readFileSync(new URL("../src/app/components/stickerAlbum.css",import.meta.url),"utf8");
  assert.doesNotMatch(css,/is-revealing-album|sticker-cover-open/);
});

test("every sticker reward has a distinct die-cut illustration", () => {
  const art=readFileSync(new URL("../src/app/components/RewardStickerArt.tsx",import.meta.url),"utf8");
  const pairs=art.slice(art.indexOf('BOOK_STICKER_DESIGNS'),art.indexOf('] as const'));
  const designs=[...pairs.matchAll(/'([a-z]+)'/g)].map(match=>match[1]);
  assert.equal(designs.length,20);
  assert.equal(new Set(designs).size,20);
  for(const design of ['mango','apple','top',...designs])assert.ok(art.includes(`${design}:<>`),`Missing ${design} art`);
  assert.match(art,/feMorphology.*operator="dilate"/);
  const book=readFileSync(new URL("../src/app/components/StickerBook.tsx",import.meta.url),"utf8");
  assert.doesNotMatch(book,/LandmarkArt|starter-letter/);
});

test("shared illustrations keep the die-cut border exclusive to stickers",()=>{
  const art=readFileSync(new URL("../src/app/components/RewardStickerArt.tsx",import.meta.url),"utf8");
  assert.match(art,/finish==='sticker'\?<filter/);
  assert.match(art,/:<IllustrationSurface/);
  for(const file of ['ReadingAnchorArt','AdventureArt','AwardSculpture']){
    const source=readFileSync(new URL(`../src/app/components/${file}.tsx`,import.meta.url),"utf8");
    assert.match(source,/finish="object"/);
  }
  const awards=readFileSync(new URL("../src/app/components/CurriculumAchievements.tsx",import.meta.url),"utf8");
  assert.equal((awards.match(/<AwardSculpture /g)||[]).length,2);
});
