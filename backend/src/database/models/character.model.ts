/**
 * Character Model
 * Database operations for character configuration
 */

import { db } from '../db.js';
import type {
  Character,
  CharacterAppearance,
  CharacterBehavior,
  CharacterPersonality,
  CharacterVoice,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from '../../modules/character/character.types.js';

type CharacterRow = Omit<Character, 'appearance' | 'personality' | 'voice' | 'behaviors'>;
type CharacterBehaviorRow = Omit<CharacterBehavior, 'animation_config'> & {
  animation_config: string;
};

function mergeDefined<T extends object>(base: T, updates: Partial<T>): T {
  return Object.fromEntries(
    Object.entries({ ...base, ...updates }).filter(([, value]) => value !== undefined)
  ) as T;
}

export async function createCharacter(
  data: CreateCharacterRequest
): Promise<Character> {
  const result = await db.run(
    `INSERT INTO characters (name, template) VALUES (?, ?)`,
    [data.name, data.template]
  );

  const characterId = result.id as number;

  // Create appearance
  await db.run(
    `INSERT INTO character_appearance (character_id, head_color, head_shape, eye_color, eye_shape, mouth_color, accessories, body_color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      characterId,
      data.appearance.head_color,
      data.appearance.head_shape,
      data.appearance.eye_color,
      data.appearance.eye_shape,
      data.appearance.mouth_color,
      JSON.stringify(data.appearance.accessories),
      data.appearance.body_color,
    ]
  );

  // Create personality
  await db.run(
    `INSERT INTO character_personality (character_id, personality_type, animation_speed, expression_style)
     VALUES (?, ?, ?, ?)`,
    [
      characterId,
      data.personality.personality_type,
      data.personality.animation_speed,
      data.personality.expression_style,
    ]
  );

  // Create voice
  await db.run(
    `INSERT INTO character_voice (character_id, voice_id, pitch, speed, tone, language)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      characterId,
      data.voice.voice_id,
      data.voice.pitch,
      data.voice.speed,
      data.voice.tone,
      data.voice.language,
    ]
  );

  // Create behaviors
  if (data.behaviors && data.behaviors.length > 0) {
    for (const behavior of data.behaviors) {
      await db.run(
        `INSERT INTO character_behaviors (character_id, state, animation_config, sound_effect)
         VALUES (?, ?, ?, ?)`,
        [
          characterId,
          behavior.state,
          JSON.stringify(behavior.animation_config),
          behavior.sound_effect || null,
        ]
      );
    }
  }

  return getCharacterById(characterId);
}

export async function getCharacterById(id: number): Promise<Character> {
  const character = await db.get('SELECT * FROM characters WHERE id = ?', [id]) as CharacterRow | undefined;

  if (!character) {
    throw new Error(`Character with id ${id} not found`);
  }

  const appearance = await db.get(
    'SELECT * FROM character_appearance WHERE character_id = ?',
    [id]
  ) as (Omit<CharacterAppearance, 'accessories'> & { accessories: string }) | undefined;

  const personality = await db.get(
    'SELECT * FROM character_personality WHERE character_id = ?',
    [id]
  ) as CharacterPersonality | undefined;

  const voice = await db.get(
    'SELECT * FROM character_voice WHERE character_id = ?',
    [id]
  ) as CharacterVoice | undefined;

  const behaviors = await db.all(
    'SELECT * FROM character_behaviors WHERE character_id = ?',
    [id]
  ) as CharacterBehaviorRow[];

  if (!appearance || !personality || !voice) {
    throw new Error(`Character with id ${id} is missing related configuration`);
  }

  return {
    ...character,
    appearance: {
      ...appearance,
      accessories: JSON.parse(appearance.accessories || '[]'),
    },
    personality,
    voice,
    behaviors: behaviors.map((b) => ({
      ...b,
      animation_config: JSON.parse(b.animation_config),
    })),
  };
}

export async function getCharacterByName(name: string): Promise<Character> {
  const character = await db.get('SELECT * FROM characters WHERE name = ?', [name]);

  if (!character) {
    throw new Error(`Character with name ${name} not found`);
  }

  return getCharacterById(character.id);
}

export async function getAllCharacters(): Promise<Character[]> {
  const characters = await db.all('SELECT * FROM characters') as CharacterRow[];

  return Promise.all(characters.map((c) => getCharacterById(c.id)));
}

export async function updateCharacter(
  id: number,
  updates: UpdateCharacterRequest
): Promise<Character> {
  const current = await getCharacterById(id);

  if (updates.name) {
    await db.run('UPDATE characters SET name = ? WHERE id = ?', [updates.name, id]);
  }

  if (updates.appearance) {
    const appearance = mergeDefined(current.appearance, updates.appearance);
    await db.run(
      `UPDATE character_appearance SET 
       head_color = ?, head_shape = ?, eye_color = ?, eye_shape = ?, 
       mouth_color = ?, accessories = ?, body_color = ?
       WHERE character_id = ?`,
      [
        appearance.head_color,
        appearance.head_shape,
        appearance.eye_color,
        appearance.eye_shape,
        appearance.mouth_color,
        JSON.stringify(appearance.accessories),
        appearance.body_color,
        id,
      ]
    );
  }

  if (updates.personality) {
    const personality = mergeDefined(current.personality, updates.personality);
    await db.run(
      `UPDATE character_personality SET 
       personality_type = ?, animation_speed = ?, expression_style = ?
       WHERE character_id = ?`,
      [
        personality.personality_type,
        personality.animation_speed,
        personality.expression_style,
        id,
      ]
    );
  }

  if (updates.voice) {
    const voice = mergeDefined(current.voice, updates.voice);
    await db.run(
      `UPDATE character_voice SET 
       voice_id = ?, pitch = ?, speed = ?, tone = ?, language = ?
       WHERE character_id = ?`,
      [
        voice.voice_id,
        voice.pitch,
        voice.speed,
        voice.tone,
        voice.language,
        id,
      ]
    );
  }

  if (updates.behaviors && updates.behaviors.length > 0) {
    await db.run('DELETE FROM character_behaviors WHERE character_id = ?', [id]);
    for (const behavior of updates.behaviors) {
      await db.run(
        `INSERT INTO character_behaviors (character_id, state, animation_config, sound_effect)
         VALUES (?, ?, ?, ?)`,
        [
          id,
          behavior.state,
          JSON.stringify(behavior.animation_config),
          behavior.sound_effect || null,
        ]
      );
    }
  }

  return getCharacterById(id);
}

export async function deleteCharacter(id: number): Promise<void> {
  await db.run('DELETE FROM character_behaviors WHERE character_id = ?', [id]);
  await db.run('DELETE FROM character_voice WHERE character_id = ?', [id]);
  await db.run('DELETE FROM character_personality WHERE character_id = ?', [id]);
  await db.run('DELETE FROM character_appearance WHERE character_id = ?', [id]);
  await db.run('DELETE FROM characters WHERE id = ?', [id]);
}
