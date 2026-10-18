import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { supabase } from '../src/database/db.js';
import { READING_VERSION, READING_MEDIA } from '../src/modules/evidence/reading-catalog.js';
import { getLearningCampAccess } from '../src/modules/evidence/camp-access.js';
import { effectivePolicy } from '../src/modules/admin/classroom.service.js';
import { readingProgress } from '../src/modules/evidence/reading-checkpoints.js';
import type { Request, Response } from 'express';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Supply the explicitly approved pilot account email.');
const { data: user, error } = await supabase.from('users').select('id').eq('email', email).single();
if (error || !user) throw new Error('Pilot account was not found; no release was changed.');
const root = resolve('..');
const digest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
const curriculum = await Promise.all(['frontend/src/app/components/aralCurriculum.ts', 'backend/src/modules/evidence/reading-catalog.ts'].map(async path => ({ path, sha256: digest(await readFile(resolve(root, path))) })));
const media: Array<{path:string;sha256:string}> = [];
async function walk(directory:string) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = resolve(directory,entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (/\.(wav|mp3|ogg|m4a|png|webp|svg|jpg|jpeg)$/i.test(entry.name)) media.push({path:relative(root,path).replaceAll('\\','/'),sha256:digest(await readFile(path))});
  }
}
await walk(resolve(root,'frontend/public'));
for (const path of ['frontend/src/hooks/useBridgeAudio.ts','frontend/src/app/components/AdventureArt.tsx']) media.push({path,sha256:digest(await readFile(resolve(root,path)))});
media.sort((a,b)=>a.path.localeCompare(b.path));
const row = {
  curriculum_version: READING_VERSION, media_manifest_version: READING_MEDIA,
  status: 'approved', curriculum_sha256:digest(JSON.stringify(curriculum)),
  manifest_sha256:digest(JSON.stringify(media)), approved_by:email,
  approval_reference:'User authorization 2026-10-15: provisional interactive review only; content and TTS remain subject to revision. Not classroom validation.',
  approved_at:new Date().toISOString(),
};
if (!process.argv.includes('--apply')) {
  console.log('Account found. Dry run only; use --apply after explicit user approval.');
} else {
  const result = await supabase.from('curriculum_releases').upsert(row,{onConflict:'curriculum_version,media_manifest_version'});
  if(result.error) throw new Error(result.error.message);
  const access = await getLearningCampAccess(user.id);
  const {policy} = await effectivePolicy(user.id);
  console.log(JSON.stringify({releaseRegistered:true,accountAccess:access.enabled,curriculum:access.curriculumVersion,classroomMode:policy.mode,unlockThrough:policy.readingUnlockThrough??0,openChallenges:policy.readingOpenChallenges??[]}));
  if(!access.enabled) process.exitCode=1;
}
if (process.argv.includes('--verify')) {
  let status = 200;
  const response = {
    status(code:number) { status=code;return this; },
    json(body:{error?:string;available?:string[];completed?:string[]}) {
      console.log(JSON.stringify({progressStatus:status,availableBooks:body.available?.length,completedBooks:body.completed?.length,error:body.error}));
      if(status!==200)process.exitCode=1;
    },
  };
  await readingProgress({userId:user.id} as unknown as Request,response as unknown as Response);
}
