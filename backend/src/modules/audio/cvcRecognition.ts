// Bounded English word bank shared by the legacy CVC journey and ARAL-informed expansion.
export const CVC_TARGETS = new Set(['sun','map','hen','cup','rug','pot','net','bug','hat','log','bed','pen','pig','tin','bag','gem','fan','lid','top']);
export const READING_TARGETS = new Set([...CVC_TARGETS,
  'am','at','mat','sat','sit','set','met','let','lit','pin','fin','hop','hot','sob','bin','bun','hut','mud','bus',
  'dug','cub','tub','sad','lad','web','wet','win','kid','kit','keg','van','yam','wax','jet','fox','zip','cap','cape','kite','hope','cube','tree','seed','feet',
  'mango','apple','egg','insect','octopus','umbrella','dog','goat','quilt','box','mix','mop','pan','pup','tap','ten']);
// Same vocabulary for every challenge, never the current expected answer alone.
export const CVC_TRANSCRIPTION_CONTEXT = `English reading practice with short words: ${[...READING_TARGETS].join(', ')}. Write spoken words, not numerals.`;
// The target word is deliberately left out: naming it makes Whisper write near-misses
// such as "toop" or "soon" as the expected word.
export function cvcTranscriptionPrompt(_target:string) {
  return `A learner is reading one short word aloud. Transcribe only what the learner actually says. ${CVC_TRANSCRIPTION_CONTEXT}`;
}
export interface RecognitionSegment { avg_logprob?:number; no_speech_prob?:number; compression_ratio?:number }
const TARGET_EQUIVALENTS:Record<string,Set<string>>={
  am:new Set(['am','m']),
  at:new Set(['at','add']),
  mat:new Set(['mat','matt']),
};
export function judgeCvcWord(target:string, text:string, segments:RecognitionSegment[] = []) {
  const words = text.toLowerCase().trim().replace(/[.,!?;:"()]/g,' ').split(/\s+/).filter(Boolean);
  const reliable = segments.length > 0 && segments.every(s =>
    typeof s.avg_logprob === 'number' && Number.isFinite(s.avg_logprob) && s.avg_logprob >= -1 && s.avg_logprob <= 0 &&
    typeof s.no_speech_prob === 'number' && Number.isFinite(s.no_speech_prob) && s.no_speech_prob >= 0 && s.no_speech_prob < .6 &&
    typeof s.compression_ratio === 'number' && Number.isFinite(s.compression_ratio) && s.compression_ratio >= 0 && s.compression_ratio <= 2.4);
  // Quality gates are transcription heuristics, not a pronunciation score.
  const accepted=TARGET_EQUIVALENTS[target]??new Set([target]);
  const status = !reliable || !words.length ? 'uncertain' :
    words.length <= 4 && words.every(word=>accepted.has(word)) ? 'matched' : 'different';
  return {status, target, transcript:text.slice(0,200), source:'groq-whisper', pronunciationAccuracy:null} as const;
}
