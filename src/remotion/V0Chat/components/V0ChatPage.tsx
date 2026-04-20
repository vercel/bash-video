import React from "react";
import { BG_PRIMARY, BG_SECONDARY, FONT_SANS, GREEN } from "../constants";
import { BlinkingCursor } from "./BlinkingCursor";
import { MessagingApp } from "./MessagingApp";

// ─── v0 design tokens (dark mode, from packages/ui/lib/styles/stylesheets/colors.css) ──
const V0_BG_300 = "#121212"; // hsl(0,0%,7%) — prompt form bg
const V0_GRAY_100 = "#1a1a1a"; // browser bar bg
const V0_GRAY_400 = "#2e2e2e";
const V0_GRAY_500 = "#454545";
const V0_GRAY_900 = "#a1a1a1"; // muted text
const V0_GRAY_1000 = "#ededed"; // primary text
const V0_ALPHA_400 = "rgba(255,255,255,0.145)"; // borders
const V0_ALPHA_500 = "rgba(255,255,255,0.239)"; // focus borders

// ─── Layout ────────────────────────────────────────────────────────────────
export const PAGE_TOP_NAV_HEIGHT = 48;
export const PAGE_LEFT_PANEL_WIDTH = 420;
const PROMPT_FORM_MARGIN = 12;
const PROMPT_FORM_MIN_HEIGHT = 92; // 54 min-h editor + 28 toolbar + 12 padding

// Center point of the follow-up input in page coords — used as zoom focal point.
export const FOLLOWUP_INPUT_CENTER = {
  x: PAGE_LEFT_PANEL_WIDTH / 2,
  y: 720 - PROMPT_FORM_MARGIN - PROMPT_FORM_MIN_HEIGHT / 2,
};

const ACTIVITY_ITEMS: Array<
  | { kind: "task"; label: string; icon: TaskIconKind }
  | { kind: "text"; text: string }
> = [
  { kind: "text", text: "the fix by running the tests again:" },
  { kind: "task", icon: "terminal", label: "Re-ran unit tests" },
  {
    kind: "text",
    text: "All 40 tests pass. Now let me verify the fix works in the browser:",
  },
  { kind: "task", icon: "browser", label: "Tested profile fix in browser" },
  { kind: "task", icon: "browser", label: "Got new snapshot" },
  { kind: "task", icon: "browser", label: "Tested profile click" },
  { kind: "task", icon: "browser", label: "Clicked username to open profile" },
  { kind: "task", icon: "search", label: "Viewed fixed profile" },
];

type TaskIconKind = "terminal" | "browser" | "search";

export const V0ChatPage: React.FC<{
  typedText?: string;
  showCursor?: boolean;
  sendButtonActive?: boolean;
}> = ({ typedText = "", showCursor = false, sendButtonActive = false }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BG_SECONDARY,
        fontFamily: FONT_SANS,
        color: V0_GRAY_1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TopNav />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <LeftPanel
          typedText={typedText}
          showCursor={showCursor}
          sendButtonActive={sendButtonActive}
        />
        <RightPreview />
      </div>
    </div>
  );
};

// ─── Top nav ────────────────────────────────────────────────────────────────
const TopNav: React.FC = () => (
  <div
    style={{
      height: PAGE_TOP_NAV_HEIGHT,
      flexShrink: 0,
      borderBottom: `1px solid ${V0_ALPHA_400}`,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 8,
      backgroundColor: BG_SECONDARY,
    }}
  >
    <V0Logo size={22} />
    <HeaderSlash />
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 30%, #8ce3a2 0%, #2b7e4a 55%, #0a2d19 100%)",
        flexShrink: 0,
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: 13,
        color: V0_GRAY_1000,
        fontWeight: 500,
      }}
    >
      <span>v0-is-cool-vtest314</span>
      <ChevronDownSmall />
    </div>

    <div style={{ flex: 1 }} />

    {/* Right-side action buttons */}
    <NavButton variant="secondary">Settings</NavButton>
    <NavButton variant="secondary">Share</NavButton>
    <NavButton variant="secondary">
      <GlobeSmall />
      <span>Publish</span>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          marginLeft: 2,
        }}
      />
    </NavButton>
    <NavButton variant="secondary">Admin</NavButton>
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: GREEN,
        display: "grid",
        placeItems: "center",
        fontSize: 11,
        fontWeight: 600,
        color: "#000",
        flexShrink: 0,
      }}
    >
      s
    </div>
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 30% 30%, #8ce3a2 0%, #2b7e4a 55%, #0a2d19 100%)",
        flexShrink: 0,
      }}
    />
  </div>
);

const NavButton: React.FC<{
  children: React.ReactNode;
  variant?: "secondary";
}> = ({ children }) => (
  <div
    style={{
      height: 28,
      padding: "0 8px",
      borderRadius: 6,
      border: `1px solid ${V0_ALPHA_400}`,
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 13,
      fontWeight: 500,
      color: V0_GRAY_1000,
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

const HeaderSlash: React.FC = () => (
  <svg width={14} height={20} viewBox="0 0 14 20" fill="none">
    <path d="M10 2 L4 18" stroke={V0_ALPHA_400} strokeWidth="1" />
  </svg>
);

// ─── Left panel: activity log + prompt form ─────────────────────────────────
const LeftPanel: React.FC<{
  typedText: string;
  showCursor: boolean;
  sendButtonActive: boolean;
}> = ({ typedText, showCursor, sendButtonActive }) => (
  <div
    style={{
      width: PAGE_LEFT_PANEL_WIDTH,
      flexShrink: 0,
      borderRight: `1px solid ${V0_ALPHA_400}`,
      backgroundColor: BG_SECONDARY,
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minHeight: 0,
    }}
  >
    <ActivityLog />
    <PromptForm
      typedText={typedText}
      showCursor={showCursor}
      sendButtonActive={sendButtonActive}
    />
  </div>
);

const ActivityLog: React.FC = () => (
  <div
    style={{
      flex: 1,
      overflow: "hidden",
      padding: "16px 16px 0",
      paddingBottom: PROMPT_FORM_MIN_HEIGHT + PROMPT_FORM_MARGIN * 2,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      fontSize: 13,
      color: V0_GRAY_1000,
      lineHeight: 1.55,
    }}
  >
    {ACTIVITY_ITEMS.map((item, i) =>
      item.kind === "text" ? (
        <div key={i}>{item.text}</div>
      ) : (
        <TaskRow key={i} icon={item.icon} label={item.label} />
      ),
    )}

    {/* Worked-for footer */}
    <div style={{ flex: 1 }} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: V0_GRAY_900,
        paddingTop: 12,
        paddingBottom: 12,
        borderTop: `1px solid ${V0_ALPHA_400}`,
      }}
    >
      <ActivityWave />
      <span>Worked for 2m 21s</span>
      <span style={{ flex: 1 }} />
      <ClockSmall />
      <span>3d ago</span>
      <MoreHorizontal />
      <LockSmall />
      <span>Admin</span>
    </div>
  </div>
);

const TaskRow: React.FC<{ icon: TaskIconKind; label: string }> = ({
  icon,
  label,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontSize: 13,
      color: V0_GRAY_1000,
    }}
  >
    <span style={{ color: V0_GRAY_900, display: "inline-flex" }}>
      <TaskIcon kind={icon} />
    </span>
    <span>{label}</span>
  </div>
);

const TaskIcon: React.FC<{ kind: TaskIconKind }> = ({ kind }) => {
  if (kind === "terminal") {
    return (
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <path
          d="M3 5l2 3-2 3M7.5 11h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "search") {
    return (
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
        <circle
          cx="7"
          cy="7"
          r="4.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10.2 10.2l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // "browser" — small monitor icon
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="3"
        width="12"
        height="9"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 12v2M10 12v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const ActivityWave: React.FC = () => (
  <svg width={16} height={12} viewBox="0 0 18 12" fill="none">
    <path
      d="M1 6c1.5 0 1.5-4 3-4s1.5 8 3 8 1.5-5 3-5 1.5 3 3 3 1.5-2 3-2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ClockSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M8 5v3l2 1.3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const MoreHorizontal: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <circle cx="4" cy="8" r="1" fill="currentColor" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);

const LockSmall: React.FC = () => (
  <svg width={11} height={12} viewBox="0 0 16 16" fill="none">
    <rect
      x="3.5"
      y="7"
      width="9"
      height="6"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M5.5 7V5a2.5 2.5 0 015 0v2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
  </svg>
);

// ─── Prompt form (mirrors v0's prompt-form.tsx) ─────────────────────────────
const PromptForm: React.FC<{
  typedText: string;
  showCursor: boolean;
  sendButtonActive: boolean;
}> = ({ typedText, showCursor, sendButtonActive }) => {
  const isTyping = typedText.length > 0;
  return (
    <div
      style={{
        position: "absolute",
        left: PROMPT_FORM_MARGIN,
        right: PROMPT_FORM_MARGIN,
        bottom: PROMPT_FORM_MARGIN,
        padding: 12,
        borderRadius: 12,
        backgroundColor: V0_BG_300,
        border: `1px solid ${isTyping ? V0_ALPHA_500 : V0_ALPHA_400}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Editor area — min-h-[54px] pb-2 in v0 */}
      <div
        style={{
          minHeight: 30,
          paddingBottom: 2,
          fontSize: 15,
          lineHeight: 1.4,
          color: isTyping ? V0_GRAY_1000 : V0_GRAY_500,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {isTyping ? typedText : "Ask a follow-up…"}
        {showCursor && <BlinkingCursor height={15} />}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {/* Left: tools button + model switcher */}
        <ToolbarIconButton>
          <PlusSmall />
        </ToolbarIconButton>
        <ToolbarIconButton>
          <AtSign />
        </ToolbarIconButton>
        <ModelSwitcher />

        <div style={{ flex: 1 }} />

        {/* Right: history + primary action */}
        <ToolbarIconButton>
          <HistoryIcon />
        </ToolbarIconButton>
        <PrimaryActionButton active={sendButtonActive} hasText={isTyping} />
      </div>
    </div>
  );
};

const ToolbarIconButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 6,
      display: "grid",
      placeItems: "center",
      color: V0_GRAY_900,
    }}
  >
    {children}
  </div>
);

const ModelSwitcher: React.FC = () => (
  <div
    style={{
      height: 28,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 6px",
      color: V0_GRAY_900,
      fontSize: 13,
      fontWeight: 500,
    }}
  >
    <V0MaxIcon />
    <span>v0 Max</span>
    <ChevronDownSmall />
  </div>
);

const PrimaryActionButton: React.FC<{
  active: boolean;
  hasText: boolean;
}> = ({ active, hasText }) => {
  // When empty, v0 shows a microphone (start recording); when text is present,
  // it becomes an arrow-up send button. The click animation inverts colors.
  const filled = hasText || active;
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: filled ? V0_GRAY_1000 : "transparent",
        border: filled ? "none" : `1px solid ${V0_ALPHA_400}`,
        display: "grid",
        placeItems: "center",
        color: filled ? "#000" : V0_GRAY_900,
        transform: active ? "scale(0.92)" : "scale(1)",
      }}
    >
      {hasText ? <ArrowUp /> : <Microphone />}
    </div>
  );
};

// ─── Right preview: browser-frame + iframe (MessagingApp) ───────────────────
const RightPreview: React.FC = () => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: BG_PRIMARY,
      minWidth: 0,
    }}
  >
    <BrowserFrame />
    <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
      <MessagingApp />
    </div>
  </div>
);

const BrowserFrame: React.FC = () => (
  <div
    style={{
      height: 48,
      flexShrink: 0,
      borderBottom: `1px solid ${V0_ALPHA_400}`,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 8,
    }}
  >
    {/* Left cluster: preview/code/db tabs */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 28,
        border: `1px solid ${V0_ALPHA_400}`,
        borderRadius: 6,
        padding: 2,
        gap: 1,
        backgroundColor: V0_GRAY_100,
      }}
    >
      <TabButton active>
        <EyeIcon />
      </TabButton>
      <TabButton>
        <CodeIcon />
      </TabButton>
      <TabButton>
        <DatabaseIcon />
      </TabButton>
    </div>

    <div style={{ flex: 1 }} />

    {/* URL bar */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 28,
        backgroundColor: V0_GRAY_100,
        border: `1px solid ${V0_ALPHA_400}`,
        borderRadius: 6,
        overflow: "hidden",
        maxWidth: 340,
        flex: 1,
      }}
    >
      <BrowserBarButton>
        <ChevronLeftSmall />
      </BrowserBarButton>
      <BrowserBarButton>
        <ChevronRightSmall />
      </BrowserBarButton>
      <BrowserBarButton>
        <DeviceIcon />
      </BrowserBarButton>
      <div
        style={{
          flex: 1,
          fontSize: 12,
          color: V0_GRAY_900,
          padding: "0 8px",
          fontFamily: FONT_SANS,
        }}
      >
        /
      </div>
      <BrowserBarButton>
        <ExternalSmall />
      </BrowserBarButton>
      <BrowserBarButton>
        <RefreshSmall />
      </BrowserBarButton>
    </div>

    <div style={{ flex: 1 }} />

    {/* Right cluster: Latest dropdown + terminal + more */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          height: 28,
          padding: "0 8px",
          fontSize: 12,
          color: V0_GRAY_1000,
          fontWeight: 500,
        }}
      >
        <LockSmall />
        <span>Latest</span>
        <ChevronDownSmall />
      </div>
      <BrowserBarButton>
        <TerminalSquare />
      </BrowserBarButton>
      <BrowserBarButton>
        <MoreHorizontal />
      </BrowserBarButton>
    </div>
  </div>
);

const TabButton: React.FC<{
  children: React.ReactNode;
  active?: boolean;
}> = ({ children, active }) => (
  <div
    style={{
      width: 26,
      height: 22,
      borderRadius: 4,
      display: "grid",
      placeItems: "center",
      backgroundColor: active ? V0_GRAY_400 : "transparent",
      color: active ? V0_GRAY_1000 : V0_GRAY_900,
    }}
  >
    {children}
  </div>
);

const BrowserBarButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: 4,
      display: "grid",
      placeItems: "center",
      color: V0_GRAY_900,
    }}
  >
    {children}
  </div>
);

// ─── Geist-style icons ──────────────────────────────────────────────────────
const V0Logo: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg
    width={size}
    height={(size * 70) / 147}
    viewBox="0 0 147 70"
    fill="currentColor"
    style={{ color: V0_GRAY_1000, flexShrink: 0 }}
  >
    <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
    <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
  </svg>
);

const V0MaxIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <path
      d="M7 7.25C7 7.11193 7.11193 7 7.25 7H8.75C8.88807 7 9 7.11193 9 7.25V8.75C9 8.88807 8.88807 9 8.75 9H7.25C7.11193 9 7 8.88807 7 8.75V7.25Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 6C4 4.89543 4.89543 4 6 4L10 4C11.1046 4 12 4.89543 12 6V10C12 11.1046 11.1046 12 10 12H6C4.89543 12 4 11.1046 4 10L4 6Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M1 5C1 2.79086 2.79086 1 5 1L11 1C13.2091 1 15 2.79086 15 5V11C15 13.2091 13.2091 15 11 15H5C2.79086 15 1 13.2091 1 11V5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const ChevronDownSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronLeftSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <path
      d="M10 4l-4 4 4 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ExternalSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <path
      d="M6 3h7v7M13 3L7 9M12 9v3.5a.5.5 0 01-.5.5H3.5a.5.5 0 01-.5-.5V4.5a.5.5 0 01.5-.5H7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RefreshSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <path
      d="M8.19 3.08c1.68 0 3.17.84 4.06 2.12V3.75h1.5V7.5c0 .41-.34.75-.75.75H9.25v-1.5h2.14A3.44 3.44 0 0 0 4.75 8a3.44 3.44 0 0 0 6.23 2l.44-.6 1.21.88-.44.6A4.94 4.94 0 0 1 3.25 8a4.93 4.93 0 0 1 4.94-4.92Z"
      fill="currentColor"
    />
  </svg>
);

const PlusSmall: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3.5v9M3.5 8h9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const AtSign: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M10 6v3a1.5 1.5 0 003 0V8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const HistoryIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
    <path
      d="M2 8a6 6 0 106-6M2 4V8h4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 5v3l2 1"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowUp: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 12V4M4 7l4-3 4 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Microphone: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <rect
      x="6"
      y="2"
      width="4"
      height="7.5"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M3.5 8a4.5 4.5 0 009 0M8 12v2M5.5 14h5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const GlobeSmall: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
    <path
      d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5S1 8 1 8Z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const CodeIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
    <path
      d="M6 4l-4 4 4 4M10 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DatabaseIcon: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
    <ellipse cx="8" cy="4" rx="5" ry="1.8" stroke="currentColor" strokeWidth="1.3" />
    <path
      d="M3 4v8c0 1 2.2 1.8 5 1.8s5-.8 5-1.8V4M3 8c0 1 2.2 1.8 5 1.8s5-.8 5-1.8"
      stroke="currentColor"
      strokeWidth="1.3"
    />
  </svg>
);

const DeviceIcon: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
    <rect
      x="4"
      y="2"
      width="8"
      height="12"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path d="M7 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const TerminalSquare: React.FC = () => (
  <svg width={13} height={13} viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M5 7l2 1.5L5 10M8.5 10h3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
