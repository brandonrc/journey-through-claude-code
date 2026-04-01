"use client";

import type { PipelineStage } from "@/data/types";
import { StageContent } from "./StageContent";

type Props = {
  stages: PipelineStage[];
  activeStage: number;
  stageOffset: number;
  setStageRef: (index: number) => (el: HTMLDivElement | null) => void;
};

export function ScenarioPath({ stages, activeStage, stageOffset, setStageRef }: Props) {
  return (
    <div>
      {stages.map((stage, i) => (
        <div key={stage.id} data-stage-index={stageOffset + i}>
          <StageContent
            stage={stage}
            isActive={activeStage === stageOffset + i}
            stageRef={setStageRef(stageOffset + i)}
          />
        </div>
      ))}
    </div>
  );
}
