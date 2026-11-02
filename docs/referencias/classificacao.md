---
modulo: classificacao
casos: [D1, D2, D3, D4, D5]
depende_de: [02_regras_transversais, 05_apendices, 08_ordens, 09_menu_numeracao]
---

# Módulo D — Classificação Automática

> **Números de menu:**
> - D3 → 4.7 (Revisão de Lançamentos do Contador) / 5.5 (Comprador) / 6.5 (Faturista)
> - D5 → 4.5 (Regras de Classificação)

> **Regras transversais:** T6 (pendências), T8 (handoff).
> **Ordens relacionadas:** D1 → O7, O8; D2 → nenhuma; D3 → O7, O27; D4 → nenhuma; D5 → O8.

## D1 — Sugestão de classificação automática

**Ator:** Sistema. **Acionado em:** C1, C2, C3, C6, C8, C4, C5, C7; sob demanda na revisão (D3).

**Fontes de regra (prioridade 1→8):**
1. Regra específica (fornecedor + CFOP)
2. CFOP
3. Categoria do fornecedor
4. NCM
5. Código de serviço (LC 116)
6. Histórico/descrição
7. Histórico de classificações anteriores
8. Fallback (conta genérica "a classificar")

**Fluxo:**
1. Extrair contexto (tipo de documento, CFOP, NCM, código de serviço, fornecedor/cliente, categoria, histórico, valor, natureza).
2. Percorrer fontes em ordem de prioridade.
3. Se regra aplicável → usar conta, centro de custo, contrapartida.
4. Se mais de uma regra na mesma prioridade → mais específica ou **conflito** (FA3).
5. Sem regra → **fallback** (conta genérica, pendência **Erro** `[T6]`).
6. Montar sugestão + justificativa (D2).
7. Operador aceita/altera/rejeita (D3).
8. Alteração → oferecer criar regra (D4).

**FA1** Confiança alta pode dispensar revisão.
**FA2** Confiança baixa sempre entra na fila.
**FA3** Conflito → operador escolhe.
**FA4** Rateio por centro de custo.
**FA5** Classificação item a item.
**FA6** Reclassificação registra auditoria e oferece criar regra.

**RNs (1–9):** ver `03_casos_de_uso.md#D1`.

**Ordens relacionadas:** O7 (revisar classificação), O8 (resolver conflito).

## D2 — Exibição do "porquê"

Justificativa em **português claro**: conta sugerida, regra aplicada, contexto considerado, prioridade, confiança. Botão "Por que?" para detalhe. Justificativa **registrada** no lançamento.

**RNs (1–8):** ver `03_casos_de_uso.md#D2`.

**Ordens relacionadas:** nenhuma ordem direta (a justificativa é exibida dentro da O7).

## D3 — Tela de revisão de lançamentos

Lista de pendentes com filtros. Para cada um: dados, sugestão, resumo da justificativa, botões **Aceitar / Alterar / Rejeitar**. Ações em lote (aceitar confiança alta; ver justificativas). Reclassificação permitida **antes do fechamento**.

**RNs (1–9):** ver `03_casos_de_uso.md#D3`.

**Ordens relacionadas:** O7 (revisar classificação), O27 (reclassificar lançamento).

## D4 — Aprendizado e criação de regras

Sistema **sugere** criar regra (não cria sozinho). Operador escolhe: criar com o contexto identificado, ampliar, restringir, ou não criar. Criação em lote (fase 1). Desativação de regra é feita pelo Contador (D5).

**RNs (1–10):** ver `03_casos_de_uso.md#D4`.

**Ordens relacionadas:** nenhuma ordem direta (a criação de regra é feita na tela, não gera ordem).

## D5 — Gestão de regras pelo Contador

Lista de regras com filtros. Detalhes com estatísticas e histórico. Contador (acumula Controller na fase 1) pode criar, editar, ativar/desativar, ajustar prioridade (1–8), testar. Desativação não apaga. Alterações não afetam classificações de períodos fechados `[T5]`.

**Fase 2:** subprioridades, simulação de impacto, importação de regras em lote.

**RNs (1–10):** ver `03_casos_de_uso.md#D5`.

**Ordens relacionadas:** O8 (resolver conflito).

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| D1 | O7, O8 | — |
| D2 | — | — |
| D3 | O7, O27 | O7, O10 |
| D4 | — | — |
| D5 | — | O8 |

## Telas do wireframe

- `screens['revisao-lancamentos']` (D3 — visão do Contador, todas as direções)
- `screens['revisao-classificacoes']` (D3 — visão do Comprador/Faturista, filtrada por direção)
- `screens['regras-classificacao']` (D5)