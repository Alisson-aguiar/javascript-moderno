import { beforeEach, describe, expect, it, vi } from 'vitest';

global.fetch = vi.fn();

describe('Router', () => {
  beforeEach(() => {
    window.location.hash = '#introducao';
    document.body.innerHTML = `
      <div id="content"></div>
      <div id="toc"></div>
    `;
    vi.resetAllMocks();
  });

  it('renderiza conteúdo ao carregar rota', async () => {
    const md = `## Teste de renderização

Este é um parágrafo de conteúdo de teste suficientemente longo para passar
na verificação de sanidade do parser. Ele contém mais de cinquenta caracteres
para garantir que o aviso de "conteúdo muito curto" não seja acionado.

Outro parágrafo para reforçar o tamanho do conteúdo renderizado.`;

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => md
    });

    const { Router } = await import('../../assets/js/router.js');
    const router = new Router({ contentSelector: '#content', tocSelector: '#toc' });

    await router.load('introducao');
    expect(document.querySelector('#content').innerHTML).toContain('Teste de renderização');
  });
});
