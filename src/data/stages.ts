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
          path: "src/query.ts — tool call loop",
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
