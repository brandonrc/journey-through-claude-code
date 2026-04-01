import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { commandsCatalog, commandCategories } from "@/data/commands-catalog";
import { COMMAND_CATEGORY_LABELS, COMMAND_CATEGORY_COLORS } from "@/data/types";

export const metadata: Metadata = {
  title: "Command Explorer | Journey Through Claude Code",
  description: "Every slash command available in Claude Code — from /commit to /vim, organized by category.",
};

export default function CommandsPage() {
  const categories = commandCategories.map((key) => ({
    key,
    label: COMMAND_CATEGORY_LABELS[key],
    color: COMMAND_CATEGORY_COLORS[key],
  }));

  return (
    <CatalogGrid
      title="Command Explorer"
      subtitle="Every slash command available in Claude Code, sorted by what it does."
      command='help --commands --all'
      items={commandsCatalog}
      categories={categories}
    />
  );
}
