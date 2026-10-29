import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { dailyGoalProgress, loadDailyGoal, type DailyGoal } from '../../hooks/dailyGoal';
import './dailyGoal.css';

// Shown on the reading-world home each day; the server records that the goal was shown.
export function DailyGoalCard({enabled=true}:{enabled?:boolean}) {
  const [goal,setGoal]=useState<DailyGoal|null>(null);
  useEffect(()=>{
    if(!enabled)return;
    const controller=new AbortController();
    const refresh=()=>{if(document.visibilityState==='visible')void loadDailyGoal(controller.signal).then(next=>{if(!controller.signal.aborted)setGoal(next);}).catch(()=>undefined);};
    refresh();
    const timer=window.setInterval(refresh,60000);
    document.addEventListener('visibilitychange',refresh);
    return()=>{controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};
  },[enabled]);
  if(!enabled||!goal)return null;
  const percent=Math.round(Math.min(1,dailyGoalProgress(goal))*100);
  return <section className={`daily-goal ${goal.completed?'is-complete':''}`} aria-label="Today's goal">
    <Star className="daily-goal-star" aria-hidden="true" fill={goal.completed?'currentColor':'none'}/>
    <div>
      <strong>{goal.completed?'Daily star!':"Today's goal"}</strong>
      <span>{goal.completed?'Great reading today!':`Read ${goal.goal.words} words or finish ${goal.goal.stops} stop.`}</span>
      {!goal.completed&&<span className="daily-goal-bar" role="progressbar" aria-label="Today's goal progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:`${percent}%`}}/></span>}
      {!goal.completed&&<small>{goal.words} of {goal.goal.words} words</small>}
    </div>
  </section>;
}
