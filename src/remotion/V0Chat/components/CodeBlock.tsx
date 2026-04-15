import React from "react";
import {
  BG_SECONDARY,
  BORDER_SOLID,
  FONT_MONO,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  GREEN,
  RED,
  LINE_REVEAL_RATE,
} from "../constants";

function colorDiffLine(line: string): React.ReactNode {
  if (line.startsWith("+")) {
    return (
      <span style={{ color: GREEN }}>
        <span
          style={{
            backgroundColor: "rgba(34,197,94,0.1)",
            display: "inline",
          }}
        >
          {line}
        </span>
      </span>
    );
  }
  if (line.startsWith("-")) {
    return (
      <span style={{ color: RED }}>
        <span
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            display: "inline",
          }}
        >
          {line}
        </span>
      </span>
    );
  }
  if (line.startsWith("//")) {
    return <span style={{ color: TEXT_TERTIARY }}>{line}</span>;
  }
  return <span style={{ color: TEXT_SECONDARY }}>{line}</span>;
}

export const CodeBlock: React.FC<{
  lines: string[];
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
          {colorDiffLine(line)}
          {i < visibleLines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </pre>
  );
};
