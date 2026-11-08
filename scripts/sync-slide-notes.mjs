import { readFile, writeFile } from 'node:fs/promises';

// Keep the printable presenter notes aligned with the notes embedded in the deck.
const root = new URL('../', import.meta.url);
const html = await readFile(new URL('slides/index.html', root), 'utf8');
const decode = text => text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const sections = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)];
const notes = sections.map(([, attrs, body], i) => {
  const title = attrs.match(/data-title="([^"]+)"/)?.[1];
  const time = attrs.match(/data-time="([^"]+)"/)?.[1];
  const note = body.match(/<aside class="speaker-note">([\s\S]*?)<\/aside>/)?.[1];
  if (!title || !time || !note) throw new Error(`Missing presenter metadata on slide ${i + 1}`);
  return `## ${i + 1}. ${decode(title)} · ${decode(time)}\n\n${decode(note).trim()}`;
});
if (!notes.length) throw new Error('No slides found');
await writeFile(new URL('slides/SPEAKER-NOTES.md', root), `# Speaker notes\n\nGenerated from slides/index.html with npm run slides:notes.\n\n${notes.join('\n\n')}\n`);
console.log(`Synced notes for ${notes.length} slides.`);
