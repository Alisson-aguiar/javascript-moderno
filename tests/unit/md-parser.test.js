import { beforeAll, describe, expect, it } from 'vitest';
import { Router } from '../../assets/js/router.js';

describe('mdToHtml', () => {
  let router;
  beforeAll(() => {
    router = new Router({ contentSelector: '#test', tocSelector: '#toc' });
  });

  it('converte heading h2 em elemento com id', () => {
    const html = router.mdToHtml('## O que é JavaScript?');
    expect(html).toContain('<h2 id="o-que-e-javascript">O que é JavaScript?</h2>');
  });

  it('escapa HTML dentro de code fences', () => {
    const md = '```html\n<script>alert(1)</script>\n```';
    const html = router.mdToHtml(md);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('converte callouts tip corretamente', () => {
    const md = '::tip::Use const!::end::';
    const html = router.mdToHtml(md);
    expect(html).toContain('callout callout--tip');
    expect(html).toContain('Use const!');
  });
});
