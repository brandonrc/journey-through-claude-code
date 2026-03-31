"use client";

import { useState } from "react";
import { GridBackground } from "../shared/GridBackground";
import { PipelineSidebar } from "./PipelineSidebar";
import { StageContent } from "./StageContent";
import { BranchSelector } from "./BranchSelector";
import { ScenarioPath } from "./ScenarioPath";
import { PostScenario } from "./PostScenario";
import { useScrollStage } from "@/lib/useScrollStage";
import { sharedStages, scenarioStages } from "@/data/stages";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS } from "@/data/types";

export function PipelineView() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const currentStages = selectedScenario
    ? [...sharedStages, ...scenarioStages[selectedScenario]]
    : sharedStages;

  const { activeStage, progress, setStageRef } = useScrollStage(currentStages.length);

  const scenarioColor = selectedScenario ? SCENARIO_COLORS[selectedScenario] : undefined;

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      {/* Mobile progress bar */}
      <div className="lg:hidden sticky top-14 z-30 bg-bg/90 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: scenarioColor ?? "var(--color-terminal-green)",
              }}
            />
          </div>
          <span className="text-xs font-mono text-text-muted">
            {activeStage + 1}/{currentStages.length}
          </span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          <div className="flex-1 max-w-3xl">
            {sharedStages.map((stage, i) => (
              <StageContent key={stage.id} stage={stage} isActive={activeStage === i} stageRef={setStageRef(i)} />
            ))}
            <BranchSelector selectedScenario={selectedScenario} onSelect={setSelectedScenario} />
            {selectedScenario && (
              <ScenarioPath
                stages={scenarioStages[selectedScenario]}
                activeStage={activeStage}
                stageOffset={sharedStages.length}
                setStageRef={setStageRef}
              />
            )}
            {selectedScenario && (
              <PostScenario currentScenario={selectedScenario} onSelect={setSelectedScenario} />
            )}
          </div>
          <PipelineSidebar
            stages={currentStages.map((s) => ({ id: s.id, title: s.title }))}
            activeStage={activeStage}
            progress={progress}
            scenarioColor={scenarioColor}
          />
        </div>
      </div>
    </div>
  );
}
