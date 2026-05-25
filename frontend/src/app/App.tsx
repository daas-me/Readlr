import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AuthProvider, useAuth, AuthScreen } from "../modules/auth/index";
import { NavigationHeader } from "./components/NavigationHeader";
import { TeacherNavigationHeader } from "./components/TeacherNavigationHeader";
import { Landing } from "./components/Landing";
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
  | "landing"
  | "auth"
  | "role-select"
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
  | "teacher-students"
  | "teacher-analytics"
  | "teacher-reports"
  | "teacher-settings"
  | "settings"
  | "achievements"
  | "help"
  | "diagrams";

function AppContent() {
  const { isAuthenticated, user, token, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [completedByStage, setCompletedByStage] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [levelScore] = useState(300);
  const [learnerName, setLearnerName] = useState("");
  const [learnerAvatar, setLearnerAvatar] = useState("🦊");
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Auto-navigate authenticated users
  useEffect(() => {
    if (isAuthenticated && user && currentScreen === "landing") {
      // User just logged in, go to role-select
      setCurrentScreen("role-select");
    }
  }, [isAuthenticated, user, currentScreen]);

  // Check if learner profile exists when showing learner-profile screen
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

  const handleGetStarted = () => {
    setCurrentScreen("auth");
  };

  const handleAuthSuccess = () => {
    // After auth, go to role selection
    setCurrentScreen("role-select");
  };

  const handleRoleSelect = (role: "learner" | "teacher") => {
    if (role === "teacher") {
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
    logout();
    setCurrentScreen("landing");
    setLearnerName("");
    setLearnerAvatar("🦊");
  };

  const stickers = ["🦋", "🐝", "🐞", "🦉", "🦄"];

  // Screens that shouldn't show navigation header
  const noHeaderScreens = ["landing", "auth", "role-select", "learner-profile", "welcome", "story-scene", "level-map", "game", "level-complete"];
  const showLearnerHeader = user?.role === "learner" && !noHeaderScreens.includes(currentScreen);
  const showTeacherHeader = user?.role === "teacher" && currentScreen.startsWith("teacher-");

  // Landing Screen
  if (currentScreen === "landing") {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  // Auth Screen
  if (currentScreen === "auth") {
    return (
      <AuthScreen
        selectedRole={null}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // Role Selection Screen (locked to authenticated user's role)
  if (currentScreen === "role-select" && user) {
    return (
      <div className="size-full bg-[#FAF7F2] flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-70" />
        <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#FEF3C7] opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#FB7185]" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-[#10B981]" />

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center relative z-10 max-w-5xl w-full flex-1 flex flex-col items-center justify-center"
        >
          <div className="mb-14">
            <h1 className="text-4xl md:text-5xl text-[#1F2430] mb-3 tracking-tight">Welcome!</h1>
            <p className="text-lg text-[#4B5266] max-w-xl mx-auto">
              You're registered as a {user.role === "learner" ? "Student" : "Teacher"}. Let's get you set up.
            </p>
          </div>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect(user.role === "learner" ? "learner" : "teacher")}
            className={`px-8 py-3 rounded-2xl text-lg font-semibold inline-flex items-center gap-2 transition-all ${
              user.role === "learner"
                ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_8px_24px_-12px_rgba(79,70,229,0.6)]"
                : "bg-[#1F2430] hover:bg-[#0F1419] text-white shadow-[0_8px_24px_-12px_rgba(31,36,48,0.6)]"
            }`}
          >
            {user.role === "learner" ? "Start Learning" : "Open Dashboard"}
          </motion.button>

          <button
            onClick={handleBackToRoleSelect}
            className="mt-auto pt-6 text-sm text-[#4B5266] hover:text-[#1F2430] transition-colors"
          >
            Not {user.role === "learner" ? "a student" : "a teacher"}? <span className="text-[#4F46E5]">Log out</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col">
      {showLearnerHeader && (
        <NavigationHeader
          userName={learnerName}
          userAvatar={learnerAvatar}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleBackToRoleSelect}
        />
      )}

      {showTeacherHeader && (
        <TeacherNavigationHeader
          teacherName={user?.name}
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

        {currentScreen === "teacher-students" && (
          <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl text-[#1F2430] mb-4">Students</h1>
              <p className="text-[#4B5266]">Student management interface coming soon</p>
            </div>
          </div>
        )}

        {currentScreen === "teacher-analytics" && (
          <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl text-[#1F2430] mb-4">Analytics</h1>
              <p className="text-[#4B5266]">Advanced analytics coming soon</p>
            </div>
          </div>
        )}

        {currentScreen === "teacher-reports" && (
          <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl text-[#1F2430] mb-4">Reports</h1>
              <p className="text-[#4B5266]">Report generation coming soon</p>
            </div>
          </div>
        )}

        {currentScreen === "teacher-settings" && (
          <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl text-[#1F2430] mb-4">Teacher Settings</h1>
              <p className="text-[#4B5266]">Teacher settings coming soon</p>
            </div>
          </div>
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