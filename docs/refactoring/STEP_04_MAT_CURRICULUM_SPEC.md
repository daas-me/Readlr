# Step 4: Provisional m-a-t Curriculum Specification

Status: **Ready for educator review, not approved for learner release**  
Draft ID: `readlr2-eng01-mat-draft-1`  
Prepared: 2026-10-13  
Scope: English ARAL-Reading Key Stage 1 introductory group `m, a, t`

This checkpoint defines the first Readlr 2.0 curriculum slice. It does not change the current learner journey, saved progress, rewards, access controls, or database. The specification becomes releaseable only after the approval record at the end of this document is completed by an authorized Grade 1 reading educator.

## 1. Source decision

| Source | Verified use in this slice | Boundary |
| --- | --- | --- |
| DepEd Memorandum No. 064, s. 2025, Annex A | The English ARAL-Reading KS1 sequence begins with readiness activities and then `m, a, t`. It describes structured, explicit, multisensory phonics instruction. | Readlr is self-paced and must not present its units as official ARAL calendar weeks. |
| MATATAG Reading and Literacy Curriculum Guide, Grade 1 | Supports producing letter sounds, identifying letters, isolating sounds, substituting sounds, and sounding out words. | The published Grade 1 guide is framed around the learner's first language. Readlr must not relabel these codes as an English standard. |
| Readlr 2.0 planning document | Proposes the Learning Camp, adventure application, evidence separation, remediation, and the `m-a-t` vertical slice. | It is a team design proposal, not an official curriculum or endorsement. |

Official references:

- DepEd Memorandum No. 064, s. 2025: https://www.deped.gov.ph/wp-content/uploads/DM_s2025_064r.pdf
- MATATAG Reading and Literacy Curriculum Guide: https://www.deped.gov.ph/wp-content/uploads/MATATAG-Reading-and-Literacy-CG.pdf
- Readlr 2.0 comprehensive plan: `C:/Users/saban/Downloads/Readlr_2.0_Comprehensive_Design_and_Refactoring_Plan.pdf`

**Verified conclusion:** `m, a, t` is an official English ARAL-Reading introductory group. The exact Readlr activity order, target pronunciation model, approved words, pictures, audio, assessment conditions, and learner thresholds are product decisions that still require educator review.

## 2. Learner and language scope

- Intended learner: Grade 1 learner needing beginning English phonics practice.
- Target language: English.
- Interface/support language: not fixed by this specification. Instructions may use a familiar language when approved, but target English sound models must remain unchanged.
- Learning pace: mastery-independent pacing is allowed for practice; advancement claims require the evidence rules below.
- Microphone: optional. Lack of a microphone must never block sound-to-letter, letter construction, blending, or story practice.
- Language variety: the educator must name the intended English model and accepted local variants before audio production.

## 3. Entry readiness

The slice may open for practice when a learner can:

1. Follow a one-step visual or spoken instruction with available language support.
2. Attend to and compare two short approved sounds.
3. Use tap, drag, keyboard, switch, or an equivalent accessible input.
4. Understand that print is followed from left to right for the blending activities.

These are access/readiness observations, not permanent mastery gates. A learner who needs support receives a shorter demonstration and reduced choices. Microphone permission, letter naming, handwriting, and prior completion of the legacy Vowel Dojo are not prerequisites.

## 4. Provisional target inventory

The notation below identifies the intended contrast; it is not yet an approved local pronunciation rubric.

| Content ID | Grapheme | Provisional English target | Child-facing model | Production caution | Approval |
| --- | --- | --- | --- | --- | --- |
| `eng01.grapheme.m` | `m`, `M` | `/m/` | A sustained humming sound | Do not teach an added vowel such as "muh" | Pending educator and audio approval |
| `eng01.grapheme.a` | `a`, `A` | short `a`, provisionally `/ae/` as in `mat` | A clear short vowel, not the letter name | Educator must confirm the intended Philippine English model and acceptable variation | Pending educator and audio approval |
| `eng01.grapheme.t` | `t`, `T` | `/t/` | A brief stop sound | Do not teach an added vowel such as "tuh" | Pending educator and audio approval |

The ASCII `/ae/` label above represents the IPA sound commonly written `/æ/`. Published learner UI should use a child-friendly label, not IPA, unless the educator specifically requests it.

### Approved-word candidates

| Content ID | Printed form | Pattern | Proposed use | Decision |
| --- | --- | --- | --- | --- |
| `eng01.word.am` | `am` | VC | Guided blending and familiar word meaning | Pending educator approval |
| `eng01.word.at` | `at` | VC | Guided blending and positional vocabulary | Pending educator approval |
| `eng01.word.mat` | `mat` | CVC | Guided blending, adventure construction, independent decoding candidate, vocabulary | Pending educator approval |

Do not add `ta`, `tam`, names, or pseudowords without an explicit review purpose and educator approval. The article `a` and connected text are deferred because its spoken form may not model the target short-a sound. Story narration may use broader listening vocabulary, but it must not be reported as independently decoded text.

## 5. Skill graph

| Skill ID | Outcome | Prerequisites | Acceptable evidence |
| --- | --- | --- | --- |
| `eng01.sound.discriminate` | Distinguish the three approved target sounds | Readiness observation | Independent audio-to-choice responses; educator observation |
| `eng01.letter.m` | Connect `/m/` with `m/M` | Approved `/m/` model | Independent sound-to-letter and letter-to-sound selection; educator verification of production |
| `eng01.letter.a` | Connect short-a with `a/A` | Approved short-a model | Independent sound-to-letter and letter-to-sound selection; educator verification of production |
| `eng01.letter.t` | Connect `/t/` with `t/T` | Approved `/t/` model | Independent sound-to-letter and letter-to-sound selection; educator verification of production |
| `eng01.blend.am` | Blend `a` and `m` into `am` | `a`, `m` correspondences | Guided blend is practice/helped; unprompted construction is independent evidence candidate |
| `eng01.blend.at` | Blend `a` and `t` into `at` | `a`, `t` correspondences | Same evidence rule as above |
| `eng01.decode.mat` | Blend/segment and decode `mat` | All three correspondences; supported VC blending | Independent construction and unprompted reading under approved conditions |
| `eng01.meaning.mat` | Connect `mat` with its familiar meaning | Vocabulary preteach or decoded word | Picture selection after decoding attempt; this measures meaning separately |

Adventure completion, tool ownership, recording presence, ASR confidence, response speed, and reward collection are not mastery evidence.

## 6. Vertical-slice sequence

| Order | Activity ID | Experience | Learner action | Evidence written | Remediation |
| --- | --- | --- | --- | --- | --- |
| 1 | `ENG01-MAT-D01` | Discover `/m/` | Hear approved model, watch mouth cue, match `m/M`, optionally echo | `practiced`; never scored pronunciation | Replay once, reduce choices, compare with a contrasting approved sound |
| 2 | `ENG01-MAT-D02` | Discover short `a` | Hear approved model, see `a/A`, identify a familiar approved anchor, optionally echo | `practiced` | Replay, visual mouth cue, contrast with a clearly different taught sound only after approval |
| 3 | `ENG01-MAT-D03` | Discover `/t/` | Hear approved model, match `t/T`, optionally echo | `practiced` | Replay, brief articulation cue, reduced choices |
| 4 | `ENG01-MAT-P01` | Hear and choose | Hear one target without seeing the answer, choose among `m`, `a`, `t` | Item-level independent sound-to-letter response when no hint/model follows item start | Return only to the missed correspondence, then use a different check item |
| 5 | `ENG01-MAT-P02` | Letter match | Match uppercase and lowercase forms, then hear the approved sound | `practiced`; case matching does not prove sound knowledge | Two-choice visual matching and model |
| 6 | `ENG01-MAT-B01` | Guided blend `am` | Track left to right as tiles join; hear segmented, continuous, then whole-word audio | `practiced` or `completed_with_help` | Stretch continuant `/m/` only where instructionally appropriate; repeat with visible tracking |
| 7 | `ENG01-MAT-B02` | Guided blend `at` | Join `a` and `t`, then select/build the printed word | `practiced` or `completed_with_help` | Re-isolate final `/t/`; rebuild with two tiles |
| 8 | `ENG01-MAT-B03` | Guided blend `mat` | Join all three tiles, compare segmented/continuous/whole word, connect meaning after the attempt | `practiced` or `completed_with_help` | Return to the missing correspondence or a VC step instead of replaying the answer repeatedly |
| 9 | `ENG01-MAT-A01` | Adventure bridge | Order `m-a-t` tiles to repair one themed obstacle; speaking is optional practice | Adventure completion plus helped/independent construction evidence according to hints used | Highlight the next tile position, then record the attempt as helped |
| 10 | `ENG01-MAT-I01` | Independent sound-letter check | Complete fresh, shuffled audio-to-letter items without answer audio after item start | Raw correct/incorrect/unclear items; candidate independent evidence | Exit check after support is requested and schedule focused practice |
| 11 | `ENG01-MAT-I02` | Independent word check | See `mat`, attempt reading without picture or word audio, then complete a separate construction and meaning item | Decoding, encoding, and meaning stored separately | If construction fails, diagnose correspondence vs blending; if only meaning fails, teach vocabulary |
| 12 | `ENG01-MAT-R01` | Delayed review | On a later session, complete new-order sound/letter and `mat` tasks without immediate model | Separate retention evidence, never merged with the teaching attempt | Reopen the smallest missing skill and schedule another review |

The independent activities are specifications for Step 10, not permission to implement them now.

## 7. Interaction and media rules

1. Every phoneme, segmented blend, continuous blend, and whole word uses a stable asset ID and educator-approved recording before release.
2. General TTS or Milo narration may explain a task but must not generate the instructional target sound.
3. Independent items do not play the target answer, show a revealing picture, animate the correct tile, or repeat a previously memorized order before the learner responds.
4. A picture may teach vocabulary before practice or assess meaning after a decoding attempt. It cannot prove oral-reading accuracy.
5. All drag interactions have tap/click and keyboard equivalents. Instructions are short, replayable, and skippable after the first complete model.
6. No timed response is required. Reduced-motion and muted modes preserve the learning information.
7. A nonvoice route provides the same letter, blending, construction, and story interactions. It remains `not_assessed` for speech production.

## 8. Evidence and candidate acceptance rubric

Readlr stores item evidence before deriving a status:

- `not_assessed`: no relevant check or check unavailable.
- `practiced`: target encountered or attempted with a model.
- `completed_with_help`: correct after a hint, answer exposure, reduced answer set, or guided model.
- `demonstrated_independently`: only an educator-approved unprompted rule may derive this from relevant item evidence.
- `educator_verified`: an educator records a result under an approved procedure.

### Proposed pilot rule for educator decision

Do **not** enable this derivation in code until approved. The reviewer should approve, replace, or reject it:

- Letter-sound correspondence: at least two unprompted items per letter, including lowercase and one varied presentation; each letter must have evidence rather than relying on a group percentage.
- Blending/encoding: construct `am`, `at`, and `mat` without answer exposure; store first response and all help used.
- Decoding: attempt `mat` without picture or target audio. Ordinary ASR transcription may be stored as a prediction, but it cannot by itself verify phoneme-level pronunciation or fluency.
- Meaning: select the approved `mat` image after the decoding attempt; report vocabulary separately.
- Retention: repeat with changed order in a later session; do not convert immediate practice into retained mastery.

Until the reviewer approves exact item counts, alternatives, and cutoffs, Progress must show item counts and `Not assessed`, `Practiced`, or `Completed with help`, not an invented mastery percentage.

## 9. Remediation routing

| Observed evidence | Next activity | Do not infer |
| --- | --- | --- |
| Confuses target sounds without letters | Approved sound discrimination with two choices | Visual letter weakness |
| Hears sound but chooses wrong letter | Reduced-choice grapheme mapping | Pronunciation weakness |
| Knows individual correspondences but cannot join them | Slow continuous blending with tracked tiles | Lack of effort or word-meaning weakness |
| Builds `mat` after hearing it but cannot read printed `mat` | Fresh unprompted decoding practice | Independent decoding from guided construction |
| Reads/builds `mat` but misses picture meaning | Oral vocabulary teaching and context | Decoding failure |
| Speech check is unclear/unavailable | Nonvoice construction/listening route or educator observation | Wrong pronunciation |

Each remediation attempt records the model, hint, answer exposure, and reduced-choice state that occurred.

## 10. Versioning and migration boundary

- Curriculum version: `readlr2-eng01-mat-draft-1`
- Release state: `provisional`
- Runtime availability: `false`
- Legacy stage progress remains legacy adventure history and is never mapped to these skill IDs.
- Existing equipment, stickers, frames, coins, completion, reset epochs, and access controls remain unchanged.
- A later approved release receives a new immutable version. Approval must not silently mutate this draft.
- Step 5 will bind versioned media assets to these stable IDs. Step 6 will define attempts, ownership, deduplication, and sync.

The matching machine-readable draft is `docs/refactoring/mat-curriculum-review.json`.

## 11. Educator sign-off record

All required rows must be completed before the slice can move from `provisional` to `approved`.

| Review area | Required decision | Reviewer | Date | Decision/version |
| --- | --- | --- | --- | --- |
| Source and sequence | Confirm English ARAL `m, a, t` use and scope | Pending | Pending | Pending |
| Language model | Name intended English variety and accepted child/local variants | Pending | Pending | Pending |
| Phoneme targets | Approve `/m/`, short-a, `/t/` descriptions and articulation cautions | Pending | Pending | Pending |
| Word bank | Approve `am`, `at`, `mat`; reject/add candidates with rationale | Pending | Pending | Pending |
| Audio | Approve each phoneme, blend, and whole-word recording by asset version | Pending | Pending | Pending |
| Images | Approve familiarity, culture, clarity, rights, and answer-cue placement | Pending | Pending | Pending |
| Instruction | Approve activity order, age appropriateness, language support, and remediation | Pending | Pending | Pending |
| Assessment | Approve independent conditions, item counts, alternatives, and status derivation | Pending | Pending | Pending |
| Accessibility | Approve nonvoice, keyboard/tap, replay, reduced-motion, and instruction supports | Pending | Pending | Pending |
| Pilot | Approve child-usability protocol and interpretation limits | Pending | Pending | Pending |

### Release decision

- [ ] Approved for a restricted pilot behind a default-off feature flag.
- [ ] Changes required; keep provisional.
- [ ] Rejected; archive this draft without remapping learner data.

Reviewer name and role: ______________________________  
Signature/approval reference: _________________________  
Date: __________________  Approved curriculum version: __________________

## 12. Step 4 completion boundary

Engineering source verification and the draft specification are complete. **Educator review is still outstanding**, so Step 4 is complete as a preparation checkpoint but has not passed its educational release gate. Step 5 may define a media manifest against these provisional IDs, but no m-a-t learner experience should be published until this sign-off is recorded.
