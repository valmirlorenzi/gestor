---
documento: modelo_de_dados
versao: 1.5
data: 2026-11-02
proposito: Tabelas, campos, tipos e relacionamentos do sistema + campos de ordem + tabela menus_itens + multi-empresa (tenant) + sincronização com a implementação
depende_de: [01_visao_geral, 02_regras_transversais, 07_atores_fluxo, 08_ordens, 09_menu_numeracao]
---

# Modelo de Dados

## Convenções

- `id` = chave primária (surrogate key, auto-incremento ou UUID — a definir na fase técnica).
- `id_xxx` = chave estrangeira.
- `[tipo]` = tipo do campo (ex: `[char(14)]`, `[numeric(15,2)]`, `[date]`, `[json]`).
- **(R)** = tabela de referência (domínio).
- **(J)** = tabela com campo `dados_extras [json]` para dados específicos da empresa.
- **Auditoria padrão** (em todas as tabelas principais, não repetida abaixo):
  - `created_at [timestamp]`, `updated_at [timestamp]`
  - `created_by [id_usuario]`, `updated_by [id_usuario]`
  - `deleted_at [timestamp]`, `deleted_by [id_usuario]` (soft delete)
- **Soft delete:** registros não são excluídos fisicamente; são marcados com `deleted_at`.
- **Estrutura organizacional:** uma empresa, 1:N filiais. Filial recebe os lançamentos. CNPJ identifica a filial na importação de XML.
- **Multi-empresa (tenant):** ver seção seguinte. `empresas.id` é o tenant.

## Multi-empresa (tenant)

### R1 — Empresa é o tenant

`empresas.id` é a **unidade de isolamento** do sistema (tenant). Cada `empresa` é **única** no sistema e **não compartilha** dados com nenhuma outra `empresa`. Uma `empresa` pode ter **N filiais** (`filiais.id_empresa`), mas uma `filial` pertence a **exatamente uma** `empresa`. **Não existe** entidade `tenant` separada; `id_empresa` **é** o `id_tenant`.

Consequências:

1. **Não** se cria tabela `tenants`.
2. **Não** se cria coluna `id_tenant`. Onde o isolamento é necessário, usa-se `id_empresa`.
3. `empresas` é a **raiz** do agregado de isolamento.
4. `filiais` é o **único** nível abaixo de `empresa` que recebe lançamentos/documentos. **Não** existe filial de filial.
5. **Dados universais** (domínios fiscais, catálogo de menu, atores funcionais, tabelas INSS/IRRF/encargos) **não** pertencem a nenhuma empresa — são globais ao produto.

### R2 — Escopo de empresa obrigatório no acesso a dados

Todo acesso a dados do tenant passa por um **repositório com escopo de empresa**. SQL cru é **proibido** fora do repositório (lint/CI). `id_empresa` vem **sempre** do contexto de autenticação, **nunca** do cliente.

| Grupo | Definição | Filtro |
| :--- | :--- | :--- |
| **A** | Tabela com `id_empresa` direto | `WHERE id_empresa = :t` |
| **F** | Tabela com `id_filial` (herda empresa via filial) | `JOIN filiais f ON f.id = <tabela>.id_filial WHERE f.id_empresa = :t` |
| **C** | Filha pura (herda via pai) | Acessível **só** via pai (grupo A ou F) |
| **U** | Universal (global ao produto) | Sem filtro |
| **H** | Híbrida (`parametros_fiscais`) | `WHERE id_empresa = :t OR id_empresa IS NULL` |

### R3 — Não desnormalizar `id_empresa` em tabelas com `id_filial`

A empresa é alcançável via `filiais.id_empresa`. **Não** se cria coluna `id_empresa` nas tabelas do grupo F. **Não** há trigger de cópia, **não** há FK composta, **não** há backfill. A consistência é **estrutural** (impossível divergir, porque a coluna não existe).

### Mapa das 63 tabelas por grupo

| Grupo | Definição | Qtd | `id_empresa`? | Filtro |
| :--- | :--- | :--- | :--- | :--- |
| **U** | Universal (global ao produto) | 15 | Não | Sem filtro |
| **E** | `empresas` (raiz do tenant) | 1 | É o próprio | `id = :t` |
| **A** | Já tem `id_empresa` direto | 13 | **Sim** | `WHERE id_empresa = :t` |
| **F** | Tem `id_filial` (herda empresa via filial) | 18 | **Não** | `JOIN filiais ... WHERE f.id_empresa = :t` |
| **C** | Filha pura (herda via pai) | 15 | Não | Via pai (A ou F) |
| **H** | Híbrida (`parametros_fiscais`) | 1 | Sim (com NULL) | `WHERE id_empresa = :t OR id_empresa IS NULL` |
| **Total** | | **63** | | |

**U — Universais (15):**
`cfop`, `cst`, `ncm`, `lc116`, `cnae`, `uf`, `municipio`, `banco`, `tipo_documento`, `ator_funcional`, `menu_item`, `menu_item_ator`, `tabela_inss`, `tabela_irrf`, `tabela_encargos`.

**E — Raiz (1):**
`empresa`.

**A — Já têm `id_empresa` (13):**
`filial`, `plano_contas`, `centro_custo`, `area_negocio`, `pessoa`, `produto_servico`, `forma_pagamento`, `condicao_pagamento`, `provento_desconto`, `regra_classificacao`, `usuario`, `configuracao_handoff`, `cenario_simulacao`.

**F — Têm `id_filial`, herdam empresa (18):**
`periodo`, `funcionario`, `produto_custo`, `conta_bancaria`, `ativo`, `nota_fiscal`, `conta_pagar`, `conta_receber`, `lancamento`, `folha_pagamento`, `depreciacao`, `provisao`, `razao_imposto`, `pendencia`, `log_importacao`, `tarefa`, `usuario_ator`, `usuario_filial` (legado).

> ⚠️ **`auditoria` não está no grupo F.** Hoje não tem `id_filial` nem `id_empresa`; herda via `id_usuario → usuario.id_empresa`. É **grupo C** (herda via pai `usuario`).

**C — Filhas puras (15):**
`area_negocio_centro_custo`, `pessoa_fisica`, `pessoa_juridica`, `pessoa_tag`, `funcionario_centro_custo`, `produto`, `servico`, `nota_fiscal_item`, `nota_fiscal_imposto`, `nota_fiscal_vinculo`, `folha_pagamento_item`, `folha_pagamento_provento_desconto`, `regra_classificacao_log`, `documento_encadeado`, `auditoria`.

**H — Híbrida (1):**
`parametros_fiscais` (singular `parametro_fiscal` no modelo lógico; mantém `id_empresa NULL` = universal global).

### Mecanismo de segurança

A garantia de isolamento **não** vem do banco (MariaDB não tem Row-Level Security nativa). Vem de **quatro camadas**:

1. **Repositório com escopo obrigatório** — única porta de entrada.
2. **Proibição de SQL cru** fora do repositório (lint/CI).
3. **Testes de isolamento** — para cada tabela dos grupos A e F, tentar acessar registro de outra empresa e **deve** falhar.
4. **Code review** com checklist "tem `id_empresa` ou JOIN com `filiais`?".

Sem as 4, vaza — com ou sem coluna desnormalizada.

### Nota de implementação — Grupo H (`parametro_fiscal`)

O `parametro_fiscal` é o único do **Grupo H** (híbrido): `id_empresa NULL` = universal global; preenchido = override por empresa.

**Implementação (Bloco 6.11, `15_implementacao.md` v1.4):** o model `ParametroFiscal` **não usa** a trait `BelongsToTenant` (que filtra só `WHERE id_empresa = :t`). Em vez disso, implementa um **global scope local** `tenant_hibrido`:

```php
// app/Models/ParametroFiscal.php — booted()
static::addGlobalScope('tenant_hibrido', function (Builder $builder) {
    $context = app(TenantContext::class);
    if (! $context->hasId()) {
        $builder->whereNull('parametros_fiscais.id_empresa'); // sem contexto: só globais
        return;
    }
    $builder->where(function (Builder $q) use ($context) {
        $q->where('parametros_fiscais.id_empresa', $context->getId())
          ->orWhereNull('parametros_fiscais.id_empresa');
    });
});

## Domínios (tabelas de referência)

### cfop (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | char(4) | Único |
| descricao | text | (era `varchar(200)`, ver D2) |
| natureza | char(1) | E (entrada) / S (saída) |
| dados_extras | json | |

### cst (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| tipo_imposto | varchar(20) | ICMS, IPI, PIS, COFINS, ISS, **IBS, CBS** (D3) |
| codigo | char(3) | |
| descricao | varchar(200) | |
| dados_extras | json | |

### ncm (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(10) | Único (era `char(8)`, ver D1) |
| descricao | text | (era `varchar(300)`, ver D2) |
| id_ncm_pai | int | FK → ncm (auto-relacionamento, hierarquia, D1) |
| aceita_lancamento | boolean | `false` para nós da hierarquia; `true` para folhas (D1) |
| nivel | int | 1 = raiz, 2 = filho, ... (D1) |
| dados_extras | json | |

### lc116 (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(10) | Ex: 01.01 |
| descricao | text | (era `varchar(300)`, ver D2) |
| dados_extras | json | |

### cnae (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(15) | Único |
| descricao | text | (era `varchar(300)`, ver D2) |
| dados_extras | json | |

### uf (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| sigla | char(2) | Único |
| nome | varchar(100) | |

### municipio (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo_ibge | char(7) | Único |
| nome | varchar(200) | |
| id_uf | int | FK → uf |
| aliquota_iss_padrao | numeric(5,2) | % |
| dados_extras | json | |

### tipo_documento (R) — editável pelo usuário

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(10) | NF-e, NFS-e, CT-e, RPA |
| descricao | varchar(100) | |

### banco (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(5) | Código oficial (Banco Central) |
| nome | varchar(200) | |
| dados_extras | json | |

### ator_funcional (R)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(30) | Único |
| descricao | varchar(100) | |
| ativo | boolean | |

Pré-carregado: configurador, administrador, contador, comprador, faturista, financeiro1, financeiro2, gerente_financeiro, rh, auditor. (vendedor é tag em Pessoa, não ator.)

## Configuração

> **Nota D18 (implementação):** as FKs de `empresa.id_filial_matriz` e `empresa.id_plano_contas_sugerido` são adicionadas via `ALTER TABLE` **depois** que `filial` e `plano_contas` existem (dependência circular). Ver `10_modelo_dados_fisico.md` v1.2, seção 
4.

### empresa (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK. **É o tenant (R1).** |
| cnpj | char(14) | Único |
| razao_social | varchar(200) | |
| nome_fantasia | varchar(200) | |
| regime_fiscal | varchar(20) | Simples, Presumido, Real |
| setor | varchar(20) | Comércio, Serviços, Misto |
| data_inicio | date | |
| id_filial_matriz | int | FK → filial |
| id_plano_contas_sugerido | int | FK → plano_contas |
| metodo_custo | varchar(20) | XML, Médio, Manual (padrão: XML) |
| dados_extras | json | |

### filial (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa. **Define o tenant da filial (R1).** |
| cnpj | char(14) | Único |
| razao_social | varchar(200) | |
| nome_fantasia | varchar(200) | |
| inscricao_estadual | varchar(20) | |
| inscricao_municipal | varchar(20) | |
| id_municipio | int | FK → municipio |
| endereco | varchar(300) | |
| id_cnae | int | FK → cnae |
| data_inicio | date | |
| data_fim | date | |
| ativo | boolean | |
| dados_extras | json | |

### plano_contas (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| codigo | varchar(20) | |
| nivel | int | |
| descricao | varchar(200) | |
| tipo | varchar(20) | Ativo, Passivo, Custo, Despesa, Receita, Resultado Financeiro |
| subtipo | varchar(30) | Fixo, Variável, Operacional, Não Operacional |
| natureza | varchar(10) | Sintética, Analítica |
| aceita_lancamento | boolean | Só analítica = true |
| id_conta_pai | int | FK → plano_contas (auto-relacionamento) |
| conta_referencial | varchar(20) | Mapeamento ECD/ECF |
| id_plano_contas_origem | int | FK → plano_contas (plano sugerido de origem) |
| ativo | boolean | |
| dados_extras | json | |

### centro_custo (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| nome | varchar(200) | |
| responsavel | varchar(200) | |
| ativo | boolean | |
| dados_extras | json | |

### area_negocio (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| nome | varchar(200) | |
| ativo | boolean | |
| dados_extras | json | |

### area_negocio_centro_custo

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_area_negocio | int | FK → area_negocio |
| id_centro_custo | int | FK → centro_custo |

### periodo

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| mes_ano | char(7) | MM/AAAA |
| status | varchar(20) | Aberto, Em fechamento, Fechado |
| data_fechamento | timestamp | |
| id_usuario_fechamento | int | FK → usuario |
| dados_extras | json | |

## Pessoas

### pessoa (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| tipo | char(2) | PF, PJ |
| documento | varchar(14) | CPF ou CNPJ (único por empresa) |
| nome | varchar(200) | Nome ou Razão Social |
| email | varchar(200) | |
| telefone | varchar(20) | |
| ativo | boolean | |
| dados_extras | json | |

### pessoa_fisica

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_pessoa | int | FK → pessoa (único) |
| data_nascimento | date | |
| dados_extras | json | |

### pessoa_juridica

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_pessoa | int | FK → pessoa (único) |
| nome_fantasia | varchar(200) | |
| id_municipio | int | FK → municipio |
| categoria_padrao | varchar(50) | Para o motor de classificação |
| prazo_padrao_dias | int | |
| dados_extras | json | |

### pessoa_tag

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_pessoa | int | FK → pessoa |
| tag | varchar(30) | Cliente, Fornecedor, Funcionário, Comissionado, Autônomo, Transportadora |

### funcionario (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_pessoa | int | FK → pessoa (único) |
| id_filial | int | FK → filial (define o tenant via R3) |
| cargo | varchar(100) | |
| id_centro_custo | int | FK → centro_custo |
| salario_base | numeric(15,2) | |
| data_admissao | date | |
| data_demissao | date | |
| natureza | varchar(10) | Custo, Despesa Fixa |
| ativo | boolean | |
| dados_extras | json | |

### funcionario_centro_custo (rateio)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_funcionario | int | FK → funcionario |
| id_centro_custo | int | FK → centro_custo |
| percentual | numeric(5,2) | |

## Produtos e serviços

### produto_servico (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| tipo | char(1) | P (produto), S (serviço) |
| codigo_interno | varchar(50) | |
| descricao | varchar(300) | |
| ativo | boolean | |
| dados_extras | json | |

### produto

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_produto_servico | int | FK → produto_servico (único) |
| id_ncm | int | FK → ncm |
| unidade | varchar(10) | |
| dados_extras | json | |

### servico

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_produto_servico | int | FK → produto_servico (único) |
| id_lc116 | int | FK → lc116 |
| dados_extras | json | |

### produto_custo (para método "Médio")

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_produto_servico | int | FK → produto_servico |
| id_filial | int | FK → filial (define o tenant via R3) |
| data_referencia | date | |
| custo_medio | numeric(15,4) | |
| dados_extras | json | |

## Bancos e contas

### conta_bancaria (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_banco | int | FK → banco |
| agencia | varchar(10) | |
| numero | varchar(20) | |
| tipo | varchar(20) | Corrente, Poupança |
| saldo_inicial | numeric(15,2) | |
| saldo_inicial_data | date | |
| ativo | boolean | |
| dados_extras | json | |

## Formas e condições

### forma_pagamento (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| descricao | varchar(100) | Dinheiro, Cartão, Boleto, PIX, etc. |
| ativo | boolean | |
| dados_extras | json | |

### condicao_pagamento (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| descricao | varchar(100) | À vista, A prazo 30/60/90, etc. |
| numero_parcelas | int | |
| intervalo_dias | int | |
| ativo | boolean | |
| dados_extras | json | |

## Ativos

### ativo (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| descricao | varchar(200) | |
| data_aquisicao | date | |
| valor_original | numeric(15,2) | |
| valor_residual | numeric(15,2) | |
| vida_util_meses | int | |
| metodo_depreciacao | varchar(20) | Linear (padrão), Soma Dígitos, Unidades |
| mes_inicial_depreciacao | char(7) | MM/AAAA (sugestão: mês seguinte) |
| id_centro_custo | int | FK → centro_custo |
| destino | varchar(10) | Custo, Despesa |
| status | varchar(20) | Em uso, Ocioso, Alienado |
| dados_extras | json | |

## Proventos e descontos

### provento_desconto (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| codigo | varchar(10) | |
| descricao | varchar(100) | |
| tipo | varchar(10) | Provento, Desconto |
| entra_inss | boolean | |
| entra_fgts | boolean | |
| entra_irrf | boolean | |
| ativo | boolean | |
| dados_extras | json | |

## Documentos fiscais

### nota_fiscal (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_tipo_documento | int | FK → tipo_documento |
| origem | varchar(10) | Própria, Terceiros |
| direcao | varchar(10) | Entrada, Saída |
| chave | varchar(44) | Chave da nota (única) |
| numero | varchar(20) | |
| serie | varchar(10) | |
| data_emissao | date | |
| id_pessoa_emitente | int | FK → pessoa |
| id_pessoa_destinatario | int | FK → pessoa |
| id_municipio_emissao | int | FK → municipio |
| valor_produtos | numeric(15,2) | |
| valor_desconto | numeric(15,2) | |
| valor_frete | numeric(15,2) | |
| valor_total | numeric(15,2) | |
| xml_origem | text | Caminho ou conteúdo do XML |
| status_importacao | varchar(30) | Importado, Importado com erro, Importado com aviso, Cancelado |
| motivo_cancelamento | varchar(200) | Preenchido pelo XML ou manualmente |
| id_periodo | int | FK → periodo |
| dados_extras | json | |

### nota_fiscal_item (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_nota_fiscal | int | FK → nota_fiscal |
| numero_item | int | |
| id_produto_servico | int | FK → produto_servico (quando identificado) |
| descricao | varchar(300) | |
| id_cfop | int | FK → cfop (já convertido para entrada, se terceiros) |
| id_ncm | int | FK → ncm (produtos) |
| id_lc116 | int | FK → lc116 (serviços) |
| quantidade | numeric(15,4) | |
| valor_unitario | numeric(15,4) | |
| custo_unitario | numeric(15,4) | Custo do item (XML ou manual) |
| valor_total | numeric(15,2) | |
| valor_desconto | numeric(15,2) | |
| valor_frete | numeric(15,2) | |
| valor_seguro | numeric(15,2) | |
| outras_despesas | numeric(15,2) | |
| dados_extras | json | |

### nota_fiscal_imposto (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_nota_fiscal_item | int | FK → nota_fiscal_item |
| tipo_imposto | varchar(20) | ICMS, IPI, PIS, COFINS, ISS, IBS, CBS, II, IR, CSLL, INSS |
| id_cst | int | FK → cst |
| base_calculo | numeric(15,2) | |
| aliquota | numeric(7,4) | |
| valor | numeric(15,2) | |
| valor_st | numeric(15,2) | Quando aplicável |
| dados_extras | json | |

### nota_fiscal_vinculo

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_nota_fiscal | int | FK → nota_fiscal |
| id_nota_vinculada | int | FK → nota_fiscal (ex: CT-e → NF-e) |
| tipo_vinculo | varchar(30) | Frete, Devolução, Complemento |

## Contas a pagar/receber

### conta_pagar (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_nota_fiscal | int | FK → nota_fiscal (quando aplicável) |
| id_pessoa | int | FK → pessoa (fornecedor) |
| numero_parcela | int | |
| total_parcelas | int | |
| valor | numeric(15,2) | |
| data_emissao | date | |
| data_vencimento | date | |
| data_pagamento | date | |
| valor_pago | numeric(15,2) | |
| juros | numeric(15,2) | |
| multa | numeric(15,2) | |
| desconto | numeric(15,2) | |
| status | varchar(20) | Aberta, Parcialmente baixada, Baixada, Cancelada |
| id_conta_bancaria | int | FK → conta_bancaria |
| id_forma_pagamento | int | FK → forma_pagamento |
| id_condicao_pagamento | int | FK → condicao_pagamento |
| id_lancamento_baixa | int | FK → lancamento |
| dados_extras | json | |

### conta_receber (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_nota_fiscal | int | FK → nota_fiscal |
| id_pessoa | int | FK → pessoa (cliente) |
| numero_parcela | int | |
| total_parcelas | int | |
| valor | numeric(15,2) | |
| data_emissao | date | |
| data_vencimento | date | |
| data_recebimento | date | |
| valor_recebido | numeric(15,2) | |
| juros | numeric(15,2) | |
| multa | numeric(15,2) | |
| desconto | numeric(15,2) | |
| status | varchar(20) | Aberta, Parcialmente baixada, Baixada, Cancelada |
| id_conta_bancaria | int | FK → conta_bancaria |
| id_forma_recebimento | int | FK → forma_pagamento |
| id_condicao_recebimento | int | FK → condicao_pagamento |
| id_lancamento_baixa | int | FK → lancamento |
| dados_extras | json | |

## Lançamentos

### lancamento (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo (período de inclusão) |
| data_competencia | date | |
| data_emissao_documento | date | Atributo do documento |
| historico | varchar(500) | |
| valor | numeric(15,2) | |
| id_conta_debito | int | FK → plano_contas |
| id_conta_credito | int | FK → plano_contas |
| id_centro_custo | int | FK → centro_custo |
| id_pessoa | int | FK → pessoa (contraparte) |
| id_nota_fiscal | int | FK → nota_fiscal (quando aplicável) |
| id_nota_fiscal_item | int | FK → nota_fiscal_item (quando aplicável) |
| tipo_lancamento | varchar(30) | Compra, Venda, Folha, Depreciação, Provisão, Imposto, Manual, Baixa, etc. |
| status_classificacao | varchar(30) | Classificado automaticamente, Classificado manualmente, Não classificado, Conflito |
| justificativa_classificacao | text | Qual regra, por quê (D2) |
| id_lancamento_estorno | int | FK → lancamento |
| dados_extras | json | |

## Folha

### folha_pagamento (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo |
| mes_ano_referencia | char(7) | |
| status | varchar(20) | Calculada, Revisada, Fechada |
| id_lancamento | int | FK → lancamento (consolidação) |
| dados_extras | json | |

### folha_pagamento_item (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_folha_pagamento | int | FK → folha_pagamento |
| id_funcionario | int | FK → funcionario |
| salario_base | numeric(15,2) | |
| total_proventos | numeric(15,2) | |
| total_descontos | numeric(15,2) | |
| base_inss | numeric(15,2) | |
| base_fgts | numeric(15,2) | |
| base_irrf | numeric(15,2) | |
| valor_inss_empregado | numeric(15,2) | |
| valor_inss_patronal | numeric(15,2) | |
| valor_fgts | numeric(15,2) | |
| valor_irrf | numeric(15,2) | |
| valor_rat | numeric(15,2) | |
| valor_terceiros | numeric(15,2) | |
| valor_liquido | numeric(15,2) | |
| dados_extras | json | |

### folha_pagamento_provento_desconto

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_folha_pagamento_item | int | FK → folha_pagamento_item |
| id_provento_desconto | int | FK → provento_desconto |
| valor | numeric(15,2) | |

## Depreciação e provisões

### depreciacao (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo |
| id_ativo | int | FK → ativo |
| valor_depreciacao | numeric(15,2) | |
| depreciacao_acumulada | numeric(15,2) | |
| valor_contabil_liquido | numeric(15,2) | |
| id_lancamento | int | FK → lancamento |
| dados_extras | json | |

### provisao (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo |
| id_funcionario | int | FK → funcionario |
| tipo | varchar(20) | Férias, 13º |
| valor_provisao | numeric(15,2) | |
| valor_encargos | numeric(15,2) | |
| id_lancamento | int | FK → lancamento |
| dados_extras | json | |

## Classificação

### regra_classificacao (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| descricao | varchar(200) | |
| prioridade | int | 1 (específica) a 8 (fallback) |
| id_tipo_documento | int | FK → tipo_documento |
| id_cfop | int | FK → cfop |
| id_cst | int | FK → cst |
| id_ncm | int | FK → ncm |
| id_lc116 | int | FK → lc116 |
| id_pessoa_fornecedor | int | FK → pessoa |
| categoria_fornecedor | varchar(50) | |
| historico_palavra_chave | varchar(100) | |
| id_conta_destino | int | FK → plano_contas |
| id_centro_custo_padrao | int | FK → centro_custo |
| id_conta_contrapartida_padrao | int | FK → plano_contas |
| origem | varchar(20) | Manual, Aprendida |
| id_lancamento_origem | int | FK → lancamento |
| ativo | boolean | |
| dados_extras | json | |

### regra_classificacao_log

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_regra_classificacao | int | FK → regra_classificacao |
| acao | varchar(20) | Criada, Editada, Desativada, Reativada |
| id_usuario | int | FK → usuario |
| justificativa | text | |
| dados_anteriores | json | |
| dados_novos | json | |

## Parâmetros

### parametro_fiscal (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa (nulo = universal **global**) |
| tipo_imposto | varchar(20) | ICMS, IPI, PIS, COFINS, ISS, IBS, CBS, IR, CSLL |
| descricao | varchar(100) | |
| aliquota | numeric(7,4) | |
| base_calculo | varchar(50) | |
| data_inicio_validade | date | |
| data_fim_validade | date | |
| dados_extras | json | |

### tabela_inss (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| faixa | int | |
| valor_inicial | numeric(15,2) | |
| valor_final | numeric(15,2) | |
| aliquota | numeric(7,4) | |
| data_inicio_validade | date | |
| data_fim_validade | date | |
| dados_extras | json | |

### tabela_irrf (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| faixa | int | |
| valor_inicial | numeric(15,2) | |
| valor_final | numeric(15,2) | |
| aliquota | numeric(7,4) | |
| deducao | numeric(15,2) | |
| redutor | numeric(15,2) | |
| data_inicio_validade | date | |
| data_fim_validade | date | |
| dados_extras | json | |

### tabela_encargos (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| descricao | varchar(100) | RAT, Terceiros, etc. |
| aliquota | numeric(7,4) | |
| data_inicio_validade | date | |
| data_fim_validade | date | |
| dados_extras | json | |

## Razão de impostos

### razao_imposto (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo |
| tipo_imposto | varchar(20) | |
| id_lancamento | int | FK → lancamento |
| natureza | varchar(10) | Crédito, Débito |
| valor | numeric(15,2) | |
| id_pessoa | int | FK → pessoa (contraparte) |
| id_nota_fiscal | int | FK → nota_fiscal |
| dados_extras | json | |

## Pendências

### pendencia (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_periodo | int | FK → periodo |
| categoria | varchar(10) | Erro, Aviso |
| tipo | varchar(50) | Não classificado, Dados faltantes, Provisão não calculada, Depreciação não lançada, Conta vencida, etc. |
| descricao | varchar(500) | |
| id_referencia | int | ID do registro de origem |
| tabela_referencia | varchar(50) | Nome da tabela de origem |
| status | varchar(20) | Aberta, Resolvida, Aceita |
| id_usuario_resolucao | int | FK → usuario |
| data_resolucao | timestamp | |
| justificativa | text | |
| dados_extras | json | |

## Simulação (fase 2)

### cenario_simulacao (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| nome | varchar(200) | |
| descricao | text | |
| periodo_base | char(7) | MM/AAAA ou intervalo |
| escopo | varchar(50) | Tudo, Reduzido |
| variaveis_ajustadas | json | Lista de variáveis e valores |
| resultados_persistidos | json | DRE, fluxo de caixa, indicadores |
| status | varchar(20) | Salvo (fase 1); Rascunho/Finalizado/Aprovado (fase 2) |
| dados_extras | json | |

## Usuários e auditoria

> **Nota D14 (implementação):** `usuario.senha_hash` é o campo de senha. **O model `Usuario` precisa sobrescrever `getAuthPassword()` retornando `senha_hash`** (o Laravel espera `password` por padrão). Implementado no Bloco 7. Ver P5.
>
> **Nota D19 (implementação):** o DDL chama `auditorias` (plural); este documento chama `auditoria` (singular). **A implementação seguiu o DDL (plural).** A tabela `### auditoria` abaixo será renomeada para `### auditorias` na v1.6 (junto com a correção de `menu_item` → `menus_itens`).

### usuario (J)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| nome | varchar(200) | |
| email | varchar(200) | Único |
| senha_hash | varchar(255) | |
| ativo | boolean | |
| dados_extras | json | |

> **Removido:** o campo `perfil` (Administrador/Operador/Controller) **deixa de existir**. A tag do ator funcional (em `usuario_ator`) define o que o usuário pode fazer. O `configurador` tem acesso total.

### usuario_filial — **LEGADO**

> **Status:** **substituído por `usuario_ator`** (abaixo). Mantido apenas para migração de dados históricos. Não usar em novas implementações.

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_usuario | int | FK → usuario |
| id_filial | int | FK → filial |
| perfil | varchar(20) | Administrador, Operador, Controller |

### usuario_ator

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_usuario | int | FK → usuario |
| id_filial | int | FK → filial (define o tenant via R3) |
| id_ator_funcional | int | FK → ator_funcional |
| ativo | boolean | |

### configuracao_handoff

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_empresa | int | FK → empresa |
| handoff_ativo | boolean | Ativa/desativa o handoff para a empresa |
| dados_extras | json | |

### documento_encadeado

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_documento_origem | int | FK → documento de origem |
| id_documento_destino | int | FK → documento de destino |
| tipo_relacao | varchar(30) | Ex: "NF-e entrada → conta a pagar" |
| dados_extras | json | |

### tarefa (ordens)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| tipo_ordem | varchar(40) | Código do tipo de ordem (ver `08_ordens.md`) |
| id_documento | int | FK → documento de origem |
| tipo_documento | varchar(20) | NF-e, NFS-e, CT-e, RPA, conta_pagar, conta_receber, folha, período, parâmetro, lançamento |
| id_ator_origem | int | FK → ator_funcional |
| id_ator_destino | int | FK → ator_funcional |
| status | varchar(20) | pendente, em_andamento, concluida, cancelada |
| urgente | boolean | Marcação do ator (T8.6) |
| data_criacao | timestamp | |
| data_conclusao | timestamp | |
| id_ordem_anterior | int | FK → tarefa (reabertura/reclassificação) |
| descricao_resumida | varchar(200) | Texto curto gerado a partir do tipo + documento |
| prioridade | int | Derivada de urgente + tipo |
| dados_extras | json | Específicos por tipo (ver Apêndice A do `08_ordens.md`) |

### auditoria

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_usuario | int | FK → usuario (herda empresa via R3) |
| acao | varchar(50) | |
| tabela | varchar(50) | |
| id_registro | int | |
| dados_anteriores | json | |
| dados_novos | json | |
| justificativa | text | |
| ip | varchar(45) | |
| created_at | timestamp | |

### log_importacao

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_filial | int | FK → filial (define o tenant via R3) |
| tipo_documento | varchar(20) | |
| caminho_arquivo | varchar(500) | |
| status | varchar(30) | Sucesso, Erro, Aviso |
| mensagem | text | |
| created_at | timestamp | |

## Menu (numeração)

> **Nota D17 (implementação):** o DDL chama `menus_itens`/`menus_itens_atores` (plural). Este documento chama `menu_item`/`menu_item_ator` (singular). **A implementação seguiu o DDL (plural).** Os blocos abaixo serão renomeados para `menus_itens`/`menus_itens_atores` na v1.6. Os models `MenuItem`/`MenuItemAtor` (em `app/Models/`) refletem o plural.

### menus_itens

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| codigo | varchar(10) | Número do menu (ex: `4.10`) — único |
| nome | varchar(100) | Nome completo (oficial) |
| rota | varchar(200) | Rota da tela (ex: `/contador/revisao`) |
| fase | int | 1 ou 2 |
| ativo | boolean | |
| dados_extras | json | |

### menus_itens_atores (N:N)

| Campo | Tipo | Observações |
| :--- | :--- | :--- |
| id | int | PK |
| id_menu_item | int | FK → menus_itens |
| id_ator_funcional | int | FK → ator_funcional |

**Regras:**
- `codigo` é único e imutável após a publicação.
- `nome` é o nome completo (oficial) — usado em auditoria, logs e comunicação.
- `rota` é a URL da tela.
- `fase` indica se o item é fase 1 ou fase 2.
- `ativo` permite desativar o item sem removê-lo.
- **Alternativa:** usar arquivo de configuração (`menu.yaml`/`menu.json`) em vez de tabela.

## Campos novos em tabelas existentes

| Tabela | Campo | Tipo | Observações |
| :--- | :--- | :--- | :--- |
| `nota_fiscal` | `status_fluxo` | varchar(30) | Aguardando conferência, Aguardando pagamento, Pago, etc. |
| `conta_pagar` | `status_fluxo` | varchar(30) | Aguardando pagamento, Pago, etc. |
| `conta_receber` | `status_fluxo` | varchar(30) | Aguardando recebimento, Recebido, etc. |

## Regras de dados

- Toda transição de estado gera registro em `auditoria` e em `documento_encadeado` (quando aplicável).
- A ativação/desativação de handoff é auditada.
- O ator é por filial (`usuario_ator.id_filial`).
- Se o usuário tem `configurador`, não precisa de outras tags.
- Documentos gerados pelo sistema (conta a pagar, conta a receber, razão de imposto, depreciação, provisão, pendência) têm `id_ator_origem` = quem gerou a NF (Comprador ou Faturista).
- **Multi-empresa (tenant):** tabelas com `id_filial` herdam empresa via `filiais.id_empresa` (R3). O filtro é responsabilidade do repositório (R2).

## Resumo dos relacionamentos

```
empresa 1──N filial
empresa 1──1 filial (matriz)  [via id_filial_matriz]
filial 1──N periodo
filial 1──N nota_fiscal
filial 1──N conta_pagar
filial 1──N conta_receber
filial 1──N lancamento
filial 1──N folha_pagamento
filial 1──N depreciacao
filial 1──N provisao
filial 1──N razao_imposto
filial 1──N pendencia
filial 1──N conta_bancaria
filial 1──N ativo
filial 1──N funcionario
filial 1──N usuario_ator
usuario 1──N usuario_ator
empresa 1──N plano_contas
empresa 1──N centro_custo
empresa 1──N area_negocio
empresa 1──N pessoa
empresa 1──N produto_servico
empresa 1──N forma_pagamento
empresa 1──N condicao_pagamento
empresa 1──N provento_desconto
empresa 1──N regra_classificacao
empresa 1──N parametro_fiscal
empresa 1──N usuario
empresa 1──N cenario_simulacao (fase 2)
empresa 1──N auditoria
empresa 1──N log_importacao
empresa 1──1 configuracao_handoff
empresa 1──N ator_funcional (via usuario_ator)
nota_fiscal 1──N nota_fiscal_item
nota_fiscal_item 1──N nota_fiscal_imposto
nota_fiscal N──N nota_fiscal (via nota_fiscal_vinculo)
lancamento N──1 plano_contas (débito)
lancamento N──1 plano_contas (crédito)
folha_pagamento 1──N folha_pagamento_item
folha_pagamento_item 1──N folha_pagamento_provento_desconto
ator_funcional 1──N usuario_ator
ator_funcional 1──N tarefa (origem)
ator_funcional 1──N tarefa (destino)
documento 1──N documento_encadeado (origem)
documento 1──N documento_encadeado (destino)
documento 1──N tarefa
tarefa N──1 ator_funcional (origem)
tarefa N──1 ator_funcional (destino)
tarefa N──1 filial
tarefa N──1 documento (via id_documento + tipo_documento)
tarefa 1──N tarefa (via id_ordem_anterior)
menu_item N──N ator_funcional (via menu_item_ator)
```

> **Multi-empresa (tenant):** o vínculo `empresa → <tabela do grupo F>` é **transitivo** via `filial`. Não há FK direta `empresa` nas tabelas do grupo F (R3). O filtro de empresa é aplicado no repositório via JOIN com `filial` (R2).

## Observações finais

1. **Soft delete** em todas as tabelas principais.
2. **Campo JSON** (`dados_extras`) nas tabelas principais.
3. **Tabelas de referência** não têm `dados_extras` (exceto `municipio`, com alíquota de ISS).
4. **Período** é a âncora do T5.
5. **Lançamento** é a tabela central.
6. **Partidas dobradas:** `id_conta_debito` e `id_conta_credito`.
7. **Razão de impostos (T7):** `razao_imposto` registra crédito/débito por filial.
8. **Pendências (T6):** `pendencia` registra Erro/Aviso por filial.
9. **Regras de classificação (D5):** prioridade 1–8, contexto, conta destino.
10. **Auditoria:** tabela `auditoria` + `log_importacao`.
11. **Custo por produto:** `nota_fiscal_item.custo_unitario` (XML/manual) ou `produto_custo.custo_medio` (médio), conforme `empresa.metodo_custo`.
12. **Vínculo de comissão/frete:** `lancamento.id_filial`, `id_pessoa`, `id_nota_fiscal`.
13. **Motivo de cancelamento:** `nota_fiscal.motivo_cancelamento`.
14. **Handoff (T8):** `configuracao_handoff`, `documento_encadeado`, `tarefa`.
15. **Atores (T8):** `ator_funcional`, `usuario_ator`. O campo `usuario.perfil` e a tabela `usuario_filial` são **legado** e não devem ser usados em novas implementações.
16. **Status de fluxo (T8):** `nota_fiscal.status_fluxo`, `conta_pagar.status_fluxo`, `conta_receber.status_fluxo`.
17. **Ordens (T8.1–T8.12):** a tabela `tarefa` registra as ordens. Os campos `tipo_ordem`, `id_ordem_anterior`, `descricao_resumida` e `prioridade` foram adicionados na v1.2.
18. **Menu (09):** a tabela `menu_item` e `menu_item_ator` registram a numeração do menu (v1.3).
19. **Multi-empresa (tenant):** `empresa.id` é o tenant (R1). Tabelas com `id_filial` herdam empresa via `filiais.id_empresa` e **não** desnormalizam `id_empresa` (R3). O filtro é responsabilidade do repositório (R2). Mapa U/E/A/F/C/H na seção "Multi-empresa (tenant)".
20. **Sincronização com a implementação (v1.5):** o que mudou no código e está refletido aqui: D1 (ncm), D2 (descricao TEXT), D3 (cst IBS/CBS), D14 (senha_hash), D17 (menus_itens plural), D18 (FKs via ALTER), D19 (auditorias plural). Ver `15_implementacao.md` v1.4 para o estado completo. Para o DDL detalhado, ver `10_modelo_dados_fisico.md` v1.2.
```

---

## Resumo das mudanças no `04_modelo_de_dados.md`

| Item | Antes | Depois |
| :--- | :--- | :--- |
| Frontmatter | v1.3, 2026-10-24 | **v1.4, 2026-10-28** |
| Seção "Multi-empresa (tenant)" | — | **Nova** (após "Convenções"): R1, R2, R3, mapa U/E/A/F/C/H (63 tabelas), tabela de filtro, mecanismo de segurança |
| Tabela `empresa` | — | Campo `id` marcado "**É o tenant (R1)**" |
| Tabela `filial` | — | Campo `id_empresa` marcado "**Define o tenant da filial (R1)**" |
| 18 tabelas do grupo F | — | Campo `id_filial` marcado "**(define o tenant via R3)**" |
| Tabela `auditoria` | — | Campo `id_usuario` marcado "(herda empresa via R3)" |
| `parametro_fiscal` | — | Observação "nulo = universal **global**" (mantém semântica) |
| "Regras de dados" | — | + item "Multi-empresa (tenant)" |
| "Resumo dos relacionamentos" | — | + nota de transitividade `empresa → filial → grupo F` |
| "Observações finais" | 18 itens | **19 itens** (novo item 18 = multi-empresa) |

**Nenhuma tabela/campo novo.** Só a regra lógica e marcações.

---
    