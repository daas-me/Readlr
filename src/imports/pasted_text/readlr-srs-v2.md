# CEBU INSTITUTE OF TECHNOLOGY UNIVERSITY
## COLLEGE OF COMPUTER STUDIES

# Software Requirements Specifications
## for Readlr
### Version 2.0

---

## Change History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | (prior) | Team | Initial approved SRS |
| 2.0 | 2026-05-17 | Team | Clarified target language (English instruction for Filipino learners); formalized the Companion Character ("Sinta") that was already committed in the approved Project Proposal; added Self-Correction Recognition and Fluency Tier Classification as derived metrics over the existing ASR engine; added a Teacher Analytics view (Fluency Heatmap) over the existing engagement logs. Prosody-aware scoring and Phil-IRI report export are documented as Phase 2 / Future Work and are NOT part of the MVP scope. |

---

## Summary of Changes in v2.0

All v2.0 additions are derived from data the v1.0 system already commits to collect (ASR confidence scores, attempt counts, session logs). **No new sensors, no new ML models, no new audio pipelines are introduced into the MVP.** The additions formalize the "animated companion" already committed in the approved Project Proposal (Part 4 Micro-Gameplay Loop and Part 6 Traceability Matrix), and add a teacher-facing view of the engagement data the v1.0 SRS already requires.

1. **§1.2 Scope**: clarified — *English literacy for Filipino Grade 1 learners*, sequenced via the Marungko phonetic approach.
2. **§1.3 Definitions**: added Companion Character, Fluency Tier, Self-Correction.
3. **§2.2 User Characteristics**: teacher role expanded to include the analytics surface.
4. **§3.2 Module 2 extended:**
   - **2.3 Companion Character Module (NEW, MVP)** — names "Sinta," defines four behavioral states.
   - **2.4 Self-Correction Recognition (NEW, MVP)** — pattern detection over existing ASR attempt records.
   - **2.5 Fluency Tier Classification (NEW, MVP)** — derives *Fluent / Halting / Syllabic* from ASR confidence and total attempt duration already captured by §2.1.
5. **§3.2 Module 3 extended:**
   - **3.1 Sticker Reward System extended** — adds Self-Correction Star tier.
   - **3.3 Teacher Analytics Module — Fluency Heatmap (NEW, MVP)** — aggregates existing engagement logs into a class-wide grid.
6. **Appendix B — Phase 2 / Future Work (NEW)**: documents prosody-aware scoring and Phil-IRI export as post-MVP research extensions. These are intentionally **out of MVP scope** to ensure a viable May 30 delivery.

---

## Table of Contents

1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions, Acronyms and Abbreviations
   1.4 References
2. Overall Description
   2.1 Product Perspective
   2.2 User Characteristics
   2.3 Constraints
   2.4 Assumptions and Dependencies
3. Specific Requirements
   3.1 External Interface Requirements
   3.2 Functional Requirements
   3.3 Non-Functional Requirements
Appendix A — Traceability of v2.0 Additions to Approved Project Proposal
Appendix B — Phase 2 / Future Work (Out of MVP Scope)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to provide a detailed description of the Readlr system, a gamified, storytelling-based mobile application integrated with Automated Speech Recognition (ASR) designed to improve phonemic awareness, pronunciation accuracy, and early reading readiness among Grade 1 Filipino learners studying English. This document serves as a guide for developers, researchers, and stakeholders to ensure alignment with system requirements and educational objectives.

### 1.2 Scope

Readlr is a mobile-based educational application for Grade 1 Filipino learners that combines gamification, storytelling, and speech recognition technology to support **English-language** early literacy development, sequenced using the **Marungko phonetic progression** as the pedagogical framework. The application targets 60 Grade 1 participants in a selected Philippine public elementary school through a four-week quasi-experimental intervention, functioning as a self-directed learning tool requiring no teacher facilitation during use.

The system includes the following core functionalities:

- **Story-Based Learning Adventure System** — a three-stage narrative campaign (Valley of Vowels, Blending Bridges, CVC Kingdom) aligned with the Marungko phonics sequence and DepEd MELCs
- **Phonetic Challenge Module** — story-embedded tasks targeting phonemes, CVC words, and early sight words that require correct pronunciation to advance
- **Companion Character ("Sinta")** — a persistent animated character that models pronunciation, demonstrates mouth shapes, listens to learner input, and delivers emotionally-scaffolded feedback
- **Automated Speech Recognition (ASR) Feedback Engine** — real-time pronunciation evaluation using confidence score thresholds with corrective feedback loops
- **Self-Correction Recognition** — detects unprompted error correction by the learner and awards a distinct reward tier
- **Fluency Tier Classification** — classifies each word attempt as *Fluent / Halting / Syllabic* based on ASR confidence and attempt duration
- **Reward and Sticker Collection System** — digital Sticker Book with collectibles representing local Filipino animals and story characters, including a Self-Correction Star tier
- **Student Progress Tracking Dashboard** — session-based logs of pronunciation accuracy, level completion rates, and reward milestone achievement
- **Teacher Analytics Module (Fluency Heatmap)** — class-wide visualization of per-student × per-word fluency tiers and trouble-spot detection
- **Phoneme and Vocabulary Learning Bank** — sequenced library of Grade 1-appropriate phonemes and words with native-speaker audio models

### 1.3 Definitions, Acronyms and Abbreviations

- **ASR** – Automated Speech Recognition
- **MELCs** – Most Essential Learning Competencies (DepEd curriculum framework)
- **CVC** – Consonant-Vowel-Consonant words (e.g., "cat", "dog")
- **Phoneme** – The smallest unit of sound in speech
- **Gamification** – Use of game elements in non-game contexts to drive engagement
- **ISO/IEC 25010** – Software quality evaluation model
- **WCPM** – Words Correct Per Minute (reading fluency metric)
- **UI/UX** – User Interface / User Experience
- **EGRA** – Early Grade Reading Assessment
- **Phil-IRI** – Philippine Informal Reading Inventory
- **ECARP** – Every Child A Reader Program
- **Marungko** – Government-endorsed localized phonetic reading strategy for Filipino learners
- **MVP** – Minimum Viable Product
- **MELE** – Most Essential Learning Expectation (DepEd early grade benchmark)
- **Companion Character (Sinta)** – The persistent animated agent that mediates learner interactions in the game, modeling pronunciation and providing emotionally-scaffolded feedback
- **Fluency Tier** – A discrete classification of a single word/phoneme attempt as *Fluent*, *Halting*, or *Syllabic*, derived from ASR confidence and attempt duration
- **Self-Correction** – A learner-initiated correction of a mispronounced word on a subsequent attempt within the same challenge, without the system having triggered the corrective feedback loop, recognized as a strong predictor of reading growth (Clay, 1993)
- **Reading Attempt Record** – A persisted record of a single voice attempt containing student ID, target word/phoneme, stage, timestamp, ASR confidence, total duration, attempt number, fluency tier, and self-correction flag

### 1.4 References

[1] Department of Education (DepEd), "Comprehensive Rapid Literacy Assessment," 2025.
[2] N. K. Librea et al., "Low reading literacy skills of elementary pupils in the Philippines," International Journal of Research and Analytical Studies, 2023.
[3] World Bank, "Learning Poverty Brief: Philippines," 2022.
[4] Y. Sun, "The impact of automatic speech recognition technology on second language pronunciation," Frontiers in Psychology, 2023.
[5] Southeast Asia Primary Learning Metrics (SEA-PLM), "Regional Education Report," 2024.
[6] International Organization for Standardization, "ISO/IEC 25010:2011 Systems and software quality models," 2011.
[7] P. G. Shivakumar & P. Georgiou, "Transfer learning from adult to children for speech recognition," Computer Speech & Language, 2020.
[8] R. E. Mayer, *Multimedia Learning* (2nd ed.), Cambridge University Press, 2009.
[9] L. S. Vygotsky, *Mind in Society*, Harvard University Press, 1978.
[10] J. Nielsen, *Usability Engineering*, Academic Press, 1994.
[11] B. F. Skinner, *The Behavior of Organisms*, Appleton-Century-Crofts, 1938.
[12] E. L. Deci & R. M. Ryan, *Intrinsic Motivation and Self-Determination in Human Behavior*, Plenum Press, 1985.
[13] E. Cagulada, "Marungko Approach," Philippine Journal of Linguistics and Education, 2018.
[14] J. Jayalath & V. Esichaikul, "Gamification to support motivation and engagement in blended e-learning," Journal of Educational Technology Systems, 2022.
[15] R. Canoy & M. Loquias, "Oral reading verification and fluency assessment," 2022.
[16] P. Padilla, "With students' poor literacy, are all teachers now reading teachers?" Philstar.com, 2024.
[17] M. M. Clay, *An Observation Survey of Early Literacy Achievement*, Heinemann, 1993.

---

## 2. Overall Description

### 2.1 Product Perspective

Readlr is a standalone mobile application designed for early-grade literacy development. It uses a client-side application architecture integrated with speech recognition APIs to evaluate pronunciation input in real time. The system operates offline for story progression and UI rendering, while ASR functionality may require internet connectivity when using a cloud-based speech API (e.g., Google Speech-to-Text or OpenAI Whisper). The ASR component operates within a constrained-vocabulary environment focused on predefined phonemes, syllables, CVC words, and Grade 1-level sight words rather than unrestricted conversational speech, improving recognition accuracy for young learners.

The Companion Character, Fluency Tier Classification, Self-Correction Recognition, and Teacher Analytics modules all operate entirely on data already produced by the ASR Feedback Engine (§3.2 Module 2.2) and the Progress Tracking Module (§3.2 Module 3.2). No additional sensors, signal processing, or cloud services are required by these modules in the MVP.

### 2.2 User Characteristics

- **Primary Users:** Grade 1 Filipino learners (ages 6–7) with basic literacy skills and limited digital literacy experience; interact primarily through voice input and visual cues, scaffolded by the Companion Character ("Sinta")
- **Secondary Users:** Teachers who monitor learner and class-wide progress through the **Student Progress Dashboard** (per-learner) and the **Teacher Analytics Module — Fluency Heatmap** (class-wide); teachers do not facilitate gameplay but use the analytics surfaces to identify trouble spots and target pull-aside instruction
- **Administrators/Developers:** Responsible for system configuration, content management, and ASR vocabulary configuration

Users are expected to:

- Follow visual and audio instructions provided by the Companion Character ("Sinta")
- Interact primarily through voice input via the on-screen microphone button
- Engage in short, self-directed learning sessions without teacher facilitation

### 2.3 Constraints

- Requires a device with microphone capability for speech input
- ASR accuracy may vary due to background noise, microphone quality, and phonetic diversity across Filipino mother tongue languages
- Limited to Grade 1 phonics-based vocabulary scope aligned with DepEd MELCs and Marungko sequencing
- Requires stable internet connection if cloud-based ASR is used; core gameplay must function offline
- Must comply with child-friendly UI/UX standards and child data protection principles
- Pilot testing is limited to a selected public elementary school with 60 Grade 1 participants
- The four-week intervention period may not capture long-term retention of pronunciation gains

### 2.4 Assumptions and Dependencies

- Assumes availability of compatible Android devices with functional microphones in the pilot school
- Assumes learners can follow basic visual and audio instructions independently after initial onboarding
- Assumes ASR API or speech engine (Google Speech-to-Text or OpenAI Whisper) is available and functional during development; the chosen ASR service must return a numeric confidence score per recognition result
- Depends on DepEd MELCs and Marungko-based phonics sequencing for all phoneme content design
- Assumes teacher support is available during the initial onboarding and testing phases
- Development follows the Agile framework with iterative sprints per functional component

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 Hardware Interfaces

- Android-based smartphones or tablets (minimum hardware specs TBD)
- Built-in microphone for speech input; must support real-time audio capture
- Speakers or headphones for audio feedback and pronunciation models
- Optional internet connectivity for cloud-based ASR processing

#### 3.1.2 Software Interfaces

- **Speech Recognition API** — Google Speech-to-Text or OpenAI Whisper, configured with grammar constraints and hotword boosting for child speech; must return per-result confidence score and recognition duration
- **Mobile operating system** — Android (minimum version TBD)
- **Local database** for storing session data, learner profiles, progress records, earned stickers, and Reading Attempt Records
- **Game engine framework** — Unity or Flutter-based system for rendering story scenes, the Companion Character, and animations

#### 3.1.3 Communications Interfaces

- HTTPS protocol for ASR API requests when cloud-based processing is used
- Local device storage for offline story progression, progress tracking, sticker collection, and Reading Attempt Record history
- Optional API communication for analytics reporting or application updates

### 3.2 Functional Requirements

#### Module 1: Story-Based Learning System

*(unchanged from v1.0 — see existing §1.1 Story Progression Module and §1.2 Level Navigation Module)*

The game is structured as a single-player narrative campaign divided into three stages aligned with the Marungko phonics progression:

- **Stage 1 — The Valley of Vowels:** 5 introductory levels, each targeting a specific vowel sound (/a/, /e/, /i/, /o/, /u/)
- **Stage 2 — The Blending Bridges:** Consonant-vowel blending levels (e.g., ma, ba, ta)
- **Stage 3 — The CVC Kingdom:** Full CVC words (e.g., cat, man, hat) and Grade 1 sight words

The Micro-Gameplay Loop per level (Hook → Model → Action → Evaluation) is formally mediated by the Companion Character defined in §3.2 Module 2.3.

#### Module 2: Speech Recognition Learning System

##### 2.1 Pronunciation Challenge Module
*(unchanged from v1.0)*

##### 2.2 ASR Feedback Engine
*(unchanged from v1.0, with one addition: the engine shall expose, for each recognition result, the numeric confidence score and the total duration of the captured audio in milliseconds, for consumption by §2.5)*

##### 2.3 Companion Character Module ("Sinta") — NEW (MVP)

The Companion Character module defines a persistent animated agent that mediates learner interactions in the game, operationalizing the "animated companion" already committed in the approved Project Proposal (Part 4 Micro-Gameplay Loop, Part 6 Traceability Matrix). This module reifies Mayer's Contiguity Principle (2009) by spatially and temporally co-locating phonetic modeling with character behavior.

**Functional requirements:**

- The system shall render a single named companion character ("Sinta") visible on all gameplay screens
- The character shall exhibit at least four discrete behavioral states, each driven by gameplay events:
  1. **Idle** — ambient breathing animation while awaiting learner input
  2. **Speaking / Demonstrating** — mouth animates to the phoneme being modeled; mouth shape shall visually differ between /a/, /e/, /i/, /o/, /u/; this state is reused during the corrective feedback loop to re-model the target
  3. **Listening** — perked posture and pulse rings around the character when the microphone is active
  4. **Reacting** — Celebrating animation (bouncing + sparkles) on correct pronunciation, OR Encouraging animation (gentle, non-shaming) on incorrect attempts
- The character shall serve as the visual host of all four micro-gameplay loop steps (Hook, Model, Action, Evaluation)
- Character dialogue shall be delivered in **simple English** appropriate for Grade 1 second-language learners; dialogue strings shall be externalized in a string table for future localization
- No punitive feedback (red X, "wrong" buzzer, frowning face) shall ever be shown; incorrect attempts trigger the Encouraging variant of the Reacting state followed by a re-model via the Speaking / Demonstrating state

**Implementation note (informative):** the character may be implemented as an animated SVG, Lottie file, or sprite — the SRS does not mandate the rendering technology.

**Artifacts:** Use Case Diagram, Use Case Description, Activity Diagram, Wireframe, Character State Diagram

##### 2.4 Self-Correction Recognition — NEW (MVP)

Detects when a learner mispronounces a target on attempt N and produces a correct pronunciation on attempt N+1 within the same challenge, **without** the system having triggered the corrective feedback loop (§2.2) between attempts. This is recognized in reading research (Clay, 1993) as a strong behavioral predictor of reading growth, and is implemented entirely as pattern detection over the attempt history the v1.0 system already records.

**Functional requirements:**

- The system shall maintain, for each active challenge, an ordered list of attempts containing: ASR confidence score, timestamp, and a flag indicating whether the corrective feedback loop was triggered after that attempt
- The system shall classify attempt N+1 as a "Self-Correction" when:
  (a) attempt N's ASR confidence fell below the configured threshold, AND
  (b) attempt N+1's ASR confidence exceeds the threshold, AND
  (c) no explicit corrective feedback prompt was issued between attempts N and N+1
- Self-corrections shall feed the Sticker Reward System (§3.1) as a distinct reward tier ("Self-Correction Star")
- Self-correction counts shall be persisted per learner per session and surfaced in both the Student Progress Dashboard (§3.2) and the Teacher Analytics Module (§3.3)

**Artifacts:** Use Case Diagram, Activity Diagram

##### 2.5 Fluency Tier Classification — NEW (MVP)

Classifies each completed voice attempt into a discrete Fluency Tier — *Fluent*, *Halting*, or *Syllabic* — using ASR confidence and total attempt duration. This operationalizes the proposal's commitments to *Word Pronunciation Accuracy* and *Oral Reading Fluency* (Project Proposal Part 3, measurable indicators) at the per-attempt granularity required to populate the Teacher Analytics Module.

**Functional requirements:**

- The system shall, for each captured voice attempt, persist a `Reading Attempt Record` containing:
  - `studentId`, `wordId`, `stageId`, `timestamp`, `attemptNumber`
  - `accuracy` (ASR confidence score, 0–1)
  - `totalDurationMs` (duration of the captured audio in milliseconds)
  - `selfCorrected` (boolean from §2.4)
  - `tier` (computed per the classifier below)
- The system shall assign a Fluency Tier per attempt using the following classifier:
  - `Syllabic` if `accuracy < 0.70`
  - `Syllabic` if `totalDurationMs > expectedDurationMs × 2.0` (the learner took more than 2× the expected reading time)
  - `Halting` if `totalDurationMs > expectedDurationMs × 1.4` (and not Syllabic)
  - `Fluent` otherwise
- `expectedDurationMs` shall be a per-word configurable value in the Phoneme and Vocabulary Bank (default: 600ms per syllable)
- Tier thresholds (0.70, 1.4×, 2.0×) shall be configurable parameters reviewable in pilot testing
- Each `Reading Attempt Record` shall be persisted to local storage and shall survive application restarts
- Aggregated tier counts shall drive the Teacher Analytics Module (§3.3) and Student Progress Dashboard (§3.2)

**Note on simplicity:** this classifier deliberately uses only signals the v1.0 ASR engine already produces (confidence score, audio duration). It does not require syllable-level segmentation, pitch extraction, or any additional signal processing — making it implementable in days, not weeks.

**Artifacts:** Use Case Diagram, Activity Diagram, Data Model Diagram

#### Module 3: Reward and Engagement System

##### 3.1 Sticker Reward System

*(extended from v1.0)*

In addition to the existing level-completion sticker mechanic, the system shall award a **Self-Correction Star** — a visually distinct sticker tier — whenever the Self-Correction Recognition module (§2.4) classifies an attempt as a self-correction. Self-Correction Stars shall be displayed in a dedicated section of the Sticker Book and shall count toward weekly milestone goals.

##### 3.2 Progress Tracking Module

*(extended from v1.0)*

The Student Progress Dashboard shall additionally display:

- Per-stage Fluency Tier distribution (count and percentage of Fluent / Halting / Syllabic attempts)
- Total Self-Correction Stars earned in the current week

##### 3.3 Teacher Analytics Module — Fluency Heatmap — NEW (MVP)

A teacher-facing analytics surface that aggregates the per-attempt `Reading Attempt Records` (§2.5) into a class-wide view. This module is the teacher-side counterpart to the Student Progress Dashboard (§3.2), drawing from the same engagement-log data committed in the Project Proposal (Part 3, line 217–220) and operationalizing the proposal's "supplementary to the teacher" framing.

**Functional requirements:**

- The system shall present a grid view of students (rows) × words/phonemes for the selected stage (columns), where each cell displays the learner's most recent Fluency Tier for that target, color-coded:
  - Green = Fluent
  - Amber = Halting
  - Red = Syllabic
  - Gray = Not yet attempted
- The system shall display, on hover or tap of a cell, the attempt count and last recorded accuracy for that student × word
- The system shall display a "Class Trouble Spots" panel listing words where ≥40% of the class is classified as Halting or Syllabic, sorted by severity
- The system shall display top-line class metrics: percentage of attempts classified Fluent, total Self-Correction Stars earned this week, and a count of students with three or more Syllabic words ("Pull-Aside Recommended")
- The Heatmap shall support stage switching (Stage 1 / 2 / 3) and shall load within ≤2 seconds for class sizes up to 60 learners
- The Teacher Analytics Module shall be accessible only via a teacher-mode toggle on the role-select screen; it shall not be reachable from the learner gameplay flow

**Artifacts:** Use Case Diagram, Use Case Description, Activity Diagram, Wireframe

### 3.3 Non-Functional Requirements

#### Performance

- System must respond to voice input and deliver ASR evaluation within ≤2–3 seconds of voice detection
- Correct-answer animation and story progression must trigger within ≤2 seconds of successful pronunciation input
- ASR processing must maintain ≥85% recognition accuracy for predefined phoneme inputs under controlled testing conditions
- Application must support smooth animation and scene rendering without lag on mid-range Android devices
- Offline story progression and UI rendering must function without noticeable performance degradation
- Fluency Tier classification (§2.5) must complete within ≤500 ms of ASR result availability
- Companion Character (§2.3) state transitions must render at ≥30 fps on mid-range Android devices
- Teacher Analytics Heatmap (§3.3) must render the class grid within ≤2 seconds for class sizes up to 60 learners

#### Security

- Learner data (session logs, pronunciation scores, progress records, Reading Attempt Records) must be stored securely on-device or via encrypted transmission
- No personally identifiable data beyond a basic learner profile (name or alias, grade level) should be required or stored
- Raw captured audio shall not be persisted beyond the duration of the ASR call
- System must comply with child data protection principles applicable to educational applications

#### Reliability

- Core gameplay features (story progression, phoneme challenges, sticker rewards, Companion Character, Fluency Tier classification, Self-Correction Recognition) must function whenever the ASR service is available; the system must gracefully degrade when ASR is unavailable by triggering a retry prompt
- ASR failure must not crash the system
- Application must maintain learner progress, session data, and Reading Attempt Records even after unexpected shutdown or device interruption
- System must target ≥80% pronunciation accuracy scores on CVC word assessments and ≥75% level completion rates across all game stages as functional benchmarks for readiness evaluation

#### Usability

- All learner-facing UI elements must be reachable by touch with a minimum 44×44 px tap target
- The Companion Character shall be the visual anchor of every gameplay screen
- Failure feedback shall never use a punitive visual (red X, frown, buzzer); the Encouraging variant of the Companion Character's Reacting state shall be used instead

---

## Appendix A — Traceability of v2.0 Additions to Approved Project Proposal

| New SRS Section | Maps to Project Proposal Element |
|---|---|
| §3.2 Module 2.3 (Companion Character "Sinta") | Part 4 Micro-Gameplay Loop step 1 ("An animated companion introduces a narrative conflict"); GO2 specific obj ("animated companion character demonstrates the correct mouth shape") |
| §3.2 Module 2.4 (Self-Correction Recognition) | GO3 ("Promote sustained learner engagement"); supports Part 3 measurable indicator "Mispronunciation Error Reduction" |
| §3.2 Module 2.5 (Fluency Tier Classification) | Part 3 measurable indicators (Word Pronunciation Accuracy, Oral Reading Fluency); RQ1, RQ3, RQ4 |
| §3.1 Sticker Self-Correction Star | GO3 ("digital Sticker Book reward system"); Skinner positive reinforcement (1938) |
| §3.2 Module 3.3 (Teacher Analytics — Fluency Heatmap) | Part 3 line 217–220 ("engagement logs"); GO3 specific obj ("Track and log individual learner session data"); Proposal framing as supplementary to the teacher |

---

## Appendix B — Phase 2 / Future Work (Out of MVP Scope)

The following research-grade enhancements have been explored and are documented here for transparency and future research extension. **They are not part of the MVP scope and are not committed for delivery in the current capstone timeline.** They may be pursued in a successor study or post-pilot iteration.

### B.1 Prosody-Aware Scoring

A pitch-contour comparison feature would measure the expressive-reading dimension of fluency identified by the National Reading Panel (2000) and Kuhn & Stahl (2003). The approach uses on-device fundamental frequency (F0) extraction and Dynamic Time Warping against pre-recorded native-speaker reference contours. This requires audio signal processing, native-speaker recording sessions, and tuning that exceed the MVP timeline; it is preserved as a Phase 2 enhancement.

### B.2 Phil-IRI-Compatible Report Export

An export action producing per-student summary reports in a Phil-IRI-compatible format (PDF or CSV) for use in existing DepEd reporting workflows. Deferred to Phase 2 pending stakeholder review of the exact report format with partner schools.

### B.3 Per-Syllable Tempo Tracking

A finer-grained version of §2.5 Fluency Tier Classification that tracks inter-syllable gap timing via audio energy envelope analysis. The MVP classifier uses total attempt duration as a coarser but reliable proxy; per-syllable timing is a Phase 2 refinement.
