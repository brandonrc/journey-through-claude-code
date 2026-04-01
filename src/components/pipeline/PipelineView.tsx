"use client";

import { useState, useCallback, useEffect } from "react";
import { GridBackground } from "../shared/GridBackground";
import { PipelineSidebar } from "./PipelineSidebar";
import { StageContent } from "./StageContent";
import { BranchSelector } from "./BranchSelector";
import { ScenarioPath } from "./ScenarioPath";
import { PostScenario } from "./PostScenario";
import { PlaybackControls } from "./PlaybackControls";
import { useScrollStage } from "@/lib/useScrollStage";
import { usePlayback } from "@/lib/usePlayback";
import { sharedStages, scenarioStages } from "@/data/stages";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS } from "@/data/types";

type Mode = "scroll" | "playback";

export function PipelineView() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [mode, setMode] = useState<Mode>("scroll");

  const currentStages = selectedScenario
    ? [...sharedStages, ...scenarioStages[selectedScenario]]
    : sharedStages;

  const { activeStage, progress, setStageRef } = useScrollStage(currentStages.length);

  const scrollToStage = useCallback((stage: number) => {
    const stageEls = document.querySelectorAll("[data-stage-index]");
    const target = stageEls[stage] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const playback = usePlayback(currentStages.length, scrollToStage);
  const { state: playbackState, pause: playbackPause } = playback;

  // Pause playback on user scroll
  useEffect(() => {
    if (mode !== "playback" || playbackState !== "playing") return;
    const handleWheel = () => playbackPause();
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [mode, playbackState, playbackPause]);

  const effectiveActiveStage = mode === "playback" ? playback.currentStage : activeStage;
  const scenarioColor = selectedScenario ? SCENARIO_COLORS[selectedScenario] : undefined;

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      {/* Mode toggle + mobile progress */}
      <div className="sticky top-14 z-30 bg-bg/90 backdrop-blur-sm border-b border-border px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            {(["scroll", "playback"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  mode === m
                    ? "bg-terminal-green/20 text-terminal-green"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {m === "scroll" ? "Scroll" : "Autoplay"}
              </button>
            ))}
          </div>
          <div className="lg:hidden flex items-center gap-3 flex-1 ml-4">
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(mode === "playback" ? (playback.currentStage + 1) / currentStages.length : progress) * 100}%`,
                  backgroundColor: scenarioColor ?? "var(--color-terminal-green)",
                }}
              />
            </div>
            <span className="text-xs font-mono text-text-muted">
              {effectiveActiveStage + 1}/{currentStages.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          <div className="flex-1 max-w-3xl">
            {sharedStages.map((stage, i) => (
              <div key={stage.id} data-stage-index={i}>
                <StageContent stage={stage} isActive={effectiveActiveStage === i} stageRef={setStageRef(i)} />
              </div>
            ))}
            <BranchSelector selectedScenario={selectedScenario} onSelect={setSelectedScenario} />
            {selectedScenario && (
              <ScenarioPath
                stages={scenarioStages[selectedScenario]}
                activeStage={effectiveActiveStage}
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
            activeStage={effectiveActiveStage}
            progress={mode === "playback" ? (playback.currentStage + 1) / currentStages.length : progress}
            scenarioColor={scenarioColor}
          />
        </div>
      </div>

      {mode === "playback" && (
        <PlaybackControls
          isPlaying={playback.state === "playing"}
          speed={playback.speed}
          currentStage={playback.currentStage}
          totalStages={currentStages.length}
          onTogglePlay={playback.togglePlayPause}
          onPrev={playback.prev}
          onNext={playback.next}
          onSpeedChange={playback.setSpeed}
        />
      )}
    </div>
  );
}
