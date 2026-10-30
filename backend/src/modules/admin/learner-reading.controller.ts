import type { Request, Response } from 'express';
import { supabase, unwrap } from '../../database/db.js';
import { getLearnerByUserId } from '../learner/learner.service.js';
import { getCurriculumState } from '../evidence/curriculum-state.js';
import { READING_VERSION } from '../evidence/reading-catalog.js';
import { effectivePolicy } from './classroom.service.js';

export async function getLearnerReadingDetail(req: Request, res: Response) {
  const userId = Number(req.params.id);
  if (!Number.isSafeInteger(userId) || userId < 1) { res.status(400).json({message:'Choose a valid learner.'}); return; }
  try {
    const learner = await getLearnerByUserId(userId);
    const state = unwrap(await supabase.from('learner_stage_state').select('epoch').eq('learner_id',learner.id).eq('stage_number',3).maybeSingle());
    const curriculum = await getCurriculumState(userId);
    const { policy } = await effectivePolicy(userId);
    const checkpoints = [];
    for (let start=0;;start+=500) {
      const rows = unwrap(await supabase.from('reading_checkpoints')
        .select('id,chapter_id,words,results,passed,created_at,completed_at,expires_at')
        .eq('learner_id',learner.id).eq('epoch',state?.epoch??0).eq('curriculum_version',READING_VERSION)
        .order('created_at',{ascending:false}).order('id').range(start,start+499))??[];
      checkpoints.push(...rows);
      if(rows.length<500)break;
    }
    res.json({curriculum,policy,checkpoints});
  } catch {
    res.status(503).json({message:'Learner details could not load. Please retry.'});
  }
}
