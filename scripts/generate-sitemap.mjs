import { readdir, writeFile } from 'node:fs/promises';

const SITE_URL = 'https://seudominio.com';
const CONTENT_DIR = 'content';

const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));

const urls = [
  { loc: '/', priority: '1.0' },
  { loc: '/tutorial.html', priority: '0.9' },
  ...files.map((f) => {
    const slug = f.replace(/^\d+-/, '').replace('.md', '');
    return { loc: `/tutorial.html#${slug}`, priority: '0.8' };
  })
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

await writeFile('sitemap.xml', sitemap);
console.log(`✅ Sitemap com ${urls.length} URLs gerado.`);
