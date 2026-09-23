---
name: how-i-build
description: Template de site de notas de engenharia, onde o texto manda e a interface recua.
colors:
  paper: "oklch(0.985 0.001 250)"
  ink: "oklch(0.19 0.005 250)"
  surface: "oklch(0.965 0.002 250)"
  muted: "oklch(0.945 0.002 250)"
  muted-ink: "oklch(0.51 0.006 250)"
  rule: "oklch(0.885 0.003 250)"
  ember: "oklch(0.53 0.13 45)"
  ember-ink: "oklch(0.99 0 0)"
  ember-soft: "oklch(0.94 0.025 55)"
  positive: "oklch(0.62 0.15 150)"
  paper-dark: "oklch(0.165 0.004 250)"
  ink-dark: "oklch(0.925 0.003 250)"
  surface-dark: "oklch(0.205 0.004 250)"
  muted-dark: "oklch(0.245 0.004 250)"
  muted-ink-dark: "oklch(0.66 0.005 250)"
  rule-dark: "oklch(0.295 0.005 250)"
  ember-dark: "oklch(0.74 0.11 48)"
  ember-ink-dark: "oklch(0.17 0.004 250)"
  ember-soft-dark: "oklch(0.27 0.035 45)"
  positive-dark: "oklch(0.72 0.16 150)"
typography:
  display:
    fontFamily: "IBM Plex Serif, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.25
  code:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  all: "0px"
components:
  button:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.all}"
    padding: "4px 8px"
  button-hover:
    textColor: "{colors.ember}"
---

# Design System: how-i-build

## Overview

**Creative North Star: "A Página de Leitura, com o Manual por dentro"**

Página de leitura por fora, manual de engenharia por dentro, caderno de
laboratório na personalidade. A interface desaparece enquanto se lê e sabe
aparecer quando a parte técnica chega.

Por fora, o texto manda. A medida de 68 caracteres, a entrelinha folgada, o
espaço vertical generoso e os títulos discretos existem para que alguém fique
até o fim de um texto longo. Nada de cartão decorativo, nada de sombra, nada
competindo com o parágrafo.

Por dentro, quando o assunto exige, a página vira manual: bloco de comando,
tabela, diagrama e hierarquia de títulos tratados com o mesmo cuidado do texto.
Um encadeamento como `rustup → shim → toolchain → rustc → sysroot` precisa caber
na tela sem virar parágrafo.

A personalidade vem do laboratório, e ela é o que separa este site de um blog de
programação: o texto mostra o processo de descoberta, inclusive as hipóteses
erradas. Por isso existem blocos próprios de observação, hipótese e experimento.
Não é estética de caderno vintage — é a estrutura de quem investigou e anotou.

Isto aqui não é portfólio de dev com artigos. É uma publicação pessoal de
engenharia.

**Key Characteristics:**
- Medida de 68 caracteres, e o texto nunca ultrapassa.
- O bloco técnico pode ser mais largo que o texto: código e diagrama respiram.
- Zero curvas, zero sombras — separação por régua de 1 px.
- Uma só cor de destaque, reservada ao que é clicável.
- Claro e escuro com o mesmo acabamento; nenhum é a versão de segunda.
- A interface some enquanto se lê.

## Colors

Um cinza levemente azulado do começo ao fim, com um único acento quente.

### Primary
- **Brasa** (`{colors.ember}` no claro, `{colors.ember-dark}` no escuro): o
  laranja terroso do link, do foco e da seleção de texto. É a única cor do site
  e só aparece onde há ação.
- **Brasa Suave** (`{colors.ember-soft}`): fundo de realce dentro do texto,
  onde o laranja cheio gritaria.

### Neutral
- **Papel** (`{colors.paper}` / `{colors.paper-dark}`): o fundo. Não é branco
  puro nem preto puro; os dois cansam a vista num texto longo.
- **Tinta** (`{colors.ink}` / `{colors.ink-dark}`): o texto corrido.
- **Tinta Apagada** (`{colors.muted-ink}`): data, metadado, legenda — tudo que
  informa sem ser lido em sequência.
- **Superfície** e **Neutro**: dois degraus acima do fundo, para o bloco que
  precisa se destacar do papel sem virar cartão.
- **Régua** (`{colors.rule}`): a linha de 1 px que separa tudo.

### Tertiary
- **Verde** (`{colors.positive}`): exclusivo de estado positivo, como versão
  publicada. Nunca decorativo.

### Named Rules

**A Regra da Cor Única.** Existe um acento no site, e ele significa "isto leva a
algum lugar". Cor nova só entra se carregar um significado que nenhuma das
existentes carrega.

**A Regra do Papel.** Fundo e texto nunca são branco puro nem preto puro. O
contraste é suficiente e não é máximo, porque o alvo é meia hora de leitura.

## Typography

**Display Font:** IBM Plex Serif
**Body Font:** IBM Plex Sans
**Label/Mono Font:** IBM Plex Mono

**Character:** uma família desenhada para documentação técnica, com três cortes
que combinam entre si por construção. A serifada tem a régua reta e a
personalidade contida; a sem serifa é neutra sem ser anônima; a monoespaçada
não parece fantasia de terminal.

### Hierarchy
- **Display** (serifada, 400, 1.25rem, 1.625, -0.015em): abertura de texto e
  chamada. É a voz de quem está contando algo.
- **Headline** (sem serifa, 600, 1.125rem, 1.4): título de seção e de cartão.
- **Body** (sem serifa, 400, 1rem, 1.625): o parágrafo, em no máximo 68
  caracteres por linha.
- **Label** (sem serifa, 400, 0.875rem): controle, data, metadado.
- **Code** (monoespaçada, 0.9em): trecho de código, caminho de arquivo e dado.

### Named Rules

**A Regra das 68.** A medida do texto é 68 caracteres. Não é sugestão: é o que
separa ler de varrer.

**A Regra das Duas Vozes.** Serifada para o que se lê, sem serifa para o que se
usa. Um título dentro do texto é serifado; um título de controle não.

## Layout

Coluna única, com o texto limitado a 68 caracteres e o resto da página mais
largo que ele. A separação entre blocos é sempre uma régua de 1 px, nunca uma
caixa.

A rolagem é suave só para quem não pediu o contrário, e a barra de progresso de
leitura existe porque a página de um texto é longa de propósito.

## Elevation & Depth

**Não há sombra em lugar nenhum.** A profundidade vem de dois degraus de tom
acima do fundo, para blocos que precisam se separar, e da régua de 1 px para o
resto. Um site que imita papel não pode ter objeto flutuando.

### Named Rules

**A Regra do Plano.** Nada flutua. Se um elemento precisa se destacar, ele muda
de tom ou ganha uma régua — nunca uma sombra.

## Shapes

Raio zero em tudo: botão, campo, bloco de código e imagem. A forma vem da linha.
A única geometria recorrente é o retângulo separado por régua.

## Components

### Botões
- **Forma:** retângulo com borda de 1 px na cor da régua, sem raio.
- **Padrão:** texto na cor da tinta, 0.875rem, padding de 4 px por 8 px.
- **Hover:** borda e texto passam para Brasa, com transição só de cor.
- **Regra de implementação:** `className` do botão é só para layout. Cor e borda
  vêm do componente, porque sem um utilitário de mesclagem quem vence é a ordem
  da folha de estilo, não a ordem do atributo.

### Cartões de post e de projeto
- **Forma:** sem caixa e sem sombra; o que separa é a régua entre itens.
- **Conteúdo:** título em headline, data e metadado em tinta apagada.

### Seletor de tema e de idioma
- **Forma:** grupo de opções com borda de 1 px.
- **Selecionado:** borda e texto em Brasa, com a opção escolhida trazida para a
  frente para desenhar o contorno inteiro sobre a borda da vizinha.
- Depende de um atributo que um script escreve em `<html>` antes do React, o que
  evita o piscar de tema errado no primeiro quadro.

### Texto longo (prose)
- **Medida:** 68 caracteres.
- **Entrelinha:** folgada.
- **Citação e abertura:** serifada.
- **Código embutido:** monoespaçada a 0.9em, para casar a altura de x com a
  fonte ao redor.

### Blocos de investigação

São a assinatura do site: marcam o processo, não o resultado.

- **Observação** — o que surpreendeu.
- **Hipótese** — o que se achava antes, inclusive quando estava errado.
- **Experimento** — o que se fez para descobrir, com o comando e a saída.

Forma: régua acima e abaixo com o rótulo em caixa alta na monoespaçada, sem
caixa fechada e sem cor de fundo. A hipótese errada não é um erro a esconder, e
por isso nenhum dos três usa cor de alerta.

### Links
- **Cursor:** o padrão do sistema em controle de interface; mão apenas em link
  dentro do texto, onde o ponteiro é o sinal de que um trecho leva a algo.
- **Seleção de texto:** fundo Brasa com o texto invertido.

## Do's and Don'ts

### Do:
- **Do** deixar o bloco técnico ultrapassar a medida do texto quando ele precisar.
- **Do** escrever a hipótese errada e mantê-la visível.
- **Do** limitar todo texto corrido a 68 caracteres por linha.
- **Do** separar com régua de 1 px em vez de caixa.
- **Do** dar ao tema claro e ao escuro o mesmo acabamento.
- **Do** reservar o laranja para o que leva a algum lugar.
- **Do** manter o cursor padrão em controle e a mão só em link dentro do texto.

### Don't:
- **Don't** acrescentar sombra a nada.
- **Don't** introduzir raio de canto.
- **Don't** usar branco puro ou preto puro no fundo ou no texto.
- **Don't** usar a monoespaçada como enfeite "técnico" — ela é para código, dado
  e caminho de arquivo.
- **Don't** passar cor ou borda pelo `className` de um componente de interface.
