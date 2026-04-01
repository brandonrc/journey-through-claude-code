import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { toolsCatalog, toolCategories } from "@/data/tools-catalog";
import { TOOL_CATEGORY_LABELS, TOOL_CATEGORY_COLORS } from "@/data/types";

export const metadata: Metadata = {
  title: "Tool Catalog | Journey Through Claude Code",
  description: "All 42+ tools that give Claude Code the ability to act — read files, run commands, spawn agents, and more.",
};

export default function ToolsPage() {
  const categories = toolCategories.map((key) => ({
    key,
    label: TOOL_CATEGORY_LABELS[key],
    color: TOOL_CATEGORY_COLORS[key],
  }));

  return (
    <CatalogGrid
      title="Tool Catalog"
      subtitle="Every tool Claude Code can invoke — from file operations to agent swarms."
      command='list --tools --all --categorized'
      items={toolsCatalog}
      categories={categories}
    />
  );
}
