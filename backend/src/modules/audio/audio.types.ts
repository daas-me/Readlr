export interface AudioResult {
  matched: boolean;
  score: number;
  transcription: string;
  detectedPhoneme: string;
  targetPhoneme: string;
  feedback: string;
}

export interface AudioProcessRequest {
  targetPhoneme: string;
  childId?: string;
}

export interface PhonemePatterns {
  [key: string]: string[];
}
