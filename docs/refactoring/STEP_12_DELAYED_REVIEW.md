# Step 12: Delayed Review

Completed on 2026-10-13.

## Purpose

Step 12 adds a later-session review to the first `m-a-t` Learning Camp group. It records whether previously encountered skills remain accessible after time has passed. It does not turn attendance, immediate practice, or a single correct review into mastery.

## Learner experience

Memory Meadow is the seventh Camp station. It becomes due only after the backend finds one complete independent-check session containing all four required targets: `m`, short `a`, `t`, and dictated `mat` construction.

The review changes the setting and order while retaining approved content:

- three shuffled sound-to-letter lanterns;
- each approved sound can play once;
- one dictated `mat` construction with shuffled tiles;
- no picture, printed answer, hint, or answer reveal before completion;
- all four answers are recorded before practice is offered.

Incorrect answers remain in the evidence history. Practice afterward does not replace them.

## Scheduling boundary

The pilot schedule begins one day after a complete independent check. A complete all-correct delayed review schedules the next review after three days; a review with difficulty schedules it after one day. These intervals are explicitly product hypotheses for teacher and pupil validation, not DepEd requirements.

Absence never removes progress, rewards, or evidence and is never interpreted as lost skill. A partial independent or delayed session does not start a new schedule.

## Evidence and reporting

Every Memory Meadow item uses activity `ENG01-MAT-R01` and mode `delayed_review`. The backend continues to derive the evidence class. Progress reports the number of skills checked again later separately from immediate independent checks and notes whether the latest later check was remembered or needs practice.

No raw audio, transcript, pronunciation percentage, time-in-app score, reward, or automatic mastery status is created.

## Deployment

Apply the three additive curriculum evidence migrations in order. Production access remains behind the existing Learning Camp feature, tester, approved-curriculum, and approved-media gates. The development preview simulates a due review and writes no account data or evidence.
