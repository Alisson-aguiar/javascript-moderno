## Criando datas

```javascript
new Date()                          // agora
new Date('2026-01-15')              // ISO
new Date(2026, 0, 15)               // ano, mês(0-11), dia
Date.now()                          // ms desde 1970
```

::warn::O mês em `new Date(ano, mes, dia)` vai de **0 a 11**. `new Date(2026, 0, 15)` é 15 de janeiro.::end::

## Manipulando

```javascript
const d = new Date('2026-01-15T10:30:00');
d.getFullYear();      // 2026
d.getMonth();         // 0
d.getDate();          // 15
d.getHours();         // 10
d.toISOString();      // '2026-01-15T10:30:00.000Z'
d.getTime();          // timestamp em ms
```

## Formatando com Intl

```javascript
const d = new Date();
new Intl.DateTimeFormat('pt-BR').format(d);
// '30/09/2026'

new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long', timeStyle: 'short'
}).format(d);
// '30 de setembro de 2026 às 14:30'
```

::tip::`Intl.DateTimeFormat` respeita o fuso e o idioma do usuário automaticamente — sempre prefira a `toLocaleString()`.::end::

## Tempo relativo

```javascript
const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
rtf.format(-1, 'day');   // 'ontem'
rtf.format(3, 'hour');   // 'em 3 horas'
```

## Calculando diferenças

```javascript
const diffMs = new Date('2026-12-25') - new Date();
const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
```

## Playground

::play::
const agora = new Date();
console.log(new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(agora));
const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
console.log(rtf.format(-2, 'day'));
::end::