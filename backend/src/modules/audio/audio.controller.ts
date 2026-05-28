import { Request, Response } from 'express';
import { processAudio } from './audio.service.js';

/**
 * POST /api/audio/process
 * Process child's recorded audio and compare with target vowel
 */
export async function handleAudioProcess(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const { targetPhoneme, childId, acceptedTranscripts } = req.body;

    if (!targetPhoneme) {
      return res.status(400).json({ error: 'Target phoneme required' });
    }

    // acceptedTranscripts arrives as a JSON string when sent via FormData
    let transcripts: string[] | undefined;
    if (acceptedTranscripts) {
      transcripts =
        typeof acceptedTranscripts === 'string'
          ? JSON.parse(acceptedTranscripts)
          : acceptedTranscripts;
    }

    const result = await processAudio(req.file, targetPhoneme, childId, transcripts);
    res.json(result);
  } catch (error) {
    console.error('Audio processing error:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
}
