/* ============================================
   Anotações por capítulo — localStorage
   ============================================ */

const KEY = 'jsm-notes';

const read = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const write = (d) => localStorage.setItem(KEY, JSON.stringify(d));

export function initNotes() {
  document.addEventListener('route:loaded', () => {
    const slug = location.hash.replace('#', '').split('/')[0];
    if (!slug) return;
    mountNotesPanel(slug);
  });
}

function mountNotesPanel(slug) {
  const container = document.getElementById('lessonContent');
  if (!container) return;

  // Evita duplicar
  document.getElementById('notesPanel')?.remove();

  const saved = read()[slug] || '';

  const panel = document.createElement('section');
  panel.id = 'notesPanel';
  panel.className = 'notes-panel';
  panel.innerHTML = `
    <header class="notes-panel__head">
      <h3><i class="bi bi-journal-text"></i> Minhas anotações</h3>
      <button class="notes-panel__toggle" type="button" aria-expanded="false">
        <i class="bi bi-chevron-down"></i>
      </button>
    </header>
    <div class="notes-panel__body">
      <textarea id="notesArea" class="notes-panel__area"
                placeholder="Anote insights, dúvidas, links..." spellcheck="false">${escapeHtml(saved)}</textarea>
      <footer class="notes-panel__foot">
        <span class="notes-panel__status" id="notesStatus">Salvo automaticamente</span>
        <button class="btn-clear" id="notesClear">Limpar</button>
      </footer>
    </div>
  `;

  container.appendChild(panel);

  const area = panel.querySelector('#notesArea');
  const status = panel.querySelector('#notesStatus');
  const toggle = panel.querySelector('.notes-panel__toggle');
  const clear = panel.querySelector('#notesClear');

  // Auto-save com debounce
  let t;
  area.addEventListener('input', () => {
    status.textContent = 'Digitando...';
    clearTimeout(t);
    t = setTimeout(() => {
      const all = read();
      all[slug] = area.value;
      write(all);
      status.textContent = '✓ Salvo';
      setTimeout(() => (status.textContent = 'Salvo automaticamente'), 1500);
    }, 500);
  });

  // Colapsar
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Se já tem conteúdo, abre
  if (saved) panel.classList.add('is-open');

  // Limpar
  clear.addEventListener('click', () => {
    if (!confirm('Apagar anotações deste capítulo?')) return;
    const all = read();
    delete all[slug];
    write(all);
    area.value = '';
    status.textContent = 'Anotações removidas';
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
