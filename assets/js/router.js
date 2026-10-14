/* ============================================
   Router SPA — JavaScript Moderno
   Carrega conteúdo dinamicamente via fetch()
   ============================================ */

const ROUTES = {
  introducao: { title: 'Introdução', file: 'content/01-introducao.md' },
  gramatica: { title: 'Gramática e tipos', file: 'content/02-gramatica.md' },
  controle: { title: 'Controle de fluxo e erros', file: 'content/03-controle.md' },
  repeticao: { title: 'Repetição e iteração', file: 'content/04-repeticao.md' },
  funcoes: { title: 'Funções', file: 'content/05-funcoes.md' },
  expressoes: { title: 'Expressões e operadores', file: 'content/06-expressoes.md' },
  numbers: { title: 'Numbers and strings', file: 'content/07-numbers.md' },
  datas: { title: 'Datas e horários', file: 'content/08-datas.md' },
  regex: { title: 'Expressões Regulares', file: 'content/09-regex.md' },
  indexadas: { title: 'Coleções indexadas', file: 'content/10-indexadas.md' },
  chave: { title: 'Coleções chave-valor', file: 'content/11-chave.md' },
  objetos: { title: 'Trabalhando com objetos', file: 'content/12-objetos.md' },
  classes: { title: 'Usando classes', file: 'content/13-classes.md' },
  promises: { title: 'Usando promises', file: 'content/14-promises.md' },
  typed: { title: 'Arranjos tipados', file: 'content/15-typed.md' },
  iteradores: { title: 'Iteradores e geradores', file: 'content/16-iteradores.md' },
  resources: { title: 'Resource management', file: 'content/17-resources.md' },
  intl: { title: 'Internationalization', file: 'content/18-intl.md' },
  modules: { title: 'JavaScript modules', file: 'content/19-modules.md' }
};

export class Router {
  constructor({ contentSelector, tocSelector, basePath = '' }) {
    this.contentEl = document.querySelector(contentSelector);
    this.tocEl = document.querySelector(tocSelector);
    this.basePath = basePath;
    this.cache = new Map();
    this.current = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());
  }

  /* ---------- Navegação ---------- */
  handleRoute() {
    const raw = location.hash.replace('#', '') || 'introducao';
    const [slug, ...rest] = raw.split('/');
    const anchor = rest.join('/');

    if (!ROUTES[slug]) return this.notFound(slug);

    // Mesmo capítulo + âncora → só rola
    if (slug === this.current) {
      if (anchor) this.scrollToAnchor(anchor);
      return;
    }

    // Novo capítulo → carrega e depois rola
    this.current = slug;
    this.load(slug).then(() => {
      if (anchor) this.scrollToAnchor(anchor);
      else this.scrollTop(); // ← só rola ao topo se não houver âncora
    });
  }

  async load(slug) {
    this.contentEl.classList.add('is-loading');
    try {
      const html = await this.fetch(slug);
      this.contentEl.innerHTML = html;

      // Sanidade
      const rendered = this.contentEl.textContent.trim().length;
      if (rendered < 50) {
        this.contentEl.innerHTML = `
        <div class="callout callout--warn">
          <i class="bi bi-exclamation-triangle"></i>
          <p><strong>Aviso:</strong> conteúdo muito curto. Verifique <code>${slug}.md</code>.</p>
        </div>`;
      }

      this.buildToc();
      this.updateActiveLink(slug);
      this.emitHighlight();
      this.scrollTop(); // ✅ mantém apenas quando é troca de capítulo
    } catch (err) {
      this.contentEl.innerHTML = `
      <div class="callout callout--warn">
        <i class="bi bi-exclamation-triangle"></i>
        <p><strong>Erro:</strong> ${err.message}</p>
      </div>`;
    } finally {
      this.contentEl.classList.remove('is-loading');
    }
  }

  async fetch(slug) {
    if (this.cache.has(slug)) return this.cache.get(slug);

    const route = ROUTES[slug];
    const res = await fetch(this.basePath + route.file);
    if (!res.ok) throw new Error(`Não foi possível carregar "${route.title}".`);

    const md = await res.text();
    const html = this.mdToHtml(md);

    // Atualiza meta tags dinâmicas
    document.title = `${route.title} · JavaScript Moderno`;

    // Meta description (extrai do primeiro parágrafo)
    const firstP = html.match(/<p>(.+?)<\/p>/);
    const description = firstP ? firstP[1].replace(/<[^>]+>/g, '').slice(0, 160) : '';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = description;
      document.head.appendChild(metaDesc);
    }

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const og = document.createElement('meta');
      og.setAttribute('property', 'og:title');
      og.setAttribute('content', `${route.title} · JavaScript Moderno`);
      document.head.appendChild(og);
    }

    this.cache.set(slug, html);
    return html;
  }

  /* ---------- Markdown → HTML (parser robusto) ---------- */
  /* ---------- Markdown → HTML (parser linha-a-linha, robusto) ---------- */
  mdToHtml(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;

    const slugify = (s) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w]+/g, '-')
        .replace(/^-|-$/g, '');

    const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const inline = (s) => {
      // 1) Escapa HTML cru ANTES de qualquer outra coisa
      const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return esc
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    };

    while (i < lines.length) {
      const line = lines[i];

      /* ---- Fence de código: ```lang ... ``` ---- */
      const fence = line.match(/^```(\w+)?\s*$/);
      if (fence) {
        const lang = fence[1] || 'javascript';
        const codeLines = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // consome o ``` final
        const safe = escapeHtml(codeLines.join('\n'));
        out.push(
          `<pre class="code-block language-${lang}"><code class="language-${lang}">${safe}</code></pre>`
        );
        continue;
      }

      /* ---- Playground ::play:: ... ::end:: ---- */
      if (/^::play::\s*$/.test(line)) {
        const codeLines = [];
        i++;
        while (i < lines.length && !/^::end::\s*$/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        const safe = escapeHtml(codeLines.join('\n'));
        out.push(`<pre data-play><code class="language-javascript">${safe}</code></pre>`);
        continue;
      }

      /* ---- Callout ::tip:: ... ::end:: (inline) ---- */
      const calloutTip = line.match(/^::tip::([\s\S]*?)::end::\s*$/);
      if (calloutTip) {
        out.push(
          `<div class="callout callout--tip"><i class="bi bi-lightbulb"></i><p>${inline(calloutTip[1].trim())}</p></div>`
        );
        i++;
        continue;
      }
      const calloutWarn = line.match(/^::warn::([\s\S]*?)::end::\s*$/);
      if (calloutWarn) {
        out.push(
          `<div class="callout callout--warn"><i class="bi bi-exclamation-triangle"></i><p>${inline(calloutWarn[1].trim())}</p></div>`
        );
        i++;
        continue;
      }

      /* ---- Heading ---- */
      const h3 = line.match(/^###\s+(.+)$/);
      if (h3) {
        const t = h3[1].replace(/\*\*/g, '').trim();
        out.push(`<h3 id="${slugify(t)}">${t}</h3>`);
        i++;
        continue;
      }
      const h2 = line.match(/^##\s+(.+)$/);
      if (h2) {
        const t = h2[1].replace(/\*\*/g, '').trim();
        out.push(`<h2 id="${slugify(t)}">${t}</h2>`);
        i++;
        continue;
      }

      /* ---- Tabela ---- */
      if (/^\|.+\|\s*$/.test(line) && /^\|[\s\-:|]+\|\s*$/.test(lines[i + 1] || '')) {
        const headers = line
          .split('|')
          .slice(1, -1)
          .map((s) => s.trim());
        i += 2; // pula header + separator
        const rows = [];
        while (i < lines.length && /^\|.+\|\s*$/.test(lines[i])) {
          rows.push(
            lines[i]
              .split('|')
              .slice(1, -1)
              .map((s) => s.trim())
          );
          i++;
        }
        const thead = `<thead><tr>${headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`;
        const tbody = `<tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
          .join('')}</tbody>`;
        out.push(`<div class="table-wrap"><table class="md-table">${thead}${tbody}</table></div>`);
        continue;
      }

      /* ---- Lista não ordenada ---- */
      if (/^[-*]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ''))}</li>`);
          i++;
        }
        out.push(`<ul class="md-list">${items.join('')}</ul>`);
        continue;
      }

      /* ---- Lista ordenada ---- */
      if (/^\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
          items.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
          i++;
        }
        out.push(`<ol class="md-list">${items.join('')}</ol>`);
        continue;
      }

      /* ---- Blockquote ---- */
      if (/^>\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^>\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^>\s+/, ''));
          i++;
        }
        out.push(`<blockquote>${inline(items.join(' '))}</blockquote>`);
        continue;
      }

      /* ---- Linha em branco ---- */
      if (/^\s*$/.test(line)) {
        i++;
        continue;
      }

      /* ---- Parágrafo (agrupa linhas até linha vazia ou bloco) ---- */
      const paraLines = [line];
      i++;
      while (
        i < lines.length &&
        !/^\s*$/.test(lines[i]) &&
        !/^```/.test(lines[i]) &&
        !/^#{2,3}\s/.test(lines[i]) &&
        !/^::play::/.test(lines[i]) &&
        !/^[-*]\s+/.test(lines[i]) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^\|/.test(lines[i]) &&
        !/^>/.test(lines[i])
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      out.push(`<p>${inline(paraLines.join(' '))}</p>`);
    }

    return out.join('\n');
  }

  /* ---------- TOC dinâmica ---------- */
  buildToc() {
    if (!this.tocEl) return;
    const headings = this.contentEl.querySelectorAll('h2, h3');
    if (!headings.length) return (this.tocEl.innerHTML = '');

    let html = '<h3 class="toc__title">Neste capítulo</h3><ul class="toc__list">';
    headings.forEach((h) => {
      const level = h.tagName === 'H3' ? ' toc--sub' : '';
      html += `<li class="${level.trim()}"><a href="#${this.current}/${h.id}">${h.textContent}</a></li>`;
    });
    html += '</ul>';
    this.tocEl.innerHTML = html;
  }

  updateActiveLink(slug) {
    document.querySelectorAll('[data-route]').forEach((a) => {
      a.classList.toggle('active', a.dataset.route === slug);
    });
  }

  emitHighlight() {
    // Injeta botão "copiar" em cada bloco
    this.contentEl.querySelectorAll('pre[class*="language-"]').forEach((pre) => {
      if (pre.querySelector('.code-copy')) return;
      const btn = document.createElement('button');
      btn.className = 'code-copy';
      btn.textContent = 'Copiar';
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(pre.querySelector('code').innerText);
        btn.textContent = '✓ Copiado';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = 'Copiar';
          btn.classList.remove('is-copied');
        }, 1800);
      });
      pre.appendChild(btn);
    });

    document.dispatchEvent(
      new CustomEvent('route:loaded', {
        detail: { container: this.contentEl }
      })
    );
  }

  scrollTop(smooth = true) {
    const offset = document.querySelector('.navbar-js')?.offsetHeight ?? 80;
    const y = this.contentEl.getBoundingClientRect().top + window.scrollY - offset - 20;
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' });
  }
  scrollToAnchor(id) {
    // Espera o conteúdo estar no DOM
    requestAnimationFrame(() => {
      const el = this.contentEl.querySelector(`#${CSS.escape(id)}`);
      if (!el) return;

      const offset = document.querySelector('.navbar-js')?.offsetHeight ?? 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset - 20;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Realce visual do heading
      el.classList.add('anchor-highlight');
      setTimeout(() => el.classList.remove('anchor-highlight'), 1600);
    });
  }

  notFound(slug) {
    this.contentEl.innerHTML = `
      <div class="callout callout--warn">
        <i class="bi bi-question-circle"></i>
        <p>Capítulo <code>${slug}</code> não encontrado.</p>
      </div>`;
  }
}
