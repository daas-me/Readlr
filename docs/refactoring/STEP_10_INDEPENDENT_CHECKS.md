# Step 10: Independent Checks and Focused Remediation

Completed 2026-10-13.

## Lookout Point sequence

Lookout Point now implements the first independent Camp Check behind the same curriculum, media, tester, and release gates as the rest of Learning Camp.

1. `ENG01-MAT-I01` presents one shuffled sound-to-letter item for each approved `m`, short-`a`, and `t` model. The stimulus can play once. All three letter choices remain available and their order is shuffled.
2. `ENG01-MAT-I02` plays the approved whole word once as a dictation stimulus, hides the printed answer and picture, and asks the learner to construct `mat` from shuffled letters.
3. The completed word is then shown for an explicitly unscored read-aloud or quiet-reading moment. No recording event, ASR prediction, or self-report becomes decoding evidence.
4. A separate two-choice confirmation connects the approved `mat` picture to the word. Because the answer set is reduced and the target is exposed, this item can only be classified as completed with help. It is not vocabulary mastery evidence.

The provisional Step 4 sequence described displaying `mat` before construction. This implementation deliberately places dictated construction first; otherwise the printed spelling would expose the construction answer. The printed word appears only afterward for an unscored reading moment. This ordering remains a product hypothesis requiring educator approval before release.

The check has no timer, score percentage, mastery badge, reward, or legacy progress write.

## Evidence rules

Every selection and construction is queued as a separate immutable attempt. A correct, unprompted full-choice sound response or word construction can be derived by the server as `independent_candidate`. This is evidence for later aggregation, not mastery by itself.

Incorrect responses remain `incorrect`. The assessment ends before revealing the answer. Help shown afterward never edits or replaces the original attempt. The server, rather than the client, derives the evidence class.

The dictated whole-word recording is the task stimulus and is stored in `mediaAssetIds`; no answer replay is available. The child-facing reading moment is deliberately unscored because the system cannot yet make a validated oral-reading judgment from microphone presence or ordinary ASR.

## Focused remediation

Remediation follows the smallest observed gap:

- a missed sound-letter item reveals only that correspondence and permits approved-model replay;
- an incorrect word construction returns directly to the `mat` guided-blending lesson in Wordsmith Tent;
- a meaning miss shows the approved picture, printed word, and a short vocabulary explanation.

Remediation does not queue independent evidence, erase the incorrect attempt, award mastery, or immediately force the same assessment item again. After guided blending, the learner returns to Lookout Point and may choose when to retry.

## Media and preview boundary

Production requires the three approved phoneme recordings, approved `mat` whole-word recording, and approved `mat` meaning image under the exact released manifest directory. Every dependency is checked for HTTP success and matching audio/image content type before the check opens. Failure blocks the check without using TTS, legacy audio, or generated instructional media.

The development-only Learning Camp preview adds a Lookout Point option. It simulates audio and uses a clearly marked picture placeholder, reads no account state, and queues no evidence.

## Deferred to later steps

- Step 11 will aggregate item evidence for progress reporting without inventing mastery thresholds.
- Delayed review remains `ENG01-MAT-R01` for a later checkpoint.
- A teacher-approved multi-picture vocabulary item can replace the conservative two-choice confirmation in a future content version.
