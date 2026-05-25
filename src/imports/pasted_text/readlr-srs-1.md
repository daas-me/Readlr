
CEBU INSTITUTE OF TECHNOLOGY
UNIVERSITY


COLLEGE OF COMPUTER STUDIES





Software Requirements Specifications
for
Readlr
















Change History









Table of Contents

Change History	2
Table of Contents	3
1.	Introduction	4
1.1.	Purpose	4
1.2.	Scope	4
1.3.	Definitions, Acronyms and Abbreviations	4
1.4.	References	4
2.	Overall Description	5
2.1.	Product perspective	5
2.2.	User characteristics	5
2.4. 	Constraints	5
2.5. 	Assumptions and dependencies	6
3.	Specific Requirements	7
3.1.	External interface requirements	7
3.1.1.	Hardware interfaces	7
3.1.2.	Software interfaces	7
3.1.3.	Communications interfaces	7
3.2.	Functional requirements	7
Module 1	7
Module 2	8
3.4	Non-functional requirements	8
Performance	8
Security	8
Reliability	8





 







Introduction

Purpose
The purpose of this document is to provide a detailed description of the Readlr system, a gamified, storytelling-based mobile application integrated with Automated Speech Recognition (ASR) designed to improve phonemic awareness, pronunciation accuracy, and early reading readiness among Grade 1 learners in Philippine elementary schools. This document serves as a guide for developers, researchers, and stakeholders to ensure alignment with system requirements and educational objectives.
Scope
Readlr is a mobile-based educational application for Grade 1 learners that combines gamification, storytelling, and speech recognition technology to support early literacy development. The application targets 60 Grade 1 participants in a selected Philippine public elementary school through a four-week quasi-experimental intervention, functioning as a self-directed learning tool requiring no teacher facilitation during use.
The system includes the following core functionalities:
Story-Based Learning Adventure System — a three-stage narrative campaign (Valley of Vowels, Blending Bridges, CVC Kingdom) aligned with the Marungko phonics sequence and DepEd MELCs
Phonetic Challenge Module — story-embedded tasks targeting phonemes, CVC words, and early sight words that require correct pronunciation to advance
Automated Speech Recognition (ASR) Feedback Engine — real-time pronunciation evaluation using confidence score thresholds with corrective feedback loops
Reward and Sticker Collection System — digital Sticker Book with collectibles representing local Filipino animals and story characters
Student Progress Tracking Dashboard — session-based logs of pronunciation accuracy, level completion rates, and reward milestone achievement
Phoneme and Vocabulary Learning Bank — sequenced library of Grade 1-appropriate phonemes and words with native-speaker audio models
Definitions, Acronyms and Abbreviations
ASR – Automated Speech Recognition
MELCs – Most Essential Learning Competencies (DepEd curriculum framework)
CVC – Consonant-Vowel-Consonant words (e.g., “cat”, “dog”)
Phoneme – The smallest unit of sound in speech
Gamification – Use of game elements in non-game contexts to drive engagement
ISO/IEC 25010 – Software quality evaluation model
WCPM – Words Correct Per Minute (reading fluency metric)
UI/UX – User Interface / User Experience
EGRA – Early Grade Reading Assessment
Phil-IRI – Philippine Informal Reading Inventory
ECARP – Every Child A Reader Program
Marungko – Government-endorsed localized phonetic reading strategy for Filipino learners
MVP – Minimum Viable Product
MELE – Most Essential Learning Expectation (DepEd early grade benchmark)
References
[1] Department of Education (DepEd), “Comprehensive Rapid Literacy Assessment,” 2025.
[2] N. K. Librea et al., “Low reading literacy skills of elementary pupils in the Philippines,” International Journal of Research and Analytical Studies, 2023.
[3] World Bank, “Learning Poverty Brief: Philippines,” 2022.
[4] Y. Sun, “The impact of automatic speech recognition technology on second language pronunciation,” Frontiers in Psychology, 2023.
[5] Southeast Asia Primary Learning Metrics (SEA-PLM), “Regional Education Report,” 2024.
[6] International Organization for Standardization, “ISO/IEC 25010:2011 Systems and software quality models,” 2011.
[7] P. G. Shivakumar & P. Georgiou, “Transfer learning from adult to children for speech recognition,” Computer Speech & Language, 2020.
[8] R. E. Mayer, Multimedia Learning (2nd ed.), Cambridge University Press, 2009.
[9] L. S. Vygotsky, Mind in Society, Harvard University Press, 1978.
[10] J. Nielsen, Usability Engineering, Academic Press, 1994.
[11] B. F. Skinner, The Behavior of Organisms, Appleton-Century-Crofts, 1938.
[12] E. L. Deci & R. M. Ryan, Intrinsic Motivation and Self-Determination in Human Behavior, Plenum Press, 1985.
[13] E. Cagulada, “Marungko Approach,” Philippine Journal of Linguistics and Education, 2018.
[14] J. Jayalath & V. Esichaikul, “Gamification to support motivation and engagement in blended e-learning,” Journal of Educational Technology Systems, 2022.
[15] R. Canoy & M. Loquias, “Oral reading verification and fluency assessment,” 2022.
[16] P. Padilla, “With students’ poor literacy, are all teachers now reading teachers?” Philstar.com, 2024.
Overall Description

Product Perspective
Readlr is a standalone mobile application designed for early-grade literacy development. It uses a client-side application architecture integrated with speech recognition APIs to evaluate pronunciation input in real time. The system operates offline for story progression and UI rendering, while ASR functionality may require internet connectivity when using a cloud-based speech API (e.g., Google Speech-to-Text or OpenAI Whisper). The ASR component operates within a constrained-vocabulary environment focused on predefined phonemes, syllables, CVC words, and Grade 1-level sight words rather than unrestricted conversational speech, improving recognition accuracy for young learners.
User Characteristics
Primary Users: Grade 1 learners (ages 6–7) with basic literacy skills and limited digital literacy experience; interact primarily through voice input and visual cues
Secondary Users: Teachers who may monitor learner progress through the progress dashboard
Administrators/Developers: Responsible for system configuration, content management, and ASR vocabulary configuration
Users are expected to:
Follow visual and audio instructions provided by the animated companion character
Interact primarily through voice input via the on-screen microphone button
Engage in short, self-directed learning sessions without teacher facilitation
Constraints
Requires a device with microphone capability for speech input
ASR accuracy may vary due to background noise, microphone quality, and phonetic diversity across Filipino mother tongue languages
Limited to Grade 1 phonics-based vocabulary scope aligned with DepEd MELCs and Marungko sequencing
Requires stable internet connection if cloud-based ASR is used; core gameplay must function offline
Must comply with child-friendly UI/UX standards and child data protection principles
Pilot testing is limited to a selected public elementary school with 60 Grade 1 participants
The four-week intervention period may not capture long-term retention of pronunciation gains
Assumptions and Dependencies
Assumes availability of compatible Android devices with functional microphones in the pilot school
Assumes learners can follow basic visual and audio instructions independently after initial onboarding
Assumes ASR API or speech engine (Google Speech-to-Text or OpenAI Whisper) is available and functional during development
Depends on DepEd MELCs and Marungko-based phonics sequencing for all phoneme content design
Assumes teacher support is available during the initial onboarding and testing phases
Development follows the Agile framework with iterative sprints per functional component (ASR engine, story progression, phoneme modules, reward system)
Specific Requirements

External Interface Requirements
Hardware Interfaces
Android-based smartphones or tablets (minimum hardware specs TBD)
Built-in microphone for speech input; must support real-time audio capture
Speakers or headphones for audio feedback and pronunciation models
Optional internet connectivity for cloud-based ASR processing
Software Interfaces
Speech Recognition API — Google Speech-to-Text or OpenAI Whisper, configured with grammar constraints and hotword boosting for child speech
Mobile operating system — Android (minimum version TBD)
Local database for storing session data, learner profiles, progress records, and earned stickers
Game engine framework — Unity or Flutter-based system for rendering story scenes and animations
Communications Interfaces
HTTPS protocol for ASR API requests when cloud-based processing is used
Local device storage for offline story progression, progress tracking, and sticker collection
Optional API communication for analytics reporting or application updates
Functional Requirements
Module 1: Story-Based Learning System
This module governs the narrative campaign and level structure of Readlr. The game is structured as a single-player narrative campaign divided into three stages aligned with the Marungko phonics progression:
Stage 1 — The Valley of Vowels: 5 introductory levels, each targeting a specific vowel sound (/a/, /e/, /i/, /o/, /u/). The player must accurately repeat the isolated phoneme to clear environmental obstacles.
Stage 2 — The Blending Bridges: Levels focusing on consonant-vowel blending (e.g., ma, ba, ta), combining sounds from Stage 1.
Stage 3 — The CVC Kingdom: Advanced levels requiring pronunciation of full CVC words (e.g., cat, man, hat) and Grade 1 sight words to unlock items and progress the story.
1.1 Story Progression Module
The Micro-Gameplay Loop per level follows four steps:
Hook — An animated companion introduces a narrative conflict (e.g., “The bridge is broken! Say the magic sound to fix it!”)
Model — The companion models the correct pronunciation with on-screen text and high-quality native-speaker audio
Action — The child taps the microphone icon and speaks into the device
Evaluation — If accurate, the character executes the action, the story advances, and a sticker is earned; if inaccurate, the corrective feedback loop triggers a scaffolded retry
Additional requirements:
Displays interactive, illustrated narrative-based levels appropriate for ages 6–7
Guides learner through phonetic challenges embedded in the story context
Unlocks the next story chapter upon level completion
Story progression and UI rendering must function fully offline
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
1.2 Level Navigation Module
Allows learners to progress through structured phonics levels in the sequence: vowels → consonant-vowel blends → CVC words
Controls difficulty progression in accordance with Vygotsky’s scaffolding principle (1978), moving from simpler to more complex phonetic targets
Displays a level map showing completed, current, and locked stages
Prevents level skipping; each stage must be completed to unlock the next
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
Module 2: Speech Recognition Learning System
2.1 Pronunciation Challenge Module
Prompts learner to pronounce a target phoneme, syllable, or CVC word embedded in a story challenge (e.g., saying /m/ to make the character jump, or reading a word to unlock a treasure chest)
Displays the target word or phoneme with on-screen text and the companion audio model before capturing input
Captures voice input via microphone upon the learner tapping the on-screen microphone button
Sends captured audio to the ASR system for real-time evaluation against the correct phonetic model
Each voice interaction must complete within ≤3 seconds of input, consistent with Nielsen’s (1994) usability guideline for interactive system response time
Implements ASR input validation that detects silent, incomplete, or unclear voice entries and re-prompts the learner, targeting a ≥70% reduction in unrecognized pronunciation attempts during usability testing
Allows multiple attempts per challenge before providing additional scaffolding support
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
2.2 ASR Feedback Engine
Evaluates learner pronunciation using a confidence score threshold against the predefined phoneme or CVC word target
Triggers correct-answer animation and story progression within ≤2 seconds of voice input detection when the confidence score exceeds the threshold
Activates corrective feedback loop when the confidence score falls below the threshold, targeting ≥75% successful correction on the second attempt
Corrective feedback loop provides: (a) visual mouth-shape guidance from the animated companion, (b) correct native-speaker audio model of the target sound, and (c) retry prompt
Detects abandoned or silent game prompts and re-engages the learner with a visual and audio cue, targeting a ≥70% reduction in abandoned game interactions during usability testing
ASR failure (e.g., network error) must not crash the system; the system must trigger a retry feedback prompt instead
Targets ≥85% ASR recognition accuracy on predefined phoneme inputs during controlled testing, using grammar constraints and hotword boosting for child speech
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
Module 3: Reward and Engagement System
3.1 Sticker Reward System
Awards a collectible digital sticker representing local Filipino animals or story characters upon completing a level with high pronunciation accuracy
Organizes stickers in a digital “Sticker Book” viewable from the main menu
Unlocks additional collectibles and story chapter previews based on performance milestones
Targets ≥70% daily sticker milestone completion among active users during the study period, grounded in Skinner’s positive reinforcement theory (1938)
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
3.2 Progress Tracking Module
Records learner performance per session, including: pronunciation accuracy scores, completed levels, voice attempt counts per level, session duration, and session frequency
Displays a child-friendly progress dashboard showing completed levels, earned stickers, and pronunciation accuracy trends
Generates weekly in-game progress summaries to reinforce intrinsic motivation and encourage continued voluntary participation, consistent with Self-Determination Theory (Deci & Ryan, 1985)
Stores historical learning progress across multiple sessions; progress must be maintained even after unexpected application shutdown
Logs data sufficient to measure: ≥75% weekly active user retention, ≥70% daily reward milestone achievement, and ≥60% consistency in voluntary use during the study period
Artifacts:
Use Case Diagram
Use Case Description
Activity Diagram
Wireframe
Non-Functional Requirements
Performance
System must respond to voice input and deliver ASR evaluation within ≤2–3 seconds of voice detection
Correct-answer animation and story progression must trigger within ≤2 seconds of successful pronunciation input
ASR processing must maintain ≥85% recognition accuracy for predefined phoneme inputs under controlled testing conditions
Application must support smooth animation and scene rendering without lag on mid-range Android devices
Offline story progression and UI rendering must function without noticeable performance degradation
Security
Learner data (session logs, pronunciation scores, progress records) must be stored securely on-device or via encrypted transmission
No personally identifiable data beyond a basic learner profile (name or alias, grade level) should be required or stored
System must comply with child data protection principles applicable to educational applications
Reliability
Core gameplay features (story progression, phoneme challenges, sticker rewards) must function fully offline
ASR failure must not crash the system; the application must gracefully trigger a retry feedback prompt
Application must maintain learner progress and session data even after unexpected shutdown or device interruption
System must target ≥80% pronunciation accuracy scores on CVC word assessments and ≥75% level completion rates across all game stages as functional benchmarks for readiness evaluation
