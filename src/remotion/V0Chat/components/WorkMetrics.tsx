import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  FONT_SANS,
  BORDER_ALPHA,
} from "../constants";

export const WorkMetrics: React.FC<{
  enterFrame: number;
  seconds: number;
  actions: number;
  filesModified: number;
  linesRead: number;
  codeAdded: number;
  codeRemoved: number;
}> = ({
  enterFrame,
  seconds,
  actions,
  filesModified,
  linesRead,
  codeAdded,
  codeRemoved,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginTop: 8,
      }}
    >
      {/* Worked for label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Activity icon */}
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M1 8h3l2-5 4 10 2-5h3"
            stroke={TEXT_TERTIARY}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            color: TEXT_SECONDARY,
          }}
        >
          Worked for {seconds}s
        </span>
      </div>

      {/* Metrics divider */}
      <div
        style={{
          width: 1,
          height: 14,
          backgroundColor: BORDER_ALPHA,
        }}
      />

      {/* Time icon + clock */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.25" stroke={TEXT_TERTIARY} strokeWidth="1.5" />
          <path d="M8 4.5V8l2.5 1.5" stroke={TEXT_TERTIARY} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            color: TEXT_TERTIARY,
          }}
        >
          4:23
        </span>
      </div>
    </div>
  );
};
