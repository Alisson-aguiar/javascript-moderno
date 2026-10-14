/* ============================================
   Toggle Dark / Light — com prefers-color-scheme
   ============================================ */

const STORAGE_KEY = 'jsm-theme';

export function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;

  const media = window.matchMedia('(prefers-color-scheme: light)');

  // Aplica tema inicial
  const saved = localStorage.getItem(STORAGE_KEY);
  apply(saved || (media.matches ? 'light' : 'dark'));

  // Reage a mudanças do sistema (só se o usuário NÃO escolheu)
  const onSystemChange = (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      apply(e.matches ? 'light' : 'dark');
    }
  };
  // API moderna; fallback para navegadores antigos
  media.addEventListener
    ? media.addEventListener('change', onSystemChange)
    : media.addListener(onSystemChange);

  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = root.dataset.bsTheme === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function apply(theme) {
    root.dataset.bsTheme = theme;
    root.dataset.theme = theme;
    const icon = btn?.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    document.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
  }
}
