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
import { ChapterBridge } from "./components/ChapterBridge";
import { LevelMap } from "./components/LevelMap";
import { StickerBook } from "./components/StickerBook";
import { UnifiedDashboard } from "./components/UnifiedDashboard";
import { LevelComplete } from "./components/LevelComplete";
import { ChapterCelebration } from "./components/ChapterCelebration";
import { SessionSummary } from "./components/SessionSummary";
import { PhonemeBank } from "./components/PhonemeBank";
import { Settings } from "./components/Settings";
import { Achievements } from "./components/Achievements";
import { Help } from "./components/Help";
import { ProfilePage } from "./components/ProfilePage";

// Stage configuration for determining progress
const STAGE_CONFIG: Record<number, { title: string; totalLevels: number; nextStageId?: number }> = {
  1: { title: "Valley of Vowels", totalLevels: 5, nextStageId: 2 },
  2: { title: "Blending Bridges", totalLevels: 8, nextStageId: 3 },
  3: { title: "CVC Kingdom", totalLevels: 10 },
};

const DEFAULT_PROGRESS: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

function getProgressStorageKey(userId?: number): string | null {
  return userId ? `readlr_progress_user_${userId}` : null;
}

function readProgressFromStorage(userId?: number): Record<number, number> {
  const storageKey = getProgressStorageKey(userId);
  if (!storageKey) return { ...DEFAULT_PROGRESS };

  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgressToStorage(userId: number | undefined, progress: Record<number, number>) {
  const storageKey = getProgressStorageKey(userId);
  if (!storageKey) return;
  localStorage.setItem(storageKey, JSON.stringify(progress));
}
// Vowel mapping for stage 1 (levels 1-5 correspond to A, E, I, O, U)
const VOWEL_MAP: Record<number, { vowel: string; name: string }> = {
  1: { vowel: "A", name: "" },
  2: { vowel: "E", name: "" },
  3: { vowel: "I", name: "" },
  4: { vowel: "O", name: "" },
  5: { vowel: "U", name: "" },
};

const BLENDING_MAP: Record<number, { consonant: string; vowel: string; name: string }> = {
  1: { consonant: "M", vowel: "A", name: "MA" },
  2: { consonant: "B", vowel: "A", name: "BA" },
  3: { consonant: "T", vowel: "A", name: "TA" },
  4: { consonant: "S", vowel: "A", name: "SA" },
  5: { consonant: "L", vowel: "A", name: "LA" },
  6: { consonant: "P", vowel: "A", name: "PA" },
  7: { consonant: "N", vowel: "A", name: "NA" },
  8: { consonant: "D", vowel: "A", name: "DA" },
};



type Screen =
  | "landing"
  | "auth"
  | "learner-profile"
  | "welcome"
  | "stage-selection"
  | "story-scene"
  | "chapter-bridge"
  | "level-map"
  | "game"
  | "chapter-celebration"
  | "level-complete"
  | "session-summary"
  | "sticker-book"
  | "dashboard"
  | "phoneme-bank"
  | "settings"
  | "achievements"
  | "help"
  | "profile";

interface AppRouteState {
  screen: Screen;
  authMode?: "login" | "register";
  stageId?: number;
  levelId?: number;
}

const DEFAULT_ROUTE: AppRouteState = { screen: "landing" };

function parseAppPath(pathname: string): AppRouteState {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return DEFAULT_ROUTE;
  if (path === "/login") return { screen: "auth", authMode: "login" };
  if (path === "/register") return { screen: "auth", authMode: "register" };
  if (path === "/profile/setup") return { screen: "learner-profile" };
  if (path === "/welcome") return { screen: "welcome" };
  if (path === "/home") return { screen: "stage-selection" };
  if (path === "/stickers") return { screen: "sticker-book" };
  if (path === "/progress") return { screen: "dashboard" };
  if (path === "/sounds") return { screen: "phoneme-bank" };
  if (path === "/settings") return { screen: "settings" };
  if (path === "/achievements") return { screen: "achievements" };
  if (path === "/help") return { screen: "help" };
  if (path === "/profile") return { screen: "profile" };

  const stageMatch = path.match(/^\/stage-(\d+)(?:\/(chapters|chapter-(\d+)(?:\/(intro|complete|summary|level-complete))?))?$/);
  if (stageMatch) {
    const stageId = Number(stageMatch[1]);
    const stageSection = stageMatch[2];
    const levelId = stageMatch[3] ? Number(stageMatch[3]) : 1;
    const chapterSection = stageMatch[4];

    if (!stageSection) return { screen: "story-scene", stageId, levelId: 1 };
    if (stageSection === "chapters") return { screen: "level-map", stageId, levelId: 1 };
    if (chapterSection === "intro") return { screen: "chapter-bridge", stageId, levelId };
    if (chapterSection === "complete") return { screen: "chapter-celebration", stageId, levelId };
    if (chapterSection === "summary") return { screen: "session-summary", stageId, levelId };
    if (chapterSection === "level-complete") return { screen: "level-complete", stageId, levelId };

    return { screen: "game", stageId, levelId };
  }

  return DEFAULT_ROUTE;
}

function buildAppPath(screen: Screen, stageId: number, levelId: number, authMode: "login" | "register"): string {
  switch (screen) {
    case "landing":
      return "/";
    case "auth":
      return authMode === "login" ? "/login" : "/register";
    case "learner-profile":
      return "/profile/setup";
    case "welcome":
      return "/welcome";
    case "stage-selection":
      return "/home";
    case "story-scene":
      return `/stage-${stageId}`;
    case "chapter-bridge":
      return `/stage-${stageId}/chapter-${levelId}/intro`;
    case "level-map":
      return `/stage-${stageId}/chapters`;
    case "game":
      return `/stage-${stageId}/chapter-${levelId}`;
    case "chapter-celebration":
      return `/stage-${stageId}/chapter-${levelId}/complete`;
    case "level-complete":
      return `/stage-${stageId}/chapter-${levelId}/level-complete`;
    case "session-summary":
      return `/stage-${stageId}/chapter-${levelId}/summary`;
    case "sticker-book":
      return "/stickers";
    case "dashboard":
      return "/progress";
    case "phoneme-bank":
      return "/sounds";
    case "settings":
      return "/settings";
    case "achievements":
      return "/achievements";
    case "help":
      return "/help";
    case "profile":
      return "/profile";
    default:
      return "/";
  }
}

function AppContent() {
  const { isAuthenticated, user, token, isLoading: isAuthLoading, logout } = useAuth();
  const initialRoute = parseAppPath(window.location.pathname);
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialRoute.screen);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialRoute.authMode ?? 'register');
  const [selectedStage, setSelectedStage] = useState<number>(initialRoute.stageId ?? 1);
  const [selectedLevel, setSelectedLevel] = useState<number>(initialRoute.levelId ?? 1);
  const [completedByStage, setCompletedByStage] = useState<Record<number, number>>({ ...DEFAULT_PROGRESS });
  const [levelScore] = useState(300);
  const [learnerName, setLearnerName] = useState("");
  const [learnerAvatar, setLearnerAvatar] = useState("🦊");
  const [learnerId, setLearnerId] = useState<number | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [isSyncingProgress, setIsSyncingProgress] = useState(false);
  const [isLevelJustCompleted, setIsLevelJustCompleted] = useState(false);
  const publicScreens: Screen[] = ["landing", "auth"];
  const isPublicScreen = publicScreens.includes(currentScreen);

  useEffect(() => {
    if (isAuthenticated && user?.role === "learner") {
      setCompletedByStage(readProgressFromStorage(user.id));
      return;
    }

    if (!isAuthenticated) {
      setCompletedByStage({ ...DEFAULT_PROGRESS });
    }
  }, [isAuthenticated, user]);
  useEffect(() => {
    const handlePopState = () => {
      const route = parseAppPath(window.location.pathname);
      // Prevent direct access to celebration screen via URL - redirect to level map
      if (route.screen === "chapter-celebration" && !isLevelJustCompleted) {
        setCurrentScreen("level-map");
        setIsLevelJustCompleted(false);
        return;
      }
      setCurrentScreen(route.screen);
      if (route.authMode) setAuthMode(route.authMode);
      if (route.stageId) setSelectedStage(route.stageId);
      if (route.levelId) setSelectedLevel(route.levelId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isLevelJustCompleted]);

  useEffect(() => {
    const nextPath = buildAppPath(currentScreen, selectedStage, selectedLevel, authMode);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, [currentScreen, selectedStage, selectedLevel, authMode]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !isPublicScreen) {
      setCurrentScreen("landing");
    }
  }, [isAuthLoading, isAuthenticated, isPublicScreen]);

  // Protect celebration screen from direct URL access
  useEffect(() => {
    const route = parseAppPath(window.location.pathname);
    if (route.screen === "chapter-celebration" && !isLevelJustCompleted) {
      // Redirect to level map if someone tries to access celebration URL directly
      setCurrentScreen("level-map");
    }
  }, []);

  // Auto-navigate authenticated users
  useEffect(() => {
    if (isAuthenticated && user && (currentScreen === "landing" || currentScreen === "auth")) {
      // User just logged in, go to learner profile setup
      setCurrentScreen("learner-profile");
    }
  }, [isAuthenticated, user, currentScreen]);

  // Check if learner profile exists and fetch progress when showing learner-profile screen
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
            setLearnerId(data.id);
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

  // Fetch progress from backend when user authenticates
  useEffect(() => {
    if (isAuthenticated && user?.role === "learner" && token && learnerId) {
      setIsSyncingProgress(true);
      
      const fetchProgress = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const response = await fetch(`${API_URL}/progress/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const progressData = await response.json();
            const stages = Array.isArray(progressData)
              ? progressData
              : Array.isArray(progressData.stages)
                ? progressData.stages
                : [];
            const newCompletedByStage: Record<number, number> = { ...DEFAULT_PROGRESS };
            
            stages.forEach((progress: { stage_id: number; completed_levels: number }) => {
              newCompletedByStage[progress.stage_id] = progress.completed_levels;
            });
            
            setCompletedByStage(newCompletedByStage);
            saveProgressToStorage(user.id, newCompletedByStage);
          }
        } catch (error) {
          console.error('Failed to fetch progress from backend:', error);
          // Fallback to initialized state
        } finally {
          setIsSyncingProgress(false);
        }
      };

      fetchProgress();
    }
  }, [isAuthenticated, user, token, learnerId]);

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

  const handleProfileComplete = (name: string, avatar: string, newLearnerId?: number) => {
    setLearnerName(name);
    setLearnerAvatar(avatar);
    if (newLearnerId) setLearnerId(newLearnerId);
    setCompletedByStage(readProgressFromStorage(user?.id));
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

  const handleLevelComplete = async () => {
    const newProgress = Math.max(completedByStage[selectedStage] ?? 0, selectedLevel);
    
    // Update local state and the per-user fallback cache.
    const nextProgress = {
      ...completedByStage,
      [selectedStage]: newProgress,
    };
    setCompletedByStage(nextProgress);
    saveProgressToStorage(user?.id, nextProgress);

    // Save to backend
    if (learnerId && token) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const stageConfig = STAGE_CONFIG[selectedStage];
        
        await fetch(`${API_URL}/progress/learners/${learnerId}/stages/${selectedStage}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completed_levels: newProgress,
            total_levels: stageConfig.totalLevels,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress to backend:', error);
        // Progress is still saved locally, so app continues to work
      }
    }

    // Mark level as legitimately completed before showing celebration screen
    setIsLevelJustCompleted(true);
    setCurrentScreen("chapter-celebration");
  };

  const handleContinueToNextStory = () => {
    const nextLevel = selectedLevel + 1;
    const stageConfig = STAGE_CONFIG[selectedStage];
    
    // Reset completion flag when leaving celebration screen
    setIsLevelJustCompleted(false);
    
    if (stageConfig && nextLevel <= stageConfig.totalLevels) {
      // More levels in this stage - show chapter bridge intro for next level
      setSelectedLevel(nextLevel);
      setCurrentScreen("chapter-bridge");
    } else if (stageConfig?.nextStageId) {
      // All levels complete in this stage, move to next stage
      setSelectedStage(stageConfig.nextStageId);
      setSelectedLevel(1);
      setCurrentScreen("story-scene");
    } else {
      // All stages complete, go back to stage selection
      setCurrentScreen("stage-selection");
    }
  };

  const handleBeginChapterFromBridge = () => {
    // Go directly to the game level challenge
    setCurrentScreen("game");
  };

  const handleBackFromBridge = () => {
    // Go back to level map
    setCurrentScreen("level-map");
  };

  const handleBackFromCelebration = () => {
    // Reset completion flag when leaving celebration screen
    setIsLevelJustCompleted(false);
    setCurrentScreen("level-map");
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

  const handleBackToLevelMap = () => {
    setCurrentScreen("level-map");
  };

  const handleBackToRoleSelect = () => {
    logout();
    setCurrentScreen("auth");
    setAuthMode('login');
    setLearnerName("");
    setLearnerAvatar("🦊");
    setLearnerId(null);
    setCompletedByStage({ ...DEFAULT_PROGRESS });
  };

  const stickers = ["🦋", "🐝", "🐞", "🦉", "🦄"];

  // Screens that shouldn't show navigation header
  const noHeaderScreens = ["landing", "auth", "learner-profile", "welcome", "story-scene", "chapter-bridge", "level-map", "game", "level-complete"];
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

  if (isAuthLoading && token && !user && !isPublicScreen) {
    return (
      <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E6DED2] border-t-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated && !isPublicScreen) {
    return <Landing onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
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
            completedByStage={completedByStage}
          />
        )}

        {currentScreen === "story-scene" && (
          <StoryScene
            stageId={selectedStage}
            onBack={handleBackToStages}
            onBegin={handleBeginChapter}
          />
        )}

        {currentScreen === "chapter-bridge" && (
          <ChapterBridge
            stageName={STAGE_CONFIG[selectedStage]?.title ?? "Chapter"}
            currentLevel={selectedLevel}
            // For Stage 1, use VOWEL_MAP. For Stage 2, pass empty strings or use the first letter of the blend
            vowel={selectedStage === 1 ? VOWEL_MAP[selectedLevel]?.vowel ?? "A" : BLENDING_MAP[selectedLevel]?.vowel ?? "A"}
            vowelName={selectedStage === 1 ? VOWEL_MAP[selectedLevel]?.name ?? "Apple" : ""}
            stageId={selectedStage}
            // Pass the blending pair only if we are in Stage 2
            blendingPair={selectedStage === 2 ? {
              consonant: BLENDING_MAP[selectedLevel]?.consonant ?? "M",
              vowel: BLENDING_MAP[selectedLevel]?.vowel ?? "A"
            } : undefined}
            onBeginChapter={handleBeginChapterFromBridge}
            onBack={handleBackFromBridge}
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
            levelId={selectedLevel}
            onBack={handleBackToLevelMap}
            onComplete={handleLevelComplete}
          />
        )}

        {currentScreen === "chapter-celebration" && (
          <ChapterCelebration
            sticker={stickers[Math.floor(Math.random() * stickers.length)]}
            score={levelScore}
            currentLevel={selectedLevel}
            totalLevels={STAGE_CONFIG[selectedStage]?.totalLevels ?? 5}
            stageName={STAGE_CONFIG[selectedStage]?.title ?? "Chapter"}
            onContinueStory={handleContinueToNextStory}
            onBackToMap={handleBackFromCelebration}
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
            completedByStage={completedByStage}
          />
        )}

        {currentScreen === "phoneme-bank" && (
          <PhonemeBank onBack={handleBackToStages} />
        )}

        {currentScreen === "achievements" && (
          <Achievements onBack={handleBackToStages} />
        )}

        {currentScreen === "settings" && (
          <Settings
            onNavigate={handleNavigate}
            onAvatarUpdate={(avatar) => setLearnerAvatar(avatar)}
          />
        )}

        {currentScreen === "help" && (
          <Help />
        )}

        {currentScreen === "profile" && (
          <ProfilePage
            onBack={() => setCurrentScreen("stage-selection")}
            onAvatarUpdate={(avatar) => setLearnerAvatar(avatar)}
            onNameUpdate={(name) => setLearnerName(name)}
          />
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
