Project Proposal Guide (Weeks 7–8)
This worksheet guides the team in developing the Capstone/Software Engineering
Project Proposal. It integrates the refined problem statement, findings from the Review of
Related Literature (RRL), and the proposed solution concept.
Team Information
Project Title: Readlr: A Gamified, Speech-Recognition Assisted Phonetics Learning
Platform for Grade 1 Learners in the Philippines
Project Short Description (<20 words): A self-directed, gamified phonetics app that uses
speech recognition to improve Grade 1 students' word pronunciation through interactive
storytelling.
Team Code:2526-sem2-it332-27
Members:
1. Abella, Rafael Antonio S.
2. Inoc, Nicole John P.
3. Lapis, Andrae Louise U.
4. Rentuma, Trixie Ann V.
5. Sabandal, Dwight Angelo A.
PART 1: Introduction (Approx. 300 words)
Reading proficiency, particularly accurate word pronunciation, stands as one of the most
foundational competencies a child must develop during the early years of formal schooling. Yet
in the Philippines, this foundation remains alarmingly fragile. According to the World Bank
(2022), at least 90% of Filipino children aged 10 struggle to read or understand simple text, a
crisis that originates as early as Grade 1, when children are first introduced to decoding written
language. The Department of Education's Comprehensive Rapid Literacy Assessment further
revealed that nearly half of students from Grades 1 to 3 were not reading at their respective
grade levels at the end of School Year 2024–2025 (DepEd, 2025), underscoring the urgency of
early phonetic and reading intervention.
A critical but often underexamined dimension of this literacy crisis is pronunciation. Librea et al.
(2023) identified phonemic awareness, which is the capacity to absorb individual sounds of
letters required for word recognition, as one of the most significant problems impeding
children's reading comprehension in Philippine elementary schools. Compounding this, Padilla
(2024) noted that some teachers who instruct beginning readers do not correctly model letter
sounds, inadvertently teaching students inaccurate phonetic patterns from the earliest stages of
literacy development. Canoy and Loquias (2022) further confirmed that mispronounced or
substituted words among elementary students directly hindered reading fluency and
comprehension performance.
Despite the availability of reading programs such as ECARP and Phil-IRI, these interventions
remain largely paper-based, teacher-dependent, and insufficient in addressing pronunciation
development at scale. The SEA-PLM (2024) assessment found that the Philippines' average
reading score was statistically unchanged from 2019, with half of Filipino Grade 5 students still
unable to understand simple written texts, which is evidence that existing approaches are not
producing the systemic gains needed. The identified research gap lies in the absence of a locally
contextualized, technology-driven tool that specifically targets phonetic pronunciation for
beginning Grade 1 readers through interactive, child-centered means.
To address this gap, this project proposes a gamified pronunciation and phonetics learning
application for Grade 1 Filipino learners. Using a storytelling-based approach, learners become
the main character of an interactive adventure, encountering challenges that require correct
pronunciation of phonetic sounds and vocabulary words to advance. The system employs speech
recognition technology to deliver immediate and accurate pronunciation feedback (Sun, 2023),
while game mechanics such as points, badges, and narrative rewards sustain motivation and
engagement (Jayalath & Esichaikul, 2022). By merging immersive storytelling, gamification, and
phonetics instruction, this application seeks to transform early pronunciation learning into an
effective and enjoyable experience, one that builds speaking confidence, decoding skills, and
reading readiness from the very start.
PART 2: Objectives
General Objectives:
General Objective 1: Improve Phonemic Awareness and Pronunciation Accuracy Through
a Gamified, Voice-Driven Storytelling Application
● IImprove the phonemic awareness and pronunciation accuracy of Grade 1 learners by
utilizing Automated Speech Recognition (ASR) as the primary game controller,
targeting ≥80% pronunciation accuracy scores on CVC word assessments — consistent
with DepEd's MELE benchmark for early grade reading readiness — ≥75% level
completion rates across all game stages, and ≥85% successful ASR recognition of
predefined phoneme inputs during gameplay sessions, based on constrained-vocabulary
ASR performance standards reported in prior child-directed speech recognition studies
(Shivakumar & Georgiou, 2020).
General Objective 2: Enhance Early Reading Readiness Through Voice-Activated Gameplay
and Immediate Corrective Feedback
● Enhance early reading readiness among Grade 1 students by embedding an
ASR-powered corrective feedback system into a narrative-based game, grounded in
Mayer's Multimedia Learning Theory (2009) and Vygotsky's Zone of Proximal
Development (1978), achieving ≥80% of learners demonstrating measurable
improvement in phonemic decoding on post-test assessments, ≥75% of incorrect
pronunciation attempts successfully corrected within the in-game feedback loop, and a
reduction of phonetic mispronunciation errors by at least 30% from pre-intervention to
post-intervention oral reading assessments.
General Objective 3: Promote Sustained Learner Engagement Through Gamification
Mechanics, Reward Systems, and Self-Directed Interaction
● Promote consistent and measurable self-directed learning engagement — defined as
unprompted, voluntary interaction with the application outside of teacher-facilitated
sessions — among Grade 1 learners through gamification elements including level
progression, voice-activated interactions, and a digital Sticker Book reward system
anchored on Skinner's operant conditioning theory of positive reinforcement (1938),
targeting ≥75% weekly active user retention, ≥70% daily reward milestone achievement,
and ≥60% consistency in voluntary application use during the study period.
Specific Objectives
Specifically, this study seeks to:
For General Objective 1: Improve Phonemic Awareness and Pronunciation Accuracy
Through a Gamified, Voice-Driven Storytelling Application
● Formulate a locally contextualized phonetics module by identifying and sequencing
specific phonemes, CVC words, and early sight words aligned with DepEd's Most
Essential Learning Competencies (MELCs) and the Marungko approach (Cagulada, 2018)
— a government-endorsed localized phonetic reading strategy — with Level 1 targeting
vowel sounds /a/, /e/, /i/, /o/, /u/ and Level 2 targeting consonant-vowel blending,
covering all phoneme targets prescribed in the Grade 1 Filipino Language curriculum.
● Integrate an existing pre-trained ASR system (e.g., Google Speech-to-Text or OpenAI
Whisper) configured for constrained pronunciation evaluation using a predefined
vocabulary of phonemes and CVC words appropriate for Grade 1 learners, with grammar
constraints and hotword boosting applied to improve recognition accuracy for child
speech, targeting ≥85% recognition accuracy during controlled testing — in alignment
with the accuracy threshold reported by Shivakumar and Georgiou (2020) for
child-directed ASR systems.
● Implement a pronunciation confidence threshold scoring mechanism where inputs
exceeding the threshold trigger correct-answer animations and story progression within
≤2 seconds of voice input detection, ensuring seamless and motivating gameplay
response time.
● Design a centralized in-game progress dashboard that displays the learner's
pronunciation scores, completed levels, and earned stickers in an organized and
child-friendly interface, evaluated for usability using the ISO/IEC 25010 software quality
model.
● Create ASR input validation prompts that detect silent, incomplete, or unclear voice
entries and re-prompt the learner, targeting a reduction of unrecognized or unanswered
pronunciation attempts by at least ≥70% during usability testing compared to baseline
attempts without validation prompts.
For General Objective 2: Enhance Early Reading Readiness Through Voice-Activated
Gameplay and Immediate Corrective Feedback
● Design a linear, level-based narrative progression map set within a contextualized story
quest (e.g., finding missing letters to save a storybook kingdom), where each level
directly maps to a specific phoneme or CVC word target from the DepEd-aligned
phonetics module, structured in accordance with Vygotsky's scaffolding principle (1978)
by progressing from simpler vowel sounds to more complex consonant blends.
● Implement voice-activated game mechanics where the player must correctly pronounce
a letter sound or CVC word to execute game actions — such as saying the /m/ sound to
make the character jump, or reading a word to unlock a treasure chest — with each
voice interaction completing within ≤3 seconds of input, consistent with Nielsen's
(1994) usability guideline for system response time in interactive applications.
● Embed an interactive corrective feedback loop for inputs below the confidence
threshold, where an animated companion character demonstrates the correct mouth
shape, plays the correct audio model of the target sound, and prompts the learner to
retry, grounded in Mayer's Contiguity Principle (2009) — targeting ≥75% successful
correction on the second attempt during testing.
● Conduct a quasi-experimental pre-test and post-test study using a modified Early Grade
Reading Assessment (EGRA) or Phil-IRI oral reading instrument on a target group of
Grade 1 learners to quantitatively measure improvements in phonemic decoding and
pronunciation accuracy after the intervention period.
● Implement structured input validation that detects unanswered or silent game prompts
and re-engages the learner with a visual and audio cue, targeting a reduction of
abandoned game interactions by at least ≥70% during usability testing.
For General Objective 3: Promote Sustained Learner Engagement Through Gamification
Mechanics, Reward Systems, and Self-Directed Interaction
● Implement a digital "Sticker Book" reward system where learners earn a collectible
visual sticker representing local Filipino animals or story characters upon completing a
level with high pronunciation accuracy, grounded in Skinner's positive reinforcement
theory (1938), targeting ≥70% daily sticker milestone completion among active users
during the study period.
● Design and evaluate a child-friendly game interface with responsive voice controls,
age-appropriate visuals, and animated companions using the ISO/IEC 25010 software
quality model across the dimensions of functional suitability, usability, reliability, and
performance efficiency, with evaluation feedback gathered from at least five IT experts
and three early childhood educators.
● Track and log individual learner session data — including session frequency, session
duration, level completion rates, voice attempt counts per level, and reward milestone
achievement — to operationalize and measure self-directed engagement as defined in
General Objective 3 throughout the study period.
● Develop weekly in-game progress summaries displayed within the application that
present completed levels, pronunciation accuracy trends, and collected stickers to
reinforce intrinsic motivation and encourage continued voluntary participation,
consistent with Self-Determination Theory's emphasis on competence and autonomy as
drivers of sustained engagement (Deci & Ryan, 1985)..
Research Questions
This study is guided by the following research questions:
1. To what extent does the use of the gamified pronunciation and phonetics learning
application improve the word pronunciation accuracy of Grade 1 students, based on
pre-test and post-test score comparisons?
2. Is there a statistically significant improvement in the phonemic awareness of Grade 1
students after completing the story-based application, as measured by pre-test and
post-test assessment results?
3. How much improvement in oral reading fluency is observed among Grade 1 students
before and after the self-directed use of the gamified application?
4. To what degree does the application reduce the frequency of phonetic mispronunciation
errors among Grade 1 learners from pre-intervention to post-intervention oral reading
assessments?
5. How engaged are Grade 1 students in self-directed learning throughout the application,
as reflected by session frequency, level completion rates, and reward milestone
achievement?
PART 3: Methods
The proposed solution is a gamified pronunciation and phonetics learning application
designed for Grade 1 students in Philippine public elementary schools. The application operates
as a self-directed learning tool, meaning students independently navigate and interact with the
system without requiring teacher facilitation during use. The app employs a storytelling-based
approach where the learner becomes the main character of an interactive adventure,
progressing through story levels that present real phonetic challenges such as unlocking a door,
helping a character, or finding an item, all of which require the student to correctly pronounce
specific sounds, syllables, or vocabulary words in order to advance. The system uses built-in
speech recognition technology to evaluate each learner's pronunciation in real time and provide
immediate corrective feedback. To ensure technical feasibility and improve recognition accuracy
among young learners, the ASR component operates within a constrained vocabulary
environment that focuses only on predefined phonemes, syllables, CVC words, and Grade 1-level
sight words rather than unrestricted conversational speech. Upon successfully completing each
challenge, students earn points, badges, and narrative rewards that sustain motivation and
encourage continued self-directed engagement. The primary users of this application are Grade
1 elementary learners aged 6 to 7 years old.
The development methodology will follow the Agile development framework, supporting
iterative design, continuous feedback, and incremental feature deployment. Each sprint will
focus on a specific functional component of the application, such as the speech recognition
engine, the story level progression system, the phoneme challenge modules, and the reward and
badge system, allowing for rapid testing, refinement, and quality assurance at each stage of
development. Validation will involve usability testing with target-age learners and a pilot
implementation conducted in a selected public elementary school environment.
To prove the application's educational effectiveness and directly address the defined objectives,
student learning outcomes will be evaluated through a pre-test and post-test measurement
design using the following measurable indicators:
● Word Pronunciation Accuracy. The percentage improvement in correct pronunciation
scores between pre-test and post-test assessments, targeting a minimum gain of 30%
among experimental group participants after the four-week intervention period.
● Phonemic Awareness. The percentage increase in students' ability to correctly identify,
segment, and blend phonetic sounds, measured through a standardized phonemic
awareness assessment administered before and after the intervention, targeting a
minimum improvement of 25%.
● Oral Reading Fluency. The improvement in words read correctly per minute (WCPM)
between pre-test and post-test oral reading fluency assessments, targeting a minimum
gain of 25% among students who completed the intervention.
● Mispronunciation Error Reduction. The percentage decrease in the frequency of
phonetic mispronunciation errors recorded during oral reading tasks from
pre-intervention to post-intervention assessment, targeting a minimum reduction of
30%.
● Self-Directed Engagement. The session frequency, story level completion rate, and the
percentage of students who achieved at least 70% of total in-app reward milestones
throughout the four-week intervention period, as recorded by the application's built-in
engagement logs.
PART 4: Expected System
Game Structure & Level Design
The application is structured as a single-player narrative campaign divided into Stages
(Chapters) and Levels, mapped directly to the localized Marungko phonetics progression:
● Stage 1: The Valley of Vowels (Basic Phonemes): Comprises 5 introductory story
levels. Each level isolates and targets a specific vowel sound (/a/, /e/, /i/, /o/, /u/). The
player must accurately repeat the isolated phoneme to clear environmental obstacles.
● Stage 2: The Blending Bridges (Consonant-Vowel Blending): Focuses on combining
consonant sounds with the vowels learned in Stage 1 (e.g., combining sounds to form
basic syllables like ma, ba, ta).
● Stage 3: The CVC Kingdom (Consonant-Vowel-Consonant Words): Advanced
narrative levels where challenges require the pronunciation of full CVC words (e.g., cat,
man, hat) and early grade sight words to unlock items and progress the story.
The Micro-Gameplay Loop (Per Level):
1. Hook: An animated companion introduces a narrative conflict (e.g., "The bridge is
broken! Say the magic sound to fix it!").
2. Model: The companion models the correct pronunciation with on-screen text and
high-quality audio.
3. Action: The child taps the microphone icon and speaks into the device.
4. Evaluation: If accurate, the character executes the action, the story advances, and a
sticker is earned. If inaccurate, the corrective feedback loop triggers a scaffolded retry.
Minimum Viable Product (MVP) Features
1. Story-Based Adventure Interface
● An interactive narrative where the Grade 1 learner is the main character of a
phonetics-driven adventure
● Age-appropriate illustrated scenes, characters, and story progressions designed for 6 to
7 year old learners
● Each chapter introduces a new phonetic concept aligned with Grade 1 literacy standards
2. Phonetic Challenge System
● Story-embedded challenges such as unlocking a door or rescuing a character that
require correct pronunciation to advance
● Challenges progress in difficulty from simple vowel and consonant sounds to blended
phonemes and multi-syllabic words
3. Speech Recognition and Feedback Engine
● Real-time evaluation of the learner's spoken pronunciation against a correct phonetic
model
● Immediate corrective feedback after each attempt, with an audio model of the correct
pronunciation provided for self-correction
● Multiple attempts are allowed per challenge before additional scaffolding support is
provided
4. Reward and Progression System
● Students earn points, badges, and in-story rewards upon completing each phonetic
challenge and story level
● Unlockable story chapters and collectible items motivate continued self-directed
engagement
5. Phoneme and Vocabulary Bank
● A structured library of Grade 1 appropriate phonemes, words, and phrases sequenced by
phonics difficulty
● All entries are accompanied by native-speaker quality audio models to establish correct
pronunciation standards
6. Student Progress Dashboard
● A simple dashboard displaying completed levels, earned rewards, and overall
pronunciation performance
● Progress is saved after every session to support continuity across multiple learning
sessions
High-Level Workflow
1. Onboarding — The student is introduced to the story world, learns how to use the
speech feature, and creates a basic profile to track progress across sessions
2. Story and Level Entry — The student enters the current story chapter, encounters a
narrative problem, and is directed to the next phonetic challenge
3. Challenge Presentation — A visual prompt, written word or phoneme, and audio model
are displayed, and the student is instructed to pronounce the target sound or word
4. Speech Recognition — The student speaks into the device, and the speech recognition
engine evaluates the pronunciation against the correct phonetic model in real time
5. Feedback Delivery — Correct pronunciation advances the story with animations and
rewards, while incorrect attempts receive gentle corrective feedback and another
opportunity to try
6. Reward and Progression — Upon completing the challenge, the student earns points or
badges and the story advances to the next scene
7. Session Summary — A session summary displays completed challenges and earned
rewards, and the student is encouraged to return through a story preview of the next
chapter.
PART 5: Discussion
Scope
The application targets Grade 1 students in Philippine public elementary schools, focusing on
three core foundational literacy skills: word pronunciation accuracy, phonemic awareness, and
oral reading fluency. It functions as a self-directed learning tool, requiring no teacher facilitation,
and will be evaluated through a four-week quasi-experimental intervention involving 60 Grade 1
participants across experimental and control groups
Limitations
● Requires access to a compatible device with a functional microphone for speech
recognition and internet connectivity
● Pilot testing limited to a selected public elementary school with 60 participants
● Speech recognition accuracy may vary due to background noise, microphone quality, and
the phonetic diversity of young Filipino learners across different mother tongue
languages
● The four-week intervention period may not capture long-term retention of
pronunciation gains
● Self-directed engagement may vary among Grade 1 learners who are not yet accustomed
to independent digital learning
Expected Contribution
This project directly addresses the research gap in locally contextualized, technology-driven
pronunciation intervention for beginning Filipino readers. By combining speech recognition,
gamification, and storytelling-based phonetics instruction, the application provides Grade 1
learners with an engaging and measurable self-directed learning experience. It produces
empirical evidence on the effectiveness of gamified phonetic tools in improving pronunciation
accuracy, phonemic awareness, and oral reading fluency, contributing to the growing body of
educational technology research in the Philippine early literacy context and offering a scalable,
replicable model for future digital reading interventions aligned with the K to 12 curriculum.
PART 6: Traceability Matrix
RRL Finding/Theme Identified Gap Research Question Proposed Function
At least 90% of
Filipino children
aged 10 struggle to
read and
understand simple
text, with the crisis
rooted as early as
Grade 1 (World
Bank, 2022)
No locally
developed,
technology-driven
tool that specifically
targets word
pronunciation for
Grade 1 beginning
readers
To what extent does
the application
improve the word
pronunciation
accuracy of Grade 1
students based on
pre-test and
post-test scores?
Phonetic Challenge
System with
story-embedded
pronunciation tasks
that require correct
word and sound
production to
advance
Phonemic
awareness, the
ability to identify
and reproduce
individual letter
sounds, is one of the
most significant
barriers to early
reading
development among
Filipino elementary
Absence of a
structured,
interactive
phoneme practice
tool designed
specifically for
self-directed use by
Grade 1 learners
Is there a
statistically
significant
improvement in
phonemic
awareness scores
before and after use
of the application?
Phoneme and
Vocabulary Bank
with sequenced
phoneme sets
covering vowels,
consonants, blends,
and digraphs with
native-speaker
audio models
learners (Librea et
al., 2023)
Some teachers
instruct beginning
readers with
incorrect letter
sounds,
compounding early
pronunciation
deficiencies in the
classroom (Padilla,
2024)
No self-directed tool
that allows Grade 1
learners to access
correct phonetic
models and practice
independently
outside of teacher
instruction
How much
improvement in oral
reading fluency is
observed among
Grade 1 students
before and after the
intervention?
Speech Recognition
and Feedback
Engine that
evaluates spoken
pronunciation in
real time and
delivers immediate
corrective feedback
with correct audio
models
Mispronounced and
substituted words
during oral reading
directly hinder
reading fluency and
comprehension
among Filipino
elementary
students (Canoy &
Loquias, 2022)
Lack of an
automated,
real-time
pronunciation
evaluation tool
accessible to young
learners without
requiring human
assessment
To what degree
does the application
reduce the
frequency of
phonetic
mispronunciation
errors from
pre-intervention to
post-intervention
assessments?
Speech Recognition
Engine that detects
pronunciation
errors per attempt
and provides
scaffolded
corrective feedback
across multiple tries
The Philippines'
average reading
score remained
statistically
unchanged from
2019 to 2024, with
half of Grade 5
students still unable
to understand
simple texts,
indicating that
existing
interventions are
insufficient
(SEA-PLM, 2024)
Existing reading
programs such as
Phil-IRI and ECARP
are paper-based,
teacher-dependent,
and do not address
pronunciation
development
through interactive
or digital means n
Is there a
statistically
significant
difference in
post-test scores
between the
experimental group
using the app and
the control group
using regular
classroom
instruction?
Quasi-Experimental
Pre-test and
Post-test Design
with experimental
and control groups
to measure and
compare learning
gains produced by
the application
Game-like features
and progress
tracking in
technology-based
tools offer a more
motivating and
engaging alternative
No gamified,
self-directed
pronunciation
application
designed
specifically for the
phonetic
How engaged are
Grade 1 students
throughout the
application as
reflected by session
frequency, level
completion rates,
Reward and
Progression System
featuring points,
badges, unlockable
story chapters, and
a student progress
dashboard to
to traditional
classroom methods
for young learners
(Jayalath &
Esichaikul, 2022)
development needs
of Grade 1 Filipino
learners
and reward
milestone
achievement?
sustain self-directed
engagement
PART 7: References
Canoy, R., & Loquias, M. (2022). Oral reading verification and fluency assessment at San Isidro
Elementary School. Bohol, Philippines.
Department of Education – Philippines. (2025). Comprehensive Rapid Literacy Assessment results,
SY 2024–2025. DepEd.
Jayalath, J., & Esichaikul, V. (2022). Gamification to support motivation and engagement in
blended e-learning. Journal of Educational Technology Systems, 50(3), 327–355.
Librea, N. K., Luciano, A. M., Sacamay, M. L., Libres, M. D., & Cabanilla, A. (2023). Low reading
literacy skills of elementary pupils in the Philippines: Systematic review. International Journal of
Research and Analytical Studies. https://doi.org/10.22214/ijraset.2023.49480
Padilla, P. (2024, January 11). Explainer: With students' poor literacy, are all teachers now
'reading teachers'? Philstar.com.
https://www.philstar.com/headlines/2024/01/11/2325063/explainer-students-poor-literacyare-all-teachers-now-reading-teachers
Southeast Asia Primary Learning Metrics. (2024). SEA-PLM 2024 main regional report. UNICEF.
Sun, Y. (2023). The impact of automatic speech recognition technology on second language
pronunciation and speaking skills of EFL learners: A mixed methods investigation. Frontiers in
Psychology, 14, 1210187. https://doi.org/10.3389/fpsyg.2023.1210187
World Bank. (2022). Learning poverty brief: Philippines. World Bank Group.
Cagulada, E. (2018). Marungko approach: A localized phonics-based reading strategy for Filipino
learners in the primary grades. Philippine Journal of Linguistics and Education, 12(1), 45–58.
Deci, E. L., & Ryan, R. M. (1985). Intrinsic motivation and self-determination in human behavior.
Plenum Press.
Mayer, R. E. (2009). Multimedia learning (2nd ed.). Cambridge University Press.
Nielsen, J. (1994). Usability engineering. Academic Press.
Shivakumar, P. G., & Georgiou, P. (2020). Transfer learning from adult to children for speech
recognition: Evaluation, analysis and recommendations. Computer Speech & Language, 63,
101077. https://doi.org/10.1016/j.csl.2020.101077
Skinner, B. F. (1938). The behavior of organisms: An experimental analysis.
Appleton-Century-Crofts.
Vygotsky, L. S. (1978). Mind in society: The development of higher psychological processes.
Harvard University Press.