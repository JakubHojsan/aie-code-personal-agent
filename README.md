# Build a personal agent you can text

A US-focused developer workshop using the AIE personal-agent architecture: Qwen → Exa search → Kernel browser → Mem0 memory → Linq messaging. The agent process, conversation database, and memory files run on your laptop. Model inference, embeddings, search, Kernel browser sessions, and messaging use hosted services. Your laptop must stay awake and connected to receive messages.

**Session:** 12-minute overview · 40-minute workshop · 8-minute Q&A. For a 90-minute slot: 12-minute overview · 60-minute workshop · 18-minute Q&A.

[Full deck PDF](slides/DECK.pdf) · [Participant milestones](docs/WORKSHOP.md) · [Linq prework](docs/LINQ.md) · [Facilitator guide](docs/FACILITATOR.md) · [Architecture](docs/ARCHITECTURE.md) · [Exa endpoints and partners](docs/EXA.md)

## Choose the version

- **Attendee skeleton:** [starter/integrations.ts](starter/integrations.ts), with five integration TODOs and a source-card exercise. Run `npm run starter:chat`, then `npm run starter:phone`.
- **Complete instructor version:** [src/agent.ts](src/agent.ts). Run `npm run solution:chat` or `npm run solution:phone`. `npm run chat` and `npm start` remain aliases for the complete version.

Both versions use the shared provider adapters and transport. Starter integrations are injected explicitly and never silently fall back to the completed callbacks. The instructor phone demo does not import the starter.

## Start here

Use Node **26.12.1+**. This directory is a standalone package; all commands below run here. The repository includes the deck, attendee exercises, and complete instructor implementation.

```sh
git clone https://github.com/JakubHojsan/aie-code-personal-agent.git
cd aie-code-personal-agent
nvm install
nvm use
npm ci
cp .env.example .env
```

Run `nano .env` in the project folder: set `WORKSHOP_MILESTONE=1` and your `OPENROUTER_API_KEY`. Set your own `OWNER_PHONE_NUMBER` before starting if you want CLI memories to follow you into Linq. Use your city's IANA timezone, for example `America/New_York` or `America/Los_Angeles`.

```sh
npm run doctor
npm run starter:chat
```

Increase `WORKSHOP_MILESTONE` in `.env` and restart the command as you complete each step. The workshop exercises connect each integration in `starter/integrations.ts`; the complete implementation remains in `src/`.

| Milestone | What you get | How to run |
| --- | --- | --- |
| 1 | Model conversation | Model key; `npm run starter:chat` |
| 2 | Exa web search with highlights | Add `EXA_API_KEY`; `npm run starter:chat` |
| 3 | Kernel rendered-page inspection | Add `KERNEL_API_KEY`; `npm run starter:chat` |
| 4 | Persistent Mem0 preferences | Configure embeddings; `npm run starter:chat` |
| 5 | Linq phone messaging | Complete [prework](docs/LINQ.md); `npm run starter:phone` |

The example file starts at milestone 1. Use the starter commands for the five TODO exercises or the solution commands for the complete version. Each stage adds a capability to the same agent. Kernel uses hosted browser sessions and needs no local browser or Python installation.

## Present the overview

```sh
npm run slides
```

Open **http://127.0.0.1:3402** for the **12-minute overview**: what Exa does, its Search/Contents/Agent/Monitors APIs, highlights, data partners, and the personal-agent demo. Each API slide links to the relevant docs. Slide 2 asks attendees to clone and install dependencies while the overview runs.

Continue to **slide 14 in the same deck** for the **hands-on walkthrough**. First connect and use [Exa MCP](docs/MCP.md) in your coding assistant; then build model → Exa → Kernel → Mem0 → Linq with copyable prompts, documentation links, and checkpoints. Finish with a sixth feature exercise: compare a text-only search reply with native source cards. Optional extension slides add emoji reactions and OpenRouter-generated voice replies; their unfinished functions are in starter/extras.ts.

Use arrows or Space to advance, **N** for speaker notes, and **F** for fullscreen. View the deck without API keys. The overview’s phone defaults to a labeled authored example; switch to Live agent for real model responses when configured. Live stage chat uses an isolated `.data/stage` profile. Present the actual Messages conversation when verifying Linq transport.

## Run the phone agent

After [Linq setup](docs/LINQ.md), set milestone 5 and run:

```sh
npm run doctor
npm run solution:phone
```

In a second terminal, run your preinstalled HTTPS tunnel to port **3400**. Send your provisioned Linq line a message from the owner number in `.env`. Only that owner's direct inbound text messages are accepted. The CLI uses that same owner scope when `OWNER_PHONE_NUMBER` is set. Stop the CLI before using the phone agent; run one process per data directory.

Try these in order:

```text
/remember I live in San Francisco, love sushi, and aim for $150 per person before tax and tip.
Find two dinner options in San Francisco for Friday. Use current sources and include menu links.
My friend wants somewhere quiet. How does that change your recommendation?
/memories
```

The memory command runs Mem0 extraction and embedding calls, then verifies persistence. A recommendation is not a reservation. The complete version sends a short summary and one source card by default, chooses an emoji reaction from the request, and supports `/voice` replies. Ask explicitly for multiple sources to receive up to three cards. The starter adds these features through TODOs 6–8.

## Develop and publish

```sh
npm run typecheck
npm test
```

Code is [MIT licensed](LICENSE). Exa, OpenRouter, Kernel, and Linq are external services with their own accounts, terms, and usage charges. Mem0 is an open-source component; Qwen supplies the model weights. Kernel provides hosted browser sessions. No GPU is required for this hosted-inference workshop.

Keep `.env`, `.data`, and `node_modules` out of version control. The blank `.env.example` is safe to share. For a private repository, grant attendees access before the event so the opening clone command works.
