/* ============================================
   Progresso do usuário — localStorage
   Com reset, export e import
   ============================================ */

const KEY = 'jsm-progress';

const chapters = [
  'introducao',
  'gramatica',
  'controle',
  'repeticao',
  'funcoes',
  'expressoes',
  'numbers',
  'datas',
  'regex',
  'indexadas',
  'chave',
  'objetos',
  'classes',
  'promises',
  'typed',
  'iteradores',
  'resources',
  'intl',
  'modules'
];

const read = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export function markRead(slug) {
  const data = read();
  data[slug] = { read: true, at: Date.now() };
  write(data);
  renderProgress();
}

export function isRead(slug) {
  return !!read()[slug]?.read;
}

export function initProgress() {
  renderProgress();
  injectControls();

  document.addEventListener('route:loaded', () => {
    const slug = location.hash.replace('#', '').split('/')[0];
    if (slug) {
      markRead(slug);
      document.querySelectorAll('[data-route]').forEach((a) => {
        a.classList.toggle('is-read', isRead(a.dataset.route));
      });
    }
  });
}

function injectControls() {
  const widget = document.querySelector('.progress-widget');
  if (!widget || widget.querySelector('.progress-widget__actions')) return;

  const footer = document.createElement('footer');
  footer.className = 'progress-widget__actions';
  footer.innerHTML = `
    <button class="pw-btn" data-action="export" title="Exportar JSON">
      <i class="bi bi-download"></i> Exportar
    </button>
    <button class="pw-btn" data-action="import" title="Importar JSON">
      <i class="bi bi-upload"></i> Importar
    </button>
    <button class="pw-btn pw-btn--danger" data-action="reset" title="Resetar progresso">
      <i class="bi bi-trash3"></i> Resetar
    </button>
  `;
  widget.appendChild(footer);

  footer.querySelector('[data-action="export"]').addEventListener('click', exportProgress);
  footer.querySelector('[data-action="import"]').addEventListener('click', importProgress);
  footer.querySelector('[data-action="reset"]').addEventListener('click', resetProgress);
}

function exportProgress() {
  const data = { progress: read(), notes: JSON.parse(localStorage.getItem('jsm-notes') || '{}') };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `js-moderno-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.progress) write(data.progress);
      if (data.notes) localStorage.setItem('jsm-notes', JSON.stringify(data.notes));
      alert('✅ Progresso importado! Recarregue para ver.');
      location.reload();
    } catch (err) {
      alert(`❌ Arquivo inválido: ${err.message}`);
    }
  });
  input.click();
}

function resetProgress() {
  if (!confirm('Apagar TODO o progresso? As anotações serão mantidas.')) return;
  localStorage.removeItem(KEY);
  renderProgress();
  document.querySelectorAll('[data-route]').forEach((a) => a.classList.remove('is-read'));
}

function renderProgress() {
  const bar = document.getElementById('progressBar');
  const label = document.getElementById('progressLabel');
  if (!bar || !label) return;

  const data = read();
  const done = chapters.filter((s) => data[s]?.read).length;
  const pct = Math.round((done / chapters.length) * 100);

  bar.style.width = `${pct}%`;
  bar.setAttribute('aria-valuenow', pct);
  label.textContent = `${done} / ${chapters.length} capítulos`;
}
