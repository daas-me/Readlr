import { Router, Request, Response } from 'express';
import multer from 'multer';
import { processAudio } from '../services/audioService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/audio/process
 * Process child's recorded audio and compare with target vowel
 */
router.post('/process', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { targetPhoneme, childId } = req.body;

    if (!targetPhoneme) {
      return res.status(400).json({ error: 'Target phoneme required' });
    }

    const result = await processAudio(req.file, targetPhoneme, childId);
    res.json(result);
  } catch (error) {
    console.error('Audio processing error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

export default router;
