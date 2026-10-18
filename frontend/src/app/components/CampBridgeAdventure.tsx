import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Flag, Image, Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { queueEvidenceAttempt } from '../../hooks/evidenceRecords';
import {
  CAMP_ADVENTURE,
  createAdventureEvidence,
  placeAdventureTile,
  resolveAdventureMedia,
  verifyAdventureMedia,
} from './learningCampAdventure';
import './campBridgeAdventure.css';
import { MiloCoach } from './MiloCoach';

interface CampBridgeAdventureProps {
  learnerId: number;
  curriculumVersion: string;
  mediaManifestVersion: string;
  onBack: () => void;
  onComplete: () => void;
  previewMode?: boolean;
}

type Phase = 'checking' | 'story' | 'build' | 'success' | 'blocked';

export function CampBridgeAdventure({
  learnerId,
  curriculumVersion,
  mediaManifestVersion,
  onBack,
  onComplete,
  previewMode = false,
}: CampBridgeAdventureProps) {
  const [phase, setPhase] = useState<Phase>('checking');
  const [placed, setPlaced] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [pictureReady, setPictureReady] = useState(previewMode);
  const sessionId = useRef(crypto.randomUUID());
  const startedAt = useRef(new Date().toISOString());
  const media = useMemo(() => resolveAdventureMedia(mediaManifestVersion), [mediaManifestVersion]);
  const bank = ['t', 'm', 'a'];

  useEffect(() => {
    let active = true;
    if (previewMode) {
      setPhase('story');
      return () => { active = false; };
    }
    void verifyAdventureMedia(mediaManifestVersion).then((available) => {
      if (active) setPhase(available ? 'story' : 'blocked');
    });
    return () => { active = false; };
  }, [mediaManifestVersion, previewMode]);

  const finishConstruction = (nextHintCount: number) => {
    if (!previewMode && !recorded) {
      queueEvidenceAttempt(learnerId, createAdventureEvidence({
        sessionId: sessionId.current,
        curriculumVersion,
        mediaManifestVersion,
        hintCount: nextHintCount,
        startedAt: startedAt.current,
        capturedOffline: !navigator.onLine,
      }));
    }
    setRecorded(true);
    setPhase('success');
  };

  const chooseTile = (letter: string) => {
    if (phase !== 'build') return;
    const result = placeAdventureTile(placed, letter);
    if (!result.correct) {
      setHintCount((count) => count + 1);
      return;
    }
    setPlaced(result.placed);
    if (result.placed.length === CAMP_ADVENTURE.letters.length) finishConstruction(hintCount);
  };

  if (phase === 'checking') {
    return <main className="camp-adventure camp-adventure--center"><Loader2 className="camp-adventure__spinner" /><h1>Opening Story Trail...</h1><p>Checking the approved picture clue.</p></main>;
  }

  if (phase === 'blocked') {
    return (
      <main className="camp-adventure camp-adventure--center">
        <div className="camp-adventure__blocked"><Image /></div>
        <p className="camp-adventure__eyebrow">Picture clue unavailable</p>
        <h1>The trail is resting for now</h1>
        <p>The approved picture did not load, so Readlr will not replace it with an unrelated clue.</p>
        <button className="camp-adventure__secondary" onClick={onBack}><ArrowLeft /> Return to Camp</button>
      </main>
    );
  }

  return (
    <main className="camp-adventure">
      {previewMode && <div className="camp-adventure__preview"><Sparkles /> Design preview: media is simulated and no learner record is saved.</div>}
      <header className="camp-adventure__topbar">
        <button className="camp-adventure__icon-button" onClick={onBack} aria-label="Return to Camp" title="Return to Camp"><ArrowLeft /></button>
        <div><p>Story Trail</p><strong>The Sleeping Bridge</strong></div>
        <span>Adventure 1</span>
      </header>

      <section className={`camp-adventure__scene is-${phase}`}>
        <div className="camp-adventure__hills" aria-hidden="true" />
        <div className="camp-adventure__river" aria-hidden="true" />
        <div className="camp-adventure__bridge" aria-label={`${placed.length} of 3 bridge planks restored`}>
          {CAMP_ADVENTURE.letters.map((letter, index) => (
            <motion.span
              key={letter}
              className={placed[index] ? 'is-restored' : ''}
              animate={placed[index] ? { y: [20, -5, 0], opacity: [0, 1, 1] } : {}}
            >
              {placed[index] ?? ''}
            </motion.span>
          ))}
        </div>

        <div className="camp-adventure__story-card">
          <p className="camp-adventure__eyebrow">A picture-word puzzle</p>
          <h1>{phase === 'story' ? 'The bridge needs a camp word' : phase === 'build' ? 'Wake all three bridge planks' : 'The bridge is awake!'}</h1>
          <p>{phase === 'story' ? 'Look at the clue. Build the word from left to right.' : phase === 'build' ? 'Choose the first sound, the middle sound, then the ending sound.' : 'You used all three sounds to help Milo cross.'}</p>

          <MiloCoach
            learnerId={learnerId}
            context="adventure"
            event={phase === 'success' ? 'success' : hintCount >= 2 ? 'repeated_error' : hintCount === 1 ? 'first_error' : 'intro'}
            cueKey={`${phase}-${hintCount}`}
            previewMode={previewMode}
            onAction={(action) => {
              if (action === 'offer_hint') document.querySelector('.camp-adventure__bridge')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
              if (action === 'suggest_review') onBack();
            }}
          />

          <div className="camp-adventure__clue">
            {previewMode ? (
              <div className="camp-adventure__placeholder-mat" role="img" aria-label="Placeholder picture of a mat"><span /><span /><span /></div>
            ) : (
              <img src={media.meaningAsset.url} alt="A mat" onLoad={() => setPictureReady(true)} onError={() => setPhase('blocked')} />
            )}
            <span>{previewMode ? 'Placeholder clue' : 'Picture clue'}</span>
          </div>

          {phase === 'build' && (
            <>
              <div className="camp-adventure__tiles" aria-label="Letter tiles">
                {bank.map((letter) => (
                  <button key={letter} disabled={placed.includes(letter)} onClick={() => chooseTile(letter)}>{letter}</button>
                ))}
              </div>
              {hintCount > 0 && <div className="camp-adventure__hint"><Lightbulb /> Try <strong>{CAMP_ADVENTURE.letters[placed.length]}</strong> next. The trail reads from left to right.</div>}
            </>
          )}

          <div className="camp-adventure__actions">
            {phase === 'story' && <button className="camp-adventure__primary" disabled={!pictureReady} onClick={() => setPhase('build')}>Start the puzzle <ArrowRight /></button>}
            {phase === 'success' && <button className="camp-adventure__primary" disabled={!recorded} onClick={onComplete}>Finish the adventure <Flag /></button>}
          </div>
        </div>

        {phase === 'success' && <div className="camp-adventure__success" role="status"><Check /> Bridge restored</div>}
      </section>
    </main>
  );
}
