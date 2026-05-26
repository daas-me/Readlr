/**
 * Character Controller
 * Handles HTTP requests for character management
 */

import { Request, Response } from 'express';
import * as characterService from './character.service.js';
import type { CreateCharacterRequest, UpdateCharacterRequest } from './character.types.js';

export async function getAllCharacters(req: Request, res: Response): Promise<void> {
  try {
    const characters = await characterService.getAllCharacters();
    res.json({ characters, total: characters.length });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch characters',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function getCharacter(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const character = await characterService.getCharacterById(Number(id));
    res.json(character);
  } catch (error) {
    res.status(404).json({
      error: 'Character not found',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function createCharacter(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body as CreateCharacterRequest;
    const character = await characterService.createCharacter(data);
    res.status(201).json(character);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create character',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function updateCharacter(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateCharacterRequest;
    const character = await characterService.updateCharacter(Number(id), updates);
    res.json(character);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to update character',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function deleteCharacter(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await characterService.deleteCharacter(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: 'Failed to delete character',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
