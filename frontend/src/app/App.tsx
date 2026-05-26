import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { AuthProvider, useAuth, AuthScreen } from "../modules/auth/index";
import { NavigationHeader } from "./components/NavigationHeader";
import { Landing } from "./components/Landing";
import { LearnerProfile } from "./components/LearnerProfile";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { StageSelection } from "./components/StageSelection";
import { GameLevel } from "./components/GameLevel";
import { StoryScene } from "./components/StoryScene";
import { LevelMap } from "./components/LevelMap";
import { StickerBook } from "./components/StickerBook";
import { UnifiedDashboard } from "./components/UnifiedDashboard";
import { LevelComplete } from "./components/LevelComplete";
import { SessionSummary } from "./components/SessionSummary";
import { PhonemeBank } from "./components/PhonemeBank";
import { Settings } from "./components/Settings";
import { Achievements } from "./components/Achievements";
import { Help } from "./components/Help";

type Screen =
  | "landing"
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
  | "dashboard"
  | "phoneme-bank"
  | "settings"
  | "achievements"
  | "help";

function AppContent() {
  const { isAuthenticated, user, token, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [completedByStage, setCompletedByStage] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [levelScore] = useState(300);
  const [learnerName, setLearnerName] = useState("");
  const [learnerAvatar, setLearnerAvatar] = useState("🦊");
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Auto-navigate authenticated users
  useEffect(() => {
    if (isAuthenticated && user && (currentScreen === "landing" || currentScreen === "auth")) {
      // User just logged in, go to learner profile setup
      setCurrentScreen("learner-profile");
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
    setAuthMode('register');
    setCurrentScreen("auth");
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setCurrentScreen("auth");
  };

  const handleAuthSuccess = () => {
    // After auth, learner-profile will be shown (auto-navigate via useEffect)
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
    setCurrentScreen("dashboard");
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
    setCurrentScreen("auth");
    setAuthMode('login');
    setLearnerName("");
    setLearnerAvatar("🦊");
  };

  const stickers = ["🦋", "🐝", "🐞", "🦉", "🦄"];

  // Screens that shouldn't show navigation header
  const noHeaderScreens = ["landing", "auth", "learner-profile", "welcome", "story-scene", "level-map", "game", "level-complete"];
  const showLearnerHeader = user?.role === "learner" && !noHeaderScreens.includes(currentScreen);

  // Landing Screen
  if (currentScreen === "landing") {
    return <Landing onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
  }

  // Auth Screen
  if (currentScreen === "auth") {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
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

      <div className="flex-1 overflow-hidden">
        {currentScreen === "learner-profile" && (
          <LearnerProfile onComplete={handleProfileComplete} />
        )}

        {currentScreen === "welcome" && (
          <WelcomeScreen onStart={handleStartAdventure} userName={learnerName} />
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

        {currentScreen === "dashboard" && (
          <UnifiedDashboard
            userName={learnerName || user?.name}
          />
        )}

        {currentScreen === "phoneme-bank" && (
          <PhonemeBank onBack={handleBackToStages} />
        )}

        {currentScreen === "achievements" && (
          <Achievements onBack={handleBackToStages} />
        )}

        {currentScreen === "settings" && (
          <Settings />
        )}

        {currentScreen === "help" && (
          <Help />
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