import { supabase } from '../src/database/db.js';
import { config } from '../src/config/env.js';
import { READING_VERSION, READING_MEDIA } from '../src/modules/evidence/reading-catalog.js';

// Read-only preflight: no learner rows, emails, secrets or audio are printed.
let failed = false;
function check(label:string,ok:boolean) { console.log(`${ok?'PASS':'BLOCKED'} ${label}`);if(!ok)failed=true; }
for (const [table,columns] of Object.entries({curriculum_releases:'status',curriculum_attempts:'id',learner_stage_state:'epoch',reading_checkpoints:'id,epoch,results,passed',classroom_control:'revision'})) {
  const result=await supabase.from(table).select(columns).limit(1).abortSignal(AbortSignal.timeout(10000));
  check(`Database table: ${table}`,!result.error);
}
const summary=await supabase.rpc('reading_checkpoint_overview',{p_learners:[]}).abortSignal(AbortSignal.timeout(10000));
check('Checkpoint overview function installed',!summary.error);
// Invalid inputs are rejected before the function reads or writes learner data.
const writer=await supabase.rpc('record_reading_checkpoint',{p_learner:0,p_session:'00000000-0000-0000-0000-000000000000',p_item:0,p_result:'invalid'}).abortSignal(AbortSignal.timeout(10000));
check('Checkpoint transaction validation installed',writer.error?.message==='Invalid recognition result');
const meaningWriter=await supabase.rpc('record_reading_checkpoint_meaning',{p_learner:0,p_session:'00000000-0000-0000-0000-000000000000',p_response:'invalid'}).abortSignal(AbortSignal.timeout(10000));
check('Book 1 meaning transaction installed',meaningWriter.error?.message==='Invalid meaning response');
const release=await supabase.from('curriculum_releases').select('status').eq('curriculum_version',READING_VERSION)
  .eq('media_manifest_version',READING_MEDIA).maybeSingle().abortSignal(AbortSignal.timeout(10000));
check('Reviewed curriculum/media release is registered',!release.error&&release.data?.status==='approved');
check('Backend Camp feature enabled',config.readlr2CampEnabled);
check('Pilot learner allowlist configured',config.readlr2TesterEmails.length>0);
check('Expanded curriculum selected',config.readlr2CampCurriculumVersion===READING_VERSION&&config.readlr2CampMediaVersion===READING_MEDIA);
check('Speech provider configured (key validity not tested)',!!config.groqApiKey);
console.log('Manual checks still required: frontend flag, HTTPS microphone/replay, reviewed audio, child-speech validation, reset and cross-device smoke tests.');
process.exitCode=failed?1:0;
