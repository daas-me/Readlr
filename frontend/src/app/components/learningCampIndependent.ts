import { createEvidenceAttempt, type EvidenceAttempt, type EvidenceResult } from '../../hooks/evidenceRecords.ts';

export type CampLetter = 'm' | 'a' | 't';

export interface SoundCheckItem {
  letter: CampLetter;
  activityId: 'ENG01-MAT-I01';
  skillId: 'eng01.letter.m' | 'eng01.letter.a' | 'eng01.letter.t';
  contentId: 'eng01.grapheme.m' | 'eng01.grapheme.a' | 'eng01.grapheme.t';
  assetId: string;
  url: string;
}

const mediaRoot = '/media/readlr2/{manifest}';

export const SOUND_CHECK_ITEMS: SoundCheckItem[] = [
  { letter: 'm', activityId: 'ENG01-MAT-I01', skillId: 'eng01.letter.m', contentId: 'eng01.grapheme.m', assetId: 'media.eng01.m.phoneme.v1', url: `${mediaRoot}/m-phoneme.wav` },
  { letter: 'a', activityId: 'ENG01-MAT-I01', skillId: 'eng01.letter.a', contentId: 'eng01.grapheme.a', assetId: 'media.eng01.a.phoneme.v1', url: `${mediaRoot}/a-phoneme.wav` },
  { letter: 't', activityId: 'ENG01-MAT-I01', skillId: 'eng01.letter.t', contentId: 'eng01.grapheme.t', assetId: 'media.eng01.t.phoneme.v1', url: `${mediaRoot}/t-phoneme.wav` },
];

export const WORD_CHECK = {
  activityId: 'ENG01-MAT-I02',
  word: 'mat',
  letters: ['m', 'a', 't'] as CampLetter[],
  wordAudio: { assetId: 'media.eng01.mat.word.v1', url: `${mediaRoot}/mat-word.wav` },
  meaningImage: { assetId: 'media.eng01.mat.meaning-image.v1', url: `${mediaRoot}/mat-meaning.webp` },
} as const;

export function shuffleItems<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function resolveIndependentMedia(mediaManifestVersion: string) {
  const replace = (url: string) => url.replace('{manifest}', encodeURIComponent(mediaManifestVersion));
  return {
    soundItems: SOUND_CHECK_ITEMS.map((item) => ({ ...item, url: replace(item.url) })),
    wordAudio: { ...WORD_CHECK.wordAudio, url: replace(WORD_CHECK.wordAudio.url) },
    meaningImage: { ...WORD_CHECK.meaningImage, url: replace(WORD_CHECK.meaningImage.url) },
  };
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function verifyIndependentMedia(mediaManifestVersion: string, fetcher: FetchLike = fetch): Promise<boolean> {
  try {
    const media = resolveIndependentMedia(mediaManifestVersion);
    const assets = [
      ...media.soundItems.map((item) => ({ url: item.url, kind: 'audio' })),
      { url: media.wordAudio.url, kind: 'audio' },
      { url: media.meaningImage.url, kind: 'image' },
    ];
    const responses = await Promise.all(assets.map((asset) => fetcher(asset.url, { cache: 'force-cache' })));
    return responses.every((response, index) => {
      if (!response.ok) return false;
      const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
      return assets[index].kind === 'audio' ? contentType.startsWith('audio/') : contentType.startsWith('image/');
    });
  } catch {
    return false;
  }
}

interface EvidenceContext {
  sessionId: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  startedAt: string;
  completedAt?: string;
  capturedOffline: boolean;
}

export function createSoundCheckEvidence(input: EvidenceContext & {
  item: SoundCheckItem;
  response: CampLetter;
}, uuid?: () => string): EvidenceAttempt {
  return createEvidenceAttempt({
    sessionId: input.sessionId,
    curriculumVersion: input.curriculumVersion,
    mediaManifestVersion: input.mediaManifestVersion,
    activityId: input.item.activityId,
    skillId: input.item.skillId,
    contentId: input.item.contentId,
    mode: 'independent_check',
    responseType: 'selection',
    responseValue: input.response,
    result: input.response === input.item.letter ? 'correct' : 'incorrect',
    hintCount: 0,
    modelExposed: false,
    answerExposed: false,
    reducedChoices: false,
    mediaAssetIds: [input.item.assetId],
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    capturedOffline: input.capturedOffline,
  }, uuid);
}

export function createWordConstructionEvidence(input: EvidenceContext & {
  response: string;
  result: Extract<EvidenceResult, 'correct' | 'incorrect'>;
}, uuid?: () => string): EvidenceAttempt {
  return createEvidenceAttempt({
    sessionId: input.sessionId,
    curriculumVersion: input.curriculumVersion,
    mediaManifestVersion: input.mediaManifestVersion,
    activityId: WORD_CHECK.activityId,
    skillId: 'eng01.decode.mat',
    contentId: 'eng01.word.mat',
    mode: 'independent_check',
    responseType: 'construction',
    responseValue: input.response,
    result: input.result,
    hintCount: 0,
    modelExposed: false,
    answerExposed: false,
    reducedChoices: false,
    mediaAssetIds: [WORD_CHECK.wordAudio.assetId],
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    capturedOffline: input.capturedOffline,
  }, uuid);
}

export function createMeaningCheckEvidence(input: EvidenceContext & {
  response: 'yes' | 'no';
}, uuid?: () => string): EvidenceAttempt {
  return createEvidenceAttempt({
    sessionId: input.sessionId,
    curriculumVersion: input.curriculumVersion,
    mediaManifestVersion: input.mediaManifestVersion,
    activityId: WORD_CHECK.activityId,
    skillId: 'eng01.meaning.mat',
    contentId: 'eng01.word.mat',
    mode: 'independent_check',
    responseType: 'selection',
    responseValue: input.response,
    result: input.response === 'yes' ? 'correct' : 'incorrect',
    hintCount: 0,
    modelExposed: false,
    answerExposed: true,
    reducedChoices: true,
    mediaAssetIds: [WORD_CHECK.meaningImage.assetId],
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    capturedOffline: input.capturedOffline,
  }, uuid);
}
