# Step 13: ENG-02 Controlled Expansion

Completed as a review package on 2026-10-13. Educational and production release gates remain open.

## Boundary

Step 13 expands exactly one curriculum group: `ENG-02`, the next English ARAL-Reading group after `m, a, t`. Its new graphemes are `e, s, i, l`; cumulative work may also use the already introduced `m, a, t`. No later group is generated, and no existing journey completion is converted into ENG-02 evidence.

This checkpoint does not claim that the proposed pronunciation models, word bank, images, activity order, or assessment items are educator-approved. Production Learning Camp access remains bound to the existing approved release lookup and the hard-coded `ENG-01` access contract. ENG-02 is visible only in the development preview.

## Candidate learning route

The proposed Firefly Forest route uses seven distinct stops:

1. Letter Lanterns introduces `e, s, i, l` with approved phoneme, mouth-cue, and letter-card media once supplied.
2. Echo Creek contrasts the new sounds, with special review required for short `e` and short `i`.
3. Word Weaver combines prior and new letters in `it` and `sit`.
4. Switchback Steps changes one vowel across candidate words `sat`, `sit`, and `set`.
5. Firefly Story applies approved cumulative words in short connected text and keeps meaning questions separate from decoding evidence.
6. Forest Lookout uses fresh, unmodeled independent items without answer audio or pictures.
7. Moonlit Return records a later check separately from immediate performance.

Candidate words are `it`, `sat`, `sit`, `set`, `met`, `let`, and `lit`. They are deliberately marked pending. An educator may approve, replace, reorder, or reject any item before release.

## Versioned package

- Curriculum draft: `readlr2-eng02-esil-draft-1`
- Media draft: `readlr2-eng02-esil-media-draft-1`
- Prerequisite group: `ENG-01`
- Runtime availability: false
- Release status: blocked

The curriculum record defines source boundaries, cumulative prerequisites, stable content and skill IDs, activity evidence ceilings, media requirements, and publication gates. The media manifest records 25 required but currently missing candidates. Instructional TTS and silent legacy substitution remain prohibited.

`scripts/validate-readlr-media.mjs` now validates both ENG-01 and ENG-02 packages. A package cannot become eligible unless every required asset has an immutable revision, complete educator approval metadata, and cleared rights provenance.

## Required review before learner release

- Confirm the intended English variety and locally acceptable learner variants.
- Approve isolated `e, s, i, l` phoneme models and the short `e`/short `i` contrast.
- Review every candidate word for decodability, familiarity, meaning, and cumulative prerequisites.
- Approve instructional audio, mouth cues, letter cards, and the `sit` meaning image.
- Replace draft independent and delayed-review items with educator-approved item sets.
- Conduct keyboard, screen-reader, reduced-motion, tablet, and pupil usability review.
- Register immutable approved curriculum and media versions; never approve the mutable draft IDs.

## Completion statement

Step 13 is complete as the first one-group expansion package and visual review surface. It is not complete as an educational release. The next safe action is educator/content review of ENG-02, not automatic generation of ENG-03.
