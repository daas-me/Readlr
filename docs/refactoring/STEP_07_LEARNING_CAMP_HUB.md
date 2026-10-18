# Step 7: Restricted Learning Camp Hub

Status: **Implemented, unavailable by default**  
Prepared: 2026-10-13  
Pilot scope: first curriculum group only (`ENG-01`: m, a, t)

This checkpoint creates the learner-facing Learning Camp entry and route map. It does not implement the station activities, create evidence, award mastery, or publish the provisional Step 4/5 content.

## Access boundary

Camp appears only when every condition below passes:

1. The frontend deployment sets `VITE_READLR2_CAMP_ENABLED=true`.
2. The backend deployment sets `READLR2_CAMP_ENABLED=true`.
3. The signed-in learner's current database email exactly matches an entry in the private `READLR2_TESTER_EMAIL_ALLOWLIST`.
4. `curriculum_releases` contains the exact configured curriculum/media pair with `status = approved`.

The default immutable release pair is:

- `readlr2-eng01-mat-v1`
- `readlr2-eng01-mat-media-v1`

These are intentionally different from the provisional `draft-1` identifiers. The Step 4/5 drafts must not be inserted as approved releases. Approval requires a new immutable curriculum package, media manifest, hashes, educator sign-off, and the Step 6 migration applied to the target database.

Any missing flag, learner, allowlist match, table, release row, database connection, or approval status returns `{ enabled: false }`. The server does not disclose whether an email is on the tester list.

## Learner experience

Approved testers see a visually distinct Learning Camp entry on the stage page and in learner navigation. The hub presents the full instructional sequence:

1. Sound Grove: encounter and model `m`, `a`, and `t`.
2. Echo Stones: auditory discrimination with voice or tap access.
3. Wordsmith Tent: construct `am` and `at`.
4. Blend Bridge: blend `mat` smoothly.
5. Story Trail: apply the group in an adventure context.
6. Lookout Point: attempt an independent check with helped work kept separate.

Stations currently open an explanatory panel and state that the activity is being prepared. They do not create progress or evidence. Guided blending begins in Step 8 after release approval.

## Deployment order

1. Apply and verify the Step 6 curriculum evidence migration.
2. Complete educator, accessibility, rights, and media review.
3. Produce new immutable approved curriculum and media artifacts; do not rename a changed draft in place.
4. Insert the exact release hashes and approval record into `curriculum_releases`.
5. Configure the private backend tester allowlist and version IDs.
6. Enable the backend flag, then the frontend flag.
7. Test with approved accounts before expanding the allowlist.

Disabling either flag or revoking the release hides Camp without deleting legacy progress, rewards, or evidence.

## Security and privacy

- The tester allowlist exists only in backend environment variables and is never exposed through `VITE_*` values.
- Access uses the authenticated user ID and re-reads the current account email from the database.
- The endpoint is authenticated and learner-only.
- Direct navigation to `/learning-camp` redirects to `/home` unless access is confirmed.
- Existing classroom stage controls do not grant Camp access.
- This checkpoint records no audio, transcript, attempt, or learner progress.
