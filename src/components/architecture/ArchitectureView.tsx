"use client";

import { AnimatePresence } from "framer-motion";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { Minimap } from "./Minimap";
import { NodeDiagram } from "./NodeDiagram";
import { NodeDetail } from "./NodeDetail";
import { useZoom } from "@/lib/useZoom";

export function ArchitectureView() {
  const { path, visibleNodes, selectedNode, selectedNodeId, zoomIn, zoomTo, setSelectedNodeId } = useZoom();

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionHeader
          command={`explore --depth ${path.length} ${path.length > 0 ? `--system "${path[path.length - 1].title}"` : ""}`}
        />
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
      </div>
      <Minimap path={path} onNavigate={zoomTo} />
    </div>
  );
}
