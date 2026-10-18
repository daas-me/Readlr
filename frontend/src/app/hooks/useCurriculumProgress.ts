import { useCallback, useEffect, useState } from 'react';
import { EVIDENCE_QUEUED, EVIDENCE_SYNCED, readEvidenceQueue } from '../../hooks/evidenceRecords';
import { parseCurriculumSummary, type CurriculumSkillSummary } from '../../hooks/curriculumProgress';

const API = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3000/api';

export function useCurriculumProgress(learnerId: number | null | undefined, token: string | null | undefined) {
  const [state, setState] = useState<{ loading: boolean; error: boolean; skills: CurriculumSkillSummary[]; generatedAt: string | null }>({
    loading: Boolean(token), error: false, skills: [], generatedAt: null,
  });
  const [pending, setPending] = useState(() => readEvidenceQueue(learnerId).length);

  const load = useCallback(async () => {
    if (!token) { setState({ loading: false, error: false, skills: [], generatedAt: null }); return; }
    setState((current) => ({ ...current, loading: true, error: false }));
    try {
      const response = await fetch(`${API}/evidence/me/summary`, { headers: { Authorization: `Bearer ${token}` } });
      const payload = parseCurriculumSummary(await response.json().catch(() => null));
      if (!response.ok || !payload) throw new Error('Summary unavailable');
      setState({ loading: false, error: false, skills: payload.skills, generatedAt: payload.generatedAt });
    } catch {
      setState((current) => ({ ...current, loading: false, error: true }));
    }
  }, [token]);

  useEffect(() => {
    const refreshPending = () => setPending(readEvidenceQueue(learnerId).length);
    const synced = (event: Event) => {
      if ((event as CustomEvent).detail === learnerId) { refreshPending(); void load(); }
    };
    const queued = () => refreshPending();
    refreshPending();
    void load();
    window.addEventListener(EVIDENCE_SYNCED, synced);
    window.addEventListener(EVIDENCE_QUEUED, queued);
    return () => {
      window.removeEventListener(EVIDENCE_SYNCED, synced);
      window.removeEventListener(EVIDENCE_QUEUED, queued);
    };
  }, [learnerId, load]);

  return { ...state, pending, reload: load };
}
