export type DiscoveryPlaceId = 'library' | 'puzzles' | 'garden' | 'trail' | 'review';

export interface DiscoveryPlace {
  id: DiscoveryPlaceId;
  title: string;
  short: string;
  purpose: string;
  status: 'prototype' | 'review_due';
}

export const DISCOVERY_PLACES: DiscoveryPlace[] = [
  { id: 'library', title: 'Storybook Library', short: 'Turn the pages', purpose: 'Choose and reread short decodable stories.', status: 'prototype' },
  { id: 'puzzles', title: 'Puzzle Workshop', short: 'Change a word', purpose: 'Use familiar letters in a new word puzzle.', status: 'prototype' },
  { id: 'garden', title: 'Reading Garden', short: 'Grow your space', purpose: 'Restore a personal place through optional reading play.', status: 'prototype' },
  { id: 'trail', title: 'Adventure Trails', short: 'Follow a clue', purpose: 'Use a word clue to choose the next story path.', status: 'prototype' },
  { id: 'review', title: 'Review Quest', short: 'Remember later', purpose: 'Try a short later check without changing earlier evidence.', status: 'review_due' },
];

export const DISCOVERY_STORY_PAGES = [
  { eyebrow: 'A visitor', text: 'Tam.' },
  { eyebrow: 'A place to rest', text: 'A mat.' },
  { eyebrow: 'The little ending', text: 'Tam at a mat.' },
] as const;

export function addLetterToAt(letter: string): 'mat' | null {
  return letter.toLowerCase() === 'm' ? 'mat' : null;
}

export function isDiscoveryTrailChoice(choice: string): boolean {
  return choice.toLowerCase() === 'mat';
}

export function discoveryMayAffectMastery(): false {
  return false;
}
