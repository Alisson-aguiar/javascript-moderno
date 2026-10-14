## Variáveis: let, const e (adeus) var

Em JavaScript moderno usamos `const` por padrão e `let` quando o valor precisa mudar. `var` tem escopo de função e hoisting confuso — evite.

```javascript
const PI = 3.14159;         // não pode ser reatribuído
let contador = 0;           // pode mudar
contador += 1;
```

## Os 7 tipos primitivos

| Tipo        | Exemplo               |
|-------------|-----------------------|
| `string`    | `'olá'`               |
| `number`    | `42`, `3.14`          |
| `boolean`   | `true` / `false`      |
| `null`      | `null`                |
| `undefined` | `undefined`           |
| `symbol`    | `Symbol('id')`        |
| `bigint`    | `9007199254740993n`   |

Tudo o que não é primitivo é **objeto** (arrays, funções, datas…).

## Descobrindo o tipo com typeof

```javascript
typeof 'texto'      // 'string'
typeof 42           // 'number'
typeof true         // 'boolean'
typeof undefined    // 'undefined'
typeof null         // 'object'  ← bug histórico
typeof Symbol()     // 'symbol'
typeof 10n          // 'bigint'
typeof {}           // 'object'
typeof []           // 'object'
typeof function(){} // 'function'
```

::warn::`typeof null` retorna `'object'` por um bug de 1995 que nunca foi corrigido por compatibilidade. Use `value === null` para checar.::end::

## Coerção implícita — a armadilha

```javascript
'5' + 1     // '51'  (string concatena)
'5' - 1     // 4     (número subtrai)
[] + []     // ''    (array vira string)
[] + {}     // '[object Object]'
{} + []     // 0
```

::tip::Sempre prefira `===` (igualdade estrita) em vez de `==`.::end::

## Escopo em blocos

```javascript
{
  let dentro = 'só aqui';
  const tambem = 'aqui também';
}
// console.log(dentro); // ReferenceError
```

## Teste

::play::
const tipo = (v) => typeof v;
console.log(tipo('oi'), tipo(10), tipo(null), tipo([]));
console.log('5' + 1, '5' - 1);
console.log(0.1 + 0.2 === 0.3); // cuidado com floats!
::end::