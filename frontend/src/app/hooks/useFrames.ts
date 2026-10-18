import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../modules/auth/auth.context";

export interface FrameOption {
  id: number;
  asset_key: string;
  name: string;
  unlock_stage_id: number | null;
  unlock_stage_number: number | null;
  unlock_stage_title: string | null;
  design_notes: string | null;
  unlocked: boolean;
  equipped: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
type AvatarOption = {avatar:string;name:string;hint:string;unlocked:boolean};
type Rewards = {frames:FrameOption[];avatars:AvatarOption[]};
const cache = new Map<string, {data:Rewards;at:number}>();
const pending = new Map<string, Promise<Rewards>>();

function loadRewards(token:string, force=false):Promise<Rewards> {
  const running=pending.get(token);
  if(running)return running;
  const saved=cache.get(token);
  if(!force&&saved&&Date.now()-saved.at<30000)return Promise.resolve(saved.data);
  const request=(async()=>{
    const res=await fetch(`${API_URL}/frames/me`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(12000)});
    if(!res.ok)throw new Error('Your rewards could not load. Please try again.');
    const data=await res.json();
    if(!Array.isArray(data.frames)||!Array.isArray(data.avatars))throw new Error('Your rewards are temporarily unavailable.');
    const rewards={frames:data.frames,avatars:data.avatars};
    cache.set(token,{data:rewards,at:Date.now()});
    return rewards;
  })();
  pending.set(token,request);
  void request.finally(()=>pending.delete(token)).catch(()=>{});
  return request;
}

export function useFrames() {
  const { token,user } = useAuth();
  const accountToken=user?.role==='learner'?token:null;
  const activeToken=useRef(accountToken);
  activeToken.current=accountToken;
  const [frames, setFrames] = useState<FrameOption[]>(()=>accountToken?cache.get(accountToken)?.data.frames??[]:[]);
  const [avatars,setAvatars]=useState<AvatarOption[]>(()=>accountToken?cache.get(accountToken)?.data.avatars??[]:[]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,setError]=useState<string|null>(null);

  const fetchFrames = useCallback(async (force=false) => {
    if (!accountToken) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);setError(null);
    try {
      const data=await loadRewards(accountToken,force);
      if (activeToken.current===accountToken) {
        setFrames(data.frames);
        setAvatars(data.avatars);
      }
    } catch (err) {
      if(activeToken.current===accountToken)setError('Your rewards could not load. Please try again.');
    } finally {
      if(activeToken.current===accountToken)setIsLoading(false);
    }
  }, [accountToken]);

  useEffect(() => {
    activeToken.current=accountToken;
    const saved=accountToken?cache.get(accountToken)?.data:undefined;
    setFrames(saved?.frames??[]);setAvatars(saved?.avatars??[]);
    void fetchFrames();
    const refresh=()=>void fetchFrames(true);
    window.addEventListener("readlr:frames-changed", refresh);
    return () => {activeToken.current=null;window.removeEventListener("readlr:frames-changed", refresh);};
  }, [fetchFrames,accountToken]);

  const equipFrame = useCallback(
    async (frameId: number): Promise<boolean> => {
      if (!token) return false;
      try {
        const res = await fetch(`${API_URL}/frames/me/equip`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ frame_id: frameId }),
        });
        if (res.ok) {
          const data = await res.json();
          cache.delete(token);
          setFrames(data.frames);
          window.dispatchEvent(new Event("readlr:frames-changed"));
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [token]
  );

  const equippedAssetKey = frames.find((f) => f.equipped)?.asset_key ?? 'indigo-classic';

  return { frames, avatars, isLoadingFrames: isLoading, framesError:error, equipFrame, equippedAssetKey, refetchFrames: fetchFrames };
}
