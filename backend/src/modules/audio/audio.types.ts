export interface AudioResult {
  matched: boolean;
  score: number;
  transcription: string;
  detectedPhoneme: string;
  targetPhoneme: string;
  feedback: string;
  confidence: number;
  durationMs: number;
}

export interface AudioProcessRequest {
  targetPhoneme: string;
  acceptedTranscripts?: string[];
  childId?: string;
}

export interface PhonemePatterns {
  [key: string]: string[];
}
