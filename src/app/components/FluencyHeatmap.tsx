import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, AlertTriangle, TrendingUp, Volume2, Star } from "lucide-react";

type Tier = "fluent" | "halting" | "syllabic" | "untested";

interface CellData {
  tier: Tier;
  attempts: number;
  lastGapMs: number;
  selfCorrected: boolean;
}

interface StudentRow {
  id: number;
  name: string;
  avatar: string;
  cells: CellData[];
  selfCorrections: number;
  isStar: boolean;
}

const STAGES = [
  { id: 1, label: "Valley of Vowels", words: ["A", "E", "I", "O", "U", "AA", "EE", "II", "OO", "UU"] },
  { id: 2, label: "Blending Bridges", words: ["MA", "BA", "TA", "SA", "PA", "NA", "LA", "DA", "KA", "GA", "HA", "FA"] },
  { id: 3, label: "CVC Kingdom", words: ["CAT", "MAN", "HAT", "PIG", "DOG", "SUN", "BED", "CUP", "BUS", "TOP"] },
];

function makeMockRow(name: string, avatar: string, seed: number, wordCount: number): StudentRow {
  const cells: CellData[] = Array.from({ length: wordCount }, (_, i) => {
    const r = (seed * 7 + i * 13) % 10;
    let tier: Tier = "fluent";
    if (r < 2) tier = "syllabic";
    else if (r < 5) tier = "halting";
    else if (r === 9 && i > wordCount - 3) tier = "untested";
    return {
      tier,
      attempts: ((seed + i) % 4) + 1,
      lastGapMs: tier === "fluent" ? 120 + r * 10 : tier === "halting" ? 250 + r * 20 : 450 + r * 30,
      selfCorrected: (seed * 3 + i) % 7 === 0,
    };
  });
  const selfCorrections = cells.filter((c) => c.selfCorrected).length;
  return {
    id: seed,
    name,
    avatar,
    cells,
    selfCorrections,
    isStar: selfCorrections >= 3,
  };
}

const STUDENT_SEEDS: Array<{ name: string; avatar: string; seed: number }> = [
  { name: "Juan Cruz", avatar: "🦊", seed: 1 },
  { name: "Maria Santos", avatar: "🐰", seed: 2 },
  { name: "Pedro Garcia", avatar: "🐻", seed: 3 },
  { name: "Ana Reyes", avatar: "🦁", seed: 4 },
  { name: "Liza Domingo", avatar: "🐯", seed: 5 },
  { name: "Mark Aquino", avatar: "🐼", seed: 6 },
  { name: "Jenny Lim", avatar: "🦄", seed: 7 },
  { name: "Carlo Mendoza", avatar: "🐧", seed: 8 },
];

const TIER_CLASS: Record<Tier, string> = {
  fluent: "bg-emerald-400 hover:bg-emerald-500 text-emerald-950",
  halting: "bg-amber-300 hover:bg-amber-400 text-amber-950",
  syllabic: "bg-rose-400 hover:bg-rose-500 text-rose-950",
  untested: "bg-gray-200 hover:bg-gray-300 text-gray-400",
};

const TIER_LABEL: Record<Tier, string> = {
  fluent: "Fluent",
  halting: "Halting",
  syllabic: "Syllabic",
  untested: "Not yet tried",
};

export function FluencyHeatmap() {
  const [activeStage, setActiveStage] = useState(2);
  const [hoveredCell, setHoveredCell] = useState<{ s: number; w: number } | null>(null);

  const stage = STAGES.find((s) => s.id === activeStage)!;
  const rows = STUDENT_SEEDS.map((s) => makeMockRow(s.name, s.avatar, s.seed, stage.words.length));

  // Class trouble spots
  const troubleSpots = stage.words
    .map((word, idx) => {
      const struggling = rows.filter(
        (r) => r.cells[idx].tier === "syllabic" || r.cells[idx].tier === "halting"
      ).length;
      return { word, struggling, pct: Math.round((struggling / rows.length) * 100) };
    })
    .filter((t) => t.pct >= 40)
    .sort((a, b) => b.pct - a.pct);

  const totalCells = rows.length * stage.words.length;
  const fluentCells = rows.reduce(
    (sum, r) => sum + r.cells.filter((c) => c.tier === "fluent").length,
    0
  );
  const fluentPct = Math.round((fluentCells / totalCells) * 100);
  const totalSelfCorr = rows.reduce((sum, r) => sum + r.selfCorrections, 0);
  const needsPullAside = rows.filter(
    (r) => r.cells.filter((c) => c.tier === "syllabic").length >= 3
  ).length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            Fluency Heatmap
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            How fast each student reads each word — green means fluent, red means still syllabic.
          </p>
        </div>

        {/* Stage tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeStage === s.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              Stage {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide">Class Fluent</p>
          </div>
          <p className="text-3xl font-bold text-emerald-700">{fluentPct}%</p>
          <p className="text-xs text-gray-600 mt-1">of word attempts this stage</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <p className="text-xs text-indigo-700 font-bold uppercase tracking-wide">Self-Corrections</p>
          </div>
          <p className="text-3xl font-bold text-indigo-700">{totalSelfCorr}</p>
          <p className="text-xs text-gray-600 mt-1">this week (class total)</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <p className="text-xs text-rose-700 font-bold uppercase tracking-wide">Pull-Aside</p>
          </div>
          <p className="text-3xl font-bold text-rose-700">{needsPullAside}</p>
          <p className="text-xs text-gray-600 mt-1">students ≥3 syllabic words</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wide">Trouble Words</p>
          </div>
          <p className="text-3xl font-bold text-amber-700">{troubleSpots.length}</p>
          <p className="text-xs text-gray-600 mt-1">where ≥40% struggle</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2">
              {stage.label}
            </div>

            {/* Column headers */}
            <div
              className="grid gap-1 mb-2"
              style={{
                gridTemplateColumns: `180px repeat(${stage.words.length}, minmax(44px, 1fr)) 60px`,
              }}
            >
              <div></div>
              {stage.words.map((w) => (
                <div
                  key={w}
                  className="text-center text-xs font-bold text-gray-600 py-1"
                >
                  {w}
                </div>
              ))}
              <div className="text-center text-xs font-bold text-indigo-600 py-1">★</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {rows.map((row, sIdx) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sIdx * 0.04 }}
                  className="grid gap-1 items-center"
                  style={{
                    gridTemplateColumns: `180px repeat(${stage.words.length}, minmax(44px, 1fr)) 60px`,
                  }}
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="text-2xl">{row.avatar}</span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {row.name}
                    </span>
                  </div>

                  {row.cells.map((cell, wIdx) => {
                    const isHover =
                      hoveredCell?.s === sIdx && hoveredCell?.w === wIdx;
                    return (
                      <div key={wIdx} className="relative">
                        <button
                          onMouseEnter={() => setHoveredCell({ s: sIdx, w: wIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-full h-11 rounded-md transition-all ${TIER_CLASS[cell.tier]} ${
                            cell.selfCorrected ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                          }`}
                          aria-label={`${row.name} on ${stage.words[wIdx]}: ${TIER_LABEL[cell.tier]}`}
                        >
                          {cell.selfCorrected && (
                            <Star className="w-3 h-3 text-indigo-700 fill-indigo-700 mx-auto" />
                          )}
                        </button>

                        {isHover && cell.tier !== "untested" && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 w-44 bg-gray-900 text-white rounded-xl p-3 shadow-2xl text-xs pointer-events-none"
                          >
                            <p className="font-bold mb-1">
                              {row.name} · {stage.words[wIdx]}
                            </p>
                            <p className="text-gray-300">
                              Tier: <span className="font-bold text-white">{TIER_LABEL[cell.tier]}</span>
                            </p>
                            <p className="text-gray-300">
                              Last gap: <span className="font-bold text-white">{cell.lastGapMs}ms</span>
                            </p>
                            <p className="text-gray-300">
                              Attempts: <span className="font-bold text-white">{cell.attempts}</span>
                            </p>
                            {cell.selfCorrected && (
                              <p className="text-indigo-300 mt-1 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-indigo-300" />
                                Self-corrected!
                              </p>
                            )}
                            <button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 rounded-md py-1 flex items-center justify-center gap-1 pointer-events-auto">
                              <Volume2 className="w-3 h-3" />
                              Play attempt
                            </button>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  <div className="text-center">
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                        row.isStar
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.selfCorrections}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase">Legend:</span>
              {(["fluent", "halting", "syllabic", "untested"] as Tier[]).map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded ${TIER_CLASS[t].split(" ")[0]}`} />
                  <span className="text-xs text-gray-700">{TIER_LABEL[t]}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white ring-2 ring-indigo-500 flex items-center justify-center">
                  <Star className="w-3 h-3 text-indigo-700 fill-indigo-700" />
                </span>
                <span className="text-xs text-gray-700">Self-corrected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail: trouble spots */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-rose-900">Class Trouble Spots</h3>
            </div>
            <p className="text-xs text-rose-700/80 mb-4">
              Words where 40% or more of the class is struggling. Consider a whole-class review.
            </p>

            {troubleSpots.length === 0 ? (
              <div className="bg-white/70 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">No major trouble spots — great work! 🌟</p>
              </div>
            ) : (
              <div className="space-y-2">
                {troubleSpots.slice(0, 6).map((t) => (
                  <div
                    key={t.word}
                    className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{t.word}</p>
                      <p className="text-xs text-gray-500">
                        {t.struggling} of {rows.length} students
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-rose-600">{t.pct}%</p>
                      <p className="text-[10px] text-gray-500 uppercase">struggling</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 text-sm font-bold transition-colors">
              Generate Practice Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
