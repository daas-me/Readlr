export type MiloGuidanceMode = 'full' | 'concise';
export type MiloGuidanceContext = 'guided_blend' | 'adventure' | 'independent_check' | 'delayed_review';
export type MiloGuidanceEvent = 'intro' | 'return' | 'first_error' | 'repeated_error' | 'success';
export type MiloGuidanceAction = 'none' | 'play_sound_model' | 'offer_hint' | 'suggest_review';

export interface MiloGuidanceLine {
  text: string;
  action: MiloGuidanceAction;
  actionLabel?: string;
}

type GuidanceTemplate = Record<MiloGuidanceEvent, { full: string; concise: string; action: MiloGuidanceAction; actionLabel?: string }>;

const GUIDANCE: Record<MiloGuidanceContext, GuidanceTemplate> = {
  guided_blend: {
    intro: { full: 'Hear each model from left to right. Then build the word with the letter tiles.', concise: 'Hear it. Then build it.', action: 'none' },
    return: { full: 'Welcome back. Start with the sound models, then build from left to right.', concise: 'Hear, then build.', action: 'none' },
    first_error: { full: 'Start at the empty space. Which letter comes next from left to right?', concise: 'Find the next letter.', action: 'offer_hint', actionLabel: 'Show the next space' },
    repeated_error: { full: 'Let us hear the approved models again, then return to the tiles.', concise: 'Hear the models again.', action: 'play_sound_model', actionLabel: 'Hear models again' },
    success: { full: 'You joined the sounds and built the word.', concise: 'Word built!', action: 'none' },
  },
  adventure: {
    intro: { full: 'Use the picture clue, then build the camp word from left to right.', concise: 'See it. Build it.', action: 'none' },
    return: { full: 'The bridge remembers you. Build the word from left to right.', concise: 'Build the bridge word.', action: 'none' },
    first_error: { full: 'Look at the first empty bridge plank. Choose the sound that belongs there.', concise: 'Check the next plank.', action: 'offer_hint', actionLabel: 'Focus the next plank' },
    repeated_error: { full: 'We can practice joining the sounds before trying this bridge again.', concise: 'Practice the blend first.', action: 'suggest_review', actionLabel: 'Return to Camp practice' },
    success: { full: 'You built the word and restored the bridge.', concise: 'Bridge restored!', action: 'none' },
  },
  independent_check: {
    intro: { full: 'This is your quiet try. Milo will wait while you listen once and choose for yourself.', concise: 'Your turn. I will wait.', action: 'none' },
    return: { full: 'Take another quiet try. No hints appear while an answer is in progress.', concise: 'Try on your own.', action: 'none' },
    first_error: { full: 'That answer is saved. Let us move to the matching practice after the check.', concise: 'Saved. Practice comes next.', action: 'suggest_review', actionLabel: 'Open focused practice' },
    repeated_error: { full: 'The check will stop here so we can practice the smallest missing skill.', concise: 'Pause and practice.', action: 'suggest_review', actionLabel: 'Open focused practice' },
    success: { full: 'Your answers are saved for review.', concise: 'Check saved.', action: 'none' },
  },
  delayed_review: {
    intro: { full: 'A little time has passed. Try these sounds and one word without a clue.', concise: 'What do you remember?', action: 'none' },
    return: { full: 'This later check is ready. Milo will stay quiet while you remember.', concise: 'Try the later check.', action: 'none' },
    first_error: { full: 'That answer stays saved. Practice can happen after the review.', concise: 'Saved. Keep going.', action: 'none' },
    repeated_error: { full: 'Finish this short review, then revisit the focused blend lesson.', concise: 'Review, then practice.', action: 'suggest_review', actionLabel: 'Practice after review' },
    success: { full: 'Your later answers are saved separately from your first check.', concise: 'Later check saved.', action: 'none' },
  },
};

export function getMiloGuidance(context: MiloGuidanceContext, event: MiloGuidanceEvent, mode: MiloGuidanceMode): MiloGuidanceLine {
  const template = GUIDANCE[context][event];
  return { text: template[mode], action: template.action, actionLabel: template.actionLabel };
}

export function canMiloPerform(action: MiloGuidanceAction): boolean {
  return action === 'none' || action === 'play_sound_model' || action === 'offer_hint' || action === 'suggest_review';
}

export function miloGuidanceSeenKey(learnerId: number, context: MiloGuidanceContext): string {
  return `readlr_milo_guidance_v1_${learnerId}_${context}`;
}
