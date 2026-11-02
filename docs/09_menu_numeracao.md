---
documento: menu_numeracao
versao: 1.3
data: 2026-10-26
proposito: Numeração dos itens do menu (blocos 1–12), campo "Ir para" e tabela menu_item + nota de multi-empresa (tenant)
depende_de: [07_atores_fluxo, 12_tela_inicial, 13_relatorios_administrador, 14_conselheiro]
---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. As tabelas `menu_item` e `menu_item_ator` são **universais** (grupo U) — catálogo do produto, sem `id_empresa`. A **renderização** do menu é por empresa (contexto de autenticação), mas o catálogo é global. O filtro de empresa é aplicado pelo repositório ao renderizar o menu (R2), não pela tabela `menu_item`.


# Numeração do Menu

> **O que é:** documento que define a numeração dos itens do menu lateral, o campo "Ir para" e a tabela `menu_item`.
> **Sobreposição:** este documento **sobrepõe** a estrutura de menu do Bloco 5 (que era uma proposta na conversa, não um documento formal). A estrutura do menu **continua a mesma**; o que muda é a **adição dos números** e do **campo "Ir para"**.
> **Regra:** o número é **auxiliar**. O **nome completo** é oficial. Auditoria, logs e documentação usam o nome completo.

---

## Sumário

1. [Conceito](#1-conceito)
2. [Formato da numeração](#2-formato-da-numeração)
3. [Numeração completa](#3-numeração-completa)
4. [Campo "Ir para"](#4-campo-ir-para)
5. [O que o número NÃO substitui](#5-o-que-o-número-não-substitui)
6. [Impacto nos documentos existentes](#6-impacto-nos-documentos-existentes)
7. [Tabela `menu_item` (modelo de dados)](#7-tabela-menu_item-modelo-de-dados)
8. [Exemplo de menu renderizado](#8-exemplo-de-menu-renderizado)
9. [Histórico de versões](#9-histórico-de-versões)

---

## 1. Conceito

O menu lateral ganha **números de acesso rápido** ao lado de cada item. O número serve **apenas como atalho de navegação**. **Não substitui o nome** em nenhum lugar:

- **Auditoria:** continua registrando o **nome completo** da tela (ex: "Revisão de Lançamentos"), não o número.
- **Logs:** idem.
- **Relatórios:** idem.
- **Documentação funcional:** idem.
- **Comunicação com o usuário:** idem (o número é um complemento, não um substituto).

**Regra de ouro:** o número é **opcional**. Quem quiser usar, usa. Quem preferir navegar pelo menu, navega. Nada quebra se o número não for usado.

---

## 2. Formato da numeração

### 2.1. Estrutura

- **Bloco:** 1 ou 2 dígitos (1 = Meu Trabalho, 2 = Configurador, ..., 12 = Administração).
- **Item:** 1 ou 2 dígitos (1, 2, ..., 10, 11, 12, ...).
- **Formato:** `bloco.item` (ex: `4.10`).
- **Subitem:** só quando necessário (ex: `4.1.1`). Na estrutura atual, **nenhum item tem subitem** — todos são folhas.

### 2.2. Regras de estabilidade

1. **O número é congelado após a publicação.** Não muda se o item for movido visualmente.
2. **Se um item for removido**, o número fica **vago** (não é reaproveitado).
3. **Se um item for adicionado**, ganha o **próximo número livre** do bloco (não renumerar os existentes).
4. **Itens de fase 2** mantêm o número, mas aparecem desabilitados com rótulo "(fase 2)".
5. **O bloco "Meu Trabalho" começa em 1.0** (Tela Inicial) e segue com 1.1, 1.2, 1.3.
6. **O bloco "Administração" é sempre `12`** (fixo, por ser transversal).

### 2.3. Exibição no menu

**Formato:** `[número] Nome do item`

```
📥 Meu Trabalho
   1.0  Tela Inicial
   1.1  Caixa de Entrada (3)
   1.2  Caixa de Saída
   1.3  Histórico

⚙️ Configurador
   2.1  Empresa
   2.2  Filiais
   2.3  Centros de Custo e Áreas de Negócio
   ...
```

O número aparece em **fonte menor/cinza** ao lado do nome. Não é clicável (o item inteiro é clicável). O nome continua sendo o texto principal.

---

## 3. Numeração completa

### Bloco 1 — Meu Trabalho (todos)

| Número | Item | Fase |
| :--- | :--- | :--- |
| 1.0 | Tela Inicial (dashboard) | 1 |
| 1.1 | Caixa de Entrada | 1 |
| 1.2 | Caixa de Saída | 1 |
| 1.3 | Histórico | 1 |

### Bloco 2 — Configurador

| Número | Item | Fase |
| :--- | :--- | :--- |
| 2.1 | Empresa | 1 |
| 2.2 | Filiais | 1 |
| 2.3 | Centros de Custo e Áreas de Negócio | 1 |
| 2.4 | Usuários e Atores | 1 |
| 2.5 | Produtos | 1 |
| 2.6 | Serviços | 1 |
| 2.7 | Ativos (bens/patrimônios) | 1 |
| 2.8 | Ordem de Serviço Interna (OSI) | 1 |

### Bloco 3 — Administrador

**Itens originais (1 a 9):**

| Número | Item | Fase |
| :--- | :--- | :--- |
| 3.1 | DRE Gerencial | 1 |
| 3.2 | DRE por Centro de Custo | 1 |
| 3.3 | Resumo por Área | 1 |
| 3.4 | Fluxo de Caixa Projetado | 1 |
| 3.5 | Análise de Custos | 1 |
| 3.6 | Margem por Cliente/Produto | 1 |
| 3.7 | Exportação | 1 |
| 3.8 | Posição de Caixa | 1 |
| 3.9 | Simulações | 2 |

**Itens novos do `13_relatorios_administrador` (10 a 17):**

| Número | Item | Fase |
| :--- | :--- | :--- |
| 3.10 | Balanço Patrimonial (G8) | 1 |
| 3.11 | Painel Executivo (G9) | 1 |
| 3.12 | Aging de Contas (G10) | 1 |
| 3.13 | Posição de Impostos (G11) | 1 |
| 3.14 | Posição de Pessoal (G12) | 1 |
| 3.15 | Posição de Ativos (G13) | 1 |
| 3.16 | Ponto de Equilíbrio (G14) | 1 |
| 3.17 | Resumo Executivo (G15) | 1 |

**Item novo do `14_conselheiro` (18):**

| Número | Item | Fase |
| :--- | :--- | :--- |
| 3.18 | Conselheiro (F7) | 1 |

### Bloco 4 — Contador

| Número | Item | Fase |
| :--- | :--- | :--- |
| 4.1 | Tabelas basais (fiscais) | 1 |
| 4.2 | Cadastro de Plano de Contas | 1 |
| 4.3 | Configurações contábeis | 1 |
| 4.4 | Configurações fiscais | 1 |
| 4.5 | Regras de Classificação | 1 |
| 4.6 | Lançamento Manual | 1 |
| 4.7 | Revisão de Lançamentos | 1 |
| 4.8 | Validação de Cálculos | 1 |
| 4.9 | Relatório de Pendências | 1 |
| 4.10 | Preparar Fechamento | 1 |
| 4.11 | Fechar Período | 1 |

### Bloco 5 — Comprador

| Número | Item | Fase |
| :--- | :--- | :--- |
| 5.1 | Tabelas basais (categorias de fornecedor, tipos, prazos) | 1 |
| 5.2 | Cadastro de Fornecedores | 1 |
| 5.3 | Digitar Notas de Entrada | 1 |
| 5.4 | Importar Notas de Entrada | 1 |
| 5.5 | Revisar Classificações | 1 |

### Bloco 6 — Faturista

| Número | Item | Fase |
| :--- | :--- | :--- |
| 6.1 | Tabelas basais (tipos de cliente, prazos) | 1 |
| 6.2 | Cadastro de Clientes | 1 |
| 6.3 | Digitar Notas de Saída | 1 |
| 6.4 | Importar Notas de Saída | 1 |
| 6.5 | Revisar Classificações | 1 |

### Bloco 7 — Financeiro1 (Contas a Pagar)

| Número | Item | Fase |
| :--- | :--- | :--- |
| 7.1 | Tabelas basais (formas/condições de pagamento, contas bancárias, bancos) | 1 |
| 7.2 | Contas a Pagar | 1 |
| 7.3 | Pagamentos | 1 |

### Bloco 8 — Financeiro2 (Contas a Receber)

| Número | Item | Fase |
| :--- | :--- | :--- |
| 8.1 | Tabelas basais (formas/condições de recebimento, contas bancárias, bancos) | 1 |
| 8.2 | Contas a Receber | 1 |
| 8.3 | Recebimentos | 1 |

### Bloco 9 — Gerente Financeiro

| Número | Item | Fase |
| :--- | :--- | :--- |
| 9.1 | Validar Saídas de Caixa/Banco | 1 |
| 9.2 | Validar Entradas de Caixa/Banco | 1 |

### Bloco 10 — RH

| Número | Item | Fase |
| :--- | :--- | :--- |
| 10.1 | Tabelas basais — INSS | 1 |
| 10.2 | Tabelas basais — IRRF | 1 |
| 10.3 | Tabelas basais — Gerais (encargos) | 1 |
| 10.4 | Cadastro de Funcionários | 1 |
| 10.5 | Tabelas Auxiliares de Folha (proventos/descontos) | 1 |
| 10.6 | Folha de Pagamento | 1 |

### Bloco 11 — Auditor

| Número | Item | Fase |
| :--- | :--- | :--- |
| 11.1 | Auditoria (log) | 1 |
| 11.2 | Auditoria de Documentos | 1 |
| 11.3 | Auditoria de Lançamentos | 1 |
| 11.4 | Ordem de Serviço Interna (transições) | 1 |
| 11.5 | Relatório de Pendências | 1 |
| 11.6 | Apontar Problemas | 1 |
| 11.7 | Solicitar Correções | 1 |
| 11.8 | Validar Fechamento | 1 |

### Bloco 12 — Administração (transversal)

| Número | Item | Fase |
| :--- | :--- | :--- |
| 12.1 | Período — Abertura e Fechamento | 1 |
| 12.2 | Parâmetros — Tabelas | 1 |
| 12.3 | Ordem de Serviço Interna — Ativar/Desativar | 1 |
| 12.4 | Auditoria (I3) | 1 |
| 12.5 | Usuários e Atores | 1 |

---

## 4. Campo "Ir para"

### 4.1. Comportamento

No topo do menu lateral, há um campo de busca:

```
┌─────────────────────────────────────────────┐
│  🔍 Ir para: [ 4.10        ]  (Ctrl+K)      │
└─────────────────────────────────────────────┘
```

**Comportamento:**
- O usuário digita o **número** (ex: `4.10`) e pressiona Enter.
- O sistema navega direto para o item correspondente.
- Se o número não existir, exibe "Código não encontrado".
- Se o usuário não tiver permissão, exibe "Você não tem permissão para acessar esta tela".
- Se for item de fase 2, exibe "Este recurso estará disponível na fase 2".
- O campo aceita **parcial**: digitar `4.` mostra todos os itens do Contador; digitar `4.1` mostra `4.1`, `4.10`, `4.11`.
- Atalho `Ctrl+K` foca o campo.

### 4.2. Regras

1. **O campo é opcional.** O usuário pode navegar pelo menu sem usá-lo.
2. **O campo não substitui o menu.** Ele é um atalho.
3. **O campo aceita o número com ou sem espaços** (ex: `4.10`, `4 . 10`, `4-10`).
4. **O campo não aceita o nome** (para não competir com a busca global, que é fase 2).
5. **O campo é somente leitura para itens de fase 2** (mostra o item, mas não navega).

### 4.3. Ordem visual vs. número

O **número** é imutável (congelado). A **ordem visual** do menu pode ser ajustada sem mudar o número. Para o bloco 3, a ordem visual recomendada é:

```
3.11 Painel Executivo        ← primeiro (é o que o administrador abre)
3.1  DRE Gerencial
3.10 Balanço Patrimonial
3.4  Fluxo de Caixa Projetado
3.12 Aging de Contas
3.13 Posição de Impostos
3.14 Posição de Pessoal
3.15 Posição de Ativos
3.8  Posição de Caixa
3.2  DRE por Centro de Custo
3.3  Resumo por Área
3.5  Análise de Custos
3.6  Margem por Cliente/Produto
3.16 Ponto de Equilíbrio
3.17 Resumo Executivo
3.18 Conselheiro              
3.7  Exportação
3.9  Simulações (fase 2)
```

**Nota:** a ordem visual é **sugestão**; o `menu-dados.js` pode adotá-la ou não. O número não muda.

---

## 5. O que o número NÃO substitui

| Onde | O que continua valendo |
| :--- | :--- |
| **Auditoria (I3)** | Registra o **nome completo** da tela (ex: "Revisão de Lançamentos"), não o número. |
| **Logs de importação** | Registram o **nome do documento**, não o número da tela. |
| **Ordens (O1–O32)** | Continuam sendo identificadas pelo **código da ordem** (O1, O2, ...), não pelo número do menu. |
| **Casos de uso (A1, C1, D3, ...)** | Continuam sendo identificados pelo **código do caso de uso**, não pelo número do menu. |
| **Documentação funcional** | Continua usando o **nome completo** dos casos de uso, ordens e telas. |
| **Manual do usuário** | Pode **referenciar** o número como atalho (ex: "Acesse **Revisão de Lançamentos** (`4.7`)"), mas o nome completo é o principal. |
| **Comunicação com o usuário** | O nome completo é o principal; o número é um complemento. |
| **Treinamento** | O nome completo é o principal; o número é um atalho. |

**Regra:** o número é **auxiliar**. O nome completo é **oficial**.

---

## 6. Impacto nos documentos existentes

### 6.1. Documentos que **não mudam** (por causa deste documento)

- `01_visao_geral.md` — não muda.
- `02_regras_transversais.md` — não muda.
- `04_modelo_de_dados.md` — não muda (a numeração do menu não afeta o modelo de dados).
- `05_apendices.md` — não muda.
- `07_atores_fluxo.md` — não muda.
- `08_ordens.md` — não muda (ordens não são numeradas pelo menu).
- `10_modelo_dados_fisico.md` — não muda.
- Agentes (todos) — não mudam.
- Referências (todas) — não mudam.

### 6.2. Documentos que **mudam** (por causa do `13` e do `14`)

| Documento | Versão atual | O que muda | Nova versão |
| :--- | :--- | :--- | :--- |
| `00_indice.md` | 1.5 | +`13_relatorios_administrador.md`, +`14_conselheiro.md`, +`09` v1.3 | 1.7 |
| `03_casos_de_uso.md` | 2.3 | +G8–G15 (do `13`), +F7 Conselheiro (do `14`) | 2.4 |
| `06_pendencias.md` | 1.4 | +6 pendências do `13` (31–36), +pendências do `14` (se houver) | 1.5 |
| `09_menu_numeracao.md` | **1.2** | **Bloco 3 expandido para 3.18** (+ `13` e `14`); correção do exemplo renderizado | **1.3** |
| `12_tela_inicial.md` | 1.0 | +KPIs do Painel Executivo (G9) para o Administrador; +card do Conselheiro | 1.1 |
| `13_relatorios_administrador.md` | 1.1 | Já aprovado e integrado | 1.1 |
| `14_conselheiro.md` | — | **Novo documento** | 1.0 |

### 6.3. Documentos que **sobrepõem** o Bloco 5

- O `09_menu_numeracao.md` **sobrepõe** a estrutura de menu do Bloco 5 (que era uma proposta na conversa, não um documento formal). A estrutura do menu **continua a mesma**; o que muda é a **adição dos números** e do **campo "Ir para"**.

---

## 7. Tabela `menu_item` (modelo de dados)

Para implementar, o modelo de dados ganha uma tabela `menu_item`:

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(10) | Número do menu (ex: `4.10`) — único |
| nome | varchar(100) | Nome completo (ex: "Revisão de Lançamentos") |
| rota | varchar(200) | Rota da tela (ex: `/contador/revisao`) |
| id_ator_funcional | int | FK → ator_funcional (quem vê o item) |
| fase | int | 1 ou 2 |
| ativo | boolean | |
| dados_extras | json | |

**Regras:**
- `codigo` é único e imutável após a publicação.
- `nome` é o nome completo (oficial).
- `rota` é a URL da tela.
- `id_ator_funcional` define quem vê o item (pode ser múltiplos; nesse caso, uma tabela N:N `menu_item_ator`).
- `fase` indica se o item é fase 1 ou fase 2.
- `ativo` permite desativar o item sem removê-lo.

**Alternativa:** se preferir não criar tabela, a numeração pode ficar em um **arquivo de configuração** (`menu.yaml` ou `menu.json`), versionado no código.

---

## 8. Exemplo de menu renderizado

**Usuário:** João Silva
**Tags:** `comprador` (filial A), `financeiro1` (filial A), `auditor` (filial A)

```
🔍 Ir para: [           ]  (Ctrl+K)

📥 Meu Trabalho
   1.0  Tela Inicial
   1.1  Caixa de Entrada (3)
   1.2  Caixa de Saída
   1.3  Histórico

🛒 Comprador
   5.1  Tabelas basais
   5.2  Cadastro de Fornecedores
   5.3  Digitar Notas de Entrada
   5.4  Importar Notas de Entrada
   5.5  Revisar Classificações

💸 Financeiro1 — Contas a Pagar
   7.1  Tabelas basais
   7.2  Contas a Pagar
   7.3  Pagamentos de Contas a Pagar

🔍 Auditor
   11.1 Auditoria (log)
   11.2 Auditoria de Documentos
   11.3 Auditoria de Lançamentos
   11.4 Ordem de Serviço Interna (transições)
   11.5 Relatório de Pendências
   11.6 Apontar Problemas
   11.7 Solicitar Correções
   11.8 Validar Fechamento

🛠️ Administração
   12.1 Período — Abertura e Fechamento
   12.2 Parâmetros — Tabelas
   12.3 Ordem de Serviço Interna — Ativar/Desativar
   12.4 Auditoria (I3)
   12.5 Usuários e Atores
```

**Usuário:** Maria Souza
**Tags:** `administrador` (filial A)

```
🔍 Ir para: [           ]  (Ctrl+K)

📥 Meu Trabalho
   1.0  Tela Inicial (resumo do Painel Executivo)
   1.1  Caixa de Entrada (0)
   1.2  Caixa de Saída
   1.3  Histórico

📊 Administrador
   3.11 Painel Executivo
   3.1  DRE Gerencial
   3.10 Balanço Patrimonial
   3.4  Fluxo de Caixa Projetado
   3.12 Aging de Contas
   3.13 Posição de Impostos
   3.14 Posição de Pessoal
   3.15 Posição de Ativos
   3.8  Posição de Caixa
   3.2  DRE por Centro de Custo
   3.3  Resumo por Área
   3.5  Análise de Custos
   3.6  Margem por Cliente/Produto
   3.16 Ponto de Equilíbrio
   3.17 Resumo Executivo
   3.18 Conselheiro
   3.7  Exportação
   3.9  Simulações (fase 2)
```

**Observações:**
- O menu mostra a **união** das tags do João.
- Os números aparecem à esquerda do nome, em fonte menor/cinza.
- O campo "Ir para" está no topo.
- O badge "3" indica 3 ordens pendentes.
- A Tela Inicial (1.0) do Administrador mostra um **resumo** do Painel Executivo (ver `12_tela_inicial.md` v1.1).
- **Correção da v1.2 → v1.3:** o exemplo renderizado do Administrador tinha **dois "3.10"** (Balanço e Conselheiro). Agora o **Balanço é 3.10** e o **Conselheiro é 3.18**. Sem duplicação.

---

## 9. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-23 | Criação do documento. Define a numeração do menu (blocos 1–12), o campo "Ir para", a tabela `menu_item` e as regras de estabilidade. **Sobrepõe** a estrutura de menu do Bloco 5 (proposta na conversa). **Não altera** os demais documentos. |
| 1.1 | 2026-10-24 | Inclusão do item 1.0 (Tela Inicial) no bloco "Meu Trabalho"; ajuste nas regras de estabilidade (o bloco começa em 1.0). Correção do typo `Imporftar` → `Importar`. Frontmatter corrigido (YAML padrão). |
| 1.2 | 2026-10-25 | **Merge do `13` (v1.1).** Bloco 3 expandido com 8 itens (3.10–3.17), **sem renumerar** os existentes (Opção A). Inclusão da seção 4.3 (ordem visual vs. número). |
| 1.3 | 2026-10-26 | **Merge do `14` (v1.0 — Conselheiro).** Item **3.18 — Conselheiro** adicionado ao bloco 3. **Correção do exemplo renderizado** (havia duplicação do 3.10: Balanço e Conselheiro; agora Balanço é 3.10 e Conselheiro é 3.18). Atualização do frontmatter (`depende_de` inclui `13_relatorios_administrador` e `14_conselheiro`). |

---

## 10. Resumo

| Pergunta | Resposta |
| :--- | :--- |
| **O que é o `09_menu_numeracao.md`?** | Documento que define a numeração do menu para acesso rápido. |
| **Ele sobrepõe o quê?** | A estrutura de menu do Bloco 5 (que era proposta na conversa, não documento formal). |
| **Ele altera os demais documentos?** | **Não.** Os casos de uso, ordens, auditoria, modelo de dados, manual e agentes continuam iguais. |
| **O número substitui o nome?** | **Não.** O nome completo é oficial. O número é auxiliar. |
| **Auditoria usa o número?** | **Não.** Auditoria registra o nome completo. |
| **O número pode ser usado no manual?** | **Opcional.** O manual pode referenciar o número como atalho (ex: "Acesse `4.7`"), mas o nome completo é o principal. |
| **O que acontece se um item for removido?** | O número fica vago (não é reaproveitado). |
| **O que acontece se um item for adicionado?** | Ganha o próximo número livre do bloco. |
| **O campo "Ir para" é obrigatório?** | **Não.** É opcional. O usuário pode navegar pelo menu sem usá-lo. |
| **O campo "Ir para" aceita o nome?** | **Não** (para não competir com a busca global, que é fase 2). |
| **Qual o formato do número?** | `bloco.item` (ex: `4.10`). |
| **Quais são os blocos?** | 1 = Meu Trabalho, 2 = Configurador, 3 = Administrador, 4 = Contador, 5 = Comprador, 6 = Faturista, 7 = Financeiro1, 8 = Financeiro2, 9 = Gerente Financeiro, 10 = RH, 11 = Auditor, 12 = Administração. |
| **O que acontece com itens de fase 2?** | Mantêm o número, mas aparecem desabilitados com rótulo "(fase 2)". |
| **O que acontece se o usuário não tiver permissão?** | O item **não aparece** no menu; a rota direta **bloqueia** o acesso. |
| **O que acontece se o usuário digitar um número que não existe?** | Exibe "Código não encontrado". |
| **O que acontece se o usuário digitar um número de item de fase 2?** | Exibe "Este recurso estará disponível na fase 2". |
| **O que mudou na v1.3?** | Item **3.18 — Conselheiro** adicionado (merge do `14`). Correção do exemplo renderizado (havia duplicação do 3.10). |
| **O número substitui o nome?** | **Não.** O nome completo é oficial. O número é auxiliar. |

# Versões

| 1.3 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: `menu_item` e `menu_item_ator` são universais (grupo U); renderização por empresa via contexto. Nenhuma alteração estrutural. |
