import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  BG_SECONDARY,
  BORDER_SOLID,
  FONT_MONO,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  GREEN,
  RED,
} from "../constants";
import { BlinkingCursor } from "./BlinkingCursor";

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
  enterFrame: number;
  charsVisible?: number;
  showCursor?: boolean;
}> = ({ lines, enterFrame, charsVisible, showCursor = true }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;

  if (localFrame < 0) return null;

  const isStreaming = charsVisible !== undefined;
  const fullText = lines.join("\n");
  const visibleText = isStreaming ? fullText.slice(0, charsVisible) : fullText;
  const visibleLines = isStreaming ? visibleText.split("\n") : lines;
  const isDone = !isStreaming || charsVisible >= fullText.length;

  // Fade + slide entrance only when not streaming
  const opacity = isStreaming
    ? 1
    : interpolate(localFrame, [0, 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const translateY = isStreaming
    ? 0
    : interpolate(localFrame, [0, 10], [16, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  if (isStreaming && charsVisible <= 0) return null;

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
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {visibleLines.map((line, i) => (
        <React.Fragment key={i}>
          {colorDiffLine(line)}
          {i < visibleLines.length - 1 && "\n"}
        </React.Fragment>
      ))}
      {isStreaming && showCursor && !isDone && <BlinkingCursor height={13} />}
    </pre>
  );
};
