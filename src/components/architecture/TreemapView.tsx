"use client";

import { useState, useMemo } from "react";
import { computeTreemap } from "@/lib/treemapLayout";
import { treemapData } from "@/data/treemap-data";
import { TreemapRectComponent } from "./TreemapRect";

const TREEMAP_WIDTH = 900;
const TREEMAP_HEIGHT = 500;

export function TreemapView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rects = useMemo(() => computeTreemap(treemapData, TREEMAP_WIDTH, TREEMAP_HEIGHT), []);

  const selectedRect = rects.find((r) => r.id === selectedId);

  return (
    <div>
      <svg viewBox={`0 0 ${TREEMAP_WIDTH} ${TREEMAP_HEIGHT}`} className="w-full h-auto rounded-lg border border-border bg-bg-elevated">
        {rects.map((rect) => (
          <TreemapRectComponent
            key={rect.id}
            rect={rect}
            onClick={() => setSelectedId(selectedId === rect.id ? null : rect.id)}
            isSelected={selectedId === rect.id}
          />
        ))}
      </svg>
      {selectedRect && (
        <div className="mt-4 p-4 rounded-lg border border-border bg-bg-surface">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: selectedRect.color }} />
            <span className="font-mono font-bold" style={{ color: selectedRect.color }}>
              src/{selectedRect.label}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{selectedRect.description}</p>
        </div>
      )}
    </div>
  );
}
