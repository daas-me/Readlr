import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Milo narration preference is constrained and defaults to concise', () => {
  const migration = readFileSync(new URL('../supabase/migrations/202610130004_milo_guidance.sql', import.meta.url), 'utf8');
  const controller = readFileSync(new URL('../src/modules/settings/settings.controller.ts', import.meta.url), 'utf8');
  const service = readFileSync(new URL('../src/modules/settings/settings.service.ts', import.meta.url), 'utf8');
  assert.match(migration, /default 'concise'/);
  assert.match(migration, /narration_mode in \('full', 'concise'\)/);
  assert.match(controller, /narration_mode must be full or concise/);
  assert.match(service, /settings\.narration_mode \?\? 'concise'/);
});
