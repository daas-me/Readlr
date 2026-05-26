/**
 * Character Routes
 */

import { Router } from 'express';
import * as characterController from './character.controller.js';

const router = Router();

// Get all characters
router.get('/', characterController.getAllCharacters);

// Get specific character
router.get('/:id', characterController.getCharacter);

// Create character
router.post('/', characterController.createCharacter);

// Update character
router.put('/:id', characterController.updateCharacter);

// Delete character
router.delete('/:id', characterController.deleteCharacter);

export default router;
