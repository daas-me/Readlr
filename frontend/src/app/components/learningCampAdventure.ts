import { createEvidenceAttempt, type EvidenceAttempt } from '../../hooks/evidenceRecords.ts';

export const CAMP_ADVENTURE = {
  activityId: 'ENG01-MAT-A01',
  skillId: 'eng01.decode.mat',
  contentId: 'eng01.word.mat',
  word: 'mat',
  letters: ['m', 'a', 't'],
  meaningAsset: {
    assetId: 'media.eng01.mat.meaning-image.v1',
    url: '/media/readlr2/{manifest}/mat-meaning.webp',
  },
} as const;

export function resolveAdventureMedia(mediaManifestVersion: string) {
  return {
    ...CAMP_ADVENTURE,
    meaningAsset: {
      ...CAMP_ADVENTURE.meaningAsset,
      url: CAMP_ADVENTURE.meaningAsset.url.replace('{manifest}', encodeURIComponent(mediaManifestVersion)),
    },
  };
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function verifyAdventureMedia(
  mediaManifestVersion: string,
  fetcher: FetchLike = fetch,
): Promise<boolean> {
  try {
    const { meaningAsset } = resolveAdventureMedia(mediaManifestVersion);
    const response = await fetcher(meaningAsset.url, { cache: 'force-cache' });
    return response.ok && (response.headers.get('Content-Type')?.toLowerCase() ?? '').startsWith('image/');
  } catch {
    return false;
  }
}

export function placeAdventureTile(placed: string[], letter: string) {
  const expected = CAMP_ADVENTURE.letters[placed.length];
  return { correct: expected === letter, placed: expected === letter ? [...placed, letter] : placed };
}

export function createAdventureEvidence(input: {
  sessionId: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  hintCount: number;
  startedAt: string;
  completedAt?: string;
  capturedOffline: boolean;
}, uuid?: () => string): EvidenceAttempt {
  return createEvidenceAttempt({
    sessionId: input.sessionId,
    curriculumVersion: input.curriculumVersion,
    mediaManifestVersion: input.mediaManifestVersion,
    activityId: CAMP_ADVENTURE.activityId,
    skillId: CAMP_ADVENTURE.skillId,
    contentId: CAMP_ADVENTURE.contentId,
    mode: 'adventure',
    responseType: 'construction',
    responseValue: CAMP_ADVENTURE.word,
    result: 'correct',
    hintCount: input.hintCount,
    modelExposed: false,
    answerExposed: input.hintCount > 0,
    reducedChoices: true,
    mediaAssetIds: [CAMP_ADVENTURE.meaningAsset.assetId],
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    capturedOffline: input.capturedOffline,
  }, uuid);
}
