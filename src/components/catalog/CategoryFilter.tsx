"use client";

type Props = {
  categories: { key: string; label: string; color: string; count: number }[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
};

export function CategoryFilter({ categories, activeCategory, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
          activeCategory === null
            ? "bg-terminal-green/20 text-terminal-green border border-terminal-green/40"
            : "bg-bg-surface text-text-muted border border-border hover:text-text-secondary"
        }`}
      >
        All ({categories.reduce((sum, c) => sum + c.count, 0)})
      </button>
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(activeCategory === cat.key ? null : cat.key)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors border ${
            activeCategory === cat.key ? "opacity-100" : "opacity-60 hover:opacity-80"
          }`}
          style={{
            borderColor: activeCategory === cat.key ? cat.color : `${cat.color}40`,
            backgroundColor: activeCategory === cat.key ? `${cat.color}15` : "transparent",
            color: cat.color,
          }}
        >
          {cat.label} ({cat.count})
        </button>
      ))}
    </div>
  );
}
