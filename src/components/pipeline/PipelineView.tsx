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
