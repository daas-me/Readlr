# Readlr - The Reading Chronicles

Readlr is a web-based English reading practice platform for young learners. Milo guides learners through a Reading World with ten illustrated books, a Learning Camp, a Sound Library, collectible stickers, and milestone rewards.

The current experience replaces the earlier three-stage learning interface with a book-and-stop journey. It combines sound exploration, word building, guided practice, and independent final checkpoints. Readlr is an MVP learning application, not a standardized reading assessment or a diagnostic tool.

## Learner Experience

### Reading World and Onboarding

- An illustrated home world connects the books, Learning Camp, Sticker Book, Sound Library, and My Progress.
- A book carousel shows the current adventure, completed books, and locked destinations.
- The welcome screen appears on a fresh login; restoring a signed-in session returns to the home experience without replaying the welcome.
- New learners receive Milo's world tour, with spotlights and contextual guidance for the main destinations.
- The tour can be revisited from Help rather than restarting automatically on every reload.
- Three introductory Camp challenges introduce first sounds, sound ordering, and a short word.
- Microphone setup is offered during orientation. Learners can skip orientation challenges and begin Book 1 without recording those skipped challenges as practiced.

### The Ten Books

| Book | Adventure | Main Focus |
| --- | --- | --- |
| 1 | The First Gate | Join the first sounds; read am, at, and mat |
| 2 | Lantern Lane | Short a, e, and i |
| 3 | The Word Market | Build and read consonant-vowel-consonant (CVC) words |
| 4 | The Secret Garden | Short o and word contrasts |
| 5 | The Castle Drawbridge | Short u and word building |
| 6 | Hall of Changing Words | Change a sound to make another word |
| 7 | The Key Keeper | Beginning and ending sounds |
| 8 | The Royal Library | Connect words with meaning |
| 9 | The Vowel Tower | Compare short and long vowels, including silent e and ee |
| 10 | The Crown Chamber | Bring the journey's word skills together |

Books use illustrated story spreads and paginated trails. Their stops include sound lessons, sound joining, word activities, and a final gate. Book-specific activities include lantern sorting, market labels, garden word beds, bridge building, changing-word mirrors, sound locks, story repair, vowel comparisons, and a cumulative crown challenge.

Normal progression opens stops in sequence and later books after the preceding final checkpoint is passed. Completing guided practice and passing an independent checkpoint are separate events.

The English practice sequence is informed by ARAL KS1 learning activity sheets, with Readlr-specific extensions and cumulative review. It is not the official CRLA instrument or a Filipino Marungko course. Curriculum mappings and extension notes live in `frontend/src/app/components/aralCurriculum.ts`.

### Learning Camp

Learning Camp offers reusable practice outside the book trail:

- Short- and long-vowel exploration.
- Consonant sounds with illustrated word anchors.
- Sound joining and interactive letter manipulation.
- Milo's spoken models and guided listening.
- Introductory challenges with optional microphone setup and skip controls.

Camp practice is retained separately from independent book completion.

### Sound Library

The Sound Library organizes discovered material into short vowels, long vowels, consonants, sound teams, and book words.

Learners can search the collection, select a sound or word at the listening desk, listen to Milo, and record and replay their own voice. Sound teams include supported forward and reverse combinations and animate as their sounds join during playback. Availability follows the learner's book progression.

Illustrations identify the actual sound anchor or word where available; spelling displays cover words without a dedicated illustration instead of repeating an unrelated object.

### Sticker Book, Achievements, and Profiles

- **Sticker Book:** a personalized illustrated cover opens into a page-turning album. Distinct collectible artwork has a sticker finish, and selecting a sticker shows its earning requirement or achievement details.
- **Achievements:** an award-shelf presentation shows milestones, progress toward them, and viewable reward details.
- **Avatars and borders:** the profile editor includes character choices and existing decorative borders, with selected items highlighted and unlockable rewards tied to learning milestones.
- **My Progress:** book completion, Camp participation, and voice-practice activity are presented separately rather than treated as one accuracy score.
- **Visual identity:** vivid purple and orange accents, white text on primary orange actions, Milo animations, and coordinated illustrations across learning destinations. Sticker treatments are reserved for the collection rather than applied to every illustration.

## Progress and Speech

Learner curriculum state is persisted through the backend and supported by local browser state for continuity. This includes orientation progress and skips, guided stops, sub-activities, resumable practice rounds, and recording metadata.

Independent book checkpoints are server-issued and stored separately from guided activity. They retain word-level recognition outcomes, distinguish skipped or unavailable checks, and support retries where permitted. Book 1 also includes a picture-meaning check.

Speech recognition uses Groq's OpenAI-compatible endpoint with Whisper through the OpenAI JavaScript SDK. The SDK dependency does **not** mean that the current speech flow uses an OpenAI API key. Modeled audio and browser speech synthesis support narration and listening activities.

Recognition is fallible. Noise, permissions, device differences, and network or service availability can affect results. Uncertain or unavailable recognition must not be presented as a successful independent checkpoint. Guided completion is not a pronunciation or fluency score.

Some development-only fallback paths retain practice on the current device. These are not equivalent to server-verified completion and are not the production source of truth.

## Technology

| Area | Implementation |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Interface | Tailwind CSS, Radix-based UI components, Lucide icons, component-specific CSS |
| Interaction | Animated book pages, illustrated trails, drag/tap activities, browser audio recording and playback |
| Backend | Node.js, Express, TypeScript, Multer |
| Database | Supabase-hosted PostgreSQL with versioned SQL migrations |
| Authentication | JWT-based application authentication |
| Speech recognition | Groq-hosted Whisper through the OpenAI-compatible SDK |
| Workspace | npm workspaces with a root lockfile |

Exact dependency versions are recorded in the workspace manifests and `package-lock.json`.

## Local Setup

### Prerequisites

- Node.js 22.18 or later and npm. The frontend test command uses Node's TypeScript stripping support.
- A Supabase project.
- A Groq API key for server-side speech recognition.
- A microphone for recording and spoken checkpoints; listening and non-recording practice can be explored without one.

### Install Dependencies

Run from the repository root:

```bash
npm ci
```

### Configure Environment Files

Create `backend/.env` using `backend/.env.example` and `frontend/.env` using `frontend/.env.example`. These values are placeholders, not working credentials.

Backend:

```dotenv
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_side_service_role_key
JWT_SECRET=your_long_random_secret
GROQ_API_KEY=your_groq_api_key

READLR2_CAMP_ENABLED=true
READLR2_CAMP_CURRICULUM_VERSION=readlr-aral-english-1
READLR2_CAMP_MEDIA_VERSION=readlr-existing-models-tts-1
```

Frontend:

```dotenv
VITE_API_URL=http://localhost:3000/api
VITE_API_BASE=http://localhost:3000
VITE_READLR2_CAMP_ENABLED=true
```

Keep the Supabase service-role key, JWT secret, and Groq key on the backend only. Never put secrets in a `VITE_*` variable or commit real environment files.

The curriculum and media version identifiers must match the corresponding database release records. The current backend enables the curriculum unless explicitly disabled; the environment example makes that setting explicit.

### Prepare the Database

Apply the SQL files in `backend/supabase/migrations/` in filename order to a new Supabase project. For an existing database, apply only migrations that have not already been applied.

The initial schema alone is not enough for the current application. Later migrations provide profiles and settings, reward assets, curriculum releases and evidence, reading checkpoints, and persistent learner curriculum state. Some existing storage structures remain for compatibility even though the learner interface now uses ten books.

The backend does not automatically create or migrate tables at startup. Do not use the older development seed script as a substitute for applying the current migrations.

Check the reading rollout configuration after configuring the backend and database:

```bash
npm run rollout:check --workspace backend
```

### Start Development

Use two terminals from the repository root.

Backend:

```bash
npm run backend:dev
```

Frontend:

```bash
npm run frontend:dev
```

The default frontend address is `http://localhost:5173`; the API defaults to `http://localhost:3000`. Check API availability at `http://localhost:3000/health`.

If Vite selects another port, update the backend's allowed frontend origin accordingly. The root `npm run dev` uses npm's workspace runner; use the separate commands above to ensure both long-running servers are started.

## Verification

Run from the repository root:

```bash
npm test --workspace frontend
npm test --workspace backend
npm run type-check --workspace frontend
npm run type-check --workspace backend
npm run build
```

Tests cover curriculum consistency, progression, guided activities, speech-result handling, persisted state, and reward rules. Browser checks are also important for book transitions, audio controls, microphone permissions, onboarding, and responsive layouts.

## Deployment

Build outputs are `frontend/dist` and `backend/dist`. The backend production entry point is `backend/dist/server.js`.

For the Render backend deployment, the repository-root commands are:

```bash
# Build
npm ci --include=dev
npm run build --workspace backend

# Start
npm run start --workspace backend
```

Configure the backend environment with the same required keys as local development, set `NODE_ENV=production`, and set `CORS_ORIGIN` to the deployed frontend origin. Multiple allowed origins can be comma-separated. The server reads `PORT` from its environment. Use `/health` for the health-check path.

Configure the frontend build with public addresses only:

```dotenv
VITE_API_URL=https://your-backend-domain/api
VITE_API_BASE=https://your-backend-domain
VITE_READLR2_CAMP_ENABLED=true
```

Build the frontend with `npm run frontend:build`. Its host must serve the client application for browser routes, not only for `/`. Vite environment values are baked into the build, so changing them requires rebuilding the frontend.

Apply pending database migrations before deploying code that depends on them. Deploy compatible frontend and backend revisions together when API contracts change.

## Browser and Audio Notes

- Use HTTPS in production or localhost during development for microphone access.
- Recording requires browser permission and an available microphone.
- Audio playback may require a user gesture; voice and speech-synthesis availability varies by browser.
- Test the intended devices and browsers rather than assuming identical recording behavior everywhere.
- A reload should restore a signed-in learner's home experience, not repeatedly replay the welcome or completed onboarding.
- If books or rewards fail to load, check the API address, allowed origin, authentication, database migrations, and curriculum release configuration before treating the failure as missing progress.

## Project Layout

```text
Readlr/
  frontend/
    src/
      app/
        App.tsx             Application routing and learner flow
        components/         Books, Camp, library, collections, and shared UI
        hooks/              Application synchronization hooks
      hooks/                Curriculum state, audio, checkpoints, and local continuity
      modules/              Authentication and supporting feature modules
      styles/               Shared styles
    public/                 Audio, illustrations, and static assets
    tests/                  Frontend regression tests
  backend/
    src/
      modules/              API routes, controllers, and services
      config/               Environment configuration
      database/             Supabase connection and models
      middleware/           Authentication and request handling
    scripts/                Setup and rollout utilities
    supabase/migrations/    Versioned database changes
    tests/                  Backend and database regression tests
  guidelines/               Contribution and implementation guidance
  package.json              Workspace commands
  package-lock.json         Dependency lockfile
```

Key learner components include `ChronicleHome`, `ChronicleBookWorld`, `ReadingJourney`, `SoundLearningCamp`, `CurriculumSoundLibrary`, `StickerBook`, `CurriculumAchievements`, and `ReadingProgressDashboard`.

For contributions, see `guidelines/Guidelines.md`. Third-party credits are listed in `ATTRIBUTIONS.md`. Historical prototype documents may describe interfaces that predate the current Reading Chronicles experience.

---

<small>Footnote: The admin side is used only for testing during MVP validation.</small>
