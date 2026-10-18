export interface TrailPoint { x:number; y:number }
export interface TrailStop { id:string; done:boolean }
export interface TrailAccess {
  available:boolean;
  completed:boolean;
  reviewMode:boolean;
  practiceDone:boolean;
  challengesOpen:boolean;
  openStops?:string[];
}
export interface TrailPageContext {
  hasPrevious:boolean;
  hasNext:boolean;
  previousDone:boolean;
  nextDone:boolean;
}

const X_POSITIONS = [155,450,745] as const;
const Y_LEVELS = [92,155,220] as const;

function seededRandom(seed:number) {
  let value=seed>>>0;
  return () => {
    value=(value*1664525+1013904223)>>>0;
    return value/4294967296;
  };
}

function shuffled<T>(items:readonly T[],random:()=>number) {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}

/** Seeded visual variety: stops scatter between pages but never jump after a refresh. */
export function trailLayout(chapter:number,page:number,count:number):TrailPoint[] {
  const seed=(chapter+1)*73856093^(page+1)*19349663;
  const random=seededRandom(seed);
  const yOrder=shuffled(Y_LEVELS,random);
  return Array.from({length:Math.min(count,3)},(_,index)=>({x:X_POSITIONS[index],y:yOrder[index]}));
}

/** Every chronicle follows the same one-stop-at-a-time progression rules. */
export function chronicleStopLocked(stops:TrailStop[],position:number,access:TrailAccess) {
  const stop=stops[position];
  const earlierStopsDone=stops.slice(0,position).every(candidate=>candidate.done);
  const individuallyOpen=access.openStops?.includes(stop.id)??false;
  const sequenceOpen=individuallyOpen||access.challengesOpen||stop.done||access.completed||access.reviewMode||earlierStopsDone;
  const finalGateReady=individuallyOpen||stop.id!=='check'||access.practiceDone||access.completed||access.reviewMode||access.challengesOpen;
  return (!access.available&&!access.completed&&!access.reviewMode)||!sequenceOpen||!finalGateReady;
}

function curvedPath(from:TrailPoint,to:TrailPoint,index:number) {
  const dx=to.x-from.x;
  const bend=index%2===0?34:-34;
  return `M${from.x} ${from.y} C${Math.round(from.x+dx*.34)} ${from.y+bend} ${Math.round(from.x+dx*.66)} ${to.y-bend} ${to.x} ${to.y}`;
}

const DEFAULT_POINTS:TrailPoint[]=[{x:153,y:173},{x:450,y:144},{x:747,y:94}];

export function trailSegments(stops:{locked:boolean;done:boolean}[],points:TrailPoint[]=DEFAULT_POINTS) {
  return stops.slice(0,-1).map((_,index)=>{
    const path=curvedPath(points[index]??DEFAULT_POINTS[index],points[index+1]??DEFAULT_POINTS[index+1],index);
    const revealed=stops[index].done;
    const completed=revealed&&stops[index+1].done;
    return {path,revealed,unlocked:revealed,completed,active:revealed&&!completed};
  });
}

const TRAIL_ENTRY:TrailPoint={x:-22,y:180};
const TRAIL_EXIT:TrailPoint={x:922,y:180};

/** Matching edge connectors make separate storybook pages read as one continuous trail. */
export function trailPageSegments(stops:{locked:boolean;done:boolean}[],points:TrailPoint[],context:TrailPageContext) {
  if(stops.length===0)return [];
  const segments=trailSegments(stops,points);
  if(context.hasPrevious){
    segments.unshift({
      path:curvedPath(TRAIL_ENTRY,points[0],0),
      revealed:context.previousDone,
      unlocked:context.previousDone,
      completed:context.previousDone,
      active:false
    });
  }
  if(context.hasNext){
    const revealed=stops.at(-1)?.done??false;
    segments.push({
      path:curvedPath(points.at(-1)??DEFAULT_POINTS[0],TRAIL_EXIT,1),
      revealed,
      unlocked:revealed,
      completed:revealed&&context.nextDone,
      active:revealed&&!context.nextDone
    });
  }
  return segments;
}
