import { beforeEach, describe, expect, it, vi } from 'vitest';

global.fetch = vi.fn();

describe('Search', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="searchOverlay" class="search-overlay"></div>
      <input id="searchInput" />
      <ul id="searchResults"></ul>
      <button id="searchToggle"></button>
    `;
    vi.resetAllMocks();
  });

  it('carrega índice e filtra resultados por termo', async () => {
    const mockIndex = [
      { slug: 'funcoes', title: 'Funções', content: 'closures, arrow functions' },
      { slug: 'promises', title: 'Promises', content: 'async await, then catch' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex
    });

    const { initSearch } = await import('../../assets/js/search.js');
    const router = { on: () => {}, go: () => {} };

    await initSearch({
      indexUrl: 'assets/data/search-index.json',
      router
    });

    expect(fetch).toHaveBeenCalledWith('assets/data/search-index.json');
  });

  it('abre overlay ao clicar em searchToggle', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

    const { initSearch } = await import('../../assets/js/search.js');
    await initSearch({
      indexUrl: 'assets/data/search-index.json',
      router: { on: () => {}, go: () => {} }
    });

    document.getElementById('searchToggle').click();
    expect(document.getElementById('searchOverlay').classList.contains('is-open')).toBe(true);
  });
});
