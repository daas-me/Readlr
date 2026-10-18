# Step 6: Attempt and Evidence Foundation

Status: **Implemented, migration not verified against the deployed database**  
Prepared: 2026-10-13  
Runtime scope: dormant until an approved curriculum/media release produces attempts

This checkpoint adds an append-only, learner-owned evidence stream. It does not convert legacy practice, stage completion, rewards, or provisional m-a-t work into curriculum evidence.

## 1. Data boundaries

| Record | Meaning | Step 6 treatment |
| --- | --- | --- |
| Legacy `PracticeAttempt` | Local microphone/practice analytics from existing stages | Preserved in place; never imported automatically |
| Adventure progress | Map, bridge, CVC, equipment, and reward history | Preserved separately |
| Curriculum attempt | One versioned learner interaction with assistance and result context | New append-only record |
| Mastery | Educator-approved aggregation over relevant attempts | Not implemented until independent-check rules are approved |

The attempt table uses `independent_candidate`, not `demonstrated_independently`. A later checkpoint must apply the approved item set, denominator, recency, and remediation rules before any learner skill status advances.

## 2. Ownership and privacy

- Routes are authenticated and restricted to learner accounts.
- The browser never sends `learnerId` or `userId`. The server resolves the learner profile from the authenticated account.
- Unsupported fields are rejected, including `learnerId`, `userId`, `rawAudio`, `transcript`, and client-supplied evidence/mastery classes.
- The schema has no raw audio, recording URL, or audio blob column.
- `responseValue` is an optional bounded answer token, not an unrestricted child transcript.
- Direct access is revoked from `public`, `anon`, and `authenticated`; the existing backend service role is the only application writer.

## 3. Immutable attempt identity

Each client attempt has:

- a UUID `attemptId` generated once and retained through retries;
- a UUID `sessionId`;
- curriculum and media manifest versions;
- activity, skill, and content IDs;
- response type and bounded response value;
- result type;
- hint count, model exposure, answer exposure, and reduced-choice state;
- exact media asset IDs;
- start/completion timestamps and offline-capture flag.

The server derives a SHA-256 payload hash over the normalized record. Replaying the same `attemptId` and payload is idempotent. Reusing the ID with changed data returns `409 attempt_conflict`; it never overwrites the first record.

## 4. Server-derived evidence class

| Conditions | Stored attempt class |
| --- | --- |
| Unavailable, unclear, or no response | `not_assessed` |
| Incorrect response | `practiced` |
| Correct after hint, model, answer exposure, reduced choices, or a guided/adventure mode | `completed_with_help` |
| Correct teaching/practice task without help | `practiced` |
| Correct unassisted independent check or delayed review | `independent_candidate` |

This class describes the attempt context only. It does not award mastery, fluency, pronunciation quality, rewards, or stage completion.

## 5. Release allowlist

The additive migration creates `curriculum_releases`, keyed by curriculum and media manifest versions. A release requires immutable hashes, an educator approver, an approval reference, and an approval date.

Only a pair with `status = approved` may receive attempts. Revoked, missing, invented, or provisional versions return `409 content_not_released`. The migration deliberately inserts no release row for `readlr2-eng01-mat-draft-1`, so the current Step 4/5 draft cannot collect evidence.

## 6. Offline queue and replay

The frontend foundation stores new evidence under `readlr_evidence_queue_v1_<learnerId>`:

1. An activity creates the UUID before attempting network sync.
2. Queue insertion is idempotent by `attemptId` and isolated by learner profile.
3. Network failure leaves the exact record untouched.
4. Sync sends at most 100 attempts and does not include learner identity.
5. Only IDs acknowledged as `accepted` or `alreadySynced` are removed.
6. Unrelated or rejected records remain queued.
7. The dormant sync hook retries queued work after insertion, reconnection, foregrounding, and at a bounded interval.
8. Storage failure is returned to the future activity without throwing through the child's interaction, and the queue is capped without deleting older unsynced attempts.

No current activity calls `queueEvidenceAttempt`, so existing learners generate no new API traffic. The hook also makes no request when the queue is empty.

## 7. API

| Method and path | Purpose |
| --- | --- |
| `POST /api/evidence/me/attempts/sync` | Validate and idempotently store up to 100 attempts for the authenticated learner |
| `GET /api/evidence/me/attempts?afterId=<id>&limit=<1-100>` | Return that learner's append-only evidence using a stable server cursor |

The sync response separates newly `accepted` IDs from `alreadySynced` IDs. Database/migration unavailability returns `503 evidence_unavailable`; malformed data returns `400 invalid_evidence`.

## 8. Migration and rollout

Migration file: `backend/supabase/migrations/202610130001_curriculum_evidence.sql`

Before enabling an approved activity:

1. Back up the deployed database through the project's approved process.
2. Apply the migration on staging, then production.
3. Confirm both tables, constraints, indexes, RLS, and revocations exist.
4. Do not insert a `curriculum_releases` row until Step 4 educator sign-off and all Step 5 assets are approved.
5. Insert the approved pair with hashes matching the reviewed immutable curriculum and media files.
6. Test duplicate replay, changed-payload conflict, cross-account isolation, offline replay, revocation, and rollback on staging.

No deployed Supabase instance was modified or inspected during this checkpoint.

## 9. Verification

- Backend evidence tests cover assistance derivation, unsupported ownership/raw voice fields, deterministic hashes, time/media bounds, migration ownership, release allowlisting, RLS, and absence of raw-audio storage.
- Frontend tests cover learner-scoped queues, local idempotency, malformed records, offline preservation, exact replay, acknowledgement, and unrelated-record retention.
- Full automated suites after implementation: 27 backend tests and 134 frontend tests passed.
- Backend TypeScript check passed.
- Frontend test type-check remains blocked by the pre-existing invalid `ignoreDeprecations: "6.0"` configuration.

## 10. Step 6 completion boundary

The schema, authenticated routes, validation, immutable idempotency, release allowlist, offline queue, dormant retry hook, and migration contracts are implemented. The database migration still needs controlled deployment. No provisional m-a-t activity, legacy lesson, Progress view, or mastery calculation consumes this evidence yet.

The next checkpoint is Step 7: a restricted Learning Camp hub for the approved first group, still behind a default-off tester flag and without bypassing the educator/media release gates.

