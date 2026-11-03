# AGENTS.md

Projeto Next.js 16 (App Router, Turbopack) que mostra nomes divididos em
sílabas clicáveis, com fala (síntese) e prática de fala (reconhecimento) em pt-BR.

## Comandos

- `npm install` — instala dependências (sem elas não há `node_modules`).
- `npm run dev` — servidor de desenvolvimento.
- `npm run build` — **é o passo de verificação**: compila + roda o TypeScript.
  Não há lint, formatter nem runner de testes no repo; se `next build` passou,
  o tipo/compilação está OK.
- Não há testes automatizados. Para validar a lógica pura (`lib/silabas.ts`,
  `lib/comparar.ts`), escreva um script avulso em `/tmp` e rode direto com o
  Node 24 (type stripping nativo): `node /tmp/opencode/teste.ts`, importando com
  caminho absoluto terminado em `.ts`. O aviso `MODULE_TYPELESS_PACKAGE_JSON`
  é inofensivo.

## `next-env.d.ts` é rastreado mas regenerado

`next build` reescreve a linha de referência para `./.next/types/routes.d.ts`
(o `next dev` gera `./.next/dev/types/routes.d.ts`). Depois de um build,
`git status` mostra o arquivo modificado: restaure com
`git checkout -- next-env.d.ts` em vez de commitar a alternância.

## Estrutura

- `app/page.tsx` é **Server Component** e guarda os dados dos nomes
  (`{ nome, pronuncia? }`). Componentes interativos ficam em
  `app/components/` com `"use client"` (`NameCard`, `ListaNomes` — este
  mantém o estado do toggle "Destacar sílabas").
- `lib/` é puro, sem React: `silabas.ts` (silabificação pt), `fala.ts`
  (síntese de voz), `voz.ts` (reconhecimento de fala), `comparar.ts`
  (comparação flexível de transcrições).
- `index.html` na raiz é uma versão estática legada (anterior à migração
  para Next) e **não é servida** pelo app. Não remover sem perguntar.

## Convenções de fala (pegadinhas)

- **Exibição ≠ fala**: os nomes aparecem com a escrita correta (`Ryan`,
  `Ellen`) mas falam a pronúncia pt-BR via campo `pronuncia` (`"Rian"`,
  `"Élen"`), que também alimenta as sílabas faladas. Não "corrigir" a
  exibição para igualar a fala, nem vice-versa.
- APIs de navegador (`speechSynthesis`, `SpeechRecognition`) só em handlers
  de evento ou `useEffect` — nunca durante o render (SSR não as tem). Os
  botões 🎤 só aparecem **depois** de `vozDisponivel()` ser chamado no
  cliente; renderizá-los antes quebra a hidratação.
- `lib/fala.ts` e `lib/voz.ts` usam um **contador de geração** para invalidar
  callbacks de chamadas antigas (`cancel()`/cliques rápidos). Manter esse
  padrão ao editar — removê-lo causa destaque visual e falas sobrepostos.
- O reconhecimento de fala só funciona em **Chrome/Edge**
  (`webkitSpeechRecognition`); os tipos estão declarados localmente em
  `lib/voz.ts` porque não existem no `lib.dom` do TypeScript. No Chrome usa a
  internet do Google e exige permissão de microfone.

## Git

- Commits convencionais **em português**: `feat: ...`, `fix: ...`, `chore: ...`
  (um assunto por commit). Push direto para a `main` de `origin`
  (github.com:Edpow/clone-tabnews-ia).
