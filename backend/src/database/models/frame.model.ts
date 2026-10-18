import { supabase, unwrap } from '../db.js';

export interface Frame {
  id: number;
  asset_key: string;
  name: string;
  unlock_stage_id: number | null;
  design_notes: string | null;
  sort_order: number;
  created_at: string;
}

export async function getAllFrames(): Promise<Frame[]> {
  let frames=unwrap(await supabase.from('frames').select('*').order('sort_order')) as Frame[];
  // Older stage-joined seeds omitted reward borders when those stages were absent.
  const catalog=[['sunrise-ring','Sunrise Ring'],['indigo-classic','Indigo Classic'],['blue-floral','Blue Floral'],['gold-ornate','Gold Ornate'],['purple-cosmic','Purple Cosmic'],['yellow-ring','Yellow Ring'],['purple-heart','Purple Heart'],['ice-crystal','Ice Crystal'],['purple-star','Purple Star'],['fire-and-water','Fire and Water'],['purple-dragon','Purple Dragon'],['red-ring','Red Ring']];
  const missing=catalog.flatMap(([asset_key,name],sort_order)=>frames.some(frame=>frame.asset_key===asset_key)?[]:[{asset_key,name,sort_order,unlock_stage_id:null}]);
  if(missing.length){
    unwrap(await supabase.from('frames').upsert(missing,{onConflict:'asset_key',ignoreDuplicates:true}).select('id'));
    frames=unwrap(await supabase.from('frames').select('*').order('sort_order')) as Frame[];
  }
  return frames;
}

export async function getFrameById(id: number): Promise<Frame | undefined> {
  return unwrap(await supabase.from('frames').select('*').eq('id', id).maybeSingle()) as Frame | undefined;
}

export async function getFramesByUnlockStage(stageId: number): Promise<Frame[]> {
  return unwrap(await supabase.from('frames').select('*').eq('unlock_stage_id', stageId).order('sort_order')) as Frame[];
}

export async function getUnlockedFrameIds(userId: number): Promise<number[]> {
  const rows = unwrap(
    await supabase.from('user_unlocked_frames').select('frame_id').eq('user_id', userId)
  ) as { frame_id: number }[];
  return rows.map((r) => r.frame_id);
}

/** Inserts the unlock record if missing. Returns true only when a new row was created. */
export async function unlockFrame(userId: number, frameId: number): Promise<boolean> {
  const rows = unwrap(
    await supabase
      .from('user_unlocked_frames')
      .upsert({ user_id: userId, frame_id: frameId }, { onConflict: 'user_id,frame_id', ignoreDuplicates: true })
      .select()
  ) as unknown[];
  return rows.length > 0;
}
