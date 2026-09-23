# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

O usuário primário é um desenvolvedor que quer um lugar próprio para escrever o
que constrói, e que não quer montar um blog do zero nem aceitar o visual de uma
plataforma. Ele clona este repositório, troca três arquivos e publica.

O segundo público é quem lê o site publicado: alguém que chegou por um link, por
uma busca, ou um recrutador avaliando o autor. Essa pessoa não conhece o
template e nunca vai saber que ele existe.

Os dois se encontram num ponto só: o template precisa parecer suficientemente
acabado para que o dev queira que o trabalho dele apareça ali dentro.

## Product Purpose

Um template de site de notas de engenharia — textos curtos sobre o que se
constrói e as decisões por trás — em dois idiomas, com versão e changelog lidos
das próprias releases do GitHub.

Sucesso é o dev sair de clone a site publicado sem ter de entender o código:
mexer em `src/config/site.ts`, escrever em `src/content/` e traduzir
`src/i18n/dictionaries.ts`. E, do outro lado, o leitor ficar até o fim do texto.

## Positioning

Não é gerador de blog nem tema de plataforma: é um projeto Next.js inteiro que
passa a ser seu. O que ele resolve e os outros não é a disciplina — tradução
faltando quebra o build, changelog vem das releases em vez de um arquivo que
envelhece, e o conteúdo é MDX tipado em vez de texto solto.

## Operating Context

- Quem usa clona, edita três lugares e publica na Vercel. A documentação vive em
  `docs/`, e `README.md` é a porta de entrada.
- Bun é gerenciador e executor de tarefas; o build roda no Node, de propósito.
- `bun run typecheck` faz três coisas: gera os tipos de rota do Next, roda o
  `tsc` e confere que todo conteúdo existe em todos os idiomas.
- O leitor chega por um link direto para um texto, quase sempre pelo celular, e
  decide em segundos se fica.
- Hoje o template e o site do autor convivem em dois branches do mesmo
  repositório — `main` é o template, `site` é o conteúdo. Há uma decisão em
  andamento de separar em dois repositórios, para o template poder ser marcado
  como *template repository* no GitHub e não carregar conteúdo pessoal.

## Capabilities and Constraints

- Dois idiomas, `/[locale]`, com o idioma padrão sem prefixo: cada página tem um
  endereço por idioma, e os dois são indexáveis.
- Tipos de conteúdo: posts, estudos de caso de projeto, e páginas avulsas
  (sobre, perfil, privacidade), todos em MDX com metadados exportados.
- Changelog e versão vêm das GitHub Releases, inclusive de um repositório só de
  releases quando o código é privado.
- Tema claro e escuro escolhidos pelo leitor: cookie para o idioma,
  `localStorage` para o tema, ambos escritos só quando alguém escolhe.
- Nada de analytics e nada de banner de consentimento, e a página de privacidade
  descreve exatamente esse estado. Acrescentar rastreamento a um fork torna
  aquela página mentirosa.
- Um idioma novo é uma linha em `site.ts`, e todo conteúdo existente para de
  compilar até ser traduzido. É intencional.

## Brand Commitments

- Nome: `how-i-build`. Frase: "Engineering notes: what I build and the decisions
  behind it".
- Nada no template nomeia o autor. Os marcadores de exemplo estão em
  `src/config/site.ts` e na URL do projeto de amostra.
- Tipografia atual: IBM Plex nas três variantes, sans, serif e mono.
- Idiomas de origem: inglês define o conjunto de chaves; português é a segunda
  tradução.

## Evidence on Hand

- Três posts e os estudos de caso reais existem no branch de conteúdo, não no
  template. O template traz um projeto de amostra e um `hello-world`.
- As capas ficam em `public/blog/`.
- Não existem usuários declarados, número de instalações, depoimento ou
  benchmark. Nada disso pode ser inventado para encher a tela.

## Product Principles

1. O texto é o produto. Toda decisão de interface serve a ficar lendo.
2. O que estiver errado deve quebrar o build, não a página. Tradução faltando,
   conteúdo faltando e chave faltando são erros de compilação.
3. Trocar o que é seu não deve exigir entender o que é meu: dados e conteúdo
   ficam separados da forma.
4. O template não fala de si dentro do site. Quem lê o site publicado nunca
   descobre que existe um template por baixo.
5. Nada é coletado sem o leitor escolher.

## Accessibility & Inclusion

O site é lido em dois idiomas e nos dois temas, e ambos precisam do mesmo
acabamento — o claro não é versão de segunda. Não há requisito de norma
específica registrado além disso.
