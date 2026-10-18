import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LearningCamp } from '../app/components/LearningCamp';
import { CampGroupExpansionPreview } from '../app/components/CampGroupExpansionPreview';
import { DiscoveryRealm } from '../app/components/DiscoveryRealmView';
import { UnifiedDashboard } from '../app/components/UnifiedDashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import type { CurriculumSkillSummary } from '../hooks/curriculumProgress';
import '../styles/index.css';

type PreviewScene = 'map' | 'guided' | 'adventure' | 'check' | 'review' | 'group2' | 'discovery' | 'progress';

const PREVIEW_EVIDENCE: CurriculumSkillSummary[] = [
  { curriculumVersion: 'preview-only', skillId: 'eng01.sound.discriminate', attemptCount: 2, correctCount: 1, helpedCount: 1, independentCandidateCount: 0, delayedReviewCount: 0, delayedReviewCorrectCount: 0, bestEvidenceClass: 'completed_with_help', latestResult: 'correct', latestMode: 'guided', latestActivityId: 'PREVIEW-D01', latestAt: '2026-10-13T03:15:00.000Z', latestReviewResult: null, latestReviewAt: null },
  { curriculumVersion: 'preview-only', skillId: 'eng01.letter.m', attemptCount: 4, correctCount: 3, helpedCount: 1, independentCandidateCount: 1, delayedReviewCount: 1, delayedReviewCorrectCount: 1, bestEvidenceClass: 'independent_candidate', latestResult: 'correct', latestMode: 'delayed_review', latestActivityId: 'ENG01-MAT-R01', latestAt: '2026-10-13T03:18:00.000Z', latestReviewResult: 'correct', latestReviewAt: '2026-10-13T03:18:00.000Z' },
  { curriculumVersion: 'preview-only', skillId: 'eng01.letter.a', attemptCount: 3, correctCount: 1, helpedCount: 1, independentCandidateCount: 0, delayedReviewCount: 1, delayedReviewCorrectCount: 0, bestEvidenceClass: 'completed_with_help', latestResult: 'incorrect', latestMode: 'delayed_review', latestActivityId: 'ENG01-MAT-R01', latestAt: '2026-10-13T03:19:00.000Z', latestReviewResult: 'incorrect', latestReviewAt: '2026-10-13T03:19:00.000Z' },
  { curriculumVersion: 'preview-only', skillId: 'eng01.blend.am', attemptCount: 1, correctCount: 1, helpedCount: 1, independentCandidateCount: 0, delayedReviewCount: 0, delayedReviewCorrectCount: 0, bestEvidenceClass: 'completed_with_help', latestResult: 'correct', latestMode: 'guided', latestActivityId: 'PREVIEW-G01', latestAt: '2026-10-13T03:10:00.000Z', latestReviewResult: null, latestReviewAt: null },
  { curriculumVersion: 'preview-only', skillId: 'eng01.decode.mat', attemptCount: 3, correctCount: 2, helpedCount: 1, independentCandidateCount: 1, delayedReviewCount: 1, delayedReviewCorrectCount: 1, bestEvidenceClass: 'independent_candidate', latestResult: 'correct', latestMode: 'delayed_review', latestActivityId: 'ENG01-MAT-R01', latestAt: '2026-10-13T03:22:00.000Z', latestReviewResult: 'correct', latestReviewAt: '2026-10-13T03:22:00.000Z' },
  { curriculumVersion: 'preview-only', skillId: 'eng01.meaning.mat', attemptCount: 1, correctCount: 1, helpedCount: 1, independentCandidateCount: 0, delayedReviewCount: 0, delayedReviewCorrectCount: 0, bestEvidenceClass: 'completed_with_help', latestResult: 'correct', latestMode: 'adventure', latestActivityId: 'PREVIEW-A01', latestAt: '2026-10-13T03:12:00.000Z', latestReviewResult: null, latestReviewAt: null },
];

function LearningCampPreview() {
  const [scene, setScene] = useState<PreviewScene>('map');
  const [visit, setVisit] = useState(0);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#eef9e8' }}>
      <header style={{ minHeight: 58, padding: '9px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', color: '#174b42', background: '#fff', borderBottom: '1px solid #d5e6d0', flexShrink: 0 }}>
        <strong>Learning Camp design preview</strong>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Open
          <Select value={scene} onValueChange={(value) => { setScene(value as PreviewScene); setVisit((current) => current + 1); }}>
            <SelectTrigger aria-label="Preview scene" style={{ width: 240 }}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Camp map</SelectItem>
              <SelectItem value="guided">Wordsmith Tent</SelectItem>
              <SelectItem value="adventure">Story Trail adventure</SelectItem>
              <SelectItem value="check">Lookout Point check</SelectItem>
              <SelectItem value="review">Memory Meadow review</SelectItem>
              <SelectItem value="group2">Group 2: Firefly Forest</SelectItem>
              <SelectItem value="discovery">Discovery Realm</SelectItem>
              <SelectItem value="progress">Progress: Camp skills</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <span style={{ fontSize: 12, color: '#76510f' }}>Preview only. No account data is read or saved.</span>
      </header>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {scene === 'progress' ? <UnifiedDashboard
          learnerId={0}
          userName="Camp Explorer"
          completedByStage={{ 1: 20, 2: 8, 3: 0 }}
          curriculumEvidencePreview={PREVIEW_EVIDENCE}
        /> : scene === 'group2' ? <CampGroupExpansionPreview onBack={() => setScene('map')} /> : scene === 'discovery' ? <DiscoveryRealm previewMode onBack={() => setScene('map')} /> : <LearningCamp
          key={`${scene}-${visit}`}
          graphemes={['m', 'a', 't']}
          learnerId={0}
          curriculumVersion="preview-only"
          mediaManifestVersion="preview-only"
          previewMode
          previewStart={scene}
          onBack={() => setScene('map')}
        />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  import.meta.env.DEV ? <LearningCampPreview /> : <p>This preview is available only on the local development server.</p>,
);
