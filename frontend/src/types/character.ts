/**
 * Frontend Character Types
 */

export type CharacterTemplate = 'fox' | 'owl' | 'penguin' | 'dragon' | 'custom';
export type PersonalityType = 'friendly' | 'playful' | 'wise' | 'energetic' | 'calm';
export type ExpressionStyle = 'animated' | 'subtle' | 'expressive' | 'minimal';
export type CharacterState =
  | 'idle'
  | 'speaking'
  | 'listening'
  | 'celebrating'
  | 'encouraging'
  | 'thinking';

export interface CharacterAppearance {
  head_color: string;
  head_shape: string;
  eye_color: string;
  eye_shape: string;
  mouth_color: string;
  accessories: string[];
  body_color: string;
}

export interface CharacterPersonality {
  personality_type: PersonalityType;
  animation_speed: number;
  expression_style: ExpressionStyle;
}

export interface CharacterVoice {
  voice_id: string;
  pitch: number;
  speed: number;
  tone: 'friendly' | 'professional' | 'playful' | 'educational';
  language: string;
}

export interface CharacterBehavior {
  state: CharacterState;
  animation_config: Record<string, any>;
  sound_effect?: string;
}

export interface Character {
  id: number;
  name: string;
  template: CharacterTemplate;
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  voice: CharacterVoice;
  behaviors: CharacterBehavior[];
  created_at: string;
  updated_at: string;
}

export interface CharacterState {
  currentCharacter: Character | null;
  isLoading: boolean;
  error: string | null;
}
