## O problema: recursos que precisam ser fechados

Arquivos, conexões, locks… Se um erro ocorrer no meio, o `finally` tradicional resolve, mas fica verboso.

## `using` e `await using` (ES2023 — Resource Management)

```javascript
class Arquivo {
  constructor(nome) { this.nome = nome; console.log('abrindo', nome); }
  [Symbol.dispose]() { console.log('fechando', this.nome); }
}

{
  using f = new Arquivo('dados.txt');
  // ... usa f
} // dispose() chamado automaticamente
```

## Assíncrono com `await using`

```javascript
class Conexao {
  async [Symbol.asyncDispose]() { await this.fechar(); }
}

{
  await using conn = await abrirConexao();
  await conn.query('SELECT 1');
} // fecha automaticamente
```

## Fallback — try/finally

```javascript
const recurso = adquirir();
try {
  usar(recurso);
} finally {
  recurso.liberar();
}
```

::tip::`using` é a evolução do try/finally. Sempre que um recurso tiver ciclo de vida claro, prefira-o — menos código, menos chance de esquecer de fechar.::end::

::warn::`using` exige runtime moderno (Node 24+, Chrome 134+). Para ambientes antigos, use try/finally.::end::

## Playground (fallback)

::play::
function comRecurso(fn) {
  console.log('→ adquirindo');
  try { return fn(); }
  finally { console.log('← liberando'); }
}
comRecurso(() => console.log('usando recurso'));
::end::