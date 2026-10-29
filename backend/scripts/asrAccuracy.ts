// Runs the labelled child-speech test set through the same recognizer the app uses.
// Usage: npm --workspace backend run asr:accuracy -- <folder containing labels.csv and the recordings>
import fs from 'node:fs';
import path from 'node:path';
import { recognizeCvcWord } from '../src/modules/audio/audio.service.js';
import { parseLabels, summarizeAccuracy, ASR_TARGET, type RecognizerStatus, type ScoredRow } from '../src/modules/audio/asr-accuracy.js';

const MIME: Record<string, string> = { '.webm': 'audio/webm', '.ogg': 'audio/ogg', '.mp4': 'audio/mp4', '.m4a': 'audio/mp4', '.wav': 'audio/wav' };
const folder = path.resolve(process.argv[2] ?? '');
if (!process.argv[2] || !fs.existsSync(path.join(folder, 'labels.csv'))) {
  console.error('Give the folder that holds labels.csv, e.g. npm --workspace backend run asr:accuracy -- ../asr-test');
  process.exit(1);
}
const files = new Map<string, string>();
const walk = (dir: string): void => fs.readdirSync(dir, { withFileTypes: true }).forEach(entry =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : files.set(entry.name, path.join(dir, entry.name)));
walk(folder);

const labels = parseLabels(fs.readFileSync(path.join(folder, 'labels.csv'), 'utf8'));
const missing = labels.filter(l => !files.has(l.file));
if (missing.length) { console.error(`Recordings not found: ${missing.map(l => l.file).join(', ')}`); process.exit(1); }

const scored: ScoredRow[] = [], transcripts: string[] = [];
for (const [i, label] of labels.entries()) {
  const file = files.get(label.file)!, mimetype = MIME[path.extname(file).toLowerCase()] ?? 'audio/webm';
  let status: RecognizerStatus = 'error', transcript = '';
  try {
    const result = await recognizeCvcWord({ buffer: fs.readFileSync(file), mimetype, originalname: label.file } as Express.Multer.File, label.target);
    status = result.status; transcript = result.transcript;
  } catch { /* counted as a service error */ }
  scored.push({ ...label, status });
  transcripts.push(transcript);
  process.stdout.write(`\r${i + 1}/${labels.length} checked`);
}
console.log('');

const cell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const report = ['file,target,heard,clarity,modelled,app_result,app_transcript',
  ...scored.map((r, i) => [r.file, r.target, r.heard, r.clarity, r.modelled ? 'yes' : 'no', r.status, transcripts.at(i)].map(cell).join(','))];
fs.writeFileSync(path.join(folder, 'asr-accuracy-report.csv'), report.join('\n'));

const s = summarizeAccuracy(scored), pct = (v: number | null) => v === null ? 'n/a' : `${(v * 100).toFixed(1)}%`;
console.log(`Primary accuracy: ${s.primary.accepted}/${s.primary.total} = ${pct(s.primary.rate)} (target ${ASR_TARGET * 100}%) -> ${s.primary.pass === null ? 'no clear target words' : s.primary.pass ? 'PASS' : 'NOT MET'}`);
console.log(`False accepts: ${s.falseAccepts.accepted}/${s.falseAccepts.total} = ${pct(s.falseAccepts.rate)}`);
console.log(`Excluded: ${s.excluded.unclear} unclear, ${s.excluded.silent} silent, ${s.excluded.serviceErrors} service errors`);
const weak = s.perWord.filter(w => w.rate !== null && w.rate < ASR_TARGET);
console.log(weak.length ? `Words below ${ASR_TARGET * 100}%: ${weak.map(w => `${w.target} ${w.accepted}/${w.total}`).join(', ')}` : 'No word is below the target.');
console.log(`Report written to ${path.join(folder, 'asr-accuracy-report.csv')}`);
