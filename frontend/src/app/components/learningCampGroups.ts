export type CampGroupStatus = 'provisional' | 'approved';

export interface CampGroupGate {
  sourceReviewed: boolean;
  educatorSignoff: boolean;
  languageModelApproved: boolean;
  wordBankApproved: boolean;
  mediaApproved: boolean;
  independentRubricApproved: boolean;
  accessibilityReviewed: boolean;
  usabilityReviewed: boolean;
}

export interface CampGroupRouteStop {
  id: string;
  title: string;
  short: string;
  detail: string;
  kind: 'discover' | 'listen' | 'build' | 'change' | 'story' | 'check' | 'review';
}

export interface CampGroupDefinition {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  curriculumVersion: string;
  mediaManifestVersion: string;
  status: CampGroupStatus;
  prerequisites: string[];
  graphemes: string[];
  cumulativeGraphemes: string[];
  candidateWords: string[];
  route: CampGroupRouteStop[];
  gates: CampGroupGate;
}

export const ENG02_CAMP_GROUP: CampGroupDefinition = {
  id: 'ENG-02',
  order: 2,
  name: 'Firefly Forest',
  subtitle: 'New sounds light a longer reading trail.',
  curriculumVersion: 'readlr2-eng02-esil-draft-1',
  mediaManifestVersion: 'readlr2-eng02-esil-media-draft-1',
  status: 'provisional',
  prerequisites: ['ENG-01'],
  graphemes: ['e', 's', 'i', 'l'],
  cumulativeGraphemes: ['m', 'a', 't', 'e', 's', 'i', 'l'],
  candidateWords: ['it', 'sat', 'sit', 'set', 'met', 'let', 'lit'],
  route: [
    { id: 'lanterns', title: 'Letter Lanterns', short: 'Meet e, s, i, and l', detail: 'Discover each new letter with its approved sound and a clear mouth cue.', kind: 'discover' },
    { id: 'echo-creek', title: 'Echo Creek', short: 'Hear the difference', detail: 'Sort the new sounds, including the important short e and short i contrast.', kind: 'listen' },
    { id: 'word-weaver', title: 'Word Weaver', short: 'Build it and sit', detail: 'Use old and new letters together instead of practicing the second group in isolation.', kind: 'build' },
    { id: 'switchback', title: 'Switchback Steps', short: 'Change one sound', detail: 'Move between sat, sit, and set by changing only the vowel tile.', kind: 'change' },
    { id: 'firefly-story', title: 'Firefly Story', short: 'Read a tiny scene', detail: 'Apply approved words in short cumulative text, then answer a separate meaning question.', kind: 'story' },
    { id: 'forest-lookout', title: 'Forest Lookout', short: 'Try fresh items', detail: 'Complete an unmodeled check without pictures, answer audio, or repeated coaching.', kind: 'check' },
    { id: 'moonlit-return', title: 'Moonlit Return', short: 'Come back later', detail: 'Use the same letter set in a different context after a delay.', kind: 'review' },
  ],
  gates: {
    sourceReviewed: true,
    educatorSignoff: false,
    languageModelApproved: false,
    wordBankApproved: false,
    mediaApproved: false,
    independentRubricApproved: false,
    accessibilityReviewed: false,
    usabilityReviewed: false,
  },
};

export function canReleaseCampGroup(group: CampGroupDefinition): boolean {
  return group.status === 'approved' && Object.values(group.gates).every(Boolean);
}

export function completedCampGroupGates(group: CampGroupDefinition): number {
  return Object.values(group.gates).filter(Boolean).length;
}
