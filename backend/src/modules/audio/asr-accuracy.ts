// Scoring for the labelled child-speech accuracy test (pilot materials, section 5). Human labels decide
// what the child said; the recognizer is judged against them, never the other way round.
export const ASR_TARGET = 0.85;
export type Clarity = 'clear' | 'unclear' | 'silent';
export type RecognizerStatus = 'matched' | 'different' | 'uncertain' | 'error';
export interface LabelRow { file: string; target: string; heard: string; clarity: Clarity; modelled: boolean; rater: string }
export interface ScoredRow extends LabelRow { status: RecognizerStatus }

const word = (value: string) => value.trim().toLowerCase();
export function parseLabels(csv: string): LabelRow[] {
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const header = (lines.shift() ?? '').split(',').map(word);
  const missing = ['file', 'target', 'heard', 'clarity'].filter(column => !header.includes(column));
  if (missing.length) throw new Error(`labels.csv is missing column(s): ${missing.join(', ')}`);
  const rows = lines.map((line, i) => {
    const cells = line.split(',');
    const get = (column: string) => (cells[header.indexOf(column)] ?? '').trim();
    const clarity = word(get('clarity')) as Clarity;
    if (!['clear', 'unclear', 'silent'].includes(clarity)) throw new Error(`Row ${i + 2}: clarity must be clear, unclear or silent`);
    if (!get('file') || !get('target')) throw new Error(`Row ${i + 2}: file and target are required`);
    return { file: get('file'), target: word(get('target')), heard: word(get('heard')), clarity,
      modelled: word(get('modelled')) === 'yes', rater: get('rater') };
  });
  const seen = new Set<string>(), repeated = rows.filter(r => seen.has(r.file) || !seen.add(r.file)).map(r => r.file);
  if (repeated.length) throw new Error(`Each file needs one final label. Repeated: ${[...new Set(repeated)].join(', ')}`);
  return rows;
}

const rate = (n: number, d: number) => d ? n / d : null;
export function summarizeAccuracy(rows: ScoredRow[]) {
  const said = rows.filter(r => r.clarity === 'clear' && r.heard === r.target);
  const accepted = said.filter(r => r.status === 'matched').length;
  const otherWord = rows.filter(r => r.clarity === 'clear' && r.heard && r.heard !== r.target);
  const falseAccepts = otherWord.filter(r => r.status === 'matched').length;
  const words = [...new Set(said.map(r => r.target))].sort();
  return {
    primary: { accepted, total: said.length, rate: rate(accepted, said.length), pass: said.length ? accepted / said.length >= ASR_TARGET : null },
    falseAccepts: { accepted: falseAccepts, total: otherWord.length, rate: rate(falseAccepts, otherWord.length) },
    excluded: { unclear: rows.filter(r => r.clarity === 'unclear').length, silent: rows.filter(r => r.clarity === 'silent').length,
      serviceErrors: rows.filter(r => r.status === 'error').length },
    perWord: words.map(target => {
      const tries = said.filter(r => r.target === target), ok = tries.filter(r => r.status === 'matched').length;
      return { target, accepted: ok, total: tries.length, rate: rate(ok, tries.length) };
    }),
  };
}
