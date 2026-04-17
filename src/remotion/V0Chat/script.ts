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

// Frame timing for each scene
// Chat-only variant: starts directly at messageSent. Intro/messaging scenes removed.
export const SCENES = {
  messageSent: { start: 0, end: 25 },
  thinking: { start: 25, end: 85 },
  streaming: { start: 85, end: 160 },
  permissionCard: { start: 165, end: 260, allowClick: 215 },
  agentBrowser: { start: 260, end: 440 },
  report: { start: 440, end: 645 },
  autofix: { start: 650, end: 850 },
  workMetrics: { start: 850, end: 900 },
  endHold: { start: 900, end: 930 },
} as const;
