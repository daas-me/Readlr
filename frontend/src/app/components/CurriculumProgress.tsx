import { BookOpenCheck, Check, CircleDashed, Clock3, CloudOff, Ear, RefreshCw, Sparkles, Target } from 'lucide-react';
import { useCurriculumProgress } from '../hooks/useCurriculumProgress';
import {
  CAMP_SKILLS,
  evidenceLabel,
  summarizeCurriculumSkills,
  type CurriculumSkillSummary,
} from '../../hooks/curriculumProgress';
import './curriculumProgress.css';

interface CurriculumProgressProps {
  learnerId?: number | null;
  token?: string | null;
  previewSkills?: CurriculumSkillSummary[];
}

const statusIcon = (summary?: CurriculumSkillSummary) => {
  if (!summary) return <CircleDashed />;
  if (summary.independentCandidateCount > 0) return <Target />;
  if (summary.bestEvidenceClass === 'completed_with_help') return <Check />;
  return <Sparkles />;
};

export function CurriculumProgress({ learnerId, token, previewSkills }: CurriculumProgressProps) {
  const live = useCurriculumProgress(learnerId, previewSkills ? null : token);
  const skills = previewSkills ?? live.skills;
  const summary = summarizeCurriculumSkills(skills);
  const byId = new Map(skills.map((skill) => [skill.skillId, skill]));
  const expandedSkills = skills.filter(skill => skill.curriculumVersion === 'readlr-aral-english-1');
  const groups = [...new Set(CAMP_SKILLS.map((skill) => skill.group))];
  const latest = skills.map((skill) => Date.parse(skill.latestAt)).filter(Number.isFinite).sort((a, b) => b - a)[0];

  return (
    <section className="curriculum-progress" aria-label="Camp skill evidence">
      <header className="curriculum-progress__heading">
        <div>
          <p>Learning Camp evidence</p>
          <h2>My Camp skills</h2>
          <span>Practice, help, and independent checks are kept separate.</span>
        </div>
        {!previewSkills && <button onClick={() => void live.reload()} disabled={live.loading} aria-label="Refresh Camp skills" title="Refresh Camp skills"><RefreshCw className={live.loading ? 'is-spinning' : ''} /></button>}
      </header>

      <div className="curriculum-progress__summary">
        <div><BookOpenCheck /><strong>{summary.withEvidence}</strong><span>Skills with evidence</span></div>
        <div><Target /><strong>{summary.independentlyChecked}</strong><span>Independent checks recorded</span></div>
        <div><Clock3 /><strong>{summary.reviewedLater}</strong><span>Skills checked again later</span></div>
        <div><Ear /><strong>{summary.latestNeedsPractice}</strong><span>Latest checks needing practice</span></div>
      </div>

      <p className="curriculum-progress__boundary">
        An independent check is evidence for review, not an automatic mastery claim. Camp activities do not change the three-stage completion percentage.
      </p>

      {live.pending > 0 && !previewSkills && <div className="curriculum-progress__pending"><CloudOff /> {live.pending} Camp {live.pending === 1 ? 'activity is' : 'activities are'} saved on this device and waiting to sync.</div>}
      {live.error && !previewSkills && <div className="curriculum-progress__error"><CloudOff /><div><strong>Camp evidence could not load</strong><span>Your stage history is unchanged. Check the evidence migrations or connection, then refresh.</span></div></div>}
      {live.loading && !skills.length && <div className="curriculum-progress__loading"><RefreshCw className="is-spinning" /> Loading Camp evidence...</div>}

      {!live.loading && !live.error && !skills.length && !previewSkills && (
        <div className="curriculum-progress__empty"><CircleDashed /><h3>No Camp evidence yet</h3><p>Camp activities will appear here after an approved Learning Camp route is completed and synced.</p></div>
      )}

      {(skills.length > 0 || previewSkills) && (
        <div className="curriculum-progress__groups">
          {groups.map((group) => (
            <section key={group} className="curriculum-progress__group">
              <header><h3>{group}</h3><span>{CAMP_SKILLS.filter((skill) => skill.group === group).length} {group === 'Letters' ? 'connections' : 'skills'}</span></header>
              {CAMP_SKILLS.filter((skill) => skill.group === group).map((skill) => {
                const item = byId.get(skill.id);
                const evidenceClass = item?.bestEvidenceClass ?? 'not_assessed';
                return (
                  <article key={skill.id} className={`curriculum-progress__skill is-${evidenceClass.replaceAll('_', '-')}`}>
                    <div className="curriculum-progress__status-icon">{statusIcon(item)}</div>
                    <div className="curriculum-progress__skill-copy">
                      <h4>{skill.title}</h4>
                      <p>{skill.detail}</p>
                      {item && <small>{item.attemptCount} {item.attemptCount === 1 ? 'activity' : 'activities'} recorded{item.latestResult === 'incorrect' ? ' / latest check needs practice' : ''}{item.delayedReviewCount > 0 ? ` / checked later: ${item.latestReviewResult === 'correct' ? 'remembered' : 'needs practice'}` : ''}</small>}
                    </div>
                    <span className="curriculum-progress__label">{evidenceLabel(evidenceClass)}</span>
                  </article>
                );
              })}
            </section>
          ))}
        </div>
      )}

      {expandedSkills.length > 0 && <section className="curriculum-progress__group">
        <header><h3>Kingdom word practice</h3><span>English practice / ARAL-informed sequence</span></header>
        {expandedSkills.map(skill => <article className="curriculum-progress__skill" key={`${skill.curriculumVersion}-${skill.skillId}`}>
          <div className="curriculum-progress__status-icon">{statusIcon(skill)}</div>
          <div className="curriculum-progress__skill-copy"><h4>{skill.skillId.split('.').slice(1).join(': ')}</h4><p>{skill.correctCount} successful responses across {skill.attemptCount} recorded attempts</p><small>{skill.helpedCount} with help / latest: {skill.latestResult.replace('_',' ')}</small></div>
          <span className="curriculum-progress__label">{skill.skillId.startsWith('aral.read.')?'Word recognition':'Practice'}</span>
        </article>)}
      </section>}
      {(latest || live.generatedAt) && <footer>Last evidence update: {new Date(latest || live.generatedAt!).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</footer>}
    </section>
  );
}
