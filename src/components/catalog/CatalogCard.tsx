"use client";

import { motion } from "framer-motion";
import type { CatalogItem } from "@/data/types";

type Props = {
  item: CatalogItem;
  onClick: () => void;
};

export function CatalogCard({ item, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-colors ${
        item.featureGated
          ? "border-dashed opacity-60 hover:opacity-80"
          : "hover:brightness-110"
      }`}
      style={{
        borderColor: `${item.color}25`,
        backgroundColor: `${item.color}08`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium truncate" style={{ color: item.color }}>
          {item.name}
        </span>
        {item.featureGated && <span className="text-xs opacity-70 shrink-0">gated</span>}
      </div>
      <p className="text-xs text-text-muted mt-1 line-clamp-2">{item.description}</p>
    </motion.button>
  );
}
