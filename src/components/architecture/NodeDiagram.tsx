"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { NodeBox } from "./NodeBox";

type Props = {
  nodes: ArchitectureNode[];
  selectedNodeId: string | null;
  onNodeClick: (id: string) => void;
};

export function NodeDiagram({ nodes, selectedNodeId, onNodeClick }: Props) {
  return (
    <motion.div
      layout
      className="grid gap-4"
      style={{
        gridTemplateColumns:
          nodes.length <= 3 ? `repeat(${nodes.length}, 1fr)` : nodes.length <= 6 ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
      }}
    >
      <AnimatePresence mode="popLayout">
        {nodes.map((node) => (
          <NodeBox
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onNodeClick(node.id)}
            layoutId={`node-${node.id}`}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
