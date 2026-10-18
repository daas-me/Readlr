import { useCallback, useEffect, useState } from 'react';
import { EVIDENCE_SYNCED } from '../../hooks/evidenceRecords';
import { parseDelayedReviewStatus, type DelayedReviewStatus } from '../../hooks/delayedReview';

const API = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3000/api';

export function useDelayedReviewStatus(learnerId: number, token: string | null | undefined, curriculumVersion: string, enabled = true) {
  const [state, setState] = useState<{ loading: boolean; error: boolean; value: DelayedReviewStatus | null }>({ loading: enabled && Boolean(token), error: false, value: null });
  const load = useCallback(async () => {
    if (!enabled || !token) { setState({ loading: false, error: false, value: null }); return; }
    setState((current) => ({ ...current, loading: true, error: false }));
    try {
      const response = await fetch(`${API}/evidence/me/review-status?curriculumVersion=${encodeURIComponent(curriculumVersion)}`, { headers: { Authorization: `Bearer ${token}` } });
      const value = parseDelayedReviewStatus(await response.json().catch(() => null));
      if (!response.ok || !value) throw new Error('Review status unavailable');
      setState({ loading: false, error: false, value });
    } catch { setState((current) => ({ ...current, loading: false, error: true })); }
  }, [curriculumVersion, enabled, token]);

  useEffect(() => {
    const synced = (event: Event) => { if ((event as CustomEvent).detail === learnerId) void load(); };
    void load();
    window.addEventListener(EVIDENCE_SYNCED, synced);
    return () => window.removeEventListener(EVIDENCE_SYNCED, synced);
  }, [learnerId, load]);

  return { ...state, reload: load };
}
