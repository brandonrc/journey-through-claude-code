"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useScrollStage(stageCount: number) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setStageRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stageRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      for (let i = stageRefs.current.length - 1; i >= 0; i--) {
        const el = stageRefs.current[i];
        if (el && el.offsetTop <= viewportCenter) {
          setActiveStage(i);
          const stageTop = el.offsetTop;
          const stageHeight = el.offsetHeight;
          const progressInStage = Math.min(
            1,
            Math.max(0, (viewportCenter - stageTop) / stageHeight)
          );
          setProgress((i + progressInStage) / stageCount);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stageCount]);

  return { activeStage, progress, setStageRef };
}
