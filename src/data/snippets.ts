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
