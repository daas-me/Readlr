export function progressSummary(progress:Record<number,number>) {
  const stages=[1,2,3].map(id=>Number.isFinite(progress[id])?Math.max(0,Math.min(20,Math.floor(progress[id]))):0);
  return {stages,total:stages.reduce((sum,n)=>sum+n,0),finished:stages.filter(n=>n===20).length,
    next:stages.findIndex(n=>n<20)+1,vowels:Math.min(5,stages[0]),bridges:Math.max(0,stages[1]-5),words:Math.min(19,stages[2])};
}
