import { motion } from "motion/react";

interface MouthShapeGuideProps {
  phoneme: string;
  isVisible: boolean;
}

export function MouthShapeGuide({ phoneme, isVisible }: MouthShapeGuideProps) {
  if (!isVisible) return null;

  // Map phonemes to visual mouth shape descriptions and illustrations
  const mouthShapes: Record<string, { shape: string; tip: string }> = {
    A: {
      shape: "😮",
      tip: "Open your mouth wide like you're surprised!",
    },
    E: {
      shape: "😁",
      tip: "Smile and show your teeth!",
    },
    I: {
      shape: "😊",
      tip: "Smile with your mouth slightly open!",
    },
    O: {
      shape: "😯",
      tip: "Make your lips round like a circle!",
    },
    U: {
      shape: "😗",
      tip: "Push your lips forward like you're blowing!",
    },
  };

  const guide = mouthShapes[phoneme] || mouthShapes.A;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="bg-blue-100 border-4 border-blue-400 rounded-3xl p-6"
    >
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="bg-white rounded-2xl p-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-8xl"
            >
              {guide.shape}
            </motion.div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-blue-800 mb-2">
            Watch how to say it!
          </h3>
          <p className="text-lg text-blue-700">{guide.tip}</p>

          <div className="mt-4 bg-white/50 rounded-xl p-3">
            <p className="text-sm text-blue-600 font-medium">
              💡 Position your mouth like the picture, then say the sound!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
