import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Compass,
  Ear,
  Footprints,
  Puzzle,
  Sparkles,
  TentTree,
  Volume2,
} from 'lucide-react';
import './learningCamp.css';
import { GuidedBlendCamp } from './GuidedBlendCamp';
import { CampBridgeAdventure } from './CampBridgeAdventure';
import { CampIndependentCheck } from './CampIndependentCheck';
import { CampDelayedReview } from './CampDelayedReview';
import { useDelayedReviewStatus } from '../hooks/useDelayedReviewStatus';
import { OfflinePackPanel } from './OfflinePackPanel';
import { ReadingJourney } from './ReadingJourney';
import { ARAL_VERSION, ARAL_MEDIA_VERSION } from './aralCurriculum';

interface LearningCampProps {
  graphemes: ['m', 'a', 't'];
  learnerId: number;
  curriculumVersion: string;
  mediaManifestVersion: string;
  token?: string | null;
  onBack: () => void;
  previewMode?: boolean;
  previewStart?: 'map' | 'guided' | 'adventure' | 'check' | 'review';
}

const stations = [
  {
    number: 1,
    title: 'Sound Grove',
    short: 'Meet m, a, and t',
    detail: 'Listen closely, watch Milo model each sound, and match every sound to its letter.',
    icon: Ear,
    tone: 'teal',
  },
  {
    number: 2,
    title: 'Echo Stones',
    short: 'Hear and choose',
    detail: 'Use your ears to find the sound Milo says. Answer with your voice or tap your choice.',
    icon: Volume2,
    tone: 'blue',
  },
  {
    number: 3,
    title: 'Wordsmith Tent',
    short: 'Build am and at',
    detail: 'Slide letter tiles together and hear how two sounds become a word part.',
    icon: Puzzle,
    tone: 'orange',
  },
  {
    number: 4,
    title: 'Blend Bridge',
    short: 'Make mat',
    detail: 'Stretch the sounds, move across the bridge, and blend m-a-t into one smooth word.',
    icon: Footprints,
    tone: 'pink',
  },
  {
    number: 5,
    title: 'Story Trail',
    short: 'Use words in an adventure',
    detail: 'Help the story move forward by listening, building, reading, and choosing the right word.',
    icon: BookOpen,
    tone: 'purple',
  },
  {
    number: 6,
    title: 'Lookout Point',
    short: 'Show what you know',
    detail: 'Try it on your own first. If you need help, Milo can still guide you.',
    icon: CheckCircle2,
    tone: 'green',
  },
  {
    number: 7,
    title: 'Memory Meadow',
    short: 'Return after a little time',
    detail: 'Use the same sounds in a fresh later check. This records retention separately from your first Camp Check.',
    icon: Clock3,
    tone: 'gold',
  },
] as const;

export function LearningCamp({ graphemes, learnerId, curriculumVersion, mediaManifestVersion, token, onBack, previewMode = false, previewStart = 'map' }: LearningCampProps) {
  const [selected, setSelected] = useState(0);
  const [guidedOpen, setGuidedOpen] = useState(previewStart === 'guided');
  const [adventureOpen, setAdventureOpen] = useState(previewStart === 'adventure');
  const [checkOpen, setCheckOpen] = useState(previewStart === 'check');
  const [reviewOpen, setReviewOpen] = useState(previewStart === 'review');
  const [guidedComplete, setGuidedComplete] = useState(previewMode);
  const [adventureComplete, setAdventureComplete] = useState(previewMode);
  const [checkComplete, setCheckComplete] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [guidedStartLessonIndex, setGuidedStartLessonIndex] = useState(0);
  const [returnToLookoutAfterGuided, setReturnToLookoutAfterGuided] = useState(false);
  const active = stations[selected];
  const ActiveIcon = active.icon;
  const review = useDelayedReviewStatus(learnerId, token, curriculumVersion, !previewMode);

  if (previewStart === 'map' && (previewMode || curriculumVersion === ARAL_VERSION && mediaManifestVersion === ARAL_MEDIA_VERSION)) return <ReadingJourney learnerId={learnerId} previewMode={previewMode} onBack={onBack} />;

  if (guidedOpen) {
    return (
      <GuidedBlendCamp
        learnerId={learnerId}
        curriculumVersion={curriculumVersion}
        mediaManifestVersion={mediaManifestVersion}
        onBack={() => setGuidedOpen(false)}
        onComplete={() => {
          setGuidedComplete(true);
          setGuidedOpen(false);
          setSelected(returnToLookoutAfterGuided ? 5 : 4);
          setReturnToLookoutAfterGuided(false);
        }}
        previewMode={previewMode}
        startLessonIndex={guidedStartLessonIndex}
      />
    );
  }

  if (adventureOpen) {
    return (
      <CampBridgeAdventure
        learnerId={learnerId}
        curriculumVersion={curriculumVersion}
        mediaManifestVersion={mediaManifestVersion}
        onBack={() => setAdventureOpen(false)}
        onComplete={() => { setAdventureComplete(true); setAdventureOpen(false); setSelected(4); }}
        previewMode={previewMode}
      />
    );
  }

  if (checkOpen) {
    return (
      <CampIndependentCheck
        learnerId={learnerId}
        curriculumVersion={curriculumVersion}
        mediaManifestVersion={mediaManifestVersion}
        onBack={() => setCheckOpen(false)}
        onComplete={() => { setCheckComplete(true); setCheckOpen(false); setSelected(5); }}
        onGuidedBlend={() => { setGuidedStartLessonIndex(2); setReturnToLookoutAfterGuided(true); setCheckOpen(false); setGuidedOpen(true); }}
        previewMode={previewMode}
      />
    );
  }

  if (reviewOpen) {
    return (
      <CampDelayedReview
        learnerId={learnerId}
        curriculumVersion={curriculumVersion}
        mediaManifestVersion={mediaManifestVersion}
        onBack={() => setReviewOpen(false)}
        onComplete={() => { setReviewComplete(true); setReviewOpen(false); setSelected(6); void review.reload(); }}
        onPracticeBlend={() => { setGuidedStartLessonIndex(2); setReturnToLookoutAfterGuided(false); setReviewOpen(false); setGuidedOpen(true); }}
        previewMode={previewMode}
      />
    );
  }

  return (
    <main className="learning-camp">
      {previewMode && <div className="learning-camp__preview"><Sparkles aria-hidden="true" /> Design preview: simulated media, no learner progress or evidence.</div>}
      <div className="learning-camp__sky" aria-hidden="true">
        <span className="learning-camp__cloud learning-camp__cloud--one" />
        <span className="learning-camp__cloud learning-camp__cloud--two" />
      </div>

      <div className="learning-camp__shell">
        <header className="learning-camp__header">
          <button className="learning-camp__back" onClick={onBack} aria-label="Back to stages" title="Back to stages">
            <ArrowLeft aria-hidden="true" />
          </button>
          <div>
            <p className="learning-camp__eyebrow"><TentTree aria-hidden="true" /> First camp trail</p>
            <h1>Learning Camp</h1>
            <p>Follow the trail from letter sounds to your first independent word.</p>
          </div>
          <div className="learning-camp__letters" aria-label="This camp practices m, a, and t">
            {graphemes.map((letter) => <span key={letter}>{letter}</span>)}
          </div>
        </header>

        <OfflinePackPanel mediaManifestVersion={mediaManifestVersion} previewMode={previewMode} />

        <section className="learning-camp__route" aria-labelledby="camp-route-title">
          <div className="learning-camp__route-heading">
            <div>
              <p className="learning-camp__eyebrow"><Compass aria-hidden="true" /> Group 1 route</p>
              <h2 id="camp-route-title">Your trail through camp</h2>
            </div>
            <p>Choose a station to see what you will practice.</p>
          </div>

          <div className="learning-camp__map">
            <div className="learning-camp__trail" aria-hidden="true" />
            {stations.map((station, index) => {
              const Icon = station.icon;
              return (
                <motion.button
                  key={station.title}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`learning-camp__station learning-camp__station--${station.tone} ${selected === index ? 'is-selected' : ''}`}
                  onClick={() => setSelected(index)}
                  aria-pressed={selected === index}
                >
                  <span className="learning-camp__station-number">{station.number}</span>
                  <span className="learning-camp__station-icon"><Icon aria-hidden="true" /></span>
                  <strong>{station.title}</strong>
                  <small>{station.short}</small>
                </motion.button>
              );
            })}
          </div>
        </section>

        <motion.section
          key={active.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`learning-camp__station-note learning-camp__station-note--${active.tone}`}
          aria-live="polite"
        >
          <div className="learning-camp__station-note-icon"><ActiveIcon aria-hidden="true" /></div>
          <div>
            <p>Station {active.number} of {stations.length}</p>
            <h2>{active.title}</h2>
            <span>{active.detail}</span>
          </div>
          {selected === 2 ? (
            <button className="learning-camp__start" onClick={() => { setGuidedStartLessonIndex(0); setReturnToLookoutAfterGuided(false); setGuidedOpen(true); }}>
              <Sparkles aria-hidden="true" /> {guidedComplete ? 'Practice these words again' : 'Begin guided blending'}
            </button>
          ) : selected === 4 && guidedComplete ? (
            <button className="learning-camp__start" onClick={() => setAdventureOpen(true)}>
              <BookOpen aria-hidden="true" /> {adventureComplete ? 'Play the story again' : 'Begin story adventure'}
            </button>
          ) : selected === 3 && guidedComplete ? (
            <div className="learning-camp__complete"><CheckCircle2 aria-hidden="true" /> Guided route complete</div>
          ) : selected === 5 && adventureComplete ? (
            <button className="learning-camp__start" onClick={() => setCheckOpen(true)}>
              <CheckCircle2 aria-hidden="true" /> {checkComplete ? 'Try Camp Check again' : 'Begin Camp Check'}
            </button>
          ) : selected === 6 && reviewComplete ? (
            <div className="learning-camp__waiting"><Clock3 aria-hidden="true" /><span>Review saved. Memory Meadow will return later.</span></div>
          ) : selected === 6 && (previewMode || review.value?.status === 'due') ? (
            <button className="learning-camp__start learning-camp__start--review" onClick={() => setReviewOpen(true)}>
              <Clock3 aria-hidden="true" /> {reviewComplete ? 'Review again later' : 'Begin delayed review'}
            </button>
          ) : selected === 6 && review.loading ? (
            <div className="learning-camp__preparing"><Clock3 aria-hidden="true" /> Checking review time</div>
          ) : selected === 6 && review.value?.status === 'waiting' && review.value.dueAt ? (
            <div className="learning-camp__waiting"><Clock3 aria-hidden="true" /><span>Ready {new Date(review.value.dueAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></div>
          ) : selected === 6 && review.value?.status === 'not_scheduled' ? (
            <div className="learning-camp__preparing"><Clock3 aria-hidden="true" /> Complete every part of Camp Check first</div>
          ) : selected === 6 && review.error ? (
            <div className="learning-camp__preparing"><Clock3 aria-hidden="true" /> Review schedule unavailable</div>
          ) : (
            <div className="learning-camp__preparing"><Sparkles aria-hidden="true" /> Preparing this activity</div>
          )}
        </motion.section>
      </div>
    </main>
  );
}
