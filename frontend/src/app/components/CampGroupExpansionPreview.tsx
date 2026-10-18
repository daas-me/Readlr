import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Ear, Footprints, MoonStar, Puzzle, Sparkles, WandSparkles } from 'lucide-react';
import { completedCampGroupGates, ENG02_CAMP_GROUP } from './learningCampGroups';
import './campGroupExpansionPreview.css';

const icons = {
  discover: Sparkles,
  listen: Ear,
  build: Puzzle,
  change: WandSparkles,
  story: BookOpen,
  check: CheckCircle2,
  review: Clock3,
} as const;

interface CampGroupExpansionPreviewProps {
  onBack: () => void;
}

export function CampGroupExpansionPreview({ onBack }: CampGroupExpansionPreviewProps) {
  const [selected, setSelected] = useState(0);
  const group = ENG02_CAMP_GROUP;
  const active = group.route[selected];
  const ActiveIcon = icons[active.kind];
  const readyGates = completedCampGroupGates(group);

  return (
    <main className="camp-expansion">
      <div className="camp-expansion__night" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--firefly': index } as React.CSSProperties} />)}
      </div>

      <div className="camp-expansion__shell">
        <header className="camp-expansion__header">
          <button className="camp-expansion__back" onClick={onBack} aria-label="Back to preview menu"><ArrowLeft /></button>
          <div>
            <p className="camp-expansion__eyebrow"><MoonStar /> Group 2 review trail</p>
            <h1>{group.name}</h1>
            <p>{group.subtitle}</p>
          </div>
          <div className="camp-expansion__letters" aria-label="New letters e, s, i, and l">
            {group.graphemes.map((letter) => <span key={letter}>{letter}</span>)}
          </div>
        </header>

        <section className="camp-expansion__status" aria-label="Publication status">
          <div><strong>Curriculum review</strong><span>{readyGates} of {Object.keys(group.gates).length} gates ready</span></div>
          <div className="camp-expansion__meter"><span style={{ width: `${(readyGates / Object.keys(group.gates).length) * 100}%` }} /></div>
          <p>This is a design preview. Draft sounds, words, and pictures cannot collect learner evidence.</p>
        </section>

        <section className="camp-expansion__route" aria-labelledby="eng02-route-title">
          <div className="camp-expansion__route-heading">
            <div><p className="camp-expansion__eyebrow"><Footprints /> Cumulative route</p><h2 id="eng02-route-title">Old sounds return with new ones</h2></div>
            <div className="camp-expansion__word-bank" aria-label="Candidate words pending educator review">
              {group.candidateWords.map((word) => <span key={word}>{word}</span>)}
            </div>
          </div>

          <div className="camp-expansion__map">
            <div className="camp-expansion__trail" aria-hidden="true" />
            {group.route.map((stop, index) => {
              const Icon = icons[stop.kind];
              return (
                <motion.button
                  key={stop.id}
                  className={`camp-expansion__stop camp-expansion__stop--${stop.kind} ${selected === index ? 'is-selected' : ''}`}
                  onClick={() => setSelected(index)}
                  aria-pressed={selected === index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                >
                  <span>{index + 1}</span><Icon /><strong>{stop.title}</strong><small>{stop.short}</small>
                </motion.button>
              );
            })}
          </div>
        </section>

        <motion.section key={active.id} className={`camp-expansion__detail camp-expansion__detail--${active.kind}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          <div className="camp-expansion__detail-icon"><ActiveIcon /></div>
          <div><p>Stop {selected + 1} of {group.route.length}</p><h2>{active.title}</h2><span>{active.detail}</span></div>
          <div className="camp-expansion__pending"><Clock3 /><span>Pending educator approval</span></div>
        </motion.section>
      </div>
    </main>
  );
}
