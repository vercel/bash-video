import React from "react";
import { useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import { CURSOR_BLINK_FRAMES, TEXT_PRIMARY } from "../constants";

export const BlinkingCursor: React.FC<{
  color?: string;
  height?: number;
}> = ({ color = TEXT_PRIMARY, height = 16 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES * 0.4, CURSOR_BLINK_FRAMES * 0.5, CURSOR_BLINK_FRAMES * 0.9, CURSOR_BLINK_FRAMES],
    [1, 1, 0, 0, 1],
  );

  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height,
        backgroundColor: color,
        opacity,
        verticalAlign: "text-bottom",
        marginLeft: 1,
      }}
    />
  );
};
