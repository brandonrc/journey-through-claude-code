"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CrtOverlay } from "../shared/CrtOverlay";

const prompts = [
  "edit this file",
  "run the tests",
  "explain this function",
  "refactor the auth module",
  "what changed in the last commit?",
];

export function Hero() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPrompt = prompts[promptIndex];

    if (!isDeleting && displayText.length < currentPrompt.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentPrompt.slice(0, displayText.length + 1));
      }, 50 + Math.random() * 50);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && displayText.length === currentPrompt.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 30);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setPromptIndex((i) => (i + 1) % prompts.length);
    }
  }, [displayText, isDeleting, promptIndex]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] px-6">
      <CrtOverlay />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
          <span className="text-text-primary">Journey Through</span>
          <br />
          <span className="text-terminal-green">Claude Code</span>
        </h1>
        <div className="font-mono text-lg md:text-xl text-text-secondary bg-bg-surface border border-border rounded-lg px-6 py-4 inline-block">
          <span className="text-terminal-green">$</span>{" "}
          <span className="text-text-primary">claude</span>{" "}
          <span className="text-terminal-amber">&quot;{displayText}&quot;</span>
          <span className="text-terminal-green animate-pulse">&#x258A;</span>
        </div>
        <p className="mt-8 text-text-secondary text-lg max-w-xl mx-auto">
          Explore what happens inside Anthropic&apos;s CLI when you hit Enter.
          Trace a prompt through every system, or zoom into the architecture.
        </p>
      </motion.div>
    </div>
  );
}
