import { useState } from "react";
import { motion } from "motion/react";
import { User, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../../modules/auth/index";

interface LearnerProfileProps {
  onComplete: (name: string, avatar: string, learnerId?: number) => void;
}

export function LearnerProfile({ onComplete }: LearnerProfileProps) {
  const { user, token } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatars = ["🦊", "🐱", "🐶", "🐰", "🐻", "🐼", "🐨", "🦁"];
  const name = user?.name || "";

  const handleSubmit = async () => {
    if (!name.trim() || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/learner/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          avatar: selectedAvatar,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save profile');
      }

      const data = await response.json();
      onComplete(name, selectedAvatar, data.learner?.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="size-full bg-[#FAF7F2] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />
      <div className="absolute -bottom-28 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#FEF3C7] opacity-60" />

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl p-6 md:p-8 border border-[#1F243014] shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(31,36,48,0.18)] flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs tracking-wide text-[#4B5266] uppercase">Step 1 of 1</span>
          </div>
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-[#4F46E5]" />
          </div>
          <h1 className="text-2xl md:text-3xl text-[#1F2430] tracking-tight mb-1">
            Let's set up your profile
          </h1>
          <p className="text-sm text-[#4B5266]">
            Pick a name and a reading buddy. You can change these anytime.
          </p>
        </div>

        {/* Name Display */}
        <div className="mb-5">
          <label className="block text-sm text-[#1F2430] mb-2">Your name</label>
          <div className="w-full px-4 py-2.5 text-base bg-[#FAF7F2] border border-[#1F243014] rounded-xl text-[#1F2430] flex items-center">
            {name}
          </div>
        </div>

        {/* Avatars */}
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-2">
            <label className="block text-sm text-[#1F2430]">Choose your learning buddy</label>
            <span className="text-xs text-[#8A91A3]">{avatars.length} options</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {avatars.map((avatar) => {
              const active = selectedAvatar === avatar;
              return (
                <motion.button
                  key={avatar}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl transition-all border ${
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
        <div className="bg-[#FAF7F2] border border-[#1F243014] rounded-2xl p-4 mb-5">
          <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border border-[#1F243014] rounded-xl flex items-center justify-center text-2xl">
              {selectedAvatar}
            </div>
            <div className="leading-tight">
              <p className="text-base text-[#1F2430]">
                {name || <span className="text-[#8A91A3]">Your name</span>}
              </p>
              <p className="text-xs uppercase tracking-wider text-[#8A91A3] mt-0.5">
                Grade 1 Learner
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg">
            <p className="text-sm text-[#DC2626]">{error}</p>
          </div>
        )}

        {/* Submit */}
        <motion.button
          whileHover={!isLoading ? { y: -2 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full px-8 py-3 rounded-2xl text-base inline-flex items-center justify-center gap-2 transition-colors ${
            !isLoading
              ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_8px_24px_-12px_rgba(79,70,229,0.6)]"
              : "bg-[#F2EEE6] text-[#8A91A3] cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-[#8A91A3] mt-3">
          You can change this anytime in settings.
        </p>
      </motion.div>
    </div>
  );
}
