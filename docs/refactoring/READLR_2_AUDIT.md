# Readlr 2.0: Step 1 Audit and Preservation Plan

Audit date: 2026-10-13. Code baseline: main at bd9294653b7f0359f2771a856eb6c22e4bf2b80e.

Source proposal: Readlr_2.0_Comprehensive_Design_and_Refactoring_Plan.pdf, supplied by the team. This document translates that proposal into reviewable engineering checkpoints; it does not certify curriculum alignment or educational effectiveness.

## Checkpoint boundary

Step 1 is a repository audit, inventory, and preservation plan only. No gameplay, API behavior, live database, accounts, recordings, or saved progress were changed. Stop for team review before Step 2. Completing this audit does NOT mean the critical fixes in the proposal have been implemented.

Evidence is source inspection and local automated checks. Real child speech, live database deployment, classroom behavior, accessibility with assistive technology, and every recording's phonetic quality remain unverified. Tests passing is not evidence of learning improvement.

## Current learning experience

| Surface | Current content | What completion actually establishes | Disposition |
| --- | --- | --- | --- |
| Vowel Dojo and Valley | Five vowel training activities, fifteen trails | Recording and replay completion on the active Stage 1 path; not verified vowel production | Keep art and interaction assets; replace completion/evidence contract |
| Bridge Workshop | Five guided lessons: MA, SE, LI, NO, TU | Guided actions, some exact-choice checks, voice presence and playback | Keep themed practice; modify prerequisites and evidence |
| Bridge crossings | Fifteen crossings with join, missing, echo, switch, repair modes | Same voice-presence limitation; modes do not all test the same skill | Keep locations; separate task evidence from speech evidence |
| Sound Shelf | 21 consonants paired with five vowels, 105 combinations | Exploration/model exposure, not mastery | Keep as practice; teacher-review models and prerequisites |
| CVC Kingdom | 19 word tasks plus three crown subtasks | Puzzle responses and target-word ASR agreement for three-letter words | Keep narrative/art; split guided application from independent checks |
| Crown finale | a, ma, map | a and ma use voice presence; map uses word recognition | Modify; do not claim all three skills were assessed |
| My Practice | Local attempt history, summaries, assessment placeholders | Practice participation; current tracker leaves accuracy unassessed | Preserve honest labels; add versioned synced evidence later |
| Admin overview | Synced lesson counts, access controls, resets | Adventure completion and classroom access, not pronunciation accuracy | Keep; preserve this distinction in new summaries |
| Survey | Assigned feedback, ratings/choices and Excel export | Learner feedback, not measured reading gain | Keep separate from assessment |

Stage 3 word order: sun, map, hen, cup, rug, pot, net, bug, hat, log, bed, pen, pig, tin, bag, gem, fan, lid, top. The gem lesson introduces soft g explicitly, but there is no curriculum prerequisite graph establishing readiness. Stories and models expose targets, including in read-mode tasks; these are not unseen independent reading checks.

Stage 2 crossings shuffle a fixed blend set by learner ID. They do not provide a mastery-dependent curriculum sequence. Existing lesson choices are randomized left/right, so correct-answer placement is not uniformly fixed.

Machine-readable inventories accompany this report. Stage 2 and Stage 3 entries come directly from exported source data. Stage 1 identifiers were manually audited. The audio manifest records physical files, sizes and hashes, not semantic correctness or coverage of every dynamic reference. Regenerate with `node --experimental-strip-types scripts/audit-readlr-content.mjs`.

## Priority issue register

Priorities describe remediation order, not proof that every risk has occurred in production.

| ID | Priority and scope | Finding and source | Required acceptance check |
| --- | --- | --- | --- |
| A01 | P0, exposed legacy endpoint | backend/src/modules/audio/audio.service.ts processAudio returns matched=true, score=95 when no provider exists. No current frontend caller of /audio/process was found. This is distinct from the active CVC endpoint. | No provider, timeout, empty or malformed response can produce successful assessment; remove fabricated scores. |
| A02 | P0, active Stage 1 | GameLevel.tsx startStageOneRecording checks nonempty Blob; playback then triggers success/completion. Silence can still produce a nonempty recording. | Silence, wrong sound, interruption and valid practice have distinct outcomes. Practice may advance only under explicitly labeled practice rules, never verified mastery. |
| A03 | P0, active Stage 2/finale | BridgePractice.tsx uses RMS/voice presence then playback/reward, not target recognition. CvcChallenge.tsx recognizes only word.length===3, excluding a and ma crown subtasks. | Voice presence cannot be presented as correct pronunciation. Preserve engagement rewards while separating evidence. |
| A04 | P1, active CVC | cvcRecognition.ts compares transcription with allowed words and returns pronunciationAccuracy=null. Useful word checking, not a calibrated phonetic score. | Matched, different, uncertain and unavailable remain distinct; never turn transcript match into a pronunciation percentage. |
| A05 | P1, model quality | bridgeCurriculum.ts fallback strings include buh/kuh/tuh; audio helpers can use speech synthesis when recordings fail. Filenames alone do not prove approved phoneme quality. | Isolated sounds use educator-approved models; missing models get a visible recoverable state, not an arbitrary TTS phoneme. |
| A06 | P1, evidence/data | practiceRecords.ts and usePracticeSession.ts write device-local attempts without content version, model exposure, hint history or independent-check provenance. | Authenticated, deduplicated versioned attempts sync safely; guided and independent evidence cannot be confused. |
| A07 | P1, assessment design | CVC stories/models reveal target words; no separate independent/review protocol was found. | Unmodeled independent tasks and delayed review are explicitly tagged; exposure or hints downgrade evidence appropriately. |
| A08 | P1, resilience | CVC unavailable recognition asks for retry; a structured nonvoice route is not part of the assessment flow. | Denied mic, offline/provider outage and unsupported recording lead to accessible nonvoice practice without false speech credit. |
| A09 | P1, upload hardening | Legacy audio.route.ts /process uses memory uploads without the size/type constraints present on /cvc-recognize. | Bound uploads and validate accepted targets server-side; preserve auth/classroom enforcement. |
| A10 | P1, build baseline | Frontend type-check stops on invalid ignoreDeprecations config. Backend type-check passes. | Align compiler/config and rerun full type-check; further errors may be hidden by the initial failure. |
| A11 | P2, legacy logic | GameLevel.tsx includes older browser-ASR/fuzzy matching and confidence/duration tiers outside the active Stage 1 branch; stages 2/3 route to dedicated components in LevelMap.tsx. | Trace reachability before retirement; no heuristic tier becomes validated fluency. |

## Keep, modify, replace, retire

- Keep: Milo visual assets and expressions, stage scenery, castle progression, storybook presentation, shared voice controls, replay watchdog behavior, onboarding guidance, language-selectable survey, admin policy precedence, recovery workflow, settings, earned rewards.
- Modify: existing activities into curriculum-aligned guided applications; shorten repeated narration; tag model/hint exposure; distinguish access grants from learning attainment; add evidence-based Progress views without relabeling old completion as mastery.
- Replace: fabricated success fallback, voice-presence-as-correctness semantics, arbitrary phoneme TTS fallback, and completion-only skill decisions.
- Retire only after reference and behavior checks: obsolete ASR/scoring branches and unused audio API contract. Do not delete audio simply because a newer voice is planned.
- Review before reuse: phoneme/blend recordings, all target word prerequisites, soft-g gem, distractors, language/accent suitability, narrative claims implying correctness. Assign an educator/content reviewer; approval is not supplied by this code audit.

Audio files are preserved byte-for-byte. Default Milo's preferred recording map is currently empty; classic recordings and narration TTS remain fallback paths. Future voice variants need stable semantic IDs, voice variants and approval metadata. Preserve the existing Stage 1 filename aliases rather than bulk-renaming legacy media during this phase.

## Preservation and migration contract

### Existing state to protect

| State | Current location/meaning | Migration rule |
| --- | --- | --- |
| Stage 1 device progress | readlr_progress_user_${userId} | Preserve under legacy journey identity; do not reinterpret counts as skills |
| Stage 2 device progress | readlr_bridge_v2_learner_${learnerId}, normalized journey version 3 | Preserve completed training/crossings and historical adventure status |
| Stage 3 device progress | readlr_cvc_magic_v1_${learnerId} | Preserve completed count and crown jewels |
| Practice attempts | readlr_practice_v1_${studentId} | Import only with owner identity and idempotent attempt ID; retain not_assessed |
| Reset epochs | readlr_reset_epochs_${learnerId}; backend learner_stage_state | Keep stale-client protection; reset must not be undone by later max-merge |
| Reward high-water marks | readlr_earned_progress_${learnerId}; earned_completed and reward records | Retain earned stickers, points and frames after learning resets |
| Server progress | progress and reading-journey migrations/controllers | Back up actual deployed schema/data before migration; schema presence in repo does not prove deployment |
| Controls/accounts | Classroom policies, grants, overrides, settings, recovery, survey records | Preserve permissions and assignment precedence; no implicit new-stage access |

Relevant code: frontend/src/app/components/journeySync.ts, frontend/src/app/hooks/useJourneySync.ts, frontend/src/app/components/progressReset.ts; backend/src/modules/progress and backend/supabase/migrations. User IDs and learner/profile IDs are not interchangeable. Preserve authenticated ownership on every import/sync.

Current sync merges completion monotonically, with reset epochs. That merge must NOT combine an old curriculum count with a new curriculum count. Introduce an explicit content/curriculum version boundary before any remapping. Old completion remains legacy adventure history; new skills start Not assessed unless valid evidence exists. Manual unlocks remain access only.

### Before any data-changing release

1. Create a dedicated implementation branch from the reviewed baseline. Export a recoverable database backup using the project's approved access; do not commit credentials, child records or backups to Git. No database backup was created during this audit.
2. Capture representative synthetic fixtures: new learner, partially complete each stage, completed learner, earned rewards after reset, individual override, pending survey, stale offline client, and legacy local-only progress.
3. Add versioned tables/fields additively. Keep old readers functional while the feature is off. Separate practice, independent evidence, adventure completion and reward entitlement.
4. Dry-run import on staging; compare counts, ownership, reset epochs and rewards before/after. Repeat import and offline replay to prove idempotence. Reject malformed/unknown versions.
5. Roll out the m-a-t slice behind a default-off feature flag for designated testers. Do not globally replace the existing journeys.
6. Roll back by disabling the new experience while retaining new evidence for recovery. Do not restore an old database snapshot over newer learner work; use a reviewed recovery procedure if data was damaged.

## Review-gated implementation queue

Each row is a separate checkpoint, not permission to implement all rows now.

| Step | Deliverable | Review gate |
| --- | --- | --- |
| 1 | This audit, content/media inventory and preservation plan | Team confirms risks, scope and retained data |
| 2 | Honest speech outcomes and removal of fabricated success | Silence/wrong/unavailable cannot count as assessed success; existing practice/rewards remain understandable |
| 3 | Nonvoice fallback and retry recovery | Mic-denied/offline learner can continue appropriate practice with no speech mastery credit |
| 4 | Educator-reviewed curriculum and m-a-t specification | Verify original curriculum sources, phonemes, dialect, prerequisites, words and acceptance rubric |
| 5 | Versioned content and approved-model manifest | Stable IDs, missing-media behavior, teacher approval and legacy media preserved |
| 6 | Attempt/evidence foundation | Ownership, deduplication, sync, hints/model exposure and migration tests |
| 7 | Camp hub pilot | Accessible navigation and readiness for one group only |
| 8 | Guided blending pilot | Model, blend and supported response flow reviewed |
| 9 | Adventure application | Reuse a themed challenge with correct curriculum targets |
| 10 | Independent checks and remediation | Unassessed/assisted/independent evidence, no repeated-model shortcut |
| 11 | Progress integration | Date-based evidence with denominators and Not assessed where needed |
| 12 | Delayed review | Separate retention evidence from immediate practice |
| 13 | Expand approved groups one at a time | Each group passes content and usability review |
| 14 | Milo guidance improvements | Concise accessible guidance; AI cannot invent assessment or approved sound models |
| 15 | Optional Discovery mode | Practice variety without punishing missed days or inflating mastery |
| 16 | Offline packs | Versioning, consent, secure sync and missing-media recovery |

Privacy, child voice minimization, accessibility and failure handling apply throughout, not only at Step 16. No new AI provider or automatic recording retention is authorized by this audit.

## Verification baseline

- Frontend tests: 121 passed, 0 failed.
- Backend tests: 19 passed, 0 failed.
- Backend type-check: passed.
- Frontend type-check: blocked at TS5103, invalid ignoreDeprecations value; no config change made.
- Frontend production build: passed; Vite warns of a JavaScript chunk above 500 kB (910.55 kB minified). This is a performance review item, not a failed build.
- Inventory generation: passed; 388 physical audio files hashed. No audio content was modified.
- Automated tests include source-contract assertions as well as behavior tests. They do not replace live microphone, provider, database, browser, educator or learner validation.

## Step 2 implementation result

Completed 2026-10-13 after team approval.

- Removed the exposed legacy endpoint's fabricated 95% match. A missing provider now returns HTTP 503 with `status: unavailable`, `assessmentSource: not_assessed`, and `pronunciationAccuracy: null`.
- Provider-backed legacy results now use exact normalized transcription agreement. Substrings and extra words do not pass. The response reports matched, different, or uncertain, keeps `pronunciationAccuracy` null, and no longer calls transcription agreement correct pronunciation.
- Added an energy gate to active Stage 1 recording. Empty, quiet, or very short noise is saved as silence and does not complete the guided activity.
- Stage 1 and Stage 2 now tell the learner that the activity was guided practice and pronunciation was not scored. Their existing progress and rewards remain intact.
- Stage 3 retains its existing matched/different/uncertain/unavailable word-recognition contract. It remains a word transcription check, not a phoneme-level pronunciation score.

Verification after Step 2: 124 frontend tests and 22 backend tests pass; frontend production build and backend type-check pass. Frontend application/test type-check remains blocked by the pre-existing `ignoreDeprecations` configuration error recorded as A10.

## Step 3 implementation result

Completed 2026-10-13 after team approval.

- Stage 1, Stage 2, and Stage 3 now expose a consistent `Practice without microphone` recovery action after recording failure, denied/unsupported microphone access, silence, or unavailable Stage 3 word checking.
- The recovery is a practice path, not a skip. Milo models the target, the learner is prompted to say it aloud, and existing letter/puzzle work remains required before the voice step.
- Nonvoice attempts use the explicit `nonvoice_practice` outcome with `assessmentSource: not_assessed` and no accuracy, fluency tier, self-correction star, or speech-match claim.
- Adventure progress and previously defined rewards can continue so a device/provider failure does not trap the learner. This does not grant speech mastery.
- My Practice identifies these attempts as `without mic`; Stage 3 provider-unavailable recordings retain their unavailable recognition event and add the nonvoice completion attempt.
- Voice replay is offered only when a recording exists. The fallback has a full-width secondary control row on desktop and mobile.
- Help now explains the no-microphone route and its evidence limits.

Verification after Step 3: 128 frontend tests and 22 backend tests pass; frontend production build and backend type-check pass. The existing frontend TypeScript configuration/baseline errors remain outside this checkpoint.

## Recommended next checkpoint

Proceed to Step 5 only after reviewing the provisional Step 4 package: versioned content and an approved-model media manifest. Step 5 may reference the stable draft IDs, but it must not publish the m-a-t journey while educator sign-off remains pending.

## Step 4 preparation result

Completed 2026-10-13 after team approval to proceed.

- Verified against DepEd Memorandum No. 064, s. 2025 that the English ARAL-Reading Key Stage 1 introductory sequence begins with readiness work followed by `m, a, t`. The remaining published groups match the source proposal's sequence.
- Verified that the MATATAG Reading and Literacy Grade 1 guide supports letter-sound production, letter identification, sound isolation, sound substitution, and sounding out words. Its first-language context is retained; Readlr does not relabel those competencies as English standards.
- Added `STEP_04_MAT_CURRICULUM_SPEC.md`, covering readiness, provisional sound targets, `am`/`at`/`mat`, prerequisites, a twelve-activity vertical slice, evidence ceilings, remediation, nonvoice access, versioning, and migration boundaries.
- Added `mat-curriculum-review.json` with stable provisional content, skill, activity, and publication-gate IDs for the next engineering checkpoints.
- Kept the curriculum status `provisional` and runtime availability off. The English variety, phoneme models, word bank, audio, images, independent item rules, thresholds, accessibility review, and pilot protocol still require educator sign-off.
- Made no gameplay, database, access, progress, or reward changes. Legacy completion remains adventure history and is not converted into curriculum evidence.

Step 4 is complete as a review package, but its educational release gate is not passed until the sign-off record is completed.

## Step 5 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added `STEP_05_VERSIONED_MEDIA_SPEC.md` to separate curriculum versions, stable asset IDs, physical file revisions, and human approval records.
- Added `mat-media-manifest.json` with all 19 required m-a-t instructional audio and visual roles. It is provisional, unavailable at runtime, and blocked by default.
- Bound the existing Stage 1 `A.wav` only as an unreviewed short-a candidate with its exact bytes, SHA-256, WAV properties, and pending rights state.
- Explicitly preserved legacy `PronounceMA.wav` and `PronounceTA.wav` without binding them to `am`, `at`, `mat`, or isolated consonants.
- Recorded all absent phoneme, blend, word, mouth-cue, letter-card, and meaning-image candidates rather than silently using TTS or unrelated media.
- Added `scripts/validate-readlr-media.mjs` to validate curriculum linkage, unique requirements, file containment, existence, hashes, approval metadata, rights status, and release-state consistency.
- Defined fail-closed behavior: missing, changed, or unapproved instructional media blocks only dependent activities and creates no learner error or evidence.
- Made no current gameplay, database, progress, reward, or legacy audio-routing changes.

Step 5 is complete as the versioning and validation foundation. Its media release gate remains blocked until candidates are produced and approved by the educator.

## Recommended next checkpoint after Step 5

Proceed to Step 7 only after reviewing the Step 6 foundation: create the restricted Learning Camp hub for one curriculum group behind a default-off tester flag. It must remain unavailable while curriculum/media approval is blocked.

## Step 6 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added an additive `curriculum_releases` allowlist and append-only `curriculum_attempts` migration. No provisional release is seeded and no legacy data is migrated.
- Added authenticated learner-only evidence sync/list routes. Learner ownership comes from the token and profile; client learner/user identifiers, raw audio, transcripts, and client mastery classes are rejected.
- Added immutable client attempt/session UUIDs and normalized payload hashes. Exact replay is idempotent; changed data under the same attempt ID conflicts instead of overwriting.
- Stored curriculum/media versions, activity/skill/content IDs, response context, hints, model/answer exposure, reduced choices, media IDs, timestamps, result, and offline state.
- Added server-derived `not_assessed`, `practiced`, `completed_with_help`, and `independent_candidate` attempt classes. No attempt directly grants mastery.
- Added a learner-scoped frontend queue and dormant retry hook. Failed/offline sync preserves exact records and only acknowledged IDs are removed.
- Added release gating so missing, revoked, invented, and provisional curriculum/media pairs cannot collect evidence.
- Added focused backend and frontend tests. Full suites pass with 27 backend and 134 frontend tests; backend type-check passes. The existing frontend `ignoreDeprecations` configuration still blocks its test type-check.
- Did not apply or inspect the deployed Supabase migration. Did not connect current or provisional learner activities to this evidence stream.

Step 6 is complete as an engineering foundation. Deployment of its migration and any curriculum release row remain separately controlled operations.

## Step 7 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added a learner-facing Learning Camp hub for the first `m-a-t` group, with six visually and instructionally distinct stations spanning sound discovery, discrimination, word construction, blending, story application, and independent checking.
- Added a default-off frontend flag, a default-off backend flag, an exact private tester email allowlist, and an exact approved curriculum/media release check. Every gate must pass before Camp appears.
- Re-read the learner's current database email instead of trusting a client identifier. The authenticated endpoint remains learner-only and returns a generic disabled response when any condition fails.
- Added guarded `/learning-camp` routing, a conditional learner navigation item, and a conditional Camp entry on the stage page. Direct unauthorized navigation returns to the stage page.
- Kept classroom stage access separate from the pilot gate; an administrator cannot expose unapproved Camp content through normal stage controls.
- Kept all six station activities in preparation state. This checkpoint creates no attempt evidence, progress, reward, mastery, audio, or transcript data.
- Documented the controlled deployment order and immutable post-approval version IDs. Provisional `draft-1` content remains ineligible for release.

Step 7 is complete as a restricted hub pilot. Guided station gameplay begins in Step 8 only after the educator and media release gates are passed.

## Step 8 implementation result

Completed 2026-10-13 after team approval to proceed.

- Implemented the ordered guided blending route `am`, `at`, then `mat` inside the Wordsmith Tent.
- Required separate segmented, continuous, and whole-word models for every target. `mat` also requires its approved meaning image.
- Added tap, keyboard, and assistive-technology-compatible letter construction. Incorrect choices produce a focused next-letter hint; resetting the row is recorded as help.
- Scoped runtime files to the exact released media manifest version and validated status plus audio/image content types before opening each lesson. Missing or invalid media fails closed without TTS or legacy-audio substitution.
- Added immutable guided construction attempts using the Step 6 queue. Records disclose model exposure, answer exposure, hints, media IDs, and versions, so the server can only classify them as completed with help.
- Kept `mat` evidence pending until the required meaning image loads. No activity writes raw audio, transcripts, pronunciation scores, mastery, legacy stage progress, or rewards.
- Added focused curriculum, ordering, evidence, immutable-path, and media-failure tests.

Step 8 is complete as a gated guided-blending vertical slice. It remains unavailable in ordinary accounts until the Step 7 release controls and approved media deployment are complete.

## Step 9 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added `ENG01-MAT-A01`, a picture-to-word Story Trail adventure where ordered `m-a-t` tiles visibly restore a three-plank bridge.
- Added focused correction after an incorrect choice. Help use is disclosed through hint and answer-exposure metadata.
- Kept adventure completion separate from mastery, rewards, and legacy stage progress. The server classifies adventure attempts as completed with help even on a correct first try.
- Required the exact approved `mat` meaning image and immutable media-manifest path. Missing or invalid image content fails closed.
- Added a development-only Learning Camp preview with simulated media and conspicuous warnings. It reads no account state and writes no progress or evidence.
- Preserved the production tester, feature-flag, curriculum-release, and media-approval gates.

Step 9 is complete as a gated application challenge. Independent checks and remediation begin in Step 10.

## Step 10 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added Lookout Point independent checks for shuffled `m`, short-`a`, and `t` sound-to-letter responses plus a separately recorded dictated `mat` construction.
- Limited every assessment stimulus to one play, hid picture and printed-word cues during construction, and stored every item separately with exact media and assistance conditions.
- Kept the spoken reading moment unscored. Microphone presence, self-report, and ordinary ASR do not become decoding evidence.
- Stored the current reduced-choice meaning confirmation separately and capped it at completed with help rather than vocabulary mastery.
- Ended assessment before revealing an incorrect answer, preserved the original result, and routed learners to focused sound, blending, or meaning remediation.
- Added the Lookout Point flow to the development-only preview with simulated media and no account or evidence writes.

Step 10 is complete as an honest independent-check and remediation vertical slice. Evidence aggregation and progress presentation begin in Step 11.

## Step 11 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added a separate Camp skills view to Progress so curriculum evidence does not inflate or replace the existing three-stage completion percentage.
- Added learner-visible `Not assessed`, `Practiced`, `Completed with help`, and `Independent check recorded` states for the first eight `m-a-t` group skills.
- Added a service-role-only, learner-scoped evidence summary function. It aggregates the server-derived evidence classes and latest result without accepting ownership or mastery claims from the browser.
- Kept independent evidence explicitly provisional. It is reported as a recorded check for later review, never as automatic mastery or educator verification.
- Added latest-needs-practice and offline-pending indicators while keeping rewards, time, microphone availability, and speech recognition separate from curriculum evidence.
- Added a simulated Progress scene to the development preview. It reads no account data and writes no evidence.
- Added focused parser, summary, security-boundary, and cautious-label tests.

Step 11 is complete as a learner-facing evidence view. Live data requires deployment of both curriculum evidence migrations; educator-facing cohort analytics and approval rules remain future work.

## Step 12 implementation result

Completed 2026-10-13 after team approval to proceed.

- Added Memory Meadow as a seventh Learning Camp station for later-session `m-a-t` retention evidence.
- Added a server-owned review schedule that requires a complete four-skill independent-check session. Partial sessions never open or reschedule review.
- Added pilot one-day and three-day intervals, explicitly labeled as product hypotheses rather than curriculum or mastery rules.
- Added three shuffled sound-letter items and one uncued dictated `mat` construction in a visually different review context. Approved assessment audio is reused; picture and answer cues remain hidden.
- Stored each answer with activity `ENG01-MAT-R01` and mode `delayed_review`. Incorrect answers remain immutable when the learner enters focused practice afterward.
- Separated delayed-review counts and latest results from immediate independent checks in Progress.
- Added a development-only Memory Meadow preview that writes no learner evidence.
- Added focused scheduling, parsing, evidence-mode, media-boundary, and no-mastery tests.

Step 12 is complete as the delayed-review vertical slice. Its schedule and task conditions still require educator and pupil validation before any effectiveness or mastery claim.

## Step 13 implementation result

Completed on 2026-10-13 as a review package after team approval to proceed.

- Expanded exactly one next curriculum group: `ENG-02` with new graphemes `e, s, i, l` and cumulative access to `m, a, t`.
- Added a versioned provisional curriculum package with prerequisites, stable content and skill IDs, candidate cumulative words, activity modes, evidence ceilings, remediation boundaries, and eight explicit publication gates.
- Added a separate provisional media manifest with 25 required phoneme, mouth-cue, letter-card, blend, whole-word, and meaning-image candidates. All missing assets are explicit; instructional TTS and unapproved legacy substitution remain blocked.
- Added Firefly Forest to the development preview as a distinct seven-stop route covering discovery, sound contrast, cumulative construction, phoneme substitution, connected text, independent checking, and delayed review.
- Extended media validation to check ENG-01 and ENG-02 together while preserving independent immutable versions.
- Kept production access fail-closed. The live Learning Camp contract still exposes only `ENG-01`, and draft ENG-02 interactions write no learner evidence.

Step 13 is complete as controlled engineering expansion. It is not an educational release: the proposed language model, words, media, assessment items, accessibility, and pupil usability still require review. Do not generate ENG-03 until ENG-02 is reviewed.

## Step 14 implementation result

Completed on 2026-10-13 after team approval to proceed.

- Added context-aware Milo guidance to guided blending, story application, independent checks, and delayed review.
- Replaced repeated generic narration with fixed first-visit, short return, first-error, repeated-error, and success lines. Concise guidance is the default; full guidance remains an explicit learner setting.
- Added visible replay and dismiss controls. Milo becomes silent and leaves the activity surface while a learner is listening to an approved model or completing an active independent answer.
- Restricted Milo to deterministic, reviewable templates and four bounded outcomes: no action, focus a hint, replay approved sound models, or route to approved practice.
- Kept curriculum and assessment authority outside Milo. Guidance cannot score speech, edit attempt evidence, change progress, award rewards or mastery, reveal an answer during an independent item, or start an open-ended conversation.
- Added a recording-ready narration inventory and a constrained database preference for `concise` or `full` narration.
- Added focused behavior, integration, and settings tests plus desktop and mobile visual checks in the development-only Learning Camp preview.

Step 14 is complete as a bounded guidance layer. The current browser speech fallback is not an approved phonics model; future Milo recordings may replace it without changing curriculum evidence or assessment behavior.

## Step 15 implementation result

Completed on 2026-10-13 as a controlled prototype after team approval to continue.

- Added a development-preview Discovery Realm with five distinct continuing experiences: Storybook Library, Puzzle Workshop, Reading Garden, Adventure Trails, and Review Quests.
- Added a real three-page book interaction, a constrained word-change puzzle, an optional garden decoration activity, and a clue-reading trail using only the provisional `m-a-t` set.
- Kept Review Quests visibly dependent on a later approved review pack rather than inventing unseen assessment content.
- Added no daily streak, absence penalty, expiring reward, forced return, or screen-time incentive. The garden explicitly preserves progress after a break.
- Kept every Discovery interaction outside curriculum evidence, mastery, legacy stage progress, and rewards.
- Added responsive desktop and mobile presentation plus deterministic content-boundary tests.

Step 15 is complete as a reviewable design and interaction prototype. It is not exposed in ordinary learner accounts: stories, questions, graduate eligibility, collection persistence, and additional word groups still require educator and product approval.

## Step 16 implementation result

Completed on 2026-10-13 after team approval to continue.

- Added an explicit opt-in offline-pack control to Learning Camp with clear downloaded, installing, unavailable, and removable states.
- Built every pack from immutable media-manifest URLs and deduplicated the approved Camp audio and image list.
- Added same-origin, content-type, per-file, and total-size validation before a pack can be marked ready. A failed replacement leaves the existing pack untouched.
- Added a scoped service worker that caches the app shell and versioned `/media/readlr2/` files only. API responses, authentication, learner profiles, raw voice, and recordings are never placed in the offline cache.
- Preserved the existing learner-scoped, idempotent evidence queue and reconnect synchronization. Offline attempts retain their captured-offline flag and stable client attempt IDs.
- Added explicit pack removal without deleting progress, evidence, rewards, or account data.
- Added the Learning Camp preview as a second Vite build entry, preventing preview-only modules from bypassing production bundling checks.

Step 16 is complete as offline-pack and recovery infrastructure. Current provisional media manifests remain correctly blocked; a real pack becomes downloadable only after its exact media release is approved and deployed. Full school-device and network-interruption testing remains required before operational release.
