import OpenAI from 'openai';
import config from '../../config/env.js';
import { AudioResult } from './audio.types.js';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export async function processAudio(
  file: Express.Multer.File,
  targetPhoneme: string,
  childId?: string,
  acceptedTranscripts?: string[]
): Promise<AudioResult> {
  const startTime = Date.now();

  const response = await openai.audio.transcriptions.create({
    file: new File([file.buffer], file.originalname || 'audio.webm', {
      type: file.mimetype || 'audio/webm',
    }),
    model: 'whisper-1',
    language: 'en',
    response_format: 'verbose_json',
    temperature: 0,
    // hint to Whisper — improves accuracy for short phoneme/word targets
    prompt: targetPhoneme,
  });

  const durationMs = Date.now() - startTime;
  const transcription = (response.text ?? '').toLowerCase().trim();

  // Derive confidence from segment log-probabilities (verbose_json only)
  const segments = (response as any).segments as Array<{ avg_logprob: number }> | undefined;
  let confidence = 0.5;
  if (segments && segments.length > 0) {
    const avgLogprob =
      segments.reduce((sum, s) => sum + s.avg_logprob, 0) / segments.length;
    // logprob is ≤ 0; exp(0) = 1.0 (perfect), exp(-∞) → 0
    confidence = Math.max(0, Math.min(1, Math.exp(avgLogprob)));
  }

  // Match transcription against the challenge's accepted word list
  const targets = acceptedTranscripts?.length
    ? acceptedTranscripts.map(t => t.toLowerCase())
    : [targetPhoneme.toLowerCase()];

  const spokenWords = transcription.split(/\s+/);
  const matched = targets.some(
    t => spokenWords.includes(t) || transcription.includes(t)
  );

  // Score: full confidence on match, partial on near-miss
  const score = matched
    ? Math.round(confidence * 100)
    : Math.round(confidence * 40);

  const feedback = matched
    ? `Great job! You said "${targetPhoneme}" correctly!`
    : `Good try! You said "${transcription || '...'}", but try saying "${targetPhoneme}". Keep practicing!`;

  return {
    matched,
    score,
    transcription,
    detectedPhoneme: transcription,
    targetPhoneme,
    feedback,
    confidence,
    durationMs,
  };
}
