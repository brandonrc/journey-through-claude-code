type Props = {
  command: string;
};

export function SectionHeader({ command }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-terminal-green font-mono">$</span>
      <span className="font-mono text-text-secondary">{command}</span>
      <span className="text-terminal-green font-mono animate-pulse">{"\u258A"}</span>
    </div>
  );
}
