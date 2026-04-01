import type { Metadata } from "next";
import { ArchitectureView } from "@/components/architecture/ArchitectureView";

export const metadata: Metadata = {
  title: "Architecture Explorer | Journey Through Claude Code",
  description:
    "Zoom into Claude Code's architecture layer by layer — from the CLI entry point through the query engine, tool system, and UI renderer.",
};

export default function Architecture() {
  return <ArchitectureView />;
}
