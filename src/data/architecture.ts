import { snippets } from "./snippets";
import type { ArchitectureNode } from "./types";

export const architectureNodes: ArchitectureNode[] = [
  // ── Level 0 ────────────────────────────────────────
  {
    id: "cli-entry",
    level: 0,
    title: "CLI Entry & Bootstrap",
    description:
      "The startup sequence from binary launch to ready-to-accept-input. Optimized to feel instant — parallelizes subprocess spawns, defers heavy modules, and fast-paths simple commands like --version.",
    sourceFiles: [
      {
        path: "src/entrypoints/cli.tsx",
        snippet: snippets.startupPrefetch,
      },
    ],
    interestingDetails: [
      "Fast-path: --version exits with zero imports beyond cli.tsx",
      "MDM, keychain, and GrowthBook prefetch run in parallel before heavy module evaluation (~135ms)",
      "Bun's bundler inlines MACRO.VERSION at build time",
    ],
    childIds: [
      "cli-bootstrap",
      "cli-commander",
      "cli-init",
      "cli-setup",
      "cli-prefetch",
      "dce-feature-flags",
    ],
    dataFlow: {
      inputs: ["process.argv", "environment variables", "config files"],
      outputs: ["initialized session", "parsed CLI options"],
    },
  },
  {
    id: "context-config",
    level: 0,
    title: "Context & Configuration",
    description:
      "Gathers everything the model needs to know about your project, preferences, and environment. Runs before every API call to build an accurate, up-to-date system prompt.",
    sourceFiles: [
      { path: "src/context.ts", snippet: snippets.contextAssembly },
    ],
    interestingDetails: [
      "Git commands run in parallel via Promise.all — 5 subprocesses at once",
      "CLAUDE.md files are loaded from multiple directories: project root, parents, home",
      "Memory files are filtered for relevance based on current context",
    ],
    childIds: [
      "ctx-git",
      "ctx-claudemd",
      "ctx-memory",
      "ctx-remote-settings",
      "ctx-policy",
      "ctx-schemas",
    ],
    dataFlow: {
      inputs: ["git repo state", "config files", "memory files"],
      outputs: ["system prompt parts", "user context"],
    },
  },
  {
    id: "query-engine",
    level: 0,
    title: "Query Engine",
    description:
      "The brain of Claude Code. Sends messages to the Anthropic API, processes streaming responses, manages the tool call loop, and handles context compression when conversations get long.",
    sourceFiles: [
      { path: "src/QueryEngine.ts", snippet: snippets.queryEngine },
    ],
    interestingDetails: [
      "The tool loop is essentially a while(true) — it keeps calling the API until the model stops requesting tools",
      "Auto-compact triggers when token usage exceeds 70% of context window",
      "Cost tracking happens per-turn with model-specific pricing",
    ],
    childIds: [
      "qe-core",
      "qe-api-client",
      "qe-compact",
      "qe-cost",
      "qe-analytics",
    ],
    dataFlow: {
      inputs: ["user message", "system prompt", "tool definitions"],
      outputs: ["assistant response", "tool calls", "usage metrics"],
    },
  },
  {
    id: "tool-system",
    level: 0,
    title: "Tool System",
    description:
      "40+ tools that give Claude the ability to act — read files, write code, run commands, search the web, spawn sub-agents, and more. Every tool goes through a permission check before execution.",
    sourceFiles: [
      { path: "src/tools.ts", snippet: snippets.toolRegistry },
    ],
    interestingDetails: [
      "Tools are .tsx files — they include React components for rendering their progress and results in the terminal",
      "The permission system has 4 modes: default (ask), plan (ask + review), bypass (allow all), auto (allow safe)",
      "MCP tools from external servers are added to the same registry — the model can't tell them apart from built-in tools",
    ],
    childIds: [
      "tool-registry",
      "tool-permissions",
      "tool-bash",
      "tool-file-ops",
      "tool-search",
      "tool-agents",
      "tool-mcp",
      "tool-lsp",
    ],
    dataFlow: {
      inputs: ["tool_use blocks from model", "permission rules"],
      outputs: [
        "tool_result blocks back to model",
        "side effects (file changes, commands)",
      ],
    },
  },
  {
    id: "ui-renderer",
    level: 0,
    title: "UI Renderer",
    description:
      "A full React application running in your terminal via Ink. Manages the REPL loop, renders markdown, shows diffs, displays agent progress, handles keyboard shortcuts, and bridges to IDEs.",
    sourceFiles: [],
    interestingDetails: [
      "Yes, it's React — with hooks, context, state management, the whole thing, in a terminal",
      "Components are compiled with React Compiler for automatic memoization",
      "The bridge system lets VS Code and JetBrains extensions control Claude Code sessions via JWT-authenticated messages",
    ],
    childIds: [
      "ui-components",
      "ui-repl",
      "ui-state",
      "ui-keybindings",
      "ui-bridge",
    ],
    dataFlow: {
      inputs: ["app state changes", "streaming tokens", "tool progress"],
      outputs: ["terminal output", "IDE bridge messages"],
    },
  },

  // ── Level 1: CLI Entry ──────────────────────────────
  {
    id: "cli-bootstrap",
    level: 1,
    parentId: "cli-entry",
    title: "Bootstrap (cli.tsx)",
    description:
      "The very first code that runs. Fast-paths --version with zero imports. For everything else, loads the startup profiler and hands off to main.tsx.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["process.argv"],
      outputs: ["fast-path exit OR main.tsx handoff"],
    },
  },
  {
    id: "cli-commander",
    level: 1,
    parentId: "cli-entry",
    title: "CLI Parser (main.tsx)",
    description:
      "4,700-line Commander.js setup. Parses flags, validates arguments, resolves model selection, configures permission modes.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["parsed argv"],
      outputs: ["CLI options object", "selected command"],
    },
  },
  {
    id: "cli-init",
    level: 1,
    parentId: "cli-entry",
    title: "Initialization (init.ts)",
    description:
      "Core setup: config validation, TLS certificate loading, proxy configuration, telemetry initialization, graceful shutdown handlers.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["config files", "environment"],
      outputs: ["initialized subsystems"],
    },
  },
  {
    id: "cli-setup",
    level: 1,
    parentId: "cli-entry",
    title: "Session Setup (setup.ts)",
    description:
      "Per-session setup: finds git root, initializes session memory, loads project config, saves worktree state.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["working directory", "git state"],
      outputs: ["session ID", "project root", "session memory"],
    },
  },
  {
    id: "cli-prefetch",
    level: 1,
    parentId: "cli-entry",
    title: "Parallel Prefetch",
    description:
      "The secret to Claude Code's fast startup. Before heavy module evaluation even begins, three subprocess spawns fire in parallel: MDM settings, macOS keychain reads, and GrowthBook feature flag initialization. Saves ~65-135ms on every start.",
    sourceFiles: [
      { path: "src/main.tsx", snippet: snippets.startupPrefetch },
    ],
    interestingDetails: [
      "Uses import-then-immediately-call pattern to fire side effects before other imports evaluate",
      "Keychain reads are normally sequential (~65ms) — prefetch makes them parallel",
    ],
    dataFlow: {
      inputs: ["macOS keychain", "MDM plist", "GrowthBook API"],
      outputs: ["cached credentials", "MDM settings", "feature flags"],
    },
  },

  // ── Level 1: Context & Configuration ────────────────
  {
    id: "ctx-git",
    level: 1,
    parentId: "context-config",
    title: "Git Context",
    description:
      "Parallel subprocess calls to gather branch, default branch, status (--short), log (last 5 commits), and user name.",
    sourceFiles: [
      { path: "src/context.ts", snippet: snippets.contextAssembly },
    ],
    dataFlow: {
      inputs: ["git repo"],
      outputs: ["formatted git status string"],
    },
  },
  {
    id: "ctx-claudemd",
    level: 1,
    parentId: "context-config",
    title: "CLAUDE.md Loading",
    description:
      "Searches for CLAUDE.md files in the project root, parent directories, and home directory. Each file's content is included in the system prompt.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["filesystem search"],
      outputs: ["array of CLAUDE.md contents"],
    },
  },
  {
    id: "ctx-memory",
    level: 1,
    parentId: "context-config",
    title: "Memory System (memdir/)",
    description:
      "Persistent memory stored in ~/.claude/. Memory files are filtered for relevance to the current context. Supports user memories, project memories, feedback, and references.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["~/.claude/ memory files", "current context"],
      outputs: ["relevant memory prompt"],
    },
  },
  {
    id: "ctx-remote-settings",
    level: 1,
    parentId: "context-config",
    title: "Remote Managed Settings",
    description:
      "Organization-level settings pushed remotely. Controls features, model access, and behavior for managed deployments.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["remote API"],
      outputs: ["merged settings"],
    },
  },
  {
    id: "ctx-policy",
    level: 1,
    parentId: "context-config",
    title: "Policy Limits",
    description:
      "Organization policy enforcement — rate limits, allowed models, feature access.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["policy API"],
      outputs: ["policy rules"],
    },
  },
  {
    id: "ctx-schemas",
    level: 1,
    parentId: "context-config",
    title: "Config Schemas & Migrations",
    description:
      "Zod schemas validate all configuration. Migration scripts handle version upgrades — renaming models, moving settings, updating defaults.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["raw config JSON"],
      outputs: ["validated, migrated config"],
    },
  },

  // ── Level 1: Query Engine ───────────────────────────
  {
    id: "qe-core",
    level: 1,
    parentId: "query-engine",
    title: "Query Pipeline (query.ts)",
    description:
      "The orchestrator. Manages the conversation loop: assemble context, call API, check for tools, execute tools, loop.",
    sourceFiles: [
      { path: "src/query.ts", snippet: snippets.toolCallLoop },
    ],
    dataFlow: {
      inputs: ["user message", "conversation history"],
      outputs: ["complete assistant turn"],
    },
  },
  {
    id: "qe-api-client",
    level: 1,
    parentId: "query-engine",
    title: "API Client (services/api/)",
    description:
      "Wraps the Anthropic SDK. Handles streaming, retry with exponential backoff, error classification, and prompt-too-long recovery.",
    sourceFiles: [
      { path: "src/services/api/claude.ts", snippet: snippets.apiCall },
    ],
    dataFlow: {
      inputs: ["messages", "tools", "system prompt"],
      outputs: ["streaming response"],
    },
  },
  {
    id: "qe-compact",
    level: 1,
    parentId: "query-engine",
    title: "Auto-Compact",
    description:
      "When token usage exceeds 70% of the context window, auto-compact triggers. It summarizes older messages, preserving recent context. At 90%, it forces compaction.",
    sourceFiles: [
      {
        path: "src/services/compact/autoCompact.ts",
        snippet: snippets.autoCompact,
      },
    ],
    interestingDetails: [
      "70% = warning (suggest compact), 90% = critical (force compact)",
      "Compact preserves the most recent messages and summarizes older ones",
      "Can be disabled via DISABLE_AUTO_COMPACT env var",
    ],
    dataFlow: {
      inputs: ["token usage ratio", "message history"],
      outputs: ["compacted message history"],
    },
  },
  {
    id: "qe-cost",
    level: 1,
    parentId: "query-engine",
    title: "Cost Tracking",
    description:
      "Tracks input/output tokens and dollar cost per turn and per session. Model-specific pricing.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["API usage headers"],
      outputs: ["accumulated cost metrics"],
    },
  },
  {
    id: "qe-analytics",
    level: 1,
    parentId: "query-engine",
    title: "Feature Flags (GrowthBook)",
    description:
      "GrowthBook-based feature flag system. Controls rollout of new features, A/B tests, and kill switches.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["GrowthBook API"],
      outputs: ["feature flag values"],
    },
  },

  // ── Level 1: Tool System ────────────────────────────
  {
    id: "tool-registry",
    level: 1,
    parentId: "tool-system",
    title: "Tool Registry (tools.ts)",
    description:
      "Assembles the full list of available tools. Built-in tools are always present. Feature-gated tools are conditionally included via bun:bundle DCE.",
    sourceFiles: [
      { path: "src/tools.ts", snippet: snippets.toolRegistry },
    ],
    dataFlow: {
      inputs: ["feature flags", "MCP connections", "agent config"],
      outputs: ["Tool[] array for API call"],
    },
  },
  {
    id: "tool-permissions",
    level: 1,
    parentId: "tool-system",
    title: "Permission Pipeline",
    description:
      "Every tool call passes through permission checking before execution. Supports multiple modes, user-configured rules, and interactive prompting.",
    sourceFiles: [
      {
        path: "src/hooks/useCanUseTool.tsx",
        snippet: snippets.permissionCheck,
      },
    ],
    interestingDetails: [
      'Four modes: default (ask user), plan (ask + require plan review), bypass (allow all), auto (allow safe operations)',
      "Users can configure allow/deny rules per tool and per pattern in settings.json",
      "Denial tracking prevents the model from retrying denied operations",
    ],
    childIds: ["perm-modes", "perm-rules", "perm-denial-tracking"],
    dataFlow: {
      inputs: ["tool name", "tool input", "permission mode", "rules"],
      outputs: ["allowed/denied decision"],
    },
  },
  {
    id: "tool-bash",
    level: 1,
    parentId: "tool-system",
    title: "BashTool",
    description:
      "Shell command execution with security analysis, sandboxing, and progress display.",
    sourceFiles: [
      {
        path: "src/tools/BashTool/BashTool.tsx",
        snippet: snippets.bashTool,
      },
    ],
    childIds: ["bash-security", "bash-sandbox"],
    dataFlow: {
      inputs: ["command string", "timeout", "working directory"],
      outputs: ["stdout", "stderr", "exit code"],
    },
  },
  {
    id: "tool-file-ops",
    level: 1,
    parentId: "tool-system",
    title: "File Operations",
    description:
      "FileReadTool, FileEditTool, FileWriteTool, GlobTool, GrepTool. The core tools for code manipulation. FileEditTool uses string replacement (not line numbers) for reliability.",
    sourceFiles: [
      {
        path: "src/tools/FileEditTool/FileEditTool.tsx",
        snippet: snippets.fileEditTool,
      },
    ],
    dataFlow: {
      inputs: ["file paths", "content", "patterns"],
      outputs: [
        "file contents",
        "search results",
        "edit confirmations",
      ],
    },
  },
  {
    id: "tool-search",
    level: 1,
    parentId: "tool-system",
    title: "Search Tools",
    description:
      "GlobTool for file pattern matching, GrepTool wrapping ripgrep for content search, WebSearchTool and WebFetchTool for web access.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["patterns", "queries", "URLs"],
      outputs: ["matching files", "search results", "web content"],
    },
  },
  {
    id: "tool-agents",
    level: 1,
    parentId: "tool-system",
    title: "Agent System",
    description:
      "AgentTool spawns sub-agents for complex tasks. TeamCreateTool enables parallel agent teams. SendMessageTool allows inter-agent communication.",
    sourceFiles: [
      {
        path: "src/tools/AgentTool/forkSubagent.ts",
        snippet: snippets.agentSpawn,
      },
    ],
    childIds: ["agent-lifecycle", "agent-teams"],
    dataFlow: {
      inputs: ["prompt", "agent type", "parent context"],
      outputs: ["agent result", "side effects"],
    },
  },
  {
    id: "tool-mcp",
    level: 1,
    parentId: "tool-system",
    title: "MCP Integration",
    description:
      "Model Context Protocol servers extend Claude Code with external tools and resources. Connections are managed, tools are loaded into the registry.",
    sourceFiles: [
      {
        path: "src/services/mcp/client.ts",
        snippet: snippets.mcpIntegration,
      },
    ],
    dataFlow: {
      inputs: ["MCP server configs"],
      outputs: ["external tools", "external resources"],
    },
  },
  {
    id: "tool-lsp",
    level: 1,
    parentId: "tool-system",
    title: "LSP Integration",
    description:
      "Language Server Protocol integration for code intelligence — go-to-definition, find references, diagnostics.",
    sourceFiles: [],
    featureGated: true,
    dataFlow: {
      inputs: ["code locations", "queries"],
      outputs: ["definitions", "references", "diagnostics"],
    },
  },

  // ── Level 1: UI Renderer ────────────────────────────
  {
    id: "ui-components",
    level: 1,
    parentId: "ui-renderer",
    title: "Components (140+)",
    description:
      "React/Ink components for every UI element: message rendering, diff display, agent progress, permission dialogs, onboarding flows.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["app state", "props"],
      outputs: ["terminal output"],
    },
  },
  {
    id: "ui-repl",
    level: 1,
    parentId: "ui-renderer",
    title: "REPL Screen",
    description:
      "The main interactive loop. Renders the conversation, handles user input, manages the query lifecycle.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["user input", "streaming responses"],
      outputs: ["rendered conversation"],
    },
  },
  {
    id: "ui-state",
    level: 1,
    parentId: "ui-renderer",
    title: "State Management",
    description:
      "External store pattern with React context. AppStateStore holds conversation state, tool progress, permission decisions.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["state mutations"],
      outputs: ["React re-renders"],
    },
  },
  {
    id: "ui-keybindings",
    level: 1,
    parentId: "ui-renderer",
    title: "Keybindings",
    description:
      "Configurable keyboard shortcuts. Supports chord bindings. User-customizable via ~/.claude/keybindings.json. Vim mode available.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["keypress events", "keybinding config"],
      outputs: ["command execution"],
    },
  },
  {
    id: "ui-bridge",
    level: 1,
    parentId: "ui-renderer",
    title: "IDE Bridge",
    description:
      "Bidirectional communication with VS Code and JetBrains extensions. JWT-authenticated messages.",
    sourceFiles: [
      {
        path: "src/bridge/bridgeMessaging.ts",
        snippet: snippets.bridgeProtocol,
      },
    ],
    interestingDetails: [
      "JWT ensures only the paired IDE can control the session",
      "Supports permission callbacks — the IDE can approve/deny tool calls",
    ],
    featureGated: true,
    dataFlow: {
      inputs: ["IDE messages", "CLI events"],
      outputs: ["synchronized state", "permission decisions"],
    },
  },

  // ── Level 2: Priority detail views ──────────────────
  {
    id: "perm-modes",
    level: 2,
    parentId: "tool-permissions",
    title: "Permission Modes",
    description:
      "Four modes control how permissions are resolved: 'default' prompts for every sensitive action; 'plan' requires a reviewed plan before execution; 'bypassPermissions' allows everything; 'auto' allows read-only and safe operations automatically.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["CLI --permission-mode flag or config"],
      outputs: ["mode-specific permission behavior"],
    },
  },
  {
    id: "perm-rules",
    level: 2,
    parentId: "tool-permissions",
    title: "Permission Rules",
    description:
      "User-configured allow/deny rules in settings.json. Rules match by tool name and input patterns. Wildcard patterns supported.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["settings.json rules", "tool name", "tool input"],
      outputs: ["allow/deny/no-match"],
    },
  },
  {
    id: "perm-denial-tracking",
    level: 2,
    parentId: "tool-permissions",
    title: "Denial Tracking",
    description:
      "Tracks which tools the user has denied to prevent the model from retrying the same action.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["user denial"],
      outputs: ["denial record sent to model"],
    },
  },
  {
    id: "bash-security",
    level: 2,
    parentId: "tool-bash",
    title: "Security Analysis",
    description:
      "AST-based parsing of shell commands. Splits compound commands, detects sudo, destructive rm patterns, dangerous git operations.",
    sourceFiles: [
      {
        path: "src/utils/bash/ast.ts",
        snippet: snippets.bashSecurityParse,
      },
    ],
    dataFlow: {
      inputs: ["raw command string"],
      outputs: ["SecurityAnalysis with risk flags"],
    },
  },
  {
    id: "bash-sandbox",
    level: 2,
    parentId: "tool-bash",
    title: "Sandbox Decision",
    description:
      "Determines whether a command should run in a sandboxed environment. Restricts filesystem and network access.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["command", "sandbox config"],
      outputs: ["sandbox boolean"],
    },
  },
  {
    id: "agent-lifecycle",
    level: 2,
    parentId: "tool-agents",
    title: "Agent Lifecycle",
    description:
      "Fork: create isolated context with memory snapshot and color assignment. Run: execute the agent's own query loop. Complete: collect results and return to parent.",
    sourceFiles: [
      {
        path: "src/tools/AgentTool/forkSubagent.ts",
        snippet: snippets.agentSpawn,
      },
    ],
    dataFlow: {
      inputs: ["prompt", "parent context snapshot"],
      outputs: ["agent result text"],
    },
  },
  {
    id: "agent-teams",
    level: 2,
    parentId: "tool-agents",
    title: "Team Agents",
    description:
      "TeamCreateTool spawns named agent teams that run in parallel. Each team member gets an independent context. SendMessageTool enables inter-agent messaging.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["team config", "member prompts"],
      outputs: ["parallel results", "inter-agent messages"],
    },
  },
  {
    id: "dce-feature-flags",
    level: 2,
    parentId: "cli-entry",
    title: "Dead Code Elimination",
    description:
      "Bun's bundler uses feature() gates to strip entire code paths at build time. Features like VOICE_MODE, PROACTIVE, COORDINATOR_MODE, and KAIROS are compiled out of external builds entirely.",
    sourceFiles: [{ path: "src/commands.ts", snippet: snippets.featureFlags }],
    featureGated: true,
    dataFlow: {
      inputs: ["bun:bundle feature flags"],
      outputs: ["stripped binary"],
    },
  },
];

export function getNodeById(id: string): ArchitectureNode | undefined {
  return architectureNodes.find((n) => n.id === id);
}

export function getChildNodes(parentId: string): ArchitectureNode[] {
  return architectureNodes.filter((n) => n.parentId === parentId);
}

export function getLevel0Nodes(): ArchitectureNode[] {
  return architectureNodes.filter((n) => n.level === 0);
}
