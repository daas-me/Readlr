import { Buffer } from 'buffer';
import { AudioResult } from './audio.types.js';

// Phoneme mapping for common vowels
const PHONEME_PATTERNS: Record<string, string[]> = {
  'ah': ['ah', 'a', 'ɑ'],
  'ee': ['ee', 'i', 'iː'],
  'oo': ['oo', 'u', 'uː'],
  'eh': ['eh', 'e', 'ɛ'],
  'ih': ['ih', 'ɪ'],
};

/**
 * Process audio and calculate phoneme score
 * For now, this is a simplified implementation without external APIs
 */
export async function processAudio(
  file: Express.Multer.File,
  targetPhoneme: string,
  childId?: string
): Promise<AudioResult> {
  try {
    // TODO: Replace with actual audio processing once API is ready
    // For now, we'll simulate with simple random scoring
    
    const detectedPhoneme = generateRandomPhoneme();
    const matched = comparePhonemes(detectedPhoneme, targetPhoneme);
    const score = calculateScore(detectedPhoneme, targetPhoneme);
    const feedback = generateFeedback(matched, targetPhoneme, detectedPhoneme);

    return {
      matched,
      score,
      transcription: `[Audio received - ${file.originalname}]`,
      detectedPhoneme,
      targetPhoneme,
      feedback,
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
}

function generateRandomPhoneme(): string {
  const phonemes = Object.keys(PHONEME_PATTERNS);
  return phonemes[Math.floor(Math.random() * phonemes.length)];
}

function comparePhonemes(detected: string, target: string): boolean {
  // Normalize both phonemes
  const detectedPatterns = PHONEME_PATTERNS[detected.toLowerCase()] || [detected];
  const targetPatterns = PHONEME_PATTERNS[target.toLowerCase()] || [target];

  // Check if there's any overlap
  return detectedPatterns.some(d => targetPatterns.includes(d));
}

function calculateScore(detected: string, target: string): number {
  // Return score 0-100
  if (detected.toLowerCase() === target.toLowerCase()) {
    return 100;
  }

  // Check if they're similar phonemes
  const detectedPatterns = PHONEME_PATTERNS[detected.toLowerCase()] || [];
  const targetPatterns = PHONEME_PATTERNS[target.toLowerCase()] || [];

  if (detectedPatterns.some(d => targetPatterns.includes(d))) {
    return 75;
  }

  // Levenshtein distance for partial match
  const distance = levenshteinDistance(detected, target);
  const maxLength = Math.max(detected.length, target.length);
  return Math.max(0, 100 - (distance / maxLength) * 100);
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

function generateFeedback(matched: boolean, target: string, detected: string): string {
  if (matched) {
    return `Great job! You said "${target}" correctly!`;
  }

  if (detected === target) {
    return `Perfect! You nailed the "${target}" sound!`;
  }

  return `Good try! You said "${detected}", but try the "${target}" sound. Keep practicing!`;
}
