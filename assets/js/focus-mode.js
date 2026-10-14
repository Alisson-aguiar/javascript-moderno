/* ============================================
   Modo foco — esconde sidebars, centraliza leitura
   Tecla: F    |    Persistência: localStorage
   ============================================ */

const KEY = 'jsm-focus';

export function initFocusMode() {
  // Estado inicial
  if (localStorage.getItem(KEY) === '1') {
    document.body.classList.add('focus-mode');
  }

  // Botão (inserido na navbar do tutorial)
  const navbar = document.querySelector('.navbar-js .navbar-nav');
  if (navbar) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
      <button class="btn btn-icon" id="focusToggle" aria-label="Modo foco (F)" title="Modo foco (F)">
        <i class="bi bi-arrows-angle-contract"></i>
      </button>
    `;
    navbar.insertBefore(li, navbar.querySelector('#searchToggle')?.parentElement || null);

    li.querySelector('#focusToggle').addEventListener('click', toggle);
  }

  document.addEventListener('keydown', (e) => {
    if (isTyping(e.target)) return;
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggle();
    }
  });

  updateIcon();
}

function toggle() {
  const on = document.body.classList.toggle('focus-mode');
  localStorage.setItem(KEY, on ? '1' : '0');
  updateIcon();
}

function updateIcon() {
  const icon = document.querySelector('#focusToggle i');
  if (!icon) return;
  const on = document.body.classList.contains('focus-mode');
  icon.className = on ? 'bi bi-arrows-angle-expand' : 'bi bi-arrows-angle-contract';
}

function isTyping(el) {
  return el.matches?.('input, textarea, [contenteditable="true"]');
}
