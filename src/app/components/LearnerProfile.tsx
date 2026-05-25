import { useState } from "react";
import { motion } from "motion/react";
import { User, ArrowRight, Check } from "lucide-react";

interface LearnerProfileProps {
  onComplete: (name: string, avatar: string) => void;
}

export function LearnerProfile({ onComplete }: LearnerProfileProps) {
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");

  const avatars = ["🦊", "🐱", "🐶", "🐰", "🐻", "🐼", "🐨", "🦁"];

  const handleSubmit = () => {
    if (name.trim()) {
      onComplete(name, selectedAvatar);
    }
  };

  const ready = name.trim().length > 0;

  return (
    <div className="size-full bg-[#FAF7F2] flex items-center justify-center p-6 md:p-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />
      <div className="absolute -bottom-28 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#FEF3C7] opacity-60" />

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl p-8 md:p-10 border border-[#1F243014] shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(31,36,48,0.18)]"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs tracking-wide text-[#4B5266] uppercase">Step 1 of 1</span>
          </div>
          <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-5">
            <User className="w-7 h-7 text-[#4F46E5]" />
          </div>
          <h1 className="text-3xl md:text-4xl text-[#1F2430] tracking-tight mb-2">
            Let's set up your profile
          </h1>
          <p className="text-[#4B5266]">
            Pick a name and a reading buddy. You can change these anytime.
          </p>
        </div>

        {/* Name */}
        <div className="mb-7">
          <label className="block text-sm text-[#1F2430] mb-2">Your name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={30}
            className="w-full px-4 py-3.5 text-lg bg-[#FAF7F2] border border-[#1F243014] rounded-xl text-[#1F2430] placeholder:text-[#8A91A3] focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#EEF2FF] transition-all"
          />
        </div>

        {/* Avatars */}
        <div className="mb-7">
          <div className="flex items-baseline justify-between mb-3">
            <label className="block text-sm text-[#1F2430]">Choose your learning buddy</label>
            <span className="text-xs text-[#8A91A3]">{avatars.length} options</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {avatars.map((avatar) => {
              const active = selectedAvatar === avatar;
              return (
                <motion.button
                  key={avatar}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center text-4xl md:text-5xl transition-all border ${
                    active
                      ? "bg-[#EEF2FF] border-[#4F46E5] shadow-[0_8px_24px_-12px_rgba(79,70,229,0.4)]"
                      : "bg-[#FAF7F2] border-[#1F243014] hover:border-[#1F243029]"
                  }`}
                >
                  {avatar}
                  {active && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#FAF7F2] border border-[#1F243014] rounded-2xl p-5 mb-8">
          <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-3">Preview</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white border border-[#1F243014] rounded-2xl flex items-center justify-center text-3xl">
              {selectedAvatar}
            </div>
            <div className="leading-tight">
              <p className="text-xl text-[#1F2430]">
                {name || <span className="text-[#8A91A3]">Your name</span>}
              </p>
              <p className="text-xs uppercase tracking-wider text-[#8A91A3] mt-1">
                Grade 1 Learner
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={ready ? { y: -2 } : {}}
          whileTap={ready ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!ready}
          className={`w-full px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2 transition-colors ${
            ready
              ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_8px_24px_-12px_rgba(79,70,229,0.6)]"
              : "bg-[#F2EEE6] text-[#8A91A3] cursor-not-allowed"
          }`}
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <p className="text-center text-xs text-[#8A91A3] mt-4">
          You can change this anytime in settings.
        </p>
      </motion.div>
    </div>
  );
}
