import { useEffect, useState } from 'react';
import { isLearningCampAccess, type LearningCampAccess } from '../../hooks/learningCampAccess';

const API = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_URL || 'http://localhost:3000/api';
export function useLearningCampAccess(token: string | null, isLearner: boolean) {
  const [state, setState] = useState<{ loading: boolean; access: LearningCampAccess }>({
    loading: Boolean(token) && isLearner,
    access: { enabled: false },
  });

  useEffect(() => {
    if (!token || !isLearner) {
      setState({ loading: false, access: { enabled: false } });
      return;
    }

    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true }));
    fetch(`${API}/evidence/me/camp-access`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!controller.signal.aborted) {
          setState({ loading: false, access: isLearningCampAccess(payload) ? payload : { enabled: false } });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ loading: false, access: { enabled: false } });
      });

    return () => controller.abort();
  }, [token, isLearner]);

  return state;
}
