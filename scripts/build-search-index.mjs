import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CONTENT = 'content';
const OUT = 'assets/data/search-index.json';

const files = (await readdir(CONTENT)).filter((f) => f.endsWith('.md'));
const index = [];

for (const file of files) {
  // slug = nome sem número e sem .md
  const slug = file.replace(/^\d+-/, '').replace('.md', '');
  const raw = await readFile(join(CONTENT, file), 'utf8');

  const title = (raw.match(/^##\s+(.+)$/m)?.[1] || slug).trim();
  const content = raw
    .replace(/```[\s\S]*?```/g, '')
    .replace(/::\w+::|::end::/g, '')
    .replace(/[#*`>|-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  index.push({ slug, title, content });
}

await writeFile(OUT, JSON.stringify(index, null, 2));
console.log(`✅ Índice com ${index.length} capítulos gerado em ${OUT}`);
