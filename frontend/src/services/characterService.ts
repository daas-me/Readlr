/**
 * Character API Service
 */

import type { Character, CreateCharacterRequest, UpdateCharacterRequest } from '../types/character';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export const characterService = {
  // Get all characters
  async getAllCharacters(): Promise<Character[]> {
    const response = await fetch(`${API_BASE}/api/characters`);
    if (!response.ok) throw new Error('Failed to fetch characters');
    const data = await response.json();
    return data.characters;
  },

  // Get single character
  async getCharacter(id: number): Promise<Character> {
    const response = await fetch(`${API_BASE}/api/characters/${id}`);
    if (!response.ok) throw new Error('Failed to fetch character');
    return response.json();
  },

  // Get character by name
  async getCharacterByName(name: string): Promise<Character> {
    const characters = await this.getAllCharacters();
    const character = characters.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!character) throw new Error(`Character ${name} not found`);
    return character;
  },

  // Create character
  async createCharacter(data: CreateCharacterRequest): Promise<Character> {
    const response = await fetch(`${API_BASE}/api/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create character');
    return response.json();
  },

  // Update character
  async updateCharacter(id: number, updates: UpdateCharacterRequest): Promise<Character> {
    const response = await fetch(`${API_BASE}/api/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update character');
    return response.json();
  },

  // Delete character
  async deleteCharacter(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/api/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete character');
  },
};
