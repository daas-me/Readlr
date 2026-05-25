CEBU INSTITUTE OF TECHNOLOGY
UNIVERSITY
COLLEGE OF COMPUTER STUDIES
Software Requirements Specifications
for
Readlr
Change History
Version Date Description Author
1.0 2026-05-15 Initial SRS Draft Dwight
Ta
b
l
e
o
f
C
o
n
t
e
n
t
s
C
h
a
n
g
e
H
i
s
t
o
ry
2
Ta
b
l
e
o
f
C
o
n
t
e
n
t
s
3
1
.
I
n
t
r
o
d
u
c
t
i
o
n
4
1.1. Purpose
4
1.2. Scope
4
1.3. Definitions, Acronyms and Abbreviations
4
1.4. References
4
2
.
O
v
e
r
a
l
l
D
e
s
c
r
i
p
t
i
o
n
6
2.1. Product perspective
6
2.2. User characteristics
6
2.4. Constraints
6
2.5. Assumptions and dependencies
7
3
.
S
p
e
c
i
f
i
c
R
e
q
u
i
r
e
m
e
n
t
s
8
3.1. External interface requirements
8
3.1.1. Hardware interfaces
8
3.1.2. Software interfaces
8
3.1.3. Communications interfaces
8
3.2. Functional requirements
8
 Module 1: Story-Based Learning System
9
Module 2: Speech Recognition Learning System
9
Module 3: Reward and Engagement System 10
3.4 Non-functional requirements
1
1
Performance
1
1
Security
1
1
Reliability
1
1
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
1. Introduction
1.1. Purpose
The purpose of this document is to provide a detailed description of the Readlr system, a gamified,
storytelling-based mobile application integrated with automated speech recognition (ASR) designed to improve
phonemic awareness, pronunciation accuracy, and early reading readiness among Grade 1 learners in
Philippine elementary schools. This document serves as a guide for developers, researchers, and stakeholders
to ensure alignment with system requirements and educational objectives.
1.2. Scope
Readlr is a mobile-based educational application designed for Grade 1 learners that combines gamification,
storytelling, and speech recognition technology to support early literacy development.
The system includes the following core functionalities:
● Story-Based Learning Adventure System
● Phonetic Challenge Module (phonemes, CVC words, sight words)
● Automated Speech Recognition (ASR) Feedback Engine
● Reward and Sticker Collection System
● Student Progress Tracking Dashboard
● Phoneme and Vocabulary Learning Bank
The application aims to function as a self-directed learning tool that enhances pronunciation and phonemic
awareness through interactive gameplay.
1.3. Definitions, Acronyms and Abbreviations
● ASR – Automated Speech Recognition
● MELCs – Most Essential Learning Competencies (DepEd curriculum framework)
● CVC – Consonant-Vowel-Consonant words (e.g., “cat”, “dog”)
● Phoneme – The smallest unit of sound in speech
● Gamification – Use of game elements in non-game contexts
● ISO/IEC 25010 – Software quality evaluation model
● WCPM – Words Correct Per Minute (reading fluency metric)
● UI/UX – User Interface / User Experience
1.4. References
[1] Department of Education (DepEd), “Comprehensive Rapid Literacy Assessment,” 2025.
[2] N. K. Librea et al., “Low reading literacy skills of elementary pupils in the Philippines,” 2023.
[3] World Bank, “Learning Poverty Brief: Philippines,” 2022.
[4] Y. Sun, “Impact of ASR technology on pronunciation learning,” 2023.
[5] Southeast Asia Primary Learning Metrics (SEA-PLM), “Regional Education Report,” 2024.
Page 4 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
[6] International Organization for Standardization, “ISO/IEC 25010:2011 Systems and software quality models,”
2011.
Page 5 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
2. Overall Description
2.1. Product perspective
Readlr is a standalone mobile application designed for early-grade literacy development. It uses a client-side
application architecture integrated with speech recognition APIs to evaluate pronunciation input in real time.
The system operates offline for story progression and UI rendering, while ASR functionality may require internet
connectivity depending on implementation (e.g., cloud-based speech API).
2.2. User characteristics
● Primary Users: Grade 1 learners (ages 6–7) with basic literacy skills and limited digital literacy
experience
● Secondary Users: Teachers who may monitor learner progress
● Administrators/Developers: Responsible for system configuration and content management
Users are expected to:
● Follow visual and audio instructions
● Interact primarily through voice input
● Engage in short attention-span learning sessions
2.4. Constraints
● Requires a device with microphone capability for speech input
● Dependent on ASR accuracy, which may vary due to noise and accent differences
● Limited to Grade 1 phonics-based vocabulary scope
● Requires stable internet connection if cloud-based ASR is used
● Must comply with child-friendly UI/UX standards
Page 6 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
2.5. Assumptions and dependencies
3. Assumes availability of mobile devices in pilot school setting
4. Assumes learners can follow basic visual/audio instructions independently
5. Assumes ASR API or speech engine is available and functional during development
6. Depends on DepEd MELCs and Marungko-based phonics sequencing for content design
7. Assumes teacher support during initial testing phase
Page 7 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
3. Specific Requirements
7.1. External interface requirements
3.1.1. Hardware interfaces
● Mobile devices (Android-based smartphones/tablets)
● Built-in microphone for speech input
● Speakers or headphones for audio feedback
● Optional internet connectivity for ASR processing
3.1.2. Software interfaces
● Speech Recognition API (e.g., Google Speech-to-Text or equivalent ASR service)
● Mobile operating system (Android minimum version TBD)
● Local database for storing progress and user data
● Game engine framework (e.g., Unity or Flutter-based system)
3.1.3. Communications interfaces
● HTTPS protocol for ASR requests (if cloud-based)
● Local device storage for offline progress tracking
● Optional API communication for analytics or updates
Page 8 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
7.2. Functional requirements
Module 1: Story-Based Learning System
1.1 Story Progression Module
● Displays interactive narrative-based levels
● Guides learner through phonetic challenges
● Unlocks next story chapter upon completion
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
● Wireframe
1.2 Level Navigation Module
● Allows learners to progress through structured phonics levels
● Controls difficulty progression (vowels → blends → CVC words)
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
● Wireframe
Module 2: Speech Recognition Learning System
2.1 Pronunciation Challenge Module
● Prompts learner to pronounce phonemes or words
● Captures voice input via microphone
● Sends input to ASR system for evaluation
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
Page 9 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
● Wireframe
2.2 ASR Feedback Engine
● Evaluates pronunciation using confidence score thresholds
● Triggers success animation if score is above threshold
● Activates corrective feedback loop if below threshold
● Provides:
○ correct audio model
○ visual mouth-shape guidance
○ retry prompts
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
● Wireframe
Module 3: Reward and Engagement System
3.1 Sticker Reward System
● Awards digital stickers for completed challenges
● Unlocks collectibles based on performance
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
● Wireframe
3.2 Progress Tracking Module
● Records learner performance per session
● Displays completed levels and accuracy score
● Stores historical learning progress
Artifacts:
● Use Case Diagram
● Use Case Description
● Activity Diagram
Page 10 of 11
Software Requirements Specifications
Readlr
Document Version: 1.0
Published Date: 15 MAY 2026
● Wireframe
3.4 Non-functional requirements
Performance
● System should respond to voice input within 2–3 seconds
● ASR processing should maintain acceptable accuracy under moderate noise conditions
● Application should support smooth animation rendering without lag on mid-range devices
Security
● Learner data must be stored securely and locally or via encrypted transmission
● No personal identifiable data beyond basic learner profile should be required
● System must comply with child data protection principles
Reliability
● Application must function offline for core gameplay features
● ASR failure should not crash the system but trigger retry feedback
● System should maintain progress even after unexpected shutdown
