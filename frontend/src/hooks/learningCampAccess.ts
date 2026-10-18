export interface LearningCampAccess {
  enabled: boolean;
  curriculumVersion?: string;
  mediaManifestVersion?: string;
  group?: {
    id: 'ENG-01';
    graphemes: ['m', 'a', 't'];
  };
}

export function learningCampBuildEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

export function isLearningCampAccess(value: unknown): value is LearningCampAccess & { enabled: true } {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<LearningCampAccess>;
  return candidate.enabled === true &&
    typeof candidate.curriculumVersion === 'string' &&
    typeof candidate.mediaManifestVersion === 'string' &&
    candidate.group?.id === 'ENG-01' &&
    Array.isArray(candidate.group.graphemes) &&
    candidate.group.graphemes.join('') === 'mat';
}
