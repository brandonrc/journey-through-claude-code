"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/follow-a-prompt", label: "Follow a Prompt" },
  { href: "/architecture", label: "Architecture" },
  { href: "/tools", label: "Tools" },
  { href: "/commands", label: "Commands" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
        <Link href="/" className="font-mono text-sm text-terminal-green shrink-0">
          ~/claude-code
        </Link>
        <div className="flex gap-4 md:gap-6 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors whitespace-nowrap ${
                pathname === link.href
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
