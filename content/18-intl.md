## Intl — internacionalização nativa

A API `Intl` formata números, datas, moedas, listas e plurais **sem bibliotecas externas**.

## Números

```javascript
new Intl.NumberFormat('pt-BR').format(1234567.89);
// '1.234.567,89'

new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL'
}).format(1999.9);
// 'R$ 1.999,90'

new Intl.NumberFormat('pt-BR', {
  style: 'percent', minimumFractionDigits: 1
}).format(0.075);
// '7,5%'
```

## Datas e horas

```javascript
const d = new Date('2026-09-30T14:30');
new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long', timeStyle: 'short'
}).format(d);
// '30 de setembro de 2026 às 14:30'
```

## Listas

```javascript
const l = new Intl.ListFormat('pt-BR', {
  style: 'long', type: 'conjunction'
});
l.format(['maçã', 'banana', 'uva']);
// 'maçã, banana e uva'
```

## Plural

```javascript
const pr = new Intl.PluralRules('pt-BR');
pr.select(1); // 'one'
pr.select(2); // 'other'
```

## Ordenação alfabética

```javascript
['ábaco', 'zebra', 'açaí'].sort(new Intl.Collator('pt-BR').compare);
```

::tip::Nunca formate datas/números manualmente com `if` de locale. `Intl` já faz isso corretamente, inclusive fusos e variações regionais.::end::

## Playground

::play::
const valor = 1234567.89;
console.log('BRL:', new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(valor));
console.log('USD:', new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(valor));
console.log('EUR:', new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR' }).format(valor));
::end::