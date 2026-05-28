import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Pencil, Check, X, Star, Trophy, Flame, Upload, Camera, Smile } from "lucide-react";
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

const BASE_URL = "http://localhost:3000";

interface ProfilePageProps {
  onBack: () => void;
  onAvatarUpdate: (avatar: string) => void;
  onAvatarUrlUpdate: (url: string | null) => void;
  onNameUpdate: (name: string) => void;
}

interface LearnerProfile {
  id: number;
  name: string;
  avatar: string;
  avatar_url: string | null;
  grade: number;
}

interface StageProgress {
  stage_id: number;
  completed_levels: number;
  total_levels: number;
  completion_percentage: number;
}

interface ProgressSummary {
  stages: StageProgress[];
  overall_completion_percentage: number;
}

// Shows photo if available, emoji otherwise
function AvatarDisplay({
  avatar,
  avatarUrl,
  size = "md",
}: {
  avatar: string;
  avatarUrl: string | null;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "w-24 h-24 text-5xl" : "w-20 h-20 text-4xl";
  if (avatarUrl) {
    return (
      <img
        src={`${BASE_URL}${avatarUrl}`}
        alt="Your avatar"
        className={`${dim} rounded-full object-cover border-2 border-[#1F243014]`}
      />
    );
  }
  return (
    <div className={`${dim} bg-[#F2EEE6] rounded-full flex items-center justify-center border-2 border-[#1F243014]`}>
      {avatar}
    </div>
  );
}

export function ProfilePage({ onBack, onAvatarUpdate, onAvatarUrlUpdate, onNameUpdate }: ProfilePageProps) {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  // "emoji" | "photo" — which picker tab is open
  const [avatarPickerTab, setAvatarPickerTab] = useState<"emoji" | "photo" | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingName, setPendingName] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);
  const [showRemovePhotoConfirm, setShowRemovePhotoConfirm] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (!token) return;
      try {
        const [profileRes, progressRes] = await Promise.all([
          fetch(`${API_URL}/learner/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/progress/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.learner);
          setEditedName(data.learner.name);
        }
        if (progressRes.ok) {
          const data = await progressRes.json();
          setProgress(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const saveChanges = async (updates: { name?: string; avatar?: string }) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/learner/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => prev ? { ...prev, ...data.learner } : data.learner);
        if (updates.name) {
          onNameUpdate(data.learner.name);
          toast.success("Name updated!", {
            description: `Your name is now "${data.learner.name}" 🎉`,
          });
        }
        if (updates.avatar) {
          onAvatarUpdate(data.learner.avatar);
          toast.success("Avatar updated!", {
            description: `Looking good ${data.learner.avatar}`,
          });
        }
      } else {
        toast.error("Could not save. Try again!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload photo to backend
  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_URL}/upload/avatar`, {
        method: "POST",
        headers: {
          "x-user-id": String(user.id),
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => prev ? { ...prev, avatar_url: data.avatarUrl } : prev);
        onAvatarUrlUpdate(data.avatarUrl);
        setAvatarPickerTab(null);
        toast.success("Photo uploaded! 📸", {
          description: "Your profile photo is now showing.",
        });
      } else {
        toast.error("Upload failed. Try again!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded photo, revert to emoji
  const handleRemovePhoto = async () => {
    if (!user) return;
    setIsUploading(true);
    try {
      const response = await fetch(`${API_URL}/upload/avatar`, {
        method: "DELETE",
        headers: {
          "x-user-id": String(user.id),
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setProfile((prev) => prev ? { ...prev, avatar_url: null } : prev);
        onAvatarUrlUpdate(null);
        setShowRemovePhotoConfirm(false);
        toast.success("Photo removed!", {
          description: "Back to your emoji avatar 🦊",
        });
      } else {
        toast.error("Could not remove photo. Try again!");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveName = () => {
    if (!editedName.trim() || editedName.trim() === profile?.name) {
      setIsEditingName(false);
      return;
    }
    setPendingName(editedName.trim());
    setShowNameConfirm(true);
    setIsEditingName(false);
  };

  const handleConfirmName = () => {
    saveChanges({ name: pendingName });
    setShowNameConfirm(false);
  };

  const handleCancelName = () => {
    setEditedName(profile?.name || "");
    setShowNameConfirm(false);
  };

  const handlePickEmoji = (emoji: string) => {
    if (emoji === profile?.avatar) {
      setAvatarPickerTab(null);
      return;
    }
    setPendingAvatar(emoji);
    setAvatarPickerTab(null);
    setShowAvatarConfirm(true);
  };

  const handleConfirmAvatar = () => {
    // When switching to emoji, also clear photo
    saveChanges({ avatar: pendingAvatar });
    if (profile?.avatar_url) {
      handleRemovePhoto();
    }
    setShowAvatarConfirm(false);
  };

  const handleCancelAvatar = () => {
    setPendingAvatar("");
    setShowAvatarConfirm(false);
  };

  const totalCompleted = progress?.stages.reduce((sum, s) => sum + s.completed_levels, 0) ?? 0;
  const totalLevels = progress?.stages.reduce((sum, s) => sum + (s.total_levels ?? 0), 0) ?? 0;
  const overallPct = progress?.overall_completion_percentage ?? 0;

  if (isLoading) {
    return (
      <div className="size-full bg-[#FAF7F2] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-5xl"
        >
          🦊
        </motion.div>
      </div>
    );
  }

  const displayName = profile?.name || user?.name || "Friend";
  const displayAvatar = profile?.avatar || "🦊";
  const displayAvatarUrl = profile?.avatar_url ?? null;
  const displayGrade = profile?.grade || 1;

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Back button */}
          <motion.button
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#4B5266] hover:text-[#1F2430] mb-8 transition-colors bg-white border border-[#1F243014] rounded-full px-4 py-2 hover:bg-[#F2EEE6]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>

          <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">My Account</p>

          <motion.h1
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl text-[#1F2430] tracking-tight mb-8"
          >
            My Profile
          </motion.h1>

          {/* Avatar + Name card */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl p-6 border border-[#1F243014] mb-4"
          >
            <div className="flex items-center gap-5">
              {/* Avatar display with edit button */}
              <div className="relative">
                <AvatarDisplay
                  avatar={displayAvatar}
                  avatarUrl={displayAvatarUrl}
                />
                <button
                  onClick={() => setAvatarPickerTab(avatarPickerTab ? null : "emoji")}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#4F46E5] rounded-full flex items-center justify-center shadow-sm hover:bg-[#4338CA] transition-colors"
                >
                  <Pencil className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* Name */}
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setIsEditingName(false);
                          setEditedName(profile?.name || "");
                        }
                      }}
                      className="text-2xl text-[#1F2430] bg-[#FAF7F2] border border-[#4F46E5] rounded-lg px-3 py-1 outline-none w-full"
                      maxLength={30}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center hover:bg-[#4338CA] transition-colors"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => { setIsEditingName(false); setEditedName(profile?.name || ""); }}
                      className="w-8 h-8 bg-white border border-[#1F243014] rounded-lg flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
                    >
                      <X className="w-4 h-4 text-[#4B5266]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl text-[#1F2430]">{displayName}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="w-7 h-7 bg-[#FAF7F2] rounded-lg flex items-center justify-center hover:bg-[#F2EEE6] transition-colors"
                    >
                      <Pencil className="w-3 h-3 text-[#8A91A3]" />
                    </button>
                  </div>
                )}
                <p className="text-xs uppercase tracking-wider text-[#8A91A3] mt-1">
                  Grade {displayGrade} Learner
                </p>
              </div>
            </div>
          </motion.div>

          {/* Avatar picker panel */}
          {avatarPickerTab && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-[#4F46E5]/30 mb-4"
            >
              {/* Tab switcher */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAvatarPickerTab("emoji")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      avatarPickerTab === "emoji"
                        ? "bg-[#EEF2FF] text-[#4F46E5]"
                        : "text-[#8A91A3] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                    Animal Avatar
                  </button>
                  <button
                    onClick={() => setAvatarPickerTab("photo")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      avatarPickerTab === "photo"
                        ? "bg-[#EEF2FF] text-[#4F46E5]"
                        : "text-[#8A91A3] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    My Photo
                  </button>
                </div>
                <button
                  onClick={() => setAvatarPickerTab(null)}
                  className="w-7 h-7 bg-[#FAF7F2] rounded-lg flex items-center justify-center hover:bg-[#F2EEE6] transition-colors"
                >
                  <X className="w-4 h-4 text-[#4B5266]" />
                </button>
              </div>

              {/* Emoji tab */}
              {avatarPickerTab === "emoji" && (
                <>
                  <p className="text-sm text-[#8A91A3] mb-3">Pick your animal friend!</p>
                  <div className="grid grid-cols-8 gap-2">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handlePickEmoji(emoji)}
                        className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-110 ${
                          displayAvatar === emoji && !displayAvatarUrl
                            ? "bg-[#EEF2FF] ring-2 ring-[#4F46E5]"
                            : "bg-[#FAF7F2] hover:bg-[#F2EEE6]"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Photo tab */}
              {avatarPickerTab === "photo" && (
                <div className="space-y-4">
                  <p className="text-sm text-[#8A91A3]">
                    Upload a photo to use as your profile picture!
                  </p>

                  {/* Current photo preview */}
                  {displayAvatarUrl && (
                    <div className="flex items-center gap-4 p-4 bg-[#F2EEE6] rounded-xl">
                      <img
                        src={`${BASE_URL}${displayAvatarUrl}`}
                        alt="Current photo"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-[#1F2430] mb-1">Current photo</p>
                        <button
                          onClick={() => setShowRemovePhotoConfirm(true)}
                          className="text-xs text-[#DC2626] hover:underline"
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-[#4F46E5]/40 rounded-xl text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span className="text-sm">
                          {displayAvatarUrl ? "Upload a new photo" : "Choose a photo"}
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[#8A91A3] text-center">
                    JPG, PNG, GIF or WEBP — max 5MB
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Account info */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#1F243014] mb-4"
          >
            <h3 className="text-xs uppercase tracking-wider text-[#8A91A3] mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#1F243014]">
                <span className="text-sm text-[#4B5266]">Email</span>
                <span className="text-sm text-[#1F2430]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1F243014]">
                <span className="text-sm text-[#4B5266]">Role</span>
                <span className="text-sm text-[#1F2430] capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#4B5266]">Grade</span>
                <span className="text-sm text-[#1F2430]">Grade {displayGrade}</span>
              </div>
            </div>
          </motion.div>

          {/* Progress stats */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 border border-[#1F243014] mb-4"
          >
            <h3 className="text-xs uppercase tracking-wider text-[#8A91A3] mb-4">My Progress</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#FFF7ED] rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
                <p className="text-2xl text-[#1F2430]">{totalCompleted}</p>
                <p className="text-xs text-[#8A91A3] mt-1">Levels Done</p>
              </div>
              <div className="bg-[#EEF2FF] rounded-xl p-4 text-center">
                <Star className="w-6 h-6 text-[#4F46E5] mx-auto mb-2" />
                <p className="text-2xl text-[#1F2430]">{overallPct}%</p>
                <p className="text-xs text-[#8A91A3] mt-1">Overall</p>
              </div>
              <div className="bg-[#D1FAE5] rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                <p className="text-2xl text-[#1F2430]">{totalLevels}</p>
                <p className="text-xs text-[#8A91A3] mt-1">Total Levels</p>
              </div>
            </div>
            {progress && progress.stages.length > 0 ? (
              <div className="space-y-3">
                {progress.stages.map((stage) => (
                  <div key={stage.stage_id}>
                    <div className="flex justify-between text-xs text-[#4B5266] mb-1">
                      <span>Stage {stage.stage_id}</span>
                      <span>{stage.completed_levels} / {stage.total_levels} levels</span>
                    </div>
                    <div className="h-2 bg-[#F2EEE6] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.completion_percentage}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-[#4F46E5] rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8A91A3] text-center py-2">
                No progress yet — go complete some levels! 🚀
              </p>
            )}
          </motion.div>

        </div>
      </div>

      {/* Name confirmation dialog */}
      <AlertDialog open={showNameConfirm} onOpenChange={setShowNameConfirm}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1F2430] text-xl">
              Change your name? ✏️
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#4B5266]">
              Your name will change from{" "}
              <span className="font-medium text-[#1F2430]">"{profile?.name}"</span>{" "}
              to{" "}
              <span className="font-medium text-[#4F46E5]">"{pendingName}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelName} className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]">
              Keep old name
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmName} className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white">
              Yes, change it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Emoji avatar confirmation dialog */}
      <AlertDialog open={showAvatarConfirm} onOpenChange={setShowAvatarConfirm}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1F2430] text-xl">
              Change your avatar? 🎨
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-[#4B5266]">
                <p className="mb-3">Switch your avatar to</p>
                <div className="flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#EEF2FF] rounded-full flex items-center justify-center text-3xl ring-2 ring-[#4F46E5]">
                    {pendingAvatar}
                  </div>
                </div>
                {displayAvatarUrl && (
                  <p className="text-xs text-[#8A91A3] mt-3 text-center">
                    This will also remove your current photo.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAvatar} className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]">
              Keep current
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAvatar} className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white">
              Yes, switch it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove photo confirmation dialog */}
      <AlertDialog open={showRemovePhotoConfirm} onOpenChange={setShowRemovePhotoConfirm}>
        <AlertDialogContent className="bg-white rounded-2xl border border-[#1F243014]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1F2430] text-xl">
              Remove your photo? 🖼️
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#4B5266]">
              Your photo will be removed and your animal avatar will show instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border border-[#1F243014] text-[#4B5266] hover:bg-[#FAF7F2]">
              Keep photo
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRemovePhoto} className="rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white">
              Yes, remove it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}