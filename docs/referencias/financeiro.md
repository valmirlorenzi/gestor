---
modulo: financeiro
casos: [F1, F2, F3, F4, F5]
depende_de: [02_regras_transversais, 04_modelo_de_dados, 07_atores_fluxo, 08_ordens, 09_menu_numeracao]
---

# Módulo F — Financeiro

> **Números de menu:**
> - F1 → 7.2 (Contas a Pagar) · F2 → 8.2 (Contas a Receber)
> - F3 → 7.2/7.3 (Pagamentos) e 8.2/8.3 (Recebimentos), 9.1 (Validar Saídas) e 9.2 (Validar Entradas)
> - F4 → 3.8 (Posição de Caixa)
> - F5 → 1.1/1.2/1.3 (Caixa de Entrada/Saída/Histórico)

> **Regras transversais:** T5 (período), T6 (pendências), T7 (razão), T8 (handoff).
> **Ordens relacionadas:** F1 → O15; F2 → O16; F3 → O17, O18, O19, O20; F4 → nenhuma; F5 → todas (hub das ordens).

## F1 — Contas a pagar a partir de compras

Uma compra pode gerar uma ou várias contas (parcelamento). Forma de pagamento define: à vista (direto em Caixa/Banco), a prazo (com vencimentos), cartão (data da fatura). Retenções geram **contas a recolher**. Reprocessamento substitui (com auditoria).

**Fase 2:** prazo de repasse por operadora de cartão.

**RNs (1–11):** ver `03_casos_de_uso.md#F1`.

**Ordens relacionadas:** O15 (gerar conta a pagar).

## F2 — Contas a receber a partir de vendas

Espelho do F1. Retenções sofridas geram **contas a recuperar** `[T7]`. Cartão: vencimento na data do repasse (configurável).

**RNs (1–11):** ver `03_casos_de_uso.md#F2`.

**Ordens relacionadas:** O16 (gerar conta a receber).

## F3 — Baixa de contas

Total ou parcial. Juros/multa calculados automaticamente (com override). Desconto informado. Integração ao fluxo de caixa (F4) e ao razão `[T7]`. Baixa em lote (fase 1). Estorno permitido (com auditoria).

**Fase 2:** importação de arquivo de remessa do banco (CNAB).

**RNs (1–10):** ver `03_casos_de_uso.md#F3`.

**Ordens relacionadas:** O17 (pagar), O18 (receber), O19 (validar saída), O20 (validar entrada).

## F4 — Posição de caixa e bancos

**Posição atual:** Caixa + Bancos + Aplicações − Contas a pagar em aberto + Contas a receber em aberto. **Fluxo projetado:** por dia/semana/mês. Filtros. Alertas de saldo negativo e concentração de vencimentos.

**Estimativas (RN11):** contas sem valor/vencimento podem receber "valor/vencimento aproximado", usados **apenas em simulações** (fase 2).

**Fase 2:** comparação com realizado.

**RNs (1–12):** ver `03_casos_de_uso.md#F4`.

**Ordens relacionadas:** nenhuma ordem direta (é consulta).

## F5 — Caixa de entrada e caixa de saída

**Caixa de entrada:** fila única de trabalho — ordens pendentes e em andamento, urgentes destacadas.
**Caixa de saída:** ordens emitidas e ainda pendentes/em andamento.
**Histórico:** consulta separada (ordens concluídas/canceladas).

Ver `08_ordens.md` (seção 7 — fluxo de estados; seção 10 — filtros).

**Ordens relacionadas:** todas (é o hub das ordens).

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| F1 | O15 | — |
| F2 | O16 | — |
| F3 | O17, O18, O19, O20 | — |
| F4 | — | — |
| F5 | — | Todas |

## Telas do wireframe

- `screens['contas-pagar']`, `screens['contas-receber']`
- `screens['pagamentos']`, `screens['recebimentos']` (mesmas telas, foco em baixa)
- `screens['validar-saidas']`, `screens['validar-entradas']` (Gerente Financeiro)
- `screens['posicao-caixa']` (F4)
- `screens['tabelas-basais-fin1']`, `screens['tabelas-basais-fin2']` (tabelas de apoio)