# Step 9: Adventure Application

Completed 2026-10-13.

## Learner experience

`ENG01-MAT-A01` now opens from Story Trail after the guided blending route. The child sees an approved meaning picture, chooses shuffled `m`, `a`, and `t` tiles in reading order, and restores three bridge planks as the word is constructed. An incorrect tile does not advance the bridge; it adds a focused next-letter hint and records that help was used.

The completion animation is intentionally separate from mastery. It celebrates finishing the story challenge but does not unlock rewards, write legacy stage progress, or mark a skill mastered. Persistent Camp progress is reserved for Step 11.

## Evidence boundary

The activity queues one `adventure` construction attempt after the three correct tiles are placed. It records the exact curriculum/media versions, the `mat` meaning-image asset, hint count, answer exposure, and offline state. The server always derives `completed_with_help` for adventure mode, including a correct first try. Independent evidence remains exclusive to the Step 10 independent-check route.

No raw audio, transcript, pronunciation score, or client-provided mastery class is stored. The target word is not played or printed before the response. The meaning picture is the clue.

## Media and release behavior

The learner activity requires `media.eng01.mat.meaning-image.v1` under the exact immutable media-manifest path. It checks the response status and image content type before opening. Missing or invalid media fails closed without substituting a legacy image, generated clue, or text answer.

The existing backend tester allowlist, runtime flags, and approved `curriculum_releases` row still control production access. Step 9 does not weaken those gates.

## Development preview

`/learning-camp-preview.html` is a development-only design preview for the Camp map, Wordsmith Tent, and Story Trail. It uses clearly labeled visual placeholders and simulated audio completion so the interface can be reviewed before approved assets exist.

Preview mode:

- renders only when Vite reports `DEV`;
- does not fetch learner identity, access policy, or account progress;
- does not call the evidence queue;
- displays a persistent simulated-media warning;
- cannot replace the gated `/learning-camp` learner route.

The preview is for visual and interaction review only. It cannot be used for teaching validation, media approval, pilot evidence, or learner assessment.
