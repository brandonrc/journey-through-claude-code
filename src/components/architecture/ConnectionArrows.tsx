"use client";

type Props = {
  nodeCount: number;
  direction?: "vertical" | "grid";
};

export function ConnectionArrows({ nodeCount, direction = "grid" }: Props) {
  if (direction === "vertical" || nodeCount <= 1) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none z-0" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-border)" />
          <stop offset="50%" stopColor="var(--color-text-muted)" />
          <stop offset="100%" stopColor="var(--color-border)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
