import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Trophy, Target, Flame, Star, Award, Check, Lock } from "lucide-react";

interface AchievementsProps {
  onBack: () => void;
}

type Category = "all" | "milestone" | "mastery" | "streak" | "special";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  accent: string;
  tint: string;
  progress: number;
  total: number;
  unlocked: boolean;
  category: Exclude<Category, "all">;
}

export function Achievements({ onBack }: AchievementsProps) {
  const [filter, setFilter] = useState<Category>("all");

  const achievements: Achievement[] = [
    { id: 1, title: "First Steps", description: "Complete your first level", icon: "🎯", accent: "#4F46E5", tint: "#EEF2FF", progress: 1, total: 1, unlocked: true, category: "milestone" },
    { id: 2, title: "Vowel Master", description: "Master all vowel sounds", icon: "🔤", accent: "#F59E0B", tint: "#FFF7ED", progress: 3, total: 5, unlocked: false, category: "mastery" },
    { id: 3, title: "3-Day Streak", description: "Learn for 3 days in a row", icon: "🔥", accent: "#DC2626", tint: "#FEE2E2", progress: 2, total: 3, unlocked: false, category: "streak" },
    { id: 4, title: "Perfect Pronunciation", description: "Get 100% accuracy in a level", icon: "⭐", accent: "#DB2777", tint: "#FCE7F3", progress: 0, total: 1, unlocked: false, category: "special" },
    { id: 5, title: "Explorer", description: "Complete 10 levels", icon: "🗺️", accent: "#10B981", tint: "#D1FAE5", progress: 8, total: 10, unlocked: false, category: "milestone" },
    { id: 6, title: "Blend Champion", description: "Master consonant-vowel blends", icon: "🎨", accent: "#4F46E5", tint: "#EEF2FF", progress: 0, total: 8, unlocked: false, category: "mastery" },
    { id: 7, title: "Week Warrior", description: "Learn for 7 days straight", icon: "💪", accent: "#F59E0B", tint: "#FFF7ED", progress: 2, total: 7, unlocked: false, category: "streak" },
    { id: 8, title: "Sticker Collector", description: "Collect 10 stickers", icon: "📚", accent: "#DB2777", tint: "#FCE7F3", progress: 3, total: 10, unlocked: false, category: "milestone" },
  ];

  const categories: Array<{ id: Category; name: string; icon: typeof Trophy }> = [
    { id: "all", name: "All", icon: Award },
    { id: "milestone", name: "Milestones", icon: Trophy },
    { id: "mastery", name: "Mastery", icon: Target },
    { id: "streak", name: "Streaks", icon: Flame },
    { id: "special", name: "Special", icon: Star },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const visible = filter === "all" ? achievements : achievements.filter((a) => a.category === filter);

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
              <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
              {unlockedCount} of {achievements.length} unlocked
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Recognition</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">Achievements</h1>
              <p className="text-[#4B5266]">Milestones you collect on your reading journey.</p>
            </div>
          </motion.div>

          {/* Filter pill row */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => {
              const Icon = c.icon;
              const active = filter === c.id;
              const count =
                c.id === "all"
                  ? achievements.length
                  : achievements.filter((a) => a.category === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm border transition-colors ${
                    active
                      ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]"
                      : "bg-white border-[#1F243014] text-[#4B5266] hover:border-[#1F243029]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {c.name}
                  <span className={`text-xs ${active ? "text-[#4F46E5]" : "text-[#8A91A3]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Achievements grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((a, i) => {
              const pct = Math.round((a.progress / a.total) * 100);
              return (
                <motion.div
                  key={a.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={a.unlocked ? { y: -3 } : {}}
                  className={`bg-white rounded-2xl p-5 border transition-colors ${
                    a.unlocked
                      ? "border-[#1F243014] hover:border-[#1F243029]"
                      : "border-[#1F243014] opacity-90"
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: a.unlocked ? a.tint : "#F2EEE6" }}
                    >
                      {a.unlocked ? a.icon : <Lock className="w-5 h-5 text-[#8A91A3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[#1F2430] truncate">{a.title}</p>
                        {a.unlocked && (
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: a.tint, color: a.accent }}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                            Earned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8A91A3] mt-0.5">{a.description}</p>
                    </div>
                  </div>

                  {!a.unlocked && (
                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Progress</span>
                        <span className="text-xs text-[#1F2430]">
                          {a.progress}<span className="text-[#8A91A3]"> / {a.total}</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#F2EEE6] rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-1.5 rounded-full"
                          style={{ background: a.accent }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Footer message */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-6 border border-[#1F243014] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-[#4F46E5]" />
            </div>
            <div>
              <p className="text-[#1F2430]">Keep going</p>
              <p className="text-sm text-[#4B5266]">
                {unlockedCount === 0
                  ? "Start your journey to unlock your first achievement."
                  : unlockedCount === achievements.length
                  ? "You've unlocked every achievement — amazing!"
                  : `${achievements.length - unlockedCount} more to unlock.`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
