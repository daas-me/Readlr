import { motion, AnimatePresence } from "motion/react";
import { Volume2, Bell, Moon, Globe, User, Shield, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../modules/auth/auth.context";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const AVATAR_OPTIONS = [
  "🦊", "🐻", "🐼", "🐨", "🦁", "🐯",
  "🐸", "🐧", "🦋", "🐝", "🦄", "🐙",
  "🐳", "🦕", "🐢", "🐬",
];

interface SettingsProps {
  onNavigate?: (screen: string) => void;
  onAvatarUpdate?: (avatar: string) => void;
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

export function Settings({ onNavigate, onAvatarUpdate }: SettingsProps) {
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [volume, setVolume] = useState(80);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("Filipino");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("🦊");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);

  const handlePickAvatar = (emoji: string) => {
    if (emoji === currentAvatar) {
      setShowAvatarPicker(false);
      return;
    }
    setPendingAvatar(emoji);
    setShowAvatarPicker(false);
    setShowAvatarConfirm(true);
  };

  const handleConfirmAvatar = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/learner/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: pendingAvatar }),
      });
      if (response.ok) {
        setCurrentAvatar(pendingAvatar);
        onAvatarUpdate?.(pendingAvatar);
        toast.success("Avatar updated!", {
          description: `Looking good ${pendingAvatar}`,
        });
      } else {
        toast.error("Could not save. Try again!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsSaving(false);
      setShowAvatarConfirm(false);
    }
  };

  const handleCancelAvatar = () => {
    setPendingAvatar("");
    setShowAvatarConfirm(false);
  };

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
          <div className="flex items-center justify-center mb-8">
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
                {/* Edit profile — navigates to profile page */}
                <button
                  onClick={() => onNavigate?.("profile")}
                  className="w-full py-3.5 flex items-center justify-between text-left text-[#1F2430] hover:text-[#4F46E5] transition-colors"
                >
                  <span>Edit profile</span>
                  <ChevronRight className="w-4 h-4 text-[#8A91A3]" />
                </button>

                {/* Change avatar — opens popup */}
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="w-full py-3.5 flex items-center justify-between text-left text-[#1F2430] hover:text-[#4F46E5] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span>Change avatar</span>
                    <span className="text-xl">{currentAvatar}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A91A3]" />
                </button>
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

      {/* Avatar picker popup */}
      <AnimatePresence>
        {showAvatarPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarPicker(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl p-6 border border-[#1F243014] w-full max-w-sm shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg text-[#1F2430]">Pick your avatar!</h3>
                    <p className="text-xs text-[#8A91A3] mt-0.5">Choose your favourite character</p>
                  </div>
                  <button
                    onClick={() => setShowAvatarPicker(false)}
                    className="w-8 h-8 bg-[#FAF7F2] rounded-lg flex items-center justify-center hover:bg-[#F2EEE6] transition-colors"
                  >
                    <X className="w-4 h-4 text-[#4B5266]" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handlePickAvatar(emoji)}
                      disabled={isSaving}
                      className={`h-14 rounded-xl text-3xl flex items-center justify-center transition-all hover:scale-110 ${
                        currentAvatar === emoji
                          ? "bg-[#EEF2FF] ring-2 ring-[#4F46E5]"
                          : "bg-[#FAF7F2] hover:bg-[#F2EEE6]"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {isSaving && (
                  <p className="text-xs text-center text-[#8A91A3] mt-4">Saving...</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Avatar confirmation dialog */}
      <AlertDialog open={showAvatarConfirm} onOpenChange={setShowAvatarConfirm}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1F2430] text-xl">
              Change your avatar? 🎨
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-[#4B5266]">
                <p className="mb-3">Switch your avatar to this one?</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-[#F2EEE6] rounded-full flex items-center justify-center text-3xl">
                    {currentAvatar}
                  </div>
                  <span className="text-[#8A91A3]">→</span>
                  <div className="w-14 h-14 bg-[#EEF2FF] rounded-full flex items-center justify-center text-3xl ring-2 ring-[#4F46E5]">
                    {pendingAvatar}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelAvatar}
              className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]"
            >
              Keep old one
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAvatar}
              className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            >
              Yes, switch it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}