# Step 11: Progress Integration

Completed on 2026-10-13.

## Scope

Step 11 connects the first Learning Camp curriculum group to learner progress without changing the existing three-stage completion model. It adds a separate Camp skills view because curriculum evidence, adventure completion, rewards, and personal practice answer different questions.

## Evidence presentation

The learner can see each approved skill as one of four evidence states:

- Not assessed
- Practiced
- Completed with help
- Independent check recorded

`Independent check recorded` is intentionally not called mastery. It identifies evidence that was captured without disclosed help and remains available for later educator review or an approved mastery rule.

The view also reports the latest check that needs practice and any offline activities waiting to sync. It never turns coins, time, stickers, microphone access, or speech-recognition availability into skill evidence.

## Data boundary

- The backend resolves the learner from the authenticated account.
- A service-role-only database function aggregates server-derived evidence classes per curriculum version and skill.
- The browser validates the response and only displays known evidence states.
- The legacy 60-lesson completion percentage and rewards remain unchanged.
- Raw audio, transcripts, pronunciation percentages, and client-authored mastery labels are not returned or stored by this feature.

## Preview and deployment

The development preview includes a simulated `Progress: Camp skills` scene. It does not read an account or save evidence.

Live summaries require both curriculum evidence migrations to be applied. The approved curriculum/media release and pilot access gates still control whether production activities can create evidence.

## Verification

Focused tests cover response validation, database bigint normalization, status separation, learner scoping, and the absence of automatic mastery wording.
