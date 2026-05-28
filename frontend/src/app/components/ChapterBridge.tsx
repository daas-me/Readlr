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
  blendingPair?: { consonant: string; vowel: string };
  isCompletionView?: boolean;
}

const STAGE_THEMES = {
  1: { from: "from-[#FFF7ED]", to: "to-[#FAF7F2]", border: "border-[#F59E0B]/30", text: "text-[#F59E0B]", bg: "bg-[#F59E0B]" },
  2: { from: "from-[#EEF2FF]", to: "to-[#E0E7FF]", border: "border-[#4F46E5]/30", text: "text-[#4F46E5]", bg: "bg-[#4F46E5]" }
};

const VOWEL_STORIES: Record<number, { message: string; doorCount: string }> = {
  1: { message: "Great job! The second door glows and shows the letter E. It sounds like 'ehhhh...' Let's try together!", doorCount: "2 doors open" },
  2: { message: "Wonderful! The third door appears with the letter I. It makes an 'iii...' sound. Ready to open it?", doorCount: "3 doors open" },
  3: { message: "Amazing! The fourth door shines bright with the letter O. It sounds like 'ohhh...' Can you say it?", doorCount: "4 doors open" },
  4: { message: "Fantastic! The final door reveals the letter U. It makes an 'uuuuh...' sound. Let's complete our journey!", doorCount: "5 doors open" },
};

const BLENDING_STORIES: Record<number, { message: string; doorCount: string }> = {
  1: { message: "Excellent! The 'M' block joins with 'A' to create 'MA'. It's the start of 'Mama'. Ready to find the 'B' block next?", doorCount: "Bridge Piece 1" },
  2: { message: "Great job! 'B' and 'A' come together to make 'BA'. That's how we say 'Baba'. Now, let's look for the 'T' block!", doorCount: "Bridge Piece 2" },
  3: { message: "Wonderful! 'T' and 'A' blend perfectly to make 'TA'. Step by step, our bridge is getting stronger. Can we find the 'S' block?", doorCount: "Bridge Piece 3" },
  4: { message: "Amazing! 'S' and 'A' join hands to make 'SA'. The bridge is growing right before our eyes. Let's hunt for the 'L' block!", doorCount: "Bridge Piece 4" },
  5: { message: "Fantastic! 'L' and 'A' shine bright together as 'LA'. We are halfway across the gap! Only four more pieces to go—find the 'P'!", doorCount: "Bridge Piece 5" },
  6: { message: "Incredible! 'P' and 'A' blend to make 'PA'. You are doing such a great job building this bridge. Next up is the 'N' block!", doorCount: "Bridge Piece 6" },
  7: { message: "Wonderful! 'N' and 'A' unite to make 'NA'. Just one more bridge piece to go before we cross! Let's finish with the 'D' block!", doorCount: "Bridge Piece 7" },
  8: { message: "Fantastic! The final 'D' and 'A' blend to make 'DA'. You've built the whole bridge and crossed the gap! You're a master builder!", doorCount: "Bridge Piece 8" },
};

export function ChapterBridge({ 
  stageName, 
  currentLevel, 
  vowel, 
  vowelName, 
  stageId, 
  onBeginChapter, 
  blendingPair,
  isCompletionView = false 
}: ChapterBridgeProps) {
  const theme = STAGE_THEMES[stageId as keyof typeof STAGE_THEMES] || STAGE_THEMES[1];
  
  // Apply the -1 logic to fetch the story and audio for the level just completed.
  // Math.max ensures it doesn't drop below 1 if the user is on the very first level.
  const storyLevel = Math.max(1, currentLevel - 1);
  const storySet = stageId === 2 ? BLENDING_STORIES : VOWEL_STORIES;
  const story = storySet[storyLevel] || Object.values(storySet)[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Both Stage 1 and Stage 2 use the "MiloCompletedLevelX.wav" naming convention for stories
    // This will now properly play the audio for the (currentLevel - 1)
    const fileName = `MiloCompletedLevel${storyLevel}`;
    const audio = new Audio(`/audio/stage${stageId}/${fileName}.wav`);
    audioRef.current = audio;

    const timer = setTimeout(() => {
      audio.play().catch(e => console.log("Autoplay blocked:", e));
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    };
  }, [stageId, storyLevel]);

  const handleRepeatStory = () => {
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); }
  };

  const handleListen = () => {
    // Stage 1 looks for pure vowels (E.wav), Stage 2 looks for Pronunciation (PronounceMA.wav)
    const audioPath = stageId === 2 
      ? `/audio/stage${stageId}/Pronounce${blendingPair?.consonant}${blendingPair?.vowel}.wav` 
      : `/audio/stage${stageId}/${vowel.toUpperCase()}.wav`;
      
    new Audio(audioPath).play().catch(e => console.error("Error playing listen audio:", e));
  };

  return (
    <div className={`size-full bg-gradient-to-b ${theme.from} ${theme.to} overflow-hidden relative flex flex-col`}>
      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-10 py-6">
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full justify-between">
          
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-[#8A91A3]">
              <span className={theme.text}>{story.doorCount}</span> - {stageName}
            </span>
            {/* The level indicator still shows the current active level they are about to play */}
            <span className="text-xs uppercase tracking-wider text-[#8A91A3]">Level {currentLevel}</span>
          </motion.div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8">
              <CharacterCompanion state="encouraging" phoneme={vowel} size={220} />

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-3xl p-6 md:p-8 shadow-lg border-2 ${theme.border} max-w-md w-full relative`}>
                <button onClick={handleRepeatStory} className={`absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold ${theme.text} hover:opacity-80 transition-colors bg-current/10 px-2 py-1 rounded-full`}>
                  <Volume2 className="w-3 h-3" /> Repeat
                </button>

                {/* This will now show the -1 story message */}
                <p className="text-center text-base md:text-lg text-[#1F2430] leading-relaxed mb-6 mt-4">{story.message}</p>
                
                <div className="bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] rounded-2xl p-6 mb-6">
                  <p className="text-xs uppercase tracking-widest text-[#8A91A3] text-center mb-3 font-medium">THE SOUND</p>
                  <div className="text-center flex items-center justify-center gap-4">
                    <div className={`text-5xl font-bold ${theme.text}`}>
                      {blendingPair ? `${blendingPair.consonant} + ${blendingPair.vowel}` : vowel}
                    </div>
                    <button onClick={handleListen} className={`p-4 rounded-full bg-current/10 hover:bg-current/20 transition-colors ${theme.text}`}>
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-6">
            <motion.button whileHover={{ y: -2 }} onClick={onBeginChapter} className={`flex-1 px-8 py-4 rounded-2xl ${theme.bg} text-white font-bold text-lg hover:opacity-90 flex items-center justify-center gap-3`}>
              Let's Go! <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}