// Optional extensions for the longer workshop. These are not wired into the
// running agent; complete and connect each exercise deliberately.

export async function acknowledgeMessage(_messageId: string, _signal: AbortSignal): Promise<void> {
  // TODO 7: Extend this signature to receive message text. Use Jev to choose a
  // Linq custom emoji (or none), with local queryEmoji fallback; see src/reactions.ts.
  // Wire acknowledgment, then a typing helper in starter/server.ts; see src/typing.ts.
  // Refresh typing every 60s and return cleanup for Worker to call in finally.
  // Keep reaction/typing failures best effort. See docs/WORKSHOP.md.
  throw new Error('TODO 7: implement emoji acknowledgment. See docs/WORKSHOP.md.');
}

export async function synthesizeSpeech(_text: string, _signal: AbortSignal): Promise<Uint8Array> {
  // TODO 8: OpenRouter /audio/speech, model mistralai/voxtral-mini-tts-2603,
  // voice en_paul_neutral, response_format mp3. Return validated audio bytes.
  // Then add /voice routing, local file persistence, Linq upload, and voice-memo
  // delivery. Save audio/attachment identity for retries; keep normal replies.
  throw new Error('TODO 8: implement speech generation. See docs/WORKSHOP.md.');
}
