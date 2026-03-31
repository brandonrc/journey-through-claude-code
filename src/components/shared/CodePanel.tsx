"use client";

import { useState, useEffect } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { highlightCode } from "@/lib/highlights";

type Props = {
  filePath: string;
  code: string;
  language?: "typescript" | "tsx";
  highlightLines?: number[];
  defaultOpen?: boolean;
};

export function CodePanel({
  filePath,
  code,
  language = "typescript",
  highlightLines = [],
  defaultOpen = false,
}: Props) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    highlightCode(code, language).then(setHtml);
  }, [code, language]);

  return (
    <TerminalWindow title={filePath} collapsible defaultOpen={defaultOpen}>
      {html ? (
        <div className="relative">
          <div
            className="[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          {highlightLines.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {highlightLines.map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 bg-terminal-green/10 border-l-2 border-terminal-green"
                  style={{
                    top: `${(line - 1) * 1.5}rem`,
                    height: "1.5rem",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <pre className="text-sm text-text-muted">
          <span className="animate-pulse">Loading...</span>
        </pre>
      )}
    </TerminalWindow>
  );
}
