documento: visao_geral
versao: 1.1
data: 2026-10-28
proposito: Contexto, limites, princípios, decisões de fase e multi-empresa (tenant) do sistema
depende_de: []
---

# Visão Geral

## 1. O que é o sistema

Um **Sistema de Gestão Gerencial com Motor de Classificação e Simulação**. Objetivo: registrar o mínimo necessário para que o administrador entenda a estrutura de custos, despesas e investimentos da empresa, e possa **simular cenários** para tomada de decisão (fase 2).

## 2. Princípio norteador

**"Não me faça pensar."** O sistema sugere ativamente classificações e parâmetros, exibe o "porquê" de cada sugestão e aprende com as correções do usuário.

## 3. O que o sistema entrega

- **Resumo por área** (Comercial, Operações, Administrativo, etc.).
- **Visão total da empresa**: custos, despesas, investimentos, resultados.
- **Simulações** ("e se...?") sobre dados reais, sem alterá-los (fase 2).
- **Gráficos e relatórios** gerenciais.
- **Cálculo real** de folha (INSS, FGTS, IRRF, encargos, provisões).
- **Cálculo estimado** de tributos (PIS, COFINS, CBS, IBS, IPI, ICMS, ISS, IR, etc.) para fins gerenciais e simulação.

## 4. Para quem é

- **Administrador / Empresário:** tomar decisão, simular cenários, ver resumo por área. Não contábil.
- **Operador / Auxiliar:** alimentar o sistema (importar XMLs, digitar lançamentos, revisar). Operacional.
- **Controller / Contador interno:** configurar plano de contas, regras, parâmetros; validar. Contábil/gerencial.
- **Sistema (ator automático):** classificar, calcular, provisionar, gerar alertas.

Uma mesma pessoa pode acumular papéis numa PME, mas a separação conceitual orienta as telas e permissões.

## 5. Setor inicial

**Foco: Comércio e Serviços.** Indústria fica fora da Fase 1, mas a estrutura do plano de contas já está preparada para incorporá-la (subcontas em "Custos").

## 6. Limites de escopo (o que o sistema NÃO faz)

- ❌ Emissão de documentos fiscais (NF-e, NFS-e, CT-e, RPA).
- ❌ Escrituração contábil oficial (Diário, Razão).
- ❌ Obrigações acessórias (SPED, EFD, DCTF).
- ❌ Guias de recolhimento (DARF, GRF).
- ❌ Holerites, recibos, avisos ao funcionário.
- ❌ Controle de estoque físico (quantidades).
- ❌ Cálculo de obrigações fiscais reais (cálculo fiscal é gerencial e para simulação).

**Aviso obrigatório:** "O cálculo fiscal deste sistema é apenas para referência gerencial e simulação de decisões, não constituindo base para declaração fiscal. Consulte um contador para obrigações fiscais reais."

## 7. Decisões de fase

### 7.1 Fase 1 (definido)

- Importação de XML como via principal de entrada + digitação manual como fallback.
- Classificação automática (motor D1) com revisão e aprendizado.
- Cálculos: impostos sobre compras/vendas, folha, depreciação, provisões.
- Financeiro: contas a pagar/receber, baixa, posição de caixa.
- Relatórios: DRE, DRE por centro de custo, resumo por área, fluxo de caixa, análise de custos, margem por cliente/produto.
- Configuração, cadastros e administração.
- **Multi-empresa (tenant):** uma instalação atende **uma** empresa (tenant). Ver seção 8.

### 7.2 Fase 2 (definido como futuro)

- Simulação (H1–H5).
- Indústria (subcontas em Custos).
- Integração bancária (CNAB) e importação de extratos (OFX).
- **Múltiplas empresas no mesmo usuário (contador externo):** mecanismo de troca de contexto a definir (P41 em `06_pendencias.md`). **Não** é multi-tenant SaaS — é multi-empresa no mesmo login, com isolamento por empresa (seção 8).
- Tela de correção de dados.
- Comparação com realizado (fluxo de caixa).
- Cálculo proporcional de férias/13º para admitidos/demitidos.
- Reversão de provisões (férias gozadas, 13º pago).
- Baixa de ativo (alienação/descarte) e depreciação acelerada.
- Devolução de venda (estorno de impostos) — a baixa da receita já é fase 1.
- Devolução ao fornecedor (redução de custo/despesa e estorno de créditos).
- Retornos (serviço agregado, consignação, perda).
- Benefícios fiscais (tabela e cálculo) — o uso do valor do XML já é fase 1.
- Simples Nacional com múltiplas atividades.
- ICMS-ST detalhado (MVA, alíquota interna) — o uso do valor do XML já é fase 1.
- Créditos não aproveitados.

### 7.3 Pendente (a avaliar)

Itens da fase 2 que serão reavaliados no momento certo, conforme a necessidade do projeto. A lista consolidada está na seção 7.2.

## 8. Multi-empresa (tenant)

### 8.1 Regra R1 — Empresa é o tenant

`empresas.id` é a **unidade de isolamento** do sistema (tenant). Cada `empresa` é **única** no sistema e **não compartilha** dados com nenhuma outra `empresa`. Uma `empresa` pode ter **N filiais** (`filiais.id_empresa`), mas uma `filial` pertence a **exatamente uma** `empresa`. **Não existe** entidade `tenant` separada; `id_empresa` **é** o `id_tenant`.

Consequências:

1. **Não** se cria tabela `tenants`.
2. **Não** se cria coluna `id_tenant`. Onde o isolamento é necessário, usa-se `id_empresa`.
3. `empresas` é a **raiz** do agregado de isolamento.
4. `filiais` é o **único** nível abaixo de `empresa` que recebe lançamentos/documentos. **Não** existe filial de filial.
5. **Dados universais** (domínios fiscais, catálogo de menu, atores funcionais, tabelas INSS/IRRF/encargos) **não** pertencem a nenhuma empresa — são globais ao produto.

### 8.2 Regra R2 — Escopo de empresa obrigatório no acesso a dados

Todo acesso a dados do tenant passa por um **repositório com escopo de empresa**. SQL cru é **proibido** fora do repositório (lint/CI). `id_empresa` vem **sempre** do contexto de autenticação, **nunca** do cliente.

| Grupo | Definição | Filtro |
| :--- | :--- | :--- |
| **A** | Tabela com `id_empresa` direto | `WHERE id_empresa = :t` |
| **F** | Tabela com `id_filial` (herda empresa via filial) | `JOIN filiais f ON f.id = <tabela>.id_filial WHERE f.id_empresa = :t` |
| **C** | Filha pura (herda via pai) | Acessível **só** via pai (grupo A ou F) |
| **U** | Universal (global ao produto) | Sem filtro |
| **H** | Híbrida (`parametros_fiscais`) | `WHERE id_empresa = :t OR id_empresa IS NULL` |

### 8.3 Regra R3 — Não desnormalizar `id_empresa` em tabelas com `id_filial`

A empresa é alcançável via `filiais.id_empresa`. **Não** se cria coluna `id_empresa` nas tabelas do grupo F. **Não** há trigger de cópia, **não** há FK composta, **não** há backfill. A consistência é **estrutural** (impossível divergir, porque a coluna não existe).

**Mapa completo das 63 tabelas:** ver `04_modelo_de_dados.md` (seção "Multi-empresa (tenant)").

### 8.4 Mecanismo de segurança

A garantia de isolamento **não** vem do banco (MariaDB não tem Row-Level Security nativa). Vem de **quatro camadas**:

1. **Repositório com escopo obrigatório** — única porta de entrada.
2. **Proibição de SQL cru** fora do repositório (lint/CI).
3. **Testes de isolamento** — para cada tabela dos grupos A e F, tentar acessar registro de outra empresa e **deve** falhar.
4. **Code review** com checklist "tem `id_empresa` ou JOIN com `filiais`?".

Sem as 4, vaza — com ou sem coluna desnormalizada.

## 9. Nomenclatura

- **"Vendedores"** é substituído por **"Comissionados"** — quem recebe comissão (vendedor interno, representante, autônomo, parceiro).
- **"Documento"** = nota fiscal (NF-e, NFS-e, CT-e, RPA).
- **"Lançamento"** = registro em partidas dobradas (débito + crédito).
- **"Conta analítica"** = conta que recebe lançamento. **"Conta sintética"** = conta que apenas soma.
- **"Período aberto"** = período que aceita lançamentos. **"Período fechado"** = período congelado.
- **"Snapshot"** = cópia instantânea dos dados para simulação.
- **"Tenant"** = unidade de isolamento do sistema. Neste sistema, **tenant = empresa** (`empresas.id`). Ver seção 8.

## 10. Princípios de evolução

- **Motor de classificação (D):** peça mais sensível, evoluirá com o uso real. Alterações devem ser retrocompatíveis (classificações já realizadas ficam registradas com a justificativa da época).
- **Módulo de impostos (E):** depende de mudanças legais (reforma tributária, alíquotas estaduais/municipais, benefícios). Versão 1 é ponto de partida.
- **Módulo de simulação (H):** diferencial do sistema. A arquitetura deve prever flexibilidade para adicionar variáveis, comparações e visualizações sem quebrar cenários já criados.
- **Tela de correção de dados:** a detalhar. Permitirá correções de lançamentos, impostos calculados, classificações e valores, com justificativa obrigatória e log de auditoria.
- **Isolamento por empresa (tenant):** é **estrutural**. Não desnormalizar `id_empresa` em tabelas que já têm `id_filial` (R3). O filtro é responsabilidade do repositório (R2). Alterações futuras no modelo devem preservar R1–R3.

## 11. Projeto de desenvolvimento (Fase 1)

**Premissa:** ordem por **prioridade de valor**. O que entrega decisão mais cedo vem antes. O que é operacional e depende de muitos cadastros vem depois. O que é refinamento vem por último.

### 11.1 Onda 1 — Relevante (MVP funcional)

**Objetivo:** o gestor já vê resultado gerencial (DRE, resumo por área, caixa) com lançamentos manuais, sem depender de importação.

| Passo | Entregáveis |
| :--- | :--- |
| 1.1 Fundação | Modelo de dados base (domínios, empresa, filial, plano de contas, centros de custo, áreas); cadastro de empresa + filial matriz + primeiro período aberto; plano de contas (sintética/analítica, sub-tipo fixo/variável); centros de custo e áreas de negócio; abrir/fechar período com checklist básico. **Multi-empresa (tenant) conforme seção 8.** |
| 1.2 Pessoas e itens | Pessoas (PF/PJ) com tags (Cliente, Fornecedor, Funcionário, Comissionado, Autônomo, Transportadora); Produtos e Serviços (NCM, LC 116); Bancos e Contas bancárias; Formas e Condições de pagamento; Proventos/Descontos (flags INSS/FGTS/IRRF); Regras de comissão. |
| 1.3 Lançamentos manuais e financeiro básico | Lançamento manual com partidas dobradas transparentes; Contas a pagar/receber (parcelas, vencimento, status, baixa); Baixa com juros/multa/desconto; Posição de caixa; DRE Gerencial. |
| 1.4 Documentos manuais | Digitação manual de NF-e, NFS-e, CT-e e RPA (com itens e impostos); Conversão de CFOP/CST; Cálculo de impostos sobre compras (E1) e vendas (E2); Geração de contas a pagar/receber; Razão de impostos (T7). |
| 1.5 Folha, depreciação e provisões | Digitação de folha (C7) com cálculo real; Cálculo de depreciação (E4); Consolidação de provisões (E5); Integração ao razão e ao DRE; Relatório de pendências (T6). |
| 1.6 Relatórios gerenciais | DRE por centro de custo; Resumo por área (dashboard); Posição de caixa e fluxo projetado básico; Análise de custos; KPIs; Exportação. |

### 11.2 Onda 2 — Importante (operação completa)

| Passo | Entregáveis |
| :--- | :--- |
| 2.1 Importação de NF-e | XMLs em lote; Identificação de formato; Conversão de CFOP/CST; Identificação da filial pelo CNPJ; Geração de documentos, lançamentos e contas; Log de importação. |
| 2.2 Importação de NFS-e, CT-e e RPA | NFS-e (LC 116, ISS, retenções); CT-e (ICMS sobre frete, CIF/FOB); RPA (INSS/IRRF/ISS); Formatos não reconhecidos (aviso + registro). |
| 2.3 Motor de classificação | Motor D1 (fontes de regra, prioridade 1–8, fallback); Tela de revisão (D3); Exibição do "porquê" (D2); Gestão de regras (D5); Aprendizado (D4). |
| 2.4 Cálculos completos e razão | Impostos sobre compras/vendas com todas as regras da fase 1; Razão de impostos (T7); Impostos por filial; Peso dos impostos na receita. |
| 2.5 Relatórios avançados | Margem por produto e por cliente; Ponto de equilíbrio; Análise vertical e horizontal; Comparação com ano anterior; Evolução mensal; Conformidade. |
| 2.6 Administração e auditoria | Usuários e permissões por filial (I1); Atualização de parâmetros com vigência (I2); Auditoria completa (I3). |

### 11.3 Onda 3 — Evolução (refinamento e preparação para a fase 2)

| Passo | Entregáveis |
| :--- | :--- |
| 3.1 Refinamento do motor | Subprioridades; Regras por CST e tipo de documento; Simulação de impacto; Importação de regras em lote. |
| 3.2 Refinamento de relatórios | Análise de tendência (regressão); Desperdícios; Comparação com realizado (fluxo de caixa). |
| 3.3 Tela de correção de dados | Correção de lançamentos, impostos, classificações e valores, com auditoria. |
| 3.4 Preparação para a fase 2 | Estrutura de cenários (H1) sem lógica completa; Estrutura de importação de planilhas; Estrutura de integração bancária (CNAB) sem lógica completa; **Mecanismo de troca de contexto para contador externo (P41).** |
```

---

## Resumo das mudanças no `01_visao_geral.md`

| Item | Antes | Depois |
| :--- | :--- | :--- |
| Frontmatter | v1.0, 2026-10-21 | **v1.1, 2026-10-28** |
| Seção 7.1 | — | + item "Multi-empresa (tenant)" |
| Seção 7.2 | "Múltiplas empresas" (ambíguo) | **"Múltiplas empresas no mesmo usuário (contador externo)"** + P41 |
| Seção 8 | Nomenclatura | **Nova: "Multi-empresa (tenant)"** com R1, R2, R3, mecanismo de segurança |
| Seção 9 | Princípios de evolução | Nomenclatura (renumerada) + item "Tenant" |
| Seção 10 | Projeto | Princípios de evolução (renumerada) + item "Isolamento por empresa" |
| Seção 11 | — | Projeto (renumerada) + referência à seção 8 no passo 1.1 + P41 no passo 3.4 |

---
