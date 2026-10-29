import { useEffect, useState } from 'react';
import { Download, Play, RefreshCw, Square } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
interface MetricRow { id: string; goal: string; label: string; target: string; numerator: number | null; denominator: number | null; value: number | null; met: boolean | null; note: string }
interface StudyState {
  startDate: string | null; classSession: { startedAt: string } | null; summary: MetricRow[];
  weekly: Array<{ week: number; voluntaryLearners: number; retention: number | null }>;
}
const shown = (row: MetricRow) => row.value === null ? '-' : row.id === 'response-3s' ? `${Math.round(row.value)} ms` : `${(row.value * 100).toFixed(1)}%`;

// Pilot-study controls for the research team: start date, required class sessions, SMART metrics and the data export.
export function AdminStudy({ token }: { token: string }) {
  const [data, setData] = useState<StudyState | null>(null);
  const [startDate, setStartDate] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const call = async (path: string, init?: RequestInit) => {
    const response = await fetch(`${API_URL}/admin/study${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Study data is unavailable.');
    return response;
  };
  useEffect(() => {
    let active = true;
    call('').then(r => r.json()).then(next => { if (active) { setData(next); setStartDate(next.startDate ?? ''); setError(''); } })
      .catch(e => { if (active) setError((e as Error).message); });
    return () => { active = false; };
  }, [token, reload]);
  const act = async (work: () => Promise<unknown>) => {
    setBusy(true); setError('');
    try { await work(); setReload(n => n + 1); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const download = () => act(async () => {
    const url = URL.createObjectURL(await (await call('/export')).blob());
    const a = document.createElement('a'); a.href = url; a.download = `readlr-study-data-${new Date().toISOString().slice(0, 10)}.xlsx`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  const live = data?.classSession;
  return <section aria-label="Pilot study">
    <div className="survey-response-toolbar"><div><h2>Pilot study</h2><p className="admin-muted">SMART-goal measures from app use. Learning outcomes come from the paper pre- and post-tests.</p></div>
      <div className="flex gap-2"><button className="admin-icon-button" title="Refresh" aria-label="Refresh study data" onClick={() => setReload(n => n + 1)}><RefreshCw size={18} /></button>
        <button className="admin-apply" disabled={busy || !data} onClick={download}><Download size={18} />{busy ? 'Working...' : 'Export study data'}</button></div></div>
    {error && <p role="alert" className="admin-control-notice is-error">{error}</p>}
    <div className="admin-access-section p-5 grid gap-4 md:grid-cols-2">
      <div><h3>Study start date</h3><p className="admin-muted">Day 1 of week 1. Weeks run 7 days from this date (Philippine time).</p>
        <div className="flex gap-2 mt-2"><input type="date" aria-label="Study start date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
          <button className="admin-apply" disabled={busy || startDate === (data?.startDate ?? '')} onClick={() => act(() => call('', { method: 'PUT', body: JSON.stringify({ startDate: startDate || null }) }))}>Save</button></div></div>
      <div><h3>Class session</h3><p className="admin-muted">{live ? `Running since ${new Date(live.startedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}. App use now counts as required, not voluntary.` : 'Start this when learners use Readlr during scheduled class time. Use outside class sessions counts as voluntary.'}</p>
        <button className="admin-apply mt-2" disabled={busy || !data} onClick={() => act(() => call('/class-session', { method: 'POST', body: JSON.stringify({ action: live ? 'end' : 'start' }) }))}>
          {live ? <><Square size={16} />End class session</> : <><Play size={16} />Start class session</>}</button></div>
    </div>
    <div style={{ overflowX: 'auto' }} className="mt-4"><table className="admin-table"><thead><tr><th>Goal</th><th>Measure</th><th>Target</th><th>Result</th><th>n / total</th><th>Met?</th></tr></thead><tbody>
      {(data?.summary ?? []).map(row => <tr key={row.id}><td>{row.goal}</td><td>{row.label}<br /><small className="admin-muted">{row.note}</small></td><td>{row.target}</td><td><strong>{shown(row)}</strong></td>
        <td>{row.denominator === null ? '-' : `${row.numerator} / ${row.denominator}`}</td><td>{row.met === null ? 'Not yet' : row.met ? 'Yes' : 'No'}</td></tr>)}
    </tbody></table></div>
    {!data && !error && <p className="admin-muted py-6">Loading study data...</p>}
    <p className="admin-muted mt-5">The export lists learners by code (L-001), never by name or email. Keep it within the research team.</p>
  </section>;
}
