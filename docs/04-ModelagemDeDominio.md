# 🗃️ Modelagem do Domínio

**Versão:** 0.1.0
**Status:** Em elaboração

---

# Objetivo

Este documento descreve as entidades principais do domínio do GearTone, explicando seu propósito e como elas se relacionam.

O objetivo é modelar o problema antes da implementação do banco de dados.

---

# Usuário

## O que representa?

Representa uma pessoa que utiliza o GearTone.

Todo o conteúdo do sistema pertence a um usuário.

---

## Por que existe?

É responsável por identificar e isolar as informações de cada músico.

---

## É dono de

- Instrumentos
- Repertório
- Sessões de estudo

---

## Regras de negócio

- Um usuário pode possuir vários instrumentos.
- Um usuário pode possuir várias músicas.
- Um usuário pode registrar várias sessões de estudo.
- Um usuário possui apenas um instrumento favorito.
- Um usuário possui apenas um instrumento atual.

---

# Instrumento

## O que representa?

Representa um instrumento físico pertencente ao usuário.

Exemplos:

- Jazz Bass Tagima
- Stratocaster Seizi

---

## Por que existe?

Permite que o usuário organize sua coleção de instrumentos e mantenha um histórico da sua vida musical.

---

## Pertence a

- Um usuário.

---

## Relaciona-se com

- Sessões de estudo (opcional).

---

## Regras de negócio

- Um instrumento pertence a apenas um usuário.
- Um instrumento pode estar ativo ou inativo.
- Instrumentos inativos permanecem no histórico.
- Apenas um instrumento pode ser definido como favorito.
- Apenas um instrumento pode ser definido como instrumento atual.

---

# Música

## O que representa?

Representa uma música cadastrada pelo usuário em seu repertório.

Não representa um catálogo global de músicas.

Cada usuário possui seu próprio repertório.

---

## Por que existe?

Permite acompanhar a evolução do aprendizado e organizar o repertório musical.

---

## Pertence a

- Um usuário.

---

## Relaciona-se com

- Sessões de estudo.

---

## Regras de negócio

- Uma música pertence a apenas um usuário.
- Uma música pode possuir diversas sessões de estudo.
- Uma música possui um status de aprendizado.

---

# Sessão de Estudo

## O que representa?

Representa um período dedicado ao estudo musical.

---

## Por que existe?

Permite acompanhar a evolução do usuário ao longo do tempo.

---

## Pertence a

- Um usuário.

---

## Pode estar relacionada com

- Uma música.
- Um instrumento.

Ambos os relacionamentos são opcionais.

---

## Regras de negócio

- Uma sessão sempre pertence a um usuário.
- Uma sessão pode estar vinculada a uma música.
- Uma sessão pode estar vinculada a um instrumento.
- Uma sessão registra apenas um momento de estudo.

---

# Visão Geral do Domínio

```text
Usuário

├── Instrumentos

├── Repertório

└── Sessões de Estudo
```

Todo o sistema parte do usuário.

As demais entidades representam aspectos da vida musical do músico e dependem diretamente dele.

---

# Evolução prevista

A modelagem poderá crescer futuramente com novos módulos.

Exemplos:

- Histórico de manutenção
- Equipamentos
- Pedalboards
- Fotos
- Metas
- Dashboard avançado
- Estatísticas
