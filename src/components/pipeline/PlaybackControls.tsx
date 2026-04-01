"use client";

import { motion } from "framer-motion";

type Speed = 0.5 | 1 | 2;

type Props = {
  isPlaying: boolean;
  speed: Speed;
  currentStage: number;
  totalStages: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: Speed) => void;
};

const speeds: Speed[] = [0.5, 1, 2];

export function PlaybackControls({
  isPlaying, speed, currentStage, totalStages,
  onTogglePlay, onPrev, onNext, onSpeedChange,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-6 z-30 flex justify-center"
    >
      <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-bg-elevated/95 backdrop-blur-md shadow-lg">
        <button
          onClick={onPrev}
          disabled={currentStage === 0}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors font-mono text-sm"
        >
          {"<<"}
        </button>
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors"
        >
          {isPlaying ? "||" : "\u25B6"}
        </button>
        <button
          onClick={onNext}
          disabled={currentStage >= totalStages - 1}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors font-mono text-sm"
        >
          {">>"}
        </button>
        <div className="w-px h-6 bg-border" />
        <span className="text-xs font-mono text-text-muted">
          {currentStage + 1}/{totalStages}
        </span>
        <div className="w-px h-6 bg-border" />
        <div className="flex gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                speed === s ? "bg-terminal-green/20 text-terminal-green" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
