---
documento: indice
versao: 1.8
data: 2026-10-28
proposito: Governança da documentação funcional do sistema
---

# Índice da Documentação Funcional

Documentação funcional do **Sistema de Gestão Gerencial com Simulação**.

## Documentos vigentes

| Documento | Arquivo | Versão | Escopo | Depende de |
| :--- | :--- | :--- | :--- | :--- |
| Índice | `00_indice.md` | 1.8 | Governança | — |
| Visão Geral | `01_visao_geral.md` | 1.1 | Contexto, limites, princípios, fases, projeto, **multi-empresa (tenant)** | — |
| Regras Transversais | `02_regras_transversais.md` | 1.1 | T5, T6, T7, T8 | — |
| Casos de Uso | `03_casos_de_uso.md` | 2.4 | A, B, C, D, E, F, G, H, I (completo) + atores funcionais + OSI + ordens (O1–O32) | 01, 02, 04, 05, 07, 08, 09, 12 |
| Modelo de Dados | `04_modelo_de_dados.md` | 1.4 | Tabelas, campos, FKs + atores/OSI + campos de ordem em `tarefa` + menu + **multi-empresa (tenant)** | 01, 02, 07, 08, 09 |
| Apêndices | `05_apendices.md` | 1.0 | CFOP/CST, matriz, plano de contas, glossário | 01, 02, 04 |
| Pendências | `06_pendencias.md` | 1.7 | 42 pendências com contexto (a 26 removida; 42 e 43 novas; 15 e 34 ajustadas) | 01, 03, 05, 07, 08, 09, 13, 14 |
| Atores e Fluxo | `07_atores_fluxo.md` | 1.1 | Atores funcionais, OSI, caixa de entrada/saída, auditoria, T8 | 01, 02, 04 |
| Ordens | `08_ordens.md` | 1.0 | Catálogo de 32 ordens (O1–O32), mapeamentos, ações, transições, `dados_extras` | 02, 03, 04, 07 |
| Menu e Numeração | `09_menu_numeracao.md` | 1.2 | Numeração dos itens do menu (blocos 1–12), campo "Ir para", tabela `menu_item` | 07, 12 |
| Modelo de Dados Físico | `10_modelo_dados_fisico.md` | 1.1 | DDL completo das 63 tabelas em MariaDB (tipos, índices, FKs, seeds, views) + **notas de multi-empresa (sem DDL)** | 04 |
| Wireframe | `11_wireframe.md` | 1.1 | Descrição do wireframe HTML/CSS/JS, telas, dados simulados | 03, 08, 09, 10, 12 |
| Tela Inicial | `12_tela_inicial.md` | 1.1 | Dashboard por ator (KPIs, alertas, ações, ordens, resumo) | 03, 07, 08, 09 |
| Relatórios do Administrador | `13_relatorios_administrador.md` | 1.1 | Proposta aprovada de expansão (G8–G15): Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo | 01, 02, 03, 04, 06, 08, 09, 12 |
| Conselheiro | `14_conselheiro.md` | 1.0 | Agente de análise gerencial que sugere melhorias acionáveis ao gestor | 01, 02, 03, 09, 11, 12 |


## Mapa assunto → documento

| Assunto | Onde encontrar |
| :--- | :--- |
| O que é o sistema / para quem | `01_visao_geral.md` |
| Limites de escopo (o que NÃO faz) | `01_visao_geral.md` |
| Decisões de fase (fase 1 vs. fase 2 vs. pendente) | `01_visao_geral.md` (seção 7) + `06_pendencias.md` |
| Princípios de evolução | `01_visao_geral.md` |
| Projeto de desenvolvimento (ondas e passos) | `01_visao_geral.md` (seção 11) |
| **Multi-empresa (tenant)** — R1, R2, R3 | `01_visao_geral.md` (seção 8) + `04_modelo_de_dados.md` (seção "Multi-empresa (tenant)") |
| **Contador externo / troca de contexto** | `06_pendencias.md` (pendências 15 e 43) |
| **Filtro de empresa nas views** | `06_pendencias.md` (pendência 42) |
| Período de competência (T5) | `02_regras_transversais.md` |
| Pendências Erro/Aviso (T6) | `02_regras_transversais.md` |
| Razão de créditos/débitos de impostos (T7) | `02_regras_transversais.md` |
| Cadeia de documentos e OSI (T8) | `02_regras_transversais.md` + `07_atores_fluxo.md` |
| Atores funcionais | `07_atores_fluxo.md` |
| Fluxo de documentos entre setores | `07_atores_fluxo.md` |
| Caixa de entrada e saída | `07_atores_fluxo.md` + `08_ordens.md` |
| Cadastro de usuários com tags | `07_atores_fluxo.md` |
| Ordens (O1–O32) | `08_ordens.md` |
| Mapeamento ordem → caso de uso | `08_ordens.md` (seção 4) |
| Ações por ordem | `08_ordens.md` (seção 8) |
| Transições por ordem | `08_ordens.md` (seção 9) |
| `dados_extras` por ordem | `08_ordens.md` (Apêndice A) |
| Numeração do menu (1.0–12.5) | `09_menu_numeracao.md` |
| Campo "Ir para" do menu | `09_menu_numeracao.md` |
| Tabela `menu_item` | `09_menu_numeracao.md` |
| DDL das tabelas (MariaDB) | `10_modelo_dados_fisico.md` |
| Telas do wireframe | `11_wireframe.md` |
| Atores e casos de uso (A–I) | `03_casos_de_uso.md` |
| Margem por cliente/produto | `03_casos_de_uso.md` (G6) |
| Balanço Patrimonial (G8) | `13_relatorios_administrador.md` (seção 4) |
| Painel Executivo (G9) | `13_relatorios_administrador.md` (seção 4) |
| Aging de Contas (G10) | `13_relatorios_administrador.md` (seção 4) |
| Posição de Impostos (G11) | `13_relatorios_administrador.md` (seção 4) |
| Posição de Pessoal (G12) | `13_relatorios_administrador.md` (seção 4) |
| Posição de Ativos (G13) | `13_relatorios_administrador.md` (seção 4) |
| Ponto de Equilíbrio (G14) | `13_relatorios_administrador.md` (seção 4) |
| Resumo Executivo (G15) | `13_relatorios_administrador.md` (seção 4) |
| Proposta de expansão (G8–G15) | `13_relatorios_administrador.md` |
| Fluxo de cada caso (com RN, FA, EX, telas) | `03_casos_de_uso.md` |
| Plano de contas | `01_visao_geral.md` + `04_modelo_de_dados.md` + `05_apendices.md` (seção D) |
| Tabelas, campos e relacionamentos (lógico) | `04_modelo_de_dados.md` |
| Conversão de CFOP (saída → entrada) | `05_apendices.md` (seção A) |
| Conversão de CST (ICMS, IPI, PIS/COFINS, IBS/CBS) | `05_apendices.md` (seção B) |
| Matriz de classificação (CFOP + CST → conta) | `05_apendices.md` (seção C) |
| Glossário | `05_apendices.md` (seção E) |
| Pendências (fase 2 / avaliação futura) | `06_pendencias.md` |
| Tela Inicial (dashboard) | `12_tela_inicial.md` |
| Conteúdo da Tela Inicial por ator | `12_tela_inicial.md` (seção 3) |
| Relatórios do Administrador (G8–G15) | `13_relatorios_administrador.md` |
| Conselheiro (sugestões de melhoria) | `14_conselheiro.md` |
| Catálogo de heurísticas do Conselheiro (57) | `14_conselheiro.md` (seção 3) |
| Formato da sugestão do Conselheiro | `14_conselheiro.md` (seção 4) |

## Estado das decisões

- **Fase 1 (definido):** escopo, casos de uso base, modelo de dados, regras transversais (T5–T8), atores funcionais, OSI fixo, caixa de entrada/saída, ordens (O1–O32), numeração de menu, DDL das 63 tabelas, wireframe completo.
- **Multi-empresa (tenant) — definido (v1.1 do `01` e v1.4 do `04`):** `empresa` = tenant (R1), escopo de empresa obrigatório no repositório (R2), não desnormalizar `id_empresa` em tabelas com `id_filial` (R3). Sem `id_tenant`, sem tabela `tenants`. Pendências 42 (filtro nas views) e 43 (contador externo) em `06`.
- **Fase 2 (definido como futuro):** 42 pendências efetivas em `06_pendencias.md` (a 26 removida por duplicidade; a 15 e a 34 ajustadas; 42 e 43 novas).
- **Pendente (a avaliar):** lista consolidada em `06_pendencias.md`.

## Como esta documentação é organizada (para IA)

- Cada documento tem **frontmatter YAML** (nome, versão, data, escopo, dependências).
- Seções têm **âncoras estáveis** (ex: `#D1`), referenciáveis por Skills/Agentes.
- **Regras são numeradas** (T5.1, T8.1, R9, RC1, RN1…) e escritas em formato "se/então" quando possível.
- **Casos de uso seguem template fixo** (Nome, Ator, Pré-condições, Fluxo, Alternativos, Exceções, Pós-condições, Regras, Telas).
- **Ordens seguem template fixo** (Código, Quem emite, Quem executa, Documento de origem, O que carrega, O que o destino faz, Processamento, Próxima ordem, Caso de uso, OSI, Ações, Transições, `dados_extras`).
- **Tabelas para tudo que é comparável** (regras, campos, conversões).
- **Não há histórico de versão no corpo** — o histórico fica neste índice.

## Histórico de versões desta documentação

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-21 | Separação do Documento Consolidado (v3.6) e do Documento de Escopo (v1.0) em 6 documentos funcionais. |
| 1.1 | 2026-10-22 | Reconstrução do `03_casos_de_uso.md` em versão 2.0 (completo, com todas as RN, FA, EX, pós-condições e telas de A–I). |
| 1.2 | 2026-10-22 | Criação do `07_atores_fluxo.md` (v1.1); acréscimo de T8 em `02`; ajustes em `03` (v2.1) e `04` (v1.1); acréscimo de 7 pendências em `06` (v1.1). |
| 1.3 | 2026-10-23 | Criação do `08_ordens.md` (v1.0); acréscimo de 4 pendências em `06` (v1.2); ajustes em `03` (v2.1 — referência às ordens) e `04` (v1.2 — campos de ordem em `tarefa`). |
| 1.4 | 2026-10-24 | Criação do `09_menu_numeracao.md` (v1.0), `10_modelo_dados_fisico.md` (v1.0) e `11_wireframe.md` (v1.0); ajustes em `03` (v2.2 — referência aos números de menu), `04` (v1.3 — tabela `menu_item`), `06` (v1.3 — pendências de numeração e wireframe). |
| 1.5 | 2026-10-24 | Criação do `12_tela_inicial.md` (v1.0); ajustes em `03` (v2.3 — caso de uso F6 e menu 1.0), `09` (v1.1 — item 1.0 e renumeração do bloco 1), `11` (v1.1 — tela inicial) e `manual` (v1.3 — seção da tela inicial). |
| 1.6 | 2026-10-25 | **Merge do `13` (v1.1).** Inclusão do `13_relatorios_administrador.md`. Atualização de versões: `03` (2.4), `06` (1.5), `09` (1.2), `12` (1.1). 8 novas linhas no mapa assunto → documento (Balanço, Painel Executivo, Aging, Posição de Impostos, Posição de Pessoal, Posição de Ativos, Ponto de Equilíbrio, Resumo Executivo). |
| 1.7 | 2026-10-26 | Criação do `14_conselheiro.md` (v1.0); ajustes em `03` (v2.4 — caso de uso F7), `06` (v1.5 — pendências 37–40), `09` (v1.3 — item 3.18), `11` (v1.2 — tela 3.18), `12` (v1.1 — card do Conselheiro), `manual` (v1.4 — seção 11.8), `SKILL` (v1.3 — módulo Conselheiro), `agente-administrador` (v1.3 — Conselheiro no escopo). |
| 1.8 | 2026-10-28 | **Adoção da regra empresa = tenant (R1–R3).** `01` → v1.1 (nova seção 8 "Multi-empresa (tenant)"; seção 7.2 reescrita). `04` → v1.4 (nova seção "Multi-empresa (tenant)" com mapa U/E/A/F/C/H; observação final 19). `06` → v1.7 (reescrita da pendência 15; ajuste da 34; novas pendências 42 e 43). `10` → v1.1 (notas de convenção, sem DDL). Mapa assunto → documento: nova linha "Multi-empresa (tenant)", "Contador externo", "Filtro de empresa nas views". Estado das decisões: novo bloco multi-empresa. |
```

---

## Resumo das mudanças no `00_indice.md`

| Item | Antes | Depois |
| :--- | :--- | :--- |
| Frontmatter | v1.7, 2026-10-26 | **v1.8, 2026-10-28** |
| Linha `00_indice` | 1.5 (desatualizado) | **1.8** |
| Linha `01_visao_geral` | 1.0 | **1.1** + escopo "multi-empresa (tenant)" |
| Linha `04_modelo_de_dados` | 1.3 | **1.4** + escopo "multi-empresa (tenant)" |
| Linha `06_pendencias` | 1.5 | **1.7** + escopo "42 pendências (a 26 removida; 42 e 43 novas; 15 e 34 ajustadas)" |
| Linha `10_modelo_dados_fisico` | 1.0 | **1.1** + escopo "notas de multi-empresa (sem DDL)" |
| Linha `07_atores_fluxo` depende_de | `01, 02, 04` | Mantido (sem mudança de conteúdo, mas o `01` está em v1.1) |
| **Mapa assunto → documento** | — | + 3 linhas: "Multi-empresa (tenant)", "Contador externo", "Filtro de empresa nas views" |
| **Estado das decisões** | — | + bloco "Multi-empresa (tenant) — definido" |
| **Histórico** | v1.7 | **+ linha 1.8** |

> ⚠️ **Observações sobre inconsistências pré-existentes no índice (não corrigidas nesta rodada, para não expandir escopo):**
> - A linha `00_indice` na tabela "Documentos vigentes" estava em **1.5** (deveria ser 1.7 antes desta rodada). Corrigido para **1.8**.
> - A linha `06_pendencias` na tabela estava em **1.5** (deveria ser 1.6 antes desta rodada). Corrigido para **1.7**.
> - A linha `10_modelo_dados_fisico` estava em **1.0** (correto antes desta rodada). Atualizado para **1.1**.
> - A seção "Fase 2" em "Estado das decisões" dizia "29 pendências efetivas" (desatualizado — o `06` já estava em 35 na v1.5). Corrigido para **42**.
> - O `depende_de` do `06` na tabela estava `01, 03, 05, 07, 08, 09` (faltavam `13` e `14`). Corrigido.

---
    