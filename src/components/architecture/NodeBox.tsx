"use client";

import { motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { getChildNodes } from "@/data/architecture";

type Props = {
  node: ArchitectureNode;
  isSelected: boolean;
  onClick: () => void;
  layoutId: string;
};

export function NodeBox({ node, isSelected, onClick, layoutId }: Props) {
  const hasChildren = getChildNodes(node.id).length > 0;

  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-xl border cursor-pointer transition-colors ${
        isSelected ? "border-terminal-green bg-bg-surface" : "border-border bg-bg-elevated hover:border-text-muted"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-text-primary">{node.title}</h3>
        {hasChildren && (
          <span className="text-xs font-mono text-terminal-green bg-terminal-green/10 px-2 py-0.5 rounded">zoom in</span>
        )}
      </div>
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{node.description}</p>
      {node.dataFlow && (
        <div className="mt-3 flex gap-4 text-xs font-mono">
          <span className="text-terminal-green">{node.dataFlow.inputs.length} inputs</span>
          <span className="text-terminal-amber">{node.dataFlow.outputs.length} outputs</span>
        </div>
      )}
    </motion.div>
  );
}
