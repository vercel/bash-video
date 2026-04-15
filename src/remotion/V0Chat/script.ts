// Video script — all text content and timing for the v0 chat demo video

export const USER_PROMPT =
  "Can you test all core functions and user interactions for this messaging app? I want a report of how the app performs + fixes we need to make.";

export const ASSISTANT_STREAMING_TEXT =
  "I'll thoroughly test the messaging app using browser automation for user interactions, then run the unit tests. Let me start:";

export const BASH_COMMAND = "cd /vercel/share/v0-project && npx vitest run 2>&1";

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
  "✓ Screenshot saved to /tmp/test-interactions.png",
];

export const VITEST_OUTPUT_LINES = [
  " ✓ src/tests/auth.test.ts (3 tests) 450ms",
  "   ✓ should authenticate user",
  "   ✓ should handle session tokens",
  "   ✓ should logout correctly",
  "",
  " ✓ src/tests/messaging.test.ts (4 tests) 1200ms",
  "   ✓ should send a message",
  "   ✓ should receive messages in real-time",
  "   ✓ should show typing indicators",
  "   ✗ should handle message delivery status",
  "",
  " ✓ src/tests/presence.test.ts (2 tests) 320ms",
  "   ✓ should show online users",
  "   ✓ should update status on disconnect",
  "",
  " Test Files  2 passed | 1 failed (3)",
  "      Tests  8 passed | 1 failed (9)",
  "   Duration  1.97s",
];

export const REPORT_TEXT = `## Test Results Summary

**Browser Testing**: All core user interactions passed. Message sending, receiving, emoji reactions, and conversation creation all work correctly.

**Unit Tests**: 8/9 tests passed. One failure detected:

\`\`\`
FAIL src/tests/messaging.test.ts > should handle message delivery status
  AssertionError: expected 'pending' to be 'delivered'
  Message status not updating after server acknowledgment
\`\`\`

**Root Cause**: The \`useMessageStatus\` hook isn't subscribing to the WebSocket \`message:status\` event. The status stays as \`pending\` even after the server confirms delivery.

**Fix**: I'll update the hook to listen for status events:`;

export const FIX_CODE_LINES = [
  "// src/hooks/useMessageStatus.ts",
  "",
  " export function useMessageStatus(messageId: string) {",
  "   const [status, setStatus] = useState<Status>('pending');",
  "   const ws = useWebSocket();",
  "",
  "+  useEffect(() => {",
  "+    const handler = (data: StatusEvent) => {",
  "+      if (data.messageId === messageId) {",
  "+        setStatus(data.status);",
  "+      }",
  "+    };",
  "+    ws.on('message:status', handler);",
  "+    return () => ws.off('message:status', handler);",
  "+  }, [ws, messageId]);",
  "",
  "   return status;",
  " }",
];

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
// Typing starts at frame 30 while messaging app is still visible.
// Swipe triggers when typing ends (user "sends" the message).
export const SCENES = {
  appIntro: { start: 0, end: 210 },       // messaging app visible throughout typing
  userTyping: { start: 30, end: 195 },    // typing over the messaging app
  sendClick: { start: 225, end: 235 },    // mouse clicks send button (1s pause after typing)
  swipeTransition: { start: 235, end: 265 }, // swipe on send
  messageSent: { start: 275, end: 300 },  // bubble appears in chat
  thinking: { start: 300, end: 360 },     // brain shimmer → done
  streaming: { start: 360, end: 435 },   // char-by-char response
  permissionCard: { start: 440, end: 590, allowClick: 545 },
  runningTests: { start: 590, end: 770 },
  agentBrowser: { start: 770, end: 950 },
  report: { start: 950, end: 1295 },
  autofix: { start: 1300, end: 1420 },
  workMetrics: { start: 1420, end: 1470 },
  endHold: { start: 1470, end: 1500 },
} as const;
