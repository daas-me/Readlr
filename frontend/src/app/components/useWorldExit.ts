import { useEffect, useRef, useState } from 'react';

/** Delay unmount until the scene leaves, with a fallback if animation events stop. */
export function useWorldExit(duration=650) {
  const [leaving,setLeaving]=useState(false);
  const action=useRef<null|(()=>void)>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
  const finish=()=>{const next=action.current;action.current=null;clearTimeout(timer.current);next?.();};
  const exit=(next:()=>void,delay=duration)=>{
    if(action.current)return;
    action.current=next;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    setLeaving(true);
    timer.current=setTimeout(finish,delay);
  };
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  return {leaving,exit,finish};
}
