import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BookOpen, Volume2 } from "lucide-react";
import { CharacterCompanion } from "./CharacterCompanion";

interface StoryScene {
  chapter: string;
  title: string;
  scene: string;
  narration: string;
  goal: string;
  accent: string;
  tint: string;
  illustration: string;
}

interface StorySceneProps {
  stageId: number;
  onBack: () => void;
  onBegin: () => void;
}

const SCENES: Record<number, StoryScene> = {
  1: {
    chapter: "Chapter 1",
    title: "Valley of Vowels",
    scene: "A quiet morning in the valley. Five magic doors hum with a different sound each.",
    narration: "Hi, I'm Sinta! Today we'll open the five magic doors. Each one only opens when you say its sound. Ready?",
    goal: "Say each vowel sound out loud to open its door.",
    accent: "#F59E0B",
    tint: "#FFF7ED",
    illustration: "🌄",
  },
  2: {
    chapter: "Chapter 2",
    title: "Blending Bridges",
    scene: "Two ropes swing between cliffs. A consonant on one side, a vowel on the other.",
    narration: "Now we'll join two sounds together to make a bridge. Listen carefully, then say it with me!",
    goal: "Blend a consonant with a vowel to cross each bridge.",
    accent: "#4F46E5",
    tint: "#EEF2FF",
    illustration: "🌉",
  },
  3: {
    chapter: "Chapter 3",
    title: "CVC Kingdom",
    scene: "A bright village where every door has a three-letter name. The townspeople love to read.",
    narration: "These are your first whole words! Take your time and sound them out — I'll be right beside you.",
    goal: "Read each three-letter word to greet a friend.",
    accent: "#10B981",
    tint: "#D1FAE5",
    illustration: "🏰",
  },
};

export function StoryScene({ stageId, onBack, onBegin }: StorySceneProps) {
  const scene = SCENES[stageId] ?? SCENES[1];

  const handleListen = () => {
    const u = new SpeechSynthesisUtterance(scene.narration);
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto relative">
      {/* Soft scenery accents — single warm wash per stage */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60"
        style={{ background: scene.tint }}
      />
      <div className="absolute -bottom-28 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#EEF2FF] opacity-50" />

      <div className="relative z-10 min-h-full px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Stages
            </button>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8A91A3]">
              <BookOpen className="w-3.5 h-3.5" />
              Story scene
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: scene.accent }}
            >
              {scene.chapter}
            </p>
            <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">
              {scene.title}
            </h1>
          </motion.div>

          {/* Scene panel */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-[#1F243014] overflow-hidden shadow-[0_2px_4px_rgba(31,36,48,0.05),0_18px_40px_-18px_rgba(31,36,48,0.18)]"
          >
            {/* Top color band */}
            <div className="h-1" style={{ background: scene.accent }} />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px]">
              {/* Left — narrative */}
              <div className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">
                  Scene
                </p>
                <p className="text-lg text-[#1F2430] leading-relaxed mb-8">
                  {scene.scene}
                </p>

                {/* Sinta speech */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#1F243014] mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: scene.accent }}
                    />
                    <span className="text-xs uppercase tracking-wider text-[#8A91A3]">
                      Sinta says
                    </span>
                  </div>
                  <p className="text-[#1F2430] leading-relaxed">
                    "{scene.narration}"
                  </p>
                  <button
                    onClick={handleListen}
                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Listen again
                  </button>
                </div>

                {/* Goal */}
                <div className="flex items-start gap-3 mb-8">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: scene.tint }}
                  >
                    <span style={{ color: scene.accent }}>🎯</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-0.5">
                      Your goal
                    </p>
                    <p className="text-[#1F2430]">{scene.goal}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBegin}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white text-lg transition-colors"
                  style={{
                    background: scene.accent,
                    boxShadow: `0 8px 24px -12px ${scene.accent}99`,
                  }}
                >
                  Begin chapter
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Right — Sinta + illustration card */}
              <div
                className="relative flex flex-col items-center justify-center p-8 md:p-10 border-t md:border-t-0 md:border-l border-[#1F243014]"
                style={{ background: scene.tint }}
              >
                <div className="absolute top-4 right-4 text-5xl opacity-60">
                  {scene.illustration}
                </div>
                <CharacterCompanion state="speaking" phoneme="A" size={220} />
                <p
                  className="mt-4 text-xs uppercase tracking-wider"
                  style={{ color: scene.accent }}
                >
                  Your reading buddy
                </p>
                <p className="text-[#1F2430] text-lg">Sinta</p>
              </div>
            </div>
          </motion.div>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-xs text-[#8A91A3]"
          >
            Tip — find a quiet spot so Sinta can hear you clearly.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
