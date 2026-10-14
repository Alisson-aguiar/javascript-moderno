## O problema

Código assíncrono com callbacks vira "callback hell". Promises resolvem isso.

```javascript
function buscar(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      id > 0 ? resolve({ id, nome: 'Ana' }) : reject(new Error('ID inválido'));
    }, 500);
  });
}
```

## then / catch / finally

```javascript
buscar(1)
  .then(u => console.log(u))
  .catch(e => console.error(e.message))
  .finally(() => console.log('fim'));
```

## async / await — o jeito moderno

```javascript
async function main() {
  try {
    const u = await buscar(1);
    console.log(u);
  } catch (e) {
    console.error(e.message);
  }
}
```

## Combinando promises

```javascript
await Promise.all([buscar(1), buscar(2)]);      // paralelo, falha rápido
await Promise.allSettled([buscar(1), buscar(-1)]); // sempre resolve
await Promise.race([buscar(1), timeout(1000)]); // o primeiro
await Promise.any([buscar(-1), buscar(2)]);     // o primeiro que der certo
```

::tip::`async` sempre retorna uma Promise — mesmo se você fizer `return 42`.::end::

::warn::Não misture `.then` com `await` desnecessariamente. Escolha um estilo por função.::end::

## Playground

::play::
const espera = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('início');
  await espera(300);
  console.log('depois de 300ms');
  const [a, b] = await Promise.all([espera(100).then(() => 'A'), espera(150).then(() => 'B')]);
  console.log('resultado:', a, b);
})();
::end::