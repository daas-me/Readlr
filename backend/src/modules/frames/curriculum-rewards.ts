import { supabase } from '../../database/db.js';
import { getLearnerByUserId } from '../../database/models/learner.model.js';
import { getCurriculumState } from '../evidence/curriculum-state.js';
import { READING_VERSION } from '../evidence/reading-catalog.js';
import { rewardGoalReached } from './reward-policy.js';

export const FRAME_REWARDS:Record<string,string>={
  'purple-heart':'camp','ice-crystal':'sounds','purple-star':'gate',
  'fire-and-water':'bridge','purple-dragon':'crown','red-ring':'library',
};
export const AVATAR_REWARDS=[
  ['🦊','Fox','free'],['🐻','Bear','free'],['🐼','Panda','free'],['🐨','Koala','free'],
  ['🐸','Frog','camp'],['🐢','Turtle','camp'],['🐝','Bee','sounds'],['🐬','Dolphin','sounds'],
  ['🦁','Lion','gate'],['🐧','Penguin','lanterns'],['🐯','Tiger','market'],['🦋','Butterfly','garden'],
  ['🐳','Whale','bridge'],['🐙','Octopus','keys'],['🦕','Dinosaur','library'],['🦄','Unicorn','crown'],
] as const;
const titles:Record<string,string>={gate:'Book 1',lanterns:'Book 2',market:'Book 3',garden:'Book 4',bridge:'Book 5',keys:'Book 7',library:'Book 8',crown:'Book 10'};
export const rewardHint=(goal:string)=>goal==='free'?'Ready to wear':goal==='camp'?'Finish the three Camp practices':goal==='sounds'?'Record five different sounds in the Sound Library':`Complete ${titles[goal]??goal}`;
export async function curriculumRewardAccess(userId:number){
  const learner=await getLearnerByUserId(userId);
  const state=await getCurriculumState(userId);
  const epochResult=await supabase.from('learner_stage_state').select('epoch').eq('learner_id',learner.id).eq('stage_number',3).maybeSingle();
  if(epochResult.error)throw epochResult.error;
  const done=new Set<string>();
  for(let offset=0;;offset+=500){
    const result=await supabase.from('reading_checkpoints').select('chapter_id').eq('learner_id',learner.id).eq('epoch',epochResult.data?.epoch??0).eq('curriculum_version',READING_VERSION).eq('passed',true).order('id').range(offset,offset+499);
    if(result.error)throw result.error;
    result.data.forEach(row=>done.add(row.chapter_id));
    if(result.data.length<500)break;
  }
  const has=(goal:string)=>rewardGoalReached(goal,state.campOrientationStep,state.soundRecordings.map(r=>r.word),done);
  return {has,avatars:AVATAR_REWARDS.map(([avatar,name,goal])=>({avatar,name,hint:rewardHint(goal),unlocked:has(goal)||avatar===learner.avatar}))};
}
