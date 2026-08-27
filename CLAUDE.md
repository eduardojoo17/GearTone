# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

O projeto é escrito em português (código, mensagens de erro, docs). Mantenha esse padrão: nomes de classes/métodos/rotas e mensagens ao usuário em pt-BR.

## Comandos

```bash
npm install     # node_modules não vem versionado
npm run dev     # único script: tsx --watch, carrega .env via --env-file
npx tsc --noEmit  # não há script, mas é a forma de type-checar antes de rodar
```

Não há build, lint nem framework de testes configurado. `dist/` está no `.gitignore` mas nada gera essa pasta ainda.

**Testes** são feitos manualmente com arquivos `.http` em [src/tests/](src/tests/) (extensão REST Client do VS Code), numerados na ordem de execução:

1. [1auth.http](src/tests/1auth.http) — registrar e logar; copie o token da resposta.
2. [2usuario.http](src/tests/2usuario.http) — cole o token na variável `@token` do topo do arquivo (todos os arquivos seguintes têm a mesma variável).
3. [3instrumento.http](src/tests/3instrumento.http), [4repertorio.http](src/tests/4repertorio.http), [5sessao.http](src/tests/5sessao.http), [6dashboard.http](src/tests/6dashboard.http) — os ids retornados no cadastro alimentam as variáveis do topo de cada arquivo.

Nunca deixe um token real commitado nesses arquivos — use o placeholder.

Ao criar um módulo novo, adicione o `.http` correspondente seguindo essa numeração.

## Variáveis de ambiente (`.env`, não versionado)

`PORT`, `DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` e `JWT` (segredo do token) estão tipadas em [env.d.ts](env.d.ts).

## Arquitetura

Fluxo de uma requisição:

```
routes/ → middleware/verificar → controllers/ → services/ → TypeORM Repository → entity/
                                      ↓ next(error)
                              middleware/errorMiddleware
```

- **[src/index.ts](src/index.ts)** monta o app: `/api/auth` é público; `/api/usuarios`, `/api/instrumentos`, `/api/repertorio`, `/api/sessoes` e `/api/dashboard` passam por `verificar` (JWT) no nível do `app.use`, então toda rota abaixo delas já é protegida. `errorMiddleware` é registrado por último.
- **Controllers** só traduzem HTTP: leem `req.params`/`req.query`/`req.body`, chamam o service, definem o status. Toda lógica e validação fica no service. Métodos são **arrow functions de instância** (não métodos normais) para preservar o `this` ao serem passados como handler ao Router.
- **Services** instanciam `AppDataSource.getRepository(Entidade)` como campo privado e lançam erros de [helpers/apiError.ts](src/helpers/apiError.ts) (`NotFoundError`, `BadRequestError`, `ConflictError`, `UnauthorizedError`) — nunca respondem HTTP diretamente.
- **Validação** usa `class-validator` chamado manualmente dentro do service, não como middleware. As regras ficam nos decorators da entity. Convenção: no `criar` chame `validate(entidade)` sem opções (todos os campos são preenchidos, inclusive os defaults, para que os obrigatórios sejam realmente cobrados); no `atualizar` use `validate(entidade, { skipMissingProperties: true })`.
- **[errorMiddleware](src/middleware/errorMiddleware.ts)** detecta `ValidationError[]` no campo `errors` e devolve 400 com a lista achatada de `constraints`; caso contrário usa `statusCode` do `ApiError` ou 500.
- **Helpers compartilhados:** [usuarioLogado.ts](src/helpers/usuarioLogado.ts) lê `req.usuario` (populado por `verificar`) e lança 401 se a rota tiver sido montada sem o middleware; [validacoes.ts](src/helpers/validacoes.ts) tem `converterData` (string do JSON → `Date`, com 400 em data inválida) e `validarUuid`.

### Convenções dos módulos de domínio

Todos os services de domínio recebem `usuarioId` como **primeiro parâmetro** e filtram por ele em toda consulta (`findOneBy({ id, usuarioId })`) — é assim que a RNF02 é cumprida. Nos métodos de atualização os campos são copiados **um a um** do body, de propósito: isso impede que a requisição troque o dono do registro (`usuarioId`) ou o `id`.

### Pontos que costumam quebrar

- **Imports relativos precisam da extensão `.js`** (`from "../services/UsuarioService.js"`), porque o `tsconfig` usa `module: nodenext`. Vale para imports de valor; imports `import type` podem omitir.
- **`req.params.id` é `string | string[]` no Express 5** — nos ids uuid é preciso `String(req.params.id)`, senão o TS reclama.
- **`Usuario.senha` tem `select: false`.** Para autenticar é preciso QueryBuilder com `.addSelect("usuario.senha")` — `findOneBy` nunca traz a senha. Ao devolver um usuário salvo, remova a senha por desestruturação como em `AuthService.registrar`. Em qualquer rota que grave senha, use `bcrypt.hash(senha, 10)`.
- **`synchronize: true`** em [data-source.ts](src/data-source.ts) e `migrations: []`: o schema é recriado a partir das entities a cada boot. Novas entities precisam ser adicionadas ao array `entities` manualmente (não há glob).
- **IDs são mistos:** `Usuario.id` é `int` autoincremento; `Instrumento`, `Repertorio` e `SessaoEstudo` usam `uuid` (string). As FKs seguem isso — `usuarioId` é `int`, `musicaId`/`instrumentoId` são `varchar`. Id uuid inválido vira 400 via `validarUuid`; sem isso o Postgres devolveria erro de sintaxe e viraria 500.
- **Colunas precisam de `type` explícito** nos decorators `@Column` (o projeto já faz isso em todas), senão a inferência por metadata falha.
- **FKs:** as três entities de domínio apagam em cascata junto com o usuário (`onDelete: "CASCADE"`), e `SessaoEstudo.musica`/`instrumento` usam `onDelete: "SET NULL"` para que o histórico de estudo sobreviva à remoção da música ou do instrumento.
- `verificar` e `somenteAdmin` lançam de forma síncrona; isso funciona porque o Express 5 captura throws síncronos em handlers.

## Estado atual

Implementado — cobre RF01 a RF09 e RNF02/RNF03/RNF04:

| Rota | Módulo | Observações |
| --- | --- | --- |
| `/api/auth` | registro/login | bcrypt + JWT de 8h |
| `/api/usuarios` | perfil e CRUD | `GET /` é `somenteAdmin`; `GET /perfil` devolve o usuário logado; demais rotas só permitem o próprio id (ou admin) |
| `/api/instrumentos` | RF02–RF05 | `?status=` filtra ativos/inativos; `PATCH /:id/favorito`, `/:id/atual` e `/:id/status` |
| `/api/repertorio` | RF06–RF07 | `?busca=` procura em nome e artista (ILike), `?status=` filtra |
| `/api/sessoes` | RF08 | música e instrumento opcionais, validados como pertencentes ao usuário |
| `/api/dashboard` | RF09 | resumo agregado do usuário logado |

Regras de negócio que o banco **não** garante e por isso vivem no service:

- **RF03/RF04:** só um `Instrumento` por usuário pode ter `favorito`/`atual` como `true` — `InstrumentoService.limparMarcacao` zera os demais antes de salvar.
- Instrumento com status diferente de `ativo` deixa de ser o `atual` (e não pode ser definido como atual).
- Só admin altera o `role` de um usuário.

Pendências: nada de backend no MVP; o frontend (RNF01/RNF06 — React, Next.js, Tailwind) ainda não existe. Os itens de "Evolução prevista" da modelagem (manutenção, equipamentos, fotos, metas) também continuam abertos.

## Documentação de domínio

[docs/](docs/) contém a especificação que guia o desenvolvimento — leia antes de implementar um módulo novo: visão do produto, casos de uso, requisitos numerados (RF01–RF09, RNF01–RNF06) e a modelagem com as regras de negócio de cada entidade. Tudo pertence a um `Usuario`; `SessaoEstudo` liga-se a `Repertorio` e `Instrumento` de forma opcional.
