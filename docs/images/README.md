# iPhone previews

The README images are browser-rendered illustrations of the completed Linq demo, not screenshots from a real iPhone or captured model responses. They contain authored example conversations and no personal messages. Both use Exa as the contact name and the Exa symbol as its contact photo.

- `iphone-weather.png`: dark-mode iMessage conversation with an Exa weather source card, bottom-left emoji reactions, and typing.
- `iphone-memory.png`: light-mode iMessage conversation showing natural-language memory, reactions, and typing.

The weather card image is the existing `slides/assets/exa-sf-weather-og.png` snapshot dated November 7, 2026. It is sample data, not a current forecast. `exa-mark.svg` is the symbol path from the existing `slides/assets/exa.svg` logo, with a cropped viewBox. Brand artwork retains its owners’ rights. Actual Messages layout and rich previews depend on the device, protocol, and source metadata. Linq typing is iMessage-only; these images do not depict the WhatsApp channel.

## Regenerate

Open `iphone-previews.html` in a browser. With [agent-browser](https://github.com/vercel-labs/agent-browser) installed, run from the repository root:

```sh
agent-browser --session iphone-previews open "file://$PWD/docs/images/iphone-previews.html"
agent-browser --session iphone-previews set viewport 920 930 2
agent-browser --session iphone-previews screenshot '#weather' docs/images/iphone-weather.png
agent-browser --session iphone-previews screenshot '#memory' docs/images/iphone-memory.png
agent-browser --session iphone-previews close
```

Each PNG is 818 × 1736 pixels, displayed at 330 pixels wide in the README. All preview assets are local; rendering makes no provider calls.
