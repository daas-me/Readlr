import { useEffect, useState } from 'react';
import { EVIDENCE_QUEUED, readEvidenceQueue, syncEvidenceQueue } from '../../hooks/evidenceRecords';

export function useEvidenceSync(learnerId: number | null, token: string | null) {
  const [syncError, setSyncError] = useState(false);
  useEffect(() => {
    if (!learnerId || !token) { setSyncError(false); return; }
    let active = true, busy = false, again = false;
    const run = async () => {
      if (!active || !readEvidenceQueue(learnerId).length) return;
      if (busy) { again = true; return; }
      busy = true;
      try { await syncEvidenceQueue(learnerId, token); if (active) setSyncError(false); }
      catch { if (active) setSyncError(true); }
      finally { busy = false; if (again) { again = false; void run(); } }
    };
    const queued = (event: Event) => { if ((event as CustomEvent).detail === learnerId) void run(); };
    const visible = () => { if (!document.hidden) void run(); };
    window.addEventListener(EVIDENCE_QUEUED, queued);
    window.addEventListener('online', run);
    document.addEventListener('visibilitychange', visible);
    const timer = window.setInterval(() => void run(), 30_000);
    void run();
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener(EVIDENCE_QUEUED, queued);
      window.removeEventListener('online', run);
      document.removeEventListener('visibilitychange', visible);
    };
  }, [learnerId, token]);
  return syncError;
}

