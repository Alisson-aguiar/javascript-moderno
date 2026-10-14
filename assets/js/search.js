/* ============================================
   Busca instantânea (client-side)
   Index: assets/data/search-index.json
   ============================================ */

let INDEX = [];
let _router = null;

export async function initSearch({ indexUrl, router: r }) {
  _router = r;
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const toggle = document.getElementById('searchToggle');
  if (!overlay || !input || !results) return;

  // Carrega índice
  try {
    const res = await fetch(indexUrl);
    INDEX = await res.json();
  } catch (e) {
    console.warn('Índice de busca não disponível:', e);
  }

  /* ---------- Abrir/fechar ---------- */
  const open = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 50);
  };
  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    input.value = '';
    results.innerHTML = '';
  };

  toggle?.addEventListener('click', open);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    }
    if (e.key === 'Escape') close();
  });

  /* ---------- Busca com debounce ---------- */
  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => render(query(input.value)), 120);
  });

  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('a');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (document.activeElement.closest('a')?.nextElementSibling || items[0]).focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      (
        document.activeElement.closest('a')?.previousElementSibling || items[items.length - 1]
      ).focus();
    }
    if (e.key === 'Enter' && document.activeElement.tagName === 'A') {
      document.activeElement.click();
    }
  });

  /* ---------- Render ---------- */
  function render(items) {
    if (!items.length) {
      results.innerHTML = input.value ? '<li class="search-empty">Nenhum resultado.</li>' : '';
      return;
    }
    results.innerHTML = items
      .map(
        ({ slug, title, snippet, score }) => `
      <li>
        <a href="#${slug}" data-slug="${slug}">
          <div class="search-result__head">
            <strong>${title}</strong>
            <small>${score}%</small>
          </div>
          <p>${snippet}</p>
        </a>
      </li>`
      )
      .join('');

    results.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => close());
    });
  }

  /* ---------- Algoritmo de busca ---------- */
  function query(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) return [];

    return INDEX.map((item) => {
      const text = `${item.title} ${item.content}`.toLowerCase();
      const idx = text.indexOf(q);
      if (idx === -1) return null;

      // score simples: posição + densidade
      const score = Math.max(20, Math.round(100 - (idx / text.length) * 100));

      // snippet ao redor
      const start = Math.max(0, idx - 40);
      const raw = item.content.slice(start, start + 140);
      const snippet = (start > 0 ? '…' : '') + highlight(raw, q) + (raw.length === 140 ? '…' : '');

      return { ...item, score, snippet };
    })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  function highlight(str, q) {
    const re = new RegExp(`(${escapeRegex(q)})`, 'ig');
    return escapeHtml(str).replace(re, '<mark>$1</mark>');
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
