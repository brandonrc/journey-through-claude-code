"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { Minimap } from "./Minimap";
import { NodeDiagram } from "./NodeDiagram";
import { NodeDetail } from "./NodeDetail";
import { ViewToggle } from "./ViewToggle";
import { TreemapView } from "./TreemapView";
import { useZoom } from "@/lib/useZoom";

export function ArchitectureView() {
  const [view, setView] = useState<"grid" | "treemap">("grid");
  const { path, visibleNodes, selectedNode, selectedNodeId, zoomIn, zoomTo, setSelectedNodeId } = useZoom();

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionHeader
          command={
            view === "treemap"
              ? "du --treemap --src"
              : `explore --depth ${path.length} ${path.length > 0 ? `--system "${path[path.length - 1].title}"` : ""}`
          }
        />
        <ViewToggle view={view} onChange={setView} />
        {view === "treemap" ? (
          <TreemapView />
        ) : (
          <>
            <Breadcrumbs path={path} onNavigate={zoomTo} />
            <div className="flex gap-8">
              <div className="flex-1">
                <NodeDiagram nodes={visibleNodes} selectedNodeId={selectedNodeId} onNodeClick={zoomIn} />
              </div>
              <AnimatePresence>
                {selectedNode && (
                  <div className="w-[450px] shrink-0">
                    <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      {view === "grid" && <Minimap path={path} onNavigate={zoomTo} />}
    </div>
  );
}
