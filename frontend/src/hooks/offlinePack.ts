import { GUIDED_BLEND_LESSONS, resolveGuidedLessonMedia } from '../app/components/learningCampCurriculum.ts';
import { resolveIndependentMedia } from '../app/components/learningCampIndependent.ts';
import { resolveAdventureMedia } from '../app/components/learningCampAdventure.ts';

export type OfflineAssetKind = 'audio' | 'image';
export interface OfflineAsset { url: string; kind: OfflineAssetKind }
export interface OfflinePackRecord { schemaVersion: 1; manifestVersion: string; installedAt: string; assetCount: number; bytes: number }

const VERSION = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const STORAGE_KEY = 'readlr_offline_packs_v1';
const CACHE_PREFIX = 'readlr-pack-v1-';
const MAX_ASSET_BYTES = 15 * 1024 * 1024;
const MAX_PACK_BYTES = 80 * 1024 * 1024;

interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void }
interface CacheLike { put(request: RequestInfo | URL, response: Response): Promise<void>; match(request: RequestInfo | URL): Promise<Response | undefined> }
interface CacheStorageLike { open(name: string): Promise<CacheLike>; delete(name: string): Promise<boolean> }
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const browserStorage = (): StorageLike => localStorage;
const browserCaches = (): CacheStorageLike => caches;

export function offlinePackCacheName(manifestVersion: string): string {
  if (!VERSION.test(manifestVersion)) throw new Error('Invalid media manifest version.');
  return `${CACHE_PREFIX}${manifestVersion}`;
}

export function buildCampOfflineAssets(manifestVersion: string): OfflineAsset[] {
  if (!VERSION.test(manifestVersion)) return [];
  const guided = GUIDED_BLEND_LESSONS.flatMap((lesson) => resolveGuidedLessonMedia(lesson, manifestVersion).media.map(({ url, kind }) => ({ url, kind })));
  const independent = resolveIndependentMedia(manifestVersion);
  const assets: OfflineAsset[] = [
    ...guided,
    ...independent.soundItems.map(({ url }) => ({ url, kind: 'audio' as const })),
    { url: independent.wordAudio.url, kind: 'audio' },
    { url: independent.meaningImage.url, kind: 'image' },
    { url: resolveAdventureMedia(manifestVersion).meaningAsset.url, kind: 'image' },
  ];
  return assets.filter((asset, index, all) => all.findIndex((other) => other.url === asset.url) === index);
}

export function readOfflinePackRecords(storage: StorageLike = browserStorage()): OfflinePackRecord[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is OfflinePackRecord => Boolean(item && typeof item === 'object' &&
      (item as OfflinePackRecord).schemaVersion === 1 && VERSION.test((item as OfflinePackRecord).manifestVersion) &&
      Number.isFinite(Date.parse((item as OfflinePackRecord).installedAt)) && Number.isSafeInteger((item as OfflinePackRecord).assetCount) &&
      (item as OfflinePackRecord).assetCount > 0 && Number.isSafeInteger((item as OfflinePackRecord).bytes) && (item as OfflinePackRecord).bytes >= 0));
  } catch { return []; }
}

function saveRecord(record: OfflinePackRecord, storage: StorageLike) {
  const records = readOfflinePackRecords(storage).filter((item) => item.manifestVersion !== record.manifestVersion);
  storage.setItem(STORAGE_KEY, JSON.stringify([...records, record]));
}

function forgetRecord(manifestVersion: string, storage: StorageLike) {
  storage.setItem(STORAGE_KEY, JSON.stringify(readOfflinePackRecords(storage).filter((item) => item.manifestVersion !== manifestVersion)));
}

function validAsset(asset: OfflineAsset, manifestVersion: string) {
  const expectedRoot = `/media/readlr2/${encodeURIComponent(manifestVersion)}/`;
  return asset.url.startsWith(expectedRoot) && !asset.url.includes('..') && (asset.kind === 'audio' || asset.kind === 'image');
}

export async function installOfflinePack(manifestVersion: string, assets: OfflineAsset[], options: {
  fetcher?: FetchLike; cacheStorage?: CacheStorageLike; storage?: StorageLike; now?: () => string;
} = {}): Promise<OfflinePackRecord> {
  if (!VERSION.test(manifestVersion) || !assets.length || assets.some((asset) => !validAsset(asset, manifestVersion))) throw new Error('This offline pack is not valid.');
  const fetcher = options.fetcher ?? fetch;
  const downloads: Array<{ asset: OfflineAsset; response: Response }> = [];
  let bytes = 0;
  for (const asset of assets) {
    const response = await fetcher(asset.url, { cache: 'no-store', credentials: 'same-origin' });
    const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
    const length = Number(response.headers.get('Content-Length') || 0);
    if (!response.ok || (asset.kind === 'audio' ? !contentType.startsWith('audio/') : !contentType.startsWith('image/')) ||
      !Number.isFinite(length) || length < 0 || length > MAX_ASSET_BYTES || bytes + length > MAX_PACK_BYTES) {
      throw new Error('One or more approved files could not be verified. The existing pack was kept.');
    }
    bytes += length;
    downloads.push({ asset, response });
  }
  const cacheStorage = options.cacheStorage ?? browserCaches();
  const cache = await cacheStorage.open(offlinePackCacheName(manifestVersion));
  for (const download of downloads) await cache.put(download.asset.url, download.response.clone());
  const record: OfflinePackRecord = { schemaVersion: 1, manifestVersion, installedAt: (options.now ?? (() => new Date().toISOString()))(), assetCount: assets.length, bytes };
  saveRecord(record, options.storage ?? browserStorage());
  return record;
}

export async function verifyOfflinePack(manifestVersion: string, assets: OfflineAsset[], cacheStorage: CacheStorageLike = browserCaches()) {
  if (!VERSION.test(manifestVersion) || !assets.length || assets.some((asset) => !validAsset(asset, manifestVersion))) return false;
  const cache = await cacheStorage.open(offlinePackCacheName(manifestVersion));
  const matches = await Promise.all(assets.map((asset) => cache.match(asset.url)));
  return matches.every(Boolean);
}

export async function removeOfflinePack(manifestVersion: string, options: { cacheStorage?: CacheStorageLike; storage?: StorageLike } = {}) {
  if (!VERSION.test(manifestVersion)) return false;
  const removed = await (options.cacheStorage ?? browserCaches()).delete(offlinePackCacheName(manifestVersion));
  forgetRecord(manifestVersion, options.storage ?? browserStorage());
  return removed;
}

export async function registerReadlrOfflineWorker(register: (url: string, options: RegistrationOptions) => Promise<unknown> = (url, options) => navigator.serviceWorker.register(url, options)) {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return false;
  try { await register('/readlr-offline-sw.js', { scope: '/' }); return true; } catch { return false; }
}
