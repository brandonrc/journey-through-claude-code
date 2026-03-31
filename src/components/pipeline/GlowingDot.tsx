"use client";

import { motion } from "framer-motion";

type Props = {
  progress: number;
  color?: string;
  totalStages: number;
};

export function GlowingDot({ progress, color = "var(--color-terminal-green)", totalStages }: Props) {
  const y = progress * (totalStages * 80);

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      animate={{ y }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="absolute -inset-4 rounded-full blur-xl opacity-40" style={{ backgroundColor: color }} />
      <div className="w-4 h-4 rounded-full relative z-10" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }} />
    </motion.div>
  );
}
