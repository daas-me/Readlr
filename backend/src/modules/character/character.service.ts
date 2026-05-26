/**
 * Character Service
 * Business logic for character management
 */

import * as characterModel from '../../database/models/character.model.js';
import type {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from './character.types.js';

// Default character templates
const CHARACTER_TEMPLATES = {
  fox: {
    appearance: {
      head_color: '#FF6B35',
      head_shape: 'circle',
      eye_color: '#FFFFFF',
      eye_shape: 'almond',
      mouth_color: '#000000',
      accessories: ['ears', 'tail'],
      body_color: '#FFB347',
    },
    personality: {
      personality_type: 'playful' as const,
      animation_speed: 1.2,
      expression_style: 'expressive' as const,
    },
    voice: {
      voice_id: 'fox_voice',
      pitch: 1.2,
      speed: 1.0,
      tone: 'playful' as const,
      language: 'en',
    },
  },
  owl: {
    appearance: {
      head_color: '#8B6F47',
      head_shape: 'circle',
      eye_color: '#FFD700',
      eye_shape: 'round',
      mouth_color: '#FF6B35',
      accessories: ['feathers', 'spectacles'],
      body_color: '#A0826D',
    },
    personality: {
      personality_type: 'wise' as const,
      animation_speed: 0.8,
      expression_style: 'subtle' as const,
    },
    voice: {
      voice_id: 'owl_voice',
      pitch: 0.9,
      speed: 0.9,
      tone: 'educational' as const,
      language: 'en',
    },
  },
  penguin: {
    appearance: {
      head_color: '#000000',
      head_shape: 'circle',
      eye_color: '#FFFFFF',
      eye_shape: 'round',
      mouth_color: '#FF6B35',
      accessories: ['bow_tie'],
      body_color: '#FFFFFF',
    },
    personality: {
      personality_type: 'friendly' as const,
      animation_speed: 1.0,
      expression_style: 'animated' as const,
    },
    voice: {
      voice_id: 'penguin_voice',
      pitch: 1.1,
      speed: 1.0,
      tone: 'friendly' as const,
      language: 'en',
    },
  },
  dragon: {
    appearance: {
      head_color: '#FF6347',
      head_shape: 'triangle',
      eye_color: '#FFD700',
      eye_shape: 'sharp',
      mouth_color: '#FF8C00',
      accessories: ['horns', 'wings', 'scales'],
      body_color: '#DC143C',
    },
    personality: {
      personality_type: 'energetic' as const,
      animation_speed: 1.5,
      expression_style: 'expressive' as const,
    },
    voice: {
      voice_id: 'dragon_voice',
      pitch: 0.8,
      speed: 1.1,
      tone: 'playful' as const,
      language: 'en',
    },
  },
};

export async function createCharacter(
  data: CreateCharacterRequest
): Promise<Character> {
  return characterModel.createCharacter(data);
}

export async function getCharacterById(id: number): Promise<Character> {
  return characterModel.getCharacterById(id);
}

export async function getCharacterByName(name: string): Promise<Character> {
  return characterModel.getCharacterByName(name);
}

export async function getAllCharacters(): Promise<Character[]> {
  return characterModel.getAllCharacters();
}

export async function updateCharacter(
  id: number,
  updates: UpdateCharacterRequest
): Promise<Character> {
  return characterModel.updateCharacter(id, updates);
}

export async function deleteCharacter(id: number): Promise<void> {
  return characterModel.deleteCharacter(id);
}

export async function initializeDefaultCharacters(): Promise<void> {
  try {
    const existingCharacters = await getAllCharacters();

    if (existingCharacters.length > 0) {
      console.log(`Characters already initialized: ${existingCharacters.length} characters found`);
      return; // Already initialized
    }

    console.log('Initializing default characters...');
    for (const [templateName, template] of Object.entries(CHARACTER_TEMPLATES)) {
    const defaultBehaviors = [
      {
        state: 'idle' as const,
        animation_config: { y: [0, -6, 0], transition: { duration: 2 } },
        sound_effect: undefined,
      },
      {
        state: 'speaking' as const,
        animation_config: { scale: [1, 1.05, 1], transition: { duration: 0.5 } },
        sound_effect: undefined,
      },
      {
        state: 'listening' as const,
        animation_config: { scale: [1, 1.03, 1], transition: { duration: 1.4 } },
        sound_effect: undefined,
      },
      {
        state: 'celebrating' as const,
        animation_config: { y: [0, -20, 0], rotate: [-5, 5, -5] },
        sound_effect: 'celebration',
      },
      {
        state: 'encouraging' as const,
        animation_config: { rotate: [-3, 3, -3] },
        sound_effect: undefined,
      },
      {
        state: 'thinking' as const,
        animation_config: { rotate: [-2, 2, -2] },
        sound_effect: undefined,
      },
    ];

    await createCharacter({
      name: templateName,
      template: templateName as any,
      appearance: template.appearance,
      personality: template.personality,
      voice: template.voice,
      behaviors: defaultBehaviors,
    });
    console.log(`Created character: ${templateName}`);
    }

    console.log('Default characters initialized successfully');
  } catch (error) {
    console.error('Error initializing default characters:', error);
  }
}
