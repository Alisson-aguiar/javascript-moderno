/* ============================================
   Registro do Service Worker + status
   ============================================ */

export function initPWA() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      console.log('✅ SW registrado:', reg.scope);
      watchUpdates(reg);
    } catch (err) {
      console.warn('❌ Falha ao registrar SW:', err);
    }
  });

  // Online/offline — toast simples
  window.addEventListener('offline', () =>
    toast('📴 Você está offline. Conteúdo em cache disponível.')
  );
  window.addEventListener('online', () => toast('🌐 Conexão restaurada.'));
}

function watchUpdates(reg) {
  reg.addEventListener('updatefound', () => {
    const nw = reg.installing;
    if (!nw) return;
    nw.addEventListener('statechange', () => {
      if (nw.state === 'installed' && navigator.serviceWorker.controller) {
        toast('🔄 Nova versão disponível. Recarregue a página.');
      }
    });
  });
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'pwa-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('is-visible'), 50);
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 300);
  }, 4000);
}
