import { motion } from "motion/react";
import { Volume2, Bell, Moon, Globe, User, Shield, ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SettingsProps {
  onBack: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-[#4F46E5]" : "bg-[#E5E1D8]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export function Settings({ onBack }: SettingsProps) {
  const [volume, setVolume] = useState(80);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("Filipino");

  const sections: Array<{
    id: string;
    title: string;
    subtitle: string;
    icon: typeof Volume2;
    tint: string;
    color: string;
  }> = [
    { id: "audio", title: "Audio", subtitle: "Sound and voice", icon: Volume2, tint: "#EEF2FF", color: "#4F46E5" },
    { id: "notif", title: "Notifications", subtitle: "Reminders and alerts", icon: Bell, tint: "#FCE7F3", color: "#DB2777" },
    { id: "appearance", title: "Appearance", subtitle: "Visual preferences", icon: Moon, tint: "#E0E7FF", color: "#4338CA" },
    { id: "language", title: "Language", subtitle: "Interface language", icon: Globe, tint: "#D1FAE5", color: "#10B981" },
    { id: "account", title: "Account", subtitle: "Profile settings", icon: User, tint: "#FFF7ED", color: "#F59E0B" },
    { id: "privacy", title: "Privacy & Safety", subtitle: "Data and security", icon: Shield, tint: "#F2EEE6", color: "#4B5266" },
  ];

  const SectionHeader = ({ id }: { id: string }) => {
    const s = sections.find((x) => x.id === id)!;
    const Icon = s.icon;
    return (
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.tint }}>
          <Icon className="w-5 h-5" style={{ color: s.color }} />
        </div>
        <div className="leading-tight">
          <h2 className="text-lg text-[#1F2430]">{s.title}</h2>
          <p className="text-xs text-[#8A91A3]">{s.subtitle}</p>
        </div>
      </div>
    );
  };

  const Row = ({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[#1F2430]">{title}</p>
        {description && <p className="text-xs text-[#8A91A3] mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Settings</span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Preferences</p>
            <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">Settings</h1>
            <p className="text-[#4B5266] mt-2">Customize your learning experience.</p>
          </motion.div>

          <div className="space-y-4">
            {/* Audio */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="audio" />
              <div className="divide-y divide-[#1F243014]">
                <div className="py-3.5">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-[#1F2430]">Volume</p>
                    <span className="text-sm text-[#4F46E5]">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#F2EEE6] rounded-full appearance-none cursor-pointer accent-[#4F46E5]"
                  />
                </div>
                <Row title="Voice feedback" description="Play audio for correct answers">
                  <Toggle checked={voiceFeedback} onChange={setVoiceFeedback} />
                </Row>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="notif" />
              <div className="divide-y divide-[#1F243014]">
                <Row title="Daily reminders" description="Get reminded to practice">
                  <Toggle checked={notifications} onChange={setNotifications} />
                </Row>
                <Row title="Achievement alerts" description="Celebrate your wins">
                  <Toggle checked={achievementAlerts} onChange={setAchievementAlerts} />
                </Row>
              </div>
            </motion.section>

            {/* Appearance */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="appearance" />
              <div className="divide-y divide-[#1F243014]">
                <Row title="Dark mode" description="Reduce eye strain">
                  <Toggle checked={darkMode} onChange={setDarkMode} />
                </Row>
              </div>
            </motion.section>

            {/* Language */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="language" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#1F243014] rounded-xl text-[#1F2430] focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#EEF2FF] transition-all"
              >
                <option value="Filipino">Filipino</option>
                <option value="English">English</option>
                <option value="Cebuano">Cebuano</option>
                <option value="Ilocano">Ilocano</option>
              </select>
            </motion.section>

            {/* Account */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="account" />
              <div className="divide-y divide-[#1F243014]">
                {["Edit profile", "Change avatar"].map((label) => (
                  <button
                    key={label}
                    className="w-full py-3.5 flex items-center justify-between text-left text-[#1F2430] hover:text-[#4F46E5] transition-colors"
                  >
                    <span>{label}</span>
                    <ChevronRight className="w-4 h-4 text-[#8A91A3]" />
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Privacy */}
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-[#1F243014]"
            >
              <SectionHeader id="privacy" />
              <div className="divide-y divide-[#1F243014]">
                <button className="w-full py-3.5 flex items-center justify-between text-left text-[#1F2430] hover:text-[#4F46E5] transition-colors">
                  <span>Privacy policy</span>
                  <ChevronRight className="w-4 h-4 text-[#8A91A3]" />
                </button>
                <button className="w-full py-3.5 flex items-center justify-between text-left text-[#DC2626] hover:opacity-80 transition-opacity">
                  <span>Delete my data</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          </div>

          <p className="mt-8 text-center text-xs text-[#8A91A3]">
            Readlr v1.0.0 · Team 2526-sem2-it332-27
          </p>
        </div>
      </div>
    </div>
  );
}
