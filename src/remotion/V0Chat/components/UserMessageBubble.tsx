import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BG_BUBBLE, TEXT_PRIMARY, FONT_SANS, BORDER_SOLID } from "../constants";

export const UserMessageBubble: React.FC<{
  text: string;
  enterFrame: number;
}> = ({ text, enterFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(localFrame, [0, 8], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(localFrame, [0, 8], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: "bottom right",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          backgroundColor: BG_BUBBLE,
          border: `1px solid ${BORDER_SOLID}`,
          borderRadius: 16,
          padding: "6px 12px",
        }}
      >
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 15,
            lineHeight: 1.6,
            color: TEXT_PRIMARY,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
