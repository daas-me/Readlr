import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Volume2, BookOpen } from "lucide-react";
import { useAudioManager } from "../../hooks/useAudioManager";

interface PhonemeBankProps {
  onBack: () => void;
}

interface PhonemeEntry {
  id: number;
  category: string;
  phoneme: string;
  example: string;
  exampleWord: string;
  stage: string;
}

export function PhonemeBank({ onBack }: PhonemeBankProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("vowels");
  const { speakText } = useAudioManager();

  const phonemes: PhonemeEntry[] = [
    { id: 1, category: "vowels", phoneme: "A", example: "/a/", exampleWord: "apple", stage: "Valley of Vowels" },
    { id: 2, category: "vowels", phoneme: "E", example: "/e/", exampleWord: "egg", stage: "Valley of Vowels" },
    { id: 3, category: "vowels", phoneme: "I", example: "/i/", exampleWord: "igloo", stage: "Valley of Vowels" },
    { id: 4, category: "vowels", phoneme: "O", example: "/o/", exampleWord: "octopus", stage: "Valley of Vowels" },
    { id: 5, category: "vowels", phoneme: "U", example: "/u/", exampleWord: "umbrella", stage: "Valley of Vowels" },
    { id: 6, category: "blends", phoneme: "MA", example: "/ma/", exampleWord: "mama", stage: "Blending Bridges" },
    { id: 7, category: "blends", phoneme: "BA", example: "/ba/", exampleWord: "baby", stage: "Blending Bridges" },
    { id: 8, category: "blends", phoneme: "TA", example: "/ta/", exampleWord: "taba", stage: "Blending Bridges" },
    { id: 9, category: "blends", phoneme: "SA", example: "/sa/", exampleWord: "saba", stage: "Blending Bridges" },
    { id: 10, category: "blends", phoneme: "LA", example: "/la/", exampleWord: "lata", stage: "Blending Bridges" },
    { id: 11, category: "cvc", phoneme: "CAT", example: "/kæt/", exampleWord: "cat", stage: "CVC Kingdom" },
    { id: 12, category: "cvc", phoneme: "DOG", example: "/dɒg/", exampleWord: "dog", stage: "CVC Kingdom" },
    { id: 13, category: "cvc", phoneme: "BAT", example: "/bæt/", exampleWord: "bat", stage: "CVC Kingdom" },
    { id: 14, category: "cvc", phoneme: "HAT", example: "/hæt/", exampleWord: "hat", stage: "CVC Kingdom" },
    { id: 15, category: "cvc", phoneme: "SUN", example: "/sʌn/", exampleWord: "sun", stage: "CVC Kingdom" },
  ];

  const categories = [
    { id: "vowels", name: "Vowels", tint: "#FFF7ED", color: "#F59E0B" },
    { id: "blends", name: "Blends", tint: "#EEF2FF", color: "#4F46E5" },
    { id: "cvc", name: "CVC Words", tint: "#D1FAE5", color: "#10B981" },
  ];

  const active = categories.find((c) => c.id === selectedCategory)!;
  const filtered = phonemes.filter((p) => p.category === selectedCategory);

  const handlePlaySound = (text: string) => {
    speakText(text, 0.6);
  };

  return (
    <div className="size-full bg-[#FAF7F2] overflow-auto">
      <div className="min-h-full px-6 md:px-10 py-8">
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
              <BookOpen className="w-3.5 h-3.5" />
              Phoneme Bank
            </span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">Reference</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              <h1 className="text-4xl md:text-5xl text-[#1F2430] tracking-tight">Sound Library</h1>
              <p className="text-[#4B5266]">Practice any sound or word, any time.</p>
            </div>
          </motion.div>

          {/* Segmented tabs */}
          <div className="mb-8 inline-flex p-1 bg-white border border-[#1F243014] rounded-xl">
            {categories.map((c) => {
              const isActive = c.id === selectedCategory;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "text-[#1F2430]"
                      : "text-[#8A91A3] hover:text-[#4B5266]"
                  }`}
                  style={isActive ? { background: c.tint } : undefined}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                    style={{ background: isActive ? c.color : "#D1D5DB" }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Phoneme grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-6 border border-[#1F243014] hover:border-[#1F243029] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs uppercase tracking-wider text-[#8A91A3]">{p.stage}</p>
                  <span className="text-xs text-[#8A91A3] font-mono">{p.example}</span>
                </div>

                <div
                  className="rounded-xl p-8 mb-5 flex items-center justify-center"
                  style={{ background: active.tint }}
                >
                  <span
                    className="text-5xl tracking-tight"
                    style={{ color: active.color }}
                  >
                    {p.phoneme}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#8A91A3]">Example</p>
                    <p className="text-[#1F2430]">{p.exampleWord}</p>
                  </div>
                  <button
                    onClick={() => handlePlaySound(p.phoneme)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#1F243014] text-[#1F2430] hover:border-[#4F46E5] hover:text-[#4F46E5] text-sm transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Play
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Help block */}
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-2xl p-6 border border-[#1F243014]"
          >
            <p className="text-xs uppercase tracking-wider text-[#8A91A3] mb-2">How to use</p>
            <h3 className="text-lg text-[#1F2430] mb-3">A quick reference, not a quiz</h3>
            <ul className="space-y-1.5 text-[#4B5266] text-sm">
              <li>· Tap <span className="text-[#1F2430]">Play</span> to hear how a sound is pronounced.</li>
              <li>· Practice along with the audio at your own pace.</li>
              <li>· Use the example word to hear the sound in context.</li>
              <li>· Come back any time you'd like to review.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
