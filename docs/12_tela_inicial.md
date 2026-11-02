```markdown
---
documento: tela_inicial
versao: 1.3
data: 2026-10-26
proposito: Dashboard por ator — KPIs, alertas, ações rápidas, ordens e resumo + nota de multi-empresa (tenant)
depende_de: [03_casos_de_uso, 07_atores_fluxo, 08_ordens, 09_menu_numeracao, 13_relatorios_administrador, 14_conselheiro]

---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. O dashboard é **por empresa** (contexto de autenticação). Os KPIs, alertas, ações, ordens e resumo exibidos são da empresa do usuário logado, filtrados pelo repositório (R2). A tabela `tarefa` (ordens exibidas) é do **grupo F** (herda empresa via `filial`). Nenhum card precisa de seletor de empresa na fase 1 — troca de contexto é fase 2 (pendências 15 e 43).


# Tela Inicial (Dashboard)

> **Item de menu:** 1.0 (Tela Inicial) — primeiro item do bloco "Meu Trabalho".
> **Acesso:** ao carregar a página e ao trocar de ator, o sistema abre a Tela Inicial.
> **Propósito:** dar ao ator uma **visão geral** do que importa para ele (alertas, KPIs, ações rápidas, ordens pendentes, resumo), sem precisar navegar pelo menu.

---

## 1. Conceito

A Tela Inicial é um **dashboard fixo por ator**. Ela mostra:

- **Saudação** — nome do ator, data, período, filial.
- **Alertas** — o que precisa de atenção (contas vencidas, pendências, ordens urgentes).
- **KPIs** — 4 indicadores-chave (números que resumem a situação).
- **Ações rápidas** — 4 botões para as tarefas mais frequentes.
- **Minhas ordens** — 3 primeiras ordens pendentes/em andamento + link para a caixa de entrada.
- **Resumo** — bloco livre, com o conteúdo mais útil para o ator (lista, mini-DRE, tabela, timeline).

**Princípio:** a Tela Inicial **não substitui** as telas; ela **aponta** para elas. O ator vê o essencial e clica para o detalhe.

---

## 2. Estrutura (comum a todos os atores)

```
┌─────────────────────────────────────────────────────────────┐
│  👋 Olá, [nome do ator]                                     │
│  [data de hoje] · Período 10/2026 · Filial: Matriz          │
├─────────────────────────────────────────────────────────────┤
│  🔔 ALERTAS (se houver)                                     │
│  • [alerta 1] · [alerta 2] · [alerta 3]                     │
├─────────────────────────────────────────────────────────────┤
│  📊 KPIs (4 cards)                                          │
│  [KPI 1]  [KPI 2]  [KPI 3]  [KPI 4]                         │
├─────────────────────────────────────────────────────────────┤
│  ⚡ AÇÕES RÁPIDAS (4 botões)                                │
│  [Ação 1]  [Ação 2]  [Ação 3]  [Ação 4]                     │
├─────────────────────────────────────────────────────────────┤
│  📥 MINHAS ORDENS (3 primeiras + "Ver todas")               │
│  • Ordem 1 · Ordem 2 · Ordem 3                              │
├─────────────────────────────────────────────────────────────┤
│  📈 RESUMO (lista, mini-DRE, tabela ou timeline)            │
│  [conteúdo específico do ator]                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Conteúdo por ator

### 3.1. Configurador

| Bloco | Conteúdo |
| :--- | :--- |
| **Saudação** | "Olá, Carlos" · Período 10/2026 · Filial Matriz |
| **Alertas** | Nenhum |
| **KPIs** | Empresas: 1 · Filiais: 2 · Usuários ativos: 3 · Handoff: Ativado |
| **Ações rápidas** | Cadastrar empresa · Cadastrar filial · Gerenciar usuários · Handoff |
| **Minhas ordens** | Vazio (Configurador não recebe ordens) |
| **Resumo** | Últimas alterações (lista) |

### 3.2. Administrador

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | Lançamentos não classificados · Contas vencidas |
| **Administrador** | Receita líquida, Lucro líquido, Saldo de caixa, Margem líquida (do Painel Executivo — G9) | Ver DRE, Posição de caixa, Fluxo de caixa, Conselheiro | Mini-DRE + **card "Sugestões do Conselheiro"** (3 primeiras + "Ver todas") |
| **Ações rápidas** | Ver DRE · Posição de caixa · Fluxo de caixa · Exportar relatório |
| **Minhas ordens** | Vazio |
| **Resumo** | Mini-DRE (receita → lucro líquido) |

> **Nota (v1.1):** para o **Administrador**, a Tela Inicial (1.0) **incorpora** os KPIs do Painel Executivo (G9 / 3.11), exibindo um **resumo** dos 6 KPIs principais (Receita líquida, Lucro líquido, Margem líquida, Liquidez corrente, Endividamento, ROE), cada um com **semáforo** e **drill-down** para o Painel completo. O Painel Executivo (3.11) continua existindo como tela detalhada. Os demais atores **não** são afetados.


### 3.3. Contador

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 2 lançamentos não classificados · 1 conflito · 2 erros no fechamento |
| **KPIs** | Lançamentos pendentes: 4 · Conflitos: 1 · Pendências (Erro): 2 · Fechamento: Aguardando |
| **Ações rápidas** | Revisar lançamentos · Validar cálculos · Ver pendências · Preparar fechamento |
| **Minhas ordens** | O7, O10, O23 |
| **Resumo** | Timeline do fechamento (próximos passos) |

### 3.4. Comprador

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 1 ordem urgente · 1 nota com dados faltantes |
| **KPIs** | Notas de entrada (mês): 8 · Pendentes de classificação: 2 · Contas a pagar geradas: R$ 1.300 · Ordens pendentes: 3 |
| **Ações rápidas** | Importar XML · Digitar nota · Revisar classificações · Cadastrar fornecedor |
| **Minhas ordens** | O1, O7, O9 |
| **Resumo** | Últimas 5 notas importadas (tabela) |

### 3.5. Faturista

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 1 nota com aviso (chave ausente) |
| **KPIs** | Notas de saída (mês): 5 · Pendentes de classificação: 1 · Contas a receber geradas: R$ 3.300 · Ordens pendentes: 2 |
| **Ações rápidas** | Importar XML · Digitar nota · Revisar classificações · Cadastrar cliente |
| **Minhas ordens** | O2, O7 |
| **Resumo** | Últimas 5 notas emitidas (tabela) |

### 3.6. Financeiro1

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 1 conta vencida · 1 conta a pagar hoje |
| **KPIs** | Em aberto: R$ 1.300 · Vencidas: R$ 300 · Pagas no mês: R$ 500 · Contas abertas: 3 |
| **Ações rápidas** | Pagar conta · Contas a pagar · Posição de caixa · Tabelas basais |
| **Minhas ordens** | O17 (urgente), O15 |
| **Resumo** | Próximos vencimentos (7 dias) — tabela |

### 3.7. Financeiro2

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 1 cliente inadimplente · 1 conta a receber hoje |
| **KPIs** | Em aberto: R$ 3.300 · Inadimplência: R$ 800 · Recebido no mês: R$ 2.000 · Contas abertas: 3 |
| **Ações rápidas** | Receber conta · Contas a receber · Inadimplência · Tabelas basais |
| **Minhas ordens** | O18, O16 |
| **Resumo** | Próximos vencimentos + inadimplência — tabela |

### 3.8. Gerente Financeiro

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | 2 saídas + 2 entradas pendentes de validação |
| **KPIs** | Saídas pendentes: R$ 806 · Entradas pendentes: R$ 2.818 · Confirmadas hoje: 0 · Rejeitadas: 0 |
| **Ações rápidas** | Validar saídas · Validar entradas · Posição de caixa |
| **Minhas ordens** | O19, O20 |
| **Resumo** | Últimas 5 movimentações validadas (lista) |

### 3.9. RH

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | Folha 10/2026 calculada (aguardando consolidação) |
| **KPIs** | Funcionários ativos: 2 · Folha do mês: R$ 8.700 · Encargos: R$ 2.952 · Provisões: R$ 1.149 |
| **Ações rápidas** | Importar folha · Digitar folha · Consolidar folha · Cadastrar funcionário |
| **Minhas ordens** | O6, O12, O21 |
| **Resumo** | Folha do mês (resumo por funcionário) — tabela |

### 3.10. Auditor

| Bloco | Conteúdo |
| :--- | :--- |
| **Alertas** | Fechamento aguardando validação · 1 apontamento pendente |
| **KPIs** | Eventos hoje: 8 · Apontamentos abertos: 1 · Solicitações abertas: 1 · Fechamento: Aguardando |
| **Ações rápidas** | Consultar auditoria · Apontar problema · Solicitar correção · Validar fechamento |
| **Minhas ordens** | O23, O25, O26 |
| **Resumo** | Últimos 5 eventos (lista) |

### 3.11. Card do Conselheiro (Administrador)

No dashboard do Administrador, há um card "Sugestões do Conselheiro" com as **3 primeiras sugestões de alta prioridade** + "Ver todas".

O card só aparece para o Administrador (não para outros atores). Se não houver sugestões, mostra "Nenhuma sugestão no momento".

**Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  💡 Sugestões do Conselheiro (3)              Ver todas →   │
│  • R1 Revisar preço do cliente João da Silva (margem 8%)    │
│  • K1 Saldo negativo projetado em 10/11/2026                │
│  • C1 Concentração de fornecedor (45% dos custos)           │
└─────────────────────────────────────────────────────────────┘
```

**Comportamento:**
- Ao clicar em uma sugestão, vai para a tela do Conselheiro (3.18) com a sugestão destacada.
- Ao clicar em "Ver todas", vai para a tela do Conselheiro (3.18).
- Se não houver sugestões, mostra "Nenhuma sugestão no momento".

**Ver `14_conselheiro.md`, seção 5.6.**

---

## 4. Componentes

| Componente | O que faz | Cores |
| :--- | :--- | :--- |
| `ti-saudacao` | "Olá, [nome]" + data + período + filial. | — |
| `ti-alertas` | Lista de alertas (ícone, texto, rota). | `urg` (vermelho), `err` (vermelho), `warn` (laranja), `info` (azul) |
| `ti-kpis` | 4 cards com label e valor. | `info` (azul), `ok` (verde), `aviso` (laranja), `erro` (vermelho) |
| `ti-acoes` | 4 botões com ícone e label. | Azul |
| `ti-ordens` | 3 primeiras ordens + "Ver todas". | Urgente destacada |
| `ti-resumo` | Bloco livre. | Depende do tipo: `lista`, `mini-dre`, `tabela`, `timeline` |

---

## 5. Regras de negócio

- **RN1** A Tela Inicial é **fixa** por ator na fase 1. Customizável é fase 2.
- **RN2** A Tela Inicial é o **primeiro item do menu** (1.0), antes da Caixa de Entrada (1.1).
- **RN3** Ao **carregar a página**, o sistema abre a Tela Inicial.
- **RN4** Ao **trocar de ator**, o sistema abre a Tela Inicial do novo ator.
- **RN5** Os **alertas** são clicáveis e levam à tela correspondente.
- **RN6** As **ações rápidas** são clicáveis e levam à tela correspondente.
- **RN7** A seção **"Minhas ordens"** mostra as 3 primeiras ordens pendentes/em andamento do ator (ordenadas por urgente > prioridade > data). O link "Ver todas" leva à Caixa de Entrada (1.1).
- **RN8** O **resumo** varia por ator (lista, mini-DRE, tabela, timeline).
- **RN9** Os **dados** são mock no wireframe; na produção, virão do backend.
- **RN10** A Tela Inicial **não substitui** as telas; ela **aponta** para elas.
- **RN11** Para o **Administrador**, a Tela Inicial **incorpora** um resumo do Painel Executivo (G9 / 3.11), com 6 KPIs principais (Receita líquida, Lucro líquido, Margem líquida, Liquidez corrente, Endividamento, ROE), cada um com **semáforo** e **drill-down** para o Painel completo.
- **RN12** Os demais atores **não** veem o resumo do Painel Executivo na Tela Inicial — apenas os seus KPIs específicos (ver seção 3.2).

---

## 6. Telas do wireframe

- `screens['tela-inicial']` — dashboard adaptado por ator.
- `screens['painel-executivo']` — Painel Executivo (G9 / 3.11), referenciado pela Tela Inicial do Administrador (a criar no wireframe — fase 2).

---

## 7. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-24 | Criação do documento. Define a Tela Inicial (dashboard por ator), os 6 componentes, o conteúdo por ator e as regras de negócio. |
| 1.1 | 2026-10-25 | **Merge do `13` (v1.1) — FA adotada.** A Tela Inicial do Administrador incorpora um resumo do Painel Executivo (G9 / 3.11) com 6 KPIs + semáforo + drill-down. Novas RN11 e RN12. Referência ao `painel-executivo.js` e à `screens['painel-executivo']` (a criar no wireframe). Dependência do `13` adicionada. |
| 1.2 | 2026-10-26 | Inclusão do card "Sugestões do Conselheiro" no dashboard do Administrador; KPIs do Painel Executivo (G9) incorporados; dependências atualizadas (inclui `13_relatorios_administrador` e `14_conselheiro`). |
| 1.3 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: dashboard por empresa (contexto); `tarefa` é grupo F. Nenhuma alteração estrutural. |
---
