# ARAL-informed English expansion

Implementation and research record, 14 October 2026.

## Sources and language boundaries

The supplied `[FINAL - RTP] KS1 English Learner's Workbook.pdf` has 29 PDF pages and 46 learning activity sheets (LAS). Printed page numbering differs from PDF page numbering. The app's chapter `source` values use printed pages. Activities and illustrations are original Readlr designs informed by the skills in the workbook; workbook pages and its illustrations are not redistributed.

The supplied `[FINAL] Assessment Manual_User Guide_v1.pdf`, PDF page 4 / printed page 3, specifies Grade 1 CRLA in the appropriate mother tongue or Filipino. English CRLA is listed with Grade 3. Therefore this expansion is supplementary English practice. It does not administer CRLA, assign official CRLA reading profiles, submit results to DepEd, or claim that English word checks replace Grade 1's prescribed assessment.

Official supporting references consulted:

- DepEd Memorandum 064, s. 2025, ARAL Reading implementation: https://www.deped.gov.ph/wp-content/uploads/DM_s2025_064r.pdf
- DepEd Dipolog resource directory, separate English/Filipino KS1 workbooks, Marungko materials, sound boxes, picture cards and games: https://sites.google.com/deped.gov.ph/sdodipologlrms/aral-reading
- DepEd Learning Resource Portal, ARAL Summer KS1 reading home material, Grades 1-3: https://lrmds.deped.gov.ph/detail/26380
- DepEd Caraga, systematic English phonics and Filipino Marungko packages: https://caraga.deped.gov.ph/publications/issuances/rm-no-0294-s-2025-online-orientation-on-reading-packages-lets-read-systematic-phonics-and-magbasa-tayo-marungko-approach

Marungko informs the use of meaningful sound anchors and gradual blending. The English workbook supplies this implementation's English sequence. A separate Filipino/Marungko inventory and language-appropriate recordings are still needed before claiming a Filipino Marungko course. Do not apply English short/long-vowel terminology to Filipino vowels. Consonants use articulatory cues (including continuous and stop sounds), not a false universal short/long classification.

## Implemented

- A reusable Camp with 21 consonant/grapheme anchors, five short-vowel anchors and five long-vowel anchors. Example: m, mango, an original mango illustration, the existing sound model, and word audio.
- Nine practice collections and a ten-chapter kingdom, with separate practice and checkpoint actions.
- Six task types: letter construction, missing-letter repair, one-letter sound substitution, listening choice, short sentence completion, and recorded word reading.
- Shuffled words, tile order, and response choices. Checkpoints sample distinct words inside the chapter bank; they do not sample unknown words from future chapters.
- Long-vowel checkpoint covers a, e, i, o, u. Long vowels are a clearly labeled Readlr extension, not claimed to be the central content of the supplied early-CVC workbook.
- Bounded backend speech targets for every campaign word, exact normalized word comparison, existing transcription quality gates, recording replay and a finite request timeout.
- Word evidence includes activity, word, mode, help/model exposure, outcome and timestamp. Speech predictions are distinguished from selection/construction.
- Existing fonts, palette tokens, Milo, audio preference/fallback, and microphone capture hook reused. No global theme change.
- Existing legacy stages, progress and rewards retained.

## Curriculum mapping

| Chapter | Focus | Reference |
| --- | --- | --- |
| First Gate | m/a/t; am, at, mat | LAS 1-4, pp. 3-4 |
| Lantern Lane | short a/e/i and cumulative words | LAS 5-8, pp. 5-6 |
| Word Market | CVC building, listening, word meaning | LAS 9-14, pp. 7-9 |
| Secret Garden | additional CVC words including short o | LAS 11-18, pp. 8-11 |
| Castle Drawbridge | short u and CVC words | LAS 19-24, pp. 12-14 |
| Hall of Changing Words | sound replacement practice | LAS 25-28, pp. 15-16 |
| Key Keeper | w/k and cumulative decoding | LAS 29-32, pp. 17-18 |
| Royal Library | further consonants; words in meaning contexts | LAS 33-40, pp. 19-22 |
| Vowel Tower | CVC/CVCe contrasts and ee | LAS 43-46 later word/sentence work; Readlr expands the vowel inventory |
| Crown Chamber | cumulative word checkpoint | Original Readlr review |

These are skill correspondences, not an assertion that each example appears verbatim in the workbook. Workbook tracing, handwriting, partner activities, full passages and all LAS 41-46 outcomes are not implemented by these games.

### Recheck after the chronicle redesign

The supplied workbook was re-read directly. LAS 44 includes long-a phrases (for example, cane and cake). The earlier description of all long-vowel teaching as outside this workbook was too broad. The Vowel Tower's five-vowel contrast bank and ee examples remain Readlr additions, not a verbatim prescribed lesson or complete coverage of LAS 43-46. Book IDs, checkpoint banks and saved progress were not reordered by this visual update.

The order remains beginning sound recognition/blending, cumulative CVC, short o/u, sound substitution, additional consonants, meaning in context, later vowel contrasts, then cumulative review. The ten-book packaging is Readlr's adaptation, not an official DepEd ten-stage curriculum. Missing full sentence construction, passage comprehension and workbook production tasks must not be described as implemented. See DepEd Memorandum 064 s. 2025 for the phonics-based KS1 framework: https://www.deped.gov.ph/wp-content/uploads/DM_s2025_064r.pdf.

## Assessment behavior

The checkpoint hides audio models and pictures. Reliable transcription matches count as recognized words. A reliable different word records `incorrect`; uncertain transcription, service errors and skipped responses are unassessed. Retries during practice are marked as helped. Checkpoint technical retries remain unassessed until a readable recording exists. No numerical pronunciation, fluency, comprehension gain, or official reading-level score is manufactured.

Chapter advancement currently requires at least 80% recognized words and no skipped words in a completed checkpoint. This is a provisional game progression rule, not a validated mastery threshold. The first chapter has three available words and therefore requires three matches. An educator should review this rule against observed child speech and recognition errors.

## Release and persistence

Curriculum ID: `readlr-aral-english-1`.
Media ID: `readlr-existing-models-tts-1`.

The local `learning-camp-preview.html` opens this expansion without changing any account. All chapters are explorable there; real voice checking is deliberately not simulated as success.

The main app now also has `/review`, which opens Camp and all Kingdom chapters for design review. In a local development build, signed-in learners see Camp and Kingdom as primary destinations on the Stages page; the earlier vowel and blending adventures remain available below. The new first chapter teaches its own starting sounds, so those earlier stages are not prerequisites for beginning the expanded Kingdom. Classroom stage restrictions still take precedence. The illustrated ten-location Kingdom map highlights restored locations, advances a visible road, and restores crown lights at chapters 3, 6 and 10. Practice rounds shuffle both words and game types. A checkpoint that needs another attempt offers direct practice for that chapter. These are visual game milestones, not new inventory rewards or proof of mastery.

When the local development database lacks the new checkpoint release, the new Kingdom uses device-only chapter progress so the journey remains testable. It displays a device-progress notice and does not queue curriculum evidence. Clearing this browser's storage removes that temporary progress. This fallback is not used by production builds or counted in the administrator's cloud reports.

In production, the account Learning Camp route and expanded Stage 3 entry still require an approved curriculum version equal to the ID above. The previous pilot remains on its existing version. Existing frontend/backend enable flags, tester allowlist and release registry still apply. A real approved release must use the matching curriculum/media pair. This code change does not invent educator approval, insert release approval records, or run a live migration.

Practice evidence uses the existing authenticated queue. Checkpoints now use authenticated, server-issued word sessions and server recognition results. The result, completion decision, and word evidence are written atomically by `record_reading_checkpoint`. Browser-supplied independent checkpoint evidence for this curriculum is rejected. The Progress page consumes server checkpoint evidence through the existing summary. Raw audio and transcripts are not stored in checkpoint rows.

For an approved production release, chapter completion is restored from the server, not localStorage. An unfinished round resumes across devices until its two-hour expiry. First terminal outcomes are immutable; uncertain/service-failure outcomes remain retryable. Stage 3 reset epochs invalidate old rounds and chapter completion without deleting historic evidence or legacy rewards. Admins have a separate ten-chapter unlock control, and the learner overview reports expanded checkpoints separately from the legacy percentages. The main Stage 3 card opens the expanded journey only for the enabled, allowlisted, released curriculum/media pair.

These paths are implemented but not live-verified: the configured database currently lacks the curriculum evidence and checkpoint migrations. See `ARAL_LIVE_ROLLOUT.md`. No production migration or release registration was performed.

Existing word audio uses the selected Milo voice with its existing recording/TTS fallback. New sound/word recordings, particularly short-vowel contrasts and the long-vowel extension, still need pronunciation review. TTS is a temporary whole-word model, not an approved isolated-phoneme model. The independent checkpoint does not play the answer.

## Remaining work before replacing the main three-stage flow

1. Review the exact English inventory and recordings with the participating school's Grade 1 teacher; establish the separate Filipino/Marungko track.
2. Add isolated short/long-vowel recordings and explicit segmented-to-continuous blending demonstrations for the expanded inventory.
3. Extend the chapter selector into detailed castle environments and add full passage/story tasks and spaced review by demonstrated need. One-letter sound substitution is now implemented; sentence completion is not a full comprehension assessment.
4. Apply and integration-test the new checkpoint migration, cloud restoration and admin grants/resets. New chapter-specific reward milestones remain to be designed; existing rewards are preserved, not automatically re-awarded.
5. Validate word recognition against educator labels for child recordings, including accents, noise and false acceptance/rejection; tune recovery without treating technical failures as learner errors.
6. Register the reviewed release and enable it for a small pilot. The main Stage 3 entry is wired to switch for that approved cohort; do not enable it before the deployment smoke tests pass.

## Checks

Focused tests cover allowed words, within-chapter randomization, unique checkpoint items, balanced long-vowel coverage, missing-letter bounds and unassessed speech outcomes. The full existing test suites and production build are run during implementation. A passing build does not establish instructional effectiveness or recognition accuracy on children's speech.
