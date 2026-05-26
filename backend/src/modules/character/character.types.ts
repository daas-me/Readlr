/**
 * Character Module Types
 */

export type CharacterTemplate = 'fox' | 'owl' | 'penguin' | 'dragon' | 'custom';
export type PersonalityType = 'friendly' | 'playful' | 'wise' | 'energetic' | 'calm';
export type ExpressionStyle = 'animated' | 'subtle' | 'expressive' | 'minimal';
export type CharacterState = 'idle' | 'speaking' | 'listening' | 'celebrating' | 'encouraging' | 'thinking';

export interface CharacterAppearance {
  id?: number;
  character_id?: number;
  head_color: string;
  head_shape: string;
  eye_color: string;
  eye_shape: string;
  mouth_color: string;
  accessories: string[];
  body_color: string;
}

export interface CharacterPersonality {
  id?: number;
  character_id?: number;
  personality_type: PersonalityType;
  animation_speed: number; // 0.5 to 2.0
  expression_style: ExpressionStyle;
}

export interface CharacterVoice {
  id?: number;
  character_id?: number;
  voice_id: string;
  pitch: number; // 0.5 to 2.0
  speed: number; // 0.5 to 2.0
  tone: 'friendly' | 'professional' | 'playful' | 'educational';
  language: string;
}

export interface CharacterBehavior {
  id?: number;
  character_id?: number;
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

export interface CreateCharacterRequest {
  name: string;
  template: CharacterTemplate;
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  voice: CharacterVoice;
  behaviors?: CharacterBehavior[];
}

export interface UpdateCharacterRequest {
  name?: string;
  appearance?: Partial<CharacterAppearance>;
  personality?: Partial<CharacterPersonality>;
  voice?: Partial<CharacterVoice>;
  behaviors?: CharacterBehavior[];
}

export interface CharacterResponse extends Character {}

export interface CharacterListResponse {
  characters: Character[];
  total: number;
}
