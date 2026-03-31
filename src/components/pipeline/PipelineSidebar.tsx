"use client";

import { motion } from "framer-motion";
import { GlowingDot } from "./GlowingDot";

type Props = {
  stages: { id: string; title: string }[];
  activeStage: number;
  progress: number;
  scenarioColor?: string;
};

export function PipelineSidebar({ stages, activeStage, progress, scenarioColor }: Props) {
  return (
    <div className="sticky top-20 w-64 hidden lg:block">
      <div className="relative py-8">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
        <GlowingDot progress={progress} totalStages={stages.length} color={scenarioColor} />
        {stages.map((stage, i) => (
          <div key={stage.id} className="relative flex items-center h-20">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10"
              animate={{
                borderColor: i <= activeStage ? scenarioColor ?? "var(--color-terminal-green)" : "var(--color-border)",
                backgroundColor: i <= activeStage ? scenarioColor ?? "var(--color-terminal-green)" : "transparent",
              }}
              transition={{ duration: 0.3 }}
            />
            <span className={`absolute left-[calc(50%+20px)] text-xs font-mono whitespace-nowrap transition-colors ${i === activeStage ? "text-text-primary" : "text-text-muted"}`}>
              {stage.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
