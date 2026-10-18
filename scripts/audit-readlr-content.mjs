// Run from the repository root: node --experimental-strip-types scripts/audit-readlr-content.mjs
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { WORKSHOP_LESSONS, CROSSING_LESSONS, CONSONANTS } from '../frontend/src/app/components/bridgeCurriculum.ts';
import { CVC_LESSONS, CROWN_WORDS } from '../frontend/src/app/components/cvcContent.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'docs/refactoring');
const relative = file => path.relative(root, file).split(path.sep).join('/');
async function inventory(directory) {
  const records = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) records.push(...await inventory(file));
    else if (/\.(wav|mp3|ogg|m4a|webm|aac|flac)$/i.test(entry.name)) {
      const bytes = await readFile(file);
      records.push({ path: relative(file), bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        educatorReview: 'not_verified', disposition: 'preserve_pending_review' });
    }
  }
  return records.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}
const activities = {
  scope: 'Source inventory, not proof of skill mastery or audio approval.',
  stage1: { source: 'frontend/src/app/components/GameLevel.tsx',
    training: ['a', 'e', 'i', 'o', 'u'],
    trailGroups: {
      a: ['HeavyGate', 'BranchWall', 'StoneStep'],
      e: ['HiddenMarks', 'BlinkingSign', 'LittleLightPath'],
      i: ['MissingMapLine', 'TinyClue', 'NeedleBridge'],
      o: ['RoundGate', 'RollingStone', 'MoonDoor'],
      u: ['LowBridge', 'RainyShield', 'UpdraftPath'],
    }, inventoryMethod: 'Manually audited identifiers; recheck after source changes.' },
  stage2: { source: 'frontend/src/app/components/bridgeCurriculum.ts',
    training: WORKSHOP_LESSONS, crossings: CROSSING_LESSONS,
    ordering: 'Crossing blends are shuffled deterministically per learner; these are source defaults.',
    shelfPairs: CONSONANTS.flatMap(c => ['A','E','I','O','U'].map(v => c + v)) },
  stage3: { source: 'frontend/src/app/components/cvcContent.ts',
    lessons: CVC_LESSONS, finaleTargets: CROWN_WORDS },
};
await mkdir(output, { recursive: true });
const audio = await inventory(path.join(root, 'frontend/public/audio'));
await writeFile(path.join(output, 'activity-inventory.json'), JSON.stringify(activities, null, 2) + '\n');
await writeFile(path.join(output, 'audio-inventory.json'), JSON.stringify(audio, null, 2) + '\n');
console.log(`Inventoried 20 Stage 1 activities, ${WORKSHOP_LESSONS.length + CROSSING_LESSONS.length} Stage 2 activities, ${CVC_LESSONS.length} CVC lessons plus the crown finale, and ${audio.length} audio files.`);
