# ARAL expansion: rollout verification

Audit date: 14 October 2026. Status: NOT approved for whole-class production rollout.

## What is implemented

| Requirement | Current implementation | Boundary |
| --- | --- | --- |
| Reusable Learning Camp | Consonant, short-vowel, long-vowel and blending practice collections | Expanded blending demonstrations still need reviewed segmented audio |
| Sound-word-picture learning | 31 cards including m/mango; original/reused Readlr illustrations | Whole-word TTS fallback is not an approved isolated-sound model |
| Progressively harder words | Ten chapters from am/at/mat to CVC, CVCe and ee | Long vowels are a Readlr extension; not every workbook outcome is covered |
| Varied games | Build, missing letter, sound substitution, listening, sentence completion, read aloud | No full passage comprehension or complete Filipino Marungko track yet |
| Randomized checks | Server-issued distinct words within taught chapter banks | Gate has only 3 words; tower checks all 5 vowel anchors; no claim of psychometric equivalence |
| Speech assessment | Exact recognized-word match with uncertainty checks | Not pronunciation percentage, official CRLA profile, or proof of reading improvement |
| Durable progress | Server-issued sessions, atomic outcomes and evidence, cloud chapter restoration | Needs the migration below and real multi-device testing |
| Classroom controls | Separate chapter grants; Stage 3 restrictions; reset epochs | Camp nonvoice practice remains reusable; old and new completion totals stay separate |
| Main application | Approved cohort's Stage 3 card opens the expansion; Camp stays reachable | Disabled/unreleased accounts keep the existing journey |
| Design consistency | Existing fonts, tokens, Milo, audio preferences and microphone hook | Detailed castle environments and larger story experiences are still future work |

## Verified configuration blockers

The read-only `npm run rollout:check` against the configured Supabase project found:

- Existing `learner_stage_state` and `classroom_control` tables are reachable.
- Curriculum release/evidence tables and `reading_checkpoints` are not available.
- No approved expanded curriculum/media release could be verified.
- Backend Camp enable flag is off, pilot allowlist is empty, and expanded version IDs are not selected.
- A speech-provider key is configured. Its validity, quota, and child-speech performance were not tested.

No database records, learner progress, credentials or rollout flags were changed by this check. The tool prints no credentials or learner details.

## Database installation

Back up the project and apply the pending files through the normal Supabase migration process, in this order. Do not rerun unrelated legacy seed scripts.

1. `backend/supabase/migrations/202610130001_curriculum_evidence.sql`
2. `backend/supabase/migrations/202610130002_curriculum_evidence_summary.sql`
3. `backend/supabase/migrations/202610130003_curriculum_delayed_review.sql`
4. `backend/supabase/migrations/202610130004_milo_guidance.sql`
5. `backend/supabase/migrations/202610140001_reading_checkpoints.sql`
6. `backend/supabase/migrations/202610170001_book_one_meaning_checkpoint.sql`

The fifth migration requires the existing progress reset migration. It creates `reading_checkpoints`, `start_reading_checkpoint`, `record_reading_checkpoint`, and `reading_checkpoint_overview`. The sixth migration makes Book 1 completion require the three server-checked spoken words plus the independent `mat` meaning response. Tables and functions are service-role-only. Neither authenticated browser clients nor anonymous clients receive direct access.

The API checks learner ownership, release eligibility, classroom access and chapter prerequisites. Transactions lock the Stage 3 epoch so a reset cannot revive old completion. Recognition outcomes and the corresponding evidence are stored together. No checkpoint audio is retained in these tables; recordings are processed by the configured speech provider under the application's consent/privacy arrangements.

## Content release

Do not insert a fabricated educator approval just to reveal the feature. The release registry requires the actual reviewer, review reference/date, curriculum SHA-256 and media manifest SHA-256.

Current code identifiers:

```text
readlr-aral-english-1
readlr-existing-models-tts-1
```

Before approval: review the exact word bank, pictures, articulatory cues, recordings/fallbacks, long-vowel instruction, and provisional 80% progression rule with the participating Grade 1 teacher. Build the reviewed media manifest and record its true digest. Any material curriculum/media changes require matching new version IDs, not silently reusing an approved version.

The supplied Grade 1 CRLA guidance concerns mother tongue/Filipino. This English expansion is supplemental practice, not the official CRLA test. A Filipino Marungko course needs its own inventory, recordings and review.

## Deployment configuration

Set private backend values in the hosting provider's environment settings, not a committed `.env`:

```dotenv
READLR2_CAMP_ENABLED=true
READLR2_TESTER_EMAIL_ALLOWLIST=<approved pilot learner emails, comma-separated>
READLR2_CAMP_CURRICULUM_VERSION=readlr-aral-english-1
READLR2_CAMP_MEDIA_VERSION=readlr-existing-models-tts-1
```

Keep the existing private Supabase service key, JWT secret and speech-provider key on the backend. Configure `CORS_ORIGIN` for the actual frontend origin. Deploy the frontend over HTTPS so microphone permissions work outside localhost.

Frontend build environment:

```dotenv
VITE_READLR2_CAMP_ENABLED=true
VITE_API_URL=https://<your-backend-host>/api
```

Rebuild/redeploy the frontend after changing VITE values and restart/redeploy the backend after changing its values. Do not put private keys or the learner allowlist in VITE variables.

Run `npm run rollout:check --workspace=backend`. It is a schema/configuration check, not proof that the teaching content or speech model is valid.

## Required pilot smoke tests

Use designated test accounts, not real student progress:

1. An approved learner sees Camp and the expanded Stage 3 card. A non-allowlisted account still sees the legacy flow.
2. Complete a checkpoint with a real microphone. Refresh and sign in on a second device; chapter completion and any unfinished round must restore.
3. Replay a saved response request: no duplicate evidence and no changed terminal outcome. Learner B cannot load or submit learner A's checkpoint ID.
4. Deny mic permission, record silence, interrupt a request, and simulate a speech-service failure. None counts as an incorrect pronunciation or grants completion. Retry/back remain usable.
5. Restrict Stage 3, pause the class, and revoke a chapter override. New checkpoint requests must be rejected. Test both class defaults and student overrides.
6. Reset Stage 3 for a test learner while another device has an open round. The old round cannot restore progress; existing stickers/frames/history remain.
7. Check learner Progress and admin overview. Expanded chapter totals remain separate from the legacy 20-level totals; speech is labeled word recognition.
8. Test keyboard focus, small phones, recordings/replay, and classroom devices over the real HTTPS deployment. Test custom audio and the intended fallback voices.
9. Have an educator label consented child recordings. Measure false accepts/rejects, uncertainty, noise and accent effects before using automatic outcomes for advancement at class scale.

The checkpoint SQL transactions and real cross-device/reset flows have not yet been exercised against an installed schema. They remain deployment acceptance checks, not claimed passes.

## Rollback

Set `READLR2_CAMP_ENABLED=false` and restart the backend to stop new expanded sessions. Disable the frontend flag on the next build if required. Keep the additive evidence/checkpoint tables and legacy reward data; do not delete learner history as a rollback step.

## Local verification completed

- Frontend strict TypeScript check and production build pass.
- Backend TypeScript check and production build pass.
- 184 frontend tests and 37 backend tests pass.
- Desktop preview: sound-substitution playback enables answers and the correct choice completes the item.
- 390px mobile preview: no horizontal page or challenge-panel overflow; content scrolls inside its allotted area.
- Frontend build still reports a large-bundle advisory. That is a performance warning, not a compilation failure.
- No real child recording, production microphone session, live migration, or cross-device SQL transaction test was performed.

## Remaining instructional scope

The current build does not fully implement every requirement of the supplied workbook. Still required before describing Readlr as a complete ARAL/Marungko program: a reviewed Filipino track, reviewed isolated/segmented sound recordings, richer continuous-blending demonstrations, full passage/story work, expanded adaptive delayed review, and evaluation of actual learning gains. These should be delivered as reviewed increments rather than represented as finished by a successful build.
