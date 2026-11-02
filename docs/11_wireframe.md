---
documento: wireframe
versao: 1.4
data: 2026-10-26
proposito: Descrição do wireframe HTML/CSS/JS, telas e dados simulados + nota de multi-empresa (tenant)
depende_de: [03_casos_de_uso, 08_ordens, 09_menu_numeracao, 10_modelo_dados_fisico, 12_tela_inicial, 13_relatorios_administrador, 14_conselheiro]
---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. Todas as telas que listam dados (notas, contas, lançamentos, relatórios, dashboard) assumem a **empresa do contexto de autenticação**. O wireframe usa dados simulados de **uma** empresa; a implementação real aplica o filtro de empresa no repositório (R2). Nenhuma tela precisa de seletor de empresa na fase 1 — a troca de contexto é fase 2 (pendências 15 e 43 em `06_pendencias.md`).

# Wireframe

> **O que é:** uma versão de demonstração do sistema, construída em **HTML/CSS/JavaScript puro**, com **dados simulados** (mock). Serve para **validar a experiência do usuário** antes da implementação real.
>
> **O que não é:** não é a versão de produção. Não tem backend, não persiste dados entre recarregamentos (exceto `localStorage` do menu, tema, fonte e ator), não faz autenticação real.
>
> **Público:** time de desenvolvimento, Contador, Auditor, Configurador, e demais interessados em validar a experiência.

---

## 1. Conceito

O wireframe é uma **maquete navegável** do sistema. Ele cobre:

- **Menu por ator** (blocos 1–12) com numeração de acesso rápido (1.0 a 12.5, incluindo 3.10–3.17).
- **Tela Inicial** (dashboard por ator) — item 1.0, com resumo do Painel Executivo para o Administrador.
- **Caixa de entrada/saída/histórico** (ordens O1–O32).
- **Todas as 63 telas** dos 11 blocos de atores + **8 telas novas** do Administrador (G8–G15).
- **Importação de XML** (Comprador 5.4, Faturista 6.4).
- **Contas a pagar/receber** (com juros/multa/desconto).
- **Validação de cálculos** (com override).
- **Relatórios** (DRE, fluxo de caixa, análise, margem + **Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo**).
- **Auditoria** (log, documentos, lançamentos, handoff, validar fechamento).

**Princípio:** a Tela Inicial é a **primeira tela** ao carregar a página e ao trocar de ator. O ator pode navegar pelo menu lateral ou pelo campo "Ir para" (atalho `Ctrl+K`).

---

## 2. Como rodar

### 2.1. Pré-requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Nenhum servidor é necessário (o wireframe roda **no navegador**, abrindo o `index.html`).

### 2.2. Passos

1. Baixe ou clone a pasta `exemplos/` (que contém `index.html` e `assets/`).
2. Abra o `index.html` no navegador (duplo clique ou arraste para o navegador).
3. O sistema abre direto na **Tela Inicial** do ator atual (padrão: Configurador).
4. Use o **seletor de ator** no topbar para alternar entre os 10 atores.
5. Use o **menu lateral** ou o campo **"Ir para"** (`Ctrl+K`) para navegar.

### 2.3. Atalhos

| Atalho | O que faz |
| :--- | :--- |
| `Ctrl+K` | Foca o campo "Ir para" (número do menu). |
| `Ctrl+Shift+A` | Abre/fecha o seletor de ator. |

### 2.4. Persistência

O wireframe usa o **`localStorage`** do navegador para persistir:

- **Ator selecionado** (chave `wireframe_ator_atual`).
- **Tema** (Moderno / Clássico / Desktop).
- **Tamanho de fonte** (Pequena / Média / Grande / Extra).
- **Blocos recolhidos** do menu (chave `menu_blocos_recolhidos`).

Para **resetar tudo**, limpe o `localStorage` (DevTools → Application → Local Storage → remover as chaves).

---

## 3. Tela Inicial (dashboard por ator)

A Tela Inicial é o **primeiro item do menu** (1.0) e o **dashboard** que o ator vê ao entrar no sistema. Ela é **fixa por ator** na fase 1 (customizável é fase 2).

### 3.1. Estrutura

- **Saudação:** "Olá, [nome]" + data + período + filial.
- **Alertas:** o que precisa de atenção (contas vencidas, pendências, ordens urgentes). Clicáveis.
- **KPIs:** 4 indicadores-chave (específicos do ator).
- **Ações rápidas:** 4 botões para as tarefas mais frequentes.
- **Minhas ordens:** 3 primeiras ordens pendentes/em andamento + "Ver todas".
- **Resumo:** bloco livre (lista, mini-DRE, tabela, timeline).

### 3.2. Conteúdo por ator

Ver `12_tela_inicial.md`, seção 3. Resumo:

| Ator | KPIs (exemplo) | Ações rápidas (exemplo) | Resumo |
| :--- | :--- | :--- | :--- |
| Configurador | Empresas, Filiais, Usuários, OSI | Cadastrar empresa, filial, usuários, OSI | Últimas alterações (lista) |
| Administrador | Receita líquida, Lucro líquido, Caixa, Margem | Ver DRE, Posição de caixa, Fluxo, Exportar | Mini-DRE |
| Contador | Lançamentos pendentes, Conflitos, Pendências, Fechamento | Revisar, Validar, Pendências, Preparar | Timeline do fechamento |
| Comprador | Notas entrada, Pendentes, Contas a pagar, Ordens | Importar XML, Digitar, Revisar, Fornecedor | Últimas 5 notas (tabela) |
| Faturista | Notas saída, Pendentes, Contas a receber, Ordens | Importar XML, Digitar, Revisar, Cliente | Últimas 5 notas (tabela) |
| Financeiro1 | Em aberto, Vencidas, Pagas, Contas abertas | Pagar, Contas a pagar, Caixa, Tabelas | Próximos vencimentos |
| Financeiro2 | Em aberto, Inadimplência, Recebido, Contas abertas | Receber, Contas a receber, Inadimplência, Tabelas | Vencimentos + inadimplência |
| Gerente Financeiro | Saídas pendentes, Entradas pendentes, Confirmadas, Rejeitadas | Validar saídas, Validar entradas, Caixa | Últimas movimentações |
| RH | Funcionários, Folha, Encargos, Provisões | Importar, Digitar, Consolidar, Funcionário | Folha do mês (tabela) |
| Auditor | Eventos hoje, Apontamentos, Solicitações, Fechamento | Auditoria, Apontar, Solicitar, Validar | Últimos 5 eventos |

### 3.3. Arquivos do wireframe

- `assets/js/tela-inicial.js` — renderização da Tela Inicial.
- `assets/css/tela-inicial.css` — estilos dos componentes.

### 3.4. Como testar

1. Recarregar a página → a Tela Inicial do ator atual aparece.
2. Trocar de ator no seletor → a Tela Inicial do novo ator aparece.
3. Clicar em um alerta → vai para a tela correspondente.
4. Clicar em uma ação rápida → vai para a tela correspondente.
5. Clicar em "Ver todas" (ordens) → vai para a Caixa de Entrada.

---

## 4. Menu por ator e numeração

O menu é montado **pelas tags do ator logado**. Cada item tem um **número de acesso rápido** (ex: `4.7`), digitável no campo **"Ir para"** (`Ctrl+K`).

| Bloco | Itens | Números |
| :--- | :--- | :--- |
| **Meu Trabalho** (todos) | Tela Inicial, Caixa de Entrada, Caixa de Saída, Histórico | 1.0 a 1.3 |
| **Configurador** | Empresa, Filiais, Centros, Usuários, Produtos, Serviços, Ativos, OSI | 2.1 a 2.8 |
| **Administrador** | DRE, DRE por Centro, Resumo por Área, Fluxo, Análise, Margem, Exportação, Posição, Simulações | 3.1 a 3.9 |
| **Contador** | Tabelas Fiscais, Plano de Contas, Config. Contábeis, Config. Fiscais, Regras, Lançamento Manual, Revisão, Validação, Pendências, Preparar/Fechar | 4.1 a 4.11 |
| **Comprador** | Tabelas Basais, Fornecedores, Digitar Notas, Importar XML, Revisar | 5.1 a 5.5 |
| **Faturista** | Tabelas Basais, Clientes, Digitar Notas, Importar XML, Revisar | 6.1 a 6.5 |
| **Financeiro1** | Tabelas Basais, Contas a Pagar, Pagamentos | 7.1 a 7.3 |
| **Financeiro2** | Tabelas Basais, Contas a Receber, Recebimentos | 8.1 a 8.3 |
| **Gerente Financeiro** | Validar Saídas, Validar Entradas | 9.1, 9.2 |
| **RH** | INSS, IRRF, Gerais, Funcionários, Tabelas Auxiliares, Folha | 10.1 a 10.6 |
| **Auditor** | Auditoria (log), Documentos, Lançamentos, Handoff, Pendências, Apontar, Solicitar, Validar Fechamento | 11.1 a 11.8 |

**Regras do menu:**

- **Configurador** vê todos os blocos (acesso total).
- **Demais atores** veem o bloco do seu ator + Meu Trabalho + Administração (se tiver permissão).
- **Blocos podem ser expandidos/recolhidos** (persistido no `localStorage`).
- **Botões "Expandir" / "Recolher" / "↺"** no topo do menu (ação em lote / reset).
- **Itens de fase 2** aparecem desabilitados com rótulo "(fase 2)".

---

## 5. Seleção de ator (modo demonstração)

O **seletor de ator** no topbar permite alternar entre os 10 atores do wireframe, simulando o login. Ao trocar de ator:

1. O menu é **re-montado** com os blocos do novo ator.
2. A tela é **redirecionada** para a **Tela Inicial** do novo ator (1.0).
3. O rótulo do usuário na sidebar é atualizado.
4. A escolha é **persistida** no `localStorage` (`wireframe_ator_atual`).
5. Os dois objetos (`USUARIO_LOGADO` no `menu.js` e `USUARIO_ORDENS` no `dados-simulados.js`) são sincronizados.

**Atalho:** `Ctrl+Shift+A` abre/fecha o dropdown.

**Observação:** no sistema real, não há seletor de ator — o ator vem do **login** (autenticação). O seletor é uma ferramenta de demonstração do wireframe.

---

## 6. Estrutura de arquivos

```
exemplos/
├── assets/
│   ├── css/
│   │   ├── geral.css                      ← base (comum a todas as telas)
│   │   ├── menu.css                       ← menu (blocos, numeração, "Ir para")
│   │   ├── tema-moderno.css               ← tema Moderno
│   │   ├── tema-classico.css              ← tema Clássico
│   │   ├── tema-retro.css                 ← tema Desktop
│   │   ├── acessibilidade.css             ← tamanho de fonte
│   │   ├── seletor-ator.css               ← seletor de ator no topbar
│   │   ├── tela-inicial.css               ← dashboard (Tela Inicial)
│   │   ├── nota-entrada.css               ← wizard de nota de entrada
│   │   ├── nota-saida.css                 ← wizard de nota de saída
│   │   ├── contas.css                     ← contas a pagar/receber
│   │   ├── ordens.css                     ← caixa de entrada/saída
│   │   ├── contador.css                   ← telas do Contador
│   │   ├── tabelas-basais.css             ← abas das tabelas
│   │   ├── auditor.css                    ← telas do Auditor
│   │   ├── administrador.css              ← DRE, posição, análise
│   │   ├── importacao.css                 ← upload de XML
│   │   └── handoff.css                    ← (se houver estilo específico; reusa contador.css)
│   └── js/
│       ├── dados-simulados.js             ← todos os dados mock
│       ├── geral.js                       ← showScreen, formatarMoeda, formatarData
│       ├── menu-dados.js                  ← itens do menu (1.0 a 12.5)
│       ├── menu.js                        ← montagem do menu, "Ir para", badge
│       ├── seletor-ator.js                ← troca de ator, sincronização
│       ├── acessibilidade.js              ← tamanho de fonte
│       ├── tela-inicial.js                ← dashboard por ator
│       ├── configuracao.js                ← empresa, filial, centros
│       ├── cadastros.js                   ← usuários, clientes, fornecedores, produtos
│       ├── lancamentos.js                 ← lançamentos
│       ├── nota-entrada.js                ← wizard de nota de entrada
│       ├── nota-saida.js                  ← wizard de nota de saída
│       ├── contas-pagar.js                ← contas a pagar
│       ├── contas-receber.js              ← contas a receber
│       ├── caixa-entrada.js               ← ordens pendentes
│       ├── caixa-saida.js                 ← ordens emitidas
│       ├── historico.js                   ← ordens concluídas/canceladas
│       ├── revisao-lancamentos.js         ← D3 (Contador)
│       ├── revisao-classificacoes.js      ← D3 (Comprador/Faturista)
│       ├── regras-classificacao.js        ← D5
│       ├── pendencias.js                  ← T6
│       ├── fechamento.js                  ← A6 (Contador)
│       ├── validar-fechamento.js          ← A6 (Auditor)
│       ├── tabelas-trabalhistas.js        ← INSS, IRRF, encargos
│       ├── proventos-descontos.js         ← 10.5
│       ├── folha-pagamento.js             ← 10.6
│       ├── tabelas-basais.js              ← 7.1 e 8.1
│       ├── tabelas-basais-comprador-faturista.js  ← 5.1 e 6.1
│       ├── validar-financeiro.js          ← 9.1 e 9.2
│       ├── parametros-fiscais.js          ← 4.1
│       ├── plano-contas.js                ← 4.2
│       ├── mapeamento-referencial.js      ← 4.3
│       ├── configuracoes-fiscais.js       ← 4.4
│       ├── validacao-calculos.js          ← 4.8
│       ├── auditoria.js                   ← 11.1 a 11.4
│       ├── apontar-solicitar.js           ← 11.6 e 11.7
│       ├── relatorios.js                  ← 3.1, 3.2, 3.3
│       ├── relatorios-avancados.js        ← 3.4, 3.5, 3.6
│       ├── posicao-caixa.js               ← 3.8
│       ├── simulacoes.js                  ← 3.9 (placeholder)
│       ├── importar-xml.js                ← 5.4 e 6.4
│       └── handoff.js                     ← 2.8 (ativar/desativar OSI)
├── index.html                             ← página principal
└── README.md                              ← instruções (a criar)
```

---

## 7. O que está implementado

| Item | Status |
| :--- | :--- |
| **Menu por ator** (blocos 1–12) | ✅ |
| **Numeração de menu** (1.0 a 12.5) + campo "Ir para" | ✅ |
| **Expandir/recolher blocos** do menu (com persistência) | ✅ |
| **Seletor de ator** (modo demonstração) | ✅ |
| **Troca de tema** (Moderno, Clássico, Desktop) | ✅ |
| **Tamanho de fonte customizável** (A-, A, A+, A++) | ✅ |
| **Tela Inicial** (dashboard por ator) | ✅ |
| **Caixa de entrada/saída/histórico** (ordens O1–O32) | ✅ |
| **Importar XML** (Comprador 5.4, Faturista 6.4) | ✅ |
| **Contas a pagar/receber** (com juros/multa/desconto) | ✅ |
| **Validação de cálculos** (com override) | ✅ |
| **DRE** (3.1, 3.2, 3.3) + **fluxo de caixa** (3.4) + **análise** (3.5, 3.6) | ✅ |
| **Posição de caixa** (3.8) | ✅ |
| **Simulações** (3.9 — placeholder fase 2) | ✅ |
| **Auditoria** (11.1–11.4) + **apontar/solicitar** (11.6, 11.7) + **validar fechamento** (11.8) | ✅ |
| **Tabelas basais do Comprador e Faturista** (5.1 e 6.1) | ✅ |
| **Ordem de Serviço Interna** (2.8 — ativar/desativar) | ✅ |
| **Balanço Patrimonial** (3.10 — G8) | ✅ |
| **Painel Executivo** (3.11 — G9) | ✅ |
| **Aging de Contas** (3.12 — G10) | ✅ |
| **Posição de Impostos** (3.13 — G11) | ✅ |
| **Posição de Pessoal** (3.14 — G12) | ✅ |
| **Posição de Ativos** (3.15 — G13) | ✅ |
| **Ponto de Equilíbrio** (3.16 — G14) | ✅ |
| **Resumo Executivo** (3.17 — G15) | ✅ |
| **Relatórios do Administrador (G8–G15)** — 3.10 a 3.17 | ✅ |
| **Conselheiro** (3.18) + card no dashboard | ✅ |

| **Todas as 63 telas do menu + 8 relatórios novos** | ✅ |

---

## 8. O que é mock (não persiste / não é real)

| Item | O que é mock |
| :--- | :--- |
| **Dados** | Todos os dados (empresas, filiais, lançamentos, notas, contas, ordens) são **arrays em memória** em `dados-simulados.js`. Recarregar a página reseta (exceto o que está no `localStorage`). |
| **Autenticação** | Não há login real. O ator é selecionado no **seletor de ator** (modo demonstração) e persistido no `localStorage`. |
| **Backend** | Não há. Toda a lógica (cálculos, classificações, validações) é simulada no front. |
| **Importação de XML** | Simula a varredura da pasta. Os XMLs são gerados a partir de `xmlsSimulados`. Não faz upload real. |
| **Upload de arquivos** | Não faz upload real. A "pasta" e o "arquivo" são simulados. |
| **Exportação** | Mostra um alerta simulando o download. Não gera arquivo real. |
| **Cálculos** | Os cálculos (juros, multa, INSS, IRRF, impostos) são simplificados, apenas para demonstração. Na produção, virão do backend. |
| **Persistência** | Só persistem no `localStorage`: ator, tema, tamanho de fonte e blocos recolhidos do menu. O resto não. |

---

## 9. O que **não** está implementado (fase 2)

| Item | Status |
| :--- | :--- |
| **Simulação de cenários** (H1–H5) | Placeholder com roadmap (3.9) |
| **Importação de XML em lote real** (upload de pasta do sistema operacional) | Simulado |
| **CNAB / OFX** (integração bancária) | Não implementado |
| **Rateio de despesas fixas** (margem líquida) | Não implementado |
| **Comparação com realizado** (fluxo de caixa) | Não implementado |
| **Menu com permissões granulares por relatório** | Não implementado |
| **Indústria** (subcontas de custo) | Não implementado |
| **Múltiplas empresas** | Não implementado |
| **Tela de correção de dados** | Não implementado |
| **Tour / ajuda no sistema** | Não implementado |
| **Notificações (sino)** | Não implementado |
| **Balanço Patrimonial** — drill-down por conta (G8, FA3) | Básico (tabela) |
| **Aging de Contas** — drill-down por faixa (G10, FA3) | Básico (tabela) |
| **Posição de Impostos** — drill-down por documento (G11, FA2) | Básico (tabela) |
| **Posição de Pessoal** — drill-down por área (G12, FA2) | Básico (tabela) |
| **Posição de Ativos** — drill-down por ativo (G13, FA2) | Básico (tabela) |
| **Ponto de Equilíbrio** — simulação de cenário (G14, FA2) | Básico (gráfico) |
| **Resumo Executivo** — envio por e-mail / agendamento (G15, FA1/FA2) | Básico (tela) |
| **Painel Executivo** — semáforo configurável (G9, RN2) | Faixas fixas (padrão) |
| **Painel Executivo** — alertas proativos configuráveis (G9, RN5) | Alertas fixos (padrão) |
| **Metas do Conselheiro** (fase 2) | Não implementado |
| **Benchmarks do Conselheiro** (fase 2) | Não implementado |
| **Notificações do Conselheiro** (fase 2) | Não implementado |

---

## 10. Como testar o wireframe (roteiro de demonstração)

### 10.1. Configurador

1. **Tela Inicial** (1.0): veja KPIs (empresas, filiais, usuários, OSI) e ações rápidas.
2. **Empresa** (2.1): cadastro da empresa.
3. **Usuários** (2.4): trocar tags de ator por filial.
4. **Ordem de Serviço Interna** (2.8): ativar/desativar (com justificativa).
5. **Trocar de ator** para **Comprador** (no seletor do topbar).

### 10.2. Comprador

1. **Tela Inicial** (1.0): KPIs (notas de entrada, pendentes, contas a pagar, ordens).
2. **Importar XML** (5.4): selecionar pasta → pré-validação (aceitos, rejeitados) → confirmar → resultado.
3. **Revisar Classificações** (5.5): aceitar/alterar/rejeitar; "Por que?".
4. **Fornecedores** (5.2): cadastro com categoria padrão.

### 10.3. Contador

1. **Tela Inicial** (1.0): pendências, conflitos, fechamento.
2. **Revisão de Lançamentos** (4.7): aceitar/alterar/rejeitar; criar regra.
3. **Regras de Classificação** (4.5): ativar/desativar, testar.
4. **Validação de Cálculos** (4.8): override com justificativa.
5. **Pendências** (4.9): erros (bloqueiam) e avisos.
6. **Preparar Fechamento** (4.10): timeline do fechamento.

### 10.4. Auditor

1. **Tela Inicial** (1.0): eventos, apontamentos, fechamento.
2. **Auditoria (log)** (11.1): filtros, detalhes.
3. **Apontar Problemas** (11.6): criar apontamento.
4. **Validar Fechamento** (11.8): aprovar/reprovar.

### 10.5. Financeiro1 / Financeiro2

1. **Tela Inicial** (1.0): em aberto, vencidas, pagas.
2. **Contas a Pagar** (7.2): pagar conta vencida (juros/multa), estornar.
3. **Contas a Receber** (8.2): receber conta inadimplente.
4. **Validar Saídas/Entradas** (9.1/9.2): confirmar/rejeitar.

### 10.6. Administrador

1. **Tela Inicial** (1.0): resumo do Painel Executivo (6 KPIs + alertas + drill-down).
2. **Painel Executivo** (3.11): 15 KPIs em 4 blocos (Resultado, Liquidez, Endividamento, Rentabilidade) + semáforo + drill-down.
3. **DRE** (3.1): estrutura completa.
4. **Balanço Patrimonial** (3.10): Ativo/Passivo/PL + análise vertical + equação patrimonial.
5. **Aging de Contas** (3.12): faixas a receber/a pagar + inadimplência + PMR/PMP.
6. **Posição de Impostos** (3.13): saldo por tipo + evolução + carga tributária.
7. **Posição de Pessoal** (3.14): custo total + provisões + headcount + custo por área.
8. **Posição de Ativos** (3.15): valor contábil líquido + depreciação + projeção 12 meses.
9. **Ponto de Equilíbrio** (3.16): PE contábil/financeiro + margem de segurança + gráfico.
10. **Resumo Executivo** (3.17): destaques + riscos + oportunidades + ações (1 página).
11. **Resumo por Área** (3.3): cards por área.
12. **Posição de Caixa** (3.8): saldos e fluxo.
13. **Simulações** (3.9): placeholder fase 2.

### 10.7. Administrador — Relatórios expandidos + Conselheiro

1. **Tela Inicial** (1.0): KPIs do Painel Executivo + card "Sugestões do Conselheiro" (3 primeiras).
2. **Painel Executivo** (3.11): 12–15 KPIs com semáforo.
3. **Balanço Patrimonial** (3.10): Ativo = Passivo + PL.
4. **Aging de Contas** (3.12): faixas de atraso.
5. **Posição de Impostos** (3.13): saldo devedor/credor por tipo.
6. **Posição de Pessoal** (3.14): custo total + provisões.
7. **Posição de Ativos** (3.15): valor contábil líquido + depreciação.
8. **Ponto de Equilíbrio** (3.16): PE contábil e financeiro.
9. **Resumo Executivo** (3.17): 1 página com destaques, riscos, oportunidades.
10. **Conselheiro** (3.18): sugestões priorizadas; "Ver dados", "Ir para tela", "Marcar como lida".

---

## 11. Como contribuir / reportar problemas

> **Público:** time de desenvolvimento.

### 11.1. Reportar um problema

1. Abra o **DevTools** (F12) → aba **Console**.
2. Reproduza o problema.
3. Copie a mensagem de erro (se houver).
4. Anote:
   - Ator selecionado (no seletor do topbar).
   - Número do menu (ex: 4.7).
   - O que você fez (passo a passo).
   - O que esperava vs. o que aconteceu.
5. Envie ao responsável pelo wireframe.

### 11.2. Contribuir com uma tela

1. **Verifique** se a tela já existe em `screens[rota]` (no arquivo JS correspondente).
2. **Se não existir**, crie um arquivo JS novo em `assets/js/`:
   - Use o padrão: `screens['minha-rota'] = () => { ... }`.
   - Use os componentes existentes (`.card`, `.contador-kpis`, `.data-regras`, `.btn`, etc.).
   - Use as funções auxiliares (`formatarMoeda`, `formatarData`, `showScreen`).
3. **Adicione o item no menu** em `menu-dados.js`:
   - `codigo` (número), `nome`, `rota`, `icone`, `bloco`, `atores`.
4. **Adicione o script** no `index.html`.
5. **Teste** em todos os temas (Moderno, Clássico, Desktop).

### 11.3. Convenções de código

- **Tabelas:** plural (`contasPagar`, `notasEntrada`).
- **Funções:** `verboSubstantivo` (`abrirBaixaPagar`, `calcularImpostos`).
- **Rotas:** kebab-case (`contas-pagar`, `nota-entrada`).
- **Números de menu:** `bloco.item` (`4.10`).
- **Dados mock:** todos em `dados-simulados.js`.
- **CSS:** um arquivo por módulo (`contas.css`, `ordem.css`).

---

## 12. Limitações conhecidas

1. **Sem backend:** toda a lógica é simulada no front. Na produção, será substituída por chamadas `fetch()` à API.
2. **Dados mock:** os dados não persistem entre recarregamentos (exceto o que está no `localStorage`).
3. **Cálculos simplificados:** juros, multa, INSS, IRRF, impostos são aproximações para demonstração.
4. **Sem autenticação real:** o seletor de ator é uma ferramenta de demonstração. No sistema real, o ator vem do login.
5. **Sem upload real:** a importação de XML é simulada.
6. **Sem exportação real:** a exportação mostra um alerta simulando o download.
7. **Fase 2:** simulação (H1–H5), CNAB, indústria, múltiplas empresas, tela de correção de dados, comparação com realizado, etc.

---

## 13. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-24 | Criação do documento. Descreve o wireframe (telas, dados simulados, estrutura de arquivos). |
| 1.1 | 2026-10-24 | Inclusão da seção 3 (Tela Inicial — dashboard por ator); inclusão da seção 5 (seletor de ator); ajuste nas dependências (inclui `12_tela_inicial`); atualização do item 2.8 (Handoff → Ordem de Serviço Interna); atualização da estrutura de arquivos (novos scripts: `tela-inicial.js`, `seletor-ator.js`, `handoff.js`, `tabelas-basais-comprador-faturista.js`); atualização do item 7 (o que está implementado). |
| 1.2	| 2026-10-25 | Merge do 13 (v1.1). Inclusão dos 8 relatórios do Administrador no wireframe (G8–G15 / 3.10–3.17). Atualização da Tela Inicial (resumo do Painel Executivo para o Administrador). Novos arquivos JS: painel-executivo.js, balanco.js, aging.js, posicao-impostos.js, posicao-pessoal.js, posicao-ativos.js, ponto-equilibrio.js, resumo-executivo.js. Novos CSS: relatorios-administrador.css, tela-inicial-painel.css. Atualização de dados-simulados.js, geral.js, menu-dados.js, tela-inicial.js, index.html. |
| 1.3 | 2026-10-26 | Inclusão dos relatórios G8–G15 (3.10–3.17) e do Conselheiro (3.18); roteiro de demonstração do Administrador expandido; dependências atualizadas. |
| 1.4 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: telas assumem empresa do contexto; sem seletor de empresa na fase 1. Nenhuma alteração estrutural. |