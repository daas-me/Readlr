import { motion } from "motion/react";
import { Mic, Sticker, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  userName?: string;
}

export function WelcomeScreen({ onStart, userName }: WelcomeScreenProps) {
  return (
    <div className="size-full bg-[#FAF7F2] flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#FEF3C7] opacity-70" />
      <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl p-10 border border-[#1F243014] shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(31,36,48,0.18)]">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs tracking-wide text-[#4B5266] uppercase">Today's Adventure</span>
          </div>

          <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight mb-3">
            Welcome{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-[#4B5266] text-lg mb-8">
            Are you ready to learn and have fun reading today? Let's get started with your adventure.
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2]">
              <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <p className="text-[#1F2430]">Speak clearly into your device to play.</p>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2]">
              <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
                <Sticker className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <p className="text-[#1F2430]">Earn stickers when you finish a level.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_-12px_rgba(79,70,229,0.6)] transition-colors"
          >
            Start Adventure <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
