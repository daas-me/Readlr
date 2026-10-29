// Session and weekly progress summaries, counted by the server on the Philippine calendar.
export interface RecapTotals { stops:number; words:number; stickers:number; booksPassed:number; dailyStars:number }
export interface Recap {
  today:RecapTotals&{day:string};
  thisWeek:RecapTotals&{start:string;end:string};
  lastWeek:RecapTotals&{start:string;end:string};
}
const KEYS=['stops','words','stickers','booksPassed','dailyStars'] as const;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const totals=(v:any)=>!!v&&KEYS.every(k=>Number.isInteger(v[k])&&v[k]>=0);

export function parseRecap(value:unknown):Recap|null {
  const r=value as Recap|null;
  if(!r||!totals(r.today)||!DAY.test(r.today?.day)||!totals(r.thisWeek)||!DAY.test(r.thisWeek?.start)||!totals(r.lastWeek)||!DAY.test(r.lastWeek?.start))return null;
  return r;
}
export const hasActivity=(t:RecapTotals)=>t.stops+t.words+t.booksPassed>0;

// Session summary: what changed today since the learner last saw the home screen in this browser session.
export function sessionGain(before:(RecapTotals&{day:string})|null,now:RecapTotals&{day:string}):RecapTotals|null {
  if(!before||before.day!==now.day)return null;
  const gain=Object.fromEntries(KEYS.map(k=>[k,Math.max(0,now[k]-before[k])])) as unknown as RecapTotals;
  return hasActivity(gain)?gain:null;
}
// Weekly summary: shown once, on the first visit of a new week, when last week had any activity.
export const showWeekly=(recap:Recap,seenWeek:string|null)=>seenWeek!==recap.lastWeek.start&&hasActivity(recap.lastWeek);

export async function loadRecap(signal?:AbortSignal):Promise<Recap|null> {
  const token=localStorage.getItem('auth_token');
  if(!token)return null;
  const response=await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:3000/api'}/evidence/me/recap`,{headers:{Authorization:`Bearer ${token}`},signal});
  if(!response.ok)return null;
  return parseRecap(await response.json().catch(()=>null));
}
