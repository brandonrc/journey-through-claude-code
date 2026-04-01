"use client";

type Props = {
  view: "grid" | "treemap";
  onChange: (view: "grid" | "treemap") => void;
};

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange("grid")}
        className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
          view === "grid" ? "bg-terminal-green/20 text-terminal-green" : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Zoom Explorer
      </button>
      <button
        onClick={() => onChange("treemap")}
        className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
          view === "treemap" ? "bg-terminal-green/20 text-terminal-green" : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Size Treemap
      </button>
    </div>
  );
}
