# Step 14: Contextual Milo Guidance

Completed 2026-10-13.

## Delivered

- Context-specific guidance for Guided Blend, Story Trail, Camp Check, and Memory Meadow.
- Fixed events for first visit, return, first error, repeated difficulty, and success.
- Concise narration by default, with a synced Full narration preference in Settings.
- A visible `Hear Milo` replay control and a named dismiss control.
- Silence during approved sound playback and during active independent or delayed-review answers.
- Learner-and-context-scoped return reminders without changing curriculum progress.
- Bounded actions limited to focusing a hint, replaying approved models, or opening approved practice.

The complete recording script is in `MILO_GUIDANCE_SCRIPT.md`.

## Safety and assessment boundary

Milo is a presentation and navigation layer. He does not:

- decide whether an answer is correct;
- create or rewrite evidence records;
- infer pronunciation accuracy or mastery;
- unlock curriculum content or award rewards;
- expose an answer during an active independent check;
- generate an open-ended conversation with a child.

Application components and the backend remain responsible for scoring, evidence classification, progression, and released media validation. Approved phoneme, blend, and whole-word recordings remain separate from Milo narration.

## Audio behavior

The current prototype can read a fixed Milo line through browser speech synthesis when no matching custom narration recording exists. This fallback:

- respects the learner's sound volume;
- stops when the cue changes, the activity becomes engaged, or the component closes;
- is never used as an approved phonics model;
- does not affect scoring or evidence.

Future custom Milo recordings can replace this fallback by mapping the stable context and event keys in the script inventory.

## Database deployment

Apply `backend/supabase/migrations/202610130004_milo_guidance.sql` after the base learner-settings migration. It adds a constrained `narration_mode` column with `concise` as the default and permits only `concise` or `full`.

## Verification

- Fixed-template and bounded-action unit tests.
- UI source tests for replay, dismiss, speech cancellation, and quiet assessment phases.
- Backend tests for the constrained narration preference.
- Production frontend build and backend type-check/build.
- Desktop and mobile preview inspection, including Milo hiding during model playback.

## Deferred

- Recording and approval of custom Milo narration audio.
- Educator and pupil validation of the wording and timing.
- Realtime generative conversation, autonomous assessment, and AI-authored phonics models are intentionally out of scope.
