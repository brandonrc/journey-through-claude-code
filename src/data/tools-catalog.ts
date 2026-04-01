import type { CatalogItem, ToolCategory } from "./types";
import { TOOL_CATEGORY_COLORS } from "./types";

type ToolItem = CatalogItem & { category: ToolCategory };

function tool(name: string, category: ToolCategory, description: string, featureGated?: boolean, gateReason?: string): ToolItem {
  return { name, category, color: TOOL_CATEGORY_COLORS[category], description, featureGated, gateReason };
}

export const toolsCatalog: ToolItem[] = [
  tool("FileRead", "file-ops", "Read files, images, PDFs, and Jupyter notebooks"),
  tool("FileEdit", "file-ops", "Partial file modification via exact string replacement"),
  tool("FileWrite", "file-ops", "Create new files or completely rewrite existing ones"),
  tool("Glob", "file-ops", "Fast file pattern matching (e.g., **/*.ts)"),
  tool("Grep", "file-ops", "Content search powered by ripgrep with regex support"),
  tool("NotebookEdit", "file-ops", "Edit Jupyter notebook cells"),

  tool("Bash", "execution", "Shell command execution with security analysis and sandboxing"),
  tool("PowerShell", "execution", "PowerShell command execution on Windows"),
  tool("REPL", "execution", "Interactive REPL for code evaluation", true, "Internal only (ant)"),

  tool("WebFetch", "search", "Fetch and extract content from URLs"),
  tool("WebSearch", "search", "Web search via search engine API"),
  tool("ToolSearch", "search", "Discover deferred tools by keyword or name"),
  tool("LSP", "search", "Language Server Protocol queries — go-to-definition, references"),

  tool("Agent", "agents", "Spawn sub-agents for complex, multi-step tasks"),
  tool("SendMessage", "agents", "Send messages between agents for coordination"),
  tool("TeamCreate", "agents", "Create named agent teams for parallel work"),
  tool("TeamDelete", "agents", "Clean up agent teams"),
  tool("TaskCreate", "agents", "Create structured tasks for tracking progress"),
  tool("TaskUpdate", "agents", "Update task status, dependencies, and metadata"),
  tool("TaskGet", "agents", "Retrieve task details by ID"),
  tool("TaskList", "agents", "List all tasks with optional filters"),
  tool("TaskStop", "agents", "Stop a running background task"),
  tool("TaskOutput", "agents", "Read output from background tasks"),

  tool("EnterPlanMode", "planning", "Switch to plan mode — require plan review before execution"),
  tool("ExitPlanMode", "planning", "Exit plan mode and resume normal execution"),
  tool("EnterWorktree", "planning", "Create an isolated git worktree for safe experimentation"),
  tool("ExitWorktree", "planning", "Leave the worktree and return to main workspace"),

  tool("MCPTool", "mcp", "Invoke tools from connected MCP servers"),
  tool("ListMcpResources", "mcp", "List available resources from MCP servers"),
  tool("ReadMcpResource", "mcp", "Read a specific resource from an MCP server"),
  tool("McpAuth", "mcp", "Authenticate with an MCP server via OAuth"),

  tool("AskUserQuestion", "system", "Prompt the user for input or clarification"),
  tool("Skill", "system", "Execute a registered skill (workflow template)"),
  tool("Brief", "system", "Generate a brief summary of the conversation", true, "KAIROS feature flag"),
  tool("SyntheticOutput", "system", "Generate structured output in a specific format"),
  tool("Sleep", "system", "Wait for a specified duration in proactive mode", true, "PROACTIVE feature flag"),
  tool("CronCreate", "system", "Create scheduled triggers for recurring tasks", true, "AGENT_TRIGGERS flag"),
  tool("CronDelete", "system", "Delete a scheduled trigger", true, "AGENT_TRIGGERS flag"),
  tool("CronList", "system", "List all scheduled triggers", true, "AGENT_TRIGGERS flag"),
  tool("RemoteTrigger", "system", "Trigger a remote agent execution", true, "AGENT_TRIGGERS_REMOTE flag"),
  tool("TodoWrite", "system", "Write structured todo items for task tracking"),
  tool("Monitor", "system", "Monitor system resources and processes", true, "MONITOR_TOOL flag"),
];

export function getToolsByCategory(category: ToolCategory): ToolItem[] {
  return toolsCatalog.filter((t) => t.category === category);
}

export const toolCategories: ToolCategory[] = [
  "file-ops", "execution", "search", "agents", "planning", "mcp", "system",
];
