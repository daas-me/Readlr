import type { LearnerCurriculumState } from './learnerCurriculumState';

export const WORLD_TOUR_COMPLETED='world-tour:complete';
export function shouldShowWorldTour(state:LearnerCurriculumState, freshLogin=true) {
  return freshLogin && !state.guidedActivities[WORLD_TOUR_COMPLETED] && state.campOrientationStep===0 && state.guidedStops.length===0;
}
