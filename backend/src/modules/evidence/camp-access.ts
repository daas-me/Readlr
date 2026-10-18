import { config } from '../../config/env.js';
import { supabase, unwrap } from '../../database/db.js';

export interface LearningCampAccess {
  enabled: boolean;
  curriculumVersion?: string;
  mediaManifestVersion?: string;
  group?: {
    id: 'ENG-01';
    graphemes: ['m', 'a', 't'];
  };
}

const DISABLED_ACCESS: LearningCampAccess = { enabled: false };

export async function getLearningCampAccess(userId: number): Promise<LearningCampAccess> {
  try {
    if (!config.readlr2CampEnabled || !Number.isInteger(userId) || userId <= 0) return DISABLED_ACCESS;

    const release = unwrap<{ status: string } | null>(
      await supabase
        .from('curriculum_releases')
        .select('status')
        .eq('curriculum_version', config.readlr2CampCurriculumVersion)
        .eq('media_manifest_version', config.readlr2CampMediaVersion)
        .maybeSingle(),
    );
    if (release?.status !== 'approved') return DISABLED_ACCESS;

    return {
      enabled: true,
      curriculumVersion: config.readlr2CampCurriculumVersion,
      mediaManifestVersion: config.readlr2CampMediaVersion,
      group: { id: 'ENG-01', graphemes: ['m', 'a', 't'] },
    };
  } catch (error) {
    // A missing migration or unavailable release registry must fail closed.
    console.warn('Learning Camp access check failed closed:', error);
    return DISABLED_ACCESS;
  }
}
