"use client";

import { motion } from "framer-motion";
import type { TreemapRect as TreemapRectType } from "@/lib/treemapLayout";

type Props = {
  rect: TreemapRectType;
  onClick: () => void;
  isSelected: boolean;
};

export function TreemapRectComponent({ rect, onClick, isSelected }: Props) {
  const showLabel = rect.width > 60 && rect.height > 30;
  const showValue = rect.width > 80 && rect.height > 45;

  return (
    <motion.g onClick={onClick} className="cursor-pointer" whileHover={{ opacity: 0.9 }}>
      <rect
        x={rect.x + 1} y={rect.y + 1}
        width={Math.max(0, rect.width - 2)} height={Math.max(0, rect.height - 2)}
        rx={4}
        fill={`${rect.color}20`}
        stroke={isSelected ? rect.color : `${rect.color}40`}
        strokeWidth={isSelected ? 2 : 1}
      />
      {showLabel && (
        <text x={rect.x + 8} y={rect.y + 20} fill={rect.color} fontSize={12} fontFamily="var(--font-mono)" fontWeight={600}>
          {rect.label}
        </text>
      )}
      {showValue && (
        <text x={rect.x + 8} y={rect.y + 36} fill={`${rect.color}99`} fontSize={10} fontFamily="var(--font-mono)">
          {rect.value} files
        </text>
      )}
    </motion.g>
  );
}
