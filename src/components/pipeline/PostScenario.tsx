"use client";

import { motion } from "framer-motion";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS, SCENARIO_LABELS } from "@/data/types";

type Props = {
  currentScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
};

const allScenarios: Scenario[] = ["simple", "file-edit", "bash", "agent-swarm"];

export function PostScenario({ currentScenario, onSelect }: Props) {
  const otherScenarios = allScenarios.filter((s) => s !== currentScenario);

  return (
    <div className="py-16 text-center">
      <h3 className="text-2xl font-bold mb-4">Try another path?</h3>
      <div className="flex gap-4 justify-center flex-wrap">
        {otherScenarios.map((scenario) => (
          <motion.button
            key={scenario}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onSelect(scenario);
              window.scrollTo({
                top: document.getElementById("branch-point")?.offsetTop ?? 0,
                behavior: "smooth",
              });
            }}
            className="px-6 py-3 rounded-lg border border-border bg-bg-elevated font-mono text-sm hover:border-current transition-colors"
            style={{ color: SCENARIO_COLORS[scenario] }}
          >
            {SCENARIO_LABELS[scenario]}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
