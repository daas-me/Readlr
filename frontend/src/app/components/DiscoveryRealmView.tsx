import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Compass, Flower2, Library, Puzzle, Sparkles, Trees } from 'lucide-react';
import { CharacterCompanion } from './CharacterCompanion';
import { DISCOVERY_PLACES, DISCOVERY_STORY_PAGES, addLetterToAt, isDiscoveryTrailChoice, type DiscoveryPlaceId } from './discoveryRealm';
import './discoveryRealm.css';

interface DiscoveryRealmProps {
  onBack: () => void;
  previewMode?: boolean;
}

const icons = { library: Library, puzzles: Puzzle, garden: Flower2, trail: Compass, review: Clock3 } as const;

export function DiscoveryRealm({ onBack, previewMode = false }: DiscoveryRealmProps) {
  const [place, setPlace] = useState<DiscoveryPlaceId>('library');
  const [page, setPage] = useState(0);
  const [puzzleResult, setPuzzleResult] = useState<'idle' | 'right' | 'try'>('idle');
  const [garden, setGarden] = useState<string[]>([]);
  const [trailResult, setTrailResult] = useState<'idle' | 'right' | 'try'>('idle');
  const active = useMemo(() => DISCOVERY_PLACES.find((item) => item.id === place)!, [place]);

  return (
    <main className="discovery-realm">
      <div className="discovery-realm__sky" aria-hidden="true"><span /><span /><span /></div>
      <div className="discovery-realm__shell">
        <header className="discovery-realm__header">
          <button className="discovery-realm__icon-button" onClick={onBack} aria-label="Return to Learning Camp"><ArrowLeft /></button>
          <div>
            <p className="discovery-realm__eyebrow"><Sparkles /> Beyond graduation</p>
            <h1>Discovery Realm</h1>
            <p>Choose a new way to use the sounds and words you already know.</p>
          </div>
          <CharacterCompanion size={118} state="celebrating" gesture="wave" cueKey={place} />
        </header>

        {previewMode && <div className="discovery-realm__preview"><BookOpen /> Prototype content for review. Nothing here changes mastery, rewards, or learner evidence.</div>}

        <nav className="discovery-realm__places" aria-label="Discovery Realm places">
          {DISCOVERY_PLACES.map((item) => {
            const Icon = icons[item.id];
            return <button key={item.id} className={place === item.id ? 'is-active' : ''} onClick={() => setPlace(item.id)}><Icon /><span><strong>{item.title}</strong><small>{item.short}</small></span></button>;
          })}
        </nav>

        <motion.section key={place} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`discovery-realm__activity discovery-realm__activity--${place}`}>
          <div className="discovery-realm__activity-heading">
            <div className="discovery-realm__activity-icon">{(() => { const Icon = icons[place]; return <Icon />; })()}</div>
            <div><p className="discovery-realm__eyebrow">Optional reading play</p><h2>{active.title}</h2><span>{active.purpose}</span></div>
          </div>

          {place === 'library' && <div className="discovery-book" aria-label={`Story page ${page + 1} of ${DISCOVERY_STORY_PAGES.length}`}>
            <button onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} aria-label="Previous story page"><ArrowLeft /></button>
            <div className="discovery-book__spread">
              <div className="discovery-book__picture" aria-hidden="true"><span className="discovery-book__sun" /><span className="discovery-book__mat" /><span className="discovery-book__tam">T</span></div>
              <motion.div key={page} initial={{ rotateY: -12, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} className="discovery-book__page">
                <small>{DISCOVERY_STORY_PAGES[page].eyebrow}</small><strong>{DISCOVERY_STORY_PAGES[page].text}</strong><span>{page + 1} / {DISCOVERY_STORY_PAGES.length}</span>
              </motion.div>
            </div>
            <button onClick={() => setPage((value) => Math.min(DISCOVERY_STORY_PAGES.length - 1, value + 1))} disabled={page === DISCOVERY_STORY_PAGES.length - 1} aria-label="Next story page"><ArrowRight /></button>
          </div>}

          {place === 'puzzles' && <div className="discovery-puzzle">
            <p>Add one letter to the front of <strong>at</strong>.</p>
            <div className="discovery-puzzle__word"><span>?</span><span>a</span><span>t</span></div>
            <div className="discovery-puzzle__choices">{['t', 'm', 'a'].map((letter) => <button key={letter} onClick={() => setPuzzleResult(addLetterToAt(letter) ? 'right' : 'try')}>{letter}</button>)}</div>
            <div className={`discovery-realm__feedback is-${puzzleResult}`} aria-live="polite">{puzzleResult === 'right' ? <><Check /> You made mat.</> : puzzleResult === 'try' ? 'Try a different first sound.' : 'Choose a letter.'}</div>
          </div>}

          {place === 'garden' && <div className="discovery-garden">
            <div className="discovery-garden__plot" aria-label={`${garden.length} garden decorations placed`}>{garden.map((item, index) => <span key={`${item}-${index}`} className={`is-${item}`}><Flower2 /></span>)}</div>
            <p>Read <strong>mat</strong>, then choose something to grow. Nothing disappears when you take a break.</p>
            <div className="discovery-garden__choices"><button onClick={() => setGarden((items) => [...items, 'pink'])}><Flower2 /> Pink flower</button><button onClick={() => setGarden((items) => [...items, 'gold'])}><Sparkles /> Golden bloom</button></div>
          </div>}

          {place === 'trail' && <div className="discovery-trail">
            <div className="discovery-trail__scene" aria-hidden="true"><Trees /><span className="discovery-trail__path" /><span className="discovery-trail__sign">?</span></div>
            <p>The clue says: “Find the path with a <strong>mat</strong>.”</p>
            <div className="discovery-trail__choices">{['am', 'mat', 'at'].map((word) => <button key={word} onClick={() => setTrailResult(isDiscoveryTrailChoice(word) ? 'right' : 'try')}>{word}</button>)}</div>
            <div className={`discovery-realm__feedback is-${trailResult}`} aria-live="polite">{trailResult === 'right' ? <><Check /> Trail found.</> : trailResult === 'try' ? 'Read the whole clue word again.' : 'Choose a trail sign.'}</div>
          </div>}

          {place === 'review' && <div className="discovery-review">
            <Clock3 /><h3>A review quest is ready later</h3>
            <p>Review Quests use unfamiliar approved examples after time has passed. Missing a day never removes progress or lowers mastery.</p>
            <button disabled>Waiting for an approved review pack</button>
          </div>}
        </motion.section>
      </div>
    </main>
  );
}
