"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export function TerminalWindow({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-bg-elevated">
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-bg-surface border-b border-border ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent-red/80" />
          <div className="w-3 h-3 rounded-full bg-terminal-amber/80" />
          <div className="w-3 h-3 rounded-full bg-terminal-green/80" />
        </div>
        <span className="text-sm font-mono text-text-secondary ml-2 flex-1">
          {title}
        </span>
        {collapsible && (
          <span className="text-text-muted text-xs">
            {isOpen ? "\u25BC" : "\u25B6"}
          </span>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 font-mono text-sm">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
