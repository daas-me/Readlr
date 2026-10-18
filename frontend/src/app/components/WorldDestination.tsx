import type { ReactNode } from 'react';
import { useWorldExit } from './useWorldExit';

export function WorldDestination({kind,onBack,children}:{kind:'sounds'|'stickers'|'progress';onBack:()=>void;children:(back:()=>void)=>ReactNode}) {
  const transition=useWorldExit();
  return <div className={`world-destination destination-${kind} ${transition.leaving?'destination-leaving':''}`}>
    {children(()=>transition.exit(onBack))}
  </div>;
}
