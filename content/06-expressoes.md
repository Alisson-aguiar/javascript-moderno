## Operadores aritméticos

```javascript
5 + 2   // 7
5 - 2   // 3
5 * 2   // 10
5 / 2   // 2.5
5 % 2   // 1  (resto)
5 ** 2  // 25 (potência)
```

## Comparação

```javascript
1 == '1'    // true   (coerção)
1 === '1'   // false  (estrito) ← prefira
null == undefined  // true
null === undefined // false
NaN === NaN        // false
Object.is(NaN, NaN)// true
```

## Lógicos

```javascript
true && 'valor'    // 'valor'
false || 'padrão'  // 'padrão'
null ?? 'fallback' // 'fallback'  (só null/undefined)
```

::tip::Use `??` em vez de `||` quando `0`, `''` e `false` forem valores válidos.::end::

## Encadeamento opcional `?.`

```javascript
const user = { perfil: { nome: 'Ana' } };
user.perfil?.nome          // 'Ana'
user.endereco?.rua         // undefined (sem erro)
user.saudar?.()            // chama só se existir
```

## Operador de atribuição composta

```javascript
let x = 10;
x += 5;  // 15
x -= 3;  // 12
x *= 2;  // 24
x ??= 'valor';
```

## Desestruturação

```javascript
const [a, b] = [1, 2];
const { nome, idade = 0 } = { nome: 'Ana' };
const { perfil: { nome: n } } = user;
```

## Playground

::play::
const cfg = { tema: { cor: 'gold' }, debug: false };
console.log(cfg?.tema?.cor ?? 'padrão');
console.log(cfg?.log?.nivel ?? 'info');
::end::