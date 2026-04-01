import type { CatalogItem, CommandCategory } from "./types";
import { COMMAND_CATEGORY_COLORS } from "./types";

type CommandItem = CatalogItem & { category: CommandCategory };

function cmd(name: string, category: CommandCategory, description: string, featureGated?: boolean, gateReason?: string): CommandItem {
  return { name: `/${name}`, category, color: COMMAND_CATEGORY_COLORS[category], description, featureGated, gateReason };
}

export const commandsCatalog: CommandItem[] = [
  cmd("login", "setup-config", "Authenticate with Anthropic or a third-party API provider"),
  cmd("logout", "setup-config", "Sign out of the current session"),
  cmd("config", "setup-config", "View or modify Claude Code settings"),
  cmd("doctor", "setup-config", "Run environment diagnostics and check for issues"),
  cmd("install-github-app", "setup-config", "Install the Claude Code GitHub App"),
  cmd("install-slack-app", "setup-config", "Install the Claude Code Slack App"),
  cmd("mcp", "setup-config", "Manage MCP server connections"),
  cmd("permissions", "setup-config", "View and manage tool permission rules"),
  cmd("onboarding", "setup-config", "Re-run the onboarding flow"),
  cmd("terminalSetup", "setup-config", "Configure terminal integration"),
  cmd("model", "setup-config", "View or switch the active model"),
  cmd("upgrade", "setup-config", "Check for and install Claude Code updates"),

  cmd("commit", "git-code", "Create a git commit with AI-generated message"),
  cmd("diff", "git-code", "View changes in the working directory"),
  cmd("review", "git-code", "AI-powered code review of changes"),
  cmd("pr_comments", "git-code", "View and respond to PR review comments"),
  cmd("commit-push-pr", "git-code", "Commit, push, and create a PR in one step"),
  cmd("branch", "git-code", "Create or switch git branches"),
  cmd("rewind", "git-code", "Undo recent changes by rewinding git history"),
  cmd("init", "git-code", "Generate a CLAUDE.md for the current project"),
  cmd("add-dir", "git-code", "Add additional directories to the context"),

  cmd("resume", "session", "Restore a previous conversation session"),
  cmd("compact", "session", "Compress conversation context to save tokens"),
  cmd("share", "session", "Share the current session via a link"),
  cmd("export", "session", "Export conversation as a file"),
  cmd("session", "session", "View or manage session metadata"),
  cmd("rename", "session", "Rename the current session"),
  cmd("copy", "session", "Copy the last response to clipboard"),
  cmd("memory", "session", "View and manage persistent memory files"),
  cmd("desktop", "session", "Hand off the session to Claude Desktop"),
  cmd("mobile", "session", "Hand off the session to Claude mobile app"),
  cmd("teleport", "session", "Teleport a session between machines"),

  cmd("context", "navigation", "Visualize the current context window"),
  cmd("files", "navigation", "List files in the conversation context"),
  cmd("cost", "navigation", "View token usage and cost for this session"),
  cmd("usage", "navigation", "View detailed API usage statistics"),
  cmd("status", "navigation", "Show Claude Code status and environment info"),
  cmd("help", "navigation", "Show available commands and help"),
  cmd("version", "navigation", "Show Claude Code version"),

  cmd("skills", "development", "Browse and manage available skills"),
  cmd("tasks", "development", "View and manage the task list"),
  cmd("plan", "development", "Enter plan mode for structured work"),
  cmd("issue", "development", "Create or view GitHub issues"),
  cmd("bughunter", "development", "Systematic bug hunting mode"),
  cmd("security-review", "development", "AI-powered security review of the codebase"),
  cmd("autofix-pr", "development", "Auto-fix issues found in PR review"),
  cmd("plugin", "development", "Manage Claude Code plugins"),
  cmd("ide", "development", "Open or connect to an IDE"),
  cmd("hooks", "development", "View and manage lifecycle hooks"),

  cmd("feedback", "debugging", "Send feedback about Claude Code"),
  cmd("stats", "debugging", "View session statistics"),
  cmd("release-notes", "debugging", "View recent release notes"),
  cmd("env", "debugging", "Show environment variables and detection"),

  cmd("theme", "ui", "Change the terminal color theme"),
  cmd("color", "ui", "Change accent colors"),
  cmd("vim", "ui", "Toggle vim keybinding mode"),
  cmd("keybindings", "ui", "View and customize keyboard shortcuts"),
  cmd("clear", "ui", "Clear the terminal screen"),
  cmd("fast", "ui", "Toggle fast mode for quicker responses"),
  cmd("effort", "ui", "Set the thinking effort level"),
  cmd("output-style", "ui", "Change output formatting style"),
  cmd("stickers", "ui", "Fun sticker/emoji reactions"),
  cmd("voice", "ui", "Toggle voice input mode", true, "VOICE_MODE flag"),
];

export function getCommandsByCategory(category: CommandCategory): CommandItem[] {
  return commandsCatalog.filter((c) => c.category === category);
}

export const commandCategories: CommandCategory[] = [
  "setup-config", "git-code", "session", "navigation", "development", "debugging", "ui",
];
