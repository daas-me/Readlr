import { motion } from "motion/react";
import { Trophy, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ChapterCelebrationProps {
  sticker: string;
  score: number;
  currentLevel: number;
  totalLevels: number;
  stageName: string;
  onContinueStory: () => void;
  onBackToMap: () => void;
}

export function ChapterCelebration({
  sticker,
  score,
  currentLevel,
  totalLevels,
  stageName,
  onContinueStory,
  onBackToMap,
}: ChapterCelebrationProps) {
  const remainingLevels = totalLevels - currentLevel;
  const isLastLevel = currentLevel === totalLevels;

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });

    const interval = setInterval(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="size-full bg-[#FAF7F2] overflow-hidden relative flex flex-col">
      {/* Soft scenery accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60" style={{ background: "#FFF7ED" }} />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#EEF2FF] opacity-50" />

      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 py-6">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToMap}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Chapter Complete</span>
          </div>

          {/* Main content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="flex-1 flex flex-col justify-center bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-[#1F243014]"
          >
            {/* Trophy animation */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center mb-4"
            >
              <Trophy className="w-16 h-16" style={{ color: "#F59E0B" }} />
            </motion.div>

            {/* Congratulations */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-center text-[#1F2430] mb-2"
            >
              Fantastic!
            </motion.h1>

            {/* Progress message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-base md:text-lg text-[#4B5266] mb-6"
            >
              {isLastLevel ? (
                <span>
                  You've completed <span className="font-bold text-[#F59E0B]">{stageName}</span>! Amazing work! 🎉
                </span>
              ) : (
                <span>
                  You're one step closer! <span className="font-bold text-[#F59E0B]">{remainingLevels} more door{remainingLevels !== 1 ? "s" : ""} to go</span>
                </span>
              )}
            </motion.p>

            {/* Score and sticker section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] rounded-2xl p-6 mb-6 border border-[#F59E0B]/20"
            >
              {/* Score */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3 }}>
                  <Star className="w-8 h-8 text-[#F59E0B]" />
                </motion.div>
                <span className="text-3xl font-bold text-[#1F2430]">+{score} points</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#F59E0B]/20 mb-8" />

              {/* Sticker */}
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider text-[#8A91A3] mb-4 font-medium">
                  New Sticker Unlocked
                </p>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, type: "spring" }}
                  className="text-9xl inline-block"
                >
                  {sticker}
                </motion.div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 w-full mt-auto"
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBackToMap}
                className="flex-1 px-6 py-4 rounded-2xl text-[#4B5266] bg-white border-2 border-[#1F243014] hover:border-[#1F243029] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Chapter Map
              </motion.button>

              {!isLastLevel && (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onContinueStory}
                  className="flex-1 px-6 py-4 rounded-2xl text-white bg-[#F59E0B] hover:bg-[#D97706] transition-colors font-medium flex items-center justify-center gap-2"
                  style={{
                    boxShadow: "0 10px 28px -14px rgba(245, 158, 11, 0.6)",
                  }}
                >
                  Continue Story
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </motion.div>

            {isLastLevel && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-sm text-[#8A91A3] mt-6"
              >
                You've mastered this chapter! Return to explore the next adventure.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
