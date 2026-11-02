---
documento: relatorios_administrador
versao: 1.2
data: 2026-10-28
proposito: Proposta aprovada de expansão dos relatórios do Administrador (G8–G15) + nota de multi-empresa (tenant)
depende_de: [01_visao_geral, 02_regras_transversais, 03_casos_de_uso, 04_modelo_de_dados, 06_pendencias, 08_ordens, 09_menu_numeracao, 12_tela_inicial]

---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. Todos os relatórios G8–G15 são **por empresa** (contexto de autenticação), filtrados pelo repositório (R2). As tabelas consultadas são dos grupos A (têm `id_empresa`) e F (têm `id_filial`, herdam empresa via `filial`). **Consolidação entre empresas** (grupo econômico) **não** faz parte da fase 1 — depende das pendências 15 e 34 (multi-empresa no mesmo usuário). Na fase 1, os relatórios consolidam **filiais** de **uma** empresa, não **empresas**.


# Relatórios do Administrador — Proposta de Expansão

> **O que é:** documento **novo**, de **proposta**, que consolida a análise das lacunas nos relatórios do Administrador (bloco 3 do menu) e propõe **8 relatórios novos** (G8–G15), com foco em **visão geral da situação da empresa**.
>
> **O que não é:** não altera os 13 documentos existentes. Não cria tabela nova no banco. Não cria agente novo. É a **fonte da verdade** para o merge (fase 3), que só acontece **depois da aprovação**.
>
> **Regra:** os documentos `00` a `12` permanecem intactos até o merge. O `13` **declara** o que muda e **quando** — não muda nada agora.

---

## Sumário

1. [Contexto e motivação](#1-contexto-e-motivação)
2. [Catálogo atual (G1–G7 + Tela Inicial)](#2-catálogo-atual-g1g7--tela-inicial)
3. [Lacunas identificadas](#3-lacunas-identificadas)
4. [Catálogo proposto (G8–G15)](#4-catálogo-proposto-g8g15)
5. [Matriz de rastreabilidade](#5-matriz-de-rastreabilidade)
6. [Numeração do bloco 3 — duas opções](#6-numeração-do-bloco-3--duas-opções)
7. [Impacto nos 13 documentos existentes](#7-impacto-nos-13-documentos-existentes)
8. [Pendências geradas](#8-pendências-geradas)
9. [Próximos passos (pós-merge)](#9-próximos-passos-pós-merge)
10. [Histórico de versões](#10-histórico-de-versões)

---

## 1. Contexto e motivação

O bloco 3 (Administrador) do menu já tem 9 itens (3.1 a 3.9) + a Tela Inicial (1.0). Eles cobrem bem:

- **Resultado** — DRE (G1), DRE por centro (G2), Resumo por área (G3).
- **Liquidez** — Fluxo de caixa projetado (G4), Posição de caixa (3.8).
- **Custo** — Análise de custos por fornecedor/categoria (G5).
- **Rentabilidade** — Margem por cliente/produto (G6).

**O que falta para a visão geral da empresa:**

- **Posição patrimonial** (Balanço) — o DRE mostra o resultado do período, mas não a posição em um instante.
- **Diagnóstico** (indicadores) — liquidez, endividamento, rentabilidade, eficiência, ciclo de caixa.
- **Risco** (aging de contas) — quanto do saldo a receber está vencido e há quanto tempo.
- **Passivos** (impostos, pessoal, provisões) — o que a empresa deve e não aparece no DRE.
- **Ponto de equilíbrio** — até quanto a receita pode cair sem prejuízo.
- **Resumo executivo** — uma página que o administrador lê em 2 minutos.

**Premissa:** todos esses relatórios **usam dados que já existem** (lançamentos, razão de impostos, folha, ativos, contas a pagar/receber). São consolidações e cálculos derivados, **não módulos novos**. Portanto **não exigem tabela nova no banco** (ver seção 5).

---

## 2. Catálogo atual (G1–G7 + Tela Inicial)

| # | Relatório | O que entrega | Foco | Documento |
| :--- | :--- | :--- | :--- | :--- |
| 3.1 | **DRE Gerencial** | Resultado do período. | Resultado | `03` (G1) |
| 3.2 | **DRE por Centro de Custo** | Resultado segmentado por centro. | Resultado segmentado | `03` (G2) |
| 3.3 | **Resumo por Área** | Cards executivos por área de negócio. | Resultado por área | `03` (G3) |
| 3.4 | **Fluxo de Caixa Projetado** | Entradas/saídas previstas, saldo projetado. | Liquidez futura | `03` (G4) |
| 3.5 | **Análise de Custos** | Gastos por fornecedor e categoria. | Onde o dinheiro sai | `03` (G5) |
| 3.6 | **Margem por Cliente/Produto** | Rentabilidade por cliente/produto. | Rentabilidade | `03` (G6) |
| 3.7 | **Exportação** | Exporta os relatórios. | — | `03` (G7) |
| 3.8 | **Posição de Caixa** | Saldo atual + projeção curta. | Liquidez atual | `03` (F4) |
| 1.0 | **Tela Inicial** | Mini-DRE + 4 KPIs + alertas + ações. | Painel de entrada | `12` (F6) |
| 3.9 | **Simulações** | Cenários (fase 2). | Futuro | `03` (H1–H5) |

**Cobertura:** resultado, liquidez, custo, rentabilidade, segmentação.

**O que **não** aparece:** posição patrimonial, diagnóstico (indicadores), risco de caixa (aging), passivos ocultos (impostos/pessoal/provisões), ponto de equilíbrio, resumo executivo.

---

## 3. Lacunas identificadas

| # | Lacuna | Por que importa | Dados já existem? |
| :--- | :--- | :--- | :--- |
| 3.1 | **Balanço Patrimonial** | Fecha a tríade DRE + Balanço + Caixa. Mostra solvência, endividamento, PL. | ✅ Sim |
| 3.2 | **Indicadores** (liquidez, endividamento, rentabilidade, eficiência) | Transforma números em diagnóstico. ROE, ROA, liquidez corrente, ciclo de caixa. | ✅ Sim (cálculo derivado) |
| 3.3 | **Aging de Contas** (receber e pagar) | Mostra risco de caixa e inadimplência. O administrador vê "R$ 3.300 em aberto", mas não "R$ 800 há 90 dias". | ✅ Sim |
| 3.4 | **Posição de Impostos** | O administrador precisa saber "quanto devo de tributo" (mesmo gerencial). | ✅ Sim (T7) |
| 3.5 | **Posição de Pessoal** | Em serviços, é o maior custo. Provisões são passivo oculto. | ✅ Sim (E3/E5) |
| 3.6 | **Posição de Ativos** | Parte do Balanço (Ativo Não Circulante). | ✅ Sim (E4) |
| 3.7 | **Ponto de Equilíbrio** | Responde "até quanto posso cair sem prejuízo". | ✅ Sim (fixo/variável no plano de contas) |
| 3.8 | **Resumo Executivo (1 página)** | O que o sócio lê no celular. | ⚠️ Derivado (consolida os outros) |
| — | **Painel Executivo** (dashboard) | Tela única com 12–15 KPIs + semáforo + comparação. | ✅ Sim |
| — | **Análise Horizontal/Vertical consolidada** | Tendência (variação % período a período). | ✅ Sim |
| — | **Alertas proativos** | Regras configuráveis ("inadimplência > 10%"). | ⚠️ Requer configuração |
| — | **Comparação com orçamento/metas** | Planejado vs. realizado. | ❌ Fase 2 (orçamento é módulo) |
| — | **Consolidação multiempresa** | Foco é 1 empresa + N filiais. | ❌ Fase 2 |
| — | **Relatório de pendências (T6) para o Administrador** | O T6 é do Contador/Auditor. | ⚠️ Parcial |

**Nota:** as três últimas linhas **não** entram no escopo desta proposta (são fase 2). As demais viram **G8–G15** (8 relatórios) + 1 painel executivo (que **substitui** a Tela Inicial como primeiro item do bloco 3? — ver seção 6).

---

## 4. Catálogo proposto (G8–G15)

Cada relatório segue o **template fixo** dos casos de uso do `03`: Nome, Ator, Pré-condições, Fluxo principal, Fluxos alternativos, Exceções, Pós-condições, Regras de negócio, Telas, Dados de origem, Ordens.

### G8 — Balanço Patrimonial

**Nome:** Visualizar Balanço Patrimonial gerencial.
**Objetivo:** Apresentar a **posição patrimonial** da empresa em uma data (Ativo, Passivo e Patrimônio Líquido), consolidando os saldos das contas patrimoniais do plano de contas.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Operador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos no período `[T5]`.
- Plano de contas com contas patrimoniais (1 Ativo, 2 Passivo, 2.3 PL) configuradas.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Balanço Patrimonial".
2. Sistema solicita a **data de corte** (padrão: último dia do período fechado mais recente; ou período aberto, com aviso).
3. Sistema consolida os saldos das contas patrimoniais (Ativo, Passivo, PL) a partir dos lançamentos.
4. Sistema exibe o Balanço:
   - **Ativo Circulante** (Caixa, Bancos, Contas a Receber, Estoques, Adiantamentos, Impostos a Recuperar).
   - **Ativo Não Circulante** (Imobilizado, (-) Depreciação Acumulada, Intangível).
   - **Passivo Circulante** (Fornecedores, Contas a Pagar, Salários a Pagar, Encargos a Recolher, Impostos a Recolher, Empréstimos CP).
   - **Passivo Não Circulante** (Empréstimos LP).
   - **Patrimônio Líquido** (Capital Social, Lucros/Prejuízos, Resultado do Exercício).
5. Sistema valida: **Ativo = Passivo + PL** (equação patrimonial).
6. Sistema exibe a **análise vertical** (% de cada conta sobre o Ativo total, e do Passivo+PL sobre o total).
7. Usuário pode **filtrar** por filial (todas ou específica) e **exportar**.

**Fluxos alternativos:**
- **FA1 — Balanço comparativo:** comparar duas datas lado a lado (evolução).
- **FA2 — Balanço consolidado (multi-filial):** soma das filiais.
- **FA3 — Drill-down:** clicar em uma conta e ver os lançamentos que a compõem.
- **FA4 — Balanço do período aberto:** dados parciais, com aviso.

**Exceções:**
- **EX1 — Nenhum lançamento no período:** informa.
- **EX2 — Equação patrimonial não fecha:** sistema **alerta** e mostra a diferença (pode indicar lançamento incompleto ou classificação errada). **Não bloqueia** (é gerencial).
- **EX3 — Plano de contas sem contas patrimoniais:** bloqueia e pede configuração.
- **EX4 — Período sem fechamento:** Balanço parcial com aviso.
- **EX5 — Falha na consolidação:** erro e mantém o último Balanço válido.

**Pós-condições:**
- Balanço exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O Balanço segue a estrutura do plano de contas (1 Ativo, 2 Passivo, 2.3 PL).
- **RN2** A equação patrimonial (Ativo = Passivo + PL) é validada, mas **não bloqueia** (é gerencial).
- **RN3** Análise vertical é calculada (% sobre o total).
- **RN4** O Balanço pode ser comparativo (duas datas) e por filial ou consolidado.
- **RN5** Drill-down por conta é permitido.
- **RN6** Balanço do período aberto é permitido, com aviso.
- **RN7** `[T6]` Lançamentos não classificados geram aviso (podem distorcer o Balanço).
- **RN8** O Balanço pode ser exportado.

**Telas envolvidas:**
- Tela "Balanço Patrimonial" (estrutura + análise vertical).
- Painel de comparação (FA1).
- Tela de drill-down (FA3).
- Exportação (Excel/PDF).

**Dados de origem:** `lancamentos` (agrupados por `planos_contas.tipo` ∈ Ativo, Passivo, PL), `planos_contas` (estrutura), `periodos` (data de corte), `filiais` (filtro).

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G9 — Painel Executivo (dashboard do Administrador)

**Nome:** Visualizar Painel Executivo com indicadores-chave.
**Objetivo:** Dar ao Administrador uma **tela única** com os 12–15 KPIs que resumem a empresa, com **semáforo** (verde/amarelo/vermelho), **comparação** (período anterior, mesmo período do ano anterior) e **drill-down** para o relatório detalhado.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Sistema (consolida, calcula).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos e contas no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Painel Executivo" (ou é o **dashboard inicial** do Administrador, no lugar da Tela Inicial — ver seção 6).
2. Sistema solicita o **período** (padrão: mês corrente).
3. Sistema consolida e exibe os KPIs em **cards**, agrupados em 4 blocos:

   **Bloco 1 — Resultado:**
   - Receita líquida (R$).
   - Lucro líquido (R$).
   - Margem líquida (%).
   - Margem bruta (%).

   **Bloco 2 — Liquidez:**
   - Saldo de caixa (R$).
   - Liquidez corrente (AC/PC).
   - Capital de giro líquido (AC − PC).
   - Ciclo de caixa (dias).

   **Bloco 3 — Endividamento:**
   - Endividamento geral (Passivo/Ativo).
   - Composição do endividamento (PC/Passivo).
   - Grau de alavancagem (Passivo/PL).

   **Bloco 4 — Rentabilidade e Eficiência:**
   - ROE (LL/PL).
   - ROA (LL/Ativo).
   - Ponto de equilíbrio (R$).
   - Margem de segurança (%).

4. Cada card mostra:
   - **Valor atual**.
   - **Variação vs. período anterior** (Δ e %).
   - **Semáforo** (verde/amarelo/vermelho) com base em faixas configuráveis.
   - **Drill-down** (clique leva ao relatório detalhado — G8, G10, G14, etc.).
5. Sistema exibe **alertas** no topo (ex: "Inadimplência > 10%", "Caixa projetado negativo em 15 dias", "Margem líquida < 5%").
6. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Comparação com período anterior:** lado a lado.
- **FA2 — Comparação com o mesmo período do ano anterior:** lado a lado.
- **FA3 — Ordenar por criticidade:** pior primeiro.
- **FA4 — Ocultar KPIs irrelevantes:** configurável.
- **FA5 — Drill-down por card.**

**Exceções:**
- **EX1 — Nenhum dado:** informa.
- **EX2 — KPI não calculável** (ex: sem PL, ROE não calcula): exibe "N/A" com nota.
- **EX3 — Falha na consolidação:** erro e mantém o último painel válido.

**Pós-condições:**
- Painel exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O painel é **fixo** na fase 1 (customizável é fase 2).
- **RN2** Cada KPI tem **semáforo** com faixas configuráveis (pelo Configurador — **fase 2**; na fase 1, faixas padrão).
- **RN3** Cada card tem **drill-down** para o relatório detalhado.
- **RN4** Comparação com período anterior e mesmo período do ano anterior.
- **RN5** Alertas no topo (configuráveis — fase 2).
- **RN6** O Painel Executivo **substitui** a Tela Inicial (1.0) para o Administrador? **Não** — a Tela Inicial continua existindo para **todos** os atores; o Painel Executivo é **específico do Administrador**, item 3.x (ver seção 6).
- **RN7** Nenhum dado é alterado.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Painel Executivo" (cards + semáforo + alertas).
- Tela de drill-down (por card).
- Exportação (Excel/PDF).

**Dados de origem:** `lancamentos`, `contas_pagar`, `contas_receber`, `razoes_impostos`, `folhas_pagamento`, `provisoes`, `ativos`, `planos_contas`. **Todos os cálculos são derivados.**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G10 — Aging de Contas a Receber e a Pagar

**Nome:** Analisar envelhecimento de contas a receber e a pagar.
**Objetivo:** Mostrar o **aging** (envelhecimento) das contas a receber e a pagar, por faixa de atraso/vencimento, identificando inadimplência, concentração e pressão de caixa.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Financeiro1/2 (consulta), Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem contas a receber e/ou a pagar no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Aging de Contas".
2. Sistema solicita o **período** e a **visão** (a receber, a pagar, ou ambas).
3. Sistema consolida as contas em aberto por faixa:

   **Contas a receber (por faixa de atraso):**
   - A vencer.
   - 1–30 dias.
   - 31–60 dias.
   - 61–90 dias.
   - > 90 dias.

   **Contas a pagar (por faixa de vencimento):**
   - A vencer (próximos 30 dias).
   - Vencidas 1–30 dias.
   - Vencidas 31–60 dias.
   - Vencidas > 60 dias.

4. Sistema exibe a **tabela** com valores e percentuais.
5. Sistema exibe **indicadores**:
   - Inadimplência % (contas vencidas / total a receber).
   - Prazo médio de recebimento (PMR).
   - Prazo médio de pagamento (PMP).
   - Concentração (top 5 clientes/fornecedores).
6. Usuário pode **filtrar** por cliente/fornecedor e **exportar**.

**Fluxos alternativos:**
- **FA1 — Aging por cliente:** detalhamento por cliente.
- **FA2 — Aging por fornecedor:** detalhamento por fornecedor.
- **FA3 — Drill-down:** clicar em uma faixa e ver as contas que a compõem.
- **FA4 — Comparação entre períodos:** evolução da inadimplência.

**Exceções:**
- **EX1 — Nenhuma conta no período:** informa.
- **EX2 — Contas sem vencimento:** aparecem em "Sem data" (Aviso `[T6]`).
- **EX3 — Falha na consolidação:** erro e mantém a última análise válida.

**Pós-condições:**
- Aging exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** As faixas de aging são configuráveis (fase 2; fase 1 tem padrão).
- **RN2** Contas sem vencimento aparecem em "Sem data" (Aviso `[T6]`).
- **RN3** Inadimplência % = contas vencidas / total a receber.
- **RN4** PMR e PMP são calculados a partir das contas.
- **RN5** Concentração (top N) é mostrada.
- **RN6** Drill-down por faixa.
- **RN7** Comparação entre períodos.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Aging de Contas" (tabela + indicadores).
- Tela de drill-down.
- Exportação (Excel/PDF).

**Dados de origem:** `contas_pagar`, `contas_receber`, `pessoas` (contraparte), `periodos`. **Derivado.**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G11 — Posição de Impostos

**Nome:** Visualizar posição de impostos (saldo devedor/credor por tipo).
**Objetivo:** Mostrar, por tipo de imposto, o **saldo devedor** (o que a empresa deve) e o **saldo credor** (o que tem a recuperar), com evolução mensal e peso sobre a receita.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Contador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos de imposto no período `[T5]`.
- O razão de impostos (T7) está alimentado (E1/E2/E3/E5).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Impostos".
2. Sistema solicita o **período**.
3. Sistema consolida o razão de impostos por tipo (ICMS, PIS, COFINS, ISS, IPI, INSS, FGTS, IRRF, IBS, CBS, etc.):
   - Total de débitos.
   - Total de créditos.
   - **Saldo** (devedor ou credor).
4. Sistema exibe a **tabela** por tipo de imposto.
5. Sistema exibe **indicadores**:
   - **Carga tributária efetiva** (total de impostos sobre vendas / receita bruta).
   - **Saldo devedor total** (o que a empresa deve).
   - **Saldo credor total** (o que tem a recuperar).
   - **Evolução mensal** (gráfico de linha por tipo).
6. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Evolução mensal:** gráfico por tipo de imposto.
- **FA2 — Detalhamento por documento:** clicar em um tipo e ver as notas que o compõem.
- **FA3 — Comparação entre filiais:** visão por filial.
- **FA4 — Projeção de curto prazo:** estimativa do saldo a recolher no próximo mês.

**Exceções:**
- **EX1 — Nenhum lançamento de imposto:** informa.
- **EX2 — Tipo de imposto sem movimentação:** aparece zerado, com aviso.
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O saldo é calculado por tipo de imposto (débitos − créditos).
- **RN2** A carga tributária efetiva é calculada sobre a receita bruta.
- **RN3** Evolução mensal por tipo.
- **RN4** Drill-down por documento.
- **RN5** `[T7]` A posição é **gerencial** — não substitui apuração fiscal oficial.
- **RN6** Aviso: "Este relatório é gerencial; não substitui apuração fiscal."
- **RN7** Exportação.

**Telas envolvidas:**
- Tela "Posição de Impostos" (tabela + indicadores + evolução).
- Tela de drill-down.
- Exportação (Excel/PDF).

**Dados de origem:** `razoes_impostos`, `lancamentos`, `notas_fiscais`, `periodos`. **Já existe (T7).**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G12 — Posição de Pessoal

**Nome:** Visualizar posição de pessoal (custo, encargos, provisões).
**Objetivo:** Mostrar o **custo total de pessoal** (bruto + encargos + provisões), o **peso sobre a receita**, as **provisões acumuladas** (passivo oculto) e a **evolução** do headcount e do custo médio.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** RH (consulta), Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem folhas de pagamento no período `[T5]`.
- Tabelas de INSS, IRRF e encargos vigentes carregadas.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Pessoal".
2. Sistema solicita o **período**.
3. Sistema consolida:
   - **Custo total de pessoal** (bruto + INSS patronal + FGTS + RAT + Terceiros + provisões).
   - **Peso sobre a receita** (%).
   - **Provisões acumuladas** (férias + 13º + encargos) — o passivo oculto.
   - **Headcount** (funcionários ativos) e **custo médio por funcionário**.
   - **Custo de pessoal por área** (centro de custo / área de negócio).
4. Sistema exibe a **tabela** e os **indicadores**.
5. Sistema exibe a **evolução mensal** (gráfico).
6. Usuário pode **filtrar** por filial, centro de custo, área e **exportar**.

**Fluxos alternativos:**
- **FA1 — Evolução do headcount:** gráfico de linha.
- **FA2 — Custo por área:** detalhamento por centro de custo / área.
- **FA3 — Provisões detalhadas:** férias vs. 13º vs. encargos.
- **FA4 — Comparação entre filiais.**

**Exceções:**
- **EX1 — Nenhuma folha no período:** informa.
- **EX2 — Funcionário sem centro de custo:** aparece em "Não alocado" (Aviso `[T6]`).
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Custo total de pessoal = bruto + encargos patronais + provisões.
- **RN2** Peso sobre a receita = custo total / receita bruta.
- **RN3** Provisões acumuladas = férias + 13º + encargos (passivo oculto).
- **RN4** Headcount = funcionários ativos no período.
- **RN5** Custo médio por funcionário.
- **RN6** Custo por área (centro de custo / área de negócio).
- **RN7** Evolução mensal.
- **RN8** Funcionário sem centro de custo aparece em "Não alocado".
- **RN9** Exportação.

**Telas envolvidas:**
- Tela "Posição de Pessoal" (tabela + indicadores + evolução).
- Painel de evolução.
- Exportação (Excel/PDF).

**Dados de origem:** `folhas_pagamento`, `folhas_pagamento_itens`, `provisoes`, `funcionarios`, `centros_custo`, `areas_negocio`. **Já existe (E3/E5).**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G13 — Posição de Ativos e Depreciação

**Nome:** Visualizar posição de ativos e depreciação.
**Objetivo:** Mostrar o **valor contábil líquido** dos ativos, a **depreciação acumulada**, a **depreciação do período**, a **vida útil remanescente** e a **projeção de depreciação futura**.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida), Contador (consulta).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem ativos cadastrados (B4).
- Existe depreciação lançada no período (E4).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Posição de Ativos".
2. Sistema solicita o **período**.
3. Sistema consolida, por ativo:
   - Valor original.
   - Depreciação acumulada.
   - **Valor contábil líquido**.
   - Depreciação do período.
   - Vida útil remanescente.
   - Status (em uso, ocioso, alienado).
4. Sistema exibe a **tabela** por ativo e por centro de custo.
5. Sistema exibe **indicadores**:
   - Total do imobilizado (valor contábil líquido).
   - Depreciação acumulada total.
   - Depreciação do período.
   - **Projeção de depreciação** dos próximos 12 meses.
6. Usuário pode **filtrar** por filial, centro de custo, status e **exportar**.

**Fluxos alternativos:**
- **FA1 — Projeção de depreciação futura:** gráfico dos próximos 12 meses.
- **FA2 — Ativos por status:** em uso, ocioso, alienado.
- **FA3 — Comparação entre filiais.**

**Exceções:**
- **EX1 — Nenhum ativo cadastrado:** informa.
- **EX2 — Ativo sem depreciação lançada:** aparece com "—" e Aviso `[T6]`.
- **EX3 — Falha na consolidação:** erro e mantém a última posição válida.

**Pós-condições:**
- Posição exibida.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Valor contábil líquido = valor original − depreciação acumulada.
- **RN2** A depreciação do período é a lançada em E4.
- **RN3** A vida útil remanescente é calculada a partir da data de corte.
- **RN4** Projeção de depreciação futura (12 meses) é calculada com base na vida útil.
- **RN5** Ativos por status (em uso, ocioso, alienado).
- **RN6** `[T6]` Ativo sem depreciação lançada gera Aviso.
- **RN7** Exportação.

**Telas envolvidas:**
- Tela "Posição de Ativos" (tabela + indicadores + projeção).
- Painel de projeção.
- Exportação (Excel/PDF).

**Dados de origem:** `ativos`, `depreciacoes`, `centros_custo`, `filiais`. **Já existe (E4).**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G14 — Ponto de Equilíbrio

**Nome:** Calcular e visualizar ponto de equilíbrio.
**Objetivo:** Mostrar **quanto a empresa precisa faturar para não ter prejuízo** (ponto de equilíbrio contábil), o **ponto de equilíbrio financeiro** (exclui depreciação) e a **margem de segurança** (%).

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Controller (valida).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem lançamentos no período `[T5]`.
- O plano de contas tem classificação **fixo/variável** (`plano_contas.subtipo`).

**Fluxo principal:**
1. Usuário acessa "Relatórios > Ponto de Equilíbrio".
2. Sistema solicita o **período**.
3. Sistema calcula:
   - **Custos fixos totais** (contas com subtipo Fixo).
   - **Custos variáveis totais** (contas com subtipo Variável).
   - **Margem de contribuição** (receita − custos variáveis) e **%**.
   - **Ponto de equilíbrio contábil** = custos fixos / margem de contribuição %.
   - **Ponto de equilíbrio financeiro** = (custos fixos − depreciação) / margem de contribuição %.
   - **Margem de segurança** = (receita atual − PE) / receita atual.
4. Sistema exibe a **tabela** e um **gráfico** (receita × custos, com o ponto de equilíbrio destacado).
5. Usuário pode **filtrar** por filial e **exportar**.

**Fluxos alternativos:**
- **FA1 — Ponto de equilíbrio por produto/serviço:** detalhamento por produto.
- **FA2 — Simulação de cenário:** "e se o custo fixo aumentar 10%?" (integra com H — fase 2).
- **FA3 — Comparação entre períodos:** evolução do PE.

**Exceções:**
- **EX1 — Nenhum lançamento:** informa.
- **EX2 — Margem de contribuição negativa:** sistema alerta (não é possível calcular PE).
- **EX3 — Plano de contas sem classificação fixo/variável:** bloqueia e pede configuração.
- **EX4 — Falha no cálculo:** erro e mantém o último PE válido.

**Pós-condições:**
- PE exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** Custos fixos e variáveis são classificados no plano de contas (`subtipo`).
- **RN2** Margem de contribuição = receita − custos variáveis.
- **RN3** PE contábil = custos fixos / margem de contribuição %.
- **RN4** PE financeiro = (custos fixos − depreciação) / margem de contribuição %.
- **RN5** Margem de segurança = (receita atual − PE) / receita atual.
- **RN6** Margem de contribuição negativa bloqueia o cálculo (com alerta).
- **RN7** Plano de contas sem classificação fixo/variável bloqueia o cálculo.
- **RN8** Exportação.

**Telas envolvidas:**
- Tela "Ponto de Equilíbrio" (tabela + gráfico).
- Exportação (Excel/PDF).

**Dados de origem:** `lancamentos` (com `planos_contas.subtipo` = Fixo/Variável), `planos_contas`. **Derivado.**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

### G15 — Resumo Executivo (1 página)

**Nome:** Visualizar Resumo Executivo (1 página).
**Objetivo:** Apresentar, em **uma página**, o que o administrador precisa saber para entender "como está a empresa": destaques, riscos, oportunidades e ações sugeridas.

**Ator principal:** Administrador / Empresário.
**Atores secundários:** Sistema (consolida, destaca).

**Pré-condições:**
- Empresa cadastrada (A1).
- Existem dados no período `[T5]`.

**Fluxo principal:**
1. Usuário acessa "Relatórios > Resumo Executivo".
2. Sistema solicita o **período**.
3. Sistema consolida e exibe **em uma página**:

   **Destaques do período:**
   - Receita, lucro, margem (com variação vs. período anterior).
   - Saldo de caixa, liquidez.
   - Endividamento.
   - Ciclo de caixa.

   **Top 3 riscos:**
   - Inadimplência crescendo.
   - Custo de pessoal acima de X% da receita.
   - Caixa projetado negativo em Y dias.
   - (regras configuráveis — fase 2; fase 1 padrão)

   **Top 3 oportunidades:**
   - Margem de produto X subindo.
   - Fornecedor Y com custo caindo.
   - Cliente Z com margem alta.
   - (regras configuráveis — fase 2; fase 1 padrão)

   **Ações sugeridas:**
   - Renegociar fornecedor X.
   - Antecipar recebíveis de Y.
   - Reduzir custo de pessoal em Z%.

4. Sistema permite **drill-down** para o relatório detalhado de cada destaque/risco.
5. Usuário pode **exportar** (PDF é o formato natural para 1 página).

**Fluxos alternativos:**
- **FA1 — Enviar por e-mail:** fase 2.
- **FA2 — Agendar envio semanal:** fase 2.
- **FA3 — Customizar destaques/riscos:** fase 2.

**Exceções:**
- **EX1 — Nenhum dado:** informa.
- **EX2 — Regras de risco não configuradas:** usa padrão.
- **EX3 — Falha na consolidação:** erro e mantém o último resumo válido.

**Pós-condições:**
- Resumo exibido.
- Nenhum dado é alterado.

**Regras de negócio:**
- **RN1** O resumo é **1 página** (impressão/PDF).
- **RN2** Destaques, riscos e oportunidades são derivados dos outros relatórios.
- **RN3** Ações sugeridas são **indicações** — não são executadas pelo sistema.
- **RN4** Drill-down para o relatório detalhado.
- **RN5** Regras de risco/oportunidade configuráveis (fase 2; fase 1 padrão).
- **RN6** Exportação em PDF é o formato natural.
- **RN7** O resumo **não substitui** os relatórios detalhados.

**Telas envolvidas:**
- Tela "Resumo Executivo" (1 página).
- Drill-down.
- Exportação (PDF).

**Dados de origem:** consolidação dos demais (G1–G14). **Derivado.**

**Ordens emitidas/recebidas:** nenhuma (consulta apenas).

---

## 5. Matriz de rastreabilidade

Para cada relatório novo, quais tabelas/campos **já existentes** alimentam (para provar que **não precisa de tabela nova**):

| Relatório | Tabelas de origem | Precisa de tabela nova? |
| :--- | :--- | :--- |
| **G8 — Balanço** | `lancamentos`, `planos_contas`, `periodos`, `filiais` | ❌ Não (consolidação) |
| **G9 — Painel Executivo** | `lancamentos`, `contas_pagar`, `contas_receber`, `razoes_impostos`, `folhas_pagamento`, `provisoes`, `ativos`, `planos_contas` | ❌ Não (cálculo derivado) |
| **G10 — Aging** | `contas_pagar`, `contas_receber`, `pessoas`, `periodos` | ❌ Não (consulta) |
| **G11 — Posição de Impostos** | `razoes_impostos`, `lancamentos`, `notas_fiscais`, `periodos` | ❌ Não (já existe T7) |
| **G12 — Posição de Pessoal** | `folhas_pagamento`, `folhas_pagamento_itens`, `provisoes`, `funcionarios`, `centros_custo`, `areas_negocio` | ❌ Não (já existe E3/E5) |
| **G13 — Posição de Ativos** | `ativos`, `depreciacoes`, `centros_custo`, `filiais` | ❌ Não (já existe E4) |
| **G14 — Ponto de Equilíbrio** | `lancamentos`, `planos_contas` (subtipo Fixo/Variável) | ❌ Não (cálculo derivado) |
| **G15 — Resumo Executivo** | Consolidação dos demais | ❌ Não (derivado) |

**Conclusão:** **nenhuma tabela nova** no banco. Todos os relatórios são **consultas + cálculos derivados** sobre dados que o sistema já produz.

**Única exceção possível:** se você quiser **histórico de indicadores** (ex: guardar o ROE de cada mês para comparação), seria uma tabela `indicadores_snapshot`. **Não recomendo** na fase 1 — pode ser calculado on-the-fly a partir dos lançamentos. Se a performance exigir, entra como pendência.

---

## 6. Numeração do bloco 3 — duas opções

### Opção A — Aditiva (não renumera os existentes)

Os 9 relatórios atuais **permanecem** em 3.1–3.9. Os novos entram como **3.10–3.16**. Simulações **continua 3.9**. **Nada renumerado.**

| Número | Item | Status |
| :--- | :--- | :--- |
| 3.1 | DRE Gerencial | Atual |
| 3.2 | DRE por Centro de Custo | Atual |
| 3.3 | Resumo por Área | Atual |
| 3.4 | Fluxo de Caixa Projetado | Atual |
| 3.5 | Análise de Custos | Atual |
| 3.6 | Margem por Cliente/Produto | Atual |
| 3.7 | Exportação | Atual |
| 3.8 | Posição de Caixa | Atual |
| 3.9 | Simulações (fase 2) | Atual |
| **3.10** | **Balanço Patrimonial (G8)** | **Novo** |
| **3.11** | **Painel Executivo (G9)** | **Novo** |
| **3.12** | **Aging de Contas (G10)** | **Novo** |
| **3.13** | **Posição de Impostos (G11)** | **Novo** |
| **3.14** | **Posição de Pessoal (G12)** | **Novo** |
| **3.15** | **Posição de Ativos (G13)** | **Novo** |
| **3.16** | **Ponto de Equilíbrio (G14)** | **Novo** |
| **3.17** | **Resumo Executivo (G15)** | **Novo** |

**Vantagem:** nada renumerado; referências cruzadas em `03`, `09`, `11`, `12` **continuam válidas**. Merge mais simples.
**Desvantagem:** o Painel Executivo (que é o que o administrador abre primeiro) fica em **3.11**, não em **3.1**. Solução: o **atalho da Tela Inicial (1.0)** para o Administrador **aponta** direto para 3.11; a numeração do menu não precisa mudar. Ou: a Tela Inicial **incorpora** os KPIs do Painel Executivo para o Administrador (ver FA abaixo).

### Opção B — Reorganizada (renumera o bloco 3)

O bloco 3 é **reorganizado** em três camadas (Painel → Posição → Análise), e os 8 novos entram no lugar certo. **Tudo renumerado.**

| Número | Item | Status |
| :--- | :--- | :--- |
| **3.1** | **Painel Executivo (G9)** | **Novo** |
| 3.2 | DRE Gerencial | Atual (era 3.1) |
| **3.3** | **Balanço Patrimonial (G8)** | **Novo** |
| 3.4 | Fluxo de Caixa Projetado | Atual (era 3.4) |
| **3.5** | **Aging de Contas (G10)** | **Novo** |
| **3.6** | **Posição de Impostos (G11)** | **Novo** |
| **3.7** | **Posição de Pessoal (G12)** | **Novo** |
| **3.8** | **Posição de Ativos (G13)** | **Novo** |
| 3.9 | Posição de Caixa | Atual (era 3.8) |
| 3.10 | DRE por Centro de Custo | Atual (era 3.2) |
| 3.11 | Resumo por Área | Atual (era 3.3) |
| 3.12 | Análise de Custos | Atual (era 3.5) |
| 3.13 | Margem por Cliente/Produto | Atual (era 3.6) |
| **3.14** | **Ponto de Equilíbrio (G14)** | **Novo** |
| **3.15** | **Resumo Executivo (G15)** | **Novo** |
| 3.16 | Exportação | Atual (era 3.7) |
| 3.17 | Simulações (fase 2) | Atual (era 3.9) |

**Vantagem:** o Painel Executivo vira **3.1** (o que o administrador abre primeiro). A ordem do menu faz **sentido narrativo** (Painel → Posição → Resultado → Análise → Exportação).
**Desvantagem:** renumera **9 itens**; todas as referências cruzadas (em `03`, `09`, `11`, `12`) precisam ser atualizadas. Merge mais trabalhoso.

### Recomendação

**Opção A** para o merge (menor risco, menor retrabalho). A "ordem narrativa" pode ser obtida **sem renumerar**:

- A **Tela Inicial (1.0)** do Administrador **incorpora** os KPIs do Painel Executivo (G9) — ver "FA — Tela Inicial do Administrador" abaixo.
- O **menu lateral** pode **ordenar** os itens por narrativa (Painel primeiro) **sem** mudar o número. O número é auxiliar; a **ordem visual** é decisão do menu.

**FA — Tela Inicial do Administrador (opcional):** em vez de criar um item 3.1 novo, a Tela Inicial do Administrador (1.0) **ganha** os KPIs do Painel Executivo (G9), e o Painel Executivo vira o **detalhamento** (3.11). Assim o administrador abre o sistema e já vê o painel. **Isso não muda a numeração da Tela Inicial (1.0).**

**Decisão final:** fica **a seu critério**. Se quiser simplicidade → **Opção A**. Se quiser narrativa → **Opção B**. O `13` registra as duas; o merge escolhe **uma**.

---

## 7. Impacto nos 13 documentos existentes

**Nada muda agora.** Quando o merge for aprovado, os seguintes documentos sobem **uma versão** cada:

| Documento | Versão atual | O que muda no merge | Nova versão |
| :--- | :--- | :--- | :--- |
| `00_indice.md` | 1.5 | +1 documento (`13`); +8 linhas no mapa assunto → documento | 1.6 |
| `01_visao_geral.md` | 1.0 | Nada (relatórios são detalhamento) | 1.0 |
| `02_regras_transversais.md` | 1.1 | Nada | 1.1 |
| `03_casos_de_uso.md` | 2.3 | +8 casos de uso (G8–G15); +1 linha na tabela 2.5 (ordens); +8 linhas na tabela 2.6 (menu) | 2.4 |
| `04_modelo_de_dados.md` | 1.3 | Nada (sem tabela nova) | 1.3 |
| `05_apendices.md` | 1.0 | Nada | 1.0 |
| `06_pendencias.md` | 1.4 | +1 pendência ("orçamento vs. realizado" vira item formal; "histórico de indicadores" vira item) | 1.5 |
| `07_atores_fluxo.md` | 1.1 | Nada | 1.1 |
| `08_ordens.md` | 1.0 | Nada (relatórios não emitem ordens) | 1.0 |
| `09_menu_numeracao.md` | 1.1 | Bloco 3 renumerado (Opção A: +8 itens 3.10–3.17; Opção B: renumeração completa) | 1.2 |
| `10_modelo_dados_fisico.md` | 1.0 | Nada (sem tabela nova) | 1.0 |
| `11_wireframe.md` | 1.1 | +8 telas no roteiro de demonstração (seção 10); +8 itens em "o que está implementado" (seção 7) | 1.2 |
| `12_tela_inicial.md` | 1.0 | +KPIs do Painel Executivo (G9) para o Administrador (se adotar a FA); +alertas | 1.1 |
| `13_relatorios_administrador.md` | 1.0 (proposta) | Vira `status: aprovado`; referência a "merge feito" | 1.1 |

**Regra:** cada documento que sobe versão registra no **histórico de versões** a linha **"merge do `13` (v1.0)"**. Rastreabilidade preservada.

---

## 8. Pendências geradas

As seguintes pendências **novas** entram no `06_pendencias.md` (fase 2 ou avaliação futura) **no merge**:

| # | Pendência | Fase | Motivo |
| :--- | :--- | :--- | :--- |
| 31 | **Orçamento vs. realizado** | Fase 2 | Módulo de orçamento/metas não existe. G9/G15 poderiam comparar, mas depende de módulo novo. |
| 32 | **Histórico de indicadores** | Fase 2 | Guardar snapshot mensal de KPIs (ROE, ROA, liquidez) para comparação histórica. Hoje pode ser on-the-fly. |
| 33 | **Alertas proativos configuráveis** | Fase 2 | Regras tipo "inadimplência > 10%", "caixa negativo em 15 dias". Fase 1 tem regras padrão. |
| 34 | **Consolidação multiempresa** | Fase 2 | Já existia no `06` como "múltiplas empresas"; reforçar que o Balanço e o Painel precisam consolidar. |
| 35 | **Faixas de aging configuráveis** | Fase 2 | Hoje as faixas são fixas (a vencer, 1–30, 31–60, 61–90, >90). Configuráveis é fase 2. |
| 36 | **Customização do Resumo Executivo** | Fase 2 | Escolher quais destaques/riscos aparecem. Fase 1 tem padrão. |

**Nota:** a pendência **17** do `06` ("Rateio de despesas fixas — margem líquida") já cobre parte do que o G6/G9 precisam. Não duplicar.

---

## 9. Próximos passos (pós-merge)

Sugestões de evolução **depois** que o merge estiver feito:

1. **`agente-administrador.md`** — agente que responde perguntas do administrador sobre a empresa, consultando os relatórios G1–G15. **Não criar agora** (é fase 2, pós-merge).
2. **`referencias/relatorios.md`** — referência do módulo de relatórios para o Skill `gestor-gerencial`, com o catálogo G1–G15. **Só depois do merge.**
3. **Atualizar o `manual.md`** (não está na pasta, mas é citado no `00`): adicionar as telas novas na seção de relatórios. **Só depois do merge.**
4. **Atualizar o `11_wireframe.md`** (seção 7 e 10) com as 8 telas novas. **No merge (v1.2).**
5. **Atualizar a Tela Inicial do Administrador** (`12`) com os KPIs do Painel Executivo (se adotar a FA). **No merge (v1.1).**

---

## 10. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-25 | Criação do documento (proposta). 8 relatórios novos (G8–G15), matriz de rastreabilidade, duas opções de numeração (A aditiva, B reorganizada), impacto nos 13 documentos, 6 pendências novas. **Não altera** os 13 documentos existentes até o merge. |
| 1.1 | 2026-10-25 | Aprovado e integrado. Merge mínimo aplicado em 00, 03, 06, 09, 12. Opção A (aditiva: G8–G15 = 3.10–3.17). FA adotada (Tela Inicial do Administrador ganha os KPIs do Painel Executivo). 6 pendências (31–36) registradas no 06. |
| 1.2 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: G8–G15 por empresa; consolidação entre empresas é fase 2 (pendências 15 e 34). Nenhuma alteração estrutural. |