import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Mic, ArrowLeft, RotateCcw, MicOff } from "lucide-react";
import confetti from "canvas-confetti";
import { CharacterCompanion, CharacterState } from "./CharacterCompanion";

interface GameLevelProps {
  stageId: number;
  onBack: () => void;
  onComplete: () => void;
}

interface Challenge {
  id: number;
  phoneme: string;
  prompt: string;
  storyContext: string;
}

type Outcome = "success" | "lowConfidence" | "silent";

const STAGE_ACCENTS: Record<number, { accent: string; tint: string }> = {
  1: { accent: "#F59E0B", tint: "#FFF7ED" },
  2: { accent: "#4F46E5", tint: "#EEF2FF" },
  3: { accent: "#10B981", tint: "#D1FAE5" },
};

export function GameLevel({ stageId, onBack, onComplete }: GameLevelProps) {
  const { accent, tint } = STAGE_ACCENTS[stageId] ?? STAGE_ACCENTS[1];

  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [bubbleMessage, setBubbleMessage] = useState<string>(
    "Hi! Let's read together!"
  );
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);
  const silenceTimer = useRef<number | null>(null);

  const challenges: Challenge[] = [
    { id: 1, phoneme: "A", prompt: "Say the sound: Ahhh", storyContext: "Help Sinta open the magic door!" },
    { id: 2, phoneme: "E", prompt: "Say the sound: Ehhh", storyContext: "The bird flies when you say 'E'!" },
    { id: 3, phoneme: "I", prompt: "Say the sound: Iii", storyContext: "The treasure chest will open!" },
  ];

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    return () => {
      if (silenceTimer.current) window.clearTimeout(silenceTimer.current);
    };
  }, []);

  const speakPhoneme = () => {
    setCharacterState("speaking");
    setBubbleMessage(`Listen: "${challenge.phoneme}"`);
    const utterance = new SpeechSynthesisUtterance(challenge.phoneme);
    utterance.rate = 0.6;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setTimeout(() => setCharacterState("idle"), 1500);
  };

  const handleListen = () => {
    setCharacterState("listening");
    setBubbleMessage("I'm listening...");
    setLastOutcome(null);

    // Simulate ASR roll: success / low-confidence / silent
    const roll = Math.random();
    const outcome: Outcome = roll < 0.6 ? "success" : roll < 0.85 ? "lowConfidence" : "silent";

    // Silent-input detection: longer wait, then silent prompt
    const delay = outcome === "silent" ? 3500 : 1800;

    silenceTimer.current = window.setTimeout(() => {
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
        setTimeout(() => {
          setCharacterState("speaking");
          setTimeout(() => setCharacterState("idle"), 1500);
        }, 1200);
      } else {
        setLastOutcome("silent");
        setCharacterState("encouraging");
        setBubbleMessage("I didn't hear you — tap the mic and try again.");
        setCharacterState("idle");
      }
    }, delay);
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
        {/* Top bar */}
        <div className="flex items-center justify-between max-w-5xl w-full mx-auto mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Map
          </button>

          {/* Progress dots */}
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

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#1F243014]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-sm text-[#1F2430]">{score}</span>
            <span className="text-xs text-[#8A91A3] uppercase tracking-wider">pts</span>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto w-full">
          {/* Speech bubble */}
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

          {/* Phoneme card */}
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

          {/* Silent-input / low-confidence panel */}
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
                      ? "No sound detected"
                      : "We didn't quite catch that"}
                  </p>
                  <p className="text-xs text-[#8A91A3] mt-0.5">
                    {lastOutcome === "silent"
                      ? "Move closer to the mic and try again."
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

          {/* Action buttons */}
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

          {/* Story hint */}
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
