# 📋 Requisitos

**Versão:** 0.1.0  
**Status:** Em elaboração  
**Última atualização:** 14/07/2026

## Requisitos Funcionais

### RF01 - Cadastro de usuário

O sistema deverá permitir que o usuário:

- Criar uma conta.
- Fazer login.
- Editar seu perfil.

---

### RF02 - Instrumentos

O sistema deverá permitir que o usuário:

- Cadastrar instrumentos.
- Editar instrumentos.
- Visualizar instrumentos.
- Alterar o status do instrumento.
- Consultar instrumentos ativos e inativos.

---

### RF03 - Instrumento favorito

O usuário poderá definir um instrumento como favorito.

Apenas um instrumento poderá ser favorito por vez.

---

### RF04 - Instrumento atual

O usuário poderá definir qual instrumento está utilizando atualmente.

Apenas um instrumento poderá estar definido como atual.

---

### RF05 - Histórico dos instrumentos

O sistema deverá manter o histórico dos instrumentos.

Um instrumento poderá possuir os seguintes status:

- Ativo
- Vendido
- Trocado
- Doado
- Perdido
- Furtado

Também deverá ser possível registrar:

- Data da alteração
- Observações

---

### RF06 - Repertório

O usuário poderá:

- Cadastrar músicas.
- Editar músicas.
- Remover músicas.
- Pesquisar músicas.

---

### RF07 - Status da música

Cada música poderá possuir um status.

Exemplo:

- Quero aprender
- Estudando
- Sei tocar
- Revisar

---

### RF08 - Diário de estudos

O usuário poderá registrar sessões de estudo contendo:

- Data
- Duração
- Música (opcional)
- Instrumento utilizado (opcional)
- Observações

---

### RF09 - Dashboard

O sistema deverá apresentar:

- Quantidade de instrumentos
- Instrumento favorito
- Instrumento atual
- Quantidade de músicas
- Tempo estudado
- Músicas para revisar

---

## Requisitos Não Funcionais

### RNF01

O sistema deverá ser responsivo.

### RNF02

Cada usuário visualizará apenas seus próprios dados.

### RNF03

As rotas protegidas deverão exigir autenticação.

### RNF04

As senhas deverão ser armazenadas de forma criptografada.

### RNF05

O backend será desenvolvido utilizando Node.js, TypeScript, Express, TypeORM e PostgreSQL.

### RNF06

O frontend será desenvolvido utilizando React, Next.js e Tailwind CSS.
