import React from "react";
import { TEXT_PRIMARY, FONT_SANS } from "../constants";
import { BlinkingCursor } from "./BlinkingCursor";

export const StreamingText: React.FC<{
  fullText: string;
  /** Number of characters currently visible */
  charsVisible: number;
  showCursor?: boolean;
  fontSize?: number;
  color?: string;
  lineHeight?: number;
}> = ({
  fullText,
  charsVisible,
  showCursor = true,
  fontSize = 15,
  color = TEXT_PRIMARY,
  lineHeight = 1.6,
}) => {
  const visibleText = fullText.slice(0, charsVisible);
  const isDone = charsVisible >= fullText.length;

  return (
    <span
      style={{
        fontFamily: FONT_SANS,
        fontSize,
        color,
        lineHeight,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {visibleText}
      {showCursor && !isDone && <BlinkingCursor height={fontSize} />}
    </span>
  );
};

/** Helper: compute how many characters should be visible given a frame offset and rate */
export function getCharsVisible(
  frame: number,
  totalChars: number,
  rate: number = 1,
): number {
  return Math.min(totalChars, Math.floor(frame / rate));
}
