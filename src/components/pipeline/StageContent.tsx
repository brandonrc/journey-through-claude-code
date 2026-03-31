"use client";

import { motion } from "framer-motion";
import type { PipelineStage } from "@/data/types";
import { SectionHeader } from "../shared/SectionHeader";
import { CodePanel } from "../shared/CodePanel";

type Props = {
  stage: PipelineStage;
  isActive: boolean;
  stageRef: (el: HTMLDivElement | null) => void;
};

export function StageContent({ stage, isActive, stageRef }: Props) {
  return (
    <div ref={stageRef} className="min-h-[60vh] py-16">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader command={stage.subtitle} />
        <h2 className="text-3xl font-bold mb-4">{stage.title}</h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-2xl">
          {stage.description}
        </p>
        {stage.sourceFiles.map((sf) => (
          <div key={sf.path} className="mb-4">
            <CodePanel filePath={sf.path} code={sf.snippet} highlightLines={sf.highlightLines} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
