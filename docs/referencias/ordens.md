---
modulo: ordens
casos: [O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19, O20, O21, O22, O23, O24, O25, O26, O27, O28, O29, O30, O31, O32]
depende_de: [02_regras_transversais, 03_casos_de_uso, 04_modelo_de_dados, 07_atores_fluxo, 09_menu_numeracao]
---

# Módulo Ordens — Referência

> **Números de menu:**
> - Caixa de Entrada → 1.1 · Caixa de Saída → 1.2 · Histórico → 1.3

> **Documento base:** `08_ordens.md` (v1.0).
> **Regras transversais:** T6 (pendências), T8 (handoff).
> **Quando carregar:** consultar caixa de entrada/saída/histórico, emitir/concluir/cancelar ordens, resolver pendências.

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
| O7 | Revisar classificação | Sistema | Comprador/Faturista/Contador |
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
↘ ↘
cancelada cancelada


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

## Resumo das ordens relacionadas

O módulo Ordens é o **hub** de todas as ordens. Ele não tem "ordens relacionadas" — ele **é** as ordens.

## Telas do wireframe

- `screens['caixa-entrada']` (1.1)
- `screens['caixa-saida']` (1.2)
- `screens['historico']` (1.3)