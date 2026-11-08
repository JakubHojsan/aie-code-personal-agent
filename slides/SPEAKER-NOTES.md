# Speaker notes

Generated from slides/index.html with npm run slides:notes.

## 1. Personal agents in your messages · 0:00–0:20

Twenty seconds. “By the end, you will have an agent running on your laptop that you can text. It will remember a preference, look something up, and answer with a source.” Introduce yourself as FDE Lead at Exa. Establish the concrete outcome; save the vendor tour for the architecture. The application is open source; inference, search, browser infrastructure, and messaging use hosted services.

## 2. Clone now; build after the overview · Setup · during the overview

Show this at the start, immediately after the cover. Ask everyone to clone and let npm ci run while you present. Configure credentials manually in .env; do not display secrets. The overview keeps its twelve-minute speaking allocation; allow a short setup pause if needed. The first hands-on task after the overview is Exa MCP, not the model TODO. Attendees need Node.js 26.12.1+ with npm as their local package manager, plus an MCP-capable coding agent installed and running locally before class. The coding agent uses hosted models; local model inference is not required.

## 3. What Exa does · 0:20–1:10

Fifty seconds. Introduce Exa as the connection between an agent and current information. Use the three use cases as examples rather than customer claims. The talk explains the product choices and demonstrates the outcome. The hands-on session starts after this twelve-minute overview. Dependencies install during the overview; implementation starts afterward. Source: https://exa.ai/docs .

## 4. Search API · 1:10–2:10

Sixty seconds. This is the endpoint used in the workshop. Search takes a natural-language query and returns ranked sources. Ask for highlights to include relevant page excerpts. Keep the distinction simple: Search supplies evidence; our personal agent decides what to say. We will wire the tool after the overview, in the workshop. Source: https://exa.ai/docs/search/quickstart .

## 5. Contents API · 2:10–2:55

Forty-five seconds. Contents is for the known-URL case. It extracts readable page content, including supported rendered pages and PDFs. Do not claim that all JavaScript pages require a separate browser: Contents can extract rendered content too. In this workshop the Search call already requests highlights, so the complete application does not add a separate Contents request. Kernel later supplies a controlled browser session when the agent specifically needs one. Source: https://exa.ai/docs/contents/quickstart .

## 6. Agent API · 2:55–3:55

Sixty seconds. Exa Agent is the research product, distinct from the personal agent we are building. It can run multiple searches, read sources, verify criteria, and return structured output. Describe the outcome rather than teaching SDK calls. It is asynchronous and useful when the task involves a research workflow. Premium partner access gets its own slide, rather than being folded into this endpoint explanation. Source: https://exa.ai/docs/agent/quickstart .

## 7. Monitors API · 3:55–4:40

Forty-five seconds. Monitors turns recurring discovery into updates delivered to your application. It is useful for a future proactive personal agent. The workshop code does not implement a scheduler or proactive notifications, so keep this as product context, not a live capability claim. No webhook setup instructions belong in this overview. Source: https://exa.ai/docs/monitors/quickstart .

## 8. Today: Search with highlights · 4:40–5:50

Seventy seconds. The agent needs the price passage, not everything on a restaurant page. Follow the three columns: source page, relevant evidence, then a qualified answer. The left page is a schematic, not a screenshot or a full-page capture. The middle quote is a verbatim shortened excerpt from a real Search response captured November 6, 2026, with one official San Francisco result selected out of five. The right answer is illustrative, not recorded model output. A $150 budget is inside the published $119–219 range but does not guarantee a $150 experience or a table; confirm with the restaurant. Exa highlights return relevant source passages with URLs, which our loop passes back to the model. The setting shown is the one the workshop implements. We do not claim a measured token reduction or accuracy improvement for this demo. The build section later shows the actual request and tool-result flow. Sources: https://exa.ai/docs/search/highlights ; slides/exa-search-capture.json .

## 9. Data partners: Search and Agent access paths · 5:50–7:00

Seventy seconds. Keep the partner story separate from the endpoint and highlights explanations. State the distinction from the presenter: some partner data resolves through Search; partner capabilities can also be attached through the Exa Agent endpoint. These are access paths, not mutually exclusive provider buckets. Search returns source evidence for our own agent loop. Exa Agent can use the same indexed sources and additionally query attached premium providers through dataSources. Similarweb, Financial Datasets, and Particle are documented Agent/Connect examples, not claims that every provider is enabled in today’s Search request. Do not assign named providers to the Search lane without a verified provider-specific mapping. Mention account availability and enablement briefly. Sources: https://exa.ai/docs/search/data/overview ; https://exa.ai/docs/agent/connect/overview ; https://exa.ai/connect .

## 10. A table for two · 7:00–9:00

Two minutes. The default mode is a worked example based on the official Robin San Francisco page checked on November 6, 2026. It is authored teaching content, not a captured model response. Advance through the dinner request, its sourced answer, and the quiet-room constraint. Note that the omakase experience and published price range are supported; a quiet dining room and table availability are not. For a real demonstration, switch to Live agent or show Messages with Linq. Stage chat uses the actual answer function and an isolated stage profile. Stop after two minutes, even if a live request is slow; the source evidence was shown earlier in the overview.

## 11. From message to answer · 9:00–10:10

Seventy seconds. Explain the roles without walking through code: Qwen decides the next action, Exa supplies search evidence, Kernel supplies a browser session when useful, Mem0 supplies personal context, and Linq carries messages. Tool results return to the model. Automatic memory recall is application-managed in the current repo; the explicit /remember command saves preferences. Do not imply that every capability is a model-callable tool. The workshop will show the integration boundaries in order. Explain aloud that the laptop hosts the loop, queue, and Mem0 files, while inference, Exa, Kernel, and Linq are hosted services. The next slide shows that hosting split. The diagram is static; follow its arrows rather than running a simulated trace.

## 12. What runs locally · 10:10–11:00

Fifty seconds. Be precise about the local-hosting promise. The application and saved context are on the laptop. Inference, embeddings, Exa, Kernel, and Linq are hosted. This explains the ownership and availability boundary. The workshop is where participants configure the accounts and connect the services; keep commands off this slide.

## 13. Start the hands-on workshop · 11:00–12:00

Sixty seconds. This is the explicit boundary between the twelve-minute presentation and the hands-on workshop. Finish the overview, then advance to slide 14 in this same deck. The walkthrough starts by connecting Exa MCP and using it to find the official API documentation, then prompting the coding assistant to implement one TODO at a time. It then covers model, Exa, Kernel, Mem0, and Linq. SDK snippets, configuration, coding prompts, and verification steps live in that walkthrough and the participant guide, not in the overview.

## 14. Connect and try Exa MCP · Workshop 0:00–3:00

Three minutes. Everyone cloned at the beginning. Now open https://exa.ai/mcp, choose the actual coding assistant, and connect the hosted server https://mcp.exa.ai/mcp named exa. Restart or reconnect the client if required. Paste the on-screen prompt and verify an actual Exa MCP tool invocation, not an answer from model memory. The current default search tool is web_search_exa. It should return official Exa documentation with a source URL. If the client does not expose Exa tools, fix setup before proceeding. Hosted anonymous access has rate limits; arrange authenticated access for a large class. This MCP connection belongs to the attendee’s coding assistant. The application they build still calls Search directly in TODO 2. Setup source: https://exa.ai/mcp and https://github.com/exa-labs/exa-mcp-server . This slide intentionally separates installation from one small verification prompt. Read the local repo after this checkpoint, at the model step.

## 15. 1. Model: prompt, run, check · Workshop 3:00–7:00

The model transport is supplied. Attendees connect callModel, rather than rebuilding the loop. Set credentials manually in .env. Stop here until a real response works. Set the milestone in .env and restart. Verify the checkpoint before continuing.

## 16. 2. Exa API: prompt, run, check · Workshop 7:00–13:00

The coding assistant uses Exa MCP to research the API. The personal agent uses a direct POST to https://api.exa.ai/search with x-api-key, JSON Content-Type, and contents: { highlights: true }. Keep the supplied loop: matching tool_call_id, evidence returned as a tool message, then another model call. Do not add Contents or Agent calls. Set the milestone in .env and restart. Verify the checkpoint before continuing.

## 17. 3. Kernel: prompt, run, check · Workshop 13:00–19:00

Browser use is conditional: Search highlights may already answer the question. This explicit URL-reading request demonstrates the difference. The supplied adapter creates a session, executes fixed read-only code, and deletes the session in finally. Preserve its host restriction, timeouts, and independent cleanup signal. No local browser installation is needed. Set the milestone in .env and restart. Verify the checkpoint before continuing.

## 18. 4. Mem0: prompt, run, check · Workshop 19:00–26:00

Mem0 is integrated as application-managed recall before the model, with explicit /remember writes. It is not a model-callable tool in this repository. Local storage survives restart. Extraction and embeddings use configured providers; no Mem0 API key is required. Configure OWNER_PHONE_NUMBER before saving so terminal and phone share a profile. Use /exit and restart the CLI to verify persistence. Set the milestone in .env and restart. Verify the checkpoint before continuing.

## 19. Linq: activate sandbox and generate token · Workshop 26:00–28:00

Open the sandbox dashboard, verify the account, activate the sandbox, and generate a token. From your project folder, run nano .env and add LINQ_API_KEY=your_token. Save with Ctrl+O, press Enter, then exit with Ctrl+X. Do not project the token value. The presenter-provided screenshot shows the API Tokens panel in Production; use the sandbox environment for this exercise and do not imply the displayed production token is a sandbox token. LINQ_WEBHOOK_SECRET is different: it is the signing_secret returned when creating the webhook subscription. Next, create the webhook; slide 21 verifies phone delivery.

## 20. ngrok: connect Linq to your laptop · Workshop 28:00–30:00

Complete ngrok installation and account authentication before class using its official download guide. The first-time command is ngrok config add-authtoken with the account's actual token. Do not show it on the projector. Start ngrok http 3400 before starting the agent: it can supply the public URL while the local service is stopped. Register that URL with /webhooks/linq?version=2026-02-03 appended, event message.received, and the assigned phone-number filter. Ask the coding agent to use the authenticated Linq V3 webhook-subscriptions API and save the returned signing_secret in project-root .env as LINQ_WEBHOOK_SECRET without printing it. The on-screen prompt is the primary setup path; manual dashboard creation is optional. Inspect existing subscriptions before creating a new one; if one already exists with the correct target and a saved secret, reuse it. Update its URL if the tunnel changed and retain its secret. If a subscription exists but its secret was lost, do not claim it can be retrieved; explain the recovery options before recreating it. Do not invent a secret or reuse the API key. Save in nano with Ctrl+O, Enter, Ctrl+X. The supplied agent validates all configuration at startup, so it cannot start before the secret is saved. Then use the next slide to start starter:phone, or solution:phone for the instructor. Check local and public /healthz, then text the assigned line from the configured owner. Keep the laptop awake and ngrok running. Sandbox recipients must message the line first. Sources: https://ngrok.com/download ; https://docs.linqapp.com/channel/imessage/guides/webhooks/subscriptions/ .

## 21. 5. Linq: prompt, run, check · Workshop 30:00–35:00

Sandbox onboarding: open https://dashboard.linqapp.com/sandbox, verify your account for the seven-day free trial, and activate your sandbox. Follow the dashboard prompts. Linq publicly advertises a seven-day trial at https://linqapp.com/. The official API quickstart is https://docs.linqapp.com/channel/imessage/getting-started/quickstart/; it covers tokens, provisioned numbers, messaging and webhooks. The account-verification and activation labels were supplied by the presenter; the dashboard onboarding requires sign-in and was not independently completed. Stop the CLI before starting phone mode. Keys, distinct E.164 owner and line numbers, signing secret, provisioned line, filtered subscription, and HTTPS tunnel must be ready from prework. Start the tunnel to port 3400 and verify the current webhook URL. The supplied worker uses the same answer function, durable queue, signature verification, owner checks, and idempotent send. Terminal output is not proof of a phone round trip. Do not modify the independent instructor solution. Set the milestone in .env and restart. Verify the checkpoint before continuing.

## 22. Before and after: Exa weather OG card · Workshop 35:00–36:00

One minute. Before: a plain URL to the Exa Library San Francisco weather result. After: the same URL sent as a native Linq link part and rendered as an iMessage rich preview. The embedded blue card is the actual image fetched from this source page's og:image metadata, not an invented weather graphic. The message frame is illustrative, not a screenshot of a delivered iMessage. This source is the November 7, 2026 snapshot supplied by the presenter: 60°F, clear sky, feels like 58°F. Do not present the static image as current weather. For a live demonstration, send a fresh returned Exa Library weather URL. Linq obtains metadata from that URL. The current repository implements iMessage/RCS through Linq, with SMS plain-URL fallback; WhatsApp is not implemented. The next slide adds the source-card feature to the attendee baseline. Source URL: https://exa.ai/library/weather/san-francisco-california-united-states?latitude=37.7893&longitude=-122.4220&date=2026-11-07 .

## 23. Feature 6: add source cards · Workshop 36:00–40:00

Four minutes. TODO 5 establishes text-only phone delivery by passing [] as the final sendReply argument. TODO 6 implements sourceCards(text), then passes its result instead. The complete replyLinks function in src/linq.ts is the reference; students can inspect it. The supplied transport handles one HTTPS link per message and stable per-card idempotency keys. Validate and deduplicate at most three links. No new API key, OG scraping service, or additional Exa search is required. Stop the starter process, restart it, and repeat the exact same phone request used before the change. Actual previews depend on public source metadata; SMS is a plain URL fallback. Three cards consume up to three outbound Linq messages. Test retries and no-link responses. The instructor solution already enables cards. The environment reference is on slide 26.

## 24. Optional: emoji reactions · Optional extension · +5–10 minutes

Emoji acknowledgment is an optional attendee extension, enabled in the complete instructor demo. Implement the named starter function and connect it to the durable worker before generation, not to the synchronous webhook response. The supplied Job.id encodes chatId:messageId; preserve the original message resource ID or derive it by removing job.chat plus the colon, never use event_id as the message ID. POST to https://api.linqapp.com/api/partner/v3/messages/{messageId}/reactions with Bearer LINQ_API_KEY and JSON operation add, type custom, custom_emoji 👀. Reactions are an iMessage feature. Bound reaction latency; fail open for the main answer. Duplicate deliveries must not multiply jobs, and a reaction retry must not duplicate the actual answer. Test using an inbound message from the configured owner. No new credential is needed.

## 25. Optional: OpenRouter voice reply · Optional extension · +15–20 minutes

Voice replies are an optional attendee exercise. The complete instructor demo now supports explicit /voice requests. Keep Qwen as the text reasoning model; use a dedicated speech model only when the owner requests /voice. OpenRouter POST https://openrouter.ai/api/v1/audio/speech uses Bearer OPENROUTER_API_KEY and JSON model mistralai/voxtral-mini-tts-2603, voice en_paul_neutral, input a short plain-text answer, response_format mp3. This pair appears in the official OpenRouter TTS tutorial. A successful response contains binary audio, not a chat-completion JSON payload. Check HTTP status, audio/mpeg content type, and a bounded nonempty file; write to ignored .data/audio. Play locally with afplay on macOS or another installed player. Use Linq POST /v3/attachments to obtain upload_url, attachment_id and required_headers, then PUT raw MP3 bytes with exactly those headers. Do not add the Linq bearer token to the presigned upload URL. Send the uploaded attachment_id to POST /v3/chats/{chatId}/voicememo. Native inline voice playback is iMessage-only; RCS/SMS use audio attachment fallback. Keep owner scope and queue, cap spoken text, and persist the generated audio and attachment ID before sending so retries do not regenerate speech. Follow current endpoint idempotency support in the voice-memo reference; do not assume the normal text message idempotency field works there. This exercise sends audio; receiving and transcribing voice notes is a separate future extension. No public media-serving route is needed when using attachment uploads.

## 26. Copy the environment template · Reference · setup

Reference slide linked from the early clone slide. The Copy full .env template button copies the complete blank .env.example, including optional provider overrides; no real credentials appear. Download offers the same template as a file. Copy it to .env in the project root and edit locally with nano .env. Keep any values already filled in when updating an existing .env. LINQ_WEBHOOK_SECRET is populated by API subscription creation later; it is not invented by the attendee. Start WORKSHOP_MILESTONE at 1, then increase after each integration checkpoint. The default OpenRouter key also serves memory extraction and embeddings, so optional MODEL_API_KEY and MEM0_EMBEDDING_API_KEY may remain blank. Save in nano with Ctrl+O, Enter, Ctrl+X.
