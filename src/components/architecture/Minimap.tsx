"use client";

import { motion } from "framer-motion";
import { getLevel0Nodes } from "@/data/architecture";
import type { ZoomPath } from "@/lib/useZoom";

type Props = {
  path: ZoomPath;
  onNavigate: (index: number) => void;
};

export function Minimap({ path, onNavigate }: Props) {
  const level0 = getLevel0Nodes();
  const activeL0Id = path.length > 0 ? path[0].id : null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <div className="bg-bg-elevated border border-border rounded-lg p-3 opacity-60 hover:opacity-100 transition-opacity">
        <div className="text-xs font-mono text-text-muted mb-2">Map</div>
        <div className="space-y-1">
          {level0.map((node) => (
            <motion.button
              key={node.id}
              onClick={() => onNavigate(-1)}
              className={`block w-full text-left text-xs font-mono px-2 py-1 rounded transition-colors ${
                node.id === activeL0Id ? "bg-terminal-green/20 text-terminal-green" : "text-text-muted hover:text-text-secondary"
              }`}
              animate={{ scale: node.id === activeL0Id ? 1.05 : 1 }}
            >
              {node.title}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
