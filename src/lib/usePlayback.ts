"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type PlaybackState = "idle" | "playing" | "paused";
type Speed = 0.5 | 1 | 2;

export function usePlayback(
  totalStages: number,
  onStageChange: (stage: number) => void
) {
  const [state, setState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState<Speed>(1);
  const [currentStage, setCurrentStage] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setState("paused");
    clearTimer();
  }, [clearTimer]);

  const togglePlayPause = useCallback(() => {
    setState((prev) => {
      if (prev === "playing") {
        clearTimer();
        return "paused";
      }
      return "playing";
    });
  }, [clearTimer]);

  const next = useCallback(() => {
    setCurrentStage((prev) => {
      const nextStage = Math.min(prev + 1, totalStages - 1);
      onStageChange(nextStage);
      return nextStage;
    });
  }, [totalStages, onStageChange]);

  const prev = useCallback(() => {
    setCurrentStage((prev) => {
      const prevStage = Math.max(prev - 1, 0);
      onStageChange(prevStage);
      return prevStage;
    });
  }, [onStageChange]);

  useEffect(() => {
    if (state !== "playing") return;

    const intervalMs = 3000 / speed;
    intervalRef.current = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= totalStages - 1) {
          setState("paused");
          clearTimer();
          return prev;
        }
        const nextStage = prev + 1;
        onStageChange(nextStage);
        return nextStage;
      });
    }, intervalMs);

    return clearTimer;
  }, [state, speed, totalStages, onStageChange, clearTimer]);

  return { state, speed, currentStage, pause, togglePlayPause, next, prev, setSpeed };
}
