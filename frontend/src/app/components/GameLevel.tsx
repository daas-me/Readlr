import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Mic, ArrowLeft, RotateCcw, MicOff } from "lucide-react";
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
  phoneme: string;
  audioPath: string;
  acceptedTranscripts: string[];
  prompt: string;
  storyContext: string;
}

type Outcome = "success" | "lowConfidence" | "silent";

const STAGE_ACCENTS: Record<number, { accent: string; tint: string }> = {
  1: { accent: "#F59E0B", tint: "#FFF7ED" },
  2: { accent: "#4F46E5", tint: "#EEF2FF" },
  3: { accent: "#10B981", tint: "#D1FAE5" },
};

// All challenges mapped by stage and level
const ALL_CHALLENGES: Record<number, Record<number, Challenge>> = {
  1: {
    1: { id: 1, phoneme: "A", audioPath: "/audio/stage1/A.wav", acceptedTranscripts: ["a", "ah", "uh", "aw", "aaa", "ahhhhh", "ahhhh", "ahhh", "apple"], prompt: "Say the sound: Ahhh", storyContext: "Help Sinta open the first magic door!" },
    2: { id: 2, phoneme: "E", audioPath: "/audio/stage1/E.wav", acceptedTranscripts: ["e", "eh", "a", "hey", "ed", "end", "any", "egg", "it"], prompt: "Say the sound: Ehhh", storyContext: "A little bird flies through when you say 'E'!" },
    3: { id: 3, phoneme: "I", audioPath: "/audio/stage1/I.wav", acceptedTranscripts: ["i", "ee", "ih", "it", "is", "in", "eat", "eye", "e", "if"], prompt: "Say the sound: Iii", storyContext: "The hidden treasure chest unlocks!" },
    4: { id: 4, phoneme: "O", audioPath: "/audio/stage1/O.wav", acceptedTranscripts: ["o", "oh", "aw", "off", "on", "or", "owe", "ohh", "out"], prompt: "Say the sound: Ohhh", storyContext: "A friendly owl wakes up to greet you!" },
    5: { id: 5, phoneme: "U", audioPath: "/audio/stage1/U.wav", acceptedTranscripts: ["u", "uh", "oo", "you", "up", "of", "oh", "ooh", "us"], prompt: "Say the sound: Uhhh", storyContext: "The final door opens to the valley!" },
  },
};

export function GameLevel({ stageId, levelId, onBack, onComplete }: GameLevelProps) {
  const { accent, tint } = STAGE_ACCENTS[stageId] ?? STAGE_ACCENTS[1];
  const { playAudio, stopAudio } = useAudioManager();

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [bubbleMessage, setBubbleMessage] = useState<string>(
    "Hi! Let's read together!"
  );
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const silenceTimer = useRef<number | null>(null);

  // Get only the challenge for this level
  const selectedChallenge = ALL_CHALLENGES[stageId]?.[levelId];
  const challenges: Challenge[] = selectedChallenge ? [selectedChallenge] : [];

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    return () => {
      if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
      stopAudio();
    };
  }, [stopAudio]);

  // Auto-play the phoneme audio when the challenge loads
  useEffect(() => {
    if (challenge && challenge.audioPath) {
      // Add a small delay so the UI renders first
      const timer = setTimeout(() => {
        playAudio(challenge.audioPath);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [challenge, currentChallenge, playAudio]);

  const speakPhoneme = () => {
    setCharacterState("speaking");
    setBubbleMessage(`Listen: "${challenge.phoneme}"`);
    
    playAudio(challenge.audioPath);
    
    // Reset character state after a reasonable time
    setTimeout(() => {
      setCharacterState("idle");
    }, 2000);
  };

  // Play try again feedback sound
  const playTryAgainSound = () => {
    playAudio("/audio/common/TryAgain.wav");
  };

  const handleSpeechResult = (outcome: Outcome) => {
    setAttempts((a) => a + 1);

    if (outcome === "success") {
      setLastOutcome("success");
      setCharacterState("celebrating");
      setBubbleMessage("Great job! You did it!");
      setScore((s) => s + 100);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge((c) => c + 1);
          setAttempts(0);
          setLastOutcome(null);
          setCharacterState("idle");
          setBubbleMessage("Next one! Ready?");
        } else {
          onComplete();
        }
      }, 2000);
    } else if (outcome === "lowConfidence") {
      setLastOutcome("lowConfidence");
      setCharacterState("encouraging");
      setBubbleMessage(
        attempts >= 1
          ? "Almost! Watch my mouth, then tap Retry."
          : "Hmm, not quite. Want to try again?"
      );
      
      // Play your custom TryAgain.wav file
      playTryAgainSound();
      
      setTimeout(() => {
        setCharacterState("speaking");
        setTimeout(() => setCharacterState("idle"), 1500);
      }, 1200);
    } else {
      setLastOutcome("silent");
      setCharacterState("encouraging");
      setBubbleMessage("You took too long! Tap the mic to try again.");
      
      // Play your custom TryAgain.wav file
      playTryAgainSound(); 
      
      setTimeout(() => setCharacterState("idle"), 1500);
    }
  };

  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Microphone not supported in this browser. Please use Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;   
    recognition.interimResults = true; 
    recognition.lang = 'en-US';

    setCharacterState("listening");
    setBubbleMessage("I'm listening...");
    setLastOutcome(null);

    let hasMatched = false; 

    if (silenceTimer.current) window.clearTimeout(silenceTimer.current);

    silenceTimer.current = window.setTimeout(() => {
      recognition.stop();
      if (!hasMatched) handleSpeechResult("silent");
    }, 8000); 

    recognition.onaudiostart = () => console.log("🎤 Mic is hot!");

    recognition.onresult = (event: any) => {
      if (hasMatched) return; 
      if (silenceTimer.current) window.clearTimeout(silenceTimer.current);

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        console.log("🎤 Chrome's rough draft:", transcript); 

        const isMatch = challenge.acceptedTranscripts.some((acceptedWord) => {
          const spokenWords = transcript.split(/\s+/); 
          return spokenWords.includes(acceptedWord);
        });

        if (isMatch) {
          hasMatched = true; 
          recognition.stop(); 
          handleSpeechResult("success");
          return; 
        }
      }
    };

    recognition.onend = () => {
      if (!hasMatched && lastOutcome !== "silent") {
        handleSpeechResult("lowConfidence");
      }
    };

    recognition.onerror = (event: any) => {
      if (hasMatched) return;
      if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
      console.error("🎤 Mic error:", event.error);
      
      if (event.error === 'no-speech') {
        handleSpeechResult("silent");
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Microphone is already listening", e);
    }
  };

  const handleRetry = () => {
    setLastOutcome(null);
    setBubbleMessage("Take a breath — say it when you're ready.");
    setCharacterState("idle");
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto relative">
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60"
        style={{ background: tint }}
      />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#EEF2FF] opacity-50" />

      <div className="relative z-10 min-h-full flex flex-col px-6 md:px-10 py-6">
        <div className="flex items-center justify-between max-w-5xl w-full mx-auto mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {challenges.length > 1 && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                {challenges.map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: i === currentChallenge ? 1.2 : 1 }}
                    className={`h-1.5 rounded-full transition-all ${
                      i < currentChallenge ? "w-2" : i === currentChallenge ? "w-8" : "w-2 bg-[#1F243014]"
                    }`}
                    style={{
                      background:
                        i < currentChallenge
                          ? accent
                          : i === currentChallenge
                          ? accent
                          : undefined,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-[#8A91A3] uppercase tracking-wider">
                {currentChallenge + 1} / {challenges.length}
              </span>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#1F243014]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-sm text-[#1F2430]">{score}</span>
            <span className="text-xs text-[#8A91A3] uppercase tracking-wider">pts</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={bubbleMessage}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              className="relative bg-white rounded-2xl px-5 py-3 border border-[#1F243014] shadow-[0_8px_24px_-12px_rgba(31,36,48,0.15)] max-w-md"
            >
              <p className="text-[#1F2430] text-center">{bubbleMessage}</p>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-[#1F243014] rotate-45" />
            </motion.div>
          </AnimatePresence>

          <CharacterCompanion state={characterState} phoneme={challenge.phoneme} size={260} />

          <motion.div
            key={challenge.phoneme}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl px-12 py-3 border-2"
            style={{ borderColor: accent, background: tint }}
          >
            <span className="text-6xl tracking-tight" style={{ color: accent }}>
              {challenge.phoneme}
            </span>
          </motion.div>

          <AnimatePresence>
            {(lastOutcome === "silent" || lastOutcome === "lowConfidence") && (
              <motion.div
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#1F243014]"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: tint }}
                >
                  {lastOutcome === "silent" ? (
                    <MicOff className="w-4 h-4" style={{ color: accent }} />
                  ) : (
                    <RotateCcw className="w-4 h-4" style={{ color: accent }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1F2430]">
                    {lastOutcome === "silent"
                      ? "Too quiet!"
                      : "We didn't quite catch that"}
                  </p>
                  <p className="text-xs text-[#8A91A3] mt-0.5">
                    {lastOutcome === "silent"
                      ? "You took too long. Tap the mic and try again."
                      : "Listen to Sinta once more, then retry."}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={speakPhoneme}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Hear it
                  </button>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm"
                    style={{ background: accent, boxShadow: `0 8px 24px -12px ${accent}99` }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 w-full max-w-md">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={speakPhoneme}
              disabled={characterState === "listening"}
              className="flex-1 bg-white text-[#1F2430] px-5 py-4 rounded-2xl border border-[#1F243014] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Volume2 className="w-5 h-5" style={{ color: accent }} />
              <span>Listen</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleListen}
              disabled={characterState === "listening"}
              animate={characterState === "listening" ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ repeat: characterState === "listening" ? Infinity : 0, duration: 1 }}
              className="px-6 py-4 rounded-2xl text-white flex items-center justify-center gap-2"
              style={{
                flex: 2,
                background: accent,
                boxShadow: `0 10px 28px -14px ${accent}aa`,
              }}
            >
              <Mic className="w-5 h-5" />
              <span>{characterState === "listening" ? "Listening…" : "Tap to speak"}</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {characterState === "idle" && attempts === 0 && !lastOutcome && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-[#8A91A3] text-center"
              >
                {challenge.storyContext}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}