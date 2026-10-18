# Step 16: Versioned Offline Packs

Completed 2026-10-13 as infrastructure for approved Learning Camp releases.

## Delivered

- Explicit learner-initiated download and remove controls.
- Immutable pack identity derived from the approved media manifest version.
- Deduplicated Camp audio and image inventory.
- Same-origin path, MIME type, file-size, pack-size, and completeness validation.
- Versioned Cache Storage entries and minimal local metadata.
- A service worker for app-shell recovery and explicitly downloaded `/media/readlr2/` assets.
- Honest unsupported, failed, installing, ready, and removed states.
- Production bundling of the Learning Camp preview entry.

## Privacy boundary

Offline caches contain application files plus released instructional audio and images only. They do not contain:

- API responses or authorization headers;
- learner names, emails, profiles, classroom messages, or settings;
- raw voice recordings, transcripts, speech predictions, or survey responses;
- progress, rewards, or curriculum evidence.

Locally queued evidence remains in the existing learner-scoped queue and synchronizes through the authenticated backend when connectivity returns. Stable client attempt IDs keep replay duplicate-safe.

## Failure behavior

- Missing, wrong-type, oversized, or unavailable media aborts installation.
- Files are fully downloaded and validated before the target cache is opened for writing.
- An unsuccessful replacement does not delete an existing versioned pack.
- Missing service-worker support produces an unavailable message instead of a false ready state.
- Speech recognition remains unavailable offline and activities retain their nonvoice alternatives.

## Release boundary

The current ENG-01 and ENG-02 media manifests are provisional and blocked, so they cannot become real offline packs yet. Deployment requires an approved immutable manifest, every required file at its versioned runtime URL, HTTPS or localhost service-worker support, and school-device interruption testing.
