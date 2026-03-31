# Journey Through Claude Code — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static website that visualizes Claude Code's internal architecture through two interactive journeys — a scroll-driven prompt trace and a fractal zoom architecture explorer.

**Architecture:** Next.js App Router with static export. Content is baked into TypeScript data files. Framer Motion handles all animations (scroll-triggered, layout transitions, hover states). Shiki provides build-time syntax highlighting for code panels. Tailwind CSS for styling with a dark terminal theme.

**Tech Stack:** Next.js 15, React 19, Framer Motion 11, Tailwind CSS 4, Shiki, TypeScript

---

## File Map

```
journey-through-claude-code/
  src/
    app/
      layout.tsx                    Root layout (fonts, metadata, theme)
      page.tsx                      Landing page
      follow-a-prompt/
        page.tsx                    Journey 1 page
      architecture/
        page.tsx                    Journey 2 page
      globals.css                   Tailwind + custom theme styles
    components/
      landing/
        Hero.tsx                    Typing animation hero
        JourneyCard.tsx             Clickable journey selector card
      pipeline/
        PipelineView.tsx            Journey 1 main layout (sidebar + content)
        PipelineSidebar.tsx         Fixed right-side pipeline diagram
        StageContent.tsx            Left-side explanatory content per stage
        BranchSelector.tsx          Scenario fork UI
        ScenarioPath.tsx            Individual scenario stage sequence
        GlowingDot.tsx              Animated prompt packet with particle trail
        PostScenario.tsx            "Try another path?" prompt
      architecture/
        ArchitectureView.tsx        Journey 2 main layout
        NodeDiagram.tsx             Box-and-arrow diagram for any level
        NodeBox.tsx                 Individual clickable system box
        NodeDetail.tsx              Content panel when a node is selected
        Breadcrumbs.tsx             Zoom path navigation
        Minimap.tsx                 Corner minimap widget
        ConnectionArrows.tsx        SVG arrows between nodes
      shared/
        TerminalWindow.tsx          Terminal chrome wrapper (title bar, etc.)
        CodePanel.tsx               Collapsible syntax-highlighted code viewer
        SectionHeader.tsx           Terminal-command-styled section header
        GridBackground.tsx          Subtle grid background pattern
        CrtOverlay.tsx              Faint CRT scanline overlay
        FadeIn.tsx                  Reusable scroll-triggered fade animation
        NavBar.tsx                  Top navigation between journeys
    data/
      types.ts                      PipelineStage, ArchitectureNode types
      stages.ts                     Journey 1 shared + scenario stage data
      architecture.ts               Journey 2 node tree data
      snippets.ts                   Code snippet strings (inline, no files)
    lib/
      useScrollStage.ts             Hook: tracks scroll position -> active stage
      useZoom.ts                    Hook: zoom state management for Journey 2
      highlights.ts                 Shiki highlighting at build time
    public/
      fonts/
        JetBrainsMono-Regular.woff2
        JetBrainsMono-Bold.woff2
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm
```

Expected: Project scaffolded with Next.js, Tailwind, TypeScript.

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npm install framer-motion shiki react-intersection-observer
```

Expected: Dependencies installed successfully.

- [ ] **Step 3: Configure static export**

Replace `next.config.ts` with:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 4: Set up the dark terminal theme in globals.css**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0f;
  --color-bg-elevated: #12121a;
  --color-bg-surface: #1a1a25;
  --color-text-primary: #e0e0e8;
  --color-text-secondary: #8888a0;
  --color-text-muted: #55556a;
  --color-terminal-green: #4afa82;
  --color-terminal-amber: #f0c050;
  --color-accent-blue: #4a9afa;
  --color-accent-purple: #a855f7;
  --color-accent-orange: #f97316;
  --color-accent-red: #ef4444;
  --color-border: #2a2a3a;
  --color-glow: #4afa8233;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

::selection {
  background-color: var(--color-terminal-green);
  color: var(--color-bg);
}
```

- [ ] **Step 5: Set up root layout with fonts**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Journey Through Claude Code",
  description:
    "An interactive exploration of Claude Code's architecture — trace a prompt through every system, or zoom into each layer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Create placeholder landing page**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-terminal-green font-mono">
        Journey Through Claude Code
      </h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify dev server runs**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npm run dev -- --port 3033
```

Expected: Server starts at `http://localhost:3033`, page shows green title text on dark background.

- [ ] **Step 8: Verify static export works**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npm run build
```

Expected: Build succeeds, `out/` directory created with static files.

- [ ] **Step 9: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add .
git commit -m "feat: scaffold Next.js project with dark terminal theme"
```

---

### Task 2: Shared Components — Grid Background, Terminal Window, Section Header

**Files:**
- Create: `src/components/shared/GridBackground.tsx`
- Create: `src/components/shared/TerminalWindow.tsx`
- Create: `src/components/shared/SectionHeader.tsx`
- Create: `src/components/shared/FadeIn.tsx`
- Create: `src/components/shared/CrtOverlay.tsx`
- Create: `src/components/shared/NavBar.tsx`

- [ ] **Step 1: Create GridBackground**

Create `src/components/shared/GridBackground.tsx`:

```tsx
export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create TerminalWindow**

Create `src/components/shared/TerminalWindow.tsx`:

```tsx
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
            {isOpen ? "▼" : "▶"}
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
```

- [ ] **Step 3: Create SectionHeader**

Create `src/components/shared/SectionHeader.tsx`:

```tsx
type Props = {
  command: string;
};

export function SectionHeader({ command }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-terminal-green font-mono">$</span>
      <span className="font-mono text-text-secondary">{command}</span>
      <span className="text-terminal-green font-mono animate-pulse">▊</span>
    </div>
  );
}
```

- [ ] **Step 4: Create FadeIn**

Create `src/components/shared/FadeIn.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, className }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Create CrtOverlay**

Create `src/components/shared/CrtOverlay.tsx`:

```tsx
export function CrtOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        )`,
      }}
    />
  );
}
```

- [ ] **Step 6: Create NavBar**

Create `src/components/shared/NavBar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/follow-a-prompt", label: "Follow a Prompt" },
  { href: "/architecture", label: "Architecture" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        <Link href="/" className="font-mono text-sm text-terminal-green">
          ~/claude-code
        </Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
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

- [ ] **Step 7: Add NavBar to root layout**

Update `src/app/layout.tsx` — add `import { NavBar } from "@/components/shared/NavBar";` and wrap children:

```tsx
<body className="antialiased">
  <NavBar />
  <div className="pt-14">{children}</div>
</body>
```

- [ ] **Step 8: Verify all components render**

Update `src/app/page.tsx` temporarily to render all components:

```tsx
import { GridBackground } from "@/components/shared/GridBackground";
import { TerminalWindow } from "@/components/shared/TerminalWindow";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeIn } from "@/components/shared/FadeIn";
import { CrtOverlay } from "@/components/shared/CrtOverlay";

export default function Home() {
  return (
    <main className="min-h-screen p-12 relative">
      <GridBackground />
      <CrtOverlay />
      <SectionHeader command='trace --prompt "hello world"' />
      <FadeIn>
        <TerminalWindow title="src/QueryEngine.ts" collapsible>
          <pre className="text-terminal-green">
            {"const result = await query(messages);"}
          </pre>
        </TerminalWindow>
      </FadeIn>
    </main>
  );
}
```

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Expected: Grid background visible, terminal window with traffic-light dots, collapsible panel, section header with blinking cursor. All text renders in correct fonts/colors.

- [ ] **Step 9: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/components/shared/ src/app/layout.tsx src/app/page.tsx
git commit -m "feat: add shared UI components — grid, terminal window, nav, fade-in"
```

---

### Task 3: Code Panel with Syntax Highlighting

**Files:**
- Create: `src/lib/highlights.ts`
- Create: `src/components/shared/CodePanel.tsx`

- [ ] **Step 1: Create build-time Shiki highlighter**

Create `src/lib/highlights.ts`:

```typescript
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: ["typescript", "tsx"],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: "typescript" | "tsx" = "typescript"
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang,
    theme: "github-dark",
  });
}
```

- [ ] **Step 2: Create CodePanel component**

Create `src/components/shared/CodePanel.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { highlightCode } from "@/lib/highlights";

type Props = {
  filePath: string;
  code: string;
  language?: "typescript" | "tsx";
  highlightLines?: number[];
  defaultOpen?: boolean;
};

export function CodePanel({
  filePath,
  code,
  language = "typescript",
  highlightLines = [],
  defaultOpen = false,
}: Props) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    highlightCode(code, language).then(setHtml);
  }, [code, language]);

  return (
    <TerminalWindow title={filePath} collapsible defaultOpen={defaultOpen}>
      {html ? (
        <div className="relative">
          <div
            className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {highlightLines.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {highlightLines.map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 bg-terminal-green/10 border-l-2 border-terminal-green"
                  style={{
                    top: `${(line - 1) * 1.5}rem`,
                    height: "1.5rem",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <pre className="text-sm text-text-muted">
          <span className="animate-pulse">Loading...</span>
        </pre>
      )}
    </TerminalWindow>
  );
}
```

- [ ] **Step 3: Verify CodePanel renders correctly**

Temporarily update `src/app/page.tsx` to include:

```tsx
import { CodePanel } from "@/components/shared/CodePanel";

// Inside the component, add:
<CodePanel
  filePath="src/QueryEngine.ts"
  code={`export class QueryEngine {
  async query(messages: Message[]): Promise<Response> {
    const stream = await this.client.messages.create({
      model: this.model,
      messages: normalizeMessages(messages),
      stream: true,
    });
    return this.processStream(stream);
  }
}`}
  highlightLines={[3, 4, 5]}
/>
```

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Expected: Syntax-highlighted TypeScript in terminal window, lines 3-5 have green left border and green tint background.

- [ ] **Step 4: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/lib/highlights.ts src/components/shared/CodePanel.tsx src/app/page.tsx
git commit -m "feat: add CodePanel with Shiki syntax highlighting and line emphasis"
```

---

### Task 4: Data Layer — Types, Snippets, and Stage Definitions

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/snippets.ts`
- Create: `src/data/stages.ts`
- Create: `src/data/architecture.ts`

- [ ] **Step 1: Define data types**

Create `src/data/types.ts`:

```typescript
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
```

- [ ] **Step 2: Create code snippets**

Create `src/data/snippets.ts`. This file contains all source code excerpts from the Claude Code repo. Each snippet is the key 10-40 lines that show what that part of the system does:

```typescript
export const snippets = {
  earlyInput: `// utils/earlyInput.ts
// Captures keystrokes before React/Ink mounts so nothing is lost
let earlyChunks: Buffer[] = []
let capturing = false

export function seedEarlyInput(): void {
  capturing = true
  process.stdin.on('data', onData)
}

function onData(chunk: Buffer): void {
  if (capturing) earlyChunks.push(chunk)
}

export function stopCapturingEarlyInput(): Buffer[] {
  capturing = false
  process.stdin.removeListener('data', onData)
  const chunks = earlyChunks
  earlyChunks = []
  return chunks
}`,

  contextAssembly: `// context.ts — getSystemContext (simplified)
export const getGitStatus = memoize(async (): Promise<string | null> => {
  const isGit = await getIsGit()
  if (!isGit) return null

  const [branch, mainBranch, status, log, userName] = await Promise.all([
    getBranch(),
    getDefaultBranch(),
    execFileNoThrow(gitExe(), ['status', '--short']),
    execFileNoThrow(gitExe(), ['log', '--oneline', '-n', '5']),
    execFileNoThrow(gitExe(), ['config', 'user.name']),
  ])

  // Builds the gitStatus block you see in every system prompt
  return formatGitContext(branch, mainBranch, status, log, userName)
})`,

  systemPrompt: `// utils/queryContext.ts — fetchSystemPromptParts (simplified)
export async function fetchSystemPromptParts(context) {
  const parts: SystemPrompt[] = []

  // Core identity and instructions
  parts.push(asSystemPrompt(SYSTEM_PROMPT_BASE))

  // Tool-specific instructions
  parts.push(asSystemPrompt(getToolInstructions(context.tools)))

  // CLAUDE.md files (project, user, workspace)
  const claudeMds = await getClaudeMds()
  for (const md of claudeMds) {
    parts.push(asSystemPrompt(md.content))
  }

  // Memory files
  const memory = await loadMemoryPrompt()
  if (memory) parts.push(asSystemPrompt(memory))

  // Git context
  const gitStatus = await getGitStatus()
  if (gitStatus) parts.push(asSystemPrompt(gitStatus))

  return parts
}`,

  queryEngine: `// QueryEngine.ts — the main loop (simplified)
async function* runQueryLoop(
  messages: Message[],
  tools: Tools,
  systemPrompt: SystemPrompt[],
  canUseTool: CanUseToolFn,
): AsyncGenerator<StreamEvent> {
  while (true) {
    // Call the Anthropic API
    const response = yield* query(messages, tools, systemPrompt)

    // Check if the response contains tool calls
    const toolUses = response.content.filter(
      block => block.type === 'tool_use'
    )

    // No tool calls = conversation turn is complete
    if (toolUses.length === 0) break

    // Execute each tool and collect results
    for (const toolUse of toolUses) {
      const tool = findToolByName(tools, toolUse.name)
      const permission = await canUseTool(tool, toolUse.input)

      if (permission.allowed) {
        const result = await tool.execute(toolUse.input)
        messages.push(createToolResultMessage(toolUse.id, result))
      }
    }

    // Loop back — send tool results to the model for next turn
  }
}`,

  apiCall: `// services/api/claude.ts — the API call (simplified)
export async function createMessage(params: {
  model: string
  messages: Message[]
  system: SystemPrompt[]
  tools: ToolDefinition[]
  stream: true
}) {
  const client = new Anthropic({ apiKey: getApiKey() })

  return client.messages.create({
    model: params.model,
    max_tokens: getMaxTokens(params.model),
    system: params.system,
    messages: normalizeMessagesForAPI(params.messages),
    tools: params.tools.map(t => t.toAPIFormat()),
    stream: true,
    metadata: { user_id: getUserId() },
  })
}`,

  toolRegistry: `// tools.ts — getTools (simplified)
export function getTools(context: ToolUseContext): Tools {
  const tools: Tool[] = [
    BashTool, FileReadTool, FileEditTool, FileWriteTool,
    GlobTool, GrepTool, WebFetchTool, WebSearchTool,
    AgentTool, SkillTool, NotebookEditTool,
    TaskCreateTool, TaskUpdateTool, TaskGetTool, TaskListTool,
    AskUserQuestionTool, LSPTool, ToolSearchTool,
    EnterPlanModeTool, ExitPlanModeTool,
    EnterWorktreeTool, ExitWorktreeTool,
  ]

  // Feature-gated tools (DCE strips these at build time)
  if (feature('PROACTIVE')) tools.push(SleepTool)
  if (feature('AGENT_TRIGGERS')) tools.push(...cronTools)

  // Agent swarm tools (lazy-loaded to break circular deps)
  if (context.agentSwarmsEnabled) {
    tools.push(getTeamCreateTool(), getTeamDeleteTool())
    tools.push(getSendMessageTool())
  }

  return tools
}`,

  permissionCheck: `// hooks/useCanUseTool.tsx — permission resolution (simplified)
export function useCanUseTool(): CanUseToolFn {
  return async function canUseTool(
    tool: Tool,
    input: unknown,
  ): Promise<PermissionResult> {
    // Check permission mode
    const mode = getPermissionMode()

    // Bypass mode: allow everything
    if (mode === 'bypassPermissions') return { allowed: true }

    // Check tool-specific permission rules
    const toolPermission = await checkToolPermission(tool, input)
    if (toolPermission.decided) return toolPermission.result

    // Check user-configured allow/deny rules
    const ruleResult = matchPermissionRules(tool, input)
    if (ruleResult) return ruleResult

    // Default: prompt the user
    return promptUserForPermission(tool, input)
  }
}`,

  bashTool: `// tools/BashTool/BashTool.tsx — execute (simplified)
async function executeBash(input: { command: string; timeout?: number }) {
  // 1. Security: parse the command AST
  const parsed = parseForSecurity(input.command)

  // 2. Check for destructive patterns
  const warnings = checkDestructiveCommand(parsed)
  if (warnings.length > 0) {
    await showDestructiveWarning(warnings)
  }

  // 3. Decide whether to sandbox
  const useSandbox = shouldUseSandbox(input.command)

  // 4. Execute in shell
  const result = await exec(input.command, {
    timeout: input.timeout ?? DEFAULT_TIMEOUT_MS,
    sandbox: useSandbox,
  })

  // 5. Track git operations for file history
  trackGitOperations(input.command, result)

  return formatResult(result.stdout, result.stderr, result.exitCode)
}`,

  fileEditTool: `// tools/FileEditTool/FileEditTool.tsx — execute (simplified)
async function executeFileEdit(input: {
  file_path: string
  old_string: string
  new_string: string
  replace_all?: boolean
}) {
  // Read current file content
  const content = await readFile(input.file_path, 'utf-8')

  // Verify old_string exists and is unique
  const count = countOccurrences(content, input.old_string)
  if (count === 0) throw new Error('old_string not found in file')
  if (count > 1 && !input.replace_all) {
    throw new Error('old_string is not unique — use replace_all')
  }

  // Perform replacement
  const newContent = input.replace_all
    ? content.replaceAll(input.old_string, input.new_string)
    : content.replace(input.old_string, input.new_string)

  // Track in file history for undo
  await fileHistoryTrackEdit(input.file_path, content, newContent)

  // Write the file
  await writeTextContent(input.file_path, newContent)
}`,

  agentSpawn: `// tools/AgentTool/forkSubagent.ts — fork (simplified)
export async function forkSubagent(params: {
  prompt: string
  agentType?: string
  parentContext: ToolUseContext
  model?: string
}) {
  // Each agent gets a unique color for terminal display
  const color = assignAgentColor()

  // Snapshot parent memory so agent has context
  const memorySnapshot = captureMemorySnapshot(
    params.parentContext
  )

  // Create isolated tool context for the sub-agent
  const agentContext = createAgentContext({
    parentContext: params.parentContext,
    memorySnapshot,
    agentType: params.agentType,
  })

  // Run the agent's own query loop (recursive!)
  const result = await runAgent({
    prompt: params.prompt,
    context: agentContext,
    model: params.model ?? getMainLoopModel(),
    color,
  })

  return result
}`,

  autoCompact: `// services/compact/autoCompact.ts — trigger logic (simplified)
export function calculateTokenWarningState(
  usage: { input_tokens: number },
  model: string,
): TokenWarningState {
  const limit = getContextWindowSize(model)
  const ratio = usage.input_tokens / limit

  if (ratio > 0.9) return 'critical'   // > 90% — force compact
  if (ratio > 0.7) return 'warning'    // > 70% — suggest compact
  return 'ok'
}

export function isAutoCompactEnabled(): boolean {
  return !isEnvTruthy('DISABLE_AUTO_COMPACT')
    && getGlobalConfig().autoCompact !== false
}`,

  bashSecurityParse: `// utils/bash/ast.ts — security analysis (simplified)
export function parseForSecurity(command: string): SecurityAnalysis {
  const ops = splitCommandWithOperators(command)

  return {
    commands: ops.map(op => ({
      name: op.command,
      args: op.args,
      hasPipe: op.type === 'pipe',
      hasRedirect: op.type === 'redirect',
    })),
    containsSudo: ops.some(op => op.command === 'sudo'),
    containsRm: ops.some(op =>
      op.command === 'rm' && op.args.some(a => a.includes('-r'))
    ),
    modifiesGit: ops.some(op =>
      op.command === 'git' && DESTRUCTIVE_GIT_OPS.has(op.args[0])
    ),
  }
}`,

  startupPrefetch: `// main.tsx — parallel prefetch (top of file)
// These side-effects must run before all other imports:
// 1. profileCheckpoint marks entry before heavy module evaluation
// 2. startMdmRawRead fires MDM subprocesses so they run in
//    parallel with the remaining ~135ms of imports
// 3. startKeychainPrefetch fires both macOS keychain reads in
//    parallel — otherwise reads them sequentially (~65ms saved)

import { profileCheckpoint } from './utils/startupProfiler.js'
profileCheckpoint('main_tsx_entry')

import { startMdmRawRead } from './utils/settings/mdm/rawRead.js'
startMdmRawRead()

import { startKeychainPrefetch } from './utils/secureStorage/keychainPrefetch.js'
startKeychainPrefetch()

// Now the heavy imports begin (~135ms of module evaluation)
import { Command } from '@commander-js/extra-typings'
import React from 'react'
// ...`,

  featureFlags: `// Dead code elimination via bun:bundle feature flags
import { feature } from 'bun:bundle'

// At build time, feature() returns a boolean literal.
// Bun's bundler sees the dead branch and strips it entirely.
// The result: voice, proactive, coordinator code is NOT in
// the production bundle if those features are disabled.

const voiceCommand = feature('VOICE_MODE')
  ? require('./commands/voice/index.js').default
  : null

const coordinatorMode = feature('COORDINATOR_MODE')
  ? require('./coordinator/coordinatorMode.js')
  : null

// Internal-only tools gated by environment variable
const REPLTool = process.env.USER_TYPE === 'ant'
  ? require('./tools/REPLTool/REPLTool.js').REPLTool
  : null`,

  bridgeProtocol: `// bridge/bridgeMessaging.ts — message protocol (simplified)
// The bridge connects IDE extensions (VS Code, JetBrains)
// to the Claude Code CLI via a bidirectional message channel

export type BridgeMessage =
  | { type: 'tool_use'; tool: string; input: unknown }
  | { type: 'tool_result'; id: string; result: unknown }
  | { type: 'permission_request'; tool: string; input: unknown }
  | { type: 'permission_response'; allowed: boolean }
  | { type: 'session_start'; sessionId: string }
  | { type: 'session_end'; sessionId: string }

// JWT-based authentication ensures only the paired IDE
// can communicate with this CLI session
export function validateBridgeToken(token: string): boolean {
  return verifyJWT(token, getBridgeSecret())
}`,

  mcpIntegration: `// services/mcp/client.ts — MCP tool loading (simplified)
export async function getMcpToolsCommandsAndResources(
  servers: McpServerConfig[]
): Promise<{ tools: Tool[]; commands: Command[] }> {
  const connections = await Promise.all(
    servers.map(server => connectToMcpServer(server))
  )

  const mcpTools = connections.flatMap(conn =>
    conn.tools.map(tool => createMCPTool(tool, conn))
  )

  // MCP tools are added to the same tool registry as built-in
  // tools — the model doesn't know the difference
  return { tools: mcpTools, commands: [] }
}`,

  toolCallLoop: `// query.ts — the tool execution loop (simplified)
// This is the heart of Claude Code: the loop that lets the
// model call tools and see results, repeatedly

for (const toolUse of toolUses) {
  const tool = findToolByName(tools, toolUse.name)

  // Run permission check
  const permission = await canUseTool(tool, toolUse)
  if (!permission.allowed) {
    // Send denial back to model so it can adjust
    messages.push(createDenialMessage(toolUse, permission))
    continue
  }

  // Execute the tool
  const result = await tool.call(toolUse.input, context)

  // Send result back to model
  messages.push(createToolResultMessage(toolUse.id, result))
}

// After all tools execute, loop back to API call
// The model sees all results and decides: respond or call more tools`,
} as const;
```

- [ ] **Step 3: Create Journey 1 stage definitions**

Create `src/data/stages.ts`:

```typescript
import { snippets } from "./snippets";
import type { PipelineStage, Scenario } from "./types";

export const sharedStages: PipelineStage[] = [
  {
    id: "input",
    title: "Keystroke & Input",
    subtitle: 'capture --stdin "your prompt here"',
    description:
      "When you type a prompt and hit Enter, Claude Code's Ink-based React UI captures the input through `BaseTextInput`. But there's a subtlety: keystrokes start being captured *before* React even mounts. The `earlyInput` system buffers everything typed during the ~200ms startup, so nothing is lost.",
    sourceFiles: [
      {
        path: "src/utils/earlyInput.ts",
        snippet: snippets.earlyInput,
        highlightLines: [4, 5, 8],
      },
    ],
  },
  {
    id: "context",
    title: "Context Assembly",
    subtitle: "context --gather --parallel",
    description:
      "Before your prompt reaches the model, Claude Code builds a rich context. It fires off *parallel* subprocesses to gather git status, branch info, and recent commits. Simultaneously, it loads every CLAUDE.md file it can find (project root, parent dirs, home directory) and any persistent memory files from `~/.claude/`. All of this runs concurrently — the `Promise.all` pattern is everywhere.",
    sourceFiles: [
      {
        path: "src/context.ts",
        snippet: snippets.contextAssembly,
        highlightLines: [5, 6, 7, 8, 9],
      },
    ],
  },
  {
    id: "system-prompt",
    title: "System Prompt Construction",
    subtitle: "prompt --build --sections 12",
    description:
      "The system prompt isn't a single string — it's assembled from a dozen sources. Core identity instructions, tool-specific guidance, CLAUDE.md content, memory files, git context, date/time, environment info, and feature-flag-dependent sections all merge into one massive prompt. This is what shapes Claude's behavior for your specific project.",
    sourceFiles: [
      {
        path: "src/utils/queryContext.ts",
        snippet: snippets.systemPrompt,
        highlightLines: [5, 8, 12, 17, 21],
      },
    ],
  },
  {
    id: "api-call",
    title: "API Call",
    subtitle: "stream --model claude-opus-4-6 --tokens 128k",
    description:
      "The assembled messages, system prompt, and tool definitions are sent to the Anthropic API as a streaming request. The `QueryEngine` handles retry logic, token counting, and cost tracking. The response streams back token by token. If the model decides to call a tool, the stream includes a `tool_use` content block — and that's where things get interesting.",
    sourceFiles: [
      {
        path: "src/services/api/claude.ts",
        snippet: snippets.apiCall,
        highlightLines: [7, 8, 9],
      },
      {
        path: "src/QueryEngine.ts",
        snippet: snippets.queryEngine,
        highlightLines: [10, 13, 14, 15, 18, 25],
      },
    ],
  },
];

export const scenarioStages: Record<Scenario, PipelineStage[]> = {
  simple: [
    {
      id: "simple-stream",
      title: "Stream Text Response",
      subtitle: "recv --stream --no-tools",
      description:
        "The simplest path: the model has everything it needs and streams back a text response. No tool calls, no permission checks. Tokens arrive one by one, rendered in real-time by Ink's React components. The response is added to the conversation history and the turn is complete.",
      sourceFiles: [],
      scenario: "simple",
    },
    {
      id: "simple-render",
      title: "Render Output",
      subtitle: "render --markdown --terminal",
      description:
        "The streamed text is rendered as markdown in the terminal via Ink components. Code blocks get syntax highlighting, links become clickable, and the output respects your terminal's width. The conversation is persisted to disk for session resume.",
      sourceFiles: [],
      scenario: "simple",
    },
  ],
  "file-edit": [
    {
      id: "edit-dispatch",
      title: "Tool Dispatch: FileEditTool",
      subtitle: "dispatch --tool FileEditTool",
      description:
        "The model's response includes a `tool_use` block requesting `FileEditTool` with three arguments: `file_path`, `old_string`, and `new_string`. The query loop in `query.ts` detects this, looks up `FileEditTool` in the tool registry, and prepares to execute it.",
      sourceFiles: [
        {
          path: "src/data/snippets.ts — toolCallLoop",
          snippet: snippets.toolCallLoop,
          highlightLines: [4, 5],
        },
      ],
      scenario: "file-edit",
    },
    {
      id: "edit-permission",
      title: "Permission Check",
      subtitle: "permission --check --mode default",
      description:
        "Before any tool executes, the permission pipeline runs. It checks the permission mode (default, plan, bypass, auto), then user-configured allow/deny rules. If no rule matches, it prompts you to approve or deny. The model never touches your files without your say-so — unless you've opted into auto mode.",
      sourceFiles: [
        {
          path: "src/hooks/useCanUseTool.tsx",
          snippet: snippets.permissionCheck,
          highlightLines: [8, 11, 14, 18],
        },
      ],
      scenario: "file-edit",
    },
    {
      id: "edit-execute",
      title: "Execute Edit",
      subtitle: "edit --replace --track-history",
      description:
        "With permission granted, `FileEditTool` reads the file, verifies `old_string` exists exactly once (unless `replace_all` is set), performs the string replacement, records the change in file history for undo capability, and writes the result. The tool result — showing what changed — is sent back to the model.",
      sourceFiles: [
        {
          path: "src/tools/FileEditTool/FileEditTool.tsx",
          snippet: snippets.fileEditTool,
          highlightLines: [8, 9, 14, 15, 22],
        },
      ],
      scenario: "file-edit",
    },
    {
      id: "edit-loop-back",
      title: "Result to Model",
      subtitle: "loop --continue --tool-result",
      description:
        "The tool result is appended to the conversation and sent back to the API. The model sees what the edit did and responds — typically with a summary of the changes. If it needs to make more edits, it returns another `tool_use` block and the loop continues.",
      sourceFiles: [],
      scenario: "file-edit",
    },
  ],
  bash: [
    {
      id: "bash-dispatch",
      title: "Tool Dispatch: BashTool",
      subtitle: "dispatch --tool BashTool",
      description:
        "The model decides to run a shell command — in this case, your test suite. It returns a `tool_use` block with `BashTool` and the command string. The tool loop dispatches it to BashTool for execution.",
      sourceFiles: [
        {
          path: "src/tools.ts",
          snippet: snippets.toolRegistry,
          highlightLines: [3],
        },
      ],
      scenario: "bash",
    },
    {
      id: "bash-security",
      title: "Security Analysis",
      subtitle: "parse --ast --check-destructive",
      description:
        "Before executing anything, BashTool parses the command through a security analyzer. It splits compound commands, checks for `sudo`, destructive `rm -rf` patterns, dangerous git operations, and other risky patterns. If something looks destructive, a warning is shown before proceeding.",
      sourceFiles: [
        {
          path: "src/utils/bash/ast.ts",
          snippet: snippets.bashSecurityParse,
          highlightLines: [4, 8, 9, 10, 13],
        },
      ],
      scenario: "bash",
    },
    {
      id: "bash-execute",
      title: "Shell Execution",
      subtitle: "exec --sandbox --timeout 120s",
      description:
        "The command runs in a shell subprocess, optionally sandboxed. Output streams back with a progress indicator that appears after 2 seconds. BashTool captures stdout, stderr, and exit code. If the command modifies files, those changes are tracked for git operation awareness.",
      sourceFiles: [
        {
          path: "src/tools/BashTool/BashTool.tsx",
          snippet: snippets.bashTool,
          highlightLines: [3, 8, 11, 14],
        },
      ],
      scenario: "bash",
    },
    {
      id: "bash-result",
      title: "Interpret Results",
      subtitle: "result --stdout --stderr --exit-code",
      description:
        "The full output (stdout, stderr, exit code) is sent back to the model as a tool result. The model reads the test output, identifies failures or successes, and responds with its analysis. If tests failed, it might suggest fixes and offer to edit the code — starting another tool call loop.",
      sourceFiles: [],
      scenario: "bash",
    },
  ],
  "agent-swarm": [
    {
      id: "swarm-dispatch",
      title: "Tool Dispatch: AgentTool",
      subtitle: "dispatch --tool AgentTool --spawn",
      description:
        "For complex, multi-file tasks, the model spawns a sub-agent via `AgentTool`. It provides a prompt describing the sub-task, optionally specifies an agent type (like 'Explore' or 'code-reviewer'), and the agent system takes over.",
      sourceFiles: [],
      scenario: "agent-swarm",
    },
    {
      id: "swarm-fork",
      title: "Fork Sub-Agent",
      subtitle: "fork --color --memory-snapshot",
      description:
        "The `forkSubagent` function creates an isolated execution context for the sub-agent. It assigns a unique terminal color (so you can visually distinguish agents), snapshots the parent's memory for context, and creates a new tool context. The sub-agent is a fully independent query loop — it can call tools, make edits, even spawn its own sub-agents.",
      sourceFiles: [
        {
          path: "src/tools/AgentTool/forkSubagent.ts",
          snippet: snippets.agentSpawn,
          highlightLines: [7, 10, 11, 15, 16, 21, 22],
        },
      ],
      scenario: "agent-swarm",
    },
    {
      id: "swarm-parallel",
      title: "Parallel Execution",
      subtitle: "team --create --parallel",
      description:
        "For truly large refactors, `TeamCreateTool` can spawn multiple agents that run in parallel. Each agent works on its portion of the codebase independently. They can communicate via `SendMessageTool` to coordinate — for example, one agent might tell another 'I renamed this interface, update your imports.'",
      sourceFiles: [],
      scenario: "agent-swarm",
    },
    {
      id: "swarm-merge",
      title: "Merge Results",
      subtitle: "merge --results --synthesize",
      description:
        "When sub-agents complete, their results flow back to the parent. The parent model sees what each agent accomplished and synthesizes a final response. If agents made conflicting changes, the parent can resolve them. The whole swarm collapses back into a single conversation turn.",
      sourceFiles: [],
      scenario: "agent-swarm",
    },
  ],
};
```

- [ ] **Step 4: Create Journey 2 architecture node data**

Create `src/data/architecture.ts`:

```typescript
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
      { path: "src/entrypoints/cli.tsx", snippet: snippets.startupPrefetch },
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
    sourceFiles: [{ path: "src/tools.ts", snippet: snippets.toolRegistry }],
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
      outputs: ["tool_result blocks back to model", "side effects (file changes, commands)"],
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

  // ── Level 1: CLI Entry & Bootstrap ──────────────────
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
      "4,700-line Commander.js setup. Parses flags, validates arguments, resolves model selection, configures permission modes. This is where --model, --permission-mode, --resume, and all other CLI flags are handled.",
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
      "Core setup: config validation, TLS certificate loading, proxy configuration, telemetry initialization, graceful shutdown handlers. Runs once per session.",
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
      "Per-session setup: finds git root, initializes session memory, loads project config, saves worktree state. Creates the session ID that ties everything together.",
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
      "The secret to Claude Code's fast startup. Before heavy module evaluation even begins, three subprocess spawns fire in parallel: MDM settings (plutil/reg query), macOS keychain reads (OAuth + legacy API key), and GrowthBook feature flag initialization. This saves ~65-135ms on every start.",
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
      "Parallel subprocess calls to gather branch, default branch, status (--short), log (last 5 commits), and user name. Results are formatted into the gitStatus block that appears in every system prompt.",
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
      "Searches for CLAUDE.md files in the project root, parent directories, and home directory. Each file's content is included in the system prompt, giving project-specific instructions to the model.",
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
      "Persistent memory stored in ~/.claude/. Memory files are filtered for relevance to the current context. Supports user memories, project memories, feedback, and references. Cross-session continuity.",
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
      "Organization policy enforcement — rate limits, allowed models, feature access. Checked at startup and periodically refreshed.",
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
      "Zod schemas validate all configuration. Migration scripts handle version upgrades — renaming models (sonnet45 -> sonnet46), moving settings between files, updating defaults.",
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
      "The orchestrator. Manages the conversation loop: assemble context, call API, check for tools, execute tools, loop. Handles interruptions, auto-compact triggers, and session persistence.",
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
      "Wraps the Anthropic SDK. Handles streaming, retry with exponential backoff, error classification, and prompt-too-long recovery. The client is pre-connected at startup via apiPreconnect.ts.",
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
      "When token usage exceeds 70% of the context window, auto-compact triggers. It summarizes older messages, preserving recent context. At 90%, it forces compaction. This keeps long sessions from hitting context limits.",
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
      "Tracks input/output tokens and dollar cost per turn and per session. Model-specific pricing. Powers the /cost command and cost threshold warnings.",
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
      "GrowthBook-based feature flag system. Controls rollout of new features, A/B tests, and kill switches. Initialized at startup, refreshed after auth changes.",
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
      "Assembles the full list of available tools. Built-in tools are always present. Feature-gated tools (SleepTool, CronTools) are conditionally included via bun:bundle DCE. MCP tools from external servers are dynamically added.",
    sourceFiles: [{ path: "src/tools.ts", snippet: snippets.toolRegistry }],
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
      "Every tool call passes through permission checking before execution. Supports multiple modes, user-configured rules, and interactive prompting. The model never acts without authorization.",
    sourceFiles: [
      {
        path: "src/hooks/useCanUseTool.tsx",
        snippet: snippets.permissionCheck,
      },
    ],
    interestingDetails: [
      "Four modes: default (ask user), plan (ask + require plan review), bypass (allow all), auto (allow safe operations)",
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
      "Shell command execution with security analysis, sandboxing, and progress display. The most powerful and most guarded tool.",
    sourceFiles: [
      { path: "src/tools/BashTool/BashTool.tsx", snippet: snippets.bashTool },
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
      "FileReadTool, FileEditTool, FileWriteTool, GlobTool, GrepTool. The core tools for code manipulation. FileEditTool uses string replacement (not line numbers) for reliability. File history tracks all changes for undo.",
    sourceFiles: [
      {
        path: "src/tools/FileEditTool/FileEditTool.tsx",
        snippet: snippets.fileEditTool,
      },
    ],
    dataFlow: {
      inputs: ["file paths", "content", "patterns"],
      outputs: ["file contents", "search results", "edit confirmations"],
    },
  },
  {
    id: "tool-search",
    level: 1,
    parentId: "tool-system",
    title: "Search Tools",
    description:
      "GlobTool for file pattern matching, GrepTool wrapping ripgrep for content search, WebSearchTool and WebFetchTool for web access. ToolSearchTool for discovering deferred tools.",
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
      "AgentTool spawns sub-agents for complex tasks. TeamCreateTool enables parallel agent teams. SendMessageTool allows inter-agent communication. Each agent runs its own query loop recursively.",
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
      "Model Context Protocol servers extend Claude Code with external tools and resources. Connections are managed, tools are loaded into the registry, and the model calls them like any built-in tool.",
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
      "Language Server Protocol integration for code intelligence — go-to-definition, find references, diagnostics. Connected to the LSPTool so the model can query language servers.",
    sourceFiles: [],
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
      "React/Ink components for every UI element: message rendering, diff display, agent progress, permission dialogs, onboarding flows, cost displays, context visualization. Compiled with React Compiler.",
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
      "The main interactive loop. Renders the conversation, handles user input, manages the query lifecycle, and coordinates all the moving pieces. This is what you see when you run `claude`.",
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
      "External store pattern with React context. AppStateStore holds conversation state, tool progress, permission decisions. useSyncExternalStore bridges React's rendering with the mutable store.",
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
      "Configurable keyboard shortcuts. Supports chord bindings (e.g., Ctrl+K then Ctrl+C). User-customizable via ~/.claude/keybindings.json. Vim mode available.",
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
      "Bidirectional communication with VS Code and JetBrains extensions. JWT-authenticated messages. The bridge forwards tool calls, permission requests, and file changes between the CLI and the IDE.",
    sourceFiles: [
      {
        path: "src/bridge/bridgeMessaging.ts",
        snippet: snippets.bridgeProtocol,
      },
    ],
    interestingDetails: [
      "JWT ensures only the paired IDE can control the session",
      "Supports permission callbacks — the IDE can approve/deny tool calls",
      "Session runner manages the lifecycle of bridged sessions",
    ],
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
      "Four modes control how permissions are resolved: 'default' prompts for every sensitive action; 'plan' requires a reviewed plan before execution; 'bypassPermissions' allows everything (for trusted environments); 'auto' allows read-only and safe operations automatically.",
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
      "User-configured allow/deny rules in settings.json. Rules match by tool name and input patterns (e.g., allow BashTool for 'npm test', deny for 'rm -rf'). Wildcard patterns supported. Rules are checked before prompting the user.",
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
      "Tracks which tools the user has denied to prevent the model from retrying the same action. The denial is included in the tool result so the model adjusts its approach.",
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
      "AST-based parsing of shell commands. Splits compound commands, detects sudo, destructive rm patterns, dangerous git operations (force push, reset --hard), and other risky patterns. Results inform the permission prompt — destructive commands get explicit warnings.",
    sourceFiles: [
      { path: "src/utils/bash/ast.ts", snippet: snippets.bashSecurityParse },
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
      "Determines whether a command should run in a sandboxed environment. Sandboxing restricts filesystem and network access. The decision is based on command content, user settings, and whether the environment supports sandboxing.",
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
      "Fork: create isolated context with memory snapshot and color assignment. Run: execute the agent's own query loop (full tool access, recursive). Complete: collect results and return to parent. The agent is essentially a mini Claude Code session within the parent session.",
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
      "TeamCreateTool spawns named agent teams that run in parallel. Each team member gets an independent context. SendMessageTool enables inter-agent messaging for coordination. TeamDeleteTool cleans up when done.",
    sourceFiles: [],
    dataFlow: {
      inputs: ["team config", "member prompts"],
      outputs: ["parallel results", "inter-agent messages"],
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
```

- [ ] **Step 5: Verify data compiles**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/data/
git commit -m "feat: add data layer — types, code snippets, stage and architecture definitions"
```

---

### Task 5: Landing Page

**Files:**
- Create: `src/components/landing/Hero.tsx`
- Create: `src/components/landing/JourneyCard.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create the typing animation hero**

Create `src/components/landing/Hero.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          <span className="text-terminal-green animate-pulse">▊</span>
        </div>
        <p className="mt-8 text-text-secondary text-lg max-w-xl mx-auto">
          Explore what happens inside Anthropic&apos;s CLI when you hit Enter.
          Trace a prompt through every system, or zoom into the architecture.
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Create JourneyCard**

Create `src/components/landing/JourneyCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  href: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
};

export function JourneyCard({
  href,
  title,
  tagline,
  icon,
  accentColor,
}: Props) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative group p-8 rounded-xl border border-border bg-bg-elevated overflow-hidden cursor-pointer"
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}15, transparent 40%)`,
          }}
        />
        <div className="relative z-10">
          <div className="text-4xl mb-4">{icon}</div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary">{title}</h2>
          <p className="text-text-secondary">{tagline}</p>
        </div>
        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: accentColor }}
        />
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 3: Wire up the landing page**

Replace `src/app/page.tsx`:

```tsx
import { GridBackground } from "@/components/shared/GridBackground";
import { Hero } from "@/components/landing/Hero";
import { JourneyCard } from "@/components/landing/JourneyCard";
import { FadeIn } from "@/components/shared/FadeIn";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <GridBackground />
      <Hero />
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <FadeIn delay={0.2}>
            <JourneyCard
              href="/follow-a-prompt"
              title="Follow a Prompt"
              tagline="Watch what happens when you hit Enter."
              icon={
                <span className="font-mono text-terminal-green">
                  {"▸ "}
                  <span className="text-terminal-amber">_</span>
                </span>
              }
              accentColor="#4afa82"
            />
          </FadeIn>
          <FadeIn delay={0.4}>
            <JourneyCard
              href="/architecture"
              title="Explore the Architecture"
              tagline="Zoom into every layer."
              icon={
                <span className="font-mono text-accent-blue">
                  {"◈ ◇ ◈"}
                </span>
              }
              accentColor="#4a9afa"
            />
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Verify landing page**

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Expected: Dark page with typing animation cycling through prompts, two journey cards below, grid background, CRT overlay on hero.

- [ ] **Step 5: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/components/landing/ src/app/page.tsx
git commit -m "feat: add landing page with typing animation and journey cards"
```

---

### Task 6: Journey 1 — Scroll Pipeline Infrastructure

**Files:**
- Create: `src/lib/useScrollStage.ts`
- Create: `src/components/pipeline/GlowingDot.tsx`
- Create: `src/components/pipeline/PipelineSidebar.tsx`
- Create: `src/components/pipeline/StageContent.tsx`
- Create: `src/components/pipeline/PipelineView.tsx`
- Create: `src/app/follow-a-prompt/page.tsx`

- [ ] **Step 1: Create scroll tracking hook**

Create `src/lib/useScrollStage.ts`:

```typescript
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useScrollStage(stageCount: number) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setStageRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stageRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight / 2;

      for (let i = stageRefs.current.length - 1; i >= 0; i--) {
        const el = stageRefs.current[i];
        if (el && el.offsetTop <= viewportCenter) {
          setActiveStage(i);

          // Calculate progress within this stage
          const stageTop = el.offsetTop;
          const stageHeight = el.offsetHeight;
          const progressInStage = Math.min(
            1,
            Math.max(0, (viewportCenter - stageTop) / stageHeight)
          );
          setProgress((i + progressInStage) / stageCount);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stageCount]);

  return { activeStage, progress, setStageRef };
}
```

- [ ] **Step 2: Create GlowingDot**

Create `src/components/pipeline/GlowingDot.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  progress: number;
  color?: string;
  totalStages: number;
};

export function GlowingDot({
  progress,
  color = "var(--color-terminal-green)",
  totalStages,
}: Props) {
  const y = progress * (totalStages * 80);

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      animate={{ y }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-4 rounded-full blur-xl opacity-40"
        style={{ backgroundColor: color }}
      />
      {/* Inner dot */}
      <div
        className="w-4 h-4 rounded-full relative z-10"
        style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Create PipelineSidebar**

Create `src/components/pipeline/PipelineSidebar.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { GlowingDot } from "./GlowingDot";

type Props = {
  stages: { id: string; title: string }[];
  activeStage: number;
  progress: number;
  scenarioColor?: string;
};

export function PipelineSidebar({
  stages,
  activeStage,
  progress,
  scenarioColor,
}: Props) {
  return (
    <div className="sticky top-20 w-64 hidden lg:block">
      <div className="relative py-8">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        {/* Glowing dot */}
        <GlowingDot
          progress={progress}
          totalStages={stages.length}
          color={scenarioColor}
        />

        {/* Stage dots */}
        {stages.map((stage, i) => (
          <div key={stage.id} className="relative flex items-center h-20">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 z-10"
              animate={{
                borderColor:
                  i <= activeStage
                    ? scenarioColor ?? "var(--color-terminal-green)"
                    : "var(--color-border)",
                backgroundColor:
                  i <= activeStage
                    ? scenarioColor ?? "var(--color-terminal-green)"
                    : "transparent",
              }}
              transition={{ duration: 0.3 }}
            />
            <span
              className={`absolute left-[calc(50%+20px)] text-xs font-mono whitespace-nowrap transition-colors ${
                i === activeStage
                  ? "text-text-primary"
                  : "text-text-muted"
              }`}
            >
              {stage.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create StageContent**

Create `src/components/pipeline/StageContent.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { PipelineStage } from "@/data/types";
import { SectionHeader } from "../shared/SectionHeader";
import { CodePanel } from "../shared/CodePanel";

type Props = {
  stage: PipelineStage;
  isActive: boolean;
  stageRef: (el: HTMLDivElement | null) => void;
};

export function StageContent({ stage, isActive, stageRef }: Props) {
  return (
    <div ref={stageRef} className="min-h-[60vh] py-16">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isActive ? 1 : 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <SectionHeader command={stage.subtitle} />
        <h2 className="text-3xl font-bold mb-4">{stage.title}</h2>
        <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-2xl">
          {stage.description}
        </p>
        {stage.sourceFiles.map((sf) => (
          <div key={sf.path} className="mb-4">
            <CodePanel
              filePath={sf.path}
              code={sf.snippet}
              highlightLines={sf.highlightLines}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 5: Create PipelineView**

Create `src/components/pipeline/PipelineView.tsx`:

```tsx
"use client";

import { useState } from "react";
import { GridBackground } from "../shared/GridBackground";
import { PipelineSidebar } from "./PipelineSidebar";
import { StageContent } from "./StageContent";
import { BranchSelector } from "./BranchSelector";
import { ScenarioPath } from "./ScenarioPath";
import { PostScenario } from "./PostScenario";
import { useScrollStage } from "@/lib/useScrollStage";
import { sharedStages, scenarioStages } from "@/data/stages";
import type { Scenario } from "@/data/types";
import { SCENARIO_COLORS } from "@/data/types";

export function PipelineView() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );

  const currentStages = selectedScenario
    ? [...sharedStages, ...scenarioStages[selectedScenario]]
    : sharedStages;

  const { activeStage, progress, setStageRef } = useScrollStage(
    currentStages.length
  );

  const scenarioColor = selectedScenario
    ? SCENARIO_COLORS[selectedScenario]
    : undefined;

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          {/* Left: Content */}
          <div className="flex-1 max-w-3xl">
            {/* Shared stages */}
            {sharedStages.map((stage, i) => (
              <StageContent
                key={stage.id}
                stage={stage}
                isActive={activeStage === i}
                stageRef={setStageRef(i)}
              />
            ))}

            {/* Branch selector */}
            <BranchSelector
              selectedScenario={selectedScenario}
              onSelect={setSelectedScenario}
            />

            {/* Scenario-specific stages */}
            {selectedScenario && (
              <ScenarioPath
                stages={scenarioStages[selectedScenario]}
                activeStage={activeStage}
                stageOffset={sharedStages.length}
                setStageRef={setStageRef}
              />
            )}

            {/* Post-scenario navigation */}
            {selectedScenario && (
              <PostScenario
                currentScenario={selectedScenario}
                onSelect={setSelectedScenario}
              />
            )}
          </div>

          {/* Right: Pipeline sidebar */}
          <PipelineSidebar
            stages={currentStages.map((s) => ({
              id: s.id,
              title: s.title,
            }))}
            activeStage={activeStage}
            progress={progress}
            scenarioColor={scenarioColor}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create BranchSelector**

Create `src/components/pipeline/BranchSelector.tsx`:

```tsx
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
```

- [ ] **Step 7: Create ScenarioPath**

Create `src/components/pipeline/ScenarioPath.tsx`:

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

export function ScenarioPath({
  stages,
  activeStage,
  stageOffset,
  setStageRef,
}: Props) {
  return (
    <div>
      {stages.map((stage, i) => (
        <StageContent
          key={stage.id}
          stage={stage}
          isActive={activeStage === stageOffset + i}
          stageRef={setStageRef(stageOffset + i)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Create PostScenario**

Create `src/components/pipeline/PostScenario.tsx`:

```tsx
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
              // Scroll to branch point
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
```

- [ ] **Step 9: Create the page**

Create `src/app/follow-a-prompt/page.tsx`:

```tsx
import { PipelineView } from "@/components/pipeline/PipelineView";

export default function FollowAPrompt() {
  return <PipelineView />;
}
```

- [ ] **Step 10: Verify Journey 1 works end-to-end**

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Navigate to `/follow-a-prompt`.

Expected: Scroll through 4 shared stages with text + code panels appearing. Pipeline sidebar tracks progress with glowing dot. Branch selector shows 4 scenario buttons. Clicking a scenario shows additional stages. "Try another path?" appears at the end.

- [ ] **Step 11: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/lib/useScrollStage.ts src/components/pipeline/ src/app/follow-a-prompt/
git commit -m "feat: add Journey 1 — scroll-driven prompt pipeline with branching scenarios"
```

---

### Task 7: Journey 2 — Fractal Zoom Architecture Explorer

**Files:**
- Create: `src/lib/useZoom.ts`
- Create: `src/components/architecture/NodeBox.tsx`
- Create: `src/components/architecture/ConnectionArrows.tsx`
- Create: `src/components/architecture/NodeDiagram.tsx`
- Create: `src/components/architecture/NodeDetail.tsx`
- Create: `src/components/architecture/Breadcrumbs.tsx`
- Create: `src/components/architecture/Minimap.tsx`
- Create: `src/components/architecture/ArchitectureView.tsx`
- Create: `src/app/architecture/page.tsx`

- [ ] **Step 1: Create zoom state hook**

Create `src/lib/useZoom.ts`:

```typescript
"use client";

import { useState, useCallback } from "react";
import {
  getNodeById,
  getChildNodes,
  getLevel0Nodes,
  architectureNodes,
} from "@/data/architecture";
import type { ArchitectureNode } from "@/data/types";

export type ZoomPath = { id: string; title: string }[];

export function useZoom() {
  const [path, setPath] = useState<ZoomPath>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const currentParentId = path.length > 0 ? path[path.length - 1].id : null;

  const visibleNodes: ArchitectureNode[] = currentParentId
    ? getChildNodes(currentParentId)
    : getLevel0Nodes();

  const selectedNode = selectedNodeId
    ? getNodeById(selectedNodeId)
    : null;

  const zoomIn = useCallback(
    (nodeId: string) => {
      const node = getNodeById(nodeId);
      if (!node) return;

      const children = getChildNodes(nodeId);
      if (children.length > 0) {
        setPath((prev) => [...prev, { id: nodeId, title: node.title }]);
        setSelectedNodeId(null);
      } else {
        setSelectedNodeId(nodeId);
      }
    },
    []
  );

  const zoomTo = useCallback((index: number) => {
    if (index < 0) {
      setPath([]);
    } else {
      setPath((prev) => prev.slice(0, index + 1));
    }
    setSelectedNodeId(null);
  }, []);

  const zoomOut = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
    setSelectedNodeId(null);
  }, []);

  return {
    path,
    visibleNodes,
    selectedNode,
    selectedNodeId,
    zoomIn,
    zoomTo,
    zoomOut,
    setSelectedNodeId,
  };
}
```

- [ ] **Step 2: Create NodeBox**

Create `src/components/architecture/NodeBox.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { getChildNodes } from "@/data/architecture";

type Props = {
  node: ArchitectureNode;
  isSelected: boolean;
  onClick: () => void;
  layoutId: string;
};

export function NodeBox({ node, isSelected, onClick, layoutId }: Props) {
  const hasChildren = getChildNodes(node.id).length > 0;

  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-xl border cursor-pointer transition-colors ${
        isSelected
          ? "border-terminal-green bg-bg-surface"
          : "border-border bg-bg-elevated hover:border-text-muted"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-text-primary">{node.title}</h3>
        {hasChildren && (
          <span className="text-xs font-mono text-terminal-green bg-terminal-green/10 px-2 py-0.5 rounded">
            zoom in
          </span>
        )}
      </div>
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
        {node.description}
      </p>
      {node.dataFlow && (
        <div className="mt-3 flex gap-4 text-xs font-mono">
          <span className="text-terminal-green">
            {node.dataFlow.inputs.length} inputs
          </span>
          <span className="text-terminal-amber">
            {node.dataFlow.outputs.length} outputs
          </span>
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Create ConnectionArrows**

Create `src/components/architecture/ConnectionArrows.tsx`:

```tsx
"use client";

type Props = {
  nodeCount: number;
  direction?: "vertical" | "grid";
};

export function ConnectionArrows({ nodeCount, direction = "grid" }: Props) {
  if (direction === "vertical" || nodeCount <= 1) return null;

  // For grid layout, we show a subtle connecting line between adjacent nodes
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-border)" />
          <stop offset="50%" stopColor="var(--color-text-muted)" />
          <stop offset="100%" stopColor="var(--color-border)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 4: Create NodeDetail**

Create `src/components/architecture/NodeDetail.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { CodePanel } from "../shared/CodePanel";

type Props = {
  node: ArchitectureNode;
  onClose: () => void;
};

export function NodeDetail({ node, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="border-l border-border pl-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{node.title}</h2>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors font-mono text-sm"
        >
          [close]
        </button>
      </div>

      <p className="text-text-secondary leading-relaxed mb-6">
        {node.description}
      </p>

      {/* Data flow */}
      {node.dataFlow && (
        <div className="mb-6 p-4 rounded-lg bg-bg-surface border border-border">
          <h4 className="font-mono text-sm text-text-muted mb-3">Data Flow</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-mono text-terminal-green mb-2">
                Inputs
              </div>
              {node.dataFlow.inputs.map((input) => (
                <div
                  key={input}
                  className="text-sm text-text-secondary font-mono"
                >
                  {"← "}{input}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-mono text-terminal-amber mb-2">
                Outputs
              </div>
              {node.dataFlow.outputs.map((output) => (
                <div
                  key={output}
                  className="text-sm text-text-secondary font-mono"
                >
                  {"→ "}{output}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interesting details */}
      {node.interestingDetails && node.interestingDetails.length > 0 && (
        <div className="mb-6">
          <h4 className="font-mono text-sm text-terminal-amber mb-3">
            Interesting Details
          </h4>
          <ul className="space-y-2">
            {node.interestingDetails.map((detail, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-terminal-amber shrink-0">*</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source code */}
      {node.sourceFiles.map((sf) => (
        <div key={sf.path} className="mb-4">
          <CodePanel filePath={sf.path} code={sf.snippet} />
        </div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 5: Create Breadcrumbs**

Create `src/components/architecture/Breadcrumbs.tsx`:

```tsx
"use client";

import type { ZoomPath } from "@/lib/useZoom";

type Props = {
  path: ZoomPath;
  onNavigate: (index: number) => void;
};

export function Breadcrumbs({ path, onNavigate }: Props) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm mb-8">
      <button
        onClick={() => onNavigate(-1)}
        className={`transition-colors ${
          path.length === 0
            ? "text-text-primary"
            : "text-text-muted hover:text-terminal-green"
        }`}
      >
        Architecture
      </button>
      {path.map((crumb, i) => (
        <span key={crumb.id} className="flex items-center gap-2">
          <span className="text-text-muted">/</span>
          <button
            onClick={() => onNavigate(i)}
            className={`transition-colors ${
              i === path.length - 1
                ? "text-text-primary"
                : "text-text-muted hover:text-terminal-green"
            }`}
          >
            {crumb.title}
          </button>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create Minimap**

Create `src/components/architecture/Minimap.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { getLevel0Nodes } from "@/data/architecture";
import type { ZoomPath } from "@/lib/useZoom";

type Props = {
  path: ZoomPath;
  onNavigate: (index: number) => void;
};

export function Minimap({ path, onNavigate }: Props) {
  const level0 = getLevel0Nodes();
  const activeL0Id = path.length > 0 ? path[0].id : null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <div className="bg-bg-elevated border border-border rounded-lg p-3 opacity-60 hover:opacity-100 transition-opacity">
        <div className="text-xs font-mono text-text-muted mb-2">Map</div>
        <div className="space-y-1">
          {level0.map((node) => (
            <motion.button
              key={node.id}
              onClick={() => onNavigate(-1)}
              className={`block w-full text-left text-xs font-mono px-2 py-1 rounded transition-colors ${
                node.id === activeL0Id
                  ? "bg-terminal-green/20 text-terminal-green"
                  : "text-text-muted hover:text-text-secondary"
              }`}
              animate={{
                scale: node.id === activeL0Id ? 1.05 : 1,
              }}
            >
              {node.title}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create NodeDiagram**

Create `src/components/architecture/NodeDiagram.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ArchitectureNode } from "@/data/types";
import { NodeBox } from "./NodeBox";

type Props = {
  nodes: ArchitectureNode[];
  selectedNodeId: string | null;
  onNodeClick: (id: string) => void;
};

export function NodeDiagram({ nodes, selectedNodeId, onNodeClick }: Props) {
  return (
    <motion.div
      layout
      className="grid gap-4"
      style={{
        gridTemplateColumns:
          nodes.length <= 3
            ? `repeat(${nodes.length}, 1fr)`
            : nodes.length <= 6
              ? "repeat(3, 1fr)"
              : "repeat(4, 1fr)",
      }}
    >
      <AnimatePresence mode="popLayout">
        {nodes.map((node) => (
          <NodeBox
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onNodeClick(node.id)}
            layoutId={`node-${node.id}`}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 8: Create ArchitectureView**

Create `src/components/architecture/ArchitectureView.tsx`:

```tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { GridBackground } from "../shared/GridBackground";
import { SectionHeader } from "../shared/SectionHeader";
import { Breadcrumbs } from "./Breadcrumbs";
import { Minimap } from "./Minimap";
import { NodeDiagram } from "./NodeDiagram";
import { NodeDetail } from "./NodeDetail";
import { useZoom } from "@/lib/useZoom";

export function ArchitectureView() {
  const {
    path,
    visibleNodes,
    selectedNode,
    selectedNodeId,
    zoomIn,
    zoomTo,
    setSelectedNodeId,
  } = useZoom();

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <SectionHeader
          command={`explore --depth ${path.length} ${
            path.length > 0 ? `--system "${path[path.length - 1].title}"` : ""
          }`}
        />

        <Breadcrumbs path={path} onNavigate={zoomTo} />

        <div className="flex gap-8">
          <div className="flex-1">
            <NodeDiagram
              nodes={visibleNodes}
              selectedNodeId={selectedNodeId}
              onNodeClick={zoomIn}
            />
          </div>

          <AnimatePresence>
            {selectedNode && (
              <div className="w-[450px] shrink-0">
                <NodeDetail
                  node={selectedNode}
                  onClose={() => setSelectedNodeId(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Minimap path={path} onNavigate={zoomTo} />
    </div>
  );
}
```

- [ ] **Step 9: Create the page**

Create `src/app/architecture/page.tsx`:

```tsx
import { ArchitectureView } from "@/components/architecture/ArchitectureView";

export default function Architecture() {
  return <ArchitectureView />;
}
```

- [ ] **Step 10: Verify Journey 2 works end-to-end**

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Navigate to `/architecture`.

Expected: 5 Level 0 boxes in a grid. Clicking a box zooms in to show its children (Level 1 nodes). Breadcrumbs update. Clicking a leaf node shows the detail panel with description, data flow, interesting details, and code. Minimap visible in bottom-right corner. Clicking breadcrumbs navigates back.

- [ ] **Step 11: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add src/lib/useZoom.ts src/components/architecture/ src/app/architecture/
git commit -m "feat: add Journey 2 — fractal zoom architecture explorer with breadcrumbs and minimap"
```

---

### Task 8: Responsive Layout & Final Polish

**Files:**
- Modify: `src/components/pipeline/PipelineView.tsx`
- Modify: `src/components/pipeline/PipelineSidebar.tsx`
- Modify: `src/components/architecture/Minimap.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add mobile progress bar for Journey 1**

Add to `src/components/pipeline/PipelineView.tsx`, above the flex container:

```tsx
{/* Mobile progress bar */}
<div className="lg:hidden sticky top-14 z-30 bg-bg/90 backdrop-blur-sm border-b border-border px-4 py-2">
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{
          width: `${progress * 100}%`,
          backgroundColor: scenarioColor ?? "var(--color-terminal-green)",
        }}
      />
    </div>
    <span className="text-xs font-mono text-text-muted">
      {activeStage + 1}/{currentStages.length}
    </span>
  </div>
</div>
```

- [ ] **Step 2: Add smooth scrolling and selection styles to globals.css**

Append to `src/app/globals.css`:

```css
html {
  scroll-behavior: smooth;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for code panels */
.font-mono ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.font-mono ::-webkit-scrollbar-track {
  background: var(--color-bg-elevated);
}

.font-mono ::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
```

- [ ] **Step 3: Verify responsive behavior**

Run: `cd /Users/khan/journey-through-claude-code && npm run dev -- --port 3033`

Test at various widths:
- Desktop (>1024px): sidebar visible, minimap visible, grid layouts
- Tablet (768-1024px): sidebar hidden, mobile progress bar shows, content stacks
- Mobile (<768px): single column, compact layout

- [ ] **Step 4: Verify full static export**

Run:
```bash
cd /Users/khan/journey-through-claude-code
npm run build
```

Expected: Build succeeds with no errors. `out/` directory contains `index.html`, `follow-a-prompt.html`, `architecture.html` and all assets.

- [ ] **Step 5: Commit**

```bash
cd /Users/khan/journey-through-claude-code
git add .
git commit -m "feat: add responsive layouts and final polish"
```

---

### Task 9: README and GitHub Setup

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

Create `README.md`:

```markdown
# Journey Through Claude Code

An interactive website that explores the internal architecture of [Claude Code](https://claude.ai/code), Anthropic's CLI for software engineering with Claude.

## Two Journeys

**Follow a Prompt** — Scroll through an animated pipeline that traces what happens when you type a prompt and hit Enter. Watch it flow through input capture, context assembly, the API call, and then branch into four different scenarios: a simple question, a file edit, running tests, or spawning an agent swarm.

**Explore the Architecture** — A fractal zoom interface. Start with 5 high-level systems, click to zoom in and reveal subsystems, click again for implementation details. Breadcrumbs and a minimap keep you oriented.

## Built With

- [Next.js](https://nextjs.org) (static export)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Tailwind CSS](https://tailwindcss.com) (styling)
- [Shiki](https://shiki.style) (syntax highlighting)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# Static files in out/
```

## Source Material

Based on the Claude Code source (`src/`) leaked via npm source maps on 2026-03-31. Code snippets are curated excerpts used for educational purposes.
```

- [ ] **Step 2: Commit and set up remote**

```bash
cd /Users/khan/journey-through-claude-code
git add README.md
git commit -m "docs: add README"
```

Then set up the remote:
```bash
cd /Users/khan/journey-through-claude-code
gh repo create brandonrc/journey-through-claude-code --public --source=. --push
```

Expected: Repository created on GitHub and code pushed.

---

## Self-Review Checklist

**Spec coverage:**
- [x] Landing page with two journey cards (Task 5)
- [x] Journey 1: shared path 4 stages (Task 6, stages.ts)
- [x] Journey 1: 4 branching scenarios (Task 6, scenarioStages in stages.ts)
- [x] Journey 1: scroll-driven animation with pipeline sidebar (Task 6)
- [x] Journey 1: "Try another path?" post-scenario (Task 6, PostScenario.tsx)
- [x] Journey 1: "See the code" panels (Task 3, CodePanel.tsx used in StageContent.tsx)
- [x] Journey 2: 3 zoom levels (Task 7, architecture.ts has L0/L1/L2 nodes)
- [x] Journey 2: breadcrumb navigation (Task 7, Breadcrumbs.tsx)
- [x] Journey 2: persistent minimap (Task 7, Minimap.tsx)
- [x] Journey 2: node content with data flow and interesting details (Task 7, NodeDetail.tsx)
- [x] Dark terminal aesthetic with grid background (Task 1 + 2)
- [x] CRT overlay (Task 2)
- [x] Terminal-command section headers (Task 2)
- [x] Typography: Inter + JetBrains Mono (Task 1)
- [x] Color palette matching spec (Task 1, globals.css)
- [x] Responsive down to tablet/mobile (Task 8)
- [x] Static export (Task 1, next.config.ts)
- [x] Code snippets from real source (Task 4, snippets.ts)

**Placeholder scan:** No TBDs, TODOs, or "fill in later" references found.

**Type consistency:** `PipelineStage`, `ArchitectureNode`, `Scenario`, `SourceFile`, `ZoomPath` used consistently across all tasks. `snippets` object keys match usage in `stages.ts` and `architecture.ts`.
