import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, Mic, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { CharacterCompanion, CharacterState } from "./CharacterCompanion";
import { useAudioManager } from "../../hooks/useAudioManager";

interface GameLevelProps {
  stageId: number;
  levelId: number;
  onBack: () => void;
  onComplete: () => void;
}

interface Challenge {
  id: number;
  word: string;        // The result (e.g., "Apple" or "MA")
  phoneme?: string;    // Used for Stage 1 character display
  consonant?: string;  // Used for blending
  vowel?: string;      // Used for blending/phoneme
  targetWord?: string; // The full word for blending (e.g., "Mama")
  audioPath?: string;
  acceptedTranscripts: string[];
  storyContext: string;
}

type Outcome = "success" | "incorrect" | "silent";

const STAGE_ACCENTS: Record<number, { accent: string; tint: string }> = {
  1: { accent: "#F59E0B", tint: "#FFF7ED" },
  2: { accent: "#4F46E5", tint: "#EEF2FF" },
  3: { accent: "#10B981", tint: "#D1FAE5" },
};

const ALL_CHALLENGES: Record<number, Record<number, Challenge>> = {
  1: {
    1: { id: 1, word: "Apple", phoneme: "A", audioPath: "/audio/stage1/Apple.wav", acceptedTranscripts: ["apple", "a", "ah"], storyContext: "Say 'Apple' to open the door!" },
    2: { id: 2, word: "Egg", phoneme: "E", audioPath: "/audio/stage1/Egg.wav", acceptedTranscripts: ["egg", "e", "eh"], storyContext: "Say 'Egg' to help the bird hatch!" },
    3: { id: 3, word: "Igloo", phoneme: "I", audioPath: "/audio/stage1/Igloo.wav", acceptedTranscripts: ["igloo", "i", "ee"], storyContext: "Say 'Igloo' to unlock the chest!" },
    4: { id: 4, word: "Octopus", phoneme: "O", audioPath: "/audio/stage1/Octopus.wav", acceptedTranscripts: ["octopus", "o", "oh"], storyContext: "Say 'Octopus' to wake up the octopus!" },
    5: { id: 5, word: "Umbrella", phoneme: "U", audioPath: "/audio/stage1/Umbrella.wav", acceptedTranscripts: ["umbrella", "u", "uh"], storyContext: "Say 'Umbrella' to move the boulder!" },
  },
  2: { // Chapter 2: Blending Bridges
    1: { 
      id: 1, word: "MA", consonant: "M", vowel: "A", targetWord: "Mama",
      audioPath: "/audio/stage2/MA.wav", 
      acceptedTranscripts: ["ma", "mama", "mah", "maa", "m a", "momma", "mamma"], 
      storyContext: "Blend M and A to say 'MA', then say 'Mama'!" 
    },
    2: { 
      id: 2, word: "BA", consonant: "B", vowel: "A", targetWord: "Baba",
      audioPath: "/audio/stage2/BA.wav", 
      acceptedTranscripts: ["ba", "baba", "bah", "baa", "b a", "bubba", "bub"], 
      storyContext: "Blend B and A to say 'BA', then say 'Baba'!" 
    },
    3: { 
      id: 3, word: "TA", consonant: "T", vowel: "A", targetWord: "Tata",
      audioPath: "/audio/stage2/TA.wav", 
      acceptedTranscripts: ["ta", "tata", "tah", "taa", "t a", "tada"], 
      storyContext: "Blend T and A to say 'TA', then say 'Tata'!" 
    },
    4: { 
      id: 4, word: "SA", consonant: "S", vowel: "A", targetWord: "Sasa",
      audioPath: "/audio/stage2/SA.wav", 
      acceptedTranscripts: ["sa", "sasa", "sah", "saa", "s a", "saw"], 
      storyContext: "Blend S and A to say 'SA', then say 'Sasa'!" 
    },
    5: { 
      id: 5, word: "LA", consonant: "L", vowel: "A", targetWord: "Lala",
      audioPath: "/audio/stage2/LA.wav", 
      acceptedTranscripts: ["la", "lala", "lah", "laa", "l a", "law", "lola"], 
      storyContext: "Blend L and A to say 'LA', then say 'Lala'!" 
    },
    6: { 
      id: 6, word: "PA", consonant: "P", vowel: "A", targetWord: "Papa",
      audioPath: "/audio/stage2/PA.wav", 
      acceptedTranscripts: ["pa", "papa", "pah", "paa", "p a", "paw", "poppa"], 
      storyContext: "Blend P and A to say 'PA', then say 'Papa'!" 
    },
    7: { 
      id: 7, word: "NA", consonant: "N", vowel: "A", targetWord: "Nana",
      audioPath: "/audio/stage2/NA.wav", 
      acceptedTranscripts: ["na", "nana", "nah", "naa", "n a", "naw", "nonna"], 
      storyContext: "Blend N and A to say 'NA', then say 'Nana'!" 
    },
    8: { 
      id: 8, word: "DA", consonant: "D", vowel: "A", targetWord: "Dada",
      audioPath: "/audio/stage2/DA.wav", 
      acceptedTranscripts: ["da", "dada", "dah", "daa", "d a", "dad"], 
      storyContext: "Blend D and A to say 'DA', then say 'Dada'!" 
    },
  },
  3: { // Chapter 3: CVC Kingdom (still needs audio "audioPath" and story contexts ""storyContext")
    1: {
      id: 1, word: "CAT", audioPath: undefined,
      acceptedTranscripts: ["cat", "c a t", "see a tee"],
      storyContext: "Read the whole word: CAT!"
    },
    2: {
      id: 2, word: "MAN", audioPath: undefined,
      acceptedTranscripts: ["man", "m a n", "em a en"],
      storyContext: "Read the whole word: MAN!"
    },
    3: {
      id: 3, word: "HAT", audioPath: undefined,
      acceptedTranscripts: ["hat", "h a t", "aitch a tee"],
      storyContext: "Read the whole word: HAT!"
    },
    4: {
      id: 4, word: "PIG", audioPath: undefined,
      acceptedTranscripts: ["pig", "p i g", "pee i gee"],
      storyContext: "Read the whole word: PIG!"
    },
    5: {
      id: 5, word: "DOG", audioPath: undefined,
      acceptedTranscripts: ["dog", "d o g", "dee o gee"],
      storyContext: "Read the whole word: DOG!"
    },
    6: {
      id: 6, word: "SUN", audioPath: undefined,
      acceptedTranscripts: ["sun", "s u n", "ess u en"],
      storyContext: "Read the whole word: SUN!"
    },
    7: {
      id: 7, word: "BED", audioPath: undefined,
      acceptedTranscripts: ["bed", "b e d", "bee e dee"],
      storyContext: "Read the whole word: BED!"
    },
    8: {
      id: 8, word: "CUP", audioPath: undefined,
      acceptedTranscripts: ["cup", "c u p", "see u pee"],
      storyContext: "Read the whole word: CUP!"
    },
    9: {
      id: 9, word: "BUS", audioPath: undefined,
      acceptedTranscripts: ["bus", "b u s", "bee u ess"],
      storyContext: "Read the whole word: BUS!"
    },
    10: {
      id: 10, word: "TOP", audioPath: undefined,
      acceptedTranscripts: ["top", "t o p", "tee o pee"],
      storyContext: "Read the whole word: TOP!"
    },
  },
};

export function GameLevel({ stageId, levelId, onBack, onComplete }: GameLevelProps) {
  const { accent, tint } = STAGE_ACCENTS[stageId] ?? STAGE_ACCENTS[1];
  const { playAudio, speakText, stopAudio, stopAllAudio } = useAudioManager();

  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [bubbleMessage, setBubbleMessage] = useState<string>("Hi! Let's read together!");
  
  const challenge = ALL_CHALLENGES[stageId]?.[levelId];
  const isBlendingMode = stageId === 2;
  const isCvcMode = stageId === 3;

  // Cleanup audio when the user leaves the level completely
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  const speakPhoneme = useCallback(() => {
    stopAudio();
    setCharacterState("speaking");
    setBubbleMessage(`Listen to Milo: "${challenge.word}"`);

    const sound = challenge.audioPath
      ? playAudio(challenge.audioPath)
      : speakText(challenge.word.toLowerCase(), 0.75);
    
    if (sound) {
      const onDone = () => {
        setCharacterState("idle");
        setBubbleMessage(`Your turn! Say: "${isBlendingMode ? challenge.targetWord : challenge.word}"!`);
      };
      if (sound instanceof HTMLAudioElement) {
        sound.onended = onDone;
      } else {
        sound.onend = onDone;
      }
    }
  }, [challenge, isBlendingMode, playAudio, speakText, stopAudio]);

  useEffect(() => {
    // 1000ms delay before autoplaying the word/phoneme when the component mounts
    const autoplayTimer = setTimeout(() => {
      speakPhoneme();
    }, 1000);

    return () => {
      clearTimeout(autoplayTimer);
    };
    // By only tracking stageId and levelId, we stop the infinite rendering loop!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId, levelId]); 

  const handleSpeechResult = (outcome: Outcome) => {
    stopAudio();
    if (outcome === "success") {
      setCharacterState("celebrating");
      setBubbleMessage(`Great! You said "${challenge.targetWord || challenge.word}"!`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const feedbackAudio = playAudio("/audio/common/GreatJob.wav");
      if (feedbackAudio) {
        feedbackAudio.onended = onComplete;
      } else {
        onComplete();
      }
    } else {
      setCharacterState("encouraging");
      setBubbleMessage(outcome === "silent" ? "Oops! Let's try again." : "Not quite, try saying the word clearly.");
      const retryAudio = playAudio(outcome === "silent" ? "/audio/common/TryAgain.wav" : "/audio/common/IncorrectWord.wav");
      if (retryAudio) {
        retryAudio.onended = () => setCharacterState("idle");
      }
    }
  };

  const handleListen = () => {
    stopAudio();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Use Chrome!"); return; }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    setCharacterState("listening");
    setBubbleMessage(`Listening...`);

    recognition.onresult = (event: any) => {
      if (event.results[event.results.length - 1].isFinal) {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        const targetWords = new Set(challenge.acceptedTranscripts);
        if (transcript.split(/\s+/).some((word: string) => targetWords.has(word))) {
          recognition.stop();
          handleSpeechResult("success");
        } else {
          recognition.stop();
          handleSpeechResult("incorrect");
        }
      }
    };
    recognition.onerror = (e: any) => handleSpeechResult(e.error === 'no-speech' ? "silent" : "incorrect");
    recognition.start();
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-hidden relative flex flex-col">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60 pointer-events-none" style={{ background: tint }} />
      <div className="relative z-10 flex-1 flex flex-col px-4 sm:px-6 py-4 sm:py-6 items-center justify-center gap-4">
        <button onClick={onBack} className="absolute top-6 left-6 px-3 py-2 rounded-xl bg-white border text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
        </button>
        
        <motion.div className="bg-white rounded-2xl px-6 sm:px-8 py-4 shadow-lg text-center max-w-md w-full">
          <p className="text-lg sm:text-xl font-bold text-[#1F2430]">{bubbleMessage}</p>
        </motion.div>
        
        <motion.div 
          className="flex-shrink-0"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <CharacterCompanion state={characterState} phoneme={challenge.phoneme || challenge.vowel || ""} size={260} />
        </motion.div>

        <motion.div className="bg-white px-6 sm:px-12 py-4 sm:py-6 rounded-3xl border-4 text-center max-w-2xl w-full" style={{ borderColor: accent }}>
          {isBlendingMode ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">Blend the sounds:</h2>
              <div className="flex items-center gap-2 sm:gap-4 font-bold justify-center flex-wrap" style={{ color: accent }}>
                <span className="text-4xl sm:text-6xl">{challenge.consonant}</span>
                <span className="text-2xl sm:text-3xl text-gray-300">+</span>
                <span className="text-4xl sm:text-6xl">{challenge.vowel}</span>
                <span className="text-2xl sm:text-3xl text-gray-300">=</span>
                <span className="text-4xl sm:text-6xl uppercase">{challenge.targetWord}</span>
              </div>
            </div>
          ) : isCvcMode ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">Read the word:</h2>
              <span className="text-5xl sm:text-7xl font-bold inline-block" style={{ color: accent }}>{challenge.word}</span>
              <div className="mt-4 flex items-center gap-2 sm:gap-3 justify-center" style={{ color: accent }}>
                {challenge.word.split("").map((letter, index) => (
                  <span key={`${letter}-${index}`} className="text-xl sm:text-2xl font-bold">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-3 sm:mb-4">Say the word:</h2>
              <span className="text-5xl sm:text-7xl font-bold inline-block" style={{ color: accent }}>{challenge.word}</span>
            </>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-sm sm:max-w-md sm:gap-4 justify-center">
          <button onClick={speakPhoneme} className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-white border flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium">
            <Volume2 className="w-4 h-4 flex-shrink-0" /> Listen
          </button>
          <button onClick={handleListen} className="px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm sm:text-base" style={{ background: accent }}>
            <Mic className="w-4 h-4 flex-shrink-0" /> Tap to Speak
          </button>
        </div>
        
        <p className="mt-2 sm:mt-4 text-gray-500 text-xs sm:text-sm text-center max-w-md">{challenge.storyContext}</p>
      </div>
    </div>
  );
}
