"use client";

import { motion } from "framer-motion";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS, SCENARIO_LABELS, SCENARIO_PROMPTS } from "@/data/types";

type Props = {
  selectedScenario: Scenario | null;
  onSelect: (scenario: Scenario) => void;
};

const scenarios: Scenario[] = ["simple", "file-edit", "bash", "agent-swarm"];

export function BranchSelector({ selectedScenario, onSelect }: Props) {
  return (
    <div className="py-16 min-h-[50vh] flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-4">The Path Branches</h2>
      <p className="text-text-secondary text-lg mb-8 max-w-2xl">
        The model&apos;s response determines what happens next. Different prompts
        take different paths through the system. Choose a scenario:
      </p>
      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
        {scenarios.map((scenario) => (
          <motion.button
            key={scenario}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(scenario)}
            className={`text-left p-5 rounded-lg border transition-colors ${
              selectedScenario === scenario
                ? "border-current bg-bg-surface"
                : "border-border hover:border-current bg-bg-elevated"
            }`}
            style={{ color: SCENARIO_COLORS[scenario] }}
          >
            <div className="font-bold mb-1">{SCENARIO_LABELS[scenario]}</div>
            <div className="font-mono text-sm opacity-70">
              &quot;{SCENARIO_PROMPTS[scenario]}&quot;
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
