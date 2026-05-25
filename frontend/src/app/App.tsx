import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, GraduationCap } from "lucide-react";
import { AuthProvider, useAuth, AuthScreen } from "../modules/auth/index";
import { NavigationHeader } from "./components/NavigationHeader";
import { LearnerProfile } from "./components/LearnerProfile";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { StageSelection } from "./components/StageSelection";
import { GameLevel } from "./components/GameLevel";
import { StoryScene } from "./components/StoryScene";
import { LevelMap } from "./components/LevelMap";
import { StickerBook } from "./components/StickerBook";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { LevelComplete } from "./components/LevelComplete";
import { SessionSummary } from "./components/SessionSummary";
import { PhonemeBank } from "./components/PhonemeBank";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { Settings } from "./components/Settings";
import { Achievements } from "./components/Achievements";
import { Help } from "./components/Help";
import { Diagrams } from "./components/Diagrams";

type Screen =
  | "role-select"
  | "auth"
  | "learner-profile"
  | "welcome"
  | "stage-selection"
  | "story-scene"
  | "level-map"
  | "game"
  | "level-complete"
  | "session-summary"
  | "sticker-book"
  | "progress"
  | "phoneme-bank"
  | "teacher-dashboard"
  | "settings"
  | "achievements"
  | "help"
  | "diagrams";

function AppContent() {
  const { isAuthenticated, user, token } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("role-select");
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [completedByStage, setCompletedByStage] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [levelScore, setLevelScore] = useState(300);
  const [learnerName, setLearnerName] = useState("");
  const [learnerAvatar, setLearnerAvatar] = useState("🦊");
  const [userRole, setUserRole] = useState<"learner" | "teacher" | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Check if learner profile exists when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === "learner" && currentScreen === "learner-profile" && token) {
      setIsCheckingProfile(true);
      
      const checkProfile = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const response = await fetch(`${API_URL}/learner/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Profile exists, skip to welcome
            setLearnerName(data.name);
            setLearnerAvatar(data.avatar);
            setCurrentScreen("welcome");
          }
        } catch (error) {
          // Profile doesn't exist, show profile setup
          console.log('No existing profile found, showing setup screen');
        } finally {
          setIsCheckingProfile(false);
        }
      };

      checkProfile();
    }
  }, [isAuthenticated, user, token, currentScreen]);

  const handleRoleSelect = (role: "learner" | "teacher") => {
    setUserRole(role);
    setCurrentScreen("auth");
  };

  const handleAuthSuccess = () => {
    if (userRole === "teacher") {
      setCurrentScreen("teacher-dashboard");
    } else {
      setCurrentScreen("learner-profile");
    }
  };

  const handleProfileComplete = (name: string, avatar: string) => {
    setLearnerName(name);
    setLearnerAvatar(avatar);
    setCurrentScreen("welcome");
  };

  const handleStartAdventure = () => {
    setCurrentScreen("stage-selection");
  };

  const handleSelectStage = (stageId: number) => {
    setSelectedStage(stageId);
    setCurrentScreen("story-scene");
  };

  const handleBeginChapter = () => {
    setCurrentScreen("level-map");
  };

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevel(levelId);
    setCurrentScreen("game");
  };

  const handleLevelComplete = () => {
    setCompletedByStage((prev) => ({
      ...prev,
      [selectedStage]: Math.max(prev[selectedStage] ?? 0, selectedLevel),
    }));
    setCurrentScreen("level-complete");
  };

  const handleContinueAfterLevel = () => {
    setCurrentScreen("session-summary");
  };

  const handleSessionSummaryComplete = () => {
    setCurrentScreen("stage-selection");
  };

  const handleViewProgress = () => {
    setCurrentScreen("progress");
  };

  const handleViewStickers = () => {
    setCurrentScreen("sticker-book");
  };

  const handleViewPhonemeBank = () => {
    setCurrentScreen("phoneme-bank");
  };

  const handleViewAchievements = () => {
    setCurrentScreen("achievements");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBackToStages = () => {
    setCurrentScreen("stage-selection");
  };

  const handleBackToRoleSelect = () => {
    setCurrentScreen("role-select");
    setUserRole(null);
    setLearnerName("");
    setLearnerAvatar("🦊");
  };

  const stickers = ["🦋", "🐝", "🐞", "🦉", "🦄"];

  // Screens that shouldn't show navigation header
  const noHeaderScreens = ["role-select", "auth", "learner-profile", "welcome", "story-scene", "level-map", "game", "level-complete", "teacher-dashboard"];
  const showHeader = userRole === "learner" && !noHeaderScreens.includes(currentScreen);

  // Auth Screen
  if (currentScreen === "auth" && userRole) {
    return (
      <AuthScreen
        selectedRole={userRole}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // Role Selection Screen
  if (currentScreen === "role-select") {
    return (
      <div className="size-full bg-[#FAF7F2] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Subtle editorial accents — soft shapes, no rainbow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#FEF3C7] opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#FB7185]" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-[#10B981]" />

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center relative z-10 max-w-5xl w-full"
        >
          <div className="mb-14">
            <div className="w-20 h-20 bg-[#4F46E5] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_18px_40px_-18px_rgba(79,70,229,0.6)]">
              <span className="text-4xl font-semibold text-white">R</span>
            </div>
            <h1 className="text-5xl md:text-6xl text-[#1F2430] mb-3 tracking-tight">Readlr</h1>
            <p className="text-lg text-[#4B5266] max-w-xl mx-auto">
              A gamified phonetics companion that helps Grade 1 learners read English with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect("learner")}
              className="group bg-white rounded-2xl p-8 border border-[#1F243014] hover:border-[#4F46E5] shadow-[0_1px_2px_rgba(31,36,48,0.04),0_8px_24px_-12px_rgba(31,36,48,0.10)] hover:shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(79,70,229,0.35)] transition-all text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#EEF2FF] rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-[#4F46E5]" />
                </div>
                <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Learner</span>
              </div>
              <h2 className="text-2xl text-[#1F2430] mb-2">I'm a Student</h2>
              <p className="text-[#4B5266] text-sm mb-5">
                Meet Sinta, your reading buddy. Listen, repeat, and earn stickers.
              </p>
              <span className="inline-flex items-center gap-1 text-[#4F46E5] text-sm group-hover:gap-2 transition-all">
                Start learning <span aria-hidden>→</span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect("teacher")}
              className="group bg-white rounded-2xl p-8 border border-[#1F243014] hover:border-[#1F2430] shadow-[0_1px_2px_rgba(31,36,48,0.04),0_8px_24px_-12px_rgba(31,36,48,0.10)] hover:shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(31,36,48,0.25)] transition-all text-left"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#F2EEE6] rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-[#1F2430]" />
                </div>
                <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Educator</span>
              </div>
              <h2 className="text-2xl text-[#1F2430] mb-2">I'm a Teacher</h2>
              <p className="text-[#4B5266] text-sm mb-5">
                See the fluency heatmap, spot trouble words, and pull-aside readers.
              </p>
              <span className="inline-flex items-center gap-1 text-[#1F2430] text-sm group-hover:gap-2 transition-all">
                Open dashboard <span aria-hidden>→</span>
              </span>
            </motion.button>
          </div>

          <div className="mt-14 inline-flex items-center gap-3 text-xs text-[#8A91A3]">
            <span>© 2026 Readlr</span>
            <span className="w-1 h-1 rounded-full bg-[#8A91A3]" />
            <span>All Rights Reserved</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      {showHeader && (
        <NavigationHeader
          userName={learnerName}
          userAvatar={learnerAvatar}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleBackToRoleSelect}
        />
      )}

      <div className="flex-1 overflow-hidden">
        {currentScreen === "learner-profile" && (
          <LearnerProfile onComplete={handleProfileComplete} />
        )}

        {currentScreen === "welcome" && (
          <WelcomeScreen onStart={handleStartAdventure} />
        )}

        {currentScreen === "stage-selection" && (
          <StageSelection
            onSelectStage={handleSelectStage}
            onViewProgress={handleViewProgress}
            onViewStickers={handleViewStickers}
            onViewPhonemeBank={handleViewPhonemeBank}
            onViewAchievements={handleViewAchievements}
          />
        )}

        {currentScreen === "story-scene" && (
          <StoryScene
            stageId={selectedStage}
            onBack={handleBackToStages}
            onBegin={handleBeginChapter}
          />
        )}

        {currentScreen === "level-map" && (
          <LevelMap
            stageId={selectedStage}
            completedCount={completedByStage[selectedStage] ?? 0}
            onBack={handleBackToStages}
            onSelectLevel={handleSelectLevel}
          />
        )}

        {currentScreen === "game" && (
          <GameLevel
            stageId={selectedStage}
            onBack={handleBackToStages}
            onComplete={handleLevelComplete}
          />
        )}

        {currentScreen === "level-complete" && (
          <LevelComplete
            score={levelScore}
            sticker={stickers[Math.floor(Math.random() * stickers.length)]}
            onContinue={handleContinueAfterLevel}
          />
        )}

        {currentScreen === "session-summary" && (
          <SessionSummary
            levelsCompleted={3}
            totalScore={300}
            accuracy={85}
            stickersEarned={3}
            timeSpent={15}
            nextLevel="Valley of Vowels - Level 4: The Sound of O"
            onContinue={handleSessionSummaryComplete}
          />
        )}

        {currentScreen === "sticker-book" && (
          <StickerBook onBack={handleBackToStages} />
        )}

        {currentScreen === "progress" && (
          <ProgressDashboard onBack={handleBackToStages} />
        )}

        {currentScreen === "phoneme-bank" && (
          <PhonemeBank onBack={handleBackToStages} />
        )}

        {currentScreen === "achievements" && (
          <Achievements onBack={handleBackToStages} />
        )}

        {currentScreen === "settings" && (
          <Settings onBack={handleBackToStages} />
        )}

        {currentScreen === "help" && (
          <Help onBack={handleBackToStages} />
        )}

        {currentScreen === "diagrams" && (
          <Diagrams onBack={handleBackToStages} />
        )}

        {currentScreen === "teacher-dashboard" && (
          <TeacherDashboard onBack={handleBackToRoleSelect} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}