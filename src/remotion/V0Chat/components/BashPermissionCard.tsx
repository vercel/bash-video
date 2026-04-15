import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  BG_CARD,
  BG_SECONDARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER_SOLID,
  BORDER_ALPHA,
  BLUE_BUTTON,
  FONT_SANS,
  FONT_MONO,
} from "../constants";
import { TerminalIcon } from "./icons/TerminalIcon";
import { ChevronDownIcon } from "./icons/ChevronDown";

export const BashPermissionCard: React.FC<{
  command: string;
  enterFrame: number;
  allowClickFrame: number;
}> = ({ command, enterFrame, allowClickFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterFrame;

  // Entrance animation
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(localFrame, [0, 10], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Allow button click effect
  const clickLocalFrame = frame - allowClickFrame;
  const isClickActive = clickLocalFrame >= 0 && clickLocalFrame < 8;
  const buttonScale = isClickActive
    ? interpolate(clickLocalFrame, [0, 3, 8], [1, 0.93, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const isClicked = frame >= allowClickFrame;
  const buttonBrightness = isClickActive
    ? interpolate(clickLocalFrame, [0, 3, 8], [1, 1.2, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // After click: fade out card
  const postClickFrame = frame - allowClickFrame - 15;
  const cardFadeOut =
    postClickFrame > 0
      ? interpolate(postClickFrame, [0, 10], [1, 0.6], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <div
      style={{
        opacity: opacity * cardFadeOut,
        transform: `translateY(${translateY}px)`,
        maxWidth: 475,
        width: "100%",
        borderRadius: 8,
        border: `1px solid ${BORDER_ALPHA}`,
        backgroundColor: BG_CARD,
        overflow: "hidden",
        marginTop: 4,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: 10,
          borderBottom: `1px solid ${BORDER_SOLID}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TerminalIcon size={16} color={TEXT_SECONDARY} />
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "18px",
              color: TEXT_PRIMARY,
            }}
          >
            Bash
          </span>
        </div>
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            color: TEXT_SECONDARY,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Hide Details
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6.5L8 10.5L12 6.5"
              stroke={TEXT_SECONDARY}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 9.5L8 5.5L12 9.5"
              stroke={TEXT_SECONDARY}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          borderBottom: `1px solid ${BORDER_SOLID}`,
        }}
      >
        <p
          style={{
            fontFamily: FONT_SANS,
            fontSize: 14,
            color: TEXT_SECONDARY,
            margin: 0,
            lineHeight: "20px",
          }}
        >
          Run this command?
        </p>
        <pre
          style={{
            fontFamily: FONT_MONO,
            fontSize: 13,
            color: TEXT_SECONDARY,
            backgroundColor: BG_SECONDARY,
            borderRadius: 8,
            padding: "8px 12px",
            margin: 0,
            overflowX: "auto",
            border: `1px solid ${BORDER_SOLID}`,
            lineHeight: 1.5,
          }}
        >
          {command}
        </pre>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 10,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        {/* Skip button */}
        <button
          style={{
            fontFamily: FONT_SANS,
            fontSize: 13,
            fontWeight: 500,
            color: TEXT_PRIMARY,
            backgroundColor: "transparent",
            border: `1px solid ${BORDER_SOLID}`,
            borderRadius: 6,
            padding: "4px 12px",
            height: 28,
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Skip
        </button>

        {/* Allow button group */}
        <div
          style={{
            display: "flex",
            flex: 1,
            borderRadius: 6,
            overflow: "hidden",
            transform: `scale(${buttonScale})`,
            filter: `brightness(${buttonBrightness})`,
          }}
        >
          <button
            style={{
              fontFamily: FONT_SANS,
              fontSize: 13,
              fontWeight: 500,
              color: "#ffffff",
              backgroundColor: isClicked ? "#005ad4" : BLUE_BUTTON,
              border: "none",
              padding: "4px 12px",
              height: 28,
              cursor: "pointer",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Allow
          </button>
          <div
            style={{
              width: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <button
            style={{
              backgroundColor: isClicked ? "#005ad4" : BLUE_BUTTON,
              border: "none",
              padding: "0 6px",
              height: 28,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronDownIcon size={16} color="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  );
};
