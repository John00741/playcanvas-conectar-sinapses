# Conectar Sinapses — PlayCanvas

Protótipo jogável do minijogo "Conectar Sinapses" (Capítulo 1 do jogo de Orientação
Profissional) rodando dentro de um projeto PlayCanvas, como prova de conceito antes
da produção final em Twine + H5P.

A UI inteira é construída via DOM/CSS por um único script (`scripts/cerebro-ui.js`),
carregado no editor do PlayCanvas como **External Script**, apontando para a versão
publicada via jsDelivr:

```
https://cdn.jsdelivr.net/gh/John00741/playcanvas-conectar-sinapses@main/scripts/<arquivo>.js
```

## Scripts

- `cerebro-ui.js` — monta a tela (HUD de atributos, cena de matching, decisão e
  resultado) e roda toda a lógica do minijogo. Anexar a qualquer entidade única na
  cena (ex.: a câmera).
