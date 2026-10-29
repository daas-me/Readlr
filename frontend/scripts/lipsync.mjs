// Generates Milo lip-sync cue sheets with Rhubarb Lip Sync.
// For every public/audio/**/X.wav that has X.txt (the exact words spoken), writes X.json.
// Usage: npm run lipsync [-- --force]   (set RHUBARB to the rhubarb executable if it is not on PATH)
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/audio", import.meta.url));
const rhubarb = process.env.RHUBARB || "rhubarb";
const force = process.argv.includes("--force");

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (name.toLowerCase().endsWith(".wav")) yield path;
  }
}

let made = 0, skipped = 0, failed = 0;
for (const wav of walk(root)) {
  const base = wav.slice(0, -4), txt = `${base}.txt`, json = `${base}.json`;
  if (!existsSync(txt)) continue;
  const newest = Math.max(statSync(wav).mtimeMs, statSync(txt).mtimeMs);
  if (!force && existsSync(json) && statSync(json).mtimeMs >= newest) { skipped++; continue; }
  try {
    execFileSync(rhubarb, ["-f", "json", "--dialogFile", txt, "-o", json, wav], { stdio: ["ignore", "ignore", "pipe"] });
    console.log(`made ${json.slice(root.length + 1)}`);
    made++;
  } catch (error) {
    console.error(`failed ${wav.slice(root.length + 1)}: ${error.code === "ENOENT" ? `"${rhubarb}" not found; install Rhubarb Lip Sync or set RHUBARB` : error.stderr?.toString().trim() || error.message}`);
    failed++;
    if (error.code === "ENOENT") break;
  }
}
console.log(`${made} made, ${skipped} up to date, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
