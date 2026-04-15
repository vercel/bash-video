import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

import { ChatInputBar } from "./components/ChatInputBar";
import { UserMessageBubble } from "./components/UserMessageBubble";
import { AssistantMessage } from "./components/AssistantMessage";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { StreamingText, getCharsVisible } from "./components/StreamingText";
import { BashPermissionCard } from "./components/BashPermissionCard";
import { RichTaskBlock } from "./components/RichTaskBlock";
import { TerminalOutput } from "./components/TerminalOutput";
import { CodeBlock } from "./components/CodeBlock";
import { WorkMetrics } from "./components/WorkMetrics";
import { MessagingApp } from "./components/MessagingApp";
import { GlobeIcon } from "./components/icons/GlobeIcon";
import { WrenchIcon } from "./components/icons/WrenchIcon";

import {
  BG_PRIMARY,
  BG_SECONDARY,
  BORDER_SOLID,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  FONT_SANS,
  FONT_MONO,
  CHAT_MAX_WIDTH,
  CHAT_PADDING,
  MESSAGE_GAP,
  CHAR_REVEAL_RATE,
  GREEN,
} from "./constants";

import {
  USER_PROMPT,
  ASSISTANT_STREAMING_TEXT,
  BASH_COMMAND,
  BROWSER_COMMAND,
  BROWSER_OUTPUT_LINES,
  VITEST_OUTPUT_LINES,
  REPORT_TEXT,
  FIX_CODE_LINES,
  SCENES,
} from "./script";

const { fontFamily } = loadFont();

// Height of the visible message area (total height minus prompt form ~110px)
const MESSAGE_AREA_HEIGHT = 720 - 110;

// Approximate height of each element type for scroll calculation
const APPROX_HEIGHTS = {
  userBubble: 110,
  thinking: 32,
  streamingLineHeight: 24,
  streamingCharsPerLine: 55,
  permissionCard: 220,
  richTaskHeader: 36,
  terminalLineHeight: 22,
  terminalPadding: 32,
  codeLineHeight: 22,
  codePadding: 32,
  reportLineHeight: 26,
  reportCharsPerLine: 55,
  workMetrics: 55,
  successMessage: 44,
  gap: MESSAGE_GAP,
};

/**
 * Content-aware scroll: calculate total content height at current frame,
 * then scroll just enough to keep the bottom content visible.
 */
function getContentHeight(frame: number): number {
  let h = CHAT_PADDING; // top padding

  // User bubble
  if (frame >= SCENES.messageSent.start) {
    h += APPROX_HEIGHTS.userBubble + APPROX_HEIGHTS.gap;
  }

  // Thinking
  if (frame >= SCENES.thinking.start) {
    h += APPROX_HEIGHTS.thinking + APPROX_HEIGHTS.gap;
  }

  // Streaming text - grows as characters appear
  if (frame >= SCENES.streaming.start) {
    const chars = getCharsVisible(
      frame - SCENES.streaming.start,
      ASSISTANT_STREAMING_TEXT.length,
      CHAR_REVEAL_RATE,
    );
    const lines = Math.max(
      1,
      Math.ceil(chars / APPROX_HEIGHTS.streamingCharsPerLine),
    );
    h += lines * APPROX_HEIGHTS.streamingLineHeight + APPROX_HEIGHTS.gap;
  }

  // Permission card
  if (frame >= SCENES.permissionCard.start) {
    h += APPROX_HEIGHTS.permissionCard + APPROX_HEIGHTS.gap;
  }

  // Agent browser task
  // Running tests task (first, right after Allow)
  if (frame >= SCENES.runningTests.start) {
    const localFrame = frame - SCENES.runningTests.start - 10;
    const visibleLines = Math.min(
      VITEST_OUTPUT_LINES.length,
      Math.max(0, Math.floor(localFrame / 5)),
    );
    h +=
      APPROX_HEIGHTS.richTaskHeader +
      visibleLines * APPROX_HEIGHTS.terminalLineHeight +
      APPROX_HEIGHTS.terminalPadding +
      APPROX_HEIGHTS.gap;
  }

  // Agent browser task (after tests)
  if (frame >= SCENES.agentBrowser.start) {
    const localFrame = frame - SCENES.agentBrowser.start - 10;
    const visibleLines = Math.min(
      BROWSER_OUTPUT_LINES.length + 2,
      Math.max(0, Math.floor(localFrame / 5)),
    );
    h +=
      APPROX_HEIGHTS.richTaskHeader +
      visibleLines * APPROX_HEIGHTS.terminalLineHeight +
      APPROX_HEIGHTS.terminalPadding +
      APPROX_HEIGHTS.gap;
  }

  // Report - grows as characters appear
  if (frame >= SCENES.report.start) {
    const chars = getCharsVisible(
      frame - SCENES.report.start,
      REPORT_TEXT.length,
      CHAR_REVEAL_RATE,
    );
    const lines = Math.max(
      1,
      Math.ceil(chars / APPROX_HEIGHTS.reportCharsPerLine),
    );
    h += lines * APPROX_HEIGHTS.reportLineHeight + APPROX_HEIGHTS.gap;
  }

  // Autofix code
  if (frame >= SCENES.autofix.start) {
    const localFrame = frame - SCENES.autofix.start;
    const visibleLines = Math.min(
      FIX_CODE_LINES.length,
      Math.max(0, Math.floor(localFrame / 4)),
    );
    h +=
      visibleLines * APPROX_HEIGHTS.codeLineHeight +
      APPROX_HEIGHTS.codePadding +
      APPROX_HEIGHTS.gap;

    // Success message
    if (frame >= SCENES.autofix.start + FIX_CODE_LINES.length * 4 + 10) {
      h += APPROX_HEIGHTS.successMessage + APPROX_HEIGHTS.gap;
    }
  }

  // Work metrics
  if (frame >= SCENES.workMetrics.start) {
    h += APPROX_HEIGHTS.workMetrics;
  }

  h -= 80; // bottom spacer

  return h;
}

function getScrollY(frame: number): number {
  const contentH = getContentHeight(frame);
  const overflow = contentH - MESSAGE_AREA_HEIGHT;
  return Math.max(0, overflow);
}

export const V0ChatComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Intro swipe animation ===
  const swipeStarted = frame >= SCENES.swipeTransition.start;
  const swipeProgress = swipeStarted
    ? spring({
        frame: frame - SCENES.swipeTransition.start,
        fps,
        config: {
          damping: 14,
          stiffness: 80,
          mass: 0.8,
        },
      })
    : 0;
  // Messaging app slides from 0 to -100% of width
  const appTranslateX = interpolate(swipeProgress, [0, 1], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Chat panel slides from 100% to 0
  const chatTranslateX = interpolate(swipeProgress, [0, 1], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showChat = frame >= SCENES.swipeTransition.start;

  // — Scroll —
  const scrollY = useMemo(() => getScrollY(frame), [frame]);

  // — Input bar state —
  const isTypingPhase =
    frame >= SCENES.userTyping.start && frame < SCENES.userTyping.end;
  // Text stays visible after typing until the send click
  const showTypedText =
    frame >= SCENES.userTyping.start && frame < SCENES.sendClick.start + 5;
  const typingProgress = isTypingPhase
    ? Math.min(
        USER_PROMPT.length,
        Math.floor(
          ((frame - SCENES.userTyping.start) /
            (SCENES.userTyping.end - SCENES.userTyping.start)) *
            USER_PROMPT.length,
        ),
      )
    : USER_PROMPT.length;
  const inputTypedText = showTypedText
    ? USER_PROMPT.slice(0, typingProgress)
    : "";

  // — Thinking phase —
  const thinkingPhase: "hidden" | "thinking" | "done" =
    frame < SCENES.thinking.start
      ? "hidden"
      : frame < SCENES.thinking.start + 45
        ? "thinking"
        : "done";

  // — Streaming text —
  const streamingActive = frame >= SCENES.streaming.start;
  const streamingChars = streamingActive
    ? getCharsVisible(
        frame - SCENES.streaming.start,
        ASSISTANT_STREAMING_TEXT.length,
        CHAR_REVEAL_RATE,
      )
    : 0;
  const streamingDone = streamingChars >= ASSISTANT_STREAMING_TEXT.length;

  // — Permission card —
  const showPermissionCard = frame >= SCENES.permissionCard.start;

  // — Agent browser —
  const showAgentBrowser = frame >= SCENES.agentBrowser.start;
  const agentBrowserActive =
    frame >= SCENES.agentBrowser.start && frame < SCENES.agentBrowser.end;

  // — Running tests —
  const showRunningTests = frame >= SCENES.runningTests.start;
  const runningTestsActive =
    frame >= SCENES.runningTests.start && frame < SCENES.runningTests.end;

  // — Report —
  const showReport = frame >= SCENES.report.start;
  const reportChars = showReport
    ? getCharsVisible(
        frame - SCENES.report.start,
        REPORT_TEXT.length,
        CHAR_REVEAL_RATE,
      )
    : 0;
  const reportDone = reportChars >= REPORT_TEXT.length;

  // — Autofix —
  const showAutofix = frame >= SCENES.autofix.start;

  // — Work metrics —
  const showWorkMetrics = frame >= SCENES.workMetrics.start;

  const inputPlaceholder = "Ask v0 a question...";

  // Height of the prompt form area (fixed at bottom)
  const PROMPT_BAR_HEIGHT = 110;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_SECONDARY, overflow: "hidden" }}>
      {/* === Background layers (swipe behind the prompt form) === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: PROMPT_BAR_HEIGHT,
          overflow: "hidden",
        }}
      >
        {/* Messaging app layer — slides left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${appTranslateX}%)`,
            zIndex: swipeProgress >= 1 ? 0 : 2,
            opacity: swipeProgress >= 1 ? 0 : 1,
          }}
        >
          <MessagingApp />
        </div>

        {/* Chat panel layer — slides in from right */}
        {showChat && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transform: `translateX(${chatTranslateX}%)`,
              zIndex: 1,
              backgroundColor: BG_PRIMARY,
            }}
          >
            {/* Messages area — fills the space above the prompt form */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: `translateY(-${scrollY}px)`,
                  padding: `${CHAT_PADDING}px`,
                  maxWidth: CHAT_MAX_WIDTH,
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: MESSAGE_GAP,
                  fontFamily: fontFamily,
                }}
              >
                {/* === User message === */}
                {frame >= SCENES.messageSent.start && (
                  <UserMessageBubble
                    text={USER_PROMPT}
                    enterFrame={SCENES.messageSent.start}
                  />
                )}

                {/* === Thinking === */}
                {thinkingPhase !== "hidden" && (
                  <AssistantMessage>
                    <ThinkingIndicator
                      phase={thinkingPhase === "thinking" ? "thinking" : "done"}
                      durationText="2s"
                    />
                  </AssistantMessage>
                )}

                {/* === Streaming response === */}
                {streamingActive && (
                  <AssistantMessage>
                    <StreamingText
                      fullText={ASSISTANT_STREAMING_TEXT}
                      charsVisible={streamingChars}
                      showCursor={!streamingDone}
                    />
                  </AssistantMessage>
                )}

                {/* === Permission card === */}
                {showPermissionCard && (
                  <AssistantMessage>
                    <BashPermissionCard
                      command={BASH_COMMAND}
                      enterFrame={SCENES.permissionCard.start}
                      allowClickFrame={SCENES.permissionCard.allowClick}
                    />
                  </AssistantMessage>
                )}

                {/* === Running tests task (right after Allow click) === */}
                {showRunningTests && (
                  <AssistantMessage>
                    <RichTaskBlock
                      icon={<WrenchIcon size={13} />}
                      activeTitle="Running some commands"
                      completeTitle="Ran some commands"
                      isActive={runningTestsActive}
                      enterFrame={SCENES.runningTests.start}
                      duration="5s"
                    >
                      <TerminalOutput
                        lines={VITEST_OUTPUT_LINES}
                        localFrame={frame - SCENES.runningTests.start - 10}
                      />
                    </RichTaskBlock>
                  </AssistantMessage>
                )}

                {/* === Agent browser task === */}
                {showAgentBrowser && (
                  <AssistantMessage>
                    <RichTaskBlock
                      icon={<GlobeIcon size={13} />}
                      activeTitle="Opening app in browser"
                      completeTitle="Opened app in browser"
                      isActive={agentBrowserActive}
                      enterFrame={SCENES.agentBrowser.start}
                      duration="3s"
                    >
                      <TerminalOutput
                        lines={[
                          `$ ${BROWSER_COMMAND}`,
                          "",
                          ...BROWSER_OUTPUT_LINES,
                        ]}
                        localFrame={frame - SCENES.agentBrowser.start - 10}
                      />
                    </RichTaskBlock>
                  </AssistantMessage>
                )}

                {/* === Report === */}
                {showReport && (
                  <AssistantMessage>
                    <ReportContent
                      charsVisible={reportChars}
                      showCursor={!reportDone}
                    />
                  </AssistantMessage>
                )}

                {/* === Autofix code === */}
                {showAutofix && (
                  <AssistantMessage>
                    <CodeBlock
                      lines={FIX_CODE_LINES}
                      localFrame={frame - SCENES.autofix.start}
                      lineRate={4}
                    />
                    {/* Success message after code appears */}
                    {frame >=
                      SCENES.autofix.start + FIX_CODE_LINES.length * 4 + 10 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <circle cx="8" cy="8" r="7" fill={GREEN} />
                          <path
                            d="M5 8l2 2 4-4"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span
                          style={{
                            fontFamily: FONT_SANS,
                            fontSize: 15,
                            color: TEXT_PRIMARY,
                            lineHeight: 1.6,
                          }}
                        >
                          Fix applied. Re-running tests... all 9 tests pass now.
                        </span>
                      </div>
                    )}
                  </AssistantMessage>
                )}

                {/* === Work metrics === */}
                {showWorkMetrics && (
                  <WorkMetrics
                    enterFrame={SCENES.workMetrics.start}
                    seconds={15}
                    actions={12}
                    filesModified={1}
                    linesRead={2400}
                    codeAdded={8}
                    codeRemoved={0}
                  />
                )}

                {/* Bottom spacer for scroll */}
                <div style={{ height: 40 }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* === Prompt form — fixed foreground, never moves === */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <ChatInputBar
          typedText={inputTypedText}
          showCursor={isTypingPhase}
          placeholder={inputPlaceholder}
          sendClickFrame={SCENES.sendClick.start}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Report content with basic markdown-like rendering */
const ReportContent: React.FC<{
  charsVisible: number;
  showCursor: boolean;
}> = ({ charsVisible, showCursor }) => {
  const visibleText = REPORT_TEXT.slice(0, charsVisible);
  const lines = visibleText.split("\n");

  // Parse lines into blocks: detect fenced code blocks
  const blocks: Array<
    | { type: "line"; text: string; idx: number }
    | { type: "codeblock"; lines: string[]; startIdx: number }
  > = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeStart = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLines = [];
        codeStart = i;
      } else {
        blocks.push({
          type: "codeblock",
          lines: codeLines,
          startIdx: codeStart,
        });
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(lines[i]);
    } else {
      blocks.push({ type: "line", text: lines[i], idx: i });
    }
  }
  if (inCode && codeLines.length > 0) {
    blocks.push({ type: "codeblock", lines: codeLines, startIdx: codeStart });
  }

  return (
    <div
      style={{
        fontFamily: FONT_SANS,
        fontSize: 15,
        color: TEXT_PRIMARY,
        lineHeight: 1.6,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {blocks.map((block, bi) => {
        const isLastBlock = bi === blocks.length - 1;

        if (block.type === "codeblock") {
          if (block.lines.length === 0) return null;
          // Filter out empty trailing lines to avoid the flash of an empty box
          const nonEmptyLines = block.lines.filter(
            (l, i) => i < block.lines.length - 1 || l.trim() !== "",
          );
          if (nonEmptyLines.length === 0 && !block.lines.some((l) => l.trim()))
            return null;
          return (
            <pre
              key={`cb-${block.startIdx}`}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 13,
                lineHeight: 1.6,
                color: TEXT_SECONDARY,
                backgroundColor: BG_SECONDARY,
                border: `1px solid ${BORDER_SOLID}`,
                borderRadius: 8,
                padding: "8px 12px",
                margin: "4px 0",
                whiteSpace: "pre-wrap",
                overflow: "hidden",
              }}
            >
              {block.lines.join("\n")}
              {isLastBlock && showCursor && <CursorInline />}
            </pre>
          );
        }

        const { text: line, idx: i } = block;
        const isLast = isLastBlock;

        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              style={{
                fontFamily: FONT_SANS,
                fontSize: 16,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                margin: "8px 0 4px",
                lineHeight: 1.4,
              }}
            >
              {line.replace("## ", "")}
              {isLast && showCursor && <CursorInline />}
            </h2>
          );
        }

        if (line.startsWith("**") && line.includes("**:")) {
          const match = line.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
          if (match) {
            return (
              <p key={i} style={{ margin: 0 }}>
                <strong style={{ color: TEXT_PRIMARY }}>{match[1]}</strong>
                {match[2] ? `: ${match[2]}` : ""}
                {isLast && showCursor && <CursorInline />}
              </p>
            );
          }
        }

        if (line.includes("`")) {
          const parts = line.split(/(`[^`]+`)/);
          return (
            <p key={i} style={{ margin: 0 }}>
              {parts.map((part, j) => {
                if (part.startsWith("`") && part.endsWith("`")) {
                  return (
                    <code
                      key={j}
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 13,
                        backgroundColor: "#1a1a1a",
                        border: `1px solid ${BORDER_SOLID}`,
                        borderRadius: 6,
                        padding: "2px 6px",
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                return <span key={j}>{part}</span>;
              })}
              {isLast && showCursor && <CursorInline />}
            </p>
          );
        }

        if (line.trim() === "") {
          return <div key={i} style={{ height: 8 }} />;
        }

        return (
          <p key={i} style={{ margin: 0, color: TEXT_PRIMARY }}>
            {line}
            {isLast && showCursor && <CursorInline />}
          </p>
        );
      })}
    </div>
  );
};

const CursorInline: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 24, [0, 10, 12, 22, 24], [1, 1, 0, 0, 1]);
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: 15,
        backgroundColor: TEXT_PRIMARY,
        opacity,
        verticalAlign: "text-bottom",
        marginLeft: 1,
      }}
    />
  );
};
