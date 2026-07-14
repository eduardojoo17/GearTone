# 📖 Casos de Uso

**Versão:** 0.1.0  
**Status:** Em elaboração  
**Última atualização:** 14/07/2026

## UC01 - Cadastrar Instrumento

**Ator:** Usuário

### Fluxo principal

1. O usuário acessa a tela de cadastro.
2. Informa os dados do instrumento.
3. Salva o cadastro.
4. O sistema valida as informações.
5. O instrumento é salvo.

---

## UC02 - Definir Instrumento Favorito

**Ator:** Usuário

### Pré-condição

Estar autenticado.

### Fluxo principal

1. O usuário abre um instrumento.
2. Seleciona "Definir como favorito".
3. O sistema remove o favorito anterior.
4. O instrumento passa a ser o favorito.

---

## UC03 - Definir Instrumento Atual

**Ator:** Usuário

### Fluxo principal

1. O usuário seleciona um instrumento.
2. Escolhe a opção "Usar este instrumento".
3. O sistema remove a marcação do instrumento anterior.
4. O novo instrumento passa a ser o instrumento atual.

---

## UC04 - Alterar Status do Instrumento

**Ator:** Usuário

### Fluxo principal

1. O usuário abre um instrumento.
2. Seleciona um novo status.
3. Informa a data da alteração.
4. Adiciona observações (opcional).
5. O sistema atualiza o histórico.

---

## UC05 - Cadastrar Música

**Ator:** Usuário

### Fluxo principal

1. O usuário acessa o repertório.
2. Seleciona "Nova Música".
3. Preenche os dados.
4. Salva.

---

## UC06 - Registrar Sessão de Estudo

**Ator:** Usuário

### Fluxo principal

1. O usuário inicia uma nova sessão.
2. Informa duração.
3. Seleciona uma música (opcional).
4. Seleciona um instrumento (opcional).
5. Adiciona observações.
6. Finaliza a sessão.

---

## UC07 - Visualizar Dashboard

**Ator:** Usuário

### Fluxo principal

1. O usuário acessa o sistema.
2. O dashboard apresenta um resumo contendo:
   - Instrumento atual
   - Instrumento favorito
   - Quantidade de instrumentos
   - Quantidade de músicas
   - Tempo de estudo
   - Músicas para revisar
