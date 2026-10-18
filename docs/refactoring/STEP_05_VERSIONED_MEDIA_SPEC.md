# Step 5: Versioned Content and Approved-Model Media

Status: **Implemented as a blocked-by-default control layer**  
Manifest: `docs/refactoring/mat-media-manifest.json`  
Validator: `scripts/validate-readlr-media.mjs`  
Prepared: 2026-10-13

This checkpoint makes the provisional `m-a-t` content addressable and reviewable without publishing it. It does not connect the manifest to learner-facing activities. The first curriculum slice remains unavailable until its educator and media gates pass.

## 1. Version identities

The following identities serve different purposes and must not be collapsed:

| Identity | Current value | Meaning |
| --- | --- | --- |
| Curriculum version | `readlr2-eng01-mat-draft-1` | Immutable definition of content, skills, and activities from Step 4 |
| Manifest version | `readlr2-eng01-mat-media-draft-1` | Immutable set of media requirements and candidate revisions |
| Asset ID | Example: `media.eng01.a.phoneme.v1` | Stable instructional role referenced by an activity |
| File revision | SHA-256, bytes, format, and technical properties | Exact physical file proposed for an asset ID |
| Approval record | Status, reviewer, role, date, and approval version | Human decision about instructional and child-facing suitability |

Replacing a file while keeping an old hash is forbidden. A changed file creates a new revision, and a changed instructional target creates a new asset version. Historical manifests and files remain available for attempt interpretation and rollback.

## 2. Asset classes

| Class | Examples | Release requirement |
| --- | --- | --- |
| Instructional phoneme audio | isolated `/m/`, short-a, `/t/` | Exact target and English variety documented; educator-approved recording; no runtime TTS |
| Blend and word audio | segmented, continuous blend, and natural whole word for `am`, `at`, `mat` | Each form reviewed separately; component concatenation cannot silently replace a whole-word model |
| Teaching visual | mouth cue and letter card for `m`, `a`, `t` | Educator-reviewed articulation/letter representation and accessibility review |
| Meaning image | familiar `mat` image | Meaning and cultural familiarity reviewed; rights recorded; hidden before independent decoding attempt |
| Milo dialogue | task directions and encouragement | May use the existing voice fallback chain only when it does not carry the instructional sound or reveal an independent answer |

## 3. Current candidate audit

The repository currently contains:

| Existing file | Technical identity | Step 5 disposition |
| --- | --- | --- |
| `frontend/public/audio/stage1/classic-milo/A.wav` | mono, 24 kHz, 16-bit WAV, 1.361 seconds, SHA-256 `cdeeee4616223f8b4964a901cb8a26a5df26181c6d4e81d25503adbb92e88c79` | Bound only as an unreviewed candidate for `media.eng01.a.phoneme.v1`; cannot release |
| `frontend/public/audio/stage2/classic-milo/PronounceMA.wav` | mono, 24 kHz, 16-bit WAV, 0.691 seconds, SHA-256 `7269ff9c4dd700c43d3c1bab7c93cd547edb299ce199ad454980ca6d30cad3cc` | Preserve for the legacy Stage 2 CV activity; not a substitute for `am`, `mat`, or isolated `/m/` |
| `frontend/public/audio/stage2/classic-milo/PronounceTA.wav` | mono, 24 kHz, 16-bit WAV, 0.570 seconds, SHA-256 `2aaa637624d46a8ae4b1c328bb255faed9fc7d2024117b5a530a9f34b835bff4` | Preserve for the legacy Stage 2 CV activity; not a substitute for `at`, `mat`, or isolated `/t/` |

There are no current candidate files for isolated `/m/` or `/t/`, segmented/continuous/whole `am`, `at`, or `mat`, the three mouth cues, the three reviewed letter cards, or the `mat` meaning image. The manifest records these absences explicitly.

## 4. Approval workflow

1. Use the stable asset ID and approved curriculum target when preparing a candidate.
2. Add the file under a versioned curriculum media directory in Step 5 or a later media-production change. Do not overwrite a released revision.
3. Run `node scripts/validate-readlr-media.mjs` to capture any missing file, size, hash, type, or relationship error.
4. The educator reviews language variety, target accuracy, clarity, age appropriateness, and consistency.
5. The project records rights/consent provenance. A developer or file owner cannot self-certify the educational target merely because the file plays.
6. Record reviewer name, professional role, date, decision, and approval version in the manifest.
7. Re-run validation. A release process may proceed only when the manifest reports `releaseStatus: eligible` and every required asset is approved.

Audio review should compare the recording with the approved target, not only with its filename. The validator proves file identity and metadata completeness; it cannot hear or approve a pronunciation.

## 5. Missing and invalid media behavior

Instructional media fails closed:

- Missing file, hash mismatch, unapproved revision, unsupported type, or missing rights information blocks only dependent activities before they begin.
- The learner sees a short neutral availability message and can return to the Camp or use another already approved activity.
- Instructional phonemes, blends, and words never fall back to browser speech synthesis, generated Milo dialogue, letter-name pronunciation, filename inference, or an unrelated legacy clip.
- A missing meaning image blocks the meaning item, not unrelated letter or decoding activities.
- A narration failure may use an approved alternate Milo recording or noninstructional TTS for the same approved script. It must not speak the target answer in an independent check.
- A blocked asset never creates an attempt, failure, wrong answer, curriculum status, or lost reward.

## 6. Runtime resolution contract for a later step

The future media resolver must accept an `assetId` and `manifestVersion`, not a raw filename from activity content. It must return one of:

- `ready`: exact approved revision, verified locally or from an approved cache;
- `unavailable`: missing/offline but not evidence about the learner;
- `blocked`: unapproved, hash mismatch, revoked, or incompatible;
- `superseded`: retained for historical playback but not new sessions.

Activities store the resolved asset ID, manifest version, and file revision hash with each attempt. They do not store a mutable path as the educational identity.

## 7. Legacy preservation

- Existing Stage 1, Stage 2, and Stage 3 files stay in place and keep their current fallback behavior.
- `audio-inventory.json` remains a physical repository inventory, not an approval manifest.
- Existing files marked `not_verified` are not retroactively approved or deleted.
- The Milo default/classic voice selector remains a narration preference. It cannot change the approved instructional model.
- Old attempts continue to reference their legacy journey. They are not relabeled as `readlr2-eng01-mat-draft-1` evidence.

## 8. Validation rules implemented

`scripts/validate-readlr-media.mjs` checks:

1. Manifest and curriculum versions match their declared relationship.
2. Asset IDs and requirement pairs are unique.
3. Every Step 4 media requirement has one manifest asset.
4. Every activity-referenced content target resolves to the same curriculum version.
5. Bound files remain inside `frontend/public`, exist, and match bytes and SHA-256.
6. Instructional audio never declares TTS or legacy-substitution fallback.
7. Approved assets contain a file/implementation revision, rights clearance, and complete educator review metadata.
8. The manifest cannot claim eligibility while required assets are missing or unapproved.

Current expected validator result: structural validation passes, with `0/19` required assets approved and the release correctly blocked. The short-a file is a candidate, not an approval.

## 9. Step 5 completion boundary

The version model, complete m-a-t requirement set, candidate audit, fail-closed policy, and automated integrity validation are implemented. Media production and educator approval are intentionally outstanding. No learner-facing content consumes this manifest yet.

The next checkpoint is Step 6: attempt/evidence foundations with ownership, idempotency, hint/model exposure, version references, offline replay, and migration tests. Step 6 must accept unavailable media as a system outcome rather than a learner error.
