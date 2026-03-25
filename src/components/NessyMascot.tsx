import { motion, AnimatePresence } from 'framer-motion';
import nessyImg from '@/assets/nessy-moscow.png';

interface NessyMascotProps {
  mood: 'idle' | 'thinking' | 'happy' | 'sad';
}

const bubbleText: Record<string, string> = {
  idle: "Drag blocks to build! 🔧",
  thinking: "Verifying proof... 🤔",
  happy: "Proof valid! 🎉",
  sad: "Hmm, try again! 💪",
};

const moodAnim: Record<string, any> = {
  idle: { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  thinking: { rotate: [-3, 3, -3], transition: { duration: 0.8, repeat: Infinity } },
  happy: { scale: [1, 1.1, 1], y: [0, -10, 0], transition: { duration: 0.5, repeat: 2 } },
  sad: { x: [-3, 3, -3, 0], transition: { duration: 0.4, repeat: 1 } },
};

export default function NessyMascot({ mood }: NessyMascotProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-panel-strong px-3 py-1.5 rounded-full text-[10px] font-semibold text-foreground neon-glow-purple"
        >
          {bubbleText[mood]}
        </motion.div>
      </AnimatePresence>

      <motion.img
        src={nessyImg}
        alt="Nessy mascot"
        className="w-20 h-20 object-contain drop-shadow-[0_0_15px_hsl(265_90%_62%/0.4)]"
        animate={moodAnim[mood]}
      />
    </div>
  );
}
