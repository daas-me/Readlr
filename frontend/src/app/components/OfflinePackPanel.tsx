import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download, HardDriveDownload, Loader2, ShieldCheck, Trash2, WifiOff } from 'lucide-react';
import { buildCampOfflineAssets, installOfflinePack, readOfflinePackRecords, registerReadlrOfflineWorker, removeOfflinePack, verifyOfflinePack, type OfflinePackRecord } from '../../hooks/offlinePack';
import './offlinePackPanel.css';

interface OfflinePackPanelProps { mediaManifestVersion: string; previewMode?: boolean }
type PackState = 'checking' | 'available' | 'installing' | 'ready' | 'error';

export function OfflinePackPanel({ mediaManifestVersion, previewMode = false }: OfflinePackPanelProps) {
  const assets = useMemo(() => buildCampOfflineAssets(mediaManifestVersion), [mediaManifestVersion]);
  const [state, setState] = useState<PackState>('checking');
  const [record, setRecord] = useState<OfflinePackRecord | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    if (previewMode) { setState('available'); return () => { active = false; }; }
    void registerReadlrOfflineWorker();
    void verifyOfflinePack(mediaManifestVersion, assets).then((ready) => {
      if (!active) return;
      const saved = readOfflinePackRecords().find((item) => item.manifestVersion === mediaManifestVersion) ?? null;
      setRecord(ready ? saved : null);
      setState(ready ? 'ready' : 'available');
    }).catch(() => { if (active) setState('available'); });
    return () => { active = false; };
  }, [assets, mediaManifestVersion, previewMode]);

  const download = async () => {
    setState('installing'); setMessage('');
    if (previewMode) {
      const simulated = { schemaVersion: 1 as const, manifestVersion: mediaManifestVersion, installedAt: new Date().toISOString(), assetCount: assets.length, bytes: 0 };
      setRecord(simulated); setState('ready'); return;
    }
    try {
      if (!await registerReadlrOfflineWorker()) throw new Error('Offline packs are not supported in this browser or connection.');
      const installed = await installOfflinePack(mediaManifestVersion, assets); setRecord(installed); setState('ready');
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'The pack could not be downloaded.'); setState('error'); }
  };

  const remove = async () => {
    if (!previewMode) await removeOfflinePack(mediaManifestVersion);
    setRecord(null); setMessage(''); setState('available');
  };

  return <section className={`offline-pack is-${state}`} aria-labelledby="offline-pack-title">
    <div className="offline-pack__icon">{state === 'ready' ? <CheckCircle2 /> : <HardDriveDownload />}</div>
    <div className="offline-pack__copy">
      <p>Optional offline pack</p>
      <h2 id="offline-pack-title">{state === 'ready' ? 'Camp is ready without internet' : 'Take this Camp trail offline'}</h2>
      <span>{state === 'ready' ? `${record?.assetCount ?? assets.length} approved learning files saved on this device.` : 'Download this version’s approved sounds and pictures. Account data and voice recordings are not included.'}</span>
      {state === 'error' && <small role="alert">{message}</small>}
      <div className="offline-pack__assurance"><ShieldCheck /> Versioned content <span aria-hidden="true">•</span> <WifiOff /> Nonvoice activities continue offline</div>
    </div>
    <div className="offline-pack__actions">
      {state === 'ready' ? <button className="offline-pack__remove" onClick={() => void remove()}><Trash2 /> Remove</button> :
        <button className="offline-pack__download" disabled={state === 'checking' || state === 'installing'} onClick={() => void download()}>{state === 'installing' ? <Loader2 className="offline-pack__spinner" /> : <Download />} {state === 'installing' ? 'Downloading…' : state === 'checking' ? 'Checking…' : 'Download pack'}</button>}
    </div>
  </section>;
}
