---
modulo: simulacao
casos: [H1, H2, H3, H4, H5]
depende_de: [02_regras_transversais, 04_modelo_de_dados, 08_ordens, 09_menu_numeracao]
fase: 2
---

# Módulo H — Simulação (Fase 2)

> **Números de menu:**
> - H1–H5 → 3.9 (Simulações)

> **Regras transversais:** T5 (período — snapshot isolado não altera dados reais).
> **Ordens relacionadas:** nenhuma ordem direta (simulação é experimento).

**Princípio:** snapshot isolado dos dados reais. Nunca altera dados reais. Cenário é imutável após criado.

## H1 — Criar cenário

Nome, descrição, período base, escopo. Snapshot isolado. Cenário multiperíodo. Duplicação. Por filial ou consolidado.

**RNs (1–10):** ver `03_casos_de_uso.md#H1`.

**Ordens relacionadas:** nenhuma ordem direta.

## H2 — Ajustar variáveis

Receita, custos, pessoal, impostos, ativos, financeiro. Ajuste por percentual/valor, global/por item. Recálculo **sob demanda** (fase 1) / tempo real (fase 2). Comparação com base. Reset. Salvar como novo. Simulação de regime.

**RNs (1–11):** ver `03_casos_de_uso.md#H2`.

**Ordens relacionadas:** nenhuma ordem direta.

## H3 — Recalcular e comparar

Comparação lado a lado. Destaque de diferenças. Ranking de impacto. Drill-down. Exportação.

**RNs (1–11):** ver `03_casos_de_uso.md#H3`.

**Ordens relacionadas:** nenhuma ordem direta.

## H4 — Salvar cenário

Imutável. Metadados. Salvar como novo, duplicar, exportar. Status e arquivamento (fase 2).

**RNs (1–11):** ver `03_casos_de_uso.md#H4`.

**Ordens relacionadas:** nenhuma ordem direta.

## H5 — Comparar dois cenários salvos

Lado a lado. Destaque de diferenças. Análise de sensibilidade comparativa (fase 1). Exportação. Comparação de três ou mais cenários (fase 2).

**RNs (1–10):** ver `03_casos_de_uso.md#H5`.

**Ordens relacionadas:** nenhuma ordem direta.

## Resumo das ordens relacionadas

Nenhuma ordem direta. Simulação é experimento e não gera ordens.

## Telas do wireframe

- `screens['simulacoes']` — placeholder com roadmap (fase 2)