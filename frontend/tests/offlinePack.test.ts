import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildCampOfflineAssets, installOfflinePack, offlinePackCacheName, readOfflinePackRecords } from '../src/hooks/offlinePack.ts';

test('offline pack contains only immutable versioned Camp media', () => {
  const assets = buildCampOfflineAssets('approved-pack-1');
  assert.ok(assets.length >= 10);
  assert.equal(new Set(assets.map((asset) => asset.url)).size, assets.length);
  assert.ok(assets.every((asset) => asset.url.startsWith('/media/readlr2/approved-pack-1/')));
  assert.equal(offlinePackCacheName('approved-pack-1'), 'readlr-pack-v1-approved-pack-1');
  assert.throws(() => offlinePackCacheName('../bad'));
});

test('offline metadata rejects malformed and identifying records', () => {
  const storage = { getItem: () => JSON.stringify([
    { schemaVersion: 1, manifestVersion: 'pack-1', installedAt: '2026-10-13T00:00:00.000Z', assetCount: 12, bytes: 1234 },
    { schemaVersion: 1, manifestVersion: '../bad', installedAt: 'today', assetCount: 0, bytes: -1, learnerName: 'child' },
  ]), setItem: () => undefined };
  assert.deepEqual(readOfflinePackRecords(storage), [{ schemaVersion: 1, manifestVersion: 'pack-1', installedAt: '2026-10-13T00:00:00.000Z', assetCount: 12, bytes: 1234 }]);
});

test('service worker never caches APIs, accounts, or recordings', () => {
  const source = readFileSync(new URL('../public/readlr-offline-sw.js', import.meta.url), 'utf8');
  assert.match(source, /pathname\.startsWith\('\/api\/'\).*return/);
  assert.match(source, /pathname\.startsWith\('\/media\/readlr2\/'\)/);
  assert.doesNotMatch(source, /audio\/uploads|recording|Authorization|learner_/);
});

test('a failed download leaves the existing versioned pack untouched', async () => {
  let opened = false;
  const assets = buildCampOfflineAssets('approved-pack-1').slice(0, 2);
  await assert.rejects(() => installOfflinePack('approved-pack-1', assets, {
    fetcher: async (input) => new Response('', {
      status: String(input).includes('am-segmented') ? 503 : 200,
      headers: { 'Content-Type': 'audio/wav', 'Content-Length': '10' },
    }),
    cacheStorage: { open: async () => { opened = true; throw new Error('must not open'); }, delete: async () => false },
    storage: { getItem: () => null, setItem: () => { throw new Error('must not write'); } },
  }));
  assert.equal(opened, false);
});
