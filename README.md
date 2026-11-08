# A personal agent you can text

Build an agent that remembers your preferences, searches the web, and replies on your phone. The workshop starts with a terminal conversation and ends with iMessage: a short answer, a source card, and optional emoji reactions and voice replies.

The agent runs on your laptop. Qwen inference, Exa search, Kernel browsers, and Linq messaging run through hosted APIs. Mem0 stores your preferences locally and uses OpenRouter for extraction and embeddings.

[Workshop guide](docs/WORKSHOP.md) · [Slides PDF](slides/DECK.pdf) · [Instructor guide](docs/FACILITATOR.md)

## Before you arrive

- Git and access to this private repository.
- Node.js **26.12.1+**, with npm. We recommend [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for macOS, Linux, or Windows WSL. Install it before class and reopen your terminal.
- A coding assistant running locally, with support for MCP.
- An OpenRouter key to start. Arrange Exa, Kernel, and [Linq sandbox access](docs/LINQ.md) before the workshop so you can complete the phone exercises.

## Clone and set up

Run this at the start of the presentation:

```sh
git clone https://github.com/JakubHojsan/aie-code-personal-agent.git
cd aie-code-personal-agent
nvm install
nvm use
npm ci
cp .env.example .env
nano .env
```

The nvm commands select the version in `.nvmrc`; skip them if you already have Node 26.12.1+ installed. Check with `node --version` and `npm --version`.

Keep `WORKSHOP_MILESTONE=1` and fill in `OPENROUTER_API_KEY`. Save in nano with Ctrl+O, Enter, then Ctrl+X.

| Setting | When you need it |
| --- | --- |
| `OPENROUTER_API_KEY` | Model replies; also memory and optional speech |
| `EXA_API_KEY` | Step 2: web search |
| `KERNEL_API_KEY` | Step 3: browser sessions |
| `OWNER_PHONE_NUMBER` | Set before saving memories so terminal and phone share your profile |
| `LINQ_API_KEY` | Step 5: messaging |
| `LINQ_PHONE_NUMBER` | Your assigned Linq line, distinct from your own number |
| `LINQ_WEBHOOK_SECRET` | Returned when you create the webhook subscription |

Use country codes for both phone numbers. Set `AGENT_TIMEZONE` to your local timezone. Mem0 needs no separate API key with the supplied defaults.

## Build during the workshop

First, [connect Exa MCP](docs/MCP.md) to your coding assistant and use it to find the API docs. Then follow the [copyable prompts and checkpoints](docs/WORKSHOP.md).

| Step | What you connect | What to verify |
| --- | --- | --- |
| 1 · Model | Qwen through OpenRouter | A reply in your terminal |
| 2 · Search | Exa Search with highlights | An answer with a source you can check |
| 3 · Browser | Kernel | Read a page in a browser session |
| 4 · Memory | Mem0 | A saved preference survives a restart |
| 5 · Messaging | Linq | Text your agent and receive a reply |
| 6 · Source cards | Native link previews | Compare a plain URL with a rich card |

Edit [starter/integrations.ts](starter/integrations.ts). The functions are intentionally unfinished: implement each TODO, set the matching `WORKSHOP_MILESTONE` in `.env`, and restart the agent.

```sh
npm run doctor
npm run starter:chat
```

Use terminal chat through step 4. After [Linq and ngrok setup](docs/LINQ.md), switch to `npm run starter:phone`. The doctor checks configuration; the checkpoint verifies the actual integration.

Optional exercises in [starter/extras.ts](starter/extras.ts) add query-based emoji reactions and voice replies through OpenRouter TTS.

## Run the complete demo

The finished implementation lives in `src/` and works independently of the starter exercises.

For a quick terminal reply, keep milestone 1 and run:

```sh
npm run solution:chat
```

For the full phone demo, fill in the settings above, set `WORKSHOP_MILESTONE=5`, and follow [Linq setup](docs/LINQ.md) to start ngrok and register its HTTPS URL. Once the webhook secret is saved:

```sh
npm run doctor
npm run solution:phone
```

Text the Linq number from your configured owner number:

```text
/remember I live in San Francisco, love sushi, and budget $150 per person before tax and tip.
Find a sushi dinner option for Friday.
/memories
/voice Tell me about your recommendation in one sentence.
```

Search replies include a short summary and one source card by default. Ask for more sources to get up to three. The complete version also chooses emoji reactions from the request and supports natural requests such as “send me a voice note.”

Keep your laptop awake and ngrok running. If the tunnel URL changes, update the webhook subscription. Stop terminal chat before starting phone mode; use one agent process per data directory. Only messages from the configured owner are accepted.

## Present

```sh
npm run slides
```

Open [localhost:3402](http://127.0.0.1:3402). One deck covers the 12-minute overview and the workshop, which starts on slide 14. Allow 40 minutes for the core exercises and 8 minutes for Q&A; the optional exercises need extra time.

Arrow keys navigate, **N** opens speaker notes, and **F** enters fullscreen. The deck opens without API keys and includes a labeled worked example. Switch to the live demo when configured.

## Repository

| Folder | Contents |
| --- | --- |
| `starter/` | Attendee TODOs and entry points |
| `src/` | Complete agent and shared adapters |
| `slides/` | HTML deck, PDF, and speaker notes |
| `docs/` | Workshop prompts, setup, and instructor notes |
| `test/` | Agent, memory, browser, and messaging tests |

Run `npm run typecheck` and `npm test` to check changes. After editing embedded slide notes, run `npm run slides:notes` to update the speaker-notes file.

Credentials stay in `.env`; conversations, memory, and audio stay in `.data/`. Both are ignored by Git. The code is [MIT licensed](LICENSE); hosted API usage requires your own accounts and credits.
