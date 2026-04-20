// Video script — all text content and timing for the v0 chat demo video

export const USER_PROMPT =
  "Can you test user interactions for this messaging app? I want a report of how the app performs + fixes we need to make.";

export const ASSISTANT_STREAMING_TEXT =
  "I'll thoroughly test the messaging app using browser automation to exercise all core user interactions. Let me start:";

export const BROWSER_COMMAND = "agent-browser open http://localhost:3000 --interactive";

export const BROWSER_OUTPUT_LINES = [
  "✓ VOID // MESSAGING",
  "  http://localhost:3000/",
  "✓ Screenshot saved to /tmp/test-initial.png",
  "✓ Clicked 'New Conversation' button",
  "✓ Typed test message: 'Hello, world!'",
  "✓ Message sent successfully",
  "✓ Verified message appears in conversation",
  "✓ Tested emoji reactions - working",
  "✗ Message delivery status stuck on 'pending'",
  "   Expected: 'delivered' within 3s",
  "   Received: 'pending' (no status update)",
  "",
  "      Tests  7 passed | 1 failed (8)",
  "   Duration  4.32s",
];

export const REPORT_TEXT = `## Test Results Summary

**Browser Testing**: 7/8 interactions passed. One failure detected:

\`\`\`
FAIL Message delivery status stuck on 'pending'
  Expected: 'delivered' within 3s
  Received: 'pending' (no status update after send)
\`\`\`

**Root Cause**: The \`useMessageStatus\` hook isn't subscribing to the WebSocket \`message:status\` event. The status stays as \`pending\` even after the server confirms delivery.

**Fix**: I'll update the hook to listen for status events:`;

export const FIX_CODE_LINES = [
  "// src/hooks/useMessageStatus.ts",
  "",
  " export function useMessageStatus(messageId: string) {",
  "-  const [status, setStatus] = useState<Status>('pending');",
  "   const ws = useWebSocket();",
  "",
  "-  return status;",
  "+  return useSyncExternalStore(",
  "+    (cb) => ws.onStatus(messageId, cb),",
  "+    () => ws.getStatus(messageId),",
  "+  );",
  " }",
];

export const FIX_CODE_TEXT = FIX_CODE_LINES.join("\n");

export const PRIOR_CODE_BLOCK = `const [sender] = await sql\`
  SELECT id, username, display_name, status
  FROM users WHERE id = \${CURRENT_USER_ID}
\`

return NextResponse.json({ ...message, sender })`;

export const PRIOR_SUMMARY_TEXT =
  "**Data Flow Summary**";

export const PRIOR_SUMMARY_DETAIL = `User types → MessageInput → ChatContainer.handleSendMessage
→ POST /api/conversations/[id]/messages → Neon PostgreSQL
→ SWR mutate() → Re-fetch messages → UI updates`;

export const PRIOR_DETAIL_TEXT = `The app uses SWR's \`mutate()\` to trigger a refetch of both the messages list and conversations list (to update the "last message" preview in the sidebar) after a successful save.`;

// Frame timing for each scene.
// Intro: full v0 chat page → zoom into follow-up input → type prompt →
// send click → swipe away to reveal the chat stream.
export const SCENES = {
  pageHold: { start: 0, end: 45 },            // show full v0 page
  zoomIn: { start: 45, end: 95 },             // camera pushes into follow-up input
  userTyping: { start: 110, end: 225 },       // typing in the zoomed input
  sendClick: { start: 235, end: 245 },        // click send
  swipeTransition: { start: 250, end: 285 },  // page slides out, chat slides in
  messageSent: { start: 278, end: 305 },      // bubble appears as swipe finishes
  thinking: { start: 305, end: 365 },
  streaming: { start: 365, end: 440 },
  permissionCard: { start: 445, end: 540, allowClick: 495 },
  agentBrowser: { start: 540, end: 720 },
  report: { start: 720, end: 925 },
  autofix: { start: 930, end: 1130 },
  workMetrics: { start: 1130, end: 1180 },
  endHold: { start: 1180, end: 1210 },
} as const;
