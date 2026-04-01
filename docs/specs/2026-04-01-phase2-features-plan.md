# Phase 2 Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four new features: Tool Catalog page, Command Explorer page, Pipeline Playback Controls, and Architecture SVG Treemap view.

**Architecture:** Each feature is a new page or component addition to the existing Next.js 15 static site. Tool Catalog and Command Explorer share a generic `CatalogGrid` component. Playback Controls layer onto the existing scroll-driven pipeline. The Treemap is an alternative view within the Architecture page. No new dependencies — d3 treemap layout is implemented as a ~100-line utility.

**Tech Stack:** Next.js 15, React 19, Framer Motion 11, Tailwind CSS 4, Shiki (existing)

---

## File Map

```
src/
  app/
    tools/page.tsx                     Tool Catalog page
    commands/page.tsx                  Command Explorer page
  components/
    catalog/
      CatalogGrid.tsx                  Shared filterable grid component
      CatalogCard.tsx                  Individual tool/command card
      CatalogDetail.tsx                Detail overlay panel
      CategoryFilter.tsx               Category tab filter bar
    pipeline/
      PlaybackControls.tsx             Play/pause/speed/prev/next controls
      PipelineView.tsx                 (modify) Add playback mode toggle
    architecture/
      TreemapView.tsx                  SVG treemap visualization
      TreemapRect.tsx                  Individual treemap rectangle
      ViewToggle.tsx                   Grid/Treemap view switcher
      ArchitectureView.tsx             (modify) Add view toggle
  data/
    tools-catalog.ts                   Tool catalog data (42+ tools)
    commands-catalog.ts                Command catalog data (95+ commands)
    treemap-data.ts                    Directory size data for treemap
    types.ts                           (modify) Add CatalogItem, ToolCategory, CommandCategory types
  lib/
    usePlayback.ts                     Playback state machine hook
    treemapLayout.ts                   Squarified treemap layout algorithm
  components/shared/
    NavBar.tsx                         (modify) Add Tools + Commands links
```

---

### Task 1: Shared Types and CatalogItem Data Model

**Files:**
- Modify: `src/data/types.ts`

- [ ] **Step 1: Add catalog types to types.ts**

Add these types to the end of `src/data/types.ts`:

```typescript
export type ToolCategory =
  | "file-ops"
  | "execution"
  | "search"
  | "agents"
  | "planning"
  | "mcp"
  | "system";

export type CommandCategory =
  | "setup-config"
  | "git-code"
  | "session"
  | "navigation"
  | "development"
  | "debugging"
  | "ui";

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
```

- [ ] **Step 2: Verify types compile**

Run: `cd /Users/khan/journey-through-claude-code && npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/data/types.ts
git commit -m "feat: add CatalogItem types and category color/label constants"
```

---

### Task 2: Tool Catalog Data

**Files:**
- Create: `src/data/tools-catalog.ts`

- [ ] **Step 1: Create the tool catalog data file**

Create `src/data/tools-catalog.ts`:

```typescript
import type { CatalogItem, ToolCategory } from "./types";
import { TOOL_CATEGORY_COLORS } from "./types";

type ToolItem = CatalogItem & { category: ToolCategory };

function tool(name: string, category: ToolCategory, description: string, featureGated?: boolean, gateReason?: string): ToolItem {
  return { name, category, color: TOOL_CATEGORY_COLORS[category], description, featureGated, gateReason };
}

export const toolsCatalog: ToolItem[] = [
  // File Operations
  tool("FileRead", "file-ops", "Read files, images, PDFs, and Jupyter notebooks"),
  tool("FileEdit", "file-ops", "Partial file modification via exact string replacement"),
  tool("FileWrite", "file-ops", "Create new files or completely rewrite existing ones"),
  tool("Glob", "file-ops", "Fast file pattern matching (e.g., **/*.ts)"),
  tool("Grep", "file-ops", "Content search powered by ripgrep with regex support"),
  tool("NotebookEdit", "file-ops", "Edit Jupyter notebook cells"),

  // Execution
  tool("Bash", "execution", "Shell command execution with security analysis and sandboxing"),
  tool("PowerShell", "execution", "PowerShell command execution on Windows"),
  tool("REPL", "execution", "Interactive REPL for code evaluation", true, "Internal only (ant)"),

  // Search & Fetch
  tool("WebFetch", "search", "Fetch and extract content from URLs"),
  tool("WebSearch", "search", "Web search via search engine API"),
  tool("ToolSearch", "search", "Discover deferred tools by keyword or name"),
  tool("LSP", "search", "Language Server Protocol queries — go-to-definition, references"),

  // Agents & Tasks
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

  // Planning
  tool("EnterPlanMode", "planning", "Switch to plan mode — require plan review before execution"),
  tool("ExitPlanMode", "planning", "Exit plan mode and resume normal execution"),
  tool("EnterWorktree", "planning", "Create an isolated git worktree for safe experimentation"),
  tool("ExitWorktree", "planning", "Leave the worktree and return to main workspace"),

  // MCP
  tool("MCPTool", "mcp", "Invoke tools from connected MCP servers"),
  tool("ListMcpResources", "mcp", "List available resources from MCP servers"),
  tool("ReadMcpResource", "mcp", "Read a specific resource from an MCP server"),
  tool("McpAuth", "mcp", "Authenticate with an MCP server via OAuth"),

  // System
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
```

- [ ] **Step 2: Verify compile**

Run: `cd /Users/khan/journey-through-claude-code && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/data/tools-catalog.ts
git commit -m "feat: add tool catalog data — 42 tools across 7 categories"
```

---

### Task 3: Command Catalog Data

**Files:**
- Create: `src/data/commands-catalog.ts`

- [ ] **Step 1: Create the command catalog data file**

Create `src/data/commands-catalog.ts`:

```typescript
import type { CatalogItem, CommandCategory } from "./types";
import { COMMAND_CATEGORY_COLORS } from "./types";

type CommandItem = CatalogItem & { category: CommandCategory };

function cmd(name: string, category: CommandCategory, description: string, featureGated?: boolean, gateReason?: string): CommandItem {
  return { name: `/${name}`, category, color: COMMAND_CATEGORY_COLORS[category], description, featureGated, gateReason };
}

export const commandsCatalog: CommandItem[] = [
  // Setup & Config
  cmd("login", "setup-config", "Authenticate with Anthropic or a third-party API provider"),
  cmd("logout", "setup-config", "Sign out of the current session"),
  cmd("config", "setup-config", "View or modify Claude Code settings"),
  cmd("doctor", "setup-config", "Run environment diagnostics and check for issues"),
  cmd("install-github-app", "setup-config", "Install the Claude Code GitHub App"),
  cmd("install-slack-app", "setup-config", "Install the Claude Code Slack App"),
  cmd("mcp", "setup-config", "Manage MCP server connections"),
  cmd("permissions", "setup-config", "View and manage tool permission rules"),
  cmd("onboarding", "setup-config", "Re-run the onboarding flow"),
  cmd("terminalSetup", "setup-config", "Configure terminal integration (iTerm2, etc.)"),
  cmd("model", "setup-config", "View or switch the active model"),
  cmd("upgrade", "setup-config", "Check for and install Claude Code updates"),

  // Git & Code
  cmd("commit", "git-code", "Create a git commit with AI-generated message"),
  cmd("diff", "git-code", "View changes in the working directory"),
  cmd("review", "git-code", "AI-powered code review of changes"),
  cmd("pr_comments", "git-code", "View and respond to PR review comments"),
  cmd("commit-push-pr", "git-code", "Commit, push, and create a PR in one step"),
  cmd("branch", "git-code", "Create or switch git branches"),
  cmd("rewind", "git-code", "Undo recent changes by rewinding git history"),
  cmd("init", "git-code", "Generate a CLAUDE.md for the current project"),
  cmd("add-dir", "git-code", "Add additional directories to the context"),

  // Session
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

  // Navigation
  cmd("context", "navigation", "Visualize the current context window"),
  cmd("files", "navigation", "List files in the conversation context"),
  cmd("cost", "navigation", "View token usage and cost for this session"),
  cmd("usage", "navigation", "View detailed API usage statistics"),
  cmd("status", "navigation", "Show Claude Code status and environment info"),
  cmd("help", "navigation", "Show available commands and help"),
  cmd("version", "navigation", "Show Claude Code version"),

  // Development
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

  // Debugging
  cmd("feedback", "debugging", "Send feedback about Claude Code"),
  cmd("stats", "debugging", "View session statistics"),
  cmd("release-notes", "debugging", "View recent release notes"),
  cmd("env", "debugging", "Show environment variables and detection"),

  // UI & Display
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
```

- [ ] **Step 2: Verify compile**

Run: `cd /Users/khan/journey-through-claude-code && npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/data/commands-catalog.ts
git commit -m "feat: add command catalog data — 70+ commands across 7 categories"
```

---

### Task 4: Generic CatalogGrid Component

**Files:**
- Create: `src/components/catalog/CategoryFilter.tsx`
- Create: `src/components/catalog/CatalogCard.tsx`
- Create: `src/components/catalog/CatalogDetail.tsx`
- Create: `src/components/catalog/CatalogGrid.tsx`

- [ ] **Step 1: Create CategoryFilter**

Create `src/components/catalog/CategoryFilter.tsx`:

```tsx
"use client";

type Props = {
  categories: { key: string; label: string; color: string; count: number }[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({ categories, activeCategory, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
          activeCategory === null
            ? "bg-terminal-green/20 text-terminal-green border border-terminal-green/40"
            : "bg-bg-surface text-text-muted border border-border hover:text-text-secondary"
        }`}
      >
        All ({categories.reduce((sum, c) => sum + c.count, 0)})
      </button>
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(activeCategory === cat.key ? null : cat.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border ${
            activeCategory === cat.key ? "opacity-100" : "opacity-60 hover:opacity-80"
          }`}
          style={{
            borderColor: activeCategory === cat.key ? cat.color : `${cat.color}40`,
            backgroundColor: activeCategory === cat.key ? `${cat.color}15` : "transparent",
            color: cat.color,
          }}
        >
          {cat.label} ({cat.count})
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create CatalogCard**

Create `src/components/catalog/CatalogCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { CatalogItem } from "@/data/types";

type Props = {
  item: CatalogItem;
  onClick: () => void;
};

export function CatalogCard({ item, onClick }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-colors ${
        item.featureGated
          ? "border-dashed opacity-60 hover:opacity-80"
          : "hover:brightness-110"
      }`}
      style={{
        borderColor: `${item.color}25`,
        backgroundColor: `${item.color}08`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium truncate" style={{ color: item.color }}>
          {item.name}
        </span>
        {item.featureGated && <span className="text-xs opacity-70 shrink-0">gated</span>}
      </div>
      <p className="text-xs text-text-muted mt-1 line-clamp-2">{item.description}</p>
    </motion.button>
  );
}
```

- [ ] **Step 3: Create CatalogDetail**

Create `src/components/catalog/CatalogDetail.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { CatalogItem } from "@/data/types";

type Props = {
  item: CatalogItem;
  onClose: () => void;
};

export function CatalogDetail({ item, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-xl border border-border bg-bg-elevated p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold font-mono" style={{ color: item.color }}>
              {item.name}
            </h3>
            {item.featureGated && (
              <span className="text-xs font-mono text-terminal-amber bg-terminal-amber/10 px-2 py-0.5 rounded mt-1 inline-block">
                {item.gateReason ?? "Feature-gated"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors font-mono text-sm"
          >
            [esc]
          </button>
        </div>
        <p className="text-text-secondary leading-relaxed">{item.description}</p>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Create CatalogGrid**

Create `src/components/catalog/CatalogGrid.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { CatalogItem } from "@/data/types";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { CategoryFilter } from "./CategoryFilter";
import { CatalogCard } from "./CatalogCard";
import { CatalogDetail } from "./CatalogDetail";

type Props = {
  title: string;
  subtitle: string;
  command: string;
  items: CatalogItem[];
  categories: { key: string; label: string; color: string }[];
};

export function CatalogGrid({ title, subtitle, command, items, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: items.filter((item) => item.category === cat.key).length,
  }));

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <SectionHeader command={command} />
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl">{subtitle}</p>

        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item) => (
            <CatalogCard
              key={item.name}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-text-muted mt-6 font-mono">
          Click any item to see details
        </p>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <CatalogDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 5: Verify compile**

Run: `cd /Users/khan/journey-through-claude-code && npx tsc --noEmit`

- [ ] **Step 6: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/components/catalog/
git commit -m "feat: add generic CatalogGrid component with filters, cards, and detail modal"
```

---

### Task 5: Tool Catalog Page and Command Explorer Page

**Files:**
- Create: `src/app/tools/page.tsx`
- Create: `src/app/commands/page.tsx`
- Modify: `src/components/shared/NavBar.tsx`

- [ ] **Step 1: Create tools page**

Create `src/app/tools/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { toolsCatalog, toolCategories } from "@/data/tools-catalog";
import { TOOL_CATEGORY_LABELS, TOOL_CATEGORY_COLORS } from "@/data/types";

export const metadata: Metadata = {
  title: "Tool Catalog | Journey Through Claude Code",
  description: "All 42+ tools that give Claude Code the ability to act — read files, run commands, spawn agents, and more.",
};

export default function ToolsPage() {
  const categories = toolCategories.map((key) => ({
    key,
    label: TOOL_CATEGORY_LABELS[key],
    color: TOOL_CATEGORY_COLORS[key],
  }));

  return (
    <CatalogGrid
      title="Tool Catalog"
      subtitle="Every tool Claude Code can invoke — from file operations to agent swarms."
      command='list --tools --all --categorized'
      items={toolsCatalog}
      categories={categories}
    />
  );
}
```

- [ ] **Step 2: Create commands page**

Create `src/app/commands/page.tsx`:

```tsx
import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { commandsCatalog, commandCategories } from "@/data/commands-catalog";
import { COMMAND_CATEGORY_LABELS, COMMAND_CATEGORY_COLORS } from "@/data/types";

export const metadata: Metadata = {
  title: "Command Explorer | Journey Through Claude Code",
  description: "Every slash command available in Claude Code — from /commit to /vim, organized by category.",
};

export default function CommandsPage() {
  const categories = commandCategories.map((key) => ({
    key,
    label: COMMAND_CATEGORY_LABELS[key],
    color: COMMAND_CATEGORY_COLORS[key],
  }));

  return (
    <CatalogGrid
      title="Command Explorer"
      subtitle="Every slash command available in Claude Code, sorted by what it does."
      command='help --commands --all'
      items={commandsCatalog}
      categories={categories}
    />
  );
}
```

- [ ] **Step 3: Update NavBar with new links**

Replace `src/components/shared/NavBar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/follow-a-prompt", label: "Follow a Prompt" },
  { href: "/architecture", label: "Architecture" },
  { href: "/tools", label: "Tools" },
  { href: "/commands", label: "Commands" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        <Link href="/" className="font-mono text-sm text-terminal-green shrink-0">
          ~/claude-code
        </Link>
        <div className="flex gap-4 md:gap-6 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors whitespace-nowrap ${
                pathname === link.href
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd /Users/khan/journey-through-claude-code && npm run build`

Expected: Build succeeds with `/tools` and `/commands` routes in output.

- [ ] **Step 5: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/app/tools/ src/app/commands/ src/components/shared/NavBar.tsx
git commit -m "feat: add Tool Catalog and Command Explorer pages with nav links"
```

---

### Task 6: Pipeline Playback Controls

**Files:**
- Create: `src/lib/usePlayback.ts`
- Create: `src/components/pipeline/PlaybackControls.tsx`
- Modify: `src/components/pipeline/PipelineView.tsx`

- [ ] **Step 1: Create playback hook**

Create `src/lib/usePlayback.ts`:

```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type PlaybackState = "idle" | "playing" | "paused";
type Speed = 0.5 | 1 | 2;

export function usePlayback(
  totalStages: number,
  onStageChange: (stage: number) => void
) {
  const [state, setState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState<Speed>(1);
  const [currentStage, setCurrentStage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    setState("playing");
  }, []);

  const pause = useCallback(() => {
    setState("paused");
    clearTimer();
  }, [clearTimer]);

  const togglePlayPause = useCallback(() => {
    setState((prev) => (prev === "playing" ? "paused" : "playing"));
    if (state === "playing") clearTimer();
  }, [state, clearTimer]);

  const next = useCallback(() => {
    setCurrentStage((prev) => {
      const nextStage = Math.min(prev + 1, totalStages - 1);
      onStageChange(nextStage);
      return nextStage;
    });
  }, [totalStages, onStageChange]);

  const prev = useCallback(() => {
    setCurrentStage((prev) => {
      const prevStage = Math.max(prev - 1, 0);
      onStageChange(prevStage);
      return prevStage;
    });
  }, [onStageChange]);

  const goTo = useCallback(
    (stage: number) => {
      setCurrentStage(stage);
      onStageChange(stage);
    },
    [onStageChange]
  );

  // Auto-advance when playing
  useEffect(() => {
    if (state !== "playing") return;

    const intervalMs = 3000 / speed;
    intervalRef.current = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= totalStages - 1) {
          setState("paused");
          clearTimer();
          return prev;
        }
        const nextStage = prev + 1;
        onStageChange(nextStage);
        return nextStage;
      });
    }, intervalMs);

    return clearTimer;
  }, [state, speed, totalStages, onStageChange, clearTimer]);

  return {
    state,
    speed,
    currentStage,
    play,
    pause,
    togglePlayPause,
    next,
    prev,
    goTo,
    setSpeed,
  };
}
```

- [ ] **Step 2: Create PlaybackControls component**

Create `src/components/pipeline/PlaybackControls.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

type Speed = 0.5 | 1 | 2;

type Props = {
  isPlaying: boolean;
  speed: Speed;
  currentStage: number;
  totalStages: number;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeedChange: (speed: Speed) => void;
};

const speeds: Speed[] = [0.5, 1, 2];

export function PlaybackControls({
  isPlaying,
  speed,
  currentStage,
  totalStages,
  onTogglePlay,
  onPrev,
  onNext,
  onSpeedChange,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-6 z-30 flex justify-center"
    >
      <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-bg-elevated/95 backdrop-blur-md shadow-lg">
        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={currentStage === 0}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors font-mono text-sm"
        >
          {"<<"}
        </button>

        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-terminal-green/40 bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={currentStage >= totalStages - 1}
          className="text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors font-mono text-sm"
        >
          {">>"}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Stage counter */}
        <span className="text-xs font-mono text-text-muted">
          {currentStage + 1}/{totalStages}
        </span>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Speed */}
        <div className="flex gap-1">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                speed === s
                  ? "bg-terminal-green/20 text-terminal-green"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Integrate playback into PipelineView**

Modify `src/components/pipeline/PipelineView.tsx`. The key changes:
- Add a "mode" toggle (scroll vs playback) at the top of the page
- Import and use `usePlayback` hook
- When in playback mode, show `PlaybackControls` and auto-scroll to stages
- When user scrolls during playback, pause automatically

Replace the entire file with:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { GridBackground } from "../shared/GridBackground";
import { PipelineSidebar } from "./PipelineSidebar";
import { StageContent } from "./StageContent";
import { BranchSelector } from "./BranchSelector";
import { ScenarioPath } from "./ScenarioPath";
import { PostScenario } from "./PostScenario";
import { PlaybackControls } from "./PlaybackControls";
import { useScrollStage } from "@/lib/useScrollStage";
import { usePlayback } from "@/lib/usePlayback";
import { sharedStages, scenarioStages } from "@/data/stages";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS } from "@/data/types";

type Mode = "scroll" | "playback";

export function PipelineView() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [mode, setMode] = useState<Mode>("scroll");

  const currentStages = selectedScenario
    ? [...sharedStages, ...scenarioStages[selectedScenario]]
    : sharedStages;

  const { activeStage, progress, setStageRef } = useScrollStage(currentStages.length);

  const scrollToStage = useCallback((stage: number) => {
    const stageEls = document.querySelectorAll("[data-stage-index]");
    const target = stageEls[stage] as HTMLElement | undefined;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const playback = usePlayback(currentStages.length, scrollToStage);

  // Pause playback on user scroll
  useEffect(() => {
    if (mode !== "playback" || playback.state !== "playing") return;
    const handleWheel = () => playback.pause();
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [mode, playback]);

  const effectiveActiveStage = mode === "playback" ? playback.currentStage : activeStage;
  const scenarioColor = selectedScenario ? SCENARIO_COLORS[selectedScenario] : undefined;

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      {/* Mode toggle */}
      <div className="sticky top-14 z-30 bg-bg/90 backdrop-blur-sm border-b border-border px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            {(["scroll", "playback"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  mode === m
                    ? "bg-terminal-green/20 text-terminal-green"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {m === "scroll" ? "Scroll" : "Autoplay"}
              </button>
            ))}
          </div>
          {/* Mobile progress bar */}
          <div className="lg:hidden flex items-center gap-3 flex-1 ml-4">
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(mode === "playback" ? (playback.currentStage + 1) / currentStages.length : progress) * 100}%`,
                  backgroundColor: scenarioColor ?? "var(--color-terminal-green)",
                }}
              />
            </div>
            <span className="text-xs font-mono text-text-muted">
              {effectiveActiveStage + 1}/{currentStages.length}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          <div className="flex-1 max-w-3xl">
            {sharedStages.map((stage, i) => (
              <div key={stage.id} data-stage-index={i}>
                <StageContent stage={stage} isActive={effectiveActiveStage === i} stageRef={setStageRef(i)} />
              </div>
            ))}
            <BranchSelector selectedScenario={selectedScenario} onSelect={setSelectedScenario} />
            {selectedScenario && (
              <ScenarioPath
                stages={scenarioStages[selectedScenario]}
                activeStage={effectiveActiveStage}
                stageOffset={sharedStages.length}
                setStageRef={setStageRef}
              />
            )}
            {selectedScenario && (
              <PostScenario currentScenario={selectedScenario} onSelect={setSelectedScenario} />
            )}
          </div>
          <PipelineSidebar
            stages={currentStages.map((s) => ({ id: s.id, title: s.title }))}
            activeStage={effectiveActiveStage}
            progress={mode === "playback" ? (playback.currentStage + 1) / currentStages.length : progress}
            scenarioColor={scenarioColor}
          />
        </div>
      </div>

      {/* Playback controls */}
      {mode === "playback" && (
        <PlaybackControls
          isPlaying={playback.state === "playing"}
          speed={playback.speed}
          currentStage={playback.currentStage}
          totalStages={currentStages.length}
          onTogglePlay={playback.togglePlayPause}
          onPrev={playback.prev}
          onNext={playback.next}
          onSpeedChange={playback.setSpeed}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add data-stage-index to ScenarioPath stages**

Modify `src/components/pipeline/ScenarioPath.tsx`:

```tsx
"use client";

import type { PipelineStage } from "@/data/types";
import { StageContent } from "./StageContent";

type Props = {
  stages: PipelineStage[];
  activeStage: number;
  stageOffset: number;
  setStageRef: (index: number) => (el: HTMLDivElement | null) => void;
};

export function ScenarioPath({ stages, activeStage, stageOffset, setStageRef }: Props) {
  return (
    <div>
      {stages.map((stage, i) => (
        <div key={stage.id} data-stage-index={stageOffset + i}>
          <StageContent
            stage={stage}
            isActive={activeStage === stageOffset + i}
            stageRef={setStageRef(stageOffset + i)}
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `cd /Users/khan/journey-through-claude-code && npm run build`

- [ ] **Step 6: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/lib/usePlayback.ts src/components/pipeline/PlaybackControls.tsx src/components/pipeline/PipelineView.tsx src/components/pipeline/ScenarioPath.tsx
git commit -m "feat: add playback controls to Journey 1 — autoplay with speed selector"
```

---

### Task 7: Architecture SVG Treemap

**Files:**
- Create: `src/lib/treemapLayout.ts`
- Create: `src/data/treemap-data.ts`
- Create: `src/components/architecture/TreemapView.tsx`
- Create: `src/components/architecture/TreemapRect.tsx`
- Create: `src/components/architecture/ViewToggle.tsx`
- Modify: `src/components/architecture/ArchitectureView.tsx`

- [ ] **Step 1: Create squarified treemap layout algorithm**

Create `src/lib/treemapLayout.ts`:

```typescript
export type TreemapNode = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
  children?: TreemapNode[];
};

export type TreemapRect = {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function computeTreemap(
  nodes: TreemapNode[],
  width: number,
  height: number
): TreemapRect[] {
  const total = nodes.reduce((sum, n) => sum + n.value, 0);
  if (total === 0 || nodes.length === 0) return [];

  const sorted = [...nodes].sort((a, b) => b.value - a.value);
  return squarify(sorted, { x: 0, y: 0, width, height }, total);
}

type Rect = { x: number; y: number; width: number; height: number };

function squarify(
  nodes: TreemapNode[],
  bounds: Rect,
  total: number
): TreemapRect[] {
  if (nodes.length === 0) return [];
  if (nodes.length === 1) {
    return [{ ...nodes[0], ...bounds }];
  }

  const results: TreemapRect[] = [];
  let remaining = [...nodes];
  let currentBounds = { ...bounds };
  let remainingTotal = total;

  while (remaining.length > 0) {
    const isWide = currentBounds.width >= currentBounds.height;
    const side = isWide ? currentBounds.height : currentBounds.width;

    // Find the best row
    const row: TreemapNode[] = [];
    let rowSum = 0;
    let bestWorst = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = [...row, remaining[i]];
      const candidateSum = rowSum + remaining[i].value;
      const worst = worstAspectRatio(candidate, candidateSum, side, remainingTotal, currentBounds);

      if (worst <= bestWorst) {
        row.push(remaining[i]);
        rowSum = candidateSum;
        bestWorst = worst;
      } else {
        break;
      }
    }

    // Layout the row
    const rowFraction = rowSum / remainingTotal;
    const rowSize = isWide
      ? currentBounds.width * rowFraction
      : currentBounds.height * rowFraction;

    let offset = 0;
    for (const node of row) {
      const nodeFraction = node.value / rowSum;
      const nodeSize = side * nodeFraction;

      const rect: TreemapRect = isWide
        ? {
            ...node,
            x: currentBounds.x,
            y: currentBounds.y + offset,
            width: rowSize,
            height: nodeSize,
          }
        : {
            ...node,
            x: currentBounds.x + offset,
            y: currentBounds.y,
            width: nodeSize,
            height: rowSize,
          };

      results.push(rect);
      offset += nodeSize;
    }

    // Update bounds
    if (isWide) {
      currentBounds = {
        x: currentBounds.x + rowSize,
        y: currentBounds.y,
        width: currentBounds.width - rowSize,
        height: currentBounds.height,
      };
    } else {
      currentBounds = {
        x: currentBounds.x,
        y: currentBounds.y + rowSize,
        width: currentBounds.width,
        height: currentBounds.height - rowSize,
      };
    }

    remaining = remaining.slice(row.length);
    remainingTotal -= rowSum;
  }

  return results;
}

function worstAspectRatio(
  row: TreemapNode[],
  rowSum: number,
  side: number,
  total: number,
  bounds: Rect
): number {
  const isWide = bounds.width >= bounds.height;
  const rowFraction = rowSum / total;
  const rowSize = isWide ? bounds.width * rowFraction : bounds.height * rowFraction;

  let worst = 0;
  for (const node of row) {
    const nodeSize = side * (node.value / rowSum);
    const aspect = rowSize > nodeSize
      ? rowSize / nodeSize
      : nodeSize / rowSize;
    worst = Math.max(worst, aspect);
  }
  return worst;
}
```

- [ ] **Step 2: Create treemap data**

Create `src/data/treemap-data.ts`:

```typescript
import type { TreemapNode } from "@/lib/treemapLayout";

export const treemapData: TreemapNode[] = [
  { id: "utils", label: "utils/", value: 564, color: "#8A8580", description: "Shared utility modules — 564 files" },
  { id: "components", label: "components/", value: 389, color: "#7B9EB8", description: "React Ink terminal UI components — 389 files" },
  { id: "commands", label: "commands/", value: 189, color: "#6BA368", description: "95 CLI slash command handlers — 189 files" },
  { id: "tools", label: "tools/", value: 184, color: "#D4A853", description: "42 built-in tool implementations — 184 files" },
  { id: "services", label: "services/", value: 130, color: "#C17B5E", description: "API, MCP, compaction, streaming — 130 files" },
  { id: "hooks", label: "hooks/", value: 104, color: "#7B9EB8", description: "React hooks for terminal UI — 104 files" },
  { id: "ink", label: "ink/", value: 96, color: "#7B9EB8", description: "Ink framework extensions — 96 files" },
  { id: "bridge", label: "bridge/", value: 31, color: "#9BBEC7", description: "IDE bridge (VS Code, JetBrains) — 31 files" },
  { id: "constants", label: "constants/", value: 21, color: "#8A8580", description: "Config constants, feature flags — 21 files" },
  { id: "skills", label: "skills/", value: 20, color: "#B8A9C9", description: "Loadable prompt skill modules — 20 files" },
  { id: "cli", label: "cli/", value: 19, color: "#C17B5E", description: "stdin/stdout, NDJSON, remote IO — 19 files" },
  { id: "keybindings", label: "keybindings/", value: 14, color: "#8A8580", description: "Keyboard shortcuts, Vim mode — 14 files" },
  { id: "tasks", label: "tasks/", value: 12, color: "#6BA368", description: "Background task management — 12 files" },
  { id: "types", label: "types/", value: 11, color: "#8A8580", description: "TypeScript type definitions — 11 files" },
  { id: "migrations", label: "migrations/", value: 11, color: "#8A8580", description: "Config migration scripts — 11 files" },
  { id: "context", label: "context/", value: 9, color: "#B8A9C9", description: "CLAUDE.md, tools, memory — 9 files" },
  { id: "memdir", label: "memdir/", value: 8, color: "#B8A9C9", description: "Persistent memory — 8 files" },
  { id: "entrypoints", label: "entrypoints/", value: 8, color: "#C17B5E", description: "CLI bootstrap — 8 files" },
  { id: "state", label: "state/", value: 6, color: "#7B9EB8", description: "Global state stores — 6 files" },
  { id: "buddy", label: "buddy/", value: 6, color: "#9B7CB8", description: "AI companion pet easter egg — 6 files" },
  { id: "vim", label: "vim/", value: 5, color: "#8A8580", description: "Vim mode modal editing — 5 files" },
  { id: "remote", label: "remote/", value: 4, color: "#9BBEC7", description: "Remote session management — 4 files" },
  { id: "query", label: "query/", value: 4, color: "#C17B5E", description: "Query processing pipeline — 4 files" },
  { id: "server", label: "server/", value: 3, color: "#C17B5E", description: "HTTP/WebSocket server — 3 files" },
  { id: "screens", label: "screens/", value: 3, color: "#7B9EB8", description: "Full-screen terminal views — 3 files" },
  { id: "plugins", label: "plugins/", value: 2, color: "#B8A9C9", description: "External extension loading — 2 files" },
  { id: "voice", label: "voice/", value: 1, color: "#9B7CB8", description: "Voice mode input — 1 file" },
  { id: "coordinator", label: "coordinator/", value: 1, color: "#6BA368", description: "Multi-agent mode — 1 file" },
];
```

- [ ] **Step 3: Create TreemapRect component**

Create `src/components/architecture/TreemapRect.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { TreemapRect as TreemapRectType } from "@/lib/treemapLayout";

type Props = {
  rect: TreemapRectType;
  onClick: () => void;
  isSelected: boolean;
};

export function TreemapRect({ rect, onClick, isSelected }: Props) {
  const showLabel = rect.width > 60 && rect.height > 30;
  const showValue = rect.width > 80 && rect.height > 45;

  return (
    <motion.g
      onClick={onClick}
      className="cursor-pointer"
      whileHover={{ opacity: 0.9 }}
    >
      <rect
        x={rect.x + 1}
        y={rect.y + 1}
        width={Math.max(0, rect.width - 2)}
        height={Math.max(0, rect.height - 2)}
        rx={4}
        fill={`${rect.color}20`}
        stroke={isSelected ? rect.color : `${rect.color}40`}
        strokeWidth={isSelected ? 2 : 1}
        strokeDasharray={isSelected ? "none" : "none"}
      />
      {showLabel && (
        <text
          x={rect.x + 8}
          y={rect.y + 20}
          fill={rect.color}
          fontSize={12}
          fontFamily="var(--font-mono)"
          fontWeight={600}
        >
          {rect.label}
        </text>
      )}
      {showValue && (
        <text
          x={rect.x + 8}
          y={rect.y + 36}
          fill={`${rect.color}99`}
          fontSize={10}
          fontFamily="var(--font-mono)"
        >
          {rect.value} files
        </text>
      )}
    </motion.g>
  );
}
```

- [ ] **Step 4: Create TreemapView**

Create `src/components/architecture/TreemapView.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { computeTreemap } from "@/lib/treemapLayout";
import { treemapData } from "@/data/treemap-data";
import { TreemapRect } from "./TreemapRect";

const TREEMAP_WIDTH = 900;
const TREEMAP_HEIGHT = 500;

export function TreemapView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rects = useMemo(
    () => computeTreemap(treemapData, TREEMAP_WIDTH, TREEMAP_HEIGHT),
    []
  );

  const selectedRect = rects.find((r) => r.id === selectedId);

  return (
    <div>
      <svg
        viewBox={`0 0 ${TREEMAP_WIDTH} ${TREEMAP_HEIGHT}`}
        className="w-full h-auto rounded-lg border border-border bg-bg-elevated"
      >
        {rects.map((rect) => (
          <TreemapRect
            key={rect.id}
            rect={rect}
            onClick={() => setSelectedId(selectedId === rect.id ? null : rect.id)}
            isSelected={selectedId === rect.id}
          />
        ))}
      </svg>
      {selectedRect && (
        <div className="mt-4 p-4 rounded-lg border border-border bg-bg-surface">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: selectedRect.color }} />
            <span className="font-mono font-bold" style={{ color: selectedRect.color }}>
              src/{selectedRect.label}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{selectedRect.description}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create ViewToggle**

Create `src/components/architecture/ViewToggle.tsx`:

```tsx
"use client";

type Props = {
  view: "grid" | "treemap";
  onChange: (view: "grid" | "treemap") => void;
};

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange("grid")}
        className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
          view === "grid"
            ? "bg-terminal-green/20 text-terminal-green"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Zoom Explorer
      </button>
      <button
        onClick={() => onChange("treemap")}
        className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
          view === "treemap"
            ? "bg-terminal-green/20 text-terminal-green"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Size Treemap
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Integrate treemap into ArchitectureView**

Read and modify `src/components/architecture/ArchitectureView.tsx` to add the view toggle. Import `ViewToggle` and `TreemapView`, add a `view` state, and conditionally render either the existing zoom explorer or the treemap:

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { Minimap } from "./Minimap";
import { NodeDiagram } from "./NodeDiagram";
import { NodeDetail } from "./NodeDetail";
import { ViewToggle } from "./ViewToggle";
import { TreemapView } from "./TreemapView";
import { useZoom } from "@/lib/useZoom";

export function ArchitectureView() {
  const [view, setView] = useState<"grid" | "treemap">("grid");
  const { path, visibleNodes, selectedNode, selectedNodeId, zoomIn, zoomTo, setSelectedNodeId } = useZoom();

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionHeader
          command={
            view === "treemap"
              ? "du --treemap --src"
              : `explore --depth ${path.length} ${path.length > 0 ? `--system "${path[path.length - 1].title}"` : ""}`
          }
        />

        <ViewToggle view={view} onChange={setView} />

        {view === "treemap" ? (
          <TreemapView />
        ) : (
          <>
            <Breadcrumbs path={path} onNavigate={zoomTo} />
            <div className="flex gap-8">
              <div className="flex-1">
                <NodeDiagram nodes={visibleNodes} selectedNodeId={selectedNodeId} onNodeClick={zoomIn} />
              </div>
              <AnimatePresence>
                {selectedNode && (
                  <div className="w-[450px] shrink-0">
                    <NodeDetail node={selectedNode} onClose={() => setSelectedNodeId(null)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
      {view === "grid" && <Minimap path={path} onNavigate={zoomTo} />}
    </div>
  );
}
```

- [ ] **Step 7: Verify build**

Run: `cd /Users/khan/journey-through-claude-code && npm run build`

Expected: Build succeeds, all routes including `/architecture` work.

- [ ] **Step 8: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/lib/treemapLayout.ts src/data/treemap-data.ts src/components/architecture/TreemapView.tsx src/components/architecture/TreemapRect.tsx src/components/architecture/ViewToggle.tsx src/components/architecture/ArchitectureView.tsx
git commit -m "feat: add SVG treemap view to architecture explorer — zero dependencies"
```

---

### Task 8: Final Push and Deploy

**Files:** None new.

- [ ] **Step 1: Verify full build**

Run: `cd /Users/khan/journey-through-claude-code && npm run build`

Expected: Build succeeds with all routes: `/`, `/follow-a-prompt`, `/architecture`, `/tools`, `/commands`.

- [ ] **Step 2: Push and deploy**

```bash
cd /Users/khan/journey-through-claude-code
git push origin main
```

Expected: GitHub Actions deploys automatically.

---

## Self-Review

**Spec coverage:**
- [x] Tool Catalog page (Tasks 1-2, 4-5)
- [x] Command Explorer page (Tasks 1, 3-5)
- [x] Shared CatalogGrid component (Task 4)
- [x] Category filtering with colors (Task 4)
- [x] Feature-gated indicators with lock styling (Task 2, 3 — data)
- [x] Detail modal on click (Task 4 — CatalogDetail)
- [x] Playback controls (Task 6)
- [x] Speed selector 0.5x/1x/2x (Task 6)
- [x] Auto-pause on scroll (Task 6)
- [x] SVG Treemap (Task 7)
- [x] Custom layout algorithm, no d3 dependency (Task 7)
- [x] View toggle between grid and treemap (Task 7)
- [x] NavBar updated with new pages (Task 5)
- [x] Per-page metadata (Task 5)

**Placeholder scan:** No TBDs or TODOs found.

**Type consistency:** `CatalogItem`, `ToolCategory`, `CommandCategory` used consistently. `TreemapNode`/`TreemapRect` types match between layout utility and components. `usePlayback` hook interface matches `PlaybackControls` props.
