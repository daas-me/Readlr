import test from "node:test";
import assert from "node:assert/strict";
import { cueSheetUrl, mouthAt, parseMouthCues, setMiloMouth, getMiloMouth, subscribeMiloMouth } from "../src/hooks/miloMouth.ts";

test("Rhubarb cue sheets are parsed, sorted and invalid cues dropped", () => {
  const cues = parseMouthCues({ mouthCues: [
    { start: 0.2, end: 0.4, value: "C" }, { start: 0, end: 0.2, value: "F" },
    { start: 0.4, end: 0.4, value: "A" }, { start: 0.5, end: 0.6, value: "Z" },
  ] });
  assert.deepEqual(cues?.map(cue => cue.value), ["F", "C"]);
  assert.equal(parseMouthCues({}), null);
  assert.equal(parseMouthCues(null), null);
});

test("mouth shape follows playback time and rests between cues", () => {
  const cues = parseMouthCues({ mouthCues: [{ start: 0, end: 0.2, value: "F" }, { start: 0.2, end: 0.4, value: "C" }] })!;
  assert.equal(mouthAt(cues, 0.1), "F");
  assert.equal(mouthAt(cues, 0.2), "C");
  assert.equal(mouthAt(cues, 1), "X");
});

test("cue sheet sits next to the recording", () => {
  assert.equal(cueSheetUrl("/audio/stage1/classic-milo/Welcome.wav"), "/audio/stage1/classic-milo/Welcome.json");
  assert.equal(cueSheetUrl("/audio/a.mp3?v=2"), "/audio/a.json?v=2");
});

test("every Milo is notified only when the shape changes", () => {
  let calls = 0;
  const unsubscribe = subscribeMiloMouth(() => calls++);
  setMiloMouth("A"); setMiloMouth("A"); setMiloMouth(null);
  unsubscribe();
  setMiloMouth("B");
  assert.equal(calls, 2);
  assert.equal(getMiloMouth(), "B");
  setMiloMouth(null);
});
