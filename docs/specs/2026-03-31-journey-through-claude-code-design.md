# Journey Through Claude Code — Design Spec

## Overview

A static website that helps developers understand the internal architecture of Claude Code by tracing what happens when a prompt is entered. Two journeys from one landing page: an interactive storytelling walkthrough that follows a prompt through the system, and a fractal zoom explorer for the architecture.

**Source material:** The leaked Claude Code `src/` directory (~1,884 TypeScript files).

**Audience:** Developers who use Claude Code and want to understand how it works internally, plus software engineers interested in the architecture patterns.

**Tech stack:** Next.js (static export) + Framer Motion + TypeScript + Tailwind CSS.

**Hosting:** Static files, deployable anywhere (GitHub Pages, Vercel, Netlify).

---

## Site Structure

```
/                    Landing page with journey selector
/follow-a-prompt     Interactive scroll-driven storytelling
/architecture        Fractal zoom architecture explorer
```

---

## Landing Page (`/`)

Dark background, terminal-inspired aesthetic. Center-screen: a stylized animation of a prompt being typed into a terminal. The typed text cycles through different prompt types ("edit this file", "run the tests", "explain this function") to hint at Journey 1's branching nature.

Below the hero, two cards:

- **"Follow a Prompt"** — tagline: "Watch what happens when you hit Enter." Shows a miniature animated pipeline preview. Links to `/follow-a-prompt`.
- **"Explore the Architecture"** — tagline: "Zoom into every layer." Shows a miniature system map with subtle pulse animation. Links to `/architecture`.

Both cards animate on hover with a glow effect.

---

## Journey 1: Follow a Prompt (`/follow-a-prompt`)

### Mechanic

Scroll-driven storytelling. As the user scrolls, a visual "prompt packet" (glowing dot with particle trail) moves through an animated pipeline diagram fixed to the right side of the viewport. The left side has explanatory text that highlights at each stage.

### Shared Path (all scenarios)

Every prompt goes through these 4 stages before branching:

**Stage 1 — Keystroke & Input**
- Files: `components/BaseTextInput.tsx`, `utils/earlyInput.ts`
- Explain: How keystrokes are captured, early input buffering before React mounts

**Stage 2 — Context Assembly**
- Files: `context.ts`, `utils/claudemd.ts`, `memdir/memdir.ts`
- Explain: Git status gathering (parallel subprocess), CLAUDE.md file loading, memory file injection

**Stage 3 — System Prompt Construction**
- Files: `utils/queryContext.ts`, `constants/systemPromptSections.ts`
- Explain: How dozens of pieces merge into the massive system prompt the model sees

**Stage 4 — API Call**
- Files: `QueryEngine.ts`, `services/api/claude.ts`, `services/api/withRetry.ts`
- Explain: Streaming request to Anthropic API, retry logic, token counting begins

### Branch Point

After Stage 4, a visual fork appears. The prompt packet splits into 4 colored paths. User clicks to choose a scenario:

#### Scenario A — Simple Question (blue)
*"What does this function do?"*

- Model streams text response, no tool calls
- Rendered through Ink components
- Shortest path — 1-2 additional stages

#### Scenario B — File Edit (purple)
*"Edit the auth middleware"*

1. Model returns `FileEditTool` tool_use block
2. Tool dispatch: `query.ts` tool loop matches tool in `tools.ts` registry
3. Permission check: `hooks/toolPermission/` pipeline runs
4. User approves (or auto-approved based on permission mode)
5. Tool executes: string replacement in target file, file history tracked
6. Result sent back to model as tool_result
7. Model responds with summary of changes

Key files: `tools/FileEditTool/`, `hooks/useCanUseTool.tsx`, `utils/fileHistory.ts`

#### Scenario C — Run Tests (orange)
*"Run the tests"*

1. Model returns `BashTool` tool_use block
2. Security parsing: `utils/bash/ast.ts` analyzes the command
3. Sandbox decision: `tools/BashTool/shouldUseSandbox.ts`
4. Permission check with destructive command warnings
5. Shell execution via `utils/Shell.ts`
6. Output streaming with progress display (threshold: 2s before showing progress)
7. Result (stdout/stderr) sent back to model
8. Model interprets results

Key files: `tools/BashTool/BashTool.tsx`, `tools/BashTool/bashSecurity.ts`, `tools/BashTool/bashPermissions.ts`

#### Scenario D — Agent Swarm (red)
*"Refactor this across the codebase"*

1. Model returns `AgentTool` tool_use block
2. Sub-agent spawned: `tools/AgentTool/forkSubagent.ts`
3. Agent gets its own context, color assignment, memory snapshot
4. Agent runs its own query loop (recursive — it can call tools too)
5. Optionally spawns more agents via `TeamCreateTool`
6. Agents communicate via `SendMessageTool`
7. Results merge back to parent agent
8. Parent model synthesizes final response

Key files: `tools/AgentTool/runAgent.ts`, `tools/AgentTool/agentColorManager.ts`, `tools/AgentTool/agentMemorySnapshot.ts`, `tools/TeamCreateTool/`, `tools/SendMessageTool/`

### Post-Scenario

After completing any scenario path, a prompt appears: "Try another path?" with links to the other three scenarios. Clicking one scrolls to the branch point without replaying the shared section.

### "See the Code" Panels

At every stage, a collapsible panel styled as a terminal window shows the relevant source code. Title bar displays the file path. Syntax-highlighted TypeScript with the key lines emphasized.

---

## Journey 2: Explore the Architecture (`/architecture`)

### Mechanic

Fractal zoom. Start at the highest-level view (5-6 boxes). Click any box and it smoothly zooms in via Framer Motion `layoutId` animations, revealing internal structure. Each level deeper shows more detail.

### Breadcrumb Navigation

Top of page shows zoom path: `Architecture > Tool System > Permission Pipeline`. Click any breadcrumb to jump back to that level.

### Persistent Minimap

Corner widget shows the Level 0 diagram with current location highlighted. Clickable for quick navigation.

### Level 0 — The Big Picture

Five top-level systems connected by arrows:

```
CLI Entry & Bootstrap
        |
Context & Configuration
        |
  Query Engine
        |
  Tool System
        |
  UI Renderer
```

### Level 1 — Subsystems (click any Level 0 box)

**CLI Entry & Bootstrap:**
- `entrypoints/cli.tsx` — bootstrap, fast-paths
- `main.tsx` — Commander.js CLI parser
- `entrypoints/init.ts` — core initialization
- `setup.ts` — session setup
- `bootstrap/state.ts` — module-level state
- Parallel prefetch pattern (MDM, keychain, GrowthBook)

**Context & Configuration:**
- `context.ts` — system/user context collection
- `utils/claudemd.ts` — CLAUDE.md file loading
- `memdir/` — persistent memory system
- `services/remoteManagedSettings/` — remote config
- `services/policyLimits/` — org policy enforcement
- `schemas/` — Zod config schemas
- `migrations/` — config migration scripts

**Query Engine:**
- `QueryEngine.ts` — core LLM API caller
- `query.ts` — query pipeline orchestrator
- `services/api/` — API client, errors, retry, logging
- `services/compact/` — auto-compact & context compression
- `cost-tracker.ts` — token cost tracking
- `services/analytics/` — GrowthBook feature flags

**Tool System:**
- `tools.ts` — tool registry
- `Tool.ts` — base types, `buildTool()`
- `tools/` — individual tool implementations (40+)
- `hooks/toolPermission/` — permission pipeline
- `hooks/useCanUseTool.tsx` — permission resolution
- `tools/AgentTool/` — sub-agent spawning
- `services/mcp/` — MCP server integration
- `services/lsp/` — LSP integration

**UI Renderer:**
- `components/` — 140+ React/Ink components
- `screens/REPL.tsx` — main interactive loop
- `ink/` — Ink renderer wrapper
- `state/` — AppState store + React context
- `keybindings/` — keyboard shortcut system
- `bridge/` — IDE integration (VS Code, JetBrains)

### Level 2 — Detail Views (click any Level 1 subsystem)

Not every subsystem needs Level 2. Priority Level 2 views:

- **Permission Pipeline** — modes (default, plan, bypass, auto), handler chain, denial tracking
- **Tool Call Loop** — how `query.ts` loops: API call -> tool_use -> execute -> tool_result -> API call
- **Agent Lifecycle** — fork, run, memory snapshot, color assignment, result merge
- **DCE & Feature Flags** — how `bun:bundle` `feature()` gates strip code at build time
- **Bridge Protocol** — JWT auth, message types, session runner, permission callbacks
- **MCP Integration** — server connection, transport types, tool/resource exposure
- **Auto-Compact** — token budget tracking, when compact triggers, how messages are summarized
- **Startup Optimization** — parallel prefetch, lazy loading, deferred heavy modules

### Node Content

Each node at any level displays:
- Diagram of internal components and connections
- Brief explanation of purpose and *why it exists*
- Data flow: what it receives, what it produces
- "Interesting detail" callouts for non-obvious patterns (circular dep breaks, lazy requires, etc.)

---

## Visual Design

### Color Palette

- Background: `#0a0a0f` (near-black) with subtle grid lines
- Primary text: `#e0e0e8` (soft white)
- Code/monospace: terminal green `#4afa82` or amber `#f0c050`
- Scenario colors: blue `#4a9afa` (simple), purple `#a855f7` (file edit), orange `#f97316` (bash), red `#ef4444` (agent swarm)
- Architecture zoom: deeper levels = more saturated colors

### Typography

- Headings: Inter (clean sans-serif)
- Body: system sans-serif stack
- Code & diagrams: JetBrains Mono (with ligatures)

### Animation

- Scroll-triggered: smooth fade/slide, never jarring
- Prompt packet: glowing dot with trailing particle effect
- Zoom transitions: ~400ms ease-in-out via Framer Motion `layoutId`
- Code panels: slide open, syntax highlighting with subtle typewriter effect
- Loading states: blinking cursor

### Terminal Touches

- Section headers styled as terminal commands: `$ trace --prompt "edit the auth middleware"`
- "See the code" panels look like terminal windows with file path in title bar
- Subtle CRT scanline overlay on hero section (very faint)

### Responsive

- Desktop: full experience with fixed pipeline sidebar
- Tablet: pipeline sidebar becomes scrollable inline
- Mobile: pipeline collapses to compact progress bar at top

---

## Technical Architecture

### Project Structure

```
journey-through-claude-code/
  src/
    app/                    Next.js app router pages
      page.tsx              Landing page
      follow-a-prompt/
        page.tsx            Journey 1
      architecture/
        page.tsx            Journey 2
    components/
      landing/              Landing page components
      pipeline/             Journey 1 pipeline visualization
      architecture/         Journey 2 zoom explorer
      shared/               Shared UI (code panels, terminal chrome, etc.)
    data/
      stages.ts             Journey 1 stage definitions & content
      architecture.ts       Journey 2 node tree & content
      code-snippets/        Source code excerpts for "see the code" panels
    lib/
      scroll.ts             Scroll tracking utilities
      zoom.ts               Zoom state management
    styles/
      globals.css           Tailwind config, terminal theme
  public/
    fonts/                  JetBrains Mono
  next.config.ts            Static export config
  tailwind.config.ts
  tsconfig.json
  package.json
```

### Key Dependencies

- `next` — framework, static export
- `framer-motion` — animations (scroll-triggered, layout, transitions)
- `tailwindcss` — styling
- `shiki` — syntax highlighting for code panels
- `react-intersection-observer` — scroll position tracking

### Data Model

Stage/node content is defined as TypeScript data structures, not fetched at runtime. Each stage includes:

```typescript
type PipelineStage = {
  id: string
  title: string
  subtitle: string          // terminal-style command
  description: string       // markdown content
  sourceFiles: {
    path: string            // e.g. "src/QueryEngine.ts"
    lineRange?: [number, number]
    highlights?: number[]   // lines to emphasize
    snippet: string         // extracted code
  }[]
  connections: string[]     // IDs of connected stages
  scenario?: 'simple' | 'file-edit' | 'bash' | 'agent-swarm'
}

type ArchitectureNode = {
  id: string
  level: 0 | 1 | 2
  parentId?: string
  title: string
  description: string
  sourceFiles: { path: string; snippet: string }[]
  interestingDetails?: string[]
  children?: string[]       // IDs of child nodes
  dataFlow?: {
    inputs: string[]
    outputs: string[]
  }
}
```

### Code Snippet Extraction

Code snippets are manually curated excerpts from the Claude Code source repo (`/Users/khan/claude-code-src/claude-code/src/`). They are copied into `src/data/code-snippets/` as plain text files at development time — the site has no runtime dependency on the source repo. Snippets are kept short (10-40 lines) focusing on the key logic for each stage, not full files.

### Static Export

`next.config.ts` sets `output: 'export'` for fully static HTML/CSS/JS. No server required. All content is baked in at build time.

---

## Scope Boundaries

**In scope:**
- Landing page with two journey cards
- Journey 1: shared path (4 stages) + 4 branching scenarios with scroll-driven animation
- Journey 2: 3 zoom levels (5 L0 nodes, ~20 L1 nodes, ~8-10 priority L2 nodes)
- Code panels with real source excerpts
- Responsive down to tablet (mobile is simplified but functional)

**Out of scope (for now):**
- Search functionality
- Deep-linking to specific stages/nodes (can add later)
- Editable/runnable code
- Comparison between Claude Code versions
- User accounts or saved progress
