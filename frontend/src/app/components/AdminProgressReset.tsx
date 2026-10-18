import { useState } from 'react';
import { RotateCcw, BookOpen, Users, UserRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { CLASSROOM_API } from '../hooks/useClassroom';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from './ui/alert-dialog';

export function AdminProgressReset({ token, target, name }: { token: string; target: string; name: string }) {
  const [selected, setSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [word, setWord] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [failed, setFailed] = useState(false);
  async function reset() {
    if (busy || word !== 'RESET' || !selected) return;
    setBusy(true); setResult(''); setFailed(false);
    try {
      const response = await fetch(`${CLASSROOM_API}/admin/classroom/reset`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({ target: target === 'class' ? 'class' : Number(target), scope: 'reading-checkpoints', confirmation: word }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Restart could not be confirmed.');
      setResult(data.message); setConfirm(false); setSelected(false); setWord('');
      window.dispatchEvent(new Event('readlr:admin-progress-reset'));
    } catch (error) {
      setFailed(true);
      setResult(error instanceof Error ? error.message : 'Restart could not be confirmed. Refresh progress before trying again.');
    } finally { setBusy(false); }
  }
  return <section className="admin-reset-tools" aria-labelledby="reset-heading">
    <header className="admin-reset-heading"><span className="admin-reset-icon"><RotateCcw size={21}/></span><div><h3 id="reset-heading">Restart progress</h3><p>Restart final-gate completion for the Reading Chronicles.</p></div></header>
    {!confirm && result && <div role="status" className={`admin-control-notice ${failed?'is-error':''}`}>{failed?<AlertCircle size={18}/>:<CheckCircle2 size={18}/>}<span>{result}</span></div>}
    <div className="admin-reset-scope">{target==='class'?<Users size={19}/>:<UserRound size={19}/>}<div><small>Restart applies to</small><strong>{name}</strong></div><span>{target==='class'?'All current learners, including individual overrides':'Only this learner'}</span></div>
    <fieldset disabled={busy} className="admin-reset-stages"><legend>Choose progress to restart</legend>
      <label className={`admin-reset-stage${selected?' is-selected':''}`}><input type="checkbox" checked={selected} onChange={e=>setSelected(e.target.checked)}/><span className="admin-reset-stage-icon"><BookOpen size={22}/></span><span className="admin-reset-stage-copy"><strong>All ten book checkpoints</strong><span>Final-gate completion returns to 0 of 10. Earlier checkpoint records remain stored.</span></span></label>
    </fieldset>
    <div className="admin-reset-impact"><div><RotateCcw size={18}/><div><h4>Starts again</h4><p>Book checkpoint completion and normal book progression. Book-completion achievements and rewards may relock until earned again.</p></div></div><div><BookOpen size={18}/><div><h4>Stays saved</h4><p>Camp orientation, guided stops, practice activities, recordings, and class or individual access overrides. This does not erase guided practice.</p></div></div></div>
    <footer className="admin-reset-actions"><p>This cannot be undone here.<small>Access overrides can keep books and stops open after the restart.</small></p><button type="button" className="admin-reset-review" disabled={busy||!selected} onClick={()=>{setWord('');setResult('');setConfirm(true);}}>Review restart<ArrowRight size={17}/></button></footer>
    <AlertDialog open={confirm} onOpenChange={open=>{if(!busy)setConfirm(open);}}>
      <AlertDialogContent className="admin-confirm-dialog">
        <AlertDialogTitle>Restart book checkpoints for {name}?</AlertDialogTitle>
        <AlertDialogDescription>All ten final gates will need to be passed again. {target==='class'?'This affects every current learner, including learners with individual access overrides.':'Other learners are not affected.'} Guided practice stays saved. Book-completion rewards may relock.</AlertDialogDescription>
        <label>Type RESET to confirm<input aria-label="Reset confirmation" className="admin-reset-confirmation" autoComplete="off" value={word} disabled={busy} onChange={e=>setWord(e.target.value)}/></label>
        {result&&<p role="alert">{result}</p>}
        <AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><button className="admin-confirm-apply admin-reset-submit" disabled={busy||word!=='RESET'} onClick={()=>void reset()}>{busy?'Restarting...':'Restart book checkpoints'}</button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>;
}
