import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import mermaid from "mermaid";

interface DiagramsProps {
  onBack: () => void;
}

interface DiagramDef {
  id: string;
  code: string;
  title: string;
  uc: string;
  summary: string;
  kind: "State diagram" | "Use case" | "Sequence" | "Flow";
}

const DIAGRAMS: DiagramDef[] = [
  {
    id: "uc05-sinta-state",
    uc: "UC-05",
    kind: "State diagram",
    title: "Companion character — Sinta",
    summary:
      "States and transitions for the Sinta companion: idle ambience, modeling pronunciation, listening to the learner, and the encouraging corrective loop.",
    code: `stateDiagram-v2
    [*] --> Idle : screen mounted

    Idle --> Thinking : 3s ambient timeout
    Thinking --> Idle : 1.5s timeout

    Idle --> Speaking : learner taps Listen / Hear it
    Speaking --> Idle : utterance ends (~1.5s)

    Idle --> Listening : learner taps Tap to speak
    Listening --> Celebrating : ASR success
    Listening --> Encouraging : ASR low-confidence or silent

    Celebrating --> Idle : advance to next challenge
    Celebrating --> [*] : last challenge → onComplete()

    Encouraging --> Speaking : auto-model mouth shape
    Encouraging --> Idle : learner taps Retry

    note right of Speaking
      Mouth shape driven by phoneme
      (A, E, I, O, U → MOUTH_SHAPES)
    end note

    note right of Listening
      Pulse rings, ears perk up,
      eyes scale 1.25
    end note

    note left of Celebrating
      Confetti + 8 radial sparkles
      No punitive feedback
    end note`,
  },
  {
    id: "uc01-story-flow",
    uc: "UC-01",
    kind: "Flow",
    title: "Story progression",
    summary:
      "Learner journey from stage selection through the chapter story scene into the per-stage level map and pronunciation game.",
    code: `flowchart LR
    A([Stage Selection]) --> B[Story Scene]
    B -->|Begin chapter| C[Level Map]
    C -->|Select unlocked level| D[Game Level]
    D -->|All challenges passed| E[Level Complete]
    E --> F[Session Summary]
    F --> A
    C -.->|Back| A
    B -.->|Back| A`,
  },
  {
    id: "uc02-level-nav",
    uc: "UC-02",
    kind: "State diagram",
    title: "Level node lifecycle",
    summary:
      "Each node in the level map sits in one of three statuses. Marungko sequencing means only the next node can unlock at a time.",
    code: `stateDiagram-v2
    [*] --> Locked
    Locked --> Next : previous level completed
    Next --> InProgress : learner selects node
    InProgress --> Next : ASR retry / re-enter
    InProgress --> Done : challenges passed
    Done --> [*]
    note right of Locked
      Lock icon, disabled
      Marungko sequence enforced
    end note
    note right of Next
      Pulsing play badge
      Highlighted as Continue
    end note`,
  },
  {
    id: "uc03-pronunciation",
    uc: "UC-03",
    kind: "Sequence",
    title: "Pronunciation challenge",
    summary:
      "Interaction between Learner, Sinta, and the ASR system for a single challenge — including the silent-input and retry branches.",
    code: `sequenceDiagram
    actor L as Learner
    participant S as Sinta
    participant G as GameLevel
    participant A as ASR system

    L->>G: Tap Listen
    G->>S: speak(phoneme)
    S-->>L: Audio model + mouth shape
    L->>G: Tap mic
    G->>A: capture audio
    alt success
      A-->>G: confidence ≥ τ
      G->>S: celebrate
      S-->>L: Confetti + praise
      G->>G: advance challenge
    else low confidence
      A-->>G: confidence < τ
      G->>S: encourage + model
      S-->>L: "Almost — watch my mouth"
      L->>G: Tap Retry
    else silent input
      A-->>G: no audio detected
      G-->>L: "I didn't hear you"
      L->>G: Tap Retry
    end`,
  },
  {
    id: "uc04-asr-feedback",
    uc: "UC-04",
    kind: "State diagram",
    title: "ASR feedback engine",
    summary:
      "Engine-side states after audio capture — evaluates confidence, branches to success / corrective / silent / API-failure paths.",
    code: `stateDiagram-v2
    [*] --> Capturing
    Capturing --> Evaluating : audio sent
    Capturing --> SilentDetected : no signal within window
    Evaluating --> Success : confidence ≥ τ
    Evaluating --> Corrective : confidence < τ
    Evaluating --> ApiFailure : network / 5xx
    Corrective --> Capturing : learner retries
    SilentDetected --> Capturing : learner retries
    ApiFailure --> Capturing : offline banner, allow retry
    Success --> [*]
    note right of Corrective
      Includes mouth-shape guide
      + audio model replay
    end note`,
  },
];

export function Diagrams({ onBack }: DiagramsProps) {
  const [activeId, setActiveId] = useState<string>(DIAGRAMS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = DIAGRAMS.find((d) => d.id === activeId) ?? DIAGRAMS[0];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        fontFamily: "inherit",
        primaryColor: "#EEF2FF",
        primaryTextColor: "#1F2430",
        primaryBorderColor: "#4F46E5",
        lineColor: "#8A91A3",
        secondaryColor: "#FFF7ED",
        tertiaryColor: "#D1FAE5",
        background: "#ffffff",
        mainBkg: "#FAF7F2",
        noteBkgColor: "#FFF7ED",
        noteTextColor: "#1F2430",
        noteBorderColor: "#F59E0B",
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      try {
        const { svg } = await mermaid.render(`mmd-${active.id}-${Date.now()}`, active.code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre style="color:#DC2626;white-space:pre-wrap;font-size:12px">${
            (err as Error).message
          }</pre>`;
        }
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [active]);

  const handleDownload = () => {
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;
    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.uc}-${active.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto relative">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EEF2FF] opacity-60" />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-[#FFF7ED] opacity-50" />

      <div className="relative z-10 min-h-full px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
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
              <FileText className="w-3.5 h-3.5" />
              Capstone diagrams
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider text-[#4F46E5] mb-2">
              Documentation
            </p>
            <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">
              System diagrams
            </h1>
            <p className="text-[#4B5266] mt-2 max-w-2xl">
              Screen-ready UML for the Readlr capstone report. Pick a diagram on
              the left, then take a screenshot or download the SVG.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="bg-white rounded-2xl border border-[#1F243014] p-3 h-fit">
              <p className="text-[10px] uppercase tracking-wider text-[#8A91A3] px-3 pt-2 pb-1">
                Diagrams
              </p>
              <ul className="space-y-1">
                {DIAGRAMS.map((d) => {
                  const isActive = d.id === activeId;
                  return (
                    <li key={d.id}>
                      <button
                        onClick={() => setActiveId(d.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                          isActive
                            ? "bg-[#EEF2FF] text-[#1F2430]"
                            : "text-[#4B5266] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-white text-[#4F46E5] border border-[#4F46E5]/20"
                                : "bg-[#F2EEE6] text-[#8A91A3]"
                            }`}
                          >
                            {d.uc}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A91A3]">
                            {d.kind}
                          </span>
                        </div>
                        <span className="text-sm">{d.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Canvas */}
            <main className="bg-white rounded-2xl border border-[#1F243014] overflow-hidden">
              <div className="flex items-start justify-between gap-4 p-6 border-b border-[#1F243014]">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#4F46E5]">
                      {active.uc}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A91A3]">
                      {active.kind}
                    </span>
                  </div>
                  <h2 className="text-xl text-[#1F2430]">{active.title}</h2>
                  <p className="text-sm text-[#4B5266] mt-1">{active.summary}</p>
                </div>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#1F243014] text-[#4B5266] hover:text-[#1F2430] hover:border-[#1F243029] transition-colors text-sm flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  SVG
                </button>
              </div>

              <div className="p-8 bg-[#FAF7F2] overflow-auto">
                <div
                  ref={containerRef}
                  className="mermaid-canvas flex items-center justify-center min-h-[420px]"
                />
              </div>

              <div className="p-4 border-t border-[#1F243014] bg-white">
                <p className="text-[10px] uppercase tracking-wider text-[#8A91A3] mb-2">
                  Mermaid source
                </p>
                <pre className="text-xs text-[#4B5266] bg-[#FAF7F2] rounded-xl p-4 overflow-auto border border-[#1F243014]">
                  {active.code}
                </pre>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
