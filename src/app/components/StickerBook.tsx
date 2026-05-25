import { motion } from "motion/react";
import { ArrowLeft, Star, Lock, Check } from "lucide-react";

interface StickerBookProps {
  onBack: () => void;
}

interface Sticker {
  id: number;
  emoji: string;
  name: string;
  stage: string;
  earned: boolean;
}

export function StickerBook({ onBack }: StickerBookProps) {
  const stickers: Sticker[] = [
    { id: 1, emoji: "🦋", name: "Butterfly", stage: "Valley of Vowels — A", earned: true },
    { id: 2, emoji: "🐝", name: "Bee", stage: "Valley of Vowels — E", earned: true },
    { id: 3, emoji: "🐞", name: "Ladybug", stage: "Valley of Vowels — I", earned: true },
    { id: 4, emoji: "🦉", name: "Owl", stage: "Valley of Vowels — O", earned: false },
    { id: 5, emoji: "🦄", name: "Unicorn", stage: "Valley of Vowels — U", earned: false },
    { id: 6, emoji: "🐸", name: "Frog", stage: "Blending Bridges 1", earned: false },
    { id: 7, emoji: "🐢", name: "Turtle", stage: "Blending Bridges 2", earned: false },
    { id: 8, emoji: "🦎", name: "Lizard", stage: "Blending Bridges 3", earned: false },
    { id: 9, emoji: "🦜", name: "Parrot", stage: "CVC Kingdom 1", earned: false },
    { id: 10, emoji: "🦚", name: "Peacock", stage: "CVC Kingdom 2", earned: false },
    { id: 11, emoji: "🦁", name: "Lion", stage: "CVC Kingdom 3", earned: false },
    { id: 12, emoji: "🐯", name: "Tiger", stage: "CVC Kingdom Final", earned: false },
  ];

  const earnedCount = stickers.filter((s) => s.earned).length;
  const pct = Math.round((earnedCount / stickers.length) * 100);

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A91A3]">
              <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
              {earnedCount} of {stickers.length} collected
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Collection</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">My Sticker Book</h1>
              <p className="text-[#4B5266]">Finish a level to earn an animal friend.</p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-5 border border-[#1F243014] mb-8">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Album completion</span>
              <span className="text-sm text-[#1F2430]">
                <span className="text-[#4F46E5]">{pct}%</span>
                <span className="text-[#8A91A3]"> · {stickers.length - earnedCount} to go</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#F2EEE6] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-1.5 rounded-full bg-[#4F46E5]"
              />
            </div>
          </div>

          {/* Sticker grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stickers.map((sticker, index) => (
              <motion.div
                key={sticker.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.03, ease: "easeOut" }}
                whileHover={sticker.earned ? { y: -3 } : {}}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  sticker.earned
                    ? "border-[#1F243014] hover:border-[#1F243029] cursor-pointer"
                    : "border-[#1F243014] opacity-70"
                }`}
              >
                <div
                  className={`aspect-square rounded-xl flex items-center justify-center mb-4 relative ${
                    sticker.earned ? "bg-[#FAF7F2]" : "bg-[#F2EEE6]"
                  }`}
                >
                  {sticker.earned ? (
                    <span className="text-6xl">{sticker.emoji}</span>
                  ) : (
                    <Lock className="w-7 h-7 text-[#8A91A3]" />
                  )}
                  {sticker.earned && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-[#1F2430]">
                    {sticker.earned ? sticker.name : "Locked"}
                  </p>
                  <p className="text-xs text-[#8A91A3] mt-0.5">{sticker.stage}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer message */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-5 border border-[#1F243014] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-[#4B5266] text-sm">
              {earnedCount === stickers.length
                ? "Amazing — you've collected every sticker in the album!"
                : `Keep learning to unlock ${stickers.length - earnedCount} more stickers.`}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
