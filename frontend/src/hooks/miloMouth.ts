// Lip-sync for Milo: each recording may have a Rhubarb Lip Sync cue sheet next to it
// (same name, .json). While it plays, the current mouth shape is shared with every Milo.
export const MOUTH_SHAPES = ["A", "B", "C", "D", "E", "F", "G", "H", "X"] as const;
export type MouthShape = typeof MOUTH_SHAPES[number];
export interface MouthCue { start: number; end: number; value: MouthShape }

let current: MouthShape | null = null;
const listeners = new Set<() => void>();

export function getMiloMouth() { return current; }
export function subscribeMiloMouth(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function setMiloMouth(shape: MouthShape | null) {
  if (shape === current) return;
  current = shape;
  listeners.forEach(listener => listener());
}

export function parseMouthCues(data: unknown): MouthCue[] | null {
  const cues = (data as { mouthCues?: unknown } | null)?.mouthCues;
  if (!Array.isArray(cues)) return null;
  const valid = cues.filter((cue): cue is MouthCue =>
    typeof cue?.start === "number" && typeof cue?.end === "number" && cue.end > cue.start &&
    (MOUTH_SHAPES as readonly string[]).includes(cue?.value));
  return valid.length ? valid.sort((a, b) => a.start - b.start) : null;
}

export function mouthAt(cues: MouthCue[], time: number): MouthShape {
  return cues.find(cue => time >= cue.start && time < cue.end)?.value ?? "X";
}

export function cueSheetUrl(audioUrl: string) {
  return audioUrl.replace(/\.(wav|mp3|ogg|m4a)(\?.*)?$/i, ".json$2");
}

async function loadMouthCues(audioUrl: string) {
  try {
    const response = await fetch(cueSheetUrl(audioUrl));
    // The dev server answers missing files with index.html, so require JSON.
    if (!response.ok || !response.headers.get("content-type")?.includes("json")) return null;
    return parseMouthCues(await response.json());
  } catch { return null; }
}

/** Drives Milo's mouth from the player's cue sheet; returns a cleanup function. */
export function followMouthCues(player: HTMLAudioElement) {
  let cues: MouthCue[] | null = null;
  let frame = 0;
  let loadedFor = "";
  const load = () => {
    const src = player.currentSrc || player.src;
    if (!src || src === loadedFor) return;
    loadedFor = src;
    cues = null;
    void loadMouthCues(src).then(result => { if (loadedFor === src) cues = result; });
  };
  const tick = () => {
    // Without a cue sheet, Milo keeps his generic speaking animation.
    setMiloMouth(cues ? mouthAt(cues, player.currentTime) : null);
    if (!player.paused && !player.ended) frame = requestAnimationFrame(tick);
  };
  const start = () => { load(); cancelAnimationFrame(frame); frame = requestAnimationFrame(tick); };
  const rest = () => { cancelAnimationFrame(frame); setMiloMouth(null); };
  player.addEventListener("loadedmetadata", load);
  player.addEventListener("playing", start);
  ["pause", "ended", "emptied", "error"].forEach(event => player.addEventListener(event, rest));
  return () => {
    player.removeEventListener("loadedmetadata", load);
    player.removeEventListener("playing", start);
    ["pause", "ended", "emptied", "error"].forEach(event => player.removeEventListener(event, rest));
    rest();
  };
}
