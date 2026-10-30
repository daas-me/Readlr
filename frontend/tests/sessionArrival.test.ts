import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=(path:string)=>readFileSync(new URL(`../src/${path}`,import.meta.url),'utf8');

test('only an explicit sign-in or registration enables the welcome screen',()=>{
  const auth=source('modules/auth/auth.context.tsx');
  assert.match(auth,/\[freshLogin, setFreshLogin\] = useState\(false\)/);
  assert.equal((auth.match(/setFreshLogin\(true\)/g)??[]).length,2);
  const restore=auth.slice(auth.indexOf('const verifyToken'),auth.indexOf('const register'));
  assert.doesNotMatch(restore,/setFreshLogin\(true\)/);
  assert.match(source('app/App.tsx'),/setCurrentScreen\(freshLogin \? "welcome" : "stage-selection"\)/);
});

test('reward loads share an account-keyed request and reject indefinite loading',()=>{
  const hook=source('app/hooks/useFrames.ts');
  assert.match(hook,/pending\.get\(token\)/);
  assert.match(hook,/cache\.get\(token\)/);
  assert.match(hook,/AbortSignal\.timeout\(12000\)/);
  assert.match(hook,/activeToken\.current===accountToken/);
  assert.match(hook,/if\(!res.ok\)throw/);
});

test('sticker cover uses illustrated stickers without mounting over the album',()=>{
  const book=source('app/components/StickerBook.tsx');
  assert.match(book,/sticker-cover-art/);
  assert.match(book,/RewardStickerArt design="crown"/);
  assert.match(book,/!albumOpen&&<button/);
  assert.match(book,/albumOpen&&<div className="sticker-album-reveal"/);
});
