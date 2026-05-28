import { motion, AnimatePresence } from "motion/react";

export type CharacterState =
  | "idle"
  | "speaking"
  | "listening"
  | "celebrating"
  | "encouraging"
  | "thinking";

interface CharacterCompanionProps {
  state: CharacterState;
  phoneme?: string;
  size?: number;
}

const MOUTH_SHAPES: Record<string, { rx: number; ry: number; round: boolean }> = {
  A: { rx: 40, ry: 50, round: true },
  E: { rx: 55, ry: 22, round: false },
  I: { rx: 60, ry: 14, round: false },
  O: { rx: 38, ry: 42, round: true },
  U: { rx: 26, ry: 32, round: true },
  default: { rx: 40, ry: 20, round: false },
};

export function CharacterCompanion({
  state,
  phoneme,
  size = 320,
}: CharacterCompanionProps) {
  const mouth =
    state === "speaking" && phoneme
      ? MOUTH_SHAPES[phoneme.toUpperCase()] ?? MOUTH_SHAPES.default
      : state === "celebrating"
      ? { rx: 55, ry: 35, round: true }
      : state === "encouraging"
      ? { rx: 45, ry: 12, round: false }
      : { rx: 30, ry: 8, round: false };

  const eyeScale =
    state === "listening" ? 1.25 : state === "celebrating" ? 1.15 : 1;
  const eyeY = state === "thinking" ? -4 : 0;

  const isSpeaking = state === "speaking";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Listening pulse rings */}
      <AnimatePresence>
        {state === "listening" && (
          <>
            {[0, 0.4, 0.8].map((delay) => (
              <motion.div
                key={delay}
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-4 border-indigo-400"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Celebration sparkles */}
      <AnimatePresence>
        {state === "celebrating" &&
          Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * (size * 0.55);
            const y = Math.sin(angle) * (size * 0.55);
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{ x, y, scale: [0, 1.4, 0.8], opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, delay: i * 0.05, repeat: Infinity, repeatDelay: 0.4 }}
                className="absolute left-1/2 top-1/2 text-3xl pointer-events-none"
                style={{ marginLeft: -16, marginTop: -16 }}
              >
                ✨
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Body - bouncing/breathing */}
      <motion.div
        animate={
          state === "celebrating"
            ? { y: [0, -20, 0], rotate: [-5, 5, -5] }
            : state === "listening"
            ? { scale: [1, 1.03, 1] }
            : state === "encouraging"
            ? { rotate: [-3, 3, -3] }
            : { y: [0, -6, 0] }
        }
        transition={{
          duration: state === "celebrating" ? 0.6 : state === "listening" ? 1 : 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
      >
        {/* Shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-black/15 rounded-full blur-md"
          style={{ width: size * 0.55, height: size * 0.08, bottom: size * 0.02 }}
        />

        {/* Character SVG */}
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="bodyGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="60%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#5b21b6" />
            </radialGradient>
            <radialGradient id="cheekGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ears (perk up when listening) */}
          <motion.g
            animate={{
              y: state === "listening" ? -8 : 0,
              rotate: state === "thinking" ? -15 : 0,
            }}
            style={{ transformOrigin: "150px 80px" }}
          >
            <ellipse cx="80" cy="70" rx="22" ry="36" fill="url(#bodyGrad)" transform="rotate(-20 80 70)" />
            <ellipse cx="80" cy="70" rx="10" ry="20" fill="#fbcfe8" transform="rotate(-20 80 70)" />
            <ellipse cx="220" cy="70" rx="22" ry="36" fill="url(#bodyGrad)" transform="rotate(20 220 70)" />
            <ellipse cx="220" cy="70" rx="10" ry="20" fill="#fbcfe8" transform="rotate(20 220 70)" />
          </motion.g>

          {/* Head/Body */}
          <ellipse cx="150" cy="160" rx="110" ry="115" fill="url(#bodyGrad)" />

          {/* Belly highlight */}
          <ellipse cx="150" cy="200" rx="70" ry="60" fill="#fef3c7" opacity="0.95" />

          {/* Cheeks */}
          <ellipse cx="80" cy="190" rx="22" ry="14" fill="url(#cheekGrad)" />
          <ellipse cx="220" cy="190" rx="22" ry="14" fill="url(#cheekGrad)" />

          {/* Eyes */}
          <motion.g animate={{ scale: eyeScale, y: eyeY }} style={{ transformOrigin: "150px 145px" }}>
            {/* Left eye */}
            <ellipse cx="110" cy="145" rx="20" ry="24" fill="white" />
            <motion.circle
              animate={{
                cy: state === "thinking" ? 138 : 150,
                cx: state === "listening" ? 115 : 110,
              }}
              cx={110}
              cy={150}
              r={11}
              fill="#1e1b4b"
            />
            <circle cx="114" cy="146" r="4" fill="white" />

            {/* Right eye */}
            <ellipse cx="190" cy="145" rx="20" ry="24" fill="white" />
            <motion.circle
              animate={{
                cy: state === "thinking" ? 138 : 150,
                cx: state === "listening" ? 195 : 190,
              }}
              cx={190}
              cy={150}
              r={11}
              fill="#1e1b4b"
            />
            <circle cx="194" cy="146" r="4" fill="white" />
          </motion.g>

          {/* Eyebrows (encouraging = raised, thinking = slanted) */}
          {state === "encouraging" && (
            <>
              <path d="M 90 115 Q 110 108 130 115" stroke="#1e1b4b" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 170 115 Q 190 108 210 115" stroke="#1e1b4b" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          <motion.ellipse
            animate={
              isSpeaking
                ? {
                    ry: [mouth.ry, mouth.ry * 0.25, mouth.ry, mouth.ry * 0.45, mouth.ry],
                    rx: [mouth.rx, mouth.rx * 0.95, mouth.rx, mouth.rx * 0.92, mouth.rx],
                  }
                : { rx: mouth.rx, ry: mouth.ry }
            }
            transition={
              isSpeaking
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.25 }
            }
            cx={150}
            cy={215}
            fill="#1e1b4b"
          />

          {/* Tongue (visible when mouth open) */}
          {mouth.round && mouth.ry > 25 && (
            <motion.ellipse 
              cx="150" 
              animate={
                isSpeaking
                  ? {
                      rx: [mouth.rx * 0.55, mouth.rx * 0.55 * 0.95, mouth.rx * 0.55, mouth.rx * 0.55 * 0.92, mouth.rx * 0.55],
                      ry: [mouth.ry * 0.4, mouth.ry * 0.4 * 0.1, mouth.ry * 0.4, mouth.ry * 0.4 * 0.2, mouth.ry * 0.4],
                      cy: [225, 217, 225, 219, 225]
                    }
                  : { rx: mouth.rx * 0.55, ry: mouth.ry * 0.4, cy: 225 }
              }
              transition={
                isSpeaking
                  ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.25 }
              }
              fill="#f472b6" 
            />
          )}

          {/* Smile curve when speaking E/I */}
          {!mouth.round && mouth.rx > 50 && (
            <motion.path
              animate={isSpeaking ? { scaleY: [1, 0.3, 1, 0.5, 1] } : { scaleY: 1 }}
              transition={isSpeaking ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.25 }}
              style={{ transformOrigin: "150px 215px" }}
              d={`M ${150 - mouth.rx} 215 Q 150 ${215 + mouth.ry + 8} ${150 + mouth.rx} 215`}
              stroke="#1e1b4b"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Speech indicator dots when speaking */}
        {state === "speaking" && (
          <div className="absolute top-4 right-4 flex gap-1">
            {[0, 0.2, 0.4].map((d) => (
              <motion.div
                key={d}
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                className="w-2.5 h-2.5 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}