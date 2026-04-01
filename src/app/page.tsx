import { GridBackground } from "@/components/shared/GridBackground";
import { Hero } from "@/components/landing/Hero";
import { JourneyCard } from "@/components/landing/JourneyCard";
import { FadeIn } from "@/components/shared/FadeIn";
import { CountUp } from "@/components/landing/CountUp";

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
        <FadeIn delay={0.6}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-terminal-green">
                <CountUp end={1884} />
              </div>
              <div className="text-sm text-text-muted mt-1">Files</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-terminal-green">
                <CountUp end={512} suffix="K+" />
              </div>
              <div className="text-sm text-text-muted mt-1">Lines of Code</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-terminal-green">
                <CountUp end={42} suffix="+" />
              </div>
              <div className="text-sm text-text-muted mt-1">Tools</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-terminal-green">
                <CountUp end={95} suffix="+" />
              </div>
              <div className="text-sm text-text-muted mt-1">Commands</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
