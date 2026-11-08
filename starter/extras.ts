// Optional extensions for the longer workshop. These are not wired into the
// running agent; complete and connect each exercise deliberately.

export async function acknowledgeMessage(_messageId: string, _signal: AbortSignal): Promise<void> {
  // TODO 7: Linq custom emoji reaction. Use LINQ_API_KEY, operation add,
  // type custom, and a query-based custom_emoji (fallback 👀). Connect before generation;
  // reaction failures must not block the real reply.
  throw new Error('TODO 7: implement emoji acknowledgment. See docs/WORKSHOP.md.');
}

export async function synthesizeSpeech(_text: string, _signal: AbortSignal): Promise<Uint8Array> {
  // TODO 8: OpenRouter /audio/speech, model mistralai/voxtral-mini-tts-2603,
  // voice en_paul_neutral, response_format mp3. Return validated audio bytes.
  // Then add /voice routing, local file persistence, Linq upload, and voice-memo
  // delivery. Save audio/attachment identity for retries; keep normal replies.
  throw new Error('TODO 8: implement speech generation. See docs/WORKSHOP.md.');
}
