import type { LearnerCurriculumState } from './learnerCurriculumState';

export const WORLD_TOUR_COMPLETED='world-tour:complete';
export function shouldShowWorldTour(state:LearnerCurriculumState) {
  return !state.guidedActivities[WORLD_TOUR_COMPLETED] && state.campOrientationStep===0 && state.guidedStops.length===0;
}
