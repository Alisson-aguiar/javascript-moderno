/* ============================================
   Compartilhar capítulo
   - Web Share API (mobile) com fallback
   - Copia link com âncora do heading visível
   ============================================ */

export function initShare() {
  document.addEventListener('route:loaded', () => {
    const slug = location.hash.replace('#', '').split('/')[0];
    if (slug) mountShareButton(slug);
  });

  // Atalho: Ctrl/Cmd + Shift + C
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      share();
    }
  });
}

function mountShareButton(slug) {
  // Não cria botão solto; usa a barra flutuante
  document.getElementById('shareBtn')?.remove();

  // Garante que a barra existe
  if (!document.getElementById('floatingActions')) {
    const bar = document.createElement('aside');
    bar.id = 'floatingActions';
    bar.className = 'floating-actions';
    bar.innerHTML = `
      <button class="fab" data-fab="share" title="Compartilhar (Ctrl+Shift+C)">
        <i class="bi bi-share"></i>
        <span class="fab__label">Compartilhar</span>
      </button>
      <button class="fab" data-fab="present" title="Modo apresentação (P)">
        <i class="bi bi-easel"></i>
        <span class="fab__label">Apresentar</span>
      </button>
      <button class="fab" data-fab="top" title="Voltar ao topo">
        <i class="bi bi-arrow-up"></i>
        <span class="fab__label">Topo</span>
      </button>
    `;
    document.body.appendChild(bar);

    bar.querySelector('[data-fab="share"]').addEventListener('click', () => share(slug));
    bar.querySelector('[data-fab="present"]').addEventListener('click', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    });
    bar.querySelector('[data-fab="top"]').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mostra só depois de rolar um pouco
    const onScroll = () => {
      bar.classList.toggle('is-visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

async function share(_slug) {
  const url = location.href;
  const title = document.title;

  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch {
      /* usuário cancelou */
    }
  }

  // Fallback: copiar para clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast('🔗 Link copiado!');
  } catch {
    prompt('Copie o link:', url);
  }
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'share-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 300);
  }, 2200);
}
