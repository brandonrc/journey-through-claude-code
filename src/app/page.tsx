import { GridBackground } from "@/components/shared/GridBackground";
import { TerminalWindow } from "@/components/shared/TerminalWindow";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeIn } from "@/components/shared/FadeIn";
import { CrtOverlay } from "@/components/shared/CrtOverlay";
import { CodePanel } from "@/components/shared/CodePanel";

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
    </main>
  );
}
