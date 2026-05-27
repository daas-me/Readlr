import { motion } from "motion/react";
import { ArrowRight, Volume2 } from "lucide-react";
import { CharacterCompanion } from "./CharacterCompanion";

interface ChapterBridgeProps {
  stageName: string;
  currentLevel: number;
  vowel: string;
  vowelName: string;
  stageId: number;
  onBeginChapter: () => void;
}

// Story bridges for each vowel that Sinta will tell
const VOWEL_STORIES: Record<string, { message: string; doorCount: string }> = {
  "A": {
    message: "Excellent! The first door opens and reveals the letter A. Its sound is like 'ahhh...' Can you hear it?",
    doorCount: "1 door open",
  },
  "E": {
    message: "Great job! The second door glows and shows the letter E. It sounds like 'ehhhh...' Let's try together!",
    doorCount: "2 doors open",
  },
  "I": {
    message: "Wonderful! The third door appears with the letter I. It makes an 'iii...' sound. Ready to open it?",
    doorCount: "3 doors open",
  },
  "O": {
    message: "Amazing! The fourth door shines bright with the letter O. It sounds like 'ohhh...' Can you say it?",
    doorCount: "4 doors open",
  },
  "U": {
    message: "Fantastic! The final door reveals the letter U. It makes an 'uuuuh...' sound. Let's complete our journey!",
    doorCount: "5 doors open",
  },
};

export function ChapterBridge({
  stageName,
  currentLevel,
  vowel,
  vowelName,
  stageId,
  onBeginChapter,
}: ChapterBridgeProps) {
  const story = VOWEL_STORIES[vowel] || VOWEL_STORIES["A"];
  
  const handleListen = () => {
    // Play pronunciation of the vowel
    const audio = new Audio(`/audio/stage${stageId}/vowel_${vowel.toLowerCase()}.wav`);
    audio.play().catch(() => {
      console.log(`Audio file not found for vowel ${vowel}`);
    });
  };

  return (
    <div className="size-full bg-gradient-to-b from-[#FFF7ED] to-[#FAF7F2] overflow-hidden relative flex flex-col">
      {/* Decorative accents */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-40" style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #4F46E5 0%, transparent 70%)" }} />

      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 py-6">
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full justify-between">
          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <span className="text-sm font-medium text-[#8A91A3]">
              <span className="text-[#F59E0B]">{story.doorCount}</span> - {stageName}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#8A91A3]">
              Chapter {currentLevel}
            </span>
          </motion.div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {/* Character companion with dialogue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Sinta character */}
              <div className="flex justify-center">
                <CharacterCompanion
                  state="encouraging"
                  phoneme={vowel}
                  size={220}
                />
              </div>

              {/* Dialogue bubble with Sinta's message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-[#F59E0B]/30 max-w-md w-full"
              >
                <p className="text-center text-base md:text-lg text-[#1F2430] leading-relaxed mb-6">
                  {story.message}
                </p>

                {/* Vowel showcase */}
                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] rounded-2xl p-6 mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#8A91A3] text-center mb-3 font-medium">
                    The {vowelName} Sound
                  </p>
                  <div className="text-center flex items-center justify-center gap-4">
                    <div className="text-7xl font-bold text-[#F59E0B]">{vowel}</div>
                    <button
                      onClick={handleListen}
                      className="p-4 rounded-full bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-6 h-6 text-[#F59E0B]" />
                    </button>
                  </div>
                </div>

                {/* Encouragement */}
                <p className="text-center text-sm text-[#4B5266] italic">
                  "Try saying this sound along with me. Don't worry if it's not perfect — you'll get it!"
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Begin button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mt-6"
          >
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBeginChapter}
              className="flex-1 px-8 py-4 rounded-2xl bg-[#F59E0B] text-white font-bold text-lg hover:bg-[#D97706] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              Let's Go!
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
