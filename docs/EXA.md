# Exa in this workshop

The twelve-minute overview explains Exa and its API choices at a high level. Search, Contents, Agent, and Monitors each have a dedicated slide with a direct documentation link. Highlights and data partners are separate slides. The step-by-step implementation stages follow the overview in the same deck, starting with Exa MCP on slide 14.

## Endpoint choices

| Product | Endpoint | What it returns |
| --- | --- | --- |
| [Search](https://exa.ai/docs/search/quickstart) | `POST /search` | Ranked sources and relevant page content |
| [Contents](https://exa.ai/docs/contents/quickstart) | `POST /contents` | Extracted content from supplied URLs |
| [Agent](https://exa.ai/docs/agent/quickstart) | `POST /agent/runs` | Grounded research and structured results |
| [Monitors](https://exa.ai/docs/monitors/quickstart) | `POST /monitors` | Recurring searches with webhook updates |

Today's application calls **Search**. Qwen runs the personal agent's decision loop and composes its replies. The Exa Agent API is a separate product; the workshop does not call it.

## Search with highlights

`search()` in `src/agent.ts` requests `type: 'auto'`, five results, and `contents: { highlights: true }`. Highlights provide query-relevant passages from results. The application retains their source URLs and retrieval time, bounds the excerpts, and returns them to the model as a tool message. The current code does not make a separate Contents request. See [Search](https://exa.ai/docs/search/quickstart) and [Highlights](https://exa.ai/docs/search/highlights).

[exa-search-capture.json](../slides/exa-search-capture.json) contains a selected result from a real Search request made for the deck on November 6, 2026. Five results were returned; the official Robin San Francisco result and its verbatim price passage were retained. The displayed title is edited for clarity; the original metadata title is preserved in the JSON. This capture is separate from the authored phone conversation.

## Data partners are a separate topic

The presenter distinguishes two access paths:

- **Through Search:** some partner-backed sources resolve into search results. Your agent consumes the returned source evidence through the usual search response.
- **Through Exa Agent:** attach provider capabilities through `dataSources` on an Agent run. The Exa Agent can query those partner tools alongside its web research.

These are access paths rather than a universal, mutually exclusive provider classification. Exa Agent also uses the Search data index. Access and enablement vary by provider and account. See the [Search data index](https://exa.ai/docs/search/data/overview) and [Exa Connect](https://exa.ai/docs/agent/connect/overview).

The slide names Similarweb, Financial Datasets, and Particle as documented Agent/Connect examples. It does not assign named providers to the Search lane without a verified provider-specific mapping, or imply those Connect tools are enabled in the workshop's Search request.
