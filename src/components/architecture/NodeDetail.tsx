"use client";

import { motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { CodePanel } from "../shared/CodePanel";

type Props = {
  node: ArchitectureNode;
  onClose: () => void;
};

export function NodeDetail({ node, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="border-l border-border pl-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{node.title}</h2>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors font-mono text-sm">
          [close]
        </button>
      </div>
      <p className="text-text-secondary leading-relaxed mb-6">{node.description}</p>
      {node.dataFlow && (
        <div className="mb-6 p-4 rounded-lg bg-bg-surface border border-border">
          <h4 className="font-mono text-sm text-text-muted mb-3">Data Flow</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-terminal-green mb-2">Inputs</div>
              {node.dataFlow.inputs.map((input) => (
                <div key={input} className="text-sm text-text-secondary font-mono">{"← "}{input}</div>
              ))}
            </div>
            <div>
              <div className="text-xs font-mono text-terminal-amber mb-2">Outputs</div>
              {node.dataFlow.outputs.map((output) => (
                <div key={output} className="text-sm text-text-secondary font-mono">{"→ "}{output}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      {node.interestingDetails && node.interestingDetails.length > 0 && (
        <div className="mb-6">
          <h4 className="font-mono text-sm text-terminal-amber mb-3">Interesting Details</h4>
          <ul className="space-y-2">
            {node.interestingDetails.map((detail, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-terminal-amber shrink-0">*</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
      {node.sourceFiles.map((sf) => (
        <div key={sf.path} className="mb-4">
          <CodePanel filePath={sf.path} code={sf.snippet} />
        </div>
      ))}
    </motion.div>
  );
}
