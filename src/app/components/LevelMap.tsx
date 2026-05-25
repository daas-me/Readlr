import { motion } from "motion/react";
import { ArrowLeft, Check, Lock, Play, Map as MapIcon, ArrowRight } from "lucide-react";

interface LevelNode {
  id: number;
  label: string;
  hint: string;
}

interface StageDef {
  chapter: string;
  title: string;
  accent: string;
  tint: string;
  nodes: LevelNode[];
}

interface LevelMapProps {
  stageId: number;
  completedCount?: number;
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
}

const STAGES: Record<number, StageDef> = {
  1: {
    chapter: "Chapter 1",
    title: "Valley of Vowels",
    accent: "#F59E0B",
    tint: "#FFF7ED",
    nodes: [
      { id: 1, label: "A", hint: "Ahhh — like apple" },
      { id: 2, label: "E", hint: "Ehhh — like egg" },
      { id: 3, label: "I", hint: "Iii — like igloo" },
      { id: 4, label: "O", hint: "Ohhh — like octopus" },
      { id: 5, label: "U", hint: "Uhhh — like umbrella" },
    ],
  },
  2: {
    chapter: "Chapter 2",
    title: "Blending Bridges",
    accent: "#4F46E5",
    tint: "#EEF2FF",
    nodes: [
      { id: 1, label: "MA", hint: "M + A" },
      { id: 2, label: "BA", hint: "B + A" },
      { id: 3, label: "TA", hint: "T + A" },
      { id: 4, label: "SA", hint: "S + A" },
      { id: 5, label: "LA", hint: "L + A" },
      { id: 6, label: "PA", hint: "P + A" },
      { id: 7, label: "NA", hint: "N + A" },
      { id: 8, label: "DA", hint: "D + A" },
    ],
  },
  3: {
    chapter: "Chapter 3",
    title: "CVC Kingdom",
    accent: "#10B981",
    tint: "#D1FAE5",
    nodes: [
      { id: 1, label: "CAT", hint: "C-A-T" },
      { id: 2, label: "MAN", hint: "M-A-N" },
      { id: 3, label: "HAT", hint: "H-A-T" },
      { id: 4, label: "PIG", hint: "P-I-G" },
      { id: 5, label: "DOG", hint: "D-O-G" },
      { id: 6, label: "SUN", hint: "S-U-N" },
      { id: 7, label: "BED", hint: "B-E-D" },
      { id: 8, label: "CUP", hint: "C-U-P" },
      { id: 9, label: "BUS", hint: "B-U-S" },
      { id: 10, label: "TOP", hint: "T-O-P" },
    ],
  },
};

type NodeStatus = "done" | "next" | "locked";

export function LevelMap({
  stageId,
  completedCount = 0,
  onBack,
  onSelectLevel,
}: LevelMapProps) {
  const stage = STAGES[stageId] ?? STAGES[1];
  const total = stage.nodes.length;
  const completed = Math.min(completedCount, total);
  const pct = Math.round((completed / total) * 100);

  const statusOf = (index: number): NodeStatus => {
    if (index < completed) return "done";
    if (index === completed) return "next";
    return "locked";
  };

  const handleClick = (index: number, node: LevelNode) => {
    const status = statusOf(index);
    if (status === "locked") return;
    onSelectLevel(node.id);
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto relative">
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-60"
        style={{ background: stage.tint }}
      />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#EEF2FF] opacity-50" />

      <div className="relative z-10 min-h-full px-6 md:px-10 py-8">
        <div className="max-w-5xl mx-auto">
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
              <MapIcon className="w-3.5 h-3.5" />
              Level Map
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: stage.accent }}>
              {stage.chapter}
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">
                {stage.title}
              </h1>
              <p className="text-[#4B5266]">
                <span style={{ color: stage.accent }}>{completed}</span>
                <span className="text-[#8A91A3]"> / {total} levels · Marungko sequence</span>
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="bg-white rounded-2xl p-5 border border-[#1F243014] mb-8">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#8A91A3]">
                Chapter progress
              </span>
              <span className="text-sm text-[#1F2430]">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F2EEE6] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-1.5 rounded-full"
                style={{ background: stage.accent }}
              />
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#1F243014]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-8">
              {stage.nodes.map((node, i) => {
                const status = statusOf(i);
                const isLast = i === stage.nodes.length - 1;
                return (
                  <div key={node.id} className="relative flex flex-col items-center">
                    {/* Connector to next node (within same row visually) */}
                    {!isLast && (
                      <span
                        aria-hidden
                        className="hidden md:block absolute top-9 left-1/2 w-full h-px"
                        style={{
                          background:
                            i < completed
                              ? stage.accent
                              : "repeating-linear-gradient(to right, #D1D5DB 0 4px, transparent 4px 8px)",
                          opacity: i < completed ? 1 : 0.7,
                        }}
                      />
                    )}

                    <motion.button
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05, ease: "easeOut" }}
                      whileHover={status !== "locked" ? { y: -3 } : {}}
                      whileTap={status !== "locked" ? { scale: 0.97 } : {}}
                      onClick={() => handleClick(i, node)}
                      disabled={status === "locked"}
                      aria-label={`Level ${i + 1}: ${node.label}${
                        status === "locked"
                          ? " (locked — finish earlier levels first)"
                          : status === "next"
                          ? " (next up)"
                          : " (completed)"
                      }`}
                      className={`relative z-10 w-18 h-18 rounded-2xl flex items-center justify-center text-xl transition-all border-2 ${
                        status === "done"
                          ? "bg-white text-[#1F2430] cursor-pointer"
                          : status === "next"
                          ? "bg-white text-[#1F2430] cursor-pointer shadow-[0_8px_24px_-12px_rgba(31,36,48,0.25)]"
                          : "bg-[#F2EEE6] text-[#8A91A3] cursor-not-allowed"
                      }`}
                      style={{
                        width: 72,
                        height: 72,
                        borderColor:
                          status === "done"
                            ? stage.accent
                            : status === "next"
                            ? stage.accent
                            : "#1F243014",
                        background:
                          status === "done"
                            ? stage.tint
                            : status === "next"
                            ? "#ffffff"
                            : "#F2EEE6",
                      }}
                    >
                      {status === "done" ? (
                        <span style={{ color: stage.accent }}>{node.label}</span>
                      ) : status === "next" ? (
                        <span style={{ color: stage.accent }}>{node.label}</span>
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}

                      {/* Status badge */}
                      {status === "done" && (
                        <span
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ background: stage.accent }}
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                      )}
                      {status === "next" && (
                        <motion.span
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ background: stage.accent }}
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                        </motion.span>
                      )}
                    </motion.button>

                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm ${
                          status === "locked" ? "text-[#8A91A3]" : "text-[#1F2430]"
                        }`}
                      >
                        Level {i + 1}
                      </p>
                      <p className="text-xs text-[#8A91A3] mt-0.5">{node.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Locked warning — visible if any next/locked nodes exist */}
            {completed < total && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#1F243014]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F2EEE6] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-[#8A91A3]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1F2430] text-sm">
                    Levels unlock one at a time — Marungko sequence.
                  </p>
                  <p className="text-xs text-[#8A91A3] mt-0.5">
                    Finish the highlighted level to open the next one.
                  </p>
                </div>
                {completed < total && (
                  <button
                    onClick={() => handleClick(completed, stage.nodes[completed])}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm transition-colors flex-shrink-0"
                    style={{
                      background: stage.accent,
                      boxShadow: `0 8px 24px -12px ${stage.accent}99`,
                    }}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
