import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Volume2 } from "lucide-react";
import { CharacterCompanion } from "./CharacterCompanion";

interface ChapterBridgeProps {
  stageName: string;
  currentLevel: number;
  vowel: string;
  vowelName: string;
  stageId: number;
  onBeginChapter: () => void;
}

const VOWEL_STORIES: Record<string, { message: string; doorCount: string }> = {
  "A": { message: "Excellent! The first door opens and reveals the letter A. Its sound is like 'ahhh...' Can you hear it?", doorCount: "1 door open" },
  "E": { message: "Great job! The second door glows and shows the letter E. It sounds like 'ehhhh...' Let's try together!", doorCount: "2 doors open" },
  "I": { message: "Wonderful! The third door appears with the letter I. It makes an 'iii...' sound. Ready to open it?", doorCount: "3 doors open" },
  "O": { message: "Amazing! The fourth door shines bright with the letter O. It sounds like 'ohhh...' Can you say it?", doorCount: "4 doors open" },
  "U": { message: "Fantastic! The final door reveals the letter U. It makes an 'uuuuh...' sound. Let's complete our journey!", doorCount: "5 doors open" },
};

export function ChapterBridge({ stageName, currentLevel, vowel, vowelName, stageId, onBeginChapter }: ChapterBridgeProps) {
  const story = VOWEL_STORIES[vowel] || VOWEL_STORIES["A"];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const storyAudioPathRef = useRef<string>("");

  // Auto-play the story audio when the component mounts
  useEffect(() => {
    const fileLevel = currentLevel > 1 ? currentLevel - 1 : currentLevel;
    storyAudioPathRef.current = `/audio/stage${stageId}/MiloCompletedLevel${fileLevel}.wav`;
    
    const audio = new Audio(storyAudioPathRef.current);
    audioRef.current = audio;

    audio.play().catch(e => console.log("Autoplay blocked by browser:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [stageId, currentLevel]);

  // Function to repeat the story audio
  const handleRepeatStory = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Repeat failed:", err));
    } else {
      const audio = new Audio(storyAudioPathRef.current);
      audioRef.current = audio;
      audio.play().catch(err => console.error("Repeat failed:", err));
    }
  };

  const handleListen = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audioPath = `/audio/stage${stageId}/${vowel.toUpperCase()}.wav`;
    const audio = new Audio(audioPath);
    audioRef.current = audio;
    audio.play().catch(err => console.error("Audio error:", err));
  };

  return (
    <div className="size-full bg-gradient-to-b from-[#FFF7ED] to-[#FAF7F2] overflow-hidden relative flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 py-6">
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full justify-between">
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-[#8A91A3]">
              <span className="text-[#F59E0B]">{story.doorCount}</span> - {stageName}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Level {currentLevel}</span>
          </motion.div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
              <CharacterCompanion state="encouraging" phoneme={vowel} size={220} />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 border-[#F59E0B]/30 max-w-md w-full relative">
                
                {/* Repeat Button placed inside the message box */}
                <button 
                  onClick={handleRepeatStory}
                  className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors bg-[#F59E0B]/10 px-2 py-1 rounded-full"
                >
                  <Volume2 className="w-3 h-3" /> Repeat
                </button>

                <p className="text-center text-base md:text-lg text-[#1F2430] leading-relaxed mb-6 mt-4">{story.message}</p>
                
                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] rounded-2xl p-6 mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#8A91A3] text-center mb-3 font-medium">The {vowelName} Sound</p>
                  <div className="text-center flex items-center justify-center gap-4">
                    <div className="text-7xl font-bold text-[#F59E0B]">{vowel}</div>
                    <button onClick={handleListen} className="p-4 rounded-full bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 transition-colors">
                      <Volume2 className="w-6 h-6 text-[#F59E0B]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-6">
            <motion.button whileHover={{ y: -2 }} onClick={onBeginChapter} className="flex-1 px-8 py-4 rounded-2xl bg-[#F59E0B] text-white font-bold text-lg hover:bg-[#D97706] flex items-center justify-center gap-3">
              Let's Go! <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}