import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NavBar } from "@/components/shared/NavBar";
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
  metadataBase: new URL("https://brandonrc.github.io"),
  openGraph: {
    title: "Journey Through Claude Code",
    description:
      "What happens when you type a prompt into Claude Code? Trace it through every system — input capture, context assembly, the API call, tool execution, and agent swarms.",
    url: "https://brandonrc.github.io/journey-through-claude-code/",
    siteName: "Journey Through Claude Code",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journey Through Claude Code",
    description:
      "Interactive architecture exploration of Anthropic's CLI. Follow a prompt through the pipeline or zoom into every layer.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <NavBar />
        <div className="pt-14">{children}</div>
        <footer className="border-t border-border py-8 px-6 mt-16">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <p className="text-xs text-text-muted font-mono">
              Unofficial. Not affiliated with or endorsed by Anthropic.
            </p>
            <p className="text-xs text-text-muted">
              Based on publicly available source code extracted from npm source maps.
              Content may be inaccurate or outdated. For educational purposes only.
            </p>
            <p className="text-xs text-text-muted">
              Claude Code and Claude are trademarks of{" "}
              <a
                href="https://www.anthropic.com"
                className="text-text-secondary hover:text-terminal-green transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic, PBC
              </a>
              . All original source code is the property of Anthropic.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
