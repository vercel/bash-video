import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

import { UserMessageBubble } from "./components/UserMessageBubble";
import { AssistantMessage } from "./components/AssistantMessage";
import { ThinkingIndicator } from "./components/ThinkingIndicator";
import { StreamingText, getCharsVisible } from "./components/StreamingText";
import { BashPermissionCard } from "./components/BashPermissionCard";
import { RichTaskBlock } from "./components/RichTaskBlock";
import { TerminalOutput } from "./components/TerminalOutput";
import { CodeBlock } from "./components/CodeBlock";
import { WorkMetrics } from "./components/WorkMetrics";
import { GlobeIcon } from "./components/icons/GlobeIcon";

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
  BROWSER_COMMAND,
  BROWSER_OUTPUT_LINES,
  REPORT_TEXT,
  FIX_CODE_LINES,
  FIX_CODE_TEXT,
  SCENES,
} from "./script";

const { fontFamily } = loadFont();

// During the chat streaming section the prompt form is hidden, so the chat
// area uses the full video height for scroll math.
const MESSAGE_AREA_HEIGHT = 720;
// Everything inside the chat is scaled up so the content feels denser and the
// side gutters shrink. Fewer messages fit at once, so the scroll has to push
// content off-screen faster.
const CHAT_CONTENT_SCALE = 1.2;

// Approximate height of each element type for scroll calculation
const APPROX_HEIGHTS = {
  userBubble: 110,
  thinking: 32,
  streamingLineHeight: 24,
  streamingCharsPerLine: 80,
  permissionCard: 220,
  richTaskHeader: 36,
  terminalLineHeight: 22,
  terminalPadding: 32,
  codeLineHeight: 22,
  codePadding: 32,
  workMetrics: 55,
  successMessage: 44,
  gap: MESSAGE_GAP,
};

// ─── Report parsing ──────────────────────────────────────────────────────────
// REPORT_TEXT is authored in lightweight markdown (## heading, **bold**, `code`,
// fenced ``` code blocks). We parse it ONCE into structured blocks so streaming
// never exposes raw markdown delimiters on screen — bold text streams as bold
// from the first character.

type ReportSegment = { text: string; bold?: boolean; code?: boolean };
type ReportBlock =
  | { kind: "heading"; segments: ReportSegment[]; charCount: number }
  | { kind: "para"; segments: ReportSegment[]; charCount: number }
  | { kind: "code"; lines: string[]; charCount: number }
  | { kind: "blank"; charCount: number };

function parseInline(line: string): ReportSegment[] {
  const segments: ReportSegment[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, m.index) });
    }
    const tok = m[0];
    if (tok.startsWith("**")) {
      segments.push({ text: tok.slice(2, -2), bold: true });
    } else {
      segments.push({ text: tok.slice(1, -1), code: true });
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex) });
  }
  return segments;
}

function parseReport(md: string): ReportBlock[] {
  const out: ReportBlock[] = [];
  const lines = md.split("\n");
  let inCode = false;
  let codeLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        codeLines = [];
      } else {
        const charCount =
          codeLines.reduce((a, l) => a + l.length, 0) +
          Math.max(0, codeLines.length - 1); // internal newlines
        out.push({ kind: "code", lines: codeLines, charCount });
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }
    if (line.trim() === "") {
      out.push({ kind: "blank", charCount: 1 });
      continue;
    }
    if (line.startsWith("## ")) {
      const segments = parseInline(line.slice(3));
      const charCount = segments.reduce((a, s) => a + s.text.length, 0);
      out.push({ kind: "heading", segments, charCount });
      continue;
    }
    const segments = parseInline(line);
    const charCount = segments.reduce((a, s) => a + s.text.length, 0);
    out.push({ kind: "para", segments, charCount });
  }
  return out;
}

const REPORT_BLOCKS: ReportBlock[] = parseReport(REPORT_TEXT);
const REPORT_TOTAL_CHARS = REPORT_BLOCKS.reduce((a, b) => a + b.charCount, 0);

/**
 * Count how many on-screen lines a partially-revealed piece of text occupies,
 * so scroll can jump exactly when the text moves to a new visual line.
 * Height stays flat while a line is being typed and advances once a newline
 * is revealed or the current line has wrapped past `charsPerLine`.
 */
function countWrappedLines(text: string, charsPerLine: number): number {
  if (text.length === 0) return 1;
  const sourceLines = text.split("\n");
  let total = 0;
  for (const line of sourceLines) {
    if (line.length === 0) {
      total += 1;
    } else {
      total += Math.max(1, Math.ceil(line.length / charsPerLine));
    }
  }
  return total;
}

/** Report height walk based on structured blocks + a char budget. */
function computeReportHeight(charsVisible: number): number {
  if (charsVisible <= 0) return 0;
  const codeLineHeight = 21; // 13px * 1.6
  const codePadding = 20; // 8px top + 8px bottom padding + small margin
  const paraLineHeight = 24; // 15px * 1.6
  const headingHeight = 22 + 12; // line height + vertical margins
  const blankHeight = 8;
  const paraCharsPerLine = 80;
  const codeCharsPerLine = 70;

  let remaining = charsVisible;
  let h = 0;

  for (const block of REPORT_BLOCKS) {
    if (remaining <= 0) break;
    const reveal = Math.min(block.charCount, remaining);

    if (block.kind === "blank") {
      h += blankHeight;
    } else if (block.kind === "heading") {
      h += headingHeight;
    } else if (block.kind === "para") {
      const lineChars = Math.max(1, reveal);
      h += Math.max(1, Math.ceil(lineChars / paraCharsPerLine)) * paraLineHeight;
    } else if (block.kind === "code") {
      // Count visible code lines given the reveal budget.
      let taken = 0;
      let visibleLines = 0;
      for (let i = 0; i < block.lines.length; i++) {
        const line = block.lines[i];
        const lineCost = line.length + (i < block.lines.length - 1 ? 1 : 0);
        if (taken >= reveal) break;
        const lineReveal = Math.min(line.length, reveal - taken);
        visibleLines += Math.max(1, Math.ceil(Math.max(1, lineReveal) / codeCharsPerLine));
        taken += lineCost;
      }
      if (visibleLines > 0) {
        h += visibleLines * codeLineHeight + codePadding;
      }
    }
    remaining -= block.charCount;
  }
  return h;
}

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

  // Streaming text - height jumps when a new visual line begins
  if (frame >= SCENES.streaming.start) {
    const chars = getCharsVisible(
      frame - SCENES.streaming.start,
      ASSISTANT_STREAMING_TEXT.length,
      CHAR_REVEAL_RATE,
    );
    const lines = countWrappedLines(
      ASSISTANT_STREAMING_TEXT.slice(0, chars),
      APPROX_HEIGHTS.streamingCharsPerLine,
    );
    h += lines * APPROX_HEIGHTS.streamingLineHeight + APPROX_HEIGHTS.gap;
  }

  // Permission card
  if (frame >= SCENES.permissionCard.start) {
    h += APPROX_HEIGHTS.permissionCard + APPROX_HEIGHTS.gap;
  }

  // Agent browser task
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

  // Report - height jumps block-by-block / line-by-line as text reveals
  if (frame >= SCENES.report.start) {
    const chars = getCharsVisible(
      frame - SCENES.report.start,
      REPORT_TOTAL_CHARS,
      CHAR_REVEAL_RATE,
    );
    h += computeReportHeight(chars) + APPROX_HEIGHTS.gap;
  }

  // Autofix code (streams char-by-char)
  if (frame >= SCENES.autofix.start) {
    const chars = getCharsVisible(
      frame - SCENES.autofix.start,
      FIX_CODE_TEXT.length,
      CHAR_REVEAL_RATE,
    );
    const lineCount = Math.max(
      1,
      chars > 0 ? FIX_CODE_TEXT.slice(0, chars).split("\n").length : 1,
    );
    h +=
      lineCount * APPROX_HEIGHTS.codeLineHeight +
      APPROX_HEIGHTS.codePadding +
      APPROX_HEIGHTS.gap;

    // Success message (show after streaming completes)
    if (chars >= FIX_CODE_TEXT.length) {
      h += APPROX_HEIGHTS.successMessage + APPROX_HEIGHTS.gap;
    }
  }

  // Work metrics
  if (frame >= SCENES.workMetrics.start) {
    h += APPROX_HEIGHTS.workMetrics;
  }

  h -= 60; // bottom spacer

  return h;
}

function getScrollY(frame: number): number {
  const contentH = getContentHeight(frame);
  // Content is rendered with `scale(CHAT_CONTENT_SCALE)`, so its visual height
  // is contentH * scale. We scroll once that exceeds the viewport.
  const overflow = contentH * CHAT_CONTENT_SCALE - MESSAGE_AREA_HEIGHT;
  return Math.max(0, overflow);
}

export const V0ChatComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // — Scroll —
  const scrollY = useMemo(() => getScrollY(frame), [frame]);

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

  // — Report —
  const showReport = frame >= SCENES.report.start;
  const reportChars = showReport
    ? getCharsVisible(
        frame - SCENES.report.start,
        REPORT_TOTAL_CHARS,
        CHAR_REVEAL_RATE,
      )
    : 0;
  const reportDone = reportChars >= REPORT_TOTAL_CHARS;

  // — Autofix —
  const showAutofix = frame >= SCENES.autofix.start;
  const autofixChars = showAutofix
    ? getCharsVisible(
        frame - SCENES.autofix.start,
        FIX_CODE_TEXT.length,
        CHAR_REVEAL_RATE,
      )
    : 0;
  const autofixDone = autofixChars >= FIX_CODE_TEXT.length;

  // — Work metrics —
  const showWorkMetrics = frame >= SCENES.workMetrics.start;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_SECONDARY, overflow: "hidden" }}>
      {/* === Chat panel — full frame === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          backgroundColor: BG_PRIMARY,
        }}
      >
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
                  transform: `translateY(-${scrollY}px) scale(${CHAT_CONTENT_SCALE})`,
                  transformOrigin: "top center",
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
                      command={BROWSER_COMMAND}
                      enterFrame={SCENES.permissionCard.start}
                      allowClickFrame={SCENES.permissionCard.allowClick}
                    />
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
                      enterFrame={SCENES.autofix.start}
                      charsVisible={autofixChars}
                      showCursor={!autofixDone}
                    />
                    {/* Success message after streaming completes */}
                    {autofixDone && (
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
                          Fix applied. Re-running tests... all 8 tests pass now.
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
    </AbsoluteFill>
  );
};

/** Report content with basic markdown-like rendering */
/** Render inline segments, limited to `maxChars` of combined text. */
function renderSegments(
  segments: ReportSegment[],
  maxChars: number,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let used = 0;
  segments.forEach((seg, i) => {
    if (used >= maxChars) return;
    const take = Math.min(seg.text.length, maxChars - used);
    const text = seg.text.slice(0, take);
    used += take;
    if (seg.bold) {
      nodes.push(
        <strong key={i} style={{ color: TEXT_PRIMARY }}>
          {text}
        </strong>,
      );
    } else if (seg.code) {
      nodes.push(
        <code
          key={i}
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
          {text}
        </code>,
      );
    } else {
      nodes.push(<span key={i}>{text}</span>);
    }
  });
  return nodes;
}

const ReportContent: React.FC<{
  charsVisible: number;
  showCursor: boolean;
}> = ({ charsVisible, showCursor }) => {
  // Walk blocks in order, consuming from the char budget.
  let remaining = charsVisible;
  const rendered: Array<{ block: ReportBlock; reveal: number; index: number }> = [];
  for (let i = 0; i < REPORT_BLOCKS.length; i++) {
    if (remaining <= 0) break;
    const block = REPORT_BLOCKS[i];
    const reveal = Math.min(block.charCount, remaining);
    rendered.push({ block, reveal, index: i });
    remaining -= block.charCount;
  }

  // Cursor belongs on the last non-blank block that's still being revealed.
  let cursorIndex = -1;
  for (let i = rendered.length - 1; i >= 0; i--) {
    if (rendered[i].block.kind !== "blank") {
      cursorIndex = i;
      break;
    }
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
      {rendered.map(({ block, reveal, index }, ri) => {
        const isCursorHere = ri === cursorIndex && showCursor;

        if (block.kind === "blank") {
          return <div key={`b-${index}`} style={{ height: 8 }} />;
        }

        if (block.kind === "heading") {
          return (
            <h2
              key={`h-${index}`}
              style={{
                fontFamily: FONT_SANS,
                fontSize: 16,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                margin: "8px 0 4px",
                lineHeight: 1.4,
              }}
            >
              {renderSegments(block.segments, reveal)}
              {isCursorHere && <CursorInline />}
            </h2>
          );
        }

        if (block.kind === "para") {
          return (
            <p key={`p-${index}`} style={{ margin: 0 }}>
              {renderSegments(block.segments, reveal)}
              {isCursorHere && <CursorInline />}
            </p>
          );
        }

        // code block — reveal lines based on char budget
        let taken = 0;
        const visibleCodeLines: string[] = [];
        for (let li = 0; li < block.lines.length; li++) {
          const line = block.lines[li];
          if (taken >= reveal) break;
          const lineReveal = Math.min(line.length, reveal - taken);
          visibleCodeLines.push(line.slice(0, lineReveal));
          taken += line.length;
          if (li < block.lines.length - 1) taken += 1; // newline
        }
        if (visibleCodeLines.length === 0) return null;
        return (
          <pre
            key={`cb-${index}`}
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
            {visibleCodeLines.join("\n")}
            {isCursorHere && <CursorInline />}
          </pre>
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
