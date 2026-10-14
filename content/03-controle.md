## if / else if / else

```javascript
const idade = 20;

if (idade < 12) {
  console.log('Criança');
} else if (idade < 18) {
  console.log('Adolescente');
} else {
  console.log('Adulto');
}
```

## Operador ternário

```javascript
const status = idade >= 18 ? 'maior' : 'menor';
```

## switch — quando há muitos casos

```javascript
switch (diaSemana) {
  case 1: console.log('Segunda'); break;
  case 2: console.log('Terça');   break;
  default: console.log('Outro dia');
}
```

::tip::Prefira objetos de lookup a `switch` gigantes:
```javascript
const rotulos = { 1: 'Segunda', 2: 'Terça' };
rotulos[diaSemana] ?? 'Outro dia';
```
::end::

## Tratamento de erros

```javascript
try {
  const dados = JSON.parse(inputInvalido);
  processar(dados);
} catch (err) {
  console.error('Falha ao processar:', err.message);
} finally {
  console.log('Sempre executa.');
}
```

## Lançando erros personalizados

```javascript
class ValidacaoError extends Error {
  constructor(msg, campo) {
    super(msg);
    this.name = 'ValidacaoError';
    this.campo = campo;
  }
}

function validar(usuario) {
  if (!usuario.email) {
    throw new ValidacaoError('Email obrigatório', 'email');
  }
}
```

## Playground

::play::
function classificar(n) {
  if (n < 0) return 'negativo';
  if (n === 0) return 'zero';
  return 'positivo';
}
[-1, 0, 1].forEach(n => console.log(n, '→', classificar(n)));
::end::