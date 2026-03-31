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
