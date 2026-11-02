---
modulo: calculos
casos: [E1, E2, E3, E4, E5]
depende_de: [02_regras_transversais, 04_modelo_de_dados, 05_apendices, 08_ordens, 09_menu_numeracao]
---

# Módulo E — Cálculos Automáticos

> **Números de menu:**
> - E1–E5 → 4.8 (Validação de Cálculos)
> - E3 → 10.6 (Folha — consolidação)

> **Regras transversais:** T7 (razão de impostos), T6 (pendências).
> **Ordens relacionadas:** E1/E2 → O11, O30; E3 → O12, O30; E4 → O13; E5 → O14, O30; T7 → O30.

## E1 — Cálculo de impostos sobre compras

**Impostos:** ICMS, IPI, PIS, COFINS, ISS, IBS (0,1% em 2026), CBS (0,9% em 2026). **Retenções** geram débito a recolher.

**Regime fiscal** determina se há crédito. **Divergência** XML vs. calculado → aviso + override. Custo/despesa no DRE é **líquido de créditos**.

**ICMS-ST (RN13):** usa o valor do XML (não recalcula). ST compõe o custo. Cálculo detalhado fica pendente.

**Fase 2:** ICMS-ST detalhado, benefícios fiscais complexos, crédito de ICMS/IPI sobre ativo imobilizado.

**RNs (1–13):** ver `03_casos_de_uso.md#E1`.

**Ordens relacionadas:** O11 (validar impostos), O30 (registrar razão).

## E2 — Cálculo de impostos sobre vendas

Espelho do E1. Todo imposto sobre venda é **débito**, exceto retenção sofrida (**crédito a recuperar**). **Simples Nacional:** DAS unificado, faixa pela receita acumulada de 12 meses. **No DRE:** impostos sobre venda como **dedução da receita**.

**Devolução de venda (RN13):** baixa da receita na fase 1. Estorno de impostos fica pendente.

**Fase 2:** devolução de venda (estorno de impostos), ICMS-ST como substituto.

**RNs (1–13):** ver `03_casos_de_uso.md#E2`.

**Ordens relacionadas:** O11 (validar impostos), O30 (registrar razão).

## E3 — Consolidação da folha

**Consolida** o que foi calculado em C6/C7. Separa por centro de custo e natureza. Integra INSS/FGTS/IRRF ao razão `[T7]`. Aloca custo/despesa e provisões no DRE. Override permitido.

**RNs (1–11):** ver `03_casos_de_uso.md#E3`.

**Ordens relacionadas:** O12 (validar folha), O30 (registrar razão).

## E4 — Cálculo de depreciação

**Método linear padrão.** Início no **mês inicial da depreciação** (campo do ativo). Fórmula: (Valor Original − Valor Residual) ÷ Vida Útil (meses). Lançamento: débito em Despesa/Custo; crédito em (-) Depreciação Acumulada.

**Fase 2:** depreciação acelerada, baixa de ativo com ganho/perda.

**RNs (1–12):** ver `03_casos_de_uso.md#E4`.

**Ordens relacionadas:** O13 (validar depreciação).

## E5 — Consolidação de provisões de férias e 13º

**Cálculo:** férias = (salário + proventos com flag) ÷ 12 × (1 + 1/3); 13º = (salário + proventos com flag) ÷ 12; encargos. **Mensal** (padrão). Encargos geram débito no razão `[T7]`.

**Fase 2:** reversão de provisões, cálculo proporcional para admitidos/demitidos.

**RNs (1–12):** ver `03_casos_de_uso.md#E5`.

**Ordens relacionadas:** O14 (validar provisões), O30 (registrar razão).

## T7 — Razão de impostos

**Definição:** razão por tipo de imposto (PIS, COFINS, ICMS, IPI, ISS, IBS, CBS, IR, CSLL, INSS, FGTS).

**Geração:** compra → crédito; venda → débito; retenção sofrida → crédito a recuperar; retenção efetuada → débito a recolher; folha → débito.

**Apuração:** saldo (débitos − créditos) por tipo, por período.

**Visão gerencial:** alimenta o DRE e a simulação. **Não gera guias.**

**Ordens relacionadas:** O30 (registrar razão).

## Resumo das ordens relacionadas

| Caso de uso | Ordens emitidas | Ordens recebidas |
| :--- | :--- | :--- |
| E1 | O11, O30 | — |
| E2 | O11, O30 | — |
| E3 | O12, O30 | — |
| E4 | O13 | O32 |
| E5 | O14, O30 | O32 |
| T7 | O30 | — |

## Telas do wireframe

- `screens['validacao']` (E1–E5 — validação com override)
- `screens['folha']` (E3 — consolidação da folha)
- `screens['tabelas-inss']`, `screens['tabelas-irrf']`, `screens['tabelas-gerais']` (consulta das tabelas)