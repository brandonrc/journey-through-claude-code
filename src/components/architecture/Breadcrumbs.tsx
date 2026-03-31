"use client";

import type { ZoomPath } from "@/lib/useZoom";

type Props = {
  path: ZoomPath;
  onNavigate: (index: number) => void;
};

export function Breadcrumbs({ path, onNavigate }: Props) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm mb-8">
      <button
        onClick={() => onNavigate(-1)}
        className={`transition-colors ${path.length === 0 ? "text-text-primary" : "text-text-muted hover:text-terminal-green"}`}
      >
        Architecture
      </button>
      {path.map((crumb, i) => (
        <span key={crumb.id} className="flex items-center gap-2">
          <span className="text-text-muted">/</span>
          <button
            onClick={() => onNavigate(i)}
            className={`transition-colors ${i === path.length - 1 ? "text-text-primary" : "text-text-muted hover:text-terminal-green"}`}
          >
            {crumb.title}
          </button>
        </span>
      ))}
    </div>
  );
}
