---
name: gestor-gerencial
description: Skill guarda-chuva do Sistema de Gestão Gerencial com Simulação. Use quando a tarefa envolver qualquer módulo do sistema (configuração, cadastros, entrada de dados, classificação, cálculos, financeiro, relatórios, simulação, administração, ordens ou tela inicial). Carrega apenas o arquivo de referência do módulo relevante. Não use para tarefas fora do escopo do sistema.
---

# Skill guarda-chuva: Gestor Gerencial

## O que é o sistema

Um **Sistema de Gestão Gerencial com Motor de Classificação e Simulação**. Objetivo: registrar o mínimo necessário para que o administrador entenda a estrutura de custos, despesas e investimentos da empresa, e possa simular cenários para tomada de decisão.

**Princípio norteador:** "Não me faça pensar." O sistema sugere ativamente classificações e parâmetros, exibe o "porquê" de cada sugestão e aprende com as correções do usuário.

**Foco:** Comércio e Serviços. Indústria fica para fase 2.

**Limites:** o sistema **não** emite documentos fiscais, não faz escrituração contábil oficial, não gera obrigações acessórias, não emite guias, não controla estoque físico, não calcula obrigações fiscais reais.

**Fora do escopo (recusar):** qualquer tarefa que não pertença aos módulos abaixo — ex.: emissão de NF-e, apuração fiscal real, folha de pagamento oficial, controle de estoque físico.

## Como usar este Skill

Este Skill é um **índice de módulos**. O `SKILL.md` traz a visão geral e o mapa. Cada módulo tem seu **arquivo de referência** com fluxos, regras, exceções e telas.

**Regras de carregamento:**
- Carregue **apenas** o(s) arquivo(s) do(s) módulo(s) relevante(s) para a tarefa.
- Se a tarefa tocar **T5/T6/T7/T8**, carregue também `02_regras_transversais.md` (na raiz do projeto).
- Se tocar **mais de um módulo**, carregue os arquivos correspondentes (ver exemplos abaixo).
- **Sempre** abra/considere a Tela Inicial ao iniciar a interação ou trocar de ator.

| Módulo | Arquivo | Quando carregar |
| :--- | :--- | :--- |
| **Tela Inicial (1.0)** | `referencias/tela-inicial.md` | Consultar o dashboard por ator, componentes e regras. |
| **A/B — Configuração e Cadastros** | `referencias/configuracao.md` | Cadastrar empresa, filial, plano de contas, centros de custo, áreas de negócio, abrir/fechar período, clientes, fornecedores, funcionários, ativos. |
| **C — Entrada de dados** | `referencias/entrada-dados.md` | Importar NF-e, NFS-e, CT-e, RPA, folha; digitar lançamento manual; digitar documento manual. |
| **D — Classificação** | `referencias/classificacao.md` | Sugerir classificação, exibir "porquê", revisar, criar regra, gerenciar regras. |
| **E — Cálculos** | `referencias/calculos.md` | Calcular impostos sobre compras/vendas, consolidar folha, calcular depreciação, consolidar provisões, validar cálculos. |
| **F — Financeiro** | `referencias/financeiro.md` | Gerar contas a pagar/receber, baixar contas, consultar posição de caixa, validar saídas/entradas. |
| **G — Relatórios** | `referencias/relatorios.md` | Gerar DRE, DRE por centro de custo, resumo por área, fluxo de caixa, análise de custos, margem por cliente/produto, posição de caixa, exportar. |
| **H — Simulação** | `referencias/simulacao.md` | Criar cenário, ajustar variáveis, recalcular, salvar, comparar (fase 2). |
| **I — Administração** | `referencias/administracao.md` | Gerenciar usuários, atualizar parâmetros, consultar auditoria, apontar problemas, solicitar correções, validar fechamento. |
| **Ordens** | `referencias/ordens.md` | Consultar caixa de entrada/saída/histórico, emitir/concluir/cancelar ordens, resolver pendências. |
| **Conversões** | `referencias/conversoes.md` | Converter CFOP (saída → entrada), CST (ICMS/IPI/PIS/COFINS/IBS/CBS), consultar matriz de classificação. |

**Exemplo de carga multi-módulo:** importar NF-e → `entrada-dados.md` + `classificacao.md` + `calculos.md` + `financeiro.md` + `ordens.md`.

## Regras transversais (carregar sob demanda)

Carregue `02_regras_transversais.md` (raiz do projeto) **quando** a tarefa envolver:

- Período de competência (**T5**) — toda entrada de dados.
- Pendências Erro/Aviso (**T6**) — fechamento de período, revisão.
- Razão de créditos/débitos (**T7**) — cálculos de impostos, folha, retenções.
- Cadeia de documentos e handoff (**T8**) — fluxo entre atores, caixa de entrada/saída.

## Documentos funcionais de referência

Este Skill pressupõe que os documentos funcionais estão disponíveis na raiz do projeto:

- `00_indice.md` — governança da documentação.
- `01_visao_geral.md` — contexto, limites, fases, projeto.
- `02_regras_transversais.md` — T5, T6, T7, T8.
- `03_casos_de_uso.md` — casos de uso completos (v2.2) + atores + handoff + referência ao menu.
- `04_modelo_de_dados.md` — tabelas, campos, FKs (v1.3).
- `05_apendices.md` — CFOP/CST, matriz, plano de contas, glossário.
- `06_pendencias.md` — pendências (v1.3, 30 itens).
- `07_atores_fluxo.md` — atores funcionais, handoff, caixa de entrada/saída, auditoria.
- `08_ordens.md` — catálogo de 32 ordens (O1–O32).
- `09_menu_numeracao.md` — numeração do menu (blocos 1–12).
- `10_modelo_dados_fisico.md` — DDL completo das 63 tabelas em MariaDB.
- `11_wireframe.md` — descrição do wireframe (telas, dados simulados).
- `12_tela_inicial.md` — dashboard por ator.

## Mapa de telas do wireframe (por ator)

| Ator | Telas (números de menu) |
| :--- | :--- |
| **Tela Inicial (1.0)** | Dashboard por ator — KPIs, alertas, ações rápidas, ordens, resumo. |
| **Meu Trabalho** | 1.1 Caixa de Entrada, 1.2 Caixa de Saída, 1.3 Histórico. |
| **Configurador** | 2.1 Empresa, 2.2 Filiais, 2.3 Centros de Custo, 2.4 Usuários, 2.5 Produtos, 2.6 Serviços, 2.7 Ativos, 2.8 Handoff. |
| **Administrador** | 3.1 DRE, 3.2 DRE por Centro, 3.3 Resumo por Área, 3.4 Fluxo de Caixa, 3.5 Análise de Custos, 3.6 Margem, 3.7 Exportação, 3.8 Posição de Caixa, 3.9 Simulações (fase 2). |
| **Contador** | 4.1 Tabelas Fiscais, 4.2 Plano de Contas, 4.3 Config. Contábeis, 4.4 Config. Fiscais, 4.5 Regras, 4.6 Lançamento Manual, 4.7 Revisão, 4.8 Validação, 4.9 Pendências, 4.10 Preparar Fechamento, 4.11 Fechar Período. |
| **Comprador** | 5.1 Tabelas Basais, 5.2 Fornecedores, 5.3 Digitar Notas, 5.4 Importar XML, 5.5 Revisar Classificações. |
| **Faturista** | 6.1 Tabelas Basais, 6.2 Clientes, 6.3 Digitar Notas, 6.4 Importar XML, 6.5 Revisar Classificações. |
| **Financeiro1** | 7.1 Tabelas Basais, 7.2 Contas a Pagar, 7.3 Pagamentos. |
| **Financeiro2** | 8.1 Tabelas Basais, 8.2 Contas a Receber, 8.3 Recebimentos. |
| **Gerente Financeiro** | 9.1 Validar Saídas, 9.2 Validar Entradas. |
| **RH** | 10.1 INSS, 10.2 IRRF, 10.3 Gerais, 10.4 Funcionários, 10.5 Tabelas Auxiliares, 10.6 Folha. |
| **Auditor** | 11.1 Auditoria (log), 11.2 Documentos, 11.3 Lançamentos, 11.4 Handoff, 11.5 Pendências, 11.6 Apontar, 11.7 Solicitar, 11.8 Validar Fechamento. |

## Fluxo de decisão (qual arquivo carregar)

```text
Tarefa recebida
    │
    ├── Envolve a Tela Inicial (dashboard)?            → referencias/tela-inicial.md
    ├── Envolve cadastro/configuração?                 → referencias/configuracao.md
    ├── Envolve importação/digitação?                  → referencias/entrada-dados.md
    ├── Envolve classificação?                         → referencias/classificacao.md
    ├── Envolve cálculo de impostos/folha/depreciação/provisões? → referencias/calculos.md
    ├── Envolve contas a pagar/receber/caixa?          → referencias/financeiro.md
    ├── Envolve DRE/resumo por área/fluxo de caixa/análise? → referencias/relatorios.md
    ├── Envolve simulação?                             → referencias/simulacao.md
    ├── Envolve usuários/parâmetros/auditoria?         → referencias/administracao.md
    ├── Envolve ordens/caixa de entrada/saída?         → referencias/ordens.md
    └── Envolve conversão de CFOP/CST ou matriz?       → referencias/conversoes.md
```

> Se a tarefa envolver **mais de um módulo**, carregue os arquivos correspondentes.

## Regras de ouro

### Negócio e auditoria

1. **Sempre validar o período** (`T5`): toda entrada de dados só é aceita no período aberto.
2. **Sempre exibir o "porquê"** ao sugerir uma classificação (`D2`).
3. **Nunca alterar dados de períodos fechados** (`T5.4`).
4. **Nunca resolver conflitos de regra sozinho** — exibir as opções ao operador (`D1, FA3`).
5. **Nunca criar regra sem confirmação** do operador (`D4, RN1`).
6. **Nunca emitir guias, notas ou holerites** — o sistema é gerencial.
7. **Sempre registrar em auditoria** as ações relevantes (override, fechamento, criação de regra).
8. **Nunca alterar dados no lugar do Auditor** — o Auditor só consulta, aponta e solicita (`T8.8`).
9. **Sempre respeitar o handoff** — o fluxo entre atores é fixo (`T8.3`).

### Interface

10. **Sempre abrir a Tela Inicial** ao carregar a página (ou ao trocar de ator).

## Limitações

- **Fase 2:** simulação (H1–H5), indústria, integração bancária (CNAB), multa empresa, tela de correção de dados, comparação com realizado, menu com permissões granulares por relatório.
- **Pendências:** ver `06_pendencias.md` (30 itens a avaliar).