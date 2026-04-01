import type { Metadata } from "next";
import { PipelineView } from "@/components/pipeline/PipelineView";

export const metadata: Metadata = {
  title: "Follow a Prompt | Journey Through Claude Code",
  description:
    "Watch what happens when you hit Enter in Claude Code — trace a prompt through input capture, context assembly, the API call, and four branching scenarios.",
};

export default function FollowAPrompt() {
  return <PipelineView />;
}
