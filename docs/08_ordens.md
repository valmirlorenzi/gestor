---
documento: ordens
versao: 1.1
data: 2026-10-28
proposito: Catálogo de 32 ordens (O1–O32), mapeamentos, ações, transições e dados_extras + nota de multi-empresa (tenant)
depende_de: [02_regras_transversais, 03_casos_de_uso, 04_modelo_de_dados, 07_atores_fluxo]
---

> **Multi-empresa (tenant):** a regra R1–R3 (`01_visao_geral.md`, seção 8; `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)") se aplica a este documento. A tabela `tarefa` (que registra as ordens) é do **grupo F** (tem `id_filial`, herda empresa via `filial`) e **não** tem `id_empresa` (R3). O escopo de empresa é aplicado pelo repositório via JOIN com `filiais` (R2). A caixa de entrada/saída (`vw_caixa_entrada`, `10_modelo_dados_fisico.md`) não filtra por empresa — o filtro é responsabilidade do repositório (pendência 42 em `06_pendencias.md`).

---

# Ordens do Sistema

> **Conceito central:** a **ordem** é o documento que materializa a tarefa. Tudo que precisa ser feito chega à caixa de entrada do ator como uma ordem. A ordem carrega: quem a emitiu (ator de origem), quando, o que fazer, para quem vai, e o documento de origem (quando aplicável). É o "papel assinado" do T8.
>
> **Princípio:** não há tarefa fora da caixa de entrada. Não há agenda, calendário, lista de afazeres ou notificação separada. A caixa de entrada é a **fila única de trabalho**.

---

## Sumário

1. [Conceito de ordem](#1-conceito-de-ordem)
2. [Estrutura de uma ordem](#2-estrutura-de-uma-ordem)
3. [Catálogo de ordens](#3-catálogo-de-ordens)
4. [Mapeamento ordem → caso de uso](#4-mapeamento-ordem--caso-de-uso)
5. [Mapeamento caso de uso → ordem](#5-mapeamento-caso-de-uso--ordem)
6. [Mapeamento ator → ordens](#6-mapeamento-ator--ordens)
7. [Fluxo de estados](#7-fluxo-de-estados)
8. [Ações por ordem](#8-ações-por-ordem)
9. [Transições por ordem](#9-transições-por-ordem)
10. [Filtros da caixa de entrada por ator](#10-filtros-da-caixa-de-entrada-por-ator)
11. [Regras gerais](#11-regras-gerais)
12. [Pendências e ordens](#12-pendências-e-ordens)
13. [Histórico de versões](#13-histórico-de-versões)
14. [Apêndice A — `dados_extras` por ordem](#apêndice-a--dados_extras-por-ordem)
15. [Apêndice B — Diagrama de fluxo de ordens](#apêndice-b--diagrama-de-fluxo-de-ordens)
16. [Apêndice C — Próximos passos](#apêndice-c--próximos-passos)
17. [Apêndice D — Proposta de agente: `agente-ordens.md`](#apêndice-d--proposta-de-agente-agente-ordensmd)
18. [Apêndice E — Proposta de referência: `referencias/ordens.md`](#apêndice-e--proposta-de-referência-referenciasordensmd)

---

## 1. Conceito de ordem

**Ordem** é o documento que materializa uma tarefa no sistema. Tudo que precisa ser feito chega à caixa de entrada do ator como uma ordem. A ordem carrega:

- **Quem a emitiu** (ator de origem).
- **Quando** (data de criação).
- **O que fazer** (tipo de ordem).
- **Para quem vai** (ator de destino).
- **O documento de origem** (NF-e, conta, folha, período, parâmetro).

É o "papel assinado" do T8: cada ator **assina** a sua ordem e **gera uma nova ordem** para o próximo setor. A ordem é a unidade de trabalho da caixa de entrada.

**Princípio:** não há tarefa fora da caixa de entrada. Não há agenda, calendário, lista de afazeres ou notificação separada. A caixa de entrada é a **fila única de trabalho**.

---

## 2. Estrutura de uma ordem

Baseada na tabela `tarefa` (`07_atores_fluxo.md`, seção 8.1), com os campos específicos por tipo.

### 2.1. Campos base (todos os tipos)

| Campo | Tipo | Obrigatório | Observações |
| :--- | :--- | :--- | :--- |
| `id` | int | Sim | PK. |
| `id_filial` | int | Sim | FK → filial. |
| `tipo_ordem` | varchar(40) | Sim | Código do tipo (ver seção 3). |
| `id_documento` | int | Sim | FK → documento de origem. |
| `tipo_documento` | varchar(20) | Sim | NF-e, NFS-e, CT-e, RPA, conta_pagar, conta_receber, folha, período, parâmetro, lançamento. |
| `id_ator_origem` | int | Sim | FK → ator_funcional. |
| `id_ator_destino` | int | Sim | FK → ator_funcional. |
| `status` | varchar(20) | Sim | pendente, em_andamento, concluida, cancelada. |
| `urgente` | boolean | Não | Marcação do ator (T8.6). |
| `data_criacao` | timestamp | Sim | Quando foi emitida. |
| `data_conclusao` | timestamp | Não | Quando foi concluída. |
| `id_ordem_anterior` | int | Não | FK → tarefa (para reabertura/reclassificação). |
| `dados_extras` | json | Não | Específicos por tipo (ver seção 3 e Apêndice A). |

### 2.2. Campos derivados (para a caixa de entrada)

| Campo | Como é calculado |
| :--- | :--- |
| `descricao_resumida` | Texto curto gerado a partir do tipo + documento (ex: "Conferir NF-e 1234 do fornecedor ABC"). |
| `documento_resumo` | Chave/número do documento, contraparte, valor. |
| `prazo` | Calculado a partir do tipo + data de criação (fase 2). |
| `prioridade` | Derivada de `urgente` + tipo (ex: fechamento > pagamento > conferência). |

---

## 3. Catálogo de ordens

Organizado por **momento do fluxo**. Cada ordem tem: código, tipo, quem emite, quem executa, documento de origem, o que carrega (em linguagem natural — o contrato de dados está no Apêndice A), o que o destino faz, processamento, próxima ordem, caso de uso, handoff.

### 3.1. Ordens de entrada de documentos

#### O1 — Conferir NF-e de entrada

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_nfe_entrada` |
| **Quem emite** | Sistema (ao importar/digitar a NF-e de entrada) |
| **Quem executa** | Comprador |
| **Documento de origem** | NF-e de entrada (`nota_fiscal`) |
| **O que carrega** | Chave, fornecedor, valor total, itens, status da importação, pendências (T6). |
| **O que o destino faz** | Revisar itens, confirmar/alterar classificação (D3), resolver pendências, confirmar a entrada. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O10 (validar lançamento — Contador), O15 (gerar conta a pagar — Financeiro1), O29 (registrar custo de produto — automático). |
| **Caso de uso** | C1 |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O2 — Conferir NF-e de saída

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_nfe_saida` |
| **Quem emite** | Sistema (ao importar/digitar a NF-e de saída) |
| **Quem executa** | Faturista |
| **Documento de origem** | NF-e de saída (`nota_fiscal`) |
| **O que carrega** | Chave, cliente, valor total, itens, status da importação, pendências (T6). |
| **O que o destino faz** | Revisar itens, confirmar/alterar classificação (D3), resolver pendências, confirmar a saída. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O10 (validar lançamento — Contador), O16 (gerar conta a receber — Financeiro2). |
| **Caso de uso** | C1 |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O3 — Conferir NFS-e tomada / CT-e tomado / RPA

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_servico_tomado` |
| **Quem emite** | Sistema (ao importar/digitar NFS-e tomada, CT-e tomado ou RPA) |
| **Quem executa** | Comprador |
| **Documento de origem** | NFS-e tomada / CT-e tomado / RPA (`nota_fiscal`) |
| **O que carrega** | Chave, prestador/transportador/autônomo, valor, retenções, itens, pendências. |
| **O que o destino faz** | Revisar, confirmar/alterar classificação (D3), resolver pendências. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O10 (validar lançamento — Contador), O15 (gerar conta a pagar — Financeiro1). |
| **Caso de uso** | C2 (NFS-e), C3 (CT-e), C8 (RPA) |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O4 — Conferir NFS-e prestada / CT-e emitido

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_servico_prestado` |
| **Quem emite** | Sistema |
| **Quem executa** | Faturista |
| **Documento de origem** | NFS-e prestada / CT-e emitido |
| **O que carrega** | Chave, tomador, valor, retenções, itens, pendências. |
| **O que o destino faz** | Revisar, confirmar/alterar classificação (D3), resolver pendências. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O10 (validar lançamento — Contador), O16 (gerar conta a receber — Financeiro2). |
| **Caso de uso** | C2 (NFS-e), C3 (CT-e) |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O5 — Conferir documento manual

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_documento_manual` |
| **Quem emite** | Sistema (ao digitar um documento manual) |
| **Quem executa** | Comprador (entrada) ou Faturista (saída) |
| **Documento de origem** | Documento manual (`nota_fiscal`) |
| **O que carrega** | Tipo, dados digitados, pendências. |
| **O que o destino faz** | Revisar, confirmar/alterar classificação, resolver pendências. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Conforme a direção: O10 + O15 (entrada) ou O10 + O16 (saída). |
| **Caso de uso** | C5 |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O6 — Conferir folha de pagamento

| Campo | Valor |
| :--- | :--- |
| **Código** | `conferir_folha` |
| **Quem emite** | Sistema (ao importar/digitar a folha) |
| **Quem executa** | RH |
| **Documento de origem** | Folha (`folha_pagamento`) |
| **O que carrega** | Funcionários, valores reais vs. calculados, pendências. |
| **O que o destino faz** | Revisar, override se necessário, confirmar a folha. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O12 (validar folha — Contador), O21 (pagar folha — Financeiro1). |
| **Caso de uso** | C6 (importar), C7 (digitar) |
| **Handoff** | T8.1, T8.2, T8.11 |

### 3.2. Ordens de classificação e revisão

#### O7 — Revisar classificação (D3)

| Campo | Valor |
| :--- | :--- |
| **Código** | `revisar_classificacao` |
| **Quem emite** | Sistema (quando o motor D1 gera sugestão de confiança baixa, conflito ou fallback) |
| **Quem executa** | Comprador / Faturista / Contador (conforme o documento) |
| **Documento de origem** | Lançamento (`lancamento`) ou documento (`nota_fiscal`) |
| **O que carrega** | Lançamento(s) pendente(s), sugestão do motor, justificativa (D2), status da classificação. |
| **O que o destino faz** | Aceitar, alterar ou rejeitar a sugestão; criar regra (D4) se alterar. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Lançamento classificado; se era o último pendente, o documento avança (O10). |
| **Caso de uso** | D1, D2, D3, D4 |
| **Handoff** | T8.1, T8.2 |

#### O8 — Resolver conflito de regras

| Campo | Valor |
| :--- | :--- |
| **Código** | `resolver_conflito_regra` |
| **Quem emite** | Sistema (quando duas regras de mesma prioridade apontam para contas diferentes — D1, FA3) |
| **Quem executa** | Contador (ou Comprador/Faturista, se tiver permissão) |
| **Documento de origem** | Lançamento (`lancamento`) |
| **O que carrega** | As regras em conflito, o "porquê" de cada uma, o contexto. |
| **O que o destino faz** | Escolher qual regra aplicar; se necessário, ajustar prioridade (D5). |
| **Processamento** | Com ator. |
| **Próxima ordem** | Lançamento classificado. |
| **Caso de uso** | D1 (FA3), D3 (FA3), D5 |
| **Handoff** | T8.1, T8.2 |

#### O9 — Resolver pendência de dados faltantes

| Campo | Valor |
| :--- | :--- |
| **Código** | `resolver_pendencia_dados` |
| **Quem emite** | Sistema (quando a importação gera pendência de dados críticos ou não críticos — T6) |
| **Quem executa** | Comprador / Faturista / RH (conforme o documento) |
| **Documento de origem** | Documento (`nota_fiscal`, `folha_pagamento`, `rpa`) |
| **O que carrega** | Descrição da pendência, categoria (Erro/Aviso), dados faltantes, documento de origem. |
| **O que o destino faz** | Completar os dados; se Erro, resolve antes do fechamento; se Aviso, confirma ou resolve. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Pendência resolvida; documento avança. |
| **Caso de uso** | C1–C8 (exceções), T6 |
| **Handoff** | T6, T8.1 |

### 3.3. Ordens de validação contábil/fiscal

#### O10 — Validar lançamento contábil

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_lancamento_contabil` |
| **Quem emite** | Sistema (após a conferência do documento pelo Comprador/Faturista) |
| **Quem executa** | Contador |
| **Documento de origem** | Documento (`nota_fiscal`) + lançamentos (`lancamento`) |
| **O que carrega** | Documento, lançamentos gerados, classificação, impostos calculados. |
| **O que o destino faz** | Validar classificação e impostos; reclassificar se necessário (D3); override com justificativa (E1/E2); confirmar. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Lançamento validado; se era o último do documento, avança para o financeiro. |
| **Caso de uso** | D3, E1, E2 |
| **Handoff** | T8.1, T8.2, T8.11 |

#### O11 — Validar cálculo de impostos (override)

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_impostos` |
| **Quem emite** | Sistema (quando há divergência entre o valor do XML e o calculado, ou quando o cálculo não pôde ser feito — E1/E2) |
| **Quem executa** | Contador |
| **Documento de origem** | Documento (`nota_fiscal`) |
| **O que carrega** | Impostos calculados, valores do XML, divergências, pendências. |
| **O que o destino faz** | Aceitar o cálculo ou override (com justificativa); resolver pendências. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Impostos validados; documento avança. |
| **Caso de uso** | E1 (EX4), E2 (EX4) |
| **Handoff** | T7, T8.1 |

#### O12 — Validar cálculo de folha

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_folha` |
| **Quem emite** | Sistema (após a consolidação da folha — E3) |
| **Quem executa** | Contador |
| **Documento de origem** | Folha (`folha_pagamento`) |
| **O que carrega** | Resumo consolidado, encargos, provisões, divergências. |
| **O que o destino faz** | Validar; override com justificativa se necessário. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Folha validada; segue para o Financeiro1 (O21). |
| **Caso de uso** | E3 |
| **Handoff** | T7, T8.1 |

#### O13 — Validar depreciação

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_depreciacao` |
| **Quem emite** | Sistema (após o cálculo da depreciação — E4) |
| **Quem executa** | Contador |
| **Documento de origem** | Depreciação (`depreciacao`) |
| **O que carrega** | Ativos, valores calculados, acumulados, divergências. |
| **O que o destino faz** | Validar; override com justificativa. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Depreciação validada. |
| **Caso de uso** | E4 |
| **Handoff** | T8.1 |

#### O14 — Validar provisões

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_provisoes` |
| **Quem emite** | Sistema (após o cálculo das provisões — E5) |
| **Quem executa** | Contador |
| **Documento de origem** | Provisões (`provisao`) |
| **O que carrega** | Funcionários, valores calculados (férias, 13º, encargos), divergências. |
| **O que o destino faz** | Validar; override com justificativa. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Provisões validadas. |
| **Caso de uso** | E5 |
| **Handoff** | T7, T8.1 |

### 3.4. Ordens financeiras

#### O15 — Gerar conta a pagar

| Campo | Valor |
| :--- | :--- |
| **Código** | `gerar_conta_pagar` |
| **Quem emite** | Sistema (após a validação do documento de compra) |
| **Quem executa** | Financeiro1 |
| **Documento de origem** | Documento de compra (`nota_fiscal`) |
| **O que carrega** | Fornecedor, valor bruto, retenções, valor líquido, forma de pagamento, parcelas, vencimentos. |
| **O que o destino faz** | Conferir as contas geradas; ajustar vencimentos/parcelas se necessário; confirmar. |
| **Processamento** | Automático (o sistema gera as contas) + com ator (o Financeiro1 confere). |
| **Próxima ordem** | Conta a pagar em aberto; aguarda o pagamento (O17). |
| **Caso de uso** | F1 |
| **Handoff** | T8.1, T8.4, T8.11 |

#### O16 — Gerar conta a receber

| Campo | Valor |
| :--- | :--- |
| **Código** | `gerar_conta_receber` |
| **Quem emite** | Sistema (após a validação do documento de venda) |
| **Quem executa** | Financeiro2 |
| **Documento de origem** | Documento de venda (`nota_fiscal`) |
| **O que carrega** | Cliente, valor bruto, retenções sofridas, valor líquido, forma de recebimento, parcelas, vencimentos. |
| **O que o destino faz** | Conferir as contas geradas; ajustar vencimentos/parcelas; confirmar. |
| **Processamento** | Automático + com ator. |
| **Próxima ordem** | Conta a receber em aberto; aguarda o recebimento (O18). |
| **Caso de uso** | F2 |
| **Handoff** | T8.1, T8.4, T8.11 |

#### O17 — Pagar conta a pagar (baixa)

| Campo | Valor |
| :--- | :--- |
| **Código** | `pagar_conta` |
| **Quem emite** | Sistema (quando a conta a pagar está em aberto e o vencimento se aproxima) |
| **Quem executa** | Financeiro1 |
| **Documento de origem** | Conta a pagar (`conta_pagar`) |
| **O que carrega** | Conta, fornecedor, valor, vencimento, saldo. |
| **O que o destino faz** | Registrar a baixa (total/parcial) com juros/multa/desconto; gerar saída de caixa/banco. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O19 (validar saída de caixa/banco) para o Gerente Financeiro. |
| **Caso de uso** | F3 |
| **Handoff** | T8.1, T8.2 |

#### O18 — Receber conta a receber (baixa)

| Campo | Valor |
| :--- | :--- |
| **Código** | `receber_conta` |
| **Quem emite** | Sistema (quando a conta a receber está em aberto e o vencimento se aproxima) |
| **Quem executa** | Financeiro2 |
| **Documento de origem** | Conta a receber (`conta_receber`) |
| **O que carrega** | Conta, cliente, valor, vencimento, saldo. |
| **O que o destino faz** | Registrar a baixa (total/parcial) com juros/multa/desconto; gerar entrada de caixa/banco. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O20 (validar entrada de caixa/banco) para o Gerente Financeiro. |
| **Caso de uso** | F3 |
| **Handoff** | T8.1, T8.2 |

#### O19 — Validar saída de caixa/banco

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_saida_caixa` |
| **Quem emite** | Financeiro1 (ao concluir a baixa — O17) |
| **Quem executa** | Gerente Financeiro |
| **Documento de origem** | Baixa de conta a pagar (`lancamento` de baixa) |
| **O que carrega** | Conta paga, valor, juros/multa/desconto, conta bancária, data. |
| **O que o destino faz** | Validar a saída; confirmar a movimentação. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Saída confirmada; caixa/banco atualizado. |
| **Caso de uso** | F3 |
| **Handoff** | T8.1, T8.2 |

#### O20 — Validar entrada de caixa/banco

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_entrada_caixa` |
| **Quem emite** | Financeiro2 (ao concluir a baixa — O18) |
| **Quem executa** | Gerente Financeiro |
| **Documento de origem** | Baixa de conta a receber (`lancamento` de baixa) |
| **O que carrega** | Conta recebida, valor, juros/multa/desconto, conta bancária, data. |
| **O que o destino faz** | Validar a entrada; confirmar a movimentação. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Entrada confirmada; caixa/banco atualizado. |
| **Caso de uso** | F3 |
| **Handoff** | T8.1, T8.2 |

#### O21 — Pagar folha (agenda)

| Campo | Valor |
| :--- | :--- |
| **Código** | `pagar_folha` |
| **Quem emite** | RH (ao concluir a consolidação — O12 validada) |
| **Quem executa** | Financeiro1 |
| **Documento de origem** | Folha (`folha_pagamento`) |
| **O que carrega** | Funcionários, valores líquidos, encargos, data de pagamento. |
| **O que o destino faz** | Agendar/processar o pagamento; gerar saída de caixa/banco. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O19 (validar saída de caixa/banco). |
| **Caso de uso** | C6, C7, E3 |
| **Handoff** | T8.1, T8.2 |

### 3.5. Ordens de fechamento

#### O22 — Preparar fechamento

| Campo | Valor |
| :--- | :--- |
| **Código** | `preparar_fechamento` |
| **Quem emite** | Sistema (quando o Contador solicita o fechamento) |
| **Quem executa** | Contador |
| **Documento de origem** | Período (`periodo`) |
| **O que carrega** | Checklist de pendências (T6), consolidações pendentes (E3/E4/E5), status do período. |
| **O que o destino faz** | Consolidar folha, depreciação e provisões; resolver pendências (Erros bloqueiam, Avisos exigem confirmação); preparar a consolidação. |
| **Processamento** | Com ator. |
| **Próxima ordem** | O23 (validar fechamento) para o Auditor. |
| **Caso de uso** | A6 |
| **Handoff** | T5, T6, T8.8 |

#### O23 — Validar fechamento

| Campo | Valor |
| :--- | :--- |
| **Código** | `validar_fechamento` |
| **Quem emite** | Contador (ao concluir O22) |
| **Quem executa** | Auditor |
| **Documento de origem** | Período (`periodo`) + consolidação |
| **O que carrega** | Consolidação do fechamento, pendências, cálculos (folha, depreciação, provisões), conformidade. |
| **O que o destino faz** | Validar a consolidação; aprovar ou reprovar; se reprovar, devolver ao Contador com a lista de problemas. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Se aprovado: O24 (fechar período) para o Contador. Se reprovado: devolve ao Contador (nova O22). |
| **Caso de uso** | A6, T8.8 |
| **Handoff** | T5, T6, T8.8 |

#### O24 — Fechar período

| Campo | Valor |
| :--- | :--- |
| **Código** | `fechar_periodo` |
| **Quem emite** | Auditor (ao aprovar O23) |
| **Quem executa** | Contador |
| **Documento de origem** | Período (`periodo`) |
| **O que carrega** | Período, consolidação aprovada, confirmações de Avisos. |
| **O que o destino faz** | Confirmar o fechamento; o sistema congela o período e abre o próximo. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Período fechado; próximo aberto. |
| **Caso de uso** | A6 |
| **Handoff** | T5, T8.8 |

### 3.6. Ordens de auditoria e correção

#### O25 — Apontar problema (auditoria)

| Campo | Valor |
| :--- | :--- |
| **Código** | `apontar_problema` |
| **Quem emite** | Auditor |
| **Quem executa** | Ator competente (Contador, Comprador, Faturista, Financeiro, RH) |
| **Documento de origem** | Documento, lançamento ou período auditado |
| **O que carrega** | Descrição do problema, evidência (log, dados), ator competente, prazo (fase 2). |
| **O que o destino faz** | Analisar; corrigir se procedente; registrar a correção. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Correção registrada; Auditor revalida (nova O23 ou O26). |
| **Caso de uso** | I3, T8.8 |
| **Handoff** | T8.1, T8.8 |

#### O26 — Solicitar correção

| Campo | Valor |
| :--- | :--- |
| **Código** | `solicitar_correcao` |
| **Quem emite** | Auditor |
| **Quem executa** | Ator competente |
| **Documento de origem** | Documento, lançamento ou período |
| **O que carrega** | O que corrigir, por quê, evidência, prazo (fase 2). |
| **O que o destino faz** | Corrigir (com justificativa e auditoria); devolver ao Auditor. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Correção feita; Auditor confirma. |
| **Caso de uso** | I3, T8.8 |
| **Handoff** | T8.1, T8.8 |

#### O27 — Reclassificar lançamento (reabertura)

| Campo | Valor |
| :--- | :--- |
| **Código** | `reclassificar_lancamento` |
| **Quem emite** | Contador (ao identificar erro de classificação) ou Auditor (via O26) |
| **Quem executa** | Contador |
| **Documento de origem** | Lançamento (`lancamento`) |
| **O que carrega** | Lançamento, classificação atual, motivo da reclassificação. |
| **O que o destino faz** | Reclassificar (D3, FA6), com auditoria; criar regra (D4) se aplicável. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Lançamento reclassificado. |
| **Caso de uso** | D3 (FA6), D4 |
| **Handoff** | T5, T8.1 |

#### O28 — Ajustar parâmetros

| Campo | Valor |
| :--- | :--- |
| **Código** | `ajustar_parametros` |
| **Quem emite** | Sistema (quando um parâmetro vence e precisa ser atualizado) ou Contador/RH (manualmente) |
| **Quem executa** | Contador (fiscais) ou RH (trabalhistas) |
| **Documento de origem** | Parâmetro (`parametro_fiscal`, `tabela_inss`, `tabela_irrf`, `tabela_encargos`) |
| **O que carrega** | Parâmetro vencido, vigência, valores atuais. |
| **O que o destino faz** | Atualizar com vigência (I2); validar faixas/alíquotas. |
| **Processamento** | Com ator. |
| **Próxima ordem** | Parâmetro atualizado. |
| **Caso de uso** | I2 |
| **Handoff** | T8.1 |

### 3.7. Ordens automáticas (sem ator de destino humano)

#### O29 — Registrar custo de produto

| Campo | Valor |
| :--- | :--- |
| **Código** | `registrar_custo_produto` |
| **Quem emite** | Sistema (após a conferência da NF-e de entrada) |
| **Quem executa** | Sistema (automático) |
| **Documento de origem** | NF-e de entrada (`nota_fiscal`) |
| **O que carrega** | Itens, custo unitário, método de custo (`empresa.metodo_custo`). |
| **O que o destino faz** | Registrar o custo do produto (XML, Médio ou Manual). |
| **Processamento** | Automático (T8.4). |
| **Próxima ordem** | Nenhuma (é fim de fluxo). |
| **Caso de uso** | G6 (RN16), `04_modelo_de_dados` (custo_unitario / produto_custo) |
| **Handoff** | T8.4, T8.11 |

#### O30 — Registrar razão de impostos

| Campo | Valor |
| :--- | :--- |
| **Código** | `registrar_razao_imposto` |
| **Quem emite** | Sistema (após o cálculo de impostos — E1/E2/E3/E5) |
| **Quem executa** | Sistema (automático) |
| **Documento de origem** | Lançamento de imposto (`lancamento`) |
| **O que carrega** | Tipo de imposto, natureza (crédito/débito), valor, contraparte, documento. |
| **O que o destino faz** | Registrar no razão de impostos (T7). |
| **Processamento** | Automático (T8.4). |
| **Próxima ordem** | Nenhuma (é fim de fluxo). |
| **Caso de uso** | E1, E2, E3, E5, T7 |
| **Handoff** | T7, T8.4, T8.11 |

#### O31 — Gerar pendência

| Campo | Valor |
| :--- | :--- |
| **Código** | `gerar_pendencia` |
| **Quem emite** | Sistema (quando detecta uma pendência T6) |
| **Quem executa** | Sistema (automático, cria a pendência e a ordem correspondente) |
| **Documento de origem** | Documento/lançamento que gerou a pendência |
| **O que carrega** | Categoria (Erro/Aviso), tipo, descrição, referência. |
| **O que o destino faz** | Criar a pendência e a ordem de resolução (O9, O11, etc.) para o ator competente. |
| **Processamento** | Automático (T8.4). |
| **Próxima ordem** | O9 (resolver pendência de dados) ou O11 (validar impostos) ou outra ordem de resolução. |
| **Caso de uso** | T6 |
| **Handoff** | T6, T8.4 |

#### O32 — Consolidar depreciação e provisões

| Campo | Valor |
| :--- | :--- |
| **Código** | `consolidar_depreciacao_provisoes` |
| **Quem emite** | Sistema (mensalmente ou no fechamento) |
| **Quem executa** | Sistema (automático, calcula e lança) |
| **Documento de origem** | Período (`periodo`) |
| **O que carrega** | Ativos, funcionários, parâmetros vigentes. |
| **O que o destino faz** | Calcular e lançar depreciação (E4) e provisões (E5). |
| **Processamento** | Automático (T8.4). |
| **Próxima ordem** | O13 (validar depreciação — Contador), O14 (validar provisões — Contador). |
| **Caso de uso** | E4, E5 |
| **Handoff** | T8.4 |

---

## 4. Mapeamento ordem → caso de uso

| Ordem | Caso de uso principal | Casos secundários |
| :--- | :--- | :--- |
| O1 | C1 | D1–D4, F1, E1 |
| O2 | C1 | D1–D4, F2, E2 |
| O3 | C2, C3, C8 | D1–D4, F1, E1 |
| O4 | C2, C3 | D1–D4, F2, E2 |
| O5 | C5 | D1–D4, F1, F2, E1, E2 |
| O6 | C6, C7 | E3, E5, F1 |
| O7 | D1, D2, D3, D4 | C1–C8 |
| O8 | D1 (FA3), D3 (FA3), D5 | — |
| O9 | T6, C1–C8 (exceções) | — |
| O10 | D3, E1, E2 | C1–C8 |
| O11 | E1 (EX4), E2 (EX4) | — |
| O12 | E3 | C6, C7 |
| O13 | E4 | B4 |
| O14 | E5 | B3 |
| O15 | F1 | C1, C2, C3, C5, C8 |
| O16 | F2 | C1, C2, C3, C5 |
| O17 | F3 | F1 |
| O18 | F3 | F2 |
| O19 | F3 | — |
| O20 | F3 | — |
| O21 | C6, C7, E3 | — |
| O22 | A6 | T6 |
| O23 | A6, T8.8 | — |
| O24 | A6 | T5 |
| O25 | I3, T8.8 | — |
| O26 | I3, T8.8 | — |
| O27 | D3 (FA6), D4 | — |
| O28 | I2 | — |
| O29 | G6 (RN16) | — |
| O30 | E1, E2, E3, E5, T7 | — |
| O31 | T6 | — |
| O32 | E4, E5 | — |

---

## 5. Mapeamento caso de uso → ordem

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| **A1** (Cadastrar empresa) | — | — |
| **A2** (Plano de contas) | — | — |
| **A3** (Centros de custo) | — | — |
| **A4** (Parâmetros) | O28 | — |
| **A5** (Mapeamento referencial) | — | — |
| **A6** (Abrir/fechar período) | O22, O23, O24 | O23, O24 |
| **A8** (Cadastrar filial) | — | — |
| **B1** (Clientes) | — | — |
| **B2** (Fornecedores) | — | — |
| **B3** (Funcionários) | — | — |
| **B4** (Ativos) | — | — |
| **C1** (Importar NF-e) | O1 (entrada), O2 (saída) | — |
| **C2** (Importar NFS-e) | O3 (tomada), O4 (prestada) | — |
| **C3** (Importar CT-e) | O3 (tomado), O4 (emitido) | — |
| **C4** (Lançamento manual) | O7 (se fallback) | — |
| **C5** (Documento manual) | O5 | — |
| **C6** (Importar folha) | O6 | — |
| **C7** (Digitar folha) | O6 | — |
| **C8** (Importar RPA) | O3 | — |
| **D1** (Sugestão) | O7, O8 | — |
| **D2** (Porquê) | — | — |
| **D3** (Revisão) | O7, O27 | O7, O10 |
| **D4** (Aprendizado) | — | — |
| **D5** (Gestão de regras) | — | O8 |
| **E1** (Impostos compras) | O11, O30 | — |
| **E2** (Impostos vendas) | O11, O30 | — |
| **E3** (Folha consolidada) | O12, O30 | — |
| **E4** (Depreciação) | O13 | O32 |
| **E5** (Provisões) | O14, O30 | O32 |
| **F1** (Contas a pagar) | O15 | — |
| **F2** (Contas a receber) | O16 | — |
| **F3** (Baixa) | O17, O18, O19, O20 | — |
| **F4** (Posição de caixa) | — | — |
| **G1–G7** (Relatórios) | — | — |
| **H1–H5** (Simulação) | — | — |
| **I1** (Usuários) | — | — |
| **I2** (Parâmetros) | O28 | O28 |
| **I3** (Auditoria) | O25, O26 | — |
| **I4** (Atores) | — | — |
| **I5** (Handoff) | — | — |
| **T5** (Período) | — | — |
| **T6** (Pendências) | O9, O31 | O9 |
| **T7** (Razão) | O30 | — |
| **T8** (Handoff) | Todas | Todas |

---

## 6. Mapeamento ator → ordens

| Ator | Ordens que **emite** | Ordens que **executa** |
| :--- | :--- | :--- |
| **Configurador** | — | — |
| **Administrador** | — | — |
| **Contador** | O10, O11, O12, O13, O14, O22, O24, O27, O28 | O10, O11, O12, O13, O14, O22, O24, O27, O28 |
| **Comprador** | O1, O3, O5 | O1, O3, O5, O7, O9 |
| **Faturista** | O2, O4, O5 | O2, O4, O5, O7, O9 |
| **Financeiro1** | O17, O19 | O15, O17, O21 |
| **Financeiro2** | O18, O20 | O16, O18 |
| **Gerente Financeiro** | — | O19, O20 |
| **RH** | O6, O21 | O6, O9, O28 |
| **Auditor** | O23, O25, O26 | O23, O25, O26 |
| **Sistema** | O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O22, O28, O29, O30, O31, O32 | O29, O30, O31, O32 |

> 💡 **Nota:** o **Sistema** emite a maioria das ordens, mas o **ator de origem** registrado é sempre quem gerou o documento (Comprador, Faturista, RH, Contador) — T8.11.

---

## 7. Fluxo de estados

```
                    ┌─────────────┐
                    │  pendente   │  ← criada, aguardando o ator
                    └──────┬──────┘
                           │ ator abre
                           ▼
                    ┌─────────────┐
                    │em_andamento │  ← ator começou, mas não terminou
                    └──────┬──────┘
                           │ ator conclui
                           ▼
                    ┌─────────────┐
                    │  concluida  │  ← vai para o histórico
                    └─────────────┘

    Em qualquer estado (exceto concluída):
                           │
                           ▼
                    ┌─────────────┐
                    │  cancelada  │  ← documento cancelado, conta cancelada, etc.
                    └─────────────┘
```

**Regras:**
- `pendente → em_andamento`: quando o ator abre a ordem.
- `em_andamento → concluida`: quando o ator conclui a ação.
- `pendente/em_andamento → cancelada`: quando o documento de origem é cancelado ou a ordem perde o objeto.
- `concluida` e `cancelada` vão para o **histórico** (não aparecem na caixa de entrada).
- **Reabertura:** uma ordem concluída pode gerar uma **nova ordem** (ex: O27 — reclassificar), vinculada à anterior via `id_ordem_anterior`.

---

## 8. Ações por ordem

### 8.1. Tabela-resumo

| Ação | O que faz | Quais ordens |
| :--- | :--- | :--- |
| **Abrir** | Muda o status para `em_andamento`. | Todas (exceto O29–O32). |
| **Concluir** | Muda o status para `concluida` e dispara a próxima ordem. | Todas (exceto O29–O32). |
| **Cancelar** | Muda o status para `cancelada` (com justificativa). | Todas. |
| **Marcar urgente** | Marca `urgente = true`. | Todas. |
| **Ver documento** | Abre o documento de origem. | Todas. |
| **Ver histórico** | Abre o histórico da ordem. | Todas. |
| **Aceitar** | Confirma a sugestão. | O7. |
| **Alterar** | Altera a classificação; oferece criar regra (D4). | O7. |
| **Rejeitar** | Marca como não classificado. | O7. |
| **Override** | Sobrescreve valor calculado (com justificativa). | O10, O11, O12, O13, O14. |
| **Aprovar** | Aprova a consolidação. | O23. |
| **Reprovar** | Reprova a consolidação e devolve ao Contador. | O23. |
| **Confirmar** | Confirma a movimentação. | O19, O20. |
| **Ajustar** | Ajusta vencimentos/parcelas. | O15, O16. |
| **Resolver** | Resolve a pendência. | O9, O11. |
| **Reclassificar** | Reabre a classificação. | O27. |
| **Atualizar** | Atualiza o parâmetro. | O28. |

### 8.2. Detalhamento por ordem

#### O1 — Conferir NF-e de entrada

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar item** | Confirma a classificação do item (D3). Registra em auditoria. |
| **Alterar item** | Abre o formulário de classificação (D3). Oferece criar regra (D4). Registra em auditoria. |
| **Rejeitar item** | Marca o item como "Não classificado — requer intervenção". A ordem volta para `pendente`. |
| **Aceitar em lote** | Aceita todos os itens selecionados de uma vez. |
| **Resolver pendência** | Abre a pendência (T6) vinculada e permite resolvê-la. |
| **Concluir** | Se todos os itens estão classificados e as pendências resolvidas, muda `status` para `concluida` e emite O10 (Contador), O15 (Financeiro1) e O29 (automático). Se houver pendência Erro, bloqueia e informa. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O2 — Conferir NF-e de saída

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar item** | Confirma a classificação do item (D3). |
| **Alterar item** | Abre o formulário (D3). Oferece criar regra (D4). |
| **Rejeitar item** | Marca como "Não classificado — requer intervenção". |
| **Aceitar em lote** | Aceita todos os itens selecionados. |
| **Resolver pendência** | Abre a pendência (T6). |
| **Concluir** | Se todos os itens classificados e pendências resolvidas, muda `status` para `concluida` e emite O10 (Contador) e O16 (Financeiro2). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O3 — Conferir NFS-e tomada / CT-e tomado / RPA

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar item** | Confirma a classificação. |
| **Alterar item** | Abre o formulário (D3). Oferece criar regra (D4). |
| **Rejeitar item** | Marca como "Não classificado — requer intervenção". |
| **Aceitar em lote** | Aceita todos os itens selecionados. |
| **Resolver pendência** | Abre a pendência (T6). |
| **Concluir** | Se todos os itens classificados e pendências resolvidas, muda `status` para `concluida` e emite O10 (Contador) e O15 (Financeiro1). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O4 — Conferir NFS-e prestada / CT-e emitido

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar item** | Confirma a classificação. |
| **Alterar item** | Abre o formulário (D3). Oferece criar regra (D4). |
| **Rejeitar item** | Marca como "Não classificado — requer intervenção". |
| **Aceitar em lote** | Aceita todos os itens selecionados. |
| **Resolver pendência** | Abre a pendência (T6). |
| **Concluir** | Se todos os itens classificados e pendências resolvidas, muda `status` para `concluida` e emite O10 (Contador) e O16 (Financeiro2). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O5 — Conferir documento manual

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar item** | Confirma a classificação. |
| **Alterar item** | Abre o formulário (D3). Oferece criar regra (D4). |
| **Rejeitar item** | Marca como "Não classificado — requer intervenção". |
| **Resolver pendência** | Abre a pendência (T6). |
| **Concluir** | Se todos os itens classificados e pendências resolvidas, muda `status` para `concluida` e emite O10 + O15 (entrada) ou O10 + O16 (saída). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O6 — Conferir folha de pagamento

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar funcionário** | Confirma os valores do funcionário. |
| **Override** | Sobrescreve valores calculados (com justificativa). Registra em auditoria. |
| **Aceitar em lote** | Aceita todos os funcionários selecionados. |
| **Resolver pendência** | Abre a pendência (T6). |
| **Concluir** | Se todos os funcionários aceitos e pendências resolvidas, muda `status` para `concluida` e emite O12 (Contador) e O21 (Financeiro1). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O7 — Revisar classificação

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar** | Confirma a sugestão. Status do lançamento vira "Classificado automaticamente — aceito". Registra em auditoria. Se era o último pendente do documento, emite O10. |
| **Alterar** | Abre formulário para escolher outra conta/centro de custo/contrapartida. Ao confirmar, status vira "Classificado manualmente". Oferece criar regra (D4). Registra em auditoria. Se era o último pendente, emite O10. |
| **Rejeitar** | Marca como "Não classificado — requer intervenção". A ordem volta para `pendente`. Registra em auditoria. |
| **Aceitar em lote** | Aceita todos os lançamentos selecionados de uma vez. |
| **Ver justificativa** | Abre o painel "Por que?" (D2). |
| **Criar regra** | Abre o modal D4 (só após "Alterar"). |
| **Concluir** | Se todos os lançamentos selecionados foram aceitos/alterados, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |
| **Marcar urgente** | Marca `urgente = true`. |

#### O8 — Resolver conflito de regras

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Escolher regra** | O ator escolhe qual das regras em conflito aplicar. O lançamento é classificado com a regra escolhida. Registra em auditoria. |
| **Ajustar prioridade** | Abre D5 para ajustar a prioridade das regras em conflito. |
| **Concluir** | Se a regra foi escolhida, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O9 — Resolver pendência de dados

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Resolver** | Abre o formulário do documento para completar os dados faltantes. Se for Erro, a pendência é marcada como Resolvida; se Aviso, o ator confirma. Registra em auditoria. |
| **Concluir** | Se a pendência foi resolvida, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa (ex: pendência resolvida por outro caminho). |

#### O10 — Validar lançamento contábil

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Validar** | Confirma a classificação e os impostos. Registra em auditoria. |
| **Reclassificar** | Abre D3 para alterar a classificação. Registra em auditoria. |
| **Override** | Sobrescreve valor de imposto (com justificativa). Registra em auditoria. |
| **Concluir** | Se o lançamento foi validado, muda `status` para `concluida`. Se era o último do documento, o documento avança para o financeiro. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O11 — Validar cálculo de impostos

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aceitar cálculo** | Confirma o cálculo do sistema. Registra em auditoria. |
| **Override** | Sobrescreve o valor calculado (com justificativa). Registra em auditoria. |
| **Resolver divergência** | Abre o detalhamento da divergência (XML vs. calculado). |
| **Concluir** | Se o cálculo foi aceito ou override, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O12 — Validar cálculo de folha

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Validar** | Confirma a consolidação da folha. |
| **Override** | Sobrescreve valor (com justificativa). |
| **Concluir** | Se a folha foi validada, muda `status` para `concluida` e emite O21 (Financeiro1). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O13 — Validar depreciação

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Validar** | Confirma o cálculo da depreciação. |
| **Override** | Sobrescreve valor (com justificativa). |
| **Concluir** | Se a depreciação foi validada, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O14 — Validar provisões

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Validar** | Confirma o cálculo das provisões. |
| **Override** | Sobrescreve valor (com justificativa). |
| **Concluir** | Se as provisões foram validadas, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O15 — Gerar conta a pagar

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Ajustar** | Abre o formulário para ajustar vencimentos, parcelas, forma de pagamento. Registra em auditoria. |
| **Confirmar** | Confirma as contas geradas. Status das contas vira "Aberta". |
| **Concluir** | Se as contas foram confirmadas, muda `status` para `concluida`. As contas ficam em aberto aguardando O17. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O16 — Gerar conta a receber

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Ajustar** | Abre o formulário para ajustar vencimentos, parcelas, forma de recebimento. |
| **Confirmar** | Confirma as contas geradas. Status das contas vira "Aberta". |
| **Concluir** | Se as contas foram confirmadas, muda `status` para `concluida`. As contas ficam em aberto aguardando O18. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O17 — Pagar conta

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Registrar baixa** | Abre o formulário de baixa (total/parcial) com juros/multa/desconto. |
| **Estornar** | Estorna uma baixa já registrada (com justificativa). |
| **Concluir** | Se a baixa foi registrada, muda `status` para `concluida` e emite O19 (Gerente Financeiro). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O18 — Receber conta

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Registrar baixa** | Abre o formulário de baixa (total/parcial) com juros/multa/desconto. |
| **Estornar** | Estorna uma baixa já registrada (com justificativa). |
| **Concluir** | Se a baixa foi registrada, muda `status` para `concluida` e emite O20 (Gerente Financeiro). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O19 — Validar saída de caixa/banco

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Confirmar** | Confirma a saída de caixa/banco. O saldo é atualizado. Registra em auditoria. |
| **Rejeitar** | Rejeita a saída; devolve ao Financeiro1 com justificativa. |
| **Concluir** | Se confirmada, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O20 — Validar entrada de caixa/banco

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Confirmar** | Confirma a entrada de caixa/banco. O saldo é atualizado. |
| **Rejeitar** | Rejeita a entrada; devolve ao Financeiro2 com justificativa. |
| **Concluir** | Se confirmada, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O21 — Pagar folha

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Agendar** | Agenda o pagamento para a data escolhida. |
| **Processar** | Processa o pagamento; gera saída de caixa/banco. |
| **Concluir** | Se o pagamento foi processado, muda `status` para `concluida` e emite O19 (Gerente Financeiro). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O22 — Preparar fechamento

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Consolidar** | Executa a consolidação de folha (E3), depreciação (E4) e provisões (E5) se não foram lançadas. |
| **Ver pendências** | Abre o relatório de pendências (T6). |
| **Resolver pendência** | Abre a pendência (T6) vinculada e permite resolvê-la. |
| **Concluir** | Se todas as pendências Erro foram resolvidas e as consolidações foram feitas, muda `status` para `concluida` e emite O23 (Auditor). Se houver Aviso, exige confirmação explícita (registrada em auditoria). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O23 — Validar fechamento

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Aprovar** | Aprova a consolidação. Muda `status` para `concluida` e emite O24 (Contador). Registra em auditoria. |
| **Reprovar** | Reprova a consolidação. Muda `status` para `concluida` e emite O22 (Contador) com a lista de problemas. Registra em auditoria. |
| **Ver pendências** | Abre o relatório de pendências (T6). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O24 — Fechar período

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Confirmar** | Confirma o fechamento. O período é congelado (`status = "Fechado"`). O próximo período é aberto automaticamente. Registra em auditoria. |
| **Concluir** | Muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa (ex: o Auditor reprovou depois). |

#### O25 — Apontar problema

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Apontar** | O Auditor registra o problema (descrição, evidência, ator competente). |
| **Concluir** | Muda `status` para `concluida` e emite O26 (solicitar correção) para o ator competente. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O26 — Solicitar correção

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Corrigir** | O ator competente corrige o problema (com justificativa e auditoria). |
| **Concluir** | Muda `status` para `concluida`. O Auditor é notificado para revalidar (nova O23 ou O25). |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O27 — Reclassificar lançamento

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Reclassificar** | Abre D3 para alterar a classificação. Oferece criar regra (D4). Registra em auditoria. |
| **Concluir** | Se o lançamento foi reclassificado, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O28 — Ajustar parâmetros

| Ação | Comportamento |
| :--- | :--- |
| **Abrir** | Muda `status` para `em_andamento`. |
| **Atualizar** | Abre o formulário de parâmetro (I2) para editar valores e vigência. |
| **Concluir** | Se o parâmetro foi atualizado, muda `status` para `concluida`. |
| **Cancelar** | Muda `status` para `cancelada` com justificativa. |

#### O29 — Registrar custo de produto

| Ação | Comportamento |
| :--- | :--- |
| (automática) | O sistema registra o custo do produto (XML, Médio ou Manual). Não há ação do ator. `status` = `concluida` automaticamente. |

#### O30 — Registrar razão de impostos

| Ação | Comportamento |
| :--- | :--- |
| (automática) | O sistema registra o crédito/débito no razão. Não há ação do ator. `status` = `concluida` automaticamente. |

#### O31 — Gerar pendência

| Ação | Comportamento |
| :--- | :--- |
| (automática) | O sistema cria a pendência (T6) e a ordem de resolução (O9, O11, etc.). Não há ação do ator na O31 em si. `status` = `concluida` automaticamente. |

#### O32 — Consolidar depreciação e provisões

| Ação | Comportamento |
| :--- | :--- |
| (automática) | O sistema calcula e lança depreciação (E4) e provisões (E5). Não há ação do ator. `status` = `concluida` automaticamente. Emite O13 e O14 (Contador). |

---

## 9. Transições por ordem

### 9.1. Regras gerais de transição

- **`pendente → em_andamento`:** quando o ator abre a ordem.
- **`em_andamento → concluida`:** quando o ator conclui a ação.
- **`pendente/em_andamento → cancelada`:** quando o documento de origem é cancelado ou a ordem perde o objeto.
- **`em_andamento → pendente`:** quando o ator rejeita a ação (ex: O7 — Rejeitar) e a ordem volta para a fila.
- **`concluida` e `cancelada`** vão para o histórico.

### 9.2. Tabela por ordem

| Ordem | Transições válidas | Observações |
| :--- | :--- | :--- |
| **O1** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada`; `em_andamento → pendente` (se rejeitar item) | Concluir só se todos os itens classificados e pendências resolvidas. |
| **O2** | Idem O1. | — |
| **O3** | Idem O1. | — |
| **O4** | Idem O1. | — |
| **O5** | Idem O1. | — |
| **O6** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se todos os funcionários aceitos e pendências resolvidas. |
| **O7** | `pendente → em_andamento → concluida` (aceitar/alterar); `em_andamento → pendente` (rejeitar); `pendente/em_andamento → cancelada` | — |
| **O8** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se a regra foi escolhida. |
| **O9** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se a pendência foi resolvida. |
| **O10** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o lançamento foi validado. |
| **O11** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o cálculo foi aceito ou override. |
| **O12** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | — |
| **O13** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | — |
| **O14** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | — |
| **O15** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se as contas foram confirmadas. |
| **O16** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se as contas foram confirmadas. |
| **O17** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se a baixa foi registrada. |
| **O18** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se a baixa foi registrada. |
| **O19** | `pendente → em_andamento → concluida` (confirmar); `em_andamento → pendente` (rejeitar); `pendente/em_andamento → cancelada` | — |
| **O20** | Idem O19. | — |
| **O21** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o pagamento foi processado. |
| **O22** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se as pendências Erro foram resolvidas e as consolidações feitas. |
| **O23** | `pendente → em_andamento → concluida` (aprovar/reprovar); `pendente/em_andamento → cancelada` | Concluir com dois resultados: aprovado (emite O24) ou reprovado (emite O22). |
| **O24** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o fechamento foi confirmado. |
| **O25** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o problema foi apontado. |
| **O26** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se a correção foi feita. |
| **O27** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o lançamento foi reclassificado. |
| **O28** | `pendente → em_andamento → concluida`; `pendente/em_andamento → cancelada` | Concluir só se o parâmetro foi atualizado. |
| **O29** | `pendente → concluida` (automática) | Não há `em_andamento` nem `cancelada`. |
| **O30** | `pendente → concluida` (automática) | Não há `em_andamento` nem `cancelada`. |
| **O31** | `pendente → concluida` (automática) | Não há `em_andamento` nem `cancelada`. |
| **O32** | `pendente → concluida` (automática) | Não há `em_andamento` nem `cancelada`. |

### 9.3. Transições especiais

| Transição | Ordem | Condição | Efeito |
| :--- | :--- | :--- | :--- |
| `em_andamento → pendente` | O7 | Ator rejeita a classificação. | A ordem volta para a fila; o lançamento fica "Não classificado — requer intervenção". |
| `em_andamento → pendente` | O19, O20 | Gerente Financeiro rejeita a movimentação. | A ordem volta para o Financeiro1/2 com justificativa. |
| `concluida → nova ordem` | O23 | Auditor reprova o fechamento. | Emite O22 (nova) para o Contador com a lista de problemas. |
| `concluida → nova ordem` | O25, O26 | Auditor aponta problema / solicita correção. | Emite O26/O25 para o ator competente. |
| `concluida → nova ordem` | O27 | Reclassificação. | Emite nova ordem vinculada via `id_ordem_anterior`. |

---

## 10. Filtros da caixa de entrada por ator

| Ator | Filtros disponíveis |
| :--- | :--- |
| **Todos** | Tipo de ordem, urgente, ator de origem, período, status (pendente/em_andamento). |
| **Comprador** | + Documento (NF-e/NFS-e/CT-e/RPA), fornecedor, pendências (T6). |
| **Faturista** | + Documento (NF-e/NFS-e/CT-e), cliente, pendências (T6). |
| **Financeiro1** | + Conta a pagar, fornecedor, vencimento, valor. |
| **Financeiro2** | + Conta a receber, cliente, vencimento, valor, inadimplência. |
| **Gerente Financeiro** | + Tipo de movimentação (saída/entrada), conta bancária, valor. |
| **RH** | + Funcionário, período de referência, tipo de folha. |
| **Contador** | + Documento, tipo de cálculo (imposto/folha/depreciação/provisão), pendências (T6), período. |
| **Auditor** | + Documento, ator, tipo de problema, período, handoff. |

**Filtro "Pendências":** em todas as caixas de entrada, mostra as ordens O9 (resolver pendência de dados) e O11 (validar impostos) atribuídas ao ator. É o elo entre a caixa de entrada e o relatório de pendências (T6).

---

## 11. Regras gerais

1. **Toda ordem tem um documento de origem.** Não há ordem "solta".
2. **Toda ordem tem um ator de origem e um ator de destino.** O sistema é o emissor das ordens automáticas, mas o **ator de origem** é sempre quem gerou o documento (T8.11).
3. **Ordens automáticas (O29–O32)** são processadas pelo sistema, mas o **ator de destino** confere (quando aplicável). O sistema não substitui o humano na validação.
4. **Ordens com ator** exigem ação humana (conferir, classificar, validar, pagar, receber, fechar).
5. **Toda transição de estado** é registrada em auditoria (T8.7) e em `documento_encadeado` (T8.1).
6. **A caixa de entrada** mostra todas as ordens do ator, com filtros por tipo, pendências (T6), urgente e ator de origem.
7. **A caixa de saída** mostra as ordens que o ator emitiu e ainda estão pendentes/em andamento.
8. **O histórico** mostra as ordens concluídas (consulta separada).
9. **O status "urgente"** é marcação na ordem, por decisão do ator (T8.6).
10. **A ordem pode ser cancelada** (ex: documento cancelado, conta cancelada) — vai para o histórico com status "cancelada".
11. **A ordem pode ser reaberta** (ex: reclassificação — O27) — gera uma nova ordem vinculada à anterior.
12. **Uma ordem pode gerar várias ordens** (ex: O1 gera O7, O10, O15) — o `documento_encadeado` registra os elos.
13. **Ordens em lote:** algumas ordens podem ser concluídas em lote (ex: O7 — Revisar classificação — vários lançamentos do mesmo documento). O ator escolhe se conclui individualmente ou em lote.
14. **A ordem não substitui o documento.** O documento é a fonte da verdade; a ordem é a tarefa. Ao abrir a ordem, o ator vê o documento e age sobre ele.
15. **A ordem não é um "workflow" configurável.** O fluxo é fixo (T8.3). O Configurador só ativa/desativa o handoff por empresa.

---

## 12. Pendências e ordens

**Pendência (T6) não é ordem.** É um **registro de problema** (Erro/Aviso) que:

- Aparece no **relatório de pendências** (Contador, Auditor).
- Gera uma **ordem de resolução** (O9, O11, etc.) para o ator competente.
- É resolvida quando a ordem correspondente é concluída.

**Relação:**

| Pendência (T6) | Ordem gerada | Ator |
| :--- | :--- | :--- |
| Lançamento não classificado | O7 (revisar classificação) | Comprador/Faturista/Contador |
| Conflito de regras | O8 (resolver conflito) | Contador |
| Dados faltantes críticos | O9 (resolver pendência) | Comprador/Faturista/RH |
| Dados faltantes não críticos | O9 (resolver pendência) | Comprador/Faturista/RH |
| Divergência de impostos | O11 (validar impostos) | Contador |
| Provisão não calculada | O14 (validar provisões) | Contador |
| Depreciação não lançada | O13 (validar depreciação) | Contador |
| Conta vencida não baixada | O17/O18 (pagar/receber) | Financeiro1/2 |
| Regra ambígua | O8 (resolver conflito) | Contador |

**O relatório de pendências (T6)** é a **visão consolidada** por filial. A **caixa de entrada** é a **visão por ator**. O elo é o filtro "Pendências" na caixa de entrada.

---

## 13. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-23 | Criação do documento. Catálogo de 32 ordens (O1–O32), mapeamento ordem → caso de uso, caso de uso → ordem, ator → ordem, fluxo de estados, ações por ordem, transições por ordem, filtros da caixa de entrada, regras gerais, relação pendências × ordens, apêndices (diagrama, `dados_extras` de cada ordem, próximos passos). |

---

## Apêndice A — `dados_extras` por ordem

### O1 — Conferir NF-e de entrada

```json
{
  "id_nota_fiscal": 456,
  "chave": "12345678901234567890123456789012345678901234",
  "fornecedor": "ABC Ltda",
  "valor_total": 1000.00,
  "itens": [
    {
      "numero_item": 1,
      "descricao": "Produto X",
      "cfop": "1102",
      "ncm": "12345678",
      "valor": 500.00,
      "status_classificacao": "Classificado automaticamente",
      "conta_sugerida": "3.1.1",
      "justificativa": "Regra: Fornecedor ABC + CFOP 1102 → Custo > CMV (prioridade 1)"
    }
  ],
  "status_importacao": "Importado",
  "pendencias": [
    {"id": 789, "categoria": "Aviso", "tipo": "Dados faltantes não críticos", "descricao": "NCM ausente no item 2"}
  ]
}
```

### O2 — Conferir NF-e de saída

```json
{
  "id_nota_fiscal": 457,
  "chave": "12345678901234567890123456789012345678901235",
  "cliente": "XYZ Ltda",
  "valor_total": 2000.00,
  "itens": [
    {
      "numero_item": 1,
      "descricao": "Produto Y",
      "cfop": "5102",
      "ncm": "87654321",
      "valor": 2000.00,
      "status_classificacao": "Classificado automaticamente",
      "conta_sugerida": "5.1.1",
      "justificativa": "Regra: CFOP 5102 → Receita de Vendas (prioridade 2)"
    }
  ],
  "status_importacao": "Importado",
  "pendencias": []
}
```

### O3 — Conferir NFS-e tomada / CT-e tomado / RPA

```json
{
  "id_nota_fiscal": 458,
  "tipo_documento": "NFS-e",
  "chave": "12345678901234567890123456789012345678901236",
  "prestador": "Serviços ABC",
  "valor_total": 1500.00,
  "retencoes": {
    "iss": 75.00,
    "irrf": 22.50,
    "inss": 0.00,
    "pis_cofins_csll": 0.00
  },
  "valor_liquido": 1402.50,
  "itens": [
    {
      "numero_item": 1,
      "descricao": "Serviço de consultoria",
      "codigo_servico": "01.01",
      "valor": 1500.00,
      "status_classificacao": "Classificado automaticamente",
      "conta_sugerida": "4.1.1",
      "justificativa": "Regra: LC 116 01.01 → Despesa > Serviços (prioridade 5)"
    }
  ],
  "status_importacao": "Importado",
  "pendencias": []
}
```

### O4 — Conferir NFS-e prestada / CT-e emitido

```json
{
  "id_nota_fiscal": 459,
  "tipo_documento": "NFS-e",
  "chave": "12345678901234567890123456789012345678901237",
  "tomador": "Cliente XYZ",
  "valor_total": 3000.00,
  "retencoes": {
    "iss": 150.00,
    "irrf": 45.00,
    "inss": 0.00,
    "pis_cofins_csll": 0.00
  },
  "valor_liquido": 2805.00,
  "itens": [
    {
      "numero_item": 1,
      "descricao": "Serviço de desenvolvimento",
      "codigo_servico": "01.04",
      "valor": 3000.00,
      "status_classificacao": "Classificado automaticamente",
      "conta_sugerida": "5.1.2",
      "justificativa": "Regra: LC 116 01.04 → Receita de Serviços (prioridade 5)"
    }
  ],
  "status_importacao": "Importado",
  "pendencias": []
}
```

### O5 — Conferir documento manual

```json
{
  "id_nota_fiscal": 460,
  "tipo_documento": "NF-e",
  "direcao": "Entrada",
  "numero": "1234",
  "serie": "1",
  "data_emissao": "2026-10-15",
  "fornecedor": "Fornecedor Manual",
  "valor_total": 800.00,
  "itens": [
    {
      "numero_item": 1,
      "descricao": "Produto Z",
      "cfop": "1102",
      "ncm": "11112222",
      "valor": 800.00,
      "status_classificacao": "Classificado automaticamente",
      "conta_sugerida": "3.1.1",
      "justificativa": "Regra: CFOP 1102 → Custo > CMV (prioridade 2)"
    }
  ],
  "status_importacao": "Importado",
  "pendencias": []
}
```

### O6 — Conferir folha de pagamento

```json
{
  "id_folha_pagamento": 123,
  "mes_ano_referencia": "10/2026",
  "funcionarios": [
    {
      "id_funcionario": 456,
      "nome": "João Silva",
      "salario_base": 3000.00,
      "total_proventos": 3000.00,
      "total_descontos": 300.00,
      "valor_liquido": 2700.00,
      "valor_inss_empregado": 300.00,
      "valor_inss_patronal": 600.00,
      "valor_fgts": 240.00,
      "valor_irrf": 0.00,
      "status": "Calculado"
    }
  ],
  "status": "Calculada",
  "pendencias": []
}
```

### O7 — Revisar classificação

```json
{
  "id_lancamento": 123,
  "id_nota_fiscal": 456,
  "conta_sugerida": "3.1.1",
  "justificativa": "Regra: Fornecedor ABC + CFOP 1102 → Custo > CMV (prioridade 1)",
  "confianca": "alta",
  "contexto": {
    "fornecedor": "ABC",
    "cfop": "1102",
    "ncm": "12345678"
  }
}
```

### O8 — Resolver conflito de regras

```json
{
  "id_lancamento": 123,
  "id_nota_fiscal": 456,
  "regras_conflitantes": [
    {
      "id_regra": 101,
      "descricao": "Fornecedor ABC + CFOP 1102 → Custo > CMV",
      "prioridade": 1,
      "conta_destino": "3.1.1"
    },
    {
      "id_regra": 102,
      "descricao": "Fornecedor ABC + NCM 12345678 → Despesa > Material",
      "prioridade": 1,
      "conta_destino": "4.1.2"
    }
  ],
  "contexto": {
    "fornecedor": "ABC",
    "cfop": "1102",
    "ncm": "12345678"
  }
}
```

### O9 — Resolver pendência de dados

```json
{
  "id_pendencia": 789,
  "categoria": "Aviso",
  "tipo": "Dados faltantes não críticos",
  "descricao": "NCM ausente no item 2",
  "id_referencia": 456,
  "tabela_referencia": "nota_fiscal_item",
  "dados_faltantes": {
    "ncm": null
  }
}
```

### O10 — Validar lançamento contábil

```json
{
  "id_nota_fiscal": 456,
  "id_lancamento": 123,
  "classificacao": {
    "conta_debito": "3.1.1",
    "conta_credito": "2.1.1",
    "centro_custo": "Comercial",
    "status": "Classificado automaticamente"
  },
  "impostos": [
    {"tipo": "ICMS", "base": 500.00, "aliquota": 18.00, "valor": 90.00, "natureza": "Crédito"}
  ],
  "pendencias": []
}
```

### O11 — Validar cálculo de impostos

```json
{
  "id_nota_fiscal": 456,
  "impostos_calculados": [
    {"tipo": "ICMS", "base": 500.00, "aliquota": 18.00, "valor": 90.00, "natureza": "Crédito"}
  ],
  "impostos_xml": [
    {"tipo": "ICMS", "base": 500.00, "aliquota": 12.00, "valor": 60.00, "natureza": "Crédito"}
  ],
  "divergencias": [
    {"tipo": "ICMS", "valor_calculado": 90.00, "valor_xml": 60.00, "diferenca": 30.00}
  ]
}
```

### O12 — Validar cálculo de folha

```json
{
  "id_folha_pagamento": 123,
  "mes_ano_referencia": "10/2026",
  "total_bruto": 30000.00,
  "total_inss_empregado": 3000.00,
  "total_inss_patronal": 6000.00,
  "total_fgts": 2400.00,
  "total_irrf": 1500.00,
  "total_liquido": 25500.00,
  "total_provisoes": 5000.00,
  "divergencias": []
}
```

### O13 — Validar depreciação

```json
{
  "id_depreciacao": 123,
  "id_ativo": 456,
  "descricao": "Computador",
  "valor_original": 5000.00,
  "valor_residual": 500.00,
  "vida_util_meses": 60,
  "depreciacao_mensal": 75.00,
  "depreciacao_acumulada": 750.00,
  "valor_contabil_liquido": 4250.00,
  "divergencias": []
}
```

### O14 — Validar provisões

```json
{
  "id_provisao": 123,
  "id_funcionario": 456,
  "nome": "João Silva",
  "tipo": "Férias",
  "valor_provisao": 250.00,
  "valor_encargos": 75.00,
  "divergencias": []
}
```

### O15 — Gerar conta a pagar

```json
{
  "id_nota_fiscal": 456,
  "id_fornecedor": 789,
  "valor_bruto": 1000.00,
  "retencoes": 50.00,
  "valor_liquido": 950.00,
  "parcelas": 3,
  "vencimentos": ["2026-11-15", "2026-12-15", "2027-01-15"],
  "forma_pagamento": "boleto"
}
```

### O16 — Gerar conta a receber

```json
{
  "id_nota_fiscal": 457,
  "id_cliente": 790,
  "valor_bruto": 2000.00,
  "retencoes": 100.00,
  "valor_liquido": 1900.00,
  "parcelas": 2,
  "vencimentos": ["2026-11-30", "2026-12-30"],
  "forma_recebimento": "transferencia"
}
```

### O17 — Pagar conta

```json
{
  "id_conta_pagar": 123,
  "id_fornecedor": 789,
  "valor": 316.67,
  "data_vencimento": "2026-11-15",
  "saldo": 316.67,
  "forma_pagamento": "boleto"
}
```

### O18 — Receber conta

```json
{
  "id_conta_receber": 124,
  "id_cliente": 790,
  "valor": 950.00,
  "data_vencimento": "2026-11-30",
  "saldo": 950.00,
  "forma_recebimento": "transferencia"
}
```

### O19 — Validar saída de caixa/banco

```json
{
  "id_conta_pagar": 123,
  "id_lancamento_baixa": 124,
  "valor_pago": 316.67,
  "juros": 0.00,
  "multa": 0.00,
  "desconto": 0.00,
  "id_conta_bancaria": 1,
  "data_pagamento": "2026-11-15"
}
```

### O20 — Validar entrada de caixa/banco

```json
{
  "id_conta_receber": 124,
  "id_lancamento_baixa": 125,
  "valor_recebido": 950.00,
  "juros": 0.00,
  "multa": 0.00,
  "desconto": 0.00,
  "id_conta_bancaria": 1,
  "data_recebimento": "2026-11-30"
}
```

### O21 — Pagar folha

```json
{
  "id_folha_pagamento": 123,
  "mes_ano_referencia": "10/2026",
  "total_liquido": 25500.00,
  "data_pagamento": "2026-11-05",
  "funcionarios": [
    {"id_funcionario": 456, "nome": "João Silva", "valor_liquido": 2700.00}
  ]
}
```

### O22 — Preparar fechamento

```json
{
  "id_periodo": 12,
  "mes_ano": "10/2026",
  "status_periodo": "Aberto",
  "pendencias_erro": 2,
  "pendencias_aviso": 5,
  "consolidacoes": {
    "folha": "ok",
    "depreciacao": "ok",
    "provisoes": "pendente"
  }
}
```

### O23 — Validar fechamento

```json
{
  "id_periodo": 12,
  "mes_ano": "10/2026",
  "pendencia_erros": 0,
  "pendencia_avisos": 3,
  "consolidacoes": {
    "folha": "ok",
    "depreciacao": "ok",
    "provisoes": "ok"
  },
  "status_auditor": "aguardando"
}
```

### O24 — Fechar período

```json
{
  "id_periodo": 12,
  "mes_ano": "10/2026",
  "status_periodo": "Em fechamento",
  "consolidacao_aprovada": true,
  "avisos_confirmados": ["2026-10-20-aviso-1", "2026-10-21-aviso-2"]
}
```

### O25 — Apontar problema

```json
{
  "id_auditoria": 123,
  "tipo_problema": "Classificação incorreta",
  "descricao": "Lançamento 123 classificado como Custo > CMV, mas deveria ser Despesa > Material",
  "id_referencia": 123,
  "tabela_referencia": "lancamento",
  "id_ator_competente": 5,
  "evidencia": {
    "dados_anteriores": {"conta": "3.1.1"},
    "dados_novos": {"conta": "4.1.2"}
  }
}
```

### O26 — Solicitar correção

```json
{
  "id_solicitacao": 124,
  "tipo_correcao": "Reclassificação",
  "descricao": "Reclassificar lançamento 123 de 3.1.1 para 4.1.2",
  "id_referencia": 123,
  "tabela_referencia": "lancamento",
  "id_ator_competente": 5,
  "prazo": "2026-10-30"
}
```

### O27 — Reclassificar lançamento

```json
{
  "id_lancamento": 123,
  "classificacao_atual": "3.1.1",
  "classificacao_nova": "4.1.2",
  "motivo": "Erro de classificação identificado pelo Auditor",
  "id_ordem_anterior": 122
}
```

### O28 — Ajustar parâmetros

```json
{
  "id_parametro": 123,
  "tipo": "tabela_inss",
  "descricao": "Tabela INSS 2026",
  "data_inicio_validade": "2026-01-01",
  "data_fim_validade": "2026-12-31",
  "valores_atuais": [
    {"faixa": 1, "valor_inicial": 0.00, "valor_final": 1518.00, "aliquota": 7.50}
  ]
}
```

### O29 — Registrar custo de produto

```json
{
  "id_nota_fiscal": 456,
  "id_produto_servico": 789,
  "custo_unitario": 50.00,
  "metodo_custo": "XML"
}
```

### O30 — Registrar razão de impostos

```json
{
  "id_lancamento": 123,
  "tipo_imposto": "ICMS",
  "natureza": "Crédito",
  "valor": 90.00,
  "id_pessoa": 789,
  "id_nota_fiscal": 456
}
```

### O31 — Gerar pendência

```json
{
  "id_pendencia": 789,
  "categoria": "Erro",
  "tipo": "Nao classificado",
  "descricao": "Lançamento 123 não classificado",
  "id_referencia": 123,
  "tabela_referencia": "lancamento"
}
```

### O32 — Consolidar depreciação e provisões

```json
{
  "id_periodo": 12,
  "mes_ano": "10/2026",
  "ativos": [
    {"id_ativo": 456, "descricao": "Computador", "depreciacao_mensal": 75.00}
  ],
  "funcionarios": [
    {"id_funcionario": 457, "nome": "João Silva", "provisao_ferias": 250.00, "provisao_13": 250.00}
  ]
}
```

---

## Apêndice B — Diagrama de fluxo de ordens

```
ENTRADA DE DOCUMENTO
    │
    ├── NF-e entrada ──→ O1 (Conferir) ──→ Comprador
    ├── NF-e saída ────→ O2 (Conferir) ──→ Faturista
    ├── NFS-e/CT-e/RPA tomado ─→ O3 (Conferir) ──→ Comprador
    ├── NFS-e/CT-e prestado ──→ O4 (Conferir) ──→ Faturista
    ├── Documento manual ─────→ O5 (Conferir) ──→ Comprador/Faturista
    └── Folha ────────────────→ O6 (Conferir) ──→ RH
                                        │
                                        ▼
CLASSIFICAÇÃO
    │
    ├── O7 (Revisar classificação) ──→ Comprador/Faturista/Contador
    ├── O8 (Resolver conflito) ──────→ Contador
    └── O9 (Resolver pendência) ─────→ Comprador/Faturista/RH
                                        │
                                        ▼
VALIDAÇÃO CONTÁBIL/FISCAL
    │
    ├── O10 (Validar lançamento) ─────→ Contador
    ├── O11 (Validar impostos) ───────→ Contador
    ├── O12 (Validar folha) ──────────→ Contador
    ├── O13 (Validar depreciação) ────→ Contador
    └── O14 (Validar provisões) ──────→ Contador
                                        │
                                        ▼
FINANCEIRO
    │
    ├── O15 (Gerar conta a pagar) ────→ Financeiro1
    ├── O16 (Gerar conta a receber) ──→ Financeiro2
    ├── O17 (Pagar conta) ────────────→ Financeiro1
    ├── O18 (Receber conta) ──────────→ Financeiro2
    ├── O19 (Validar saída) ──────────→ Gerente Financeiro
    ├── O20 (Validar entrada) ────────→ Gerente Financeiro
    └── O21 (Pagar folha) ────────────→ Financeiro1
                                        │
                                        ▼
FECHAMENTO
    │
    ├── O22 (Preparar fechamento) ────→ Contador
    ├── O23 (Validar fechamento) ─────→ Auditor
    └── O24 (Fechar período) ─────────→ Contador
                                        │
                                        ▼
AUDITORIA E CORREÇÃO
    │
    ├── O25 (Apontar problema) ───────→ Ator competente
    ├── O26 (Solicitar correção) ─────→ Ator competente
    ├── O27 (Reclassificar) ──────────→ Contador
    └── O28 (Ajustar parâmetros) ─────→ Contador/RH

AUTOMÁTICAS (sem ator humano)
    │
    ├── O29 (Registrar custo de produto) ──→ Sistema
    ├── O30 (Registrar razão de imposto) ──→ Sistema
    ├── O31 (Gerar pendência) ─────────────→ Sistema
    └── O32 (Consolidar depreciação/provisões) ─→ Sistema
```

---

## Apêndice C — Próximos passos

Este documento é o **insumo** para:

1. **`agente-ordens.md`** — agente que gerencia a caixa de entrada, a caixa de saída e o histórico, e emite as ordens conforme o fluxo.
2. **`referencias/ordens.md`** — referência do módulo "Ordens" para o Skill `gestor-gerencial`, com o catálogo e as ações disponíveis.
3. **Atualização do `00_indice.md`** — incluir o `08_ordens.md` na lista de documentos vigentes e no mapa assunto → documento.
4. **Atualização do `03_casos_de_uso.md`** — incluir referência às ordens em cada caso de uso (seção 2.4 já menciona T8; agora pode referenciar O1–O32).
5. **Atualização do `04_modelo_de_dados.md`** — incluir o campo `tipo_ordem` na tabela `tarefa` e os campos `id_ordem_anterior`, `descricao_resumida`, `prioridade`.

---

## Apêndice D — Proposta de agente: `agente-ordens.md`

```markdown
---
name: agente-ordens
description: Agente de Ordens. Use quando a tarefa envolver consultar a caixa de entrada, a caixa de saída ou o histórico, emitir ordens, concluir ordens, cancelar ordens, marcar ordens como urgentes, ou resolver pendências (T6). Não use para operar diretamente os módulos (use os agentes específicos de cada ator).
model: claude-sonnet-4-5
skills:
  - gestor-gerencial
---

# Agente de Ordens

## Objetivo

Gerenciar a caixa de entrada, a caixa de saída e o histórico de ordens, e emitir/concluir/cancelar ordens conforme o fluxo T8.

## Escopo (fase 1)

- Consultar a caixa de entrada (ordens pendentes e em andamento).
- Consultar a caixa de saída (ordens emitidas e pendentes/em andamento).
- Consultar o histórico (ordens concluídas/canceladas).
- Emitir ordens (O1–O28).
- Concluir ordens (com a ação específica do tipo).
- Cancelar ordens (com justificativa).
- Marcar ordens como urgentes.
- Resolver pendências (T6) via ordens (O9, O11).
- Consultar o fluxo de estados de uma ordem.

## Entradas

- Ator logado (para filtrar a caixa de entrada/saída).
- Filial selecionada.
- Período aberto `[T5]`.
- Tipo de ordem (para emitir).
- Documento de origem (para emitir).

## Fluxo de orquestração

1. **Validar período** `[T5]`.
2. **Carregar `referencias/ordens.md`** (catálogo O1–O32).
3. **Se a tarefa for consultar:**
   - Carregar a caixa de entrada/saída/histórico do ator.
   - Aplicar filtros (tipo, urgente, ator de origem, período, pendências T6).
   - Exibir as ordens com `descricao_resumida`, `documento_resumo`, `status`, `urgente`.
4. **Se a tarefa for emitir:**
   - Identificar o tipo de ordem (O1–O28).
   - Identificar o documento de origem.
   - Identificar o ator de destino (conforme o tipo).
   - Criar a ordem com `status = pendente`.
   - Registrar em `documento_encadeado` e em auditoria.
5. **Se a tarefa for concluir:**
   - Abrir a ordem (`status = em_andamento`).
   - Executar a ação específica do tipo (aceitar, alterar, override, aprovar, etc.).
   - Concluir a ordem (`status = concluida`).
   - Emitir a próxima ordem (conforme o tipo).
   - Registrar em auditoria.
6. **Se a tarefa for cancelar:**
   - Cancelar a ordem (`status = cancelada`) com justificativa.
   - Registrar em auditoria.
7. **Se a tarefa for resolver pendência:**
   - Identificar a pendência (T6).
   - Identificar a ordem de resolução (O9, O11, etc.).
   - Executar a ação de resolução.
   - Concluir a ordem.
   - Atualizar a pendência (`status = Resolvida`).
8. **Exibir resumo** ao ator.

## Validações

- Período aberto `[T5]`.
- Ordem pertence ao ator (caixa de entrada) ou foi emitida por ele (caixa de saída).
- Ordem não está concluída/cancelada (para concluir/cancelar).
- Documento de origem existe.
- Ator de destino tem a tag correta para executar a ordem.

## Saída

- Lista de ordens (caixa de entrada/saída/histórico).
- Ordem emitida/concluída/cancelada.
- Pendência resolvida.
- Próxima ordem emitida.
- Registro em auditoria.

## Limitações

- **Não opera diretamente os módulos** (usar os agentes específicos: `agente-comprador`, `agente-faturista`, `agente-contador`, `agente-financeiro-pagar`, `agente-financeiro-receber`, `agente-rh`).
- **Não altera o fluxo** (handoff é fixo, T8.3).
- **Não cria tipos de ordem** (catálogo O1–O32 é fechado na fase 1).
- **Não substitui o Auditor** (validação do fechamento é do Auditor).
```

---

## Apêndice E — Proposta de referência: `referencias/ordens.md`

```markdown
# Módulo Ordens — Referência

> **Documento base:** `08_ordens.md` (v1.0)
> **Regras transversais:** T6 (pendências), T8 (handoff)
> **Quando carregar:** quando a tarefa envolver caixa de entrada/saída, histórico, emissão/conclusão/cancelamento de ordens, ou resolução de pendências.

## 1. Conceito

Ordem = tarefa. Toda tarefa chega à caixa de entrada do ator como uma ordem. Não há tarefa fora da caixa de entrada.

## 2. Catálogo (resumo)

| Código | Ordem | Emite | Executa |
| :--- | :--- | :--- | :--- |
| O1 | Conferir NF-e entrada | Sistema | Comprador |
| O2 | Conferir NF-e saída | Sistema | Faturista |
| O3 | Conferir NFS-e/CT-e/RPA tomado | Sistema | Comprador |
| O4 | Conferir NFS-e/CT-e prestado | Sistema | Faturista |
| O5 | Conferir documento manual | Sistema | Comprador/Faturista |
| O6 | Conferir folha | Sistema | RH |
| O7 | Revisar classificação (D3) | Sistema | Comprador/Faturista/Contador |
| O8 | Resolver conflito de regras | Sistema | Contador |
| O9 | Resolver pendência de dados | Sistema | Comprador/Faturista/RH |
| O10 | Validar lançamento contábil | Sistema | Contador |
| O11 | Validar impostos (override) | Sistema | Contador |
| O12 | Validar folha | Sistema | Contador |
| O13 | Validar depreciação | Sistema | Contador |
| O14 | Validar provisões | Sistema | Contador |
| O15 | Gerar conta a pagar | Sistema | Financeiro1 |
| O16 | Gerar conta a receber | Sistema | Financeiro2 |
| O17 | Pagar conta | Sistema | Financeiro1 |
| O18 | Receber conta | Sistema | Financeiro2 |
| O19 | Validar saída de caixa/banco | Financeiro1 | Gerente Financeiro |
| O20 | Validar entrada de caixa/banco | Financeiro2 | Gerente Financeiro |
| O21 | Pagar folha | RH | Financeiro1 |
| O22 | Preparar fechamento | Sistema | Contador |
| O23 | Validar fechamento | Contador | Auditor |
| O24 | Fechar período | Auditor | Contador |
| O25 | Apontar problema | Auditor | Ator competente |
| O26 | Solicitar correção | Auditor | Ator competente |
| O27 | Reclassificar lançamento | Contador/Auditor | Contador |
| O28 | Ajustar parâmetros | Sistema/Contador/RH | Contador/RH |
| O29 | Registrar custo de produto | Sistema | Sistema |
| O30 | Registrar razão de imposto | Sistema | Sistema |
| O31 | Gerar pendência | Sistema | Sistema |
| O32 | Consolidar depreciação/provisões | Sistema | Sistema |

## 3. Fluxo de estados

pendente → em_andamento → concluida
       ↘              ↘
        cancelada      cancelada

## 4. Ações por ordem

(ver seção 8 do `08_ordens.md`)

## 5. Transições por ordem

(ver seção 9 do `08_ordens.md`)

## 6. Filtros da caixa de entrada

(ver seção 10 do `08_ordens.md`)

## 7. Regras gerais

(ver seção 11 do `08_ordens.md`)

## 8. Pendências × ordens

(ver seção 12 do `08_ordens.md`)

## 9. `dados_extras` por ordem

(ver Apêndice A do `08_ordens.md`)


# Versões

| 1.1 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). Nota de multi-empresa: `tarefa` é grupo F (herda empresa via `filial`); filtro no repositório. Nenhuma alteração estrutural. |