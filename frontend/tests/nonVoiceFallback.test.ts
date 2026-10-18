import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source=(file:string)=>readFileSync(new URL(`../src/app/components/${file}`,import.meta.url),"utf8");

test("every challenge stage offers an explicit nonvoice practice route",()=>{
  const vowel=source("GameLevel.tsx");
  const bridge=source("BridgePractice.tsx");
  const cvc=source("CvcChallenge.tsx");
  assert.match(vowel,/practiceStageOneWithoutMicrophone/);
  assert.match(vowel,/finish\("nonvoice_practice"\)/);
  assert.match(bridge,/Practice without microphone/);
  assert.match(bridge,/finish\("nonvoice_practice"\)/);
  assert.match(cvc,/Practice without microphone/);
  assert.match(cvc,/finish\("nonvoice_practice"\)/);
});

test("nonvoice completion is visibly unscored and does not require a saved recording",()=>{
  const bridge=source("BridgePractice.tsx");
  const cvc=source("CvcChallenge.tsx");
  assert.match(bridge,/No recording or pronunciation score was saved/);
  assert.match(cvc,/without a pronunciation score/);
  assert.match(bridge,/recordingUrl\.current&&<button/);
  assert.match(cvc,/recording\.current\?"Hear your voice":"Hear Milo"/);
});

test("word-check failure exposes recovery instead of forcing repeated recording",()=>{
  const cvc=source("CvcChallenge.tsx");
  assert.match(cvc,/setFallbackAvailable\(true\)/);
  assert.match(cvc,/fallbackAvailable&&phase==="ready"/);
  assert.match(cvc,/practiceWithoutMicrophone/);
});
