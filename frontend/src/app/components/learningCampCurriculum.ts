import { createEvidenceAttempt, type EvidenceAttempt } from '../../hooks/evidenceRecords.ts';

export type CampWord = 'am' | 'at' | 'mat';

export interface GuidedBlendLesson {
  word: CampWord;
  activityId: 'ENG01-MAT-B01' | 'ENG01-MAT-B02' | 'ENG01-MAT-B03';
  skillId: 'eng01.blend.am' | 'eng01.blend.at' | 'eng01.decode.mat';
  contentId: 'eng01.word.am' | 'eng01.word.at' | 'eng01.word.mat';
  title: string;
  prompt: string;
  letters: string[];
  media: Array<{ assetId: string; url: string; kind: 'audio' | 'image'; label: string }>;
}

const mediaRoot = '/media/readlr2/{manifest}';

export const GUIDED_BLEND_LESSONS: GuidedBlendLesson[] = [
  {
    word: 'am', activityId: 'ENG01-MAT-B01', skillId: 'eng01.blend.am', contentId: 'eng01.word.am',
    title: 'Build am', prompt: 'Join the vowel and the humming sound.', letters: ['a', 'm'],
    media: [
      { assetId: 'media.eng01.am.segmented.v1', url: `${mediaRoot}/am-segmented.wav`, kind: 'audio', label: 'Sound by sound' },
      { assetId: 'media.eng01.am.continuous.v1', url: `${mediaRoot}/am-continuous.wav`, kind: 'audio', label: 'Slide together' },
      { assetId: 'media.eng01.am.word.v1', url: `${mediaRoot}/am-word.wav`, kind: 'audio', label: 'Whole word' },
    ],
  },
  {
    word: 'at', activityId: 'ENG01-MAT-B02', skillId: 'eng01.blend.at', contentId: 'eng01.word.at',
    title: 'Build at', prompt: 'Join the vowel and the quick ending sound.', letters: ['a', 't'],
    media: [
      { assetId: 'media.eng01.at.segmented.v1', url: `${mediaRoot}/at-segmented.wav`, kind: 'audio', label: 'Sound by sound' },
      { assetId: 'media.eng01.at.continuous.v1', url: `${mediaRoot}/at-continuous.wav`, kind: 'audio', label: 'Slide together' },
      { assetId: 'media.eng01.at.word.v1', url: `${mediaRoot}/at-word.wav`, kind: 'audio', label: 'Whole word' },
    ],
  },
  {
    word: 'mat', activityId: 'ENG01-MAT-B03', skillId: 'eng01.decode.mat', contentId: 'eng01.word.mat',
    title: 'Build mat', prompt: 'Bring all three sounds across the bridge.', letters: ['m', 'a', 't'],
    media: [
      { assetId: 'media.eng01.mat.segmented.v1', url: `${mediaRoot}/mat-segmented.wav`, kind: 'audio', label: 'Sound by sound' },
      { assetId: 'media.eng01.mat.continuous.v1', url: `${mediaRoot}/mat-continuous.wav`, kind: 'audio', label: 'Slide together' },
      { assetId: 'media.eng01.mat.word.v1', url: `${mediaRoot}/mat-word.wav`, kind: 'audio', label: 'Whole word' },
      { assetId: 'media.eng01.mat.meaning-image.v1', url: `${mediaRoot}/mat-meaning.webp`, kind: 'image', label: 'Meaning picture' },
    ],
  },
];

export function resolveGuidedLessonMedia(lesson: GuidedBlendLesson, mediaManifestVersion: string): GuidedBlendLesson {
  return {
    ...lesson,
    media: lesson.media.map((asset) => ({
      ...asset,
      url: asset.url.replace('{manifest}', encodeURIComponent(mediaManifestVersion)),
    })),
  };
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function verifyGuidedMedia(lesson: GuidedBlendLesson, fetcher: FetchLike = fetch): Promise<boolean> {
  try {
    const responses = await Promise.all(lesson.media.map((asset) => fetcher(asset.url, { cache: 'force-cache' })));
    return responses.every((response, index) => {
      if (!response.ok) return false;
      const expected = lesson.media[index].kind;
      const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
      return expected === 'audio' ? contentType.startsWith('audio/') : contentType.startsWith('image/');
    });
  } catch {
    return false;
  }
}

export function acceptGuidedTile(expected: string[], placed: string[], letter: string) {
  const correct = expected[placed.length] === letter;
  return { correct, placed: correct ? [...placed, letter] : placed };
}

export function createGuidedBlendEvidence(input: {
  lesson: GuidedBlendLesson;
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
    activityId: input.lesson.activityId,
    skillId: input.lesson.skillId,
    contentId: input.lesson.contentId,
    mode: 'guided',
    responseType: 'construction',
    responseValue: input.lesson.word,
    result: 'correct',
    hintCount: input.hintCount,
    modelExposed: true,
    answerExposed: true,
    reducedChoices: false,
    mediaAssetIds: input.lesson.media.map((asset) => asset.assetId),
    startedAt: input.startedAt,
    completedAt: input.completedAt ?? new Date().toISOString(),
    capturedOffline: input.capturedOffline,
  }, uuid);
}
