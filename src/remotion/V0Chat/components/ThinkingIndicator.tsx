import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { BrainIcon } from "./icons/BrainIcon";
import {
  TEXT_TERTIARY,
  TEXT_SECONDARY,
  FONT_SANS,
  SHIMMER_CYCLE_FRAMES,
} from "../constants";

export const ThinkingIndicator: React.FC<{
  phase: "thinking" | "done";
  durationText?: string;
}> = ({ phase, durationText = "2s" }) => {
  const frame = useCurrentFrame();

  // Shimmer: animate a highlight that sweeps across the text
  const shimmerX = interpolate(
    frame % SHIMMER_CYCLE_FRAMES,
    [0, SHIMMER_CYCLE_FRAMES],
    [-100, 200],
  );

  const textContent =
    phase === "thinking" ? "Thinking" : `Thought for ${durationText}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        minHeight: 24,
      }}
    >
      <BrainIcon size={13} color={TEXT_TERTIARY} />
      <span
        style={{
          fontFamily: FONT_SANS,
          fontSize: 13,
          lineHeight: "18px",
          color: TEXT_SECONDARY,
          ...(phase === "thinking"
            ? {
                backgroundImage: `linear-gradient(90deg, ${TEXT_SECONDARY} 0%, ${TEXT_TERTIARY} 40%, #ededed 50%, ${TEXT_TERTIARY} 60%, ${TEXT_SECONDARY} 100%)`,
                backgroundSize: "200% 100%",
                backgroundPositionX: `${shimmerX}%`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
            : {}),
        }}
      >
        {textContent}
      </span>
    </div>
  );
};
