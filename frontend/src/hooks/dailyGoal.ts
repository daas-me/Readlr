// Today's goal (Philippine calendar day) counted by the server from finished stops and words read aloud.
export interface DailyGoal { day:string; goal:{stops:number;words:number}; stops:number; words:number; completed:boolean }

const count=(value:unknown)=>typeof value==='number'&&Number.isInteger(value)&&value>=0;
export function parseDailyGoal(value:unknown):DailyGoal|null {
  const g=value as DailyGoal|null;
  if(!g||typeof g.day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(g.day)||!g.goal||!count(g.goal.stops)||!count(g.goal.words)||
    !count(g.stops)||!count(g.words)||typeof g.completed!=='boolean')return null;
  return {day:g.day,goal:{stops:g.goal.stops,words:g.goal.words},stops:g.stops,words:g.words,completed:g.completed};
}
// Progress toward whichever half of the goal is closer, so the bar never moves backwards.
export const dailyGoalProgress=(g:DailyGoal)=>g.completed?1:Math.max(g.stops/g.goal.stops,g.words/g.goal.words,0);

export async function loadDailyGoal(signal?:AbortSignal):Promise<DailyGoal|null> {
  const token=localStorage.getItem('auth_token');
  if(!token)return null;
  const response=await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:3000/api'}/evidence/me/daily-goal`,{headers:{Authorization:`Bearer ${token}`},signal});
  if(!response.ok)return null;
  return parseDailyGoal(await response.json().catch(()=>null));
}
