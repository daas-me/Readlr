import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  word: string;
  phoneme: string;
  audioPath: string;
  acceptedTranscripts: string[];
  storyContext: string;
}

type Outcome = "success" | "lowConfidence" | "silent";

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
};

export function GameLevel({ stageId, levelId, onBack, onComplete }: GameLevelProps) {
  const { accent, tint } = STAGE_ACCENTS[stageId] ?? STAGE_ACCENTS[1];
  const { playAudio, stopAudio } = useAudioManager();

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [bubbleMessage, setBubbleMessage] = useState<string>("Hi! Let's read together!");
  
  const selectedChallenge = ALL_CHALLENGES[stageId]?.[levelId];
  const challenges: Challenge[] = selectedChallenge ? [selectedChallenge] : [];
  const challenge = challenges[currentChallenge];

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const speakPhoneme = () => {
    // 1. Manually stop the hook's audio player just in case
    stopAudio(); 

    // 2. Set the UI state immediately
    setCharacterState("speaking");
    setBubbleMessage(`Listen to Milo: "${challenge.word}"`);

    // 3. Create a clean, independent Audio instance that isn't managed by the hook
    const sound = new Audio(challenge.audioPath);
    
    // 4. Play it
    sound.play().then(() => {
      // 5. Only after it plays successfully, set the timer to switch state
      setTimeout(() => {
        setCharacterState("idle");
        setBubbleMessage(`Your turn! Say: "${challenge.word}"!`);
      }, 1500);
    }).catch(err => {
      console.error("Audio could not play:", err);
    });
  };

type Outcome = "success" | "incorrect" | "silent";
  const handleSpeechResult = (outcome: Outcome) => {
    stopAudio();

    if (outcome === "success") {
      setCharacterState("celebrating");
      setBubbleMessage(`Great! You said "${challenge.word}"!`);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      const feedbackAudio = new Audio("/audio/common/GreatJob.wav");
      feedbackAudio.play();
      feedbackAudio.onended = () => {
        onComplete();
      };

    } else if (outcome === "incorrect") {
      setCharacterState("encouraging");
      setBubbleMessage("Not quite, try saying the word clearly.");
      
      const retryAudio = new Audio("/audio/common/IncorrectWord.wav");
      retryAudio.play();
      
      retryAudio.onended = () => {
        setCharacterState("idle");
      };

    } else if (outcome === "silent") {
      setCharacterState("encouraging");
      setBubbleMessage("Oops! Let's try again.");
      
      const retryAudio = new Audio("/audio/common/TryAgain.wav");
      retryAudio.play();
      
      retryAudio.onended = () => {
        setCharacterState("idle");
      };
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
      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
      
      console.log("Chrome's Rough Draft:", transcript);

      if (event.results[lastResultIndex].isFinal) {
        const targetWords = new Set(challenge.acceptedTranscripts);
        const spokenWords = transcript.split(/\s+/);

        const isMatch = spokenWords.some(word => targetWords.has(word));

        if (isMatch) {
          recognition.stop();
          handleSpeechResult("success");
        } else {
          // If they spoke, but it wasn't the target word
          recognition.stop();
          handleSpeechResult("incorrect"); 
        }
      }
    };

    // Correctly handle the silent/error cases
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        handleSpeechResult("silent");
      } else {
        handleSpeechResult("incorrect");
      }
    };

    recognition.start();
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto relative">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60" style={{ background: tint }} />
      <div className="relative z-10 min-h-full flex flex-col px-6 py-6 items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 px-3 py-2 rounded-xl bg-white border text-sm">
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
        </button>
        <motion.div className="bg-white rounded-2xl px-8 py-4 mb-6 shadow-lg text-center">
          <p className="text-xl font-bold text-[#1F2430]">{bubbleMessage}</p>
        </motion.div>
        <CharacterCompanion state={characterState} phoneme={challenge.phoneme} size={260} />
        <motion.div className="mt-8 bg-white px-12 py-6 rounded-3xl border-4" style={{ borderColor: accent }}>
          <h2 className="text-sm uppercase tracking-widest text-gray-400">Say the word:</h2>
          <span className="text-7xl font-bold" style={{ color: accent }}>{challenge.word}</span>
        </motion.div>
        <div className="flex gap-4 mt-8">
          <button onClick={speakPhoneme} className="px-6 py-4 rounded-2xl bg-white border flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Listen
          </button>
          <button onClick={handleListen} className="px-10 py-4 rounded-2xl text-white font-bold flex items-center gap-2" style={{ background: accent }}>
            <Mic className="w-4 h-4" /> Tap to Speak
          </button>
        </div>
        <p className="mt-4 text-gray-500">{challenge.storyContext}</p>
      </div>
    </div>
  );
}