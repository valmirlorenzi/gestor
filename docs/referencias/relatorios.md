---
modulo: relatorios
casos: [G1, G2, G3, G4, G5, G6, G7, G8, G9, G10, G11, G12, G13, G14, G15]
versao: 1.1
data: 2026-10-25
depende_de: [02_regras_transversais, 03_casos_de_uso, 04_modelo_de_dados, 05_apendices, 08_ordens, 09_menu_numeracao, 11_wireframe, 12_tela_inicial, 13_relatorios_administrador]
---

# Módulo G — Relatórios

> **Números de menu:**
> - **Bloco original (G1–G7):** G1 → 3.1 · G2 → 3.2 · G3 → 3.3 · G4 → 3.4 · G5 → 3.5 · G6 → 3.6 · G7 → 3.7
> - **Bloco novo (G8–G15):** G8 → 3.10 · G9 → 3.11 · G10 → 3.12 · G11 → 3.13 · G12 → 3.14 · G13 → 3.15 · G14 → 3.16 · G15 → 3.17
> - **Tela Inicial:** F6 → 1.0

> **Regras transversais:** `[T5]` (período aberto → dados parciais), `[T6]` (pendências → relatório pode estar incompleto), `[T7]` (posição de impostos é gerencial).
> **Ordens relacionadas:** nenhuma ordem direta (relatórios são consulta).

---

## 1. Quando carregar cada relatório

| Pergunta do usuário | Relatório(s) |
| :--- | :--- |
| "Como está a empresa?" | G9 (Painel) + G15 (Resumo Executivo) |
| "Qual o resultado do mês?" | G1 (DRE) |
| "Qual área dá mais lucro?" | G2 (DRE por Centro) + G3 (Resumo por Área) |
| "Tenho caixa para os próximos meses?" | G4 (Fluxo) + G8 (Balanço) |
| "Onde estou gastando mais?" | G5 (Análise de Custos) |
| "Qual cliente/produto dá mais margem?" | G6 (Margem) |
| "Qual a posição patrimonial?" | G8 (Balanço) |
| "Qual o diagnóstico?" | G9 (Painel) |
| "Quanto tenho a receber atrasado?" | G10 (Aging) |
| "Quanto devo de imposto?" | G11 (Posição de Impostos) |
| "Quanto custa o pessoal?" | G12 (Posição de Pessoal) |
| "Quanto valem os ativos?" | G13 (Posição de Ativos) |
| "Até quanto posso cair sem prejuízo?" | G14 (Ponto de Equilíbrio) |
| "Me dá um resumo de 1 página" | G15 (Resumo Executivo) |
| "Como está o caixa agora?" | F4 (Posição de Caixa) |

---

## 2. Catálogo (G1–G7 — original)

### G1 — DRE gerencial

**Menu:** 3.1
**Estrutura:** Receita Bruta − Deduções = Receita Líquida; − Custos = Lucro Bruto; − Despesas Operacionais = Lucro Operacional; +/− Resultado Financeiro = Lucro antes do IR/CSLL; − IR/CSLL (estimativa) = Lucro Líquido. Análise vertical e horizontal (fase 1). Drill-down. DRE parcial (com aviso). Exportação.
**Fase 2:** orçado vs. realizado, consolidado multiempresa.
**RNs (1–11):** ver `03_casos_de_uso.md#G1`.

### G2 — DRE por centro de custo

**Menu:** 3.2
Mesma estrutura, segmentada. "Não alocado". Rateio (fase 1: percentual fixo; fase 2: critérios avançados). Agrupamento por área de negócio (fase 1). Drill-down.
**RNs (1–11):** ver `03_casos_de_uso.md#G2`.

### G3 — Resumo por área

**Menu:** 3.3
Cards por área (receita, custos, despesas, resultado, margem, variação). Consolidado. Drill-down para G2. **Dashboard inicial** (configurável). Gráfico comparativo (fase 1).
**RNs (1–11):** ver `03_casos_de_uso.md#G3`.

### G4 — Fluxo de caixa projetado (gerencial)

**Menu:** 3.4
Visão de médio/longo prazo (até 12 meses), granularidade diária/semanal/mensal. Comparação com realizado (fase 1). Inclusão de estimativas. Drill-down. Cenários integrados ao H (fase 2).
**RNs (1–11):** ver `03_casos_de_uso.md#G4`.

### G5 — Análise de custos por fornecedor/categoria

**Menu:** 3.5
Duas visões. Top N (10 padrão). Análise de concentração (fase 1). Evolução temporal (fase 1). Filtros. Drill-down.
**RNs (1–11):** ver `03_casos_de_uso.md#G5`.

### G6 — Margem por cliente/produto

**Menu:** 3.6
Margem de contribuição e margem líquida (se rateio). Custos diretos por produto; despesas variáveis por cliente/produto. Cadastro de produtos/serviços (fase 1). Top N. Clientes/produtos com prejuízo destacados.
**Fase 2:** rateio de despesas fixas, simulação de preço.
**RNs (1–17):** ver `03_casos_de_uso.md#G6`.

### G7 — Exportação de relatórios

**Menu:** 3.7 (botão em cada relatório)
Excel, PDF, CSV. Respeita filtros. Drill-down opcional. Auditoria.
**Fase 2:** agendamento, exportação em lote, exportação para contador.
**RNs (1–10):** ver `03_casos_de_uso.md#G7`.

---

## 3. Catálogo (G8–G15 — novo, merge do `13`)

### G8 — Balanço Patrimonial

**Menu:** 3.10
Ativo (Circulante + Não Circulante), Passivo (Circulante + Não Circulante) e Patrimônio Líquido. Análise vertical (% sobre o Ativo total). Equação patrimonial (Ativo = Passivo + PL) — valida, mas **não bloqueia**. Balanço comparativo (duas datas). Drill-down por conta. Aviso: período aberto → dados parciais.
**RNs (1–8):** ver `03_casos_de_uso.md#G8`.

### G9 — Painel Executivo

**Menu:** 3.11
**15 KPIs em 4 blocos:** Resultado (4), Liquidez (4), Endividamento (3), Rentabilidade e Eficiência (4). Cada card tem: valor, variação vs. período anterior, **semáforo** (verde/amarelo/vermelho), drill-down. **Alertas** no topo (inadimplência, caixa projetado, margem). Fixo na fase 1 (customizável é fase 2).
**RNs (1–8):** ver `03_casos_de_uso.md#G9`.

### G10 — Aging de Contas

**Menu:** 3.12
**Contas a receber:** a vencer, 1–30, 31–60, 61–90, > 90 dias. **Contas a pagar:** a vencer (30d), vencidas 1–30, 31–60, > 60. Indicadores: inadimplência %, PMR, PMP, concentração (top 5). Drill-down por faixa. Faixas configuráveis (fase 2).
**RNs (1–8):** ver `03_casos_de_uso.md#G10`.

### G11 — Posição de Impostos

**Menu:** 3.13
Por tipo (ICMS, PIS, COFINS, ISS, IPI, INSS, FGTS, IRRF, IBS, CBS): débitos, créditos, saldo. Indicadores: carga tributária efetiva, saldo devedor total, saldo credor total. Evolução mensal. Drill-down por documento. **Aviso:** gerencial, não substitui apuração fiscal.
**RNs (1–7):** ver `03_casos_de_uso.md#G11`.

### G12 — Posição de Pessoal

**Menu:** 3.14
Custo total (bruto + encargos + provisões). Peso sobre a receita. Provisões acumuladas (passivo oculto). Headcount. Custo médio por funcionário. Custo por área. Evolução mensal. Drill-down por área.
**RNs (1–9):** ver `03_casos_de_uso.md#G12`.

### G13 — Posição de Ativos

**Menu:** 3.15
Por ativo: valor original, depreciação acumulada, **valor contábil líquido**, depreciação do período, vida útil remanescente, status (em uso, ocioso, alienado). Indicadores: total do imobilizado, depreciação acumulada, depreciação do período, projeção de 12 meses. Drill-down por ativo.
**RNs (1–7):** ver `03_casos_de_uso.md#G13`.

### G14 — Ponto de Equilíbrio

**Menu:** 3.16
Custos fixos e variáveis. Margem de contribuição (R$ e %). **PE contábil** = custos fixos / margem de contribuição %. **PE financeiro** = (custos fixos − depreciação) / margem de contribuição %. **Margem de segurança** = (receita − PE) / receita. Gráfico receita × custos. Margem negativa bloqueia o cálculo (com alerta).
**RNs (1–8):** ver `03_casos_de_uso.md#G14`.

### G15 — Resumo Executivo

**Menu:** 3.17
**1 página:** destaques do período (com variação), **top 3 riscos** (com severidade), **top 3 oportunidades**, **ações sugeridas**. Drill-down para o relatório detalhado. Regras de risco/oportunidade configuráveis (fase 2; fase 1 padrão). Exportação em PDF é o formato natural.
**RNs (1–7):** ver `03_casos_de_uso.md#G15`.

---

## 4. Indicadores-chave (fórmulas)

Todos os indicadores do G9. Se a pergunta envolver "como estou?", "estou bem?", "posso investir?", usar esses.

| Indicador | Fórmula | O que significa | Semáforo (padrão) |
| :--- | :--- | :--- | :--- |
| **Margem bruta** | (Receita − CMV) / Receita | Quanto sobra da venda após o custo direto. | > 30% verde; 20–30% amarelo; < 20% vermelho |
| **Margem líquida** | Lucro líquido / Receita | Quanto sobra no fim. | > 10% verde; 5–10% amarelo; < 5% vermelho |
| **Liquidez corrente** | AC / PC | Capacidade de pagar dívida de curto prazo. | > 1,5 verde; 1,0–1,5 amarelo; < 1,0 vermelho |
| **Capital de giro líquido** | AC − PC | Folga financeira de curto prazo. | > 0 verde; ≤ 0 vermelho |
| **Endividamento geral** | Passivo / Ativo | Quanto do ativo é financiado por dívida. | < 40% verde; 40–60% amarelo; > 60% vermelho |
| **Composição do endividamento** | PC / Passivo | Quanto da dívida vence no curto prazo. | < 50% verde; 50–70% amarelo; > 70% vermelho |
| **Grau de alavancagem** | Passivo / PL | Quanto de dívida para cada R$ 1,00 de capital próprio. | < 1,0 verde; 1,0–2,0 amarelo; > 2,0 vermelho |
| **ROE** | Lucro líquido / PL | Retorno para o sócio. | > 15% verde; 10–15% amarelo; < 10% vermelho |
| **ROA** | Lucro líquido / Ativo | Retorno sobre o ativo. | > 8% verde; 4–8% amarelo; < 4% vermelho |
| **Ciclo de caixa** | PMR + PME − PMP | Dias entre pagar fornecedor e receber cliente. | < 30 dias verde; 30–60 amarelo; > 60 vermelho |
| **Inadimplência** | Contas vencidas / Total a receber | % do a receber que está atrasado. | < 5% verde; 5–10% amarelo; > 10% vermelho |
| **Margem de segurança** | (Receita − PE) / Receita | Quanto a receita pode cair sem prejuízo. | > 20% verde; 10–20% amarelo; < 10% vermelho |
| **Carga tributária efetiva** | Impostos sobre vendas / Receita bruta | Peso dos impostos sobre a receita. | depende do setor (referência: 10–20%) |

> **Importante:** as faixas são **padrão**. Cada empresa pode configurar (pendência 33 do `06`). O agente deve usar as faixas padrão quando não houver configuração.

---

## 5. Linguagem de negócio (tradução)

| Número | Linguagem de negócio | Não usar |
| :--- | :--- | :--- |
| DRE | "Resultado do período" / "Lucro" | "Demonstração do Resultado do Exercício" (só na 1ª menção) |
| Balanço | "Posição patrimonial" / "O que a empresa tem e deve" | "Balanço Patrimonial" (só na 1ª menção) |
| AC/PC | "Tem para pagar as contas do dia a dia?" | "Ativo Circulante / Passivo Circulante" |
| ROE | "Retorno para o sócio" | "Return on Equity" |
| ROA | "Retorno sobre o que a empresa tem" | "Return on Assets" |
| Ciclo de caixa | "Quantos dias o dinheiro fica fora" | "Cash Conversion Cycle" |
| Ponto de equilíbrio | "Quanto preciso faturar para não ter prejuízo" | "Break-even point" |
| Aging | "Quanto está atrasado e há quanto tempo" | "Envelhecimento de contas" |
| Provisões | "Dinheiro que já é dos funcionários mas ainda não saiu" | "Passivo oculto" (só na 1ª menção) |
| Pendência T6 | "Conta a pagar vencida" | "T6 — Erro/Aviso" |
| Período aberto | "Mês em andamento (pode mudar)" | "Período não fechado" |
| Override | "Ajuste manual do cálculo" | "Override" |

---

## 6. Template de saída (para o agente-administrador)

Toda resposta do agente-administrador (que usa esta referência) deve seguir este template:

```
[1–3 frases com o número principal + interpretação]

**Comparação:** [vs. período anterior / meta / setor]

**Pontos de atenção:** [2–3 riscos]

**Ações sugeridas:** [2–3 ações, com o "porquê"]

**Próximas perguntas:** [2–3 sugestões]

**Fonte:** [relatório, período, filial]

**Aviso:** [se aplicável: dado parcial, pendência, cálculo gerencial]
```

---

## 7. Drill-down

| Relatório | Drill-down | Como acessar |
| :--- | :--- | :--- |
| G1 (DRE) | Linha → lançamentos | Clique na linha. |
| G2 (DRE por Centro) | Centro → linhas | Clique no centro. |
| G3 (Resumo por Área) | Área → G2 | Clique na área. |
| G4 (Fluxo) | Período → detalhes | Clique no período. |
| G5 (Custos) | Fornecedor/categoria → documentos | Clique no fornecedor/categoria. |
| G6 (Margem) | Cliente/produto → documentos | Clique no cliente/produto. |
| G8 (Balanço) | Conta → lançamentos | Clique na conta. |
| G10 (Aging) | Faixa → contas | Clique na faixa. |
| G11 (Impostos) | Tipo → documentos | Clique no tipo. |
| G12 (Pessoal) | Área → funcionários | Clique na área. |
| G13 (Ativos) | Ativo → histórico de depreciação | Clique no ativo. |
| G14 (PE) | — | (Simulação é fase 2) |
| G15 (Resumo) | Destaque/risco → relatório detalhado | Clique no item. |
| G9 (Painel) | KPI → relatório detalhado | Clique no card. |

---

## 8. Comparações

| Comparação | O que comparar | Quando |
| :--- | :--- | :--- |
| **Período anterior** | Mês atual vs. mês anterior (ou trimestre, ano) | Sempre que possível. |
| **Mesmo período do ano anterior** | Out/2026 vs. out/2025 | Para eliminar sazonalidade. |
| **Meta/orçamento** | Realizado vs. planejado | Fase 2 (orçamento é módulo). |
| **Filial** | Filial A vs. filial B | Quando houver múltiplas filiais. |
| **Setor** | Empresa vs. benchmark do setor | Fase 2 (benchmark externo). |

---

## 9. Avisos obrigatórios

- **Período aberto (`[T5]`):** "Dados parciais — o período não foi fechado; os números podem mudar até o fechamento."
- **Pendência Erro (`[T6]`):** "Há N pendência(s) de Erro no período; o relatório pode estar incompleto. Verifique o Relatório de Pendências (4.9)."
- **Cálculo fiscal:** "O cálculo fiscal deste sistema é apenas para referência gerencial e simulação de decisões, não constituindo base para declaração fiscal. Consulte um contador para obrigações fiscais reais."
- **Posição de impostos (`[T7]`):** "Este relatório é gerencial; não substitui apuração fiscal."
- **Pendência Aviso:** "Há N aviso(s) no período; não bloqueia o fechamento, mas merece atenção."

---

## 10. Limitações

- **Fase 1:** sem simulação (H, fase 2).
- **Fase 1:** sem benchmark externo.
- **Fase 1:** sem orçamento/metas (pendência 31).
- **Fase 1:** sem consolidação multiempresa (pendência 34).
- **Fase 1:** sem histórico de indicadores (pendência 32).
- **Fase 1:** sem alertas proativos configuráveis (pendência 33).
- **Fase 1:** sem faixas de aging configuráveis (pendência 35).
- **Fase 1:** sem customização do Resumo Executivo (pendência 36).
- **Fase 1:** drill-down de G1–G6 é por linha/documento; de G8–G13 é por conta/faixa/tipo/área/ativo; G14 não tem drill-down (é simulação); G15 tem drill-down para o relatório detalhado.
- **Fase 1:** o **Resumo Executivo (G15)** não substitui os relatórios detalhados (é resumo, não análise).

---

## 11. Telas do wireframe

- **Bloco original (G1–G7):**
  - `screens['dre']` (3.1)
  - `screens['dre-centro']` (3.2)
  - `screens['resumo-area']` (3.3)
  - `screens['fluxo-caixa']` (3.4)
  - `screens['analise-custos']` (3.5)
  - `screens['margem']` (3.6)
  - `exportarRelatorio()` (3.7 — função usada em cada tela)
  - `screens['posicao-caixa']` (3.8 — F4)
  - `screens['simulacoes']` (3.9 — fase 2)
- **Bloco novo (G8–G15):**
  - `screens['balanco']` (3.10)
  - `screens['painel-executivo']` (3.11)
  - `screens['aging-contas']` (3.12)
  - `screens['posicao-impostos']` (3.13)
  - `screens['posicao-pessoal']` (3.14)
  - `screens['posicao-ativos']` (3.15)
  - `screens['ponto-equilibrio']` (3.16)
  - `screens['resumo-executivo']` (3.17)
- **Tela Inicial:**
  - `screens['tela-inicial']` (1.0) — Administrador vê resumo do Painel Executivo.

---

## 12. Resumo das ordens relacionadas

Nenhuma ordem direta. Relatórios são consulta e não geram ordens.

---

## 13. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-24 | Criação do documento. Cobre G1–G7 (relatórios originais do Administrador). |
| 1.1 | 2026-10-25 | **Merge do `13` (v1.1).** Inclusão de G8–G15 no catálogo. Adição de: tabela "quando carregar", tabela de indicadores-chave (13 fórmulas + semáforo), tradução "contábil → negócio", template de saída, drill-down por relatório, comparações, avisos obrigatórios, telas do wireframe atualizadas, limitações, histórico. |