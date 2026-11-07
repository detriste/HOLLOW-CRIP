# Cripta do Vazio

Abra `index.html` no navegador (duplo clique funciona, não precisa de servidor).

## Estrutura
```
index.html            página e ordem de carregamento dos scripts
css/style.css         estilos
js/
  01-config.js        canvas, constantes, entrada e variáveis globais do jogo
  data/               tabelas.js (andares, biomas, layouts, drops, acessórios)
                      itens.js (itens e textos de detalhe) · herois.js
  audio.js            efeitos sonoros
  gfx/                utils.js (polígonos, texto) · icones.js · sprites.js
  entities/inimigos.js
  world/              perigos.js (perigos dos chefes) · andar.js (geração e salas)
  player.js           jogador e habilidade especial
  combat.js           bombas, tiros, dano, mortes, partículas
  ui/                 selecao.js · inventario.js · hud.js (HUD e mapa)
                      configuracoes.js (menu de teclas, salvo no navegador)
  input.js            teclado e mouse
  game/               fluxo.js (início de partida) · update.js · render.js
  main.js             loop principal e inicialização
```

## Importante
Os arquivos JS são scripts comuns (não módulos) e compartilham o mesmo escopo global,
como no arquivo original. **A ordem das tags `<script>` no `index.html` importa:** não reordene.
Se criar um arquivo novo, inclua-o antes de `js/main.js`.
