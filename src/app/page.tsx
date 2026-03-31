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
