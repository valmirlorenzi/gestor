---
modulo: tela_inicial
casos: []
depende_de: [07_atores_fluxo, 09_menu_numeracao]
---

# Módulo Tela Inicial — Referência

> **Números de menu:**
> - 1.0 (Tela Inicial)

> **Documento base:** `12_tela_inicial.md` (v1.0).
> **Quando carregar:** consultar a Tela Inicial, seus componentes ou o conteúdo por ator.

## 1. Conceito

A Tela Inicial é o **dashboard por ator** — o primeiro item do menu (1.0). Mostra: saudação, alertas, KPIs, ações rápidas, minhas ordens e resumo.

## 2. Componentes

| Componente | O que faz |
| :--- | :--- |
| `ti-saudacao` | "Olá, [nome]" + data + período + filial. |
| `ti-alertas` | Lista de alertas (urg, err, warn, info) com link. |
| `ti-kpis` | 4 cards com label e valor. |
| `ti-acoes` | 4 botões com ícone e label. |
| `ti-ordens` | 3 primeiras ordens + "Ver todas". |
| `ti-resumo` | Bloco livre (lista, mini-DRE, tabela, timeline). |

## 3. Conteúdo por ator

Ver `12_tela_inicial.md`, seção 3.

## 4. Regras de negócio

- **RN1** Fixa por ator na fase 1.
- **RN2** Primeiro item do menu (1.0).
- **RN3** Abre ao carregar a página e ao trocar de ator.
- **RN4** Alertas, ações e ordens são clicáveis.
- **RN5** A Tela Inicial **aponta** para as telas, não substitui.
- **RN6** Conteúdo varia por ator.

## 5. Telas do wireframe

- `screens['tela-inicial']` — dashboard adaptado por ator.