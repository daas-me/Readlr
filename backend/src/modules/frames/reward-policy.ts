export function rewardGoalReached(goal:string,orientation:number,recordedWords:string[],completedBooks:ReadonlySet<string>):boolean {
  if(goal==='free')return true;
  if(goal==='camp')return orientation>=3;
  if(goal==='sounds')return new Set(recordedWords).size>=5;
  return completedBooks.has(goal);
}
