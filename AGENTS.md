# AGENTS.md

## Topologia de branches (a maior pegadinha deste repo)

- A `main` foi **reiniciada como commit órfão** (`e6078b2`): é um projeto
  Next.js 16 mínimo que mostra a frase "Edgar, Rita, Ryan e Ellen". O
  histórico anterior não é ancestral dela.
- `ludogames` (local e `origin`) guarda **todo o histórico antigo** como
  arquivo: design LudoLeitura, Tailwind, sílabas, síntese e prática de fala.
  Aquele branch tem o **próprio `AGENTS.md`** descrevendo aquele código —
  consulte-o com `git show origin/ludogames:AGENTS.md` se for trabalhar lá.
- Arquivos citados em commits antigos (`lib/`, `app/components/`,
  `DESIGN.md`, Tailwind) **não existem na `main`**. Não tente "restaurar" o
  que os commits antigos descrevem nem mesclar `ludogames` na `main` sem
  pedido explícito.
- Push direto para a `main` de `origin` é o fluxo normal
  (github.com:Edpow/clone-tabnews-ia). Commits em português com estilo
  convencional: `feat:`, `fix:`, `chore:` — um assunto por commit.

## Comandos

- `npm install` — sem `node_modules` o repo não roda (é ignorado pelo git).
- `npm run dev` — servidor de desenvolvimento (Turbopack) em
  `http://localhost:3000`.
- `npm run build` — **é o passo de verificação**: compila + roda o
  TypeScript. Não há lint, formatter nem testes no repo; se `next build`
  passou, compilação e tipos estão OK. Rodá-lo com o `dev` ao mesmo tempo é
  seguro (Next 16 separa `.next/dev` de `.next/types`).
- Ambiente: Node 24, npm 11 (type stripping nativo do Node se precisar de
  script avulso de teste).

## Pegadinhas

- **`next-env.d.ts` é rastreado mas regenerado**: `next build` alterna a
  referência de `./.next/dev/types/routes.d.ts` para `./.next/types/routes.d.ts`.
  Após um build, `git status` mostra o arquivo modificado — restaure com
  `git checkout -- next-env.d.ts` em vez de commitar a alternância.
- **`index.html` na raiz é legado** (versão estática anterior à migração
  para Next) e **não é servida** pelo app — o app serve apenas `app/`.
  Não remover sem perguntar.
- `tsconfig.json` tem `strict: false` e é o que o `next build` usa; não
  "corrigir" para `true` sem pedido (vai quebrar o build).
- Estilos são CSS puro em `app/globals.css` (não há Tailwind na `main`).
