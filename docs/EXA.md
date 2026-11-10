# Exa in this workshop

The twelve-minute overview opens with “What is Exa?”: search for AI agents, an independent web index, and a network of data partners. It reuses the partner grid and use-case layout from the latest AIE Shanghai deck. Search, Contents, Agent, and Monitors each have a dedicated slide with a direct documentation link. The later data-partner slide explains Search and Exa Agent access paths. The step-by-step implementation stages follow the overview in the same deck, starting with Exa MCP on slide 14.

## Overview slide source

The overview is adapted from [AIE Shanghai, commit 966c63b](https://github.com/JakubHojsan/aie-shanghai/blob/966c63b802879e473180df1443dfc18f1d780646/web/keynote.js), the latest default-branch commit when fetched on November 9, 2026. Its 18 partner marks and Cursor, Cognition, and HubSpot logos are stored locally with provenance in [asset sources](../slides/assets/SOURCES.md). The grid preserves the Shanghai selection and does not claim a current total provider count. The message and product distinction are checked against [Exa Connect](https://exa.ai/connect) and the [Search data index](https://exa.ai/docs/search/data/overview).

## Endpoint choices

| Product | Endpoint | What it returns |
| --- | --- | --- |
| [Search](https://exa.ai/docs/search/quickstart) | `POST /search` | Ranked sources and relevant page content |
| [Contents](https://exa.ai/docs/contents/quickstart) | `POST /contents` | Extracted content from supplied URLs |
| [Agent](https://exa.ai/docs/agent/quickstart) | `POST /agent/runs` | Grounded research and structured results |
| [Monitors](https://exa.ai/docs/monitors/quickstart) | `POST /monitors` | Recurring searches with webhook updates |

Today's application calls **Search**. Qwen runs the personal agent's decision loop and composes its replies. The Exa Agent API is a separate product; the workshop does not call it.

## Search with highlights

Slide 8 adapts the AIE Shanghai highlights animation: a long illustrative page, selection of a query-relevant passage, and a captured Search result. It explains why highlights help: fewer irrelevant input tokens and more room for conversation and tool results, while retaining source URLs. Surrounding page copy is fictional. Word counts refer to the illustration, not measured token or latency savings. The result comes from the existing San Francisco capture below rather than the Shanghai restaurant recordings. “See result” skips ahead; “Replay” restarts the sequence. Reduced motion and the PDF show the result directly.

`search()` in `src/agent.ts` requests `type: 'auto'`, five results, and `contents: { highlights: true }`. Highlights provide query-relevant passages from results. The application retains their source URLs and retrieval time, bounds the excerpts, and returns them to the model as a tool message. The current code does not make a separate Contents request. See [Search](https://exa.ai/docs/search/quickstart) and [Highlights](https://exa.ai/docs/search/highlights).

[exa-search-capture.json](../slides/exa-search-capture.json) contains a selected result from a real Search request made for the deck on November 6, 2026. Five results were returned; the official Robin San Francisco result and its verbatim price passage were retained. The displayed title is edited for clarity; the original metadata title is preserved in the JSON. This capture is separate from the authored phone conversation.

## Data partner access paths

The presenter distinguishes two access paths:

- **Through Search:** some partner-backed sources resolve into search results. Your agent consumes the returned source evidence through the usual search response.
- **Through Exa Agent:** attach provider capabilities through `dataSources` on an Agent run. The Exa Agent can query those partner tools alongside its web research.

These are access paths rather than a universal, mutually exclusive provider classification. Exa Agent also uses the Search data index. Access and enablement vary by provider and account. See the [Search data index](https://exa.ai/docs/search/data/overview) and [Exa Connect](https://exa.ai/docs/agent/connect/overview).

The introduction shows the broader partner network. Slide 9 then names Similarweb, Financial Datasets, and Particle as documented Agent/Connect examples. It does not assign named providers to the Search lane without a verified provider-specific mapping, or imply those Connect tools are enabled in the workshop's Search request.
