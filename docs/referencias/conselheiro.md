---
modulo: conselheiro
casos: [F7]
depende_de: [03_casos_de_uso, 09_menu_numeracao, 12_tela_inicial, 13_conselheiro]
---

# Módulo Conselheiro — Referência

> **Documento base:** `13_conselheiro.md` (v1.0).
> **Números de menu:** 3.10 (Conselheiro) + card na Tela Inicial do Administrador (1.0).
> **Quando carregar:** analisar os dados e sugerir melhorias ao gestor, consultar a tela do Conselheiro, marcar sugestões como lidas, recalcular sob demanda.

## 1. Conceito

O Conselheiro é um **agente de análise gerencial** que lê os dados do sistema, identifica anomalias/tendências/oportunidades e sugere **melhorias acionáveis** ao gestor, com **dado**, **ação** e **impacto estimado**. Não opera — só sugere.

## 2. As 6 áreas

| Área | Código | O que analisa |
| :--- | :--- | :--- |
| **Rentabilidade** | R1–R10 | Margem por cliente/produto, receita, área. |
| **Custos** | C1–C10 | Custo por fornecedor/categoria, variação. |
| **Caixa** | K1–K10 | Fluxo projetado, inadimplência, concentração. |
| **Impostos** | I1–I7 | Peso dos impostos, créditos, regime. |
| **Eficiência** | E1–E10 | Despesas fixas vs. variáveis, custo por funcionário, ativos. |
| **Risco** | X1–X10 | Concentração de clientes/fornecedores, dependência de produto, saldo negativo. |

## 3. Catálogo de heurísticas

Ver `13_conselheiro.md`, seção 3. Cada heurística tem: código, área, gatilho, sugestão, impacto, esforço, confiança, rota.

## 4. Formato da sugestão

Ver `13_conselheiro.md`, seção 4. Campos: id, area, titulo, descricao, fundamento, impacto, impactoEstimado, esforco, prioridade, confianca, rota, fonte, acaoSugerida, lida, dataGeracao.

## 5. Cálculo de prioridade

```
prioridade = f(impacto, esforco, confianca)

- Alta:   impacto=Alto   E esforco ∈ {Baixo, Médio} E confianca ∈ {Alta, Média}
- Alta:   impacto=Médio  E esforco=Baixo          E confianca=Alta
- Média:  impacto=Alto   E esforco=Alto           OU
          impacto=Médio  E esforco=Médio          OU
          impacto=Baixo  E esforco=Baixo
- Baixa:  resto
```

## 6. Tela do Conselheiro (3.10)

- **Filtros:** período, filial, área, prioridade, mostrar lidas.
- **KPIs:** total de sugestões, altas, médias, baixas.
- **Lista:** agrupada por prioridade (Alta / Média / Baixa) + seção "Sugestões lidas".
- **Ações por sugestão:** Ver dados, Ir para [tela], Marcar como lida, Desmarcar.
- **Ações globais:** Analisar novamente, Marcar todas como lidas, Exportar.
- **Estado vazio:** "Nenhuma sugestão no momento".

## 7. Card no dashboard (Tela Inicial do Administrador)

Mostra as 3 primeiras sugestões de alta prioridade + "Ver todas". Se não houver, mostra "Nenhuma sugestão no momento".

## 8. Regras de negócio

- **RN1** Só emite sugestão com dado + ação + impacto.
- **RN2** Toda sugestão cita a fonte.
- **RN3** Toda sugestão tem confiança.
- **RN4** Não altera dados.
- **RN5** Não substitui Contador/Auditor/Administrador.
- **RN6** Não promete resultado (usa "impacto estimado").
- **RN7** Sugestões fiscais são encaminhadas ao Contador.
- **RN8** O gestor pode marcar/desmarcar como lida.
- **RN9** Automático ao abrir; sob demanda para recalcular.
- **RN10** Heurísticas fixas (fase 1).
- **RN11** Por filial ou consolidado.
- **RN12** Não notifica (fase 1).

## 9. Telas do wireframe

- `screens['conselheiro']` (3.10)
- Card "Sugestões do Conselheiro" na Tela Inicial do Administrador (1.0)
