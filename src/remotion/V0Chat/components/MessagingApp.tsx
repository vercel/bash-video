import React from "react";
import {
  BG_SECONDARY,
  BORDER_SOLID,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
  FONT_MONO,
  GREEN,
} from "../constants";

/**
 * VOID // MSG messaging app mockup.
 * Matches the screenshot: sidebar with threads, main chat with messages.
 */
export const MessagingApp: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BG_SECONDARY,
        display: "flex",
        fontFamily: FONT_MONO,
        color: TEXT_PRIMARY,
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          borderRight: `1px solid ${BORDER_SOLID}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "16px 16px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                color: TEXT_PRIMARY,
              }}
            >
              VOID
            </span>
            <span
              style={{
                fontSize: 11,
                color: TEXT_MUTED,
                letterSpacing: 1,
              }}
            >
              //MSG
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              letterSpacing: 1.5,
              color: TEXT_MUTED,
              textTransform: "uppercase",
            }}
          >
            Monochrome Protocol v1.0
          </span>
        </div>

        {/* Threads header */}
        <div
          style={{
            padding: "16px 16px 8px",
            fontSize: 10,
            letterSpacing: 2,
            color: TEXT_MUTED,
            textTransform: "uppercase",
          }}
        >
          Threads //
        </div>

        {/* Thread list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            flex: 1,
          }}
        >
          <ThreadItem
            label="GRP"
            name="OFF-WHITE COLLECTIVE"
            preview="What does monochrome mean?"
            time="3H"
            count={0}
            active
          />
          <ThreadItem
            label="GRP"
            name="FEAR OF GOD"
            preview="what's up"
            time="4H"
            count={0}
          />
          <ThreadItem
            label="G"
            name="GHOST"
            preview="YO CHECK THIS"
            time="4H"
            count={0}
            dot
          />
          <ThreadItem
            label="Y"
            name="YOU"
            preview="ONLINE"
            previewColor={GREEN}
            time=""
            count={-1}
            dot
          />
        </div>
      </div>

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${BORDER_SOLID}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 4,
                backgroundColor: "#1a1a1a",
                border: `1px solid ${BORDER_SOLID}`,
                display: "grid",
                placeItems: "center",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                color: TEXT_SECONDARY,
              }}
            >
              GRP
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: TEXT_PRIMARY,
                }}
              >
                OFF-WHITE COLLECTIVE
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: TEXT_MUTED,
                  letterSpacing: 1,
                }}
              >
                4 MEMBERS
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: 1,
                color: TEXT_MUTED,
              }}
            >
              INFO
            </span>
            <span
              style={{
                fontSize: 11,
                letterSpacing: 1,
                color: TEXT_MUTED,
              }}
            >
              MUTE
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "hidden",
          }}
        >
          <ChatMsg sender="GHOST" time="15:30">
            <MsgBubble>THE NEW DROP IS IMMINENT</MsgBubble>
          </ChatMsg>
          <ChatMsg sender="VOID" time="15:30">
            <MsgBubble>STAY READY</MsgBubble>
          </ChatMsg>
          <ChatMsg sender="SHADOW" time="15:30">
            <MsgBubble>MONOCHROME SEASON</MsgBubble>
          </ChatMsg>
          {/* User message - right aligned */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <div
              style={{
                backgroundColor: TEXT_PRIMARY,
                color: BG_SECONDARY,
                borderRadius: 4,
                padding: "12px 16px",
                fontSize: 13,
                lineHeight: 1.5,
                letterSpacing: 0.5,
                maxWidth: "60%",
              }}
            >
              What does monochrome mean?
            </div>
            <span
              style={{
                fontSize: 10,
                color: TEXT_MUTED,
                letterSpacing: 1,
              }}
            >
              16:15
            </span>
          </div>
        </div>

        {/* Message input */}
        <div
          style={{
            padding: "12px 20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                border: `1px solid ${BORDER_SOLID}`,
                borderRadius: 4,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  color: TEXT_MUTED,
                  textTransform: "uppercase",
                }}
              >
                Type your message...
              </span>
            </div>
            <button
              style={{
                border: `1px solid ${BORDER_SOLID}`,
                borderRadius: 4,
                backgroundColor: "transparent",
                color: TEXT_PRIMARY,
                fontSize: 11,
                fontFamily: FONT_MONO,
                letterSpacing: 2,
                padding: "12px 20px",
                cursor: "pointer",
              }}
            >
              SEND
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 9,
                letterSpacing: 1.5,
                color: TEXT_MUTED,
                textTransform: "uppercase",
              }}
            >
              Enter to send // Shift+Enter for new line
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: 1,
                color: TEXT_MUTED,
              }}
            >
              0 / 10K
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreadItem: React.FC<{
  label: string;
  name: string;
  preview: string;
  previewColor?: string;
  time: string;
  count: number;
  active?: boolean;
  dot?: boolean;
}> = ({ label, name, preview, previewColor, time, count, active, dot }) => (
  <div
    style={{
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderLeft: active ? `2px solid ${TEXT_PRIMARY}` : "2px solid transparent",
      backgroundColor: active ? "#0a0a0a" : "transparent",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: "#1a1a1a",
        border: `1px solid ${BORDER_SOLID}`,
        display: "grid",
        placeItems: "center",
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 1,
        color: TEXT_SECONDARY,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {label}
      {dot && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: -2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: GREEN,
          }}
        />
      )}
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: TEXT_PRIMARY,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </span>
        {time && (
          <span
            style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: 1 }}
          >
            {time}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: previewColor || TEXT_MUTED,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {preview}
        </span>
        {count >= 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_PRIMARY,
            }}
          >
            {count}
          </span>
        )}
      </div>
    </div>
  </div>
);

const ChatMsg: React.FC<{
  sender: string;
  time: string;
  children: React.ReactNode;
}> = ({ sender, time, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2,
        color: TEXT_MUTED,
        textTransform: "uppercase",
      }}
    >
      {sender}
    </span>
    {children}
    <span
      style={{
        fontSize: 10,
        color: TEXT_MUTED,
        letterSpacing: 1,
      }}
    >
      {time}
    </span>
  </div>
);

const MsgBubble: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      backgroundColor: "#111",
      border: `1px solid ${BORDER_SOLID}`,
      borderRadius: 4,
      padding: "12px 16px",
      fontSize: 13,
      lineHeight: 1.5,
      letterSpacing: 1,
      color: TEXT_PRIMARY,
      fontWeight: 700,
      maxWidth: "fit-content",
    }}
  >
    {children}
  </div>
);
