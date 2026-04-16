import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  BG_SECONDARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  FONT_SANS,
} from "../constants";
import { BlinkingCursor } from "./BlinkingCursor";

/** V0 Max icon — concentric rounded squares */
const V0MaxIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M7 7.25C7 7.11193 7.11193 7 7.25 7H8.75C8.88807 7 9 7.11193 9 7.25V8.75C9 8.88807 8.88807 9 8.75 9H7.25C7.11193 9 7 8.88807 7 8.75V7.25Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M4 6C4 4.89543 4.89543 4 6 4L10 4C11.1046 4 12 4.89543 12 6V10C12 11.1046 11.1046 12 10 12H6C4.89543 12 4 11.1046 4 10L4 6Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M1 5C1 2.79086 2.79086 1 5 1L11 1C13.2091 1 15 2.79086 15 5V11C15 13.2091 13.2091 15 11 15H5C2.79086 15 1 13.2091 1 11V5Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

/** Chevron down small */
const ChevronDown: React.FC<{ size?: number; color?: string }> = ({
  size = 14,
  color = "currentColor",
}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M4.47 5.97a.75.75 0 0 1 1.06 0L8 8.44l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z"
      fill={color}
    />
  </svg>
);

/** Up arrow send icon */
const SendIcon: React.FC<{ color?: string }> = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 12V4M4 7l4-4 4 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatInputBar: React.FC<{
  typedText?: string;
  showCursor?: boolean;
  placeholder?: string;
  /** Frame at which the send button gets "clicked" */
  sendClickFrame?: number;
}> = ({
  typedText = "",
  showCursor = false,
  placeholder = "Ask v0 a question...",
  sendClickFrame,
}) => {
  const frame = useCurrentFrame();
  const isTyping = typedText.length > 0;

  // Send button click animation
  const clickActive = sendClickFrame != null && frame >= sendClickFrame && frame < sendClickFrame + 8;
  const buttonScale = clickActive
    ? interpolate(frame - sendClickFrame, [0, 3, 8], [1, 0.88, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        backgroundColor: BG_SECONDARY,
        width: "100%",
      }}
    >
      <div
        style={{
          padding: "12px 16px 16px",
          maxWidth: 640,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Prompt form container */}
        <div
          style={{
            backgroundColor: "#121212",
            border: "1px solid rgba(255,255,255,0.145)",
            borderRadius: 12,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Editor area */}
          <div
            style={{
              minHeight: 46,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 14,
                lineHeight: 1.5,
                color: isTyping ? TEXT_PRIMARY : "#454545",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                flex: 1,
              }}
            >
              {isTyping ? typedText : placeholder}
              {showCursor && <BlinkingCursor height={14} />}
            </span>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left side: + icon, v0 Max selector */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Plus icon */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3.5v9M3.5 8h9"
                    stroke={TEXT_MUTED}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* v0 Max model selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  height: 28,
                  borderRadius: 6,
                  padding: "0 2px",
                }}
              >
                <V0MaxIcon size={16} color={TEXT_SECONDARY} />
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    fontWeight: 500,
                  }}
                >
                  v0 Max
                </span>
                <ChevronDown size={14} color={TEXT_MUTED} />
              </div>
            </div>

            {/* Right side: send button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Send button — up arrow */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: isTyping ? TEXT_PRIMARY : "rgba(255,255,255,0.06)",
                  display: "grid",
                  placeItems: "center",
                  transform: `scale(${buttonScale})`,
                  transition: "background-color 0ms",
                }}
              >
                <SendIcon color={isTyping ? "#000" : TEXT_MUTED} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
