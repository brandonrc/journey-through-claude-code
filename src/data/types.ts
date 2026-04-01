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
  featureGated?: boolean;
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

export type ToolCategory = "file-ops" | "execution" | "search" | "agents" | "planning" | "mcp" | "system";
export type CommandCategory = "setup-config" | "git-code" | "session" | "navigation" | "development" | "debugging" | "ui";

export type CatalogItem = {
  name: string;
  description: string;
  category: string;
  color: string;
  featureGated?: boolean;
  gateReason?: string;
};

export const TOOL_CATEGORY_COLORS: Record<ToolCategory, string> = {
  "file-ops": "#D4A853",
  execution: "#C17B5E",
  search: "#7B9EB8",
  agents: "#6BA368",
  planning: "#B8A9C9",
  mcp: "#9BBEC7",
  system: "#8A8580",
};

export const TOOL_CATEGORY_LABELS: Record<ToolCategory, string> = {
  "file-ops": "File Operations",
  execution: "Execution",
  search: "Search & Fetch",
  agents: "Agents & Tasks",
  planning: "Planning",
  mcp: "MCP",
  system: "System",
};

export const COMMAND_CATEGORY_COLORS: Record<CommandCategory, string> = {
  "setup-config": "#7B9EB8",
  "git-code": "#6BA368",
  session: "#D4A853",
  navigation: "#9BBEC7",
  development: "#C17B5E",
  debugging: "#B8A9C9",
  ui: "#8A8580",
};

export const COMMAND_CATEGORY_LABELS: Record<CommandCategory, string> = {
  "setup-config": "Setup & Config",
  "git-code": "Git & Code",
  session: "Session",
  navigation: "Navigation",
  development: "Development",
  debugging: "Debugging",
  ui: "UI & Display",
};
