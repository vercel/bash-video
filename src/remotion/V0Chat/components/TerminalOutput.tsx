import React from "react";
import {
  BG_SECONDARY,
  BORDER_SOLID,
  FONT_MONO,
  TEXT_SECONDARY,
  GREEN,
  RED,
  TEXT_TERTIARY,
  TEXT_PRIMARY,
  LINE_REVEAL_RATE,
} from "../constants";

function colorLine(line: string): React.ReactNode {
  // Checkmark lines (pass)
  if (line.trimStart().startsWith("✓")) {
    return <span style={{ color: GREEN }}>{line}</span>;
  }
  // Fail lines
  if (line.trimStart().startsWith("✗")) {
    return <span style={{ color: RED }}>{line}</span>;
  }
  // Summary lines with counts
  if (line.includes("passed") && line.includes("failed")) {
    const parts = line.split(/(passed|failed)/);
    return (
      <span>
        {parts.map((part, i) => {
          if (part === "passed")
            return (
              <span key={i} style={{ color: GREEN }}>
                passed
              </span>
            );
          if (part === "failed")
            return (
              <span key={i} style={{ color: RED }}>
                failed
              </span>
            );
          return (
            <span key={i} style={{ color: TEXT_PRIMARY }}>
              {part}
            </span>
          );
        })}
      </span>
    );
  }
  // Test file summaries
  if (line.includes("passed") || line.includes("Tests") || line.includes("Duration") || line.includes("Test Files")) {
    return <span style={{ color: TEXT_PRIMARY }}>{line}</span>;
  }
  // Timing info
  if (line.match(/\d+ms$/)) {
    return <span style={{ color: TEXT_TERTIARY }}>{line}</span>;
  }
  return <span style={{ color: TEXT_SECONDARY }}>{line}</span>;
}

export const TerminalOutput: React.FC<{
  lines: string[];
  /** Frames elapsed since this block started appearing */
  localFrame: number;
  lineRate?: number;
}> = ({ lines, localFrame, lineRate = LINE_REVEAL_RATE }) => {
  const visibleCount = Math.min(
    lines.length,
    Math.max(0, Math.floor(localFrame / lineRate)),
  );
  const visibleLines = lines.slice(0, visibleCount);

  if (visibleCount === 0) return null;

  return (
    <pre
      style={{
        fontFamily: FONT_MONO,
        fontSize: 13,
        lineHeight: 1.6,
        color: TEXT_SECONDARY,
        backgroundColor: BG_SECONDARY,
        border: `1px solid ${BORDER_SOLID}`,
        borderRadius: 8,
        padding: "8px 12px",
        margin: 0,
        overflow: "hidden",
        whiteSpace: "pre-wrap",
      }}
    >
      {visibleLines.map((line, i) => (
        <React.Fragment key={i}>
          {colorLine(line)}
          {i < visibleLines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </pre>
  );
};
