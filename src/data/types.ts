export type SourceFile = {
  path: string;
  lineRange?: [number, number];
  highlightLines?: number[];
  snippet: string;
};

export type Scenario = "simple" | "file-edit" | "bash" | "agent-swarm";

export type PipelineStage = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sourceFiles: SourceFile[];
  scenario?: Scenario;
};

export type ArchitectureNode = {
  id: string;
  level: 0 | 1 | 2;
  parentId?: string;
  title: string;
  description: string;
  sourceFiles: SourceFile[];
  interestingDetails?: string[];
  childIds?: string[];
  dataFlow?: {
    inputs: string[];
    outputs: string[];
  };
};

export const SCENARIO_COLORS: Record<Scenario, string> = {
  simple: "var(--color-accent-blue)",
  "file-edit": "var(--color-accent-purple)",
  bash: "var(--color-accent-orange)",
  "agent-swarm": "var(--color-accent-red)",
};

export const SCENARIO_LABELS: Record<Scenario, string> = {
  simple: "Simple Question",
  "file-edit": "File Edit",
  bash: "Run Tests",
  "agent-swarm": "Agent Swarm",
};

export const SCENARIO_PROMPTS: Record<Scenario, string> = {
  simple: "What does this function do?",
  "file-edit": "Edit the auth middleware",
  bash: "Run the tests",
  "agent-swarm": "Refactor this across the codebase",
};
