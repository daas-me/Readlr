import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Pencil, Check, X, BookOpenCheck, TentTree, Headphones } from "lucide-react";
import { useAuth } from "../../modules/auth/auth.context";
import { useFrames } from "../hooks/useFrames";
import { AvatarFrame } from "./AvatarFrame";
import { completedBookOneStarterStops, emptyLearnerCurriculumState, type LearnerCurriculumState } from "../../hooks/learnerCurriculumState";
import { toast } from "sonner";
import { GrownUpConfirm } from "./GrownUpConfirm";

interface ProfilePageProps {
  onBack: () => void;
  onAvatarUpdate: (avatar: string) => void;
  onNameUpdate: (name: string) => void;
  curriculumState?: LearnerCurriculumState;
  completedBooks?: string[];
}

interface LearnerProfile {
  id: number;
  name: string;
  avatar: string;
  grade: number;
}

export function ProfilePage({ onBack, onAvatarUpdate, onNameUpdate, curriculumState=emptyLearnerCurriculumState(), completedBooks=[] }: ProfilePageProps) {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const { equippedAssetKey,frames,avatars,equipFrame,isLoadingFrames,refetchFrames } = useFrames();
  const [equipping,setEquipping]=useState(false);

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPickingAvatar, setIsPickingAvatar] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation dialog state
  const [pendingName, setPendingName] = useState("");
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [showNameConfirm, setShowNameConfirm] = useState(false);
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (!token) return;
      try {
        const profileRes = await fetch(`${API_URL}/learner/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.learner);
          setEditedName(data.learner.name);
        } else {
          toast.error("Could not load your profile. Try refreshing!");
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        toast.error("Something went wrong loading your profile!");
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
        setProfile(data.learner);
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

  // Name flow: pencil → edit → checkmark → confirm dialog → save
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

  // Avatar flow: pencil → picker → click emoji → confirm dialog → save
  const handlePickAvatar = (emoji: string) => {
    if (emoji === profile?.avatar) {
      setIsPickingAvatar(false);
      return;
    }
    setPendingAvatar(emoji);
    setIsPickingAvatar(false);
    setShowAvatarConfirm(true);
  };

  const handleConfirmAvatar = () => {
    saveChanges({ avatar: pendingAvatar });
    setShowAvatarConfirm(false);
  };

  const handleCancelAvatar = () => {
    setPendingAvatar("");
    setShowAvatarConfirm(false);
  };

  const starterStops=completedBookOneStarterStops(curriculumState);
  const journeyRows=[
    {label:'Learning Camp welcome',value:Math.min(3,curriculumState.campOrientationStep),total:3},
    {label:'First Book 1 treasures',value:starterStops,total:3},
    {label:'Reading chronicles',value:Math.min(10,completedBooks.length),total:10},
  ];

  if (isLoading) {
    return (
      <div className="size-full bg-[var(--paper)] flex items-center justify-center">
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
  const displayGrade = profile?.grade || 1;

  return (
    <div className="size-full bg-[var(--paper)] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Back button */}
          <motion.button
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-8 transition-colors bg-card border border-[var(--hairline)] rounded-full px-4 py-2 hover:bg-[var(--paper-deep)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </motion.button>

          <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-2">My Account</p>

          <motion.h1
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl text-[var(--ink)] tracking-tight mb-8"
          >
            My Profile
          </motion.h1>

          {/* Avatar + Name card */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-2xl p-6 border border-[var(--hairline)] mb-4"
          >
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <AvatarFrame assetKey={equippedAssetKey} size={80}>
                  <span className="text-4xl">{displayAvatar}</span>
                </AvatarFrame>
                <button
                  onClick={() => setIsPickingAvatar(true)}
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
                      className="text-2xl text-[var(--ink)] bg-[var(--paper)] border border-[#4F46E5] rounded-lg px-3 py-1 outline-none w-full"
                      maxLength={20}
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
                      className="w-8 h-8 bg-card border border-[var(--hairline)] rounded-lg flex items-center justify-center hover:bg-[var(--paper)] transition-colors"
                    >
                      <X className="w-4 h-4 text-[var(--ink-soft)]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl text-[var(--ink)]">{displayName}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="w-7 h-7 bg-[var(--paper)] rounded-lg flex items-center justify-center hover:bg-[var(--paper-deep)] transition-colors"
                    >
                      <Pencil className="w-3 h-3 text-[var(--ink-muted)]" />
                    </button>
                  </div>
                )}
                <p className="text-xs uppercase tracking-wider text-[var(--ink-muted)] mt-1">
                  Grade {displayGrade} Learner
                </p>
              </div>
            </div>
          </motion.div>

          {/* Avatar picker */}
          {isPickingAvatar && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-6 border border-[#4F46E5]/30 mb-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--ink)]">Avatars & borders</h3>
                <button
                  onClick={() => setIsPickingAvatar(false)}
                  className="w-7 h-7 bg-[var(--paper)] rounded-lg flex items-center justify-center hover:bg-[var(--paper-deep)] transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--ink-soft)]" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {avatars.map(({avatar:emoji,name,hint,unlocked}) => (
                  <button
                    key={emoji}
                    disabled={!unlocked||isSaving}
                    title={unlocked?name:hint}
                    aria-pressed={displayAvatar===emoji}
                    onClick={() => handlePickAvatar(emoji)}
                    className={`min-h-28 rounded-lg text-2xl flex flex-col gap-1 p-3 items-center justify-center border border-purple-200 disabled:opacity-60 ${
                      displayAvatar === emoji
                        ? "bg-[var(--accent-soft)] ring-2 ring-[#4F46E5]"
                        : "bg-[var(--paper)] hover:bg-[var(--paper-deep)]"
                    }`}
                  >
                    {emoji}
                    <span className="text-sm">{name}</span>{!unlocked&&<small className="text-xs">{hint}</small>}
                  </button>
                ))}
              </div>
              {!avatars.length&&<p role="status">{isLoadingFrames?'Loading your avatars...':'Your avatars could not load.'} {!isLoadingFrames&&<button onClick={()=>void refetchFrames(true)}>Try again</button>}</p>}

          <section className="mt-6 border-t border-purple-200 pt-5" aria-label="Avatar borders">
            <h2 className="text-xl mb-4">Borders</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {frames.map(frame=><button key={frame.id} disabled={!frame.unlocked||equipping} aria-pressed={frame.equipped} className={`flex flex-col items-center gap-3 p-3 rounded-lg border-2 ${frame.equipped?'border-purple-600 bg-purple-50':'border-purple-100'} disabled:opacity-60`} onClick={async()=>{setEquipping(true);const saved=await equipFrame(frame.id);setEquipping(false);if(!saved)toast.error('Your border could not be saved. Please try again.');}}>
                <AvatarFrame assetKey={frame.asset_key} size={70}><span className="text-3xl">{displayAvatar}</span></AvatarFrame><strong className="text-sm">{frame.name}</strong>{!frame.unlocked&&<small>{frame.design_notes}</small>}
              </button>)}
            </div>
            {!frames.length&&<p role="status">{isLoadingFrames?'Loading your borders...':'Your borders could not load.'} {!isLoadingFrames&&<button onClick={()=>void refetchFrames(true)}>Retry</button>}</p>}
          </section>
            </motion.div>
          )}
          {/* Account info */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 border border-[var(--hairline)] mb-4"
          >
            <h3 className="text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-4">Account Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[var(--hairline)]">
                <span className="text-sm text-[var(--ink-soft)]">Email</span>
                <span className="text-sm text-[var(--ink)]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[var(--hairline)]">
                <span className="text-sm text-[var(--ink-soft)]">Role</span>
                <span className="text-sm text-[var(--ink)] capitalize">{user?.role}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[var(--ink-soft)]">Grade</span>
                <span className="text-sm text-[var(--ink)]">Grade {displayGrade}</span>
              </div>
            </div>
          </motion.div>

          {/* Progress stats */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-6 border border-[var(--hairline)] mb-4"
          >
            <h3 className="text-xs uppercase tracking-wider text-[var(--ink-muted)] mb-4">My Progress</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[var(--tint-amber)] rounded-xl p-4 text-center">
                <BookOpenCheck className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
                <p className="text-2xl text-[var(--ink)]">{completedBooks.length}<span className="text-sm"> / 10</span></p>
                <p className="text-xs text-[var(--ink-muted)] mt-1">Books Read</p>
              </div>
              <div className="bg-[var(--accent-soft)] rounded-xl p-4 text-center">
                <TentTree className="w-6 h-6 text-[#4F46E5] mx-auto mb-2" />
                <p className="text-2xl text-[var(--ink)]">{starterStops}<span className="text-sm"> / 3</span></p>
                <p className="text-xs text-[var(--ink-muted)] mt-1">First Treasures</p>
              </div>
              <div className="bg-[var(--tint-mint)] rounded-xl p-4 text-center">
                <Headphones className="w-6 h-6 text-[#10B981] mx-auto mb-2" />
                <p className="text-2xl text-[var(--ink)]">{curriculumState.soundRecordings.length}</p>
                <p className="text-xs text-[var(--ink-muted)] mt-1">Sound Visits</p>
              </div>
            </div>
            <div className="space-y-3">
                {journeyRows.map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs text-[var(--ink-soft)] mb-1">
                      <span>{row.label}</span>
                      <span>{row.value} / {row.total}</span>
                    </div>
                    <div className="h-2 bg-[var(--paper-deep)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(row.value/row.total*100)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-[#4F46E5] rounded-full"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Nickname confirmation pop-up */}
      <GrownUpConfirm open={showNameConfirm} question="Save these changes?" busy={isSaving}
        onConfirm={handleConfirmName} onCancel={handleCancelName}>
        <p>"{profile?.name}" → <strong>"{pendingName}"</strong></p>
      </GrownUpConfirm>

      {/* Avatar confirmation pop-up */}
      <GrownUpConfirm open={showAvatarConfirm} question="Save these changes?" busy={isSaving}
        onConfirm={handleConfirmAvatar} onCancel={handleCancelAvatar}>
        <div className="flex items-center justify-center gap-4 mb-2" aria-label={`Change avatar from ${displayAvatar} to ${pendingAvatar}`}>
          <span className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-[#e9ddff]">{displayAvatar}</span>
          <span aria-hidden="true">→</span>
          <span className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-[#e9ddff] ring-2 ring-[#7c3aed]">{pendingAvatar}</span>
        </div>
      </GrownUpConfirm>

    </div>
  );
}
