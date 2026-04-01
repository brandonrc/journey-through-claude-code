"use client";

import { motion } from "framer-motion";
import type { CatalogItem } from "@/data/types";

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

export function CatalogDetail({ item, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-xl border border-border bg-bg-elevated p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-mono" style={{ color: item.color }}>
              {item.name}
            </h3>
            {item.featureGated && (
              <span className="text-xs font-mono text-terminal-amber bg-terminal-amber/10 px-2 py-0.5 rounded mt-1 inline-block">
                {item.gateReason ?? "Feature-gated"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors font-mono text-sm"
          >
            [esc]
          </button>
        </div>
        <p className="text-text-secondary leading-relaxed">{item.description}</p>
      </motion.div>
    </motion.div>
  );
}
