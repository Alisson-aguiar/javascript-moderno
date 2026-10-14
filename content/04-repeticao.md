## for clássico

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

## for...of — itera valores

```javascript
const frutas = ['maçã', 'banana', 'uva'];
for (const fruta of frutas) {
  console.log(fruta);
}
```

## for...in — itera chaves de objetos

```javascript
const pessoa = { nome: 'Ana', idade: 30 };
for (const chave in pessoa) {
  console.log(chave, pessoa[chave]);
}
```

::warn::`for...in` também percorre propriedades herdadas do protótipo. Use `Object.keys()`, `Object.values()` ou `Object.entries()` quando quiser só as próprias.::end::

## while / do...while

```javascript
let n = 0;
while (n < 3) { console.log(n); n++; }

do {
  console.log('executa pelo menos uma vez');
} while (false);
```

## Métodos funcionais — o jeito moderno

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);                 // [2,4,6,8,10]
nums.filter(n => n % 2 === 0);        // [2,4]
nums.reduce((s, n) => s + n, 0);      // 15
nums.find(n => n > 3);                // 4
nums.some(n => n > 4);                // true
nums.every(n => n > 0);               // true
```

::tip::`map`, `filter` e `reduce` são a base da programação funcional em JS. Domine-os antes de partir para libs externas.::end::

## Playground

::play::
const nums = [1, 2, 3, 4, 5];
const dobrados = nums.map(n => n * 2);
const pares = dobrados.filter(n => n % 2 === 0);
const soma = pares.reduce((a, b) => a + b, 0);
console.log('dobrados:', dobrados);
console.log('pares:', pares);
console.log('soma:', soma);
::end::