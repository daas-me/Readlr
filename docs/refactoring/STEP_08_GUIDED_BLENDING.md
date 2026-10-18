# Step 8: Guided Blending Vertical Slice

Status: **Implemented behind the Step 7 release gate**  
Prepared: 2026-10-13  
Runtime activities: `ENG01-MAT-B01`, `ENG01-MAT-B02`, `ENG01-MAT-B03`

This checkpoint implements guided construction for `am`, `at`, and `mat`. It does not implement independent checks, derive mastery, or expose provisional media.

## Learner sequence

The Wordsmith Tent opens one ordered route:

1. `am`: hear segmented, continuous, and whole-word models; build `a-m`.
2. `at`: hear the three approved models; build `a-t`.
3. `mat`: hear the three approved models; build `m-a-t`; then load the approved meaning image.

The child taps letter tiles in reading order. Keyboard and screen-reader activation use the same native buttons. An incorrect tile does not end the activity: it records a hint and identifies the next letter. The learner can reset the current tile row, which also records help.

The design is an actual tent workbench rather than a generic challenge card. Model controls, construction slots, loose letter tiles, progress, replay state, hints, and completion actions keep fixed dimensions across desktop and mobile.

## Media boundary

Each lesson requires three distinct assets:

- segmented sound sequence;
- continuous blend;
- natural whole word.

`mat` additionally requires its approved meaning image. Runtime URLs are scoped under the immutable released manifest version:

`/media/readlr2/<media-manifest-version>/...`

Before a lesson opens, every dependency is fetched and checked for a successful response and its expected audio/image content type. A missing asset, HTML fallback, blocked request, or playback error stops the lesson with a child-safe unavailable message. Readlr does not use general TTS, the legacy `ma`/`ta` recordings, or a CSS drawing as an instructional substitute.

No current approved media files are added by this checkpoint. Therefore the activity remains unavailable until the Step 7 feature gates pass and the exact approved files are deployed under the released manifest directory.

## Evidence boundary

One immutable construction attempt is queued after each completed word. Every record includes:

- the authenticated learner-scoped queue, session and attempt IDs;
- exact curriculum and media manifest versions from the access response;
- the activity, skill, content, response, and media asset IDs;
- hint count and offline capture state;
- `mode = guided`;
- `modelExposed = true`;
- `answerExposed = true`.

The server therefore derives `completed_with_help`, never `independent_candidate`, even when the learner selects every tile correctly. `mat` evidence is not queued until the required meaning image loads. Storage failure does not trap the child, but it does not create a fabricated synced record.

## Deferred work

- Sound/letter discovery and auditory discrimination remain later activities.
- Adventure application begins in Step 9.
- Independent checks and remediation begin in Step 10.
- Progress aggregation and educator interpretation begin in Step 11.
- Guided route completion is session UI only; it is not mastery or a legacy stage completion.
