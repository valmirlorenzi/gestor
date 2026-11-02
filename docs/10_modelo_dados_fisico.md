---
documento: modelo_dados_fisico
versao: 1.2
data: 2026-11-02
proposito: DDL completo das 63 tabelas em MariaDB (tipos, índices, FKs, constraints, seeds, views) + notas de multi-empresa (sem DDL) + convenções de CHECK e datas
depende_de: [04_modelo_de_dados, 09_menu_numeracao]
---

# Modelo de Dados Físico (DDL) — MariaDB

> **O que é:** DDL (Data Definition Language) completo das 63 tabelas do sistema, em MariaDB, com decisões de tipos, índices, FKs, constraints, seeds e views.
>
> **Substitui:** a lista de tabelas proposta (arquivo `.txt` de rascunho).

---

## Sumário

1. [Convenções](#1-convenções)
2. [Configuração inicial](#2-configuração-inicial)
3. [Domínios (tabelas de referência)](#3-domínios-tabelas-de-referência)
4. [Configuração](#4-configuração)
5. [Pessoas](#5-pessoas)
6. [Produtos e serviços](#6-produtos-e-serviços)
7. [Bancos e contas](#7-bancos-e-contas)
8. [Formas e condições](#8-formas-e-condições)
9. [Ativos](#9-ativos)
10. [Proventos e descontos](#10-proventos-e-descontos)
11. [Documentos fiscais](#11-documentos-fiscais)
12. [Contas a pagar/receber](#12-contas-a-pagarreceber)
13. [Lançamentos](#13-lançamentos)
14. [Folha](#14-folha)
15. [Depreciação e provisões](#15-depreciação-e-provisões)
16. [Classificação](#16-classificação)
17. [Parâmetros](#17-parâmetros)
18. [Razão de impostos](#18-razão-de-impostos)
19. [Pendências](#19-pendências)
20. [Simulação (fase 2)](#20-simulação-fase-2)
21. [Usuários e auditoria](#21-usuários-e-auditoria)
22. [Handoff e ordens](#22-handoff-e-ordens)
23. [Menu (numeração)](#23-menu-numeração)
24. [Seeds](#24-seeds)
25. [Views auxiliares](#25-views-auxiliares)
26. [Triggers](#26-triggers)
27. [Resumo](#27-resumo)
28. [Histórico de versões](#28-histórico-de-versões)

---

## 1. Convenções

### 1.1. Tipos

| Tipo | Uso |
| :--- | :--- |
| `BIGINT UNSIGNED AUTO_INCREMENT` | PKs. |
| `BIGINT UNSIGNED` | FKs. |
| `DECIMAL(15,2)` | Valores monetários. |
| `DECIMAL(15,4)` | Quantidades e custos unitários. |
| `DECIMAL(7,4)` | Alíquotas. |
| `DECIMAL(5,2)` | Percentuais (rateio, ISS). |
| `CHAR(14)` | CNPJ. |
| `VARCHAR(14)` | CPF/CNPJ (pessoa). |
| `CHAR(44)` | Chave de NF-e. |
| `CHAR(7)` | `mes_ano` (MM/AAAA). |
| `CHAR(4)` | CFOP. |
| `CHAR(3)` | CST. |
| `CHAR(8)` | NCM. |
| `CHAR(2)` | UF. |
| `CHAR(7)` | Código IBGE do município. |
| `DATE` | Datas. |
| `DATETIME` | Timestamps (UTC). |
| `TINYINT(1)` | Booleanos. |
| `JSON` | `dados_extras` e campos estruturados. |
| `TEXT` / `LONGTEXT` | Textos longos (justificativas, XML). |
| `VARCHAR(n)` | Strings curtas/médias. |

### 1.2. Auditoria padrão

Todas as tabelas principais (não referências) têm:

- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
- `created_by BIGINT UNSIGNED NULL`
- `updated_by BIGINT UNSIGNED NULL`
- `deleted_at DATETIME NULL`
- `deleted_by BIGINT UNSIGNED NULL`

### 1.3. Soft delete

`deleted_at DATETIME NULL`; quando `NULL`, o registro está ativo. Consultas devem filtrar `WHERE deleted_at IS NULL`.

### 1.4. Engine e charset

- `ENGINE=InnoDB`
- `DEFAULT CHARSET=utf8mb4`
- `COLLATE=utf8mb4_unicode_ci`

### 1.5. Nomenclatura

- **Tabelas:** plural (`empresas`, `filiais`, `lancamentos`).
- **PKs:** `id`.
- **FKs:** `id_<tabela_singular>` (ex: `id_empresa`, `id_filial`).
- **FK constraint:** `fk_<tabela>_<coluna>`.
- **Índice:** `idx_<tabela>_<coluna(s)>`.
- **Unique:** `uk_<tabela>_<coluna(s)>`.
- **Check:** `chk_<tabela>_<regra>`.

### 1.6. Ordem de criação

Respeita dependências: referências → configuração → pessoas → produtos → ... → usuários → handoff → menu. Dependências circulares resolvidas com `ALTER TABLE` após a criação.

### 1.7. FKs

- `ON UPDATE CASCADE` para chaves naturais.
- `ON DELETE CASCADE` apenas em N:N e filhas puras (itens de nota, itens de folha, etc.).
- `ON DELETE RESTRICT` (padrão) nas demais.

1. [Convenções](#1-convenções)
   1.1. [Tipos](#11-tipos)
   1.2. [Auditoria padrão](#12-auditoria-padrão)
   1.3. [Soft delete](#13-soft-delete)
   1.4. [Engine e charset](#14-engine-e-charset)
   1.5. [Nomenclatura](#15-nomenclatura)
   1.6. [Ordem de criação](#16-ordem-de-criação)
   1.7. [FKs](#17-fks)
   1.8. [Multi-empresa (tenant)](#18-multi-empresa-tenant)   ← NOVO

### 1.8. Multi-empresa (tenant)

> **Regra R1–R3** (ver `01_visao_geral.md`, seção 8, e `04_modelo_de_dados.md`, seção "Multi-empresa (tenant)").

- **`empresas.id` é o tenant.** Cada empresa é única e isolada. **Não** existe tabela `tenants` nem coluna `id_tenant`. Onde o isolamento é necessário, usa-se `id_empresa`.
- **Tabelas do grupo A** (já têm `id_empresa` direto) filtram com `WHERE id_empresa = :t` no repositório.
- **Tabelas do grupo F** (têm `id_filial`, herdam empresa via filial) filtram com `JOIN filiais f ON f.id = <tabela>.id_filial WHERE f.id_empresa = :t` no repositório.
- **Tabelas do grupo C** (filhas puras) são acessíveis **só** via pai (grupo A ou F).
- **Tabelas do grupo U** (universais: domínios, menus, atores, tabelas INSS/IRRF/encargos) **não** têm `id_empresa` e **não** filtram.
- **`parametros_fiscais`** (grupo H): `id_empresa NULL` = universal **global**; preenchido = override por empresa.
- **Não desnormalizar `id_empresa`** nas tabelas do grupo F. **Não** há trigger de cópia, **não** há FK composta, **não** há backfill. A consistência é estrutural (impossível divergir, porque a coluna não existe).
- **DDL:** este documento **não** é alterado por R1–R3. O isolamento é responsabilidade do repositório da aplicação (R2). MariaDB **não** tem Row-Level Security nativa.

### 1.9. CHECKs e validação (D16)

O DDL abaixo **tem** `CHECK` constraints (ex.: `chk_cfops_natureza`, `chk_empresas_regime`, `chk_contas_pagar_status`). **Na implementação (v1.4 do `15`), os CHECKs não foram criados nos migrations.**

Motivo: os testes Pest rodam em **SQLite** (em memória), que não aplica `CHECK` da mesma forma que o MariaDB. Criar CHECK no migration só para MariaDB geraria divergência entre teste e produção.

**Decisão:** a validação de domínio fica no **FormRequest** (Bloco 6.18/7). O DDL abaixo mantém os CHECKs como **documentação da regra** — se um dia os testes migrarem para MariaDB, os CHECKs podem ser adicionados via migration nova (P24).

**Checklist de validação a implementar no FormRequest (P24):**
- `cfops.natureza` (`E`/`S`)
- `empresas.regime_fiscal` (`Simples`/`Presumido`/`Real`), `setor`, `metodo_custo`
- `planos_contas.tipo`, `natureza`
- `funcionarios.natureza` (`Custo`/`Despesa Fixa`)
- `funcionarios_centros_custo.percentual` (0–100)
- `produtos_servicos.tipo` (`P`/`S`)
- `contas_bancarias.tipo` (`Corrente`/`Poupanca`)
- `condicoes_pagamento.numero_parcelas` (>= 1)
- `ativos.metodo_depreciacao`, `destino`, `status`, `valor_original >= valor_residual`, `vida_util_meses > 0`
- `proventos_descontos.tipo` (`Provento`/`Desconto`)
- `notas_fiscais.origem`, `direcao`, `status_importacao`
- `contas_pagar.status`, `contas_receber.status`
- `lancamentos.status_classificacao`, `valor > 0`
- `folhas_pagamento.status`
- `provisoes.tipo` (`Ferias`/`13o`)
- `regras_classificacao.prioridade` (1–8), `origem` (`Manual`/`Aprendida`)
- `regras_classificacao_logs.acao`
- `tabelas_inss` e `tabelas_irrf`: `valor_final >= valor_inicial`
- `razoes_impostos.natureza` (`Credito`/`Debito`)
- `pendencias.categoria` (`Erro`/`Aviso`), `status`
- `cenarios_simulacao.status`
- `tarefas.status`, `tipo_documento`
- `menus_itens.fase` (1/2)

### 1.10. Convenção de datas em consultas (D20)

Comparações de data em **repositórios** devem usar `whereDate`/`whereBetween` com `Carbon`, **nunca** `where` com string.

**Motivo:** no SQLite (testes), a coluna `DATETIME` é armazenada como `"2026-11-02 00:00:00"`, e a comparação `"2026-11-02 00:00:00" <= "2026-11-02"` é **falsa** (comparação lexicográfica de string). No MariaDB, o cast implícito faria funcionar — mas o teste quebraria.

**Regra:** `->whereDate('data_inicio_validade', '<=', $hoje)`, `->whereBetween('data_vencimento', [$inicio, $fim])`, etc.

**Aplicar em:** `ParametroFiscalRepository::vigentes()` (já corrigido, P72), `ContaPagarRepository::vencidas()`, `ContaReceberRepository::vencidas()`, e qualquer outro filtro de data (P72).

---

## 2. Configuração inicial

```sql
-- Banco (opcional; se quiser criar)
-- CREATE DATABASE gestor
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;
-- USE gestor;

SET NAMES utf8mb4;
SET time_zone = '+00:00';  -- UTC (ajustar conforme servidor)

-- Desabilitar verificação de FK durante a criação (opcional; útil para recriar)
-- SET FOREIGN_KEY_CHECKS = 0;
```

---

## 3. Domínios (tabelas de referência)

> **Nota D1 (ncms):** o DDL abaixo é o original (`CHAR(8)`). **A implementação (Bloco 3)** alterou para `VARCHAR(10)` e adicionou `id_ncm_pai`, `aceita_lancamento`, `nivel` (hierarquia). Model `Ncm` já reflete. O DDL de `ncms` abaixo já está atualizado (hierárquico).

> **Nota D2 (descricao):** o DDL abaixo tem `VARCHAR(200/300)`. **A implementação (Bloco 3)** alterou para `TEXT` em `cfops`, `ncms`, `cnaes`, `servicos_lc116` (descrições oficiais longas). Os DDLs abaixo já refletem.

> **Nota D3 (csts):** o DDL abaixo não inclui IBS/CBS. **A implementação (Bloco 4, `CstSeeder`)** inclui `tipo_imposto = 'IBS/CBS'` (LC 214/2025). O DDL de `csts` abaixo já reflete.

```sql
-- cfops
CREATE TABLE cfops (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         CHAR(4) NOT NULL,
  descricao      VARCHAR(200) NOT NULL,   -- implementado como TEXT (D2)
  natureza       CHAR(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cfops_codigo (codigo),
  CONSTRAINT chk_cfops_natureza CHECK (natureza IN ('E','S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Código Fiscal de Operações e Prestações';

-- csts
CREATE TABLE csts (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tipo_imposto   VARCHAR(20) NOT NULL,   -- inclui IBS/CBS (D3)  
  codigo         CHAR(3) NOT NULL,
  descricao      VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_csts_tipo_codigo (tipo_imposto, codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Código de Situação Tributária por tipo de imposto';

-- ncms
-- ncms (implementado como VARCHAR(10) + hierarquia, D1)
CREATE TABLE ncms (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(10) NOT NULL,
  descricao      TEXT NOT NULL,
  id_ncm_pai     BIGINT UNSIGNED NULL,
  aceita_lancamento TINYINT(1) NOT NULL DEFAULT 1,
  nivel          INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ncms_codigo (codigo),
  KEY idx_ncms_id_ncm_pai (id_ncm_pai),
  CONSTRAINT fk_ncms_pai FOREIGN KEY (id_ncm_pai) REFERENCES ncms(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Nomenclatura Comum do Mercosul (hierárquica)';

-- servicos_lc116
CREATE TABLE servicos_lc116 (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(10) NOT NULL,
  descricao      TEXT NOT NULL,   -- D2
  PRIMARY KEY (id),
  UNIQUE KEY uk_servicos_lc116_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Itens da LC 116/2003 (serviços sujeitos ao ISS)';

-- cnaes
CREATE TABLE cnaes (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(15) NOT NULL,
  descricao      TEXT NOT NULL,   -- D2
  PRIMARY KEY (id),
  UNIQUE KEY uk_cnaes_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Classificação Nacional de Atividades Econômicas';

-- ufs
CREATE TABLE ufs (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sigla          CHAR(2) NOT NULL,
  nome           VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_ufs_sigla (sigla)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Unidades Federativas';

-- municipios
CREATE TABLE municipios (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo_ibge         CHAR(7) NOT NULL,
  nome                VARCHAR(200) NOT NULL,
  id_uf               BIGINT UNSIGNED NOT NULL,
  aliquota_iss_padrao DECIMAL(5,2) NULL,
  dados_extras        JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_municipios_codigo_ibge (codigo_ibge),
  KEY idx_municipios_id_uf (id_uf),
  CONSTRAINT fk_municipios_uf FOREIGN KEY (id_uf) REFERENCES ufs(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Municípios (única referência com dados_extras)';

-- tipos_documento
CREATE TABLE tipos_documento (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(10) NOT NULL,
  descricao      VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_tipos_documento_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tipos de documento fiscal (NF-e, NFS-e, CT-e, RPA)';

-- bancos
CREATE TABLE bancos (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(5) NOT NULL,
  nome           VARCHAR(200) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_bancos_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bancos (código oficial do Banco Central)';

-- atores_funcionais
CREATE TABLE atores_funcionais (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(30) NOT NULL,
  descricao      VARCHAR(100) NOT NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_atores_funcionais_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Atores funcionais (configurador, administrador, contador, ...)';
```

---

## 4. Configuração

> **Nota D18:** as FKs de `empresas.id_filial_matriz` e `empresas.id_plano_contas_sugerido` são adicionadas via `ALTER TABLE` **depois** que `filiais` e `planos_contas` existem (dependência circular). O DDL abaixo mostra a criação da tabela e os `ALTER TABLE` separados.

```sql
-- empresas
CREATE TABLE empresas (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cnpj                     CHAR(14) NOT NULL,
  razao_social             VARCHAR(200) NOT NULL,
  nome_fantasia            VARCHAR(200) NULL,
  regime_fiscal            VARCHAR(20) NOT NULL,
  setor                    VARCHAR(20) NOT NULL,
  data_inicio              DATE NOT NULL,
  id_filial_matriz         BIGINT UNSIGNED NULL,  -- FK adicionada depois (D18)
  id_plano_contas_sugerido BIGINT UNSIGNED NULL,  -- FK adicionada depois (D18)  metodo_custo             VARCHAR(20) NOT NULL DEFAULT 'XML',
  dados_extras             JSON NULL,
  created_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by               BIGINT UNSIGNED NULL,
  updated_by               BIGINT UNSIGNED NULL,
  deleted_at               DATETIME NULL,
  deleted_by               BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_empresas_cnpj (cnpj),
  KEY idx_empresas_deleted_at (deleted_at),
  CONSTRAINT chk_empresas_regime CHECK (regime_fiscal IN ('Simples','Presumido','Real')),
  CONSTRAINT chk_empresas_setor CHECK (setor IN ('Comercio','Servicos','Misto')),
  CONSTRAINT chk_empresas_metodo_custo CHECK (metodo_custo IN ('XML','Medio','Manual'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Empresas usuárias do sistema';

-- filiais
CREATE TABLE filiais (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa           BIGINT UNSIGNED NOT NULL,
  cnpj                 CHAR(14) NOT NULL,
  razao_social         VARCHAR(200) NOT NULL,
  nome_fantasia        VARCHAR(200) NULL,
  inscricao_estadual   VARCHAR(20) NULL,
  inscricao_municipal  VARCHAR(20) NULL,
  id_municipio         BIGINT UNSIGNED NULL,
  endereco             VARCHAR(300) NULL,
  id_cnae              BIGINT UNSIGNED NULL,
  data_inicio          DATE NOT NULL,
  data_fim             DATE NULL,
  ativo                TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by           BIGINT UNSIGNED NULL,
  updated_by           BIGINT UNSIGNED NULL,
  deleted_at           DATETIME NULL,
  deleted_by           BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_filiais_cnpj (cnpj),
  KEY idx_filiais_id_empresa (id_empresa),
  KEY idx_filiais_id_municipio (id_municipio),
  KEY idx_filiais_id_cnae (id_cnae),
  KEY idx_filiais_deleted_at (deleted_at),
  CONSTRAINT fk_filiais_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_filiais_municipio FOREIGN KEY (id_municipio) REFERENCES municipios(id) ON UPDATE CASCADE,
  CONSTRAINT fk_filiais_cnae FOREIGN KEY (id_cnae) REFERENCES cnaes(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Filiais (a matriz é apontada por empresas.id_filial_matriz)';

-- FK de empresas.id_filial_matriz (adicionada após filiais existir)
ALTER TABLE empresas
  ADD CONSTRAINT fk_empresas_filial_matriz
  FOREIGN KEY (id_filial_matriz) REFERENCES filiais(id) ON UPDATE CASCADE;

-- FK de empresas.id_plano_contas_sugerido (D18)
ALTER TABLE empresas
  ADD CONSTRAINT fk_empresas_plano_contas_sugerido
  FOREIGN KEY (id_plano_contas_sugerido) REFERENCES planos_contas(id) ON UPDATE CASCADE;  

-- planos_contas
CREATE TABLE planos_contas (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa              BIGINT UNSIGNED NOT NULL,
  codigo                  VARCHAR(20) NOT NULL,
  nivel                   INT NOT NULL,
  descricao               VARCHAR(200) NOT NULL,
  tipo                    VARCHAR(20) NOT NULL,
  subtipo                 VARCHAR(30) NULL,
  natureza                VARCHAR(10) NOT NULL,
  aceita_lancamento       TINYINT(1) NOT NULL DEFAULT 0,
  id_conta_pai            BIGINT UNSIGNED NULL,
  conta_referencial       VARCHAR(20) NULL,
  id_plano_contas_origem  BIGINT UNSIGNED NULL,
  ativo                   TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras            JSON NULL,
  created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by              BIGINT UNSIGNED NULL,
  updated_by              BIGINT UNSIGNED NULL,
  deleted_at              DATETIME NULL,
  deleted_by              BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_planos_contas_id_empresa (id_empresa),
  KEY idx_planos_contas_id_conta_pai (id_conta_pai),
  KEY idx_planos_contas_id_origem (id_plano_contas_origem),
  KEY idx_planos_contas_deleted_at (deleted_at),
  UNIQUE KEY uk_planos_contas_empresa_codigo (id_empresa, codigo),
  CONSTRAINT fk_planos_contas_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_planos_contas_pai FOREIGN KEY (id_conta_pai) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_planos_contas_origem FOREIGN KEY (id_plano_contas_origem) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_planos_contas_tipo CHECK (tipo IN ('Ativo','Passivo','Custo','Despesa','Receita','Resultado Financeiro')),
  CONSTRAINT chk_planos_contas_natureza CHECK (natureza IN ('Sintetica','Analitica'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Plano de contas gerencial';

-- FK de empresas.id_plano_contas_sugerido
ALTER TABLE empresas
  ADD CONSTRAINT fk_empresas_plano_contas_sugerido
  FOREIGN KEY (id_plano_contas_sugerido) REFERENCES planos_contas(id) ON UPDATE CASCADE;

-- centros_custo
CREATE TABLE centros_custo (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  nome           VARCHAR(200) NOT NULL,
  responsavel    VARCHAR(200) NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_centros_custo_id_empresa (id_empresa),
  KEY idx_centros_custo_deleted_at (deleted_at),
  CONSTRAINT fk_centros_custo_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Centros de custo';

-- areas_negocio
CREATE TABLE areas_negocio (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  nome           VARCHAR(200) NOT NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_areas_negocio_id_empresa (id_empresa),
  KEY idx_areas_negocio_deleted_at (deleted_at),
  CONSTRAINT fk_areas_negocio_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Áreas de negócio (agrupamento de centros de custo)';

-- areas_negocio_centros_custo (N:N)
CREATE TABLE areas_negocio_centros_custo (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_area_negocio   BIGINT UNSIGNED NOT NULL,
  id_centro_custo   BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_areas_negocio_centros_custo (id_area_negocio, id_centro_custo),
  KEY idx_areas_negocio_centros_custo_centro (id_centro_custo),
  CONSTRAINT fk_areas_negocio_centros_custo_area FOREIGN KEY (id_area_negocio) REFERENCES areas_negocio(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_areas_negocio_centros_custo_centro FOREIGN KEY (id_centro_custo) REFERENCES centros_custo(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Relação N:N entre áreas de negócio e centros de custo';

-- periodos
CREATE TABLE periodos (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial             BIGINT UNSIGNED NOT NULL,
  mes_ano               CHAR(7) NOT NULL,
  status                VARCHAR(20) NOT NULL,
  data_fechamento       DATETIME NULL,
  id_usuario_fechamento BIGINT UNSIGNED NULL,
  dados_extras          JSON NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by            BIGINT UNSIGNED NULL,
  updated_by            BIGINT UNSIGNED NULL,
  deleted_at            DATETIME NULL,
  deleted_by            BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_periodos_filial_mes_ano (id_filial, mes_ano),
  KEY idx_periodos_status (status),
  KEY idx_periodos_deleted_at (deleted_at),
  CONSTRAINT fk_periodos_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT chk_periodos_status CHECK (status IN ('Aberto','Em fechamento','Fechado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Períodos contábeis (por filial)';
```

---

## 5. Pessoas

```sql
-- pessoas
CREATE TABLE pessoas (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  tipo           CHAR(2) NOT NULL,
  documento      VARCHAR(14) NOT NULL,
  nome           VARCHAR(200) NOT NULL,
  email          VARCHAR(200) NULL,
  telefone       VARCHAR(20) NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pessoas_empresa_documento (id_empresa, documento),
  KEY idx_pessoas_id_empresa (id_empresa),
  KEY idx_pessoas_deleted_at (deleted_at),
  CONSTRAINT fk_pessoas_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_pessoas_tipo CHECK (tipo IN ('PF','PJ'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Pessoas (PF/PJ unificadas)';

-- pessoas_fisicas
CREATE TABLE pessoas_fisicas (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pessoa       BIGINT UNSIGNED NOT NULL,
  data_nascimento DATE NULL,
  dados_extras    JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pessoas_fisicas_id_pessoa (id_pessoa),
  CONSTRAINT fk_pessoas_fisicas_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Dados adicionais de pessoa física';

-- pessoas_juridicas
CREATE TABLE pessoas_juridicas (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pessoa         BIGINT UNSIGNED NOT NULL,
  nome_fantasia     VARCHAR(200) NULL,
  id_municipio      BIGINT UNSIGNED NULL,
  categoria_padrao  VARCHAR(50) NULL,
  prazo_padrao_dias INT NULL,
  dados_extras      JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pessoas_juridicas_id_pessoa (id_pessoa),
  KEY idx_pessoas_juridicas_id_municipio (id_municipio),
  CONSTRAINT fk_pessoas_juridicas_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pessoas_juridicas_municipio FOREIGN KEY (id_municipio) REFERENCES municipios(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Dados adicionais de pessoa jurídica';

-- pessoas_tags
CREATE TABLE pessoas_tags (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pessoa      BIGINT UNSIGNED NOT NULL,
  tag            VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pessoas_tags (id_pessoa, tag),
  KEY idx_pessoas_tags_tag (tag),
  CONSTRAINT fk_pessoas_tags_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tags de pessoa (Cliente, Fornecedor, Funcionário, ...)';

-- funcionarios
CREATE TABLE funcionarios (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pessoa       BIGINT UNSIGNED NOT NULL,
  id_filial       BIGINT UNSIGNED NOT NULL,
  cargo           VARCHAR(100) NULL,
  id_centro_custo BIGINT UNSIGNED NULL,
  salario_base    DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  data_admissao   DATE NOT NULL,
  data_demissao   DATE NULL,
  natureza        VARCHAR(10) NOT NULL,
  ativo           TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras    JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by      BIGINT UNSIGNED NULL,
  updated_by      BIGINT UNSIGNED NULL,
  deleted_at      DATETIME NULL,
  deleted_by      BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_funcionarios_id_pessoa (id_pessoa),
  KEY idx_funcionarios_id_filial (id_filial),
  KEY idx_funcionarios_id_centro_custo (id_centro_custo),
  KEY idx_funcionarios_deleted_at (deleted_at),
  CONSTRAINT fk_funcionarios_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_funcionarios_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_funcionarios_centro_custo FOREIGN KEY (id_centro_custo) REFERENCES centros_custo(id) ON UPDATE CASCADE,
  CONSTRAINT chk_funcionarios_natureza CHECK (natureza IN ('Custo','Despesa Fixa'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Funcionários';

-- funcionarios_centros_custo (N:N, rateio)
CREATE TABLE funcionarios_centros_custo (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_funcionario  BIGINT UNSIGNED NOT NULL,
  id_centro_custo BIGINT UNSIGNED NOT NULL,
  percentual      DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_funcionarios_centros_custo (id_funcionario, id_centro_custo),
  KEY idx_funcionarios_centros_custo_centro (id_centro_custo),
  CONSTRAINT fk_funcionarios_centros_custo_func FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_funcionarios_centros_custo_centro FOREIGN KEY (id_centro_custo) REFERENCES centros_custo(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_funcionarios_centros_custo_percentual CHECK (percentual >= 0 AND percentual <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Rateio de funcionário por centro de custo';
```

---

## 6. Produtos e serviços

```sql
-- produtos_servicos
CREATE TABLE produtos_servicos (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  tipo           CHAR(1) NOT NULL,
  codigo_interno VARCHAR(50) NULL,
  descricao      VARCHAR(300) NOT NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_produtos_servicos_id_empresa (id_empresa),
  KEY idx_produtos_servicos_deleted_at (deleted_at),
  CONSTRAINT fk_produtos_servicos_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_produtos_servicos_tipo CHECK (tipo IN ('P','S'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produtos e serviços (tabela pai)';

-- produtos
CREATE TABLE produtos (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_produto_servico BIGINT UNSIGNED NOT NULL,
  id_ncm             BIGINT UNSIGNED NULL,
  unidade            VARCHAR(10) NULL,
  dados_extras       JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_produtos_id_produto_servico (id_produto_servico),
  KEY idx_produtos_id_ncm (id_ncm),
  CONSTRAINT fk_produtos_produto_servico FOREIGN KEY (id_produto_servico) REFERENCES produtos_servicos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_produtos_ncm FOREIGN KEY (id_ncm) REFERENCES ncms(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produtos';

-- servicos
CREATE TABLE servicos (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_produto_servico BIGINT UNSIGNED NOT NULL,
  id_servico_lc116   BIGINT UNSIGNED NULL,
  dados_extras       JSON NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_servicos_id_produto_servico (id_produto_servico),
  KEY idx_servicos_id_servico_lc116 (id_servico_lc116),
  CONSTRAINT fk_servicos_produto_servico FOREIGN KEY (id_produto_servico) REFERENCES produtos_servicos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_servicos_servico_lc116 FOREIGN KEY (id_servico_lc116) REFERENCES servicos_lc116(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Serviços';

-- produtos_custos
CREATE TABLE produtos_custos (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_produto_servico BIGINT UNSIGNED NOT NULL,
  id_filial          BIGINT UNSIGNED NOT NULL,
  data_referencia    DATE NOT NULL,
  custo_medio        DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  dados_extras       JSON NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_produtos_custos_id_produto_servico (id_produto_servico),
  KEY idx_produtos_custos_id_filial (id_filial),
  KEY idx_produtos_custos_data_referencia (data_referencia),
  CONSTRAINT fk_produtos_custos_produto_servico FOREIGN KEY (id_produto_servico) REFERENCES produtos_servicos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_produtos_custos_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Custo médio por produto/filial/data (método Médio)';
```

---

## 7. Bancos e contas

```sql
-- contas_bancarias
CREATE TABLE contas_bancarias (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial          BIGINT UNSIGNED NOT NULL,
  id_banco           BIGINT UNSIGNED NOT NULL,
  agencia            VARCHAR(10) NULL,
  numero             VARCHAR(20) NULL,
  tipo               VARCHAR(20) NULL,
  saldo_inicial      DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  saldo_inicial_data DATE NULL,
  ativo              TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras       JSON NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by         BIGINT UNSIGNED NULL,
  updated_by         BIGINT UNSIGNED NULL,
  deleted_at         DATETIME NULL,
  deleted_by         BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_contas_bancarias_id_filial (id_filial),
  KEY idx_contas_bancarias_id_banco (id_banco),
  KEY idx_contas_bancarias_deleted_at (deleted_at),
  CONSTRAINT fk_contas_bancarias_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_bancarias_banco FOREIGN KEY (id_banco) REFERENCES bancos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_contas_bancarias_tipo CHECK (tipo IS NULL OR tipo IN ('Corrente','Poupanca'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Contas bancárias por filial';
```

---

## 8. Formas e condições

```sql
-- formas_pagamento
CREATE TABLE formas_pagamento (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  descricao      VARCHAR(100) NOT NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_formas_pagamento_id_empresa (id_empresa),
  KEY idx_formas_pagamento_deleted_at (deleted_at),
  CONSTRAINT fk_formas_pagamento_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Formas de pagamento';

-- condicoes_pagamento
CREATE TABLE condicoes_pagamento (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa      BIGINT UNSIGNED NOT NULL,
  descricao       VARCHAR(100) NOT NULL,
  numero_parcelas INT NOT NULL DEFAULT 1,
  intervalo_dias  INT NOT NULL DEFAULT 30,
  ativo           TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras    JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by      BIGINT UNSIGNED NULL,
  updated_by      BIGINT UNSIGNED NULL,
  deleted_at      DATETIME NULL,
  deleted_by      BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_condicoes_pagamento_id_empresa (id_empresa),
  KEY idx_condicoes_pagamento_deleted_at (deleted_at),
  CONSTRAINT fk_condicoes_pagamento_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_condicoes_pagamento_parcelas CHECK (numero_parcelas >= 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Condições de pagamento (parcelamento)';
```

---

## 9. Ativos

```sql
-- ativos
CREATE TABLE ativos (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial                BIGINT UNSIGNED NOT NULL,
  descricao                VARCHAR(200) NOT NULL,
  data_aquisicao           DATE NOT NULL,
  valor_original           DECIMAL(15,2) NOT NULL,
  valor_residual           DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  vida_util_meses          INT NOT NULL,
  metodo_depreciacao       VARCHAR(20) NOT NULL DEFAULT 'Linear',
  mes_inicial_depreciacao  CHAR(7) NOT NULL,
  id_centro_custo          BIGINT UNSIGNED NULL,
  destino                  VARCHAR(10) NOT NULL,
  status                   VARCHAR(20) NOT NULL DEFAULT 'Em uso',
  dados_extras             JSON NULL,
  created_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by               BIGINT UNSIGNED NULL,
  updated_by               BIGINT UNSIGNED NULL,
  deleted_at               DATETIME NULL,
  deleted_by               BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_ativos_id_filial (id_filial),
  KEY idx_ativos_id_centro_custo (id_centro_custo),
  KEY idx_ativos_deleted_at (deleted_at),
  CONSTRAINT fk_ativos_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_ativos_centro_custo FOREIGN KEY (id_centro_custo) REFERENCES centros_custo(id) ON UPDATE CASCADE,
  CONSTRAINT chk_ativos_metodo CHECK (metodo_depreciacao IN ('Linear','Soma Digitos','Unidades')),
  CONSTRAINT chk_ativos_destino CHECK (destino IN ('Custo','Despesa')),
  CONSTRAINT chk_ativos_status CHECK (status IN ('Em uso','Ocioso','Alienado')),
  CONSTRAINT chk_ativos_valor CHECK (valor_original >= valor_residual),
  CONSTRAINT chk_ativos_vida_util CHECK (vida_util_meses > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ativos (bens/patrimônios)';
```

---

## 10. Proventos e descontos

```sql
-- proventos_descontos
CREATE TABLE proventos_descontos (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  codigo         VARCHAR(10) NOT NULL,
  descricao      VARCHAR(100) NOT NULL,
  tipo           VARCHAR(10) NOT NULL,
  entra_inss     TINYINT(1) NOT NULL DEFAULT 0,
  entra_fgts     TINYINT(1) NOT NULL DEFAULT 0,
  entra_irrf     TINYINT(1) NOT NULL DEFAULT 0,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_proventos_descontos_empresa_codigo (id_empresa, codigo),
  KEY idx_proventos_descontos_id_empresa (id_empresa),
  KEY idx_proventos_descontos_deleted_at (deleted_at),
  CONSTRAINT fk_proventos_descontos_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_proventos_descontos_tipo CHECK (tipo IN ('Provento','Desconto'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Proventos e descontos da folha';
```

---

## 11. Documentos fiscais

```sql
-- notas_fiscais
CREATE TABLE notas_fiscais (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial              BIGINT UNSIGNED NOT NULL,
  id_tipo_documento      BIGINT UNSIGNED NOT NULL,
  origem                 VARCHAR(10) NOT NULL,
  direcao                VARCHAR(10) NOT NULL,
  chave                  CHAR(44) NULL,
  numero                 VARCHAR(20) NULL,
  serie                  VARCHAR(10) NULL,
  data_emissao           DATE NOT NULL,
  id_pessoa_emitente     BIGINT UNSIGNED NULL,
  id_pessoa_destinatario BIGINT UNSIGNED NULL,
  id_municipio_emissao   BIGINT UNSIGNED NULL,
  valor_produtos         DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_desconto         DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_frete            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_total            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  xml_origem             LONGTEXT NULL,
  status_importacao      VARCHAR(30) NOT NULL,
  status_fluxo           VARCHAR(30) NULL,
  motivo_cancelamento    VARCHAR(200) NULL,
  id_periodo             BIGINT UNSIGNED NOT NULL,
  dados_extras           JSON NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by             BIGINT UNSIGNED NULL,
  updated_by             BIGINT UNSIGNED NULL,
  deleted_at             DATETIME NULL,
  deleted_by             BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_notas_fiscais_chave (chave),
  KEY idx_notas_fiscais_id_filial (id_filial),
  KEY idx_notas_fiscais_id_tipo_documento (id_tipo_documento),
  KEY idx_notas_fiscais_id_periodo (id_periodo),
  KEY idx_notas_fiscais_id_pessoa_emitente (id_pessoa_emitente),
  KEY idx_notas_fiscais_id_pessoa_destinatario (id_pessoa_destinatario),
  KEY idx_notas_fiscais_data_emissao (data_emissao),
  KEY idx_notas_fiscais_status_importacao (status_importacao),
  KEY idx_notas_fiscais_status_fluxo (status_fluxo),
  KEY idx_notas_fiscais_deleted_at (deleted_at),
  CONSTRAINT fk_notas_fiscais_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_tipo_documento FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_pessoa_emitente FOREIGN KEY (id_pessoa_emitente) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_pessoa_destinatario FOREIGN KEY (id_pessoa_destinatario) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_municipio FOREIGN KEY (id_municipio_emissao) REFERENCES municipios(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_notas_fiscais_origem CHECK (origem IN ('Propria','Terceiros')),
  CONSTRAINT chk_notas_fiscais_direcao CHECK (direcao IN ('Entrada','Saida')),
  CONSTRAINT chk_notas_fiscais_status_importacao CHECK (status_importacao IN ('Importado','Importado com erro','Importado com aviso','Cancelado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Notas fiscais (NF-e, NFS-e, CT-e, RPA)';

-- notas_fiscais_itens
CREATE TABLE notas_fiscais_itens (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nota_fiscal     BIGINT UNSIGNED NOT NULL,
  numero_item        INT NOT NULL,
  id_produto_servico BIGINT UNSIGNED NULL,
  descricao          VARCHAR(300) NOT NULL,
  id_cfop            BIGINT UNSIGNED NULL,
  id_ncm             BIGINT UNSIGNED NULL,
  id_servico_lc116   BIGINT UNSIGNED NULL,
  quantidade         DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  valor_unitario     DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  custo_unitario     DECIMAL(15,4) NOT NULL DEFAULT 0.0000,
  valor_total        DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_desconto     DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_frete        DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_seguro       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  outras_despesas    DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  dados_extras       JSON NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notas_fiscais_itens_id_nota_fiscal (id_nota_fiscal),
  KEY idx_notas_fiscais_itens_id_produto_servico (id_produto_servico),
  KEY idx_notas_fiscais_itens_id_cfop (id_cfop),
  KEY idx_notas_fiscais_itens_id_ncm (id_ncm),
  KEY idx_notas_fiscais_itens_id_servico_lc116 (id_servico_lc116),
  CONSTRAINT fk_notas_fiscais_itens_nota FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_itens_produto_servico FOREIGN KEY (id_produto_servico) REFERENCES produtos_servicos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_itens_cfop FOREIGN KEY (id_cfop) REFERENCES cfops(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_itens_ncm FOREIGN KEY (id_ncm) REFERENCES ncms(id) ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_itens_servico_lc116 FOREIGN KEY (id_servico_lc116) REFERENCES servicos_lc116(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Itens das notas fiscais';

-- notas_fiscais_impostos
CREATE TABLE notas_fiscais_impostos (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nota_fiscal_item   BIGINT UNSIGNED NOT NULL,
  tipo_imposto          VARCHAR(20) NOT NULL,
  id_cst                BIGINT UNSIGNED NULL,
  base_calculo          DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  aliquota              DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
  valor                 DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_st              DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  dados_extras          JSON NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notas_fiscais_impostos_item (id_nota_fiscal_item),
  KEY idx_notas_fiscais_impostos_tipo (tipo_imposto),
  KEY idx_notas_fiscais_impostos_cst (id_cst),
  CONSTRAINT fk_notas_fiscais_impostos_item FOREIGN KEY (id_nota_fiscal_item) REFERENCES notas_fiscais_itens(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_impostos_cst FOREIGN KEY (id_cst) REFERENCES csts(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Impostos por item de nota fiscal';

-- notas_fiscais_vinculos
CREATE TABLE notas_fiscais_vinculos (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_nota_fiscal      BIGINT UNSIGNED NOT NULL,
  id_nota_vinculada   BIGINT UNSIGNED NOT NULL,
  tipo_vinculo        VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_notas_fiscais_vinculos (id_nota_fiscal, id_nota_vinculada, tipo_vinculo),
  KEY idx_notas_fiscais_vinculos_vinculada (id_nota_vinculada),
  CONSTRAINT fk_notas_fiscais_vinculos_origem FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notas_fiscais_vinculos_destino FOREIGN KEY (id_nota_vinculada) REFERENCES notas_fiscais(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Vínculo entre notas fiscais (ex: CT-e → NF-e)';
```

---

## 12. Contas a pagar/receber

```sql
-- contas_pagar
CREATE TABLE contas_pagar (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial             BIGINT UNSIGNED NOT NULL,
  id_nota_fiscal        BIGINT UNSIGNED NULL,
  id_pessoa             BIGINT UNSIGNED NOT NULL,
  numero_parcela        INT NOT NULL DEFAULT 1,
  total_parcelas        INT NOT NULL DEFAULT 1,
  valor                 DECIMAL(15,2) NOT NULL,
  data_emissao          DATE NOT NULL,
  data_vencimento       DATE NOT NULL,
  data_pagamento        DATE NULL,
  valor_pago            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  juros                 DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  multa                 DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  desconto              DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  status                VARCHAR(20) NOT NULL DEFAULT 'Aberta',
  status_fluxo          VARCHAR(30) NULL,
  id_conta_bancaria     BIGINT UNSIGNED NULL,
  id_forma_pagamento    BIGINT UNSIGNED NULL,
  id_condicao_pagamento BIGINT UNSIGNED NULL,
  id_lancamento_baixa   BIGINT UNSIGNED NULL,
  dados_extras          JSON NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by            BIGINT UNSIGNED NULL,
  updated_by            BIGINT UNSIGNED NULL,
  deleted_at            DATETIME NULL,
  deleted_by            BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_contas_pagar_id_filial (id_filial),
  KEY idx_contas_pagar_id_nota_fiscal (id_nota_fiscal),
  KEY idx_contas_pagar_id_pessoa (id_pessoa),
  KEY idx_contas_pagar_data_vencimento (data_vencimento),
  KEY idx_contas_pagar_status (status),
  KEY idx_contas_pagar_status_fluxo (status_fluxo),
  KEY idx_contas_pagar_id_conta_bancaria (id_conta_bancaria),
  KEY idx_contas_pagar_deleted_at (deleted_at),
  CONSTRAINT fk_contas_pagar_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_pagar_nota_fiscal FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_pagar_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_pagar_conta_bancaria FOREIGN KEY (id_conta_bancaria) REFERENCES contas_bancarias(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_pagar_forma_pagamento FOREIGN KEY (id_forma_pagamento) REFERENCES formas_pagamento(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_pagar_condicao_pagamento FOREIGN KEY (id_condicao_pagamento) REFERENCES condicoes_pagamento(id) ON UPDATE CASCADE,
  CONSTRAINT chk_contas_pagar_status CHECK (status IN ('Aberta','Parcialmente baixada','Baixada','Cancelada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Contas a pagar';

-- contas_receber
CREATE TABLE contas_receber (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial               BIGINT UNSIGNED NOT NULL,
  id_nota_fiscal          BIGINT UNSIGNED NULL,
  id_pessoa               BIGINT UNSIGNED NOT NULL,
  numero_parcela          INT NOT NULL DEFAULT 1,
  total_parcelas          INT NOT NULL DEFAULT 1,
  valor                   DECIMAL(15,2) NOT NULL,
  data_emissao            DATE NOT NULL,
  data_vencimento         DATE NOT NULL,
  data_recebimento        DATE NULL,
  valor_recebido          DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  juros                   DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  multa                   DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  desconto                DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  status                  VARCHAR(20) NOT NULL DEFAULT 'Aberta',
  status_fluxo            VARCHAR(30) NULL,
  id_conta_bancaria       BIGINT UNSIGNED NULL,
  id_forma_recebimento    BIGINT UNSIGNED NULL,
  id_condicao_recebimento BIGINT UNSIGNED NULL,
  id_lancamento_baixa     BIGINT UNSIGNED NULL,
  dados_extras            JSON NULL,
  created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by              BIGINT UNSIGNED NULL,
  updated_by              BIGINT UNSIGNED NULL,
  deleted_at              DATETIME NULL,
  deleted_by              BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_contas_receber_id_filial (id_filial),
  KEY idx_contas_receber_id_nota_fiscal (id_nota_fiscal),
  KEY idx_contas_receber_id_pessoa (id_pessoa),
  KEY idx_contas_receber_data_vencimento (data_vencimento),
  KEY idx_contas_receber_status (status),
  KEY idx_contas_receber_status_fluxo (status_fluxo),
  KEY idx_contas_receber_id_conta_bancaria (id_conta_bancaria),
  KEY idx_contas_receber_deleted_at (deleted_at),
  CONSTRAINT fk_contas_receber_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_receber_nota_fiscal FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_receber_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_receber_conta_bancaria FOREIGN KEY (id_conta_bancaria) REFERENCES contas_bancarias(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_receber_forma_recebimento FOREIGN KEY (id_forma_recebimento) REFERENCES formas_pagamento(id) ON UPDATE CASCADE,
  CONSTRAINT fk_contas_receber_condicao_recebimento FOREIGN KEY (id_condicao_recebimento) REFERENCES condicoes_pagamento(id) ON UPDATE CASCADE,
  CONSTRAINT chk_contas_receber_status CHECK (status IN ('Aberta','Parcialmente baixada','Baixada','Cancelada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Contas a receber';
```

---

## 13. Lançamentos

```sql
-- lancamentos
CREATE TABLE lancamentos (
  id                          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial                   BIGINT UNSIGNED NOT NULL,
  id_periodo                  BIGINT UNSIGNED NOT NULL,
  data_competencia            DATE NOT NULL,
  data_emissao_documento      DATE NULL,
  historico                   VARCHAR(500) NOT NULL,
  valor                       DECIMAL(15,2) NOT NULL,
  id_conta_debito             BIGINT UNSIGNED NOT NULL,
  id_conta_credito            BIGINT UNSIGNED NOT NULL,
  id_centro_custo             BIGINT UNSIGNED NULL,
  id_pessoa                   BIGINT UNSIGNED NULL,
  id_nota_fiscal              BIGINT UNSIGNED NULL,
  id_nota_fiscal_item         BIGINT UNSIGNED NULL,
  tipo_lancamento             VARCHAR(30) NOT NULL,
  status_classificacao        VARCHAR(30) NOT NULL,
  justificativa_classificacao TEXT NULL,
  id_lancamento_estorno       BIGINT UNSIGNED NULL,
  dados_extras                JSON NULL,
  created_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by                  BIGINT UNSIGNED NULL,
  updated_by                  BIGINT UNSIGNED NULL,
  deleted_at                  DATETIME NULL,
  deleted_by                  BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_lancamentos_id_filial (id_filial),
  KEY idx_lancamentos_id_periodo (id_periodo),
  KEY idx_lancamentos_data_competencia (data_competencia),
  KEY idx_lancamentos_id_conta_debito (id_conta_debito),
  KEY idx_lancamentos_id_conta_credito (id_conta_credito),
  KEY idx_lancamentos_id_centro_custo (id_centro_custo),
  KEY idx_lancamentos_id_pessoa (id_pessoa),
  KEY idx_lancamentos_id_nota_fiscal (id_nota_fiscal),
  KEY idx_lancamentos_tipo_lancamento (tipo_lancamento),
  KEY idx_lancamentos_status_classificacao (status_classificacao),
  KEY idx_lancamentos_deleted_at (deleted_at),
  CONSTRAINT fk_lancamentos_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_conta_debito FOREIGN KEY (id_conta_debito) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_conta_credito FOREIGN KEY (id_conta_credito) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_centro_custo FOREIGN KEY (id_centro_custo) REFERENCES centros_custo(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_nota_fiscal FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_nota_fiscal_item FOREIGN KEY (id_nota_fiscal_item) REFERENCES notas_fiscais_itens(id) ON UPDATE CASCADE,
  CONSTRAINT fk_lancamentos_estorno FOREIGN KEY (id_lancamento_estorno) REFERENCES lancamentos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_lancamentos_status_classificacao CHECK (status_classificacao IN ('Classificado automaticamente','Classificado manualmente','Nao classificado','Conflito')),
  CONSTRAINT chk_lancamentos_valor CHECK (valor > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lançamentos em partidas dobradas (tabela central)';
```

---

## 14. Folha

```sql
-- folhas_pagamento
CREATE TABLE folhas_pagamento (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial          BIGINT UNSIGNED NOT NULL,
  id_periodo         BIGINT UNSIGNED NOT NULL,
  mes_ano_referencia CHAR(7) NOT NULL,
  status             VARCHAR(20) NOT NULL,
  id_lancamento      BIGINT UNSIGNED NULL,
  dados_extras       JSON NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by         BIGINT UNSIGNED NULL,
  updated_by         BIGINT UNSIGNED NULL,
  deleted_at         DATETIME NULL,
  deleted_by         BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_folhas_pagamento_id_filial (id_filial),
  KEY idx_folhas_pagamento_id_periodo (id_periodo),
  KEY idx_folhas_pagamento_status (status),
  KEY idx_folhas_pagamento_deleted_at (deleted_at),
  CONSTRAINT fk_folhas_pagamento_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_folhas_pagamento_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_folhas_pagamento_lancamento FOREIGN KEY (id_lancamento) REFERENCES lancamentos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_folhas_pagamento_status CHECK (status IN ('Calculada','Revisada','Fechada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Folhas de pagamento (por filial/período)';

-- folhas_pagamento_itens
CREATE TABLE folhas_pagamento_itens (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_folha_pagamento    BIGINT UNSIGNED NOT NULL,
  id_funcionario        BIGINT UNSIGNED NOT NULL,
  salario_base          DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_proventos       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  total_descontos       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  base_inss             DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  base_fgts             DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  base_irrf             DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_inss_empregado  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_inss_patronal   DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_fgts            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_irrf            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_rat             DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_terceiros       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  valor_liquido         DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  dados_extras          JSON NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_folhas_pagamento_itens_folha (id_folha_pagamento),
  KEY idx_folhas_pagamento_itens_funcionario (id_funcionario),
  CONSTRAINT fk_folhas_pagamento_itens_folha FOREIGN KEY (id_folha_pagamento) REFERENCES folhas_pagamento(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_folhas_pagamento_itens_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Itens da folha (por funcionário)';

-- folhas_pagamento_proventos_descontos
CREATE TABLE folhas_pagamento_proventos_descontos (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_folha_pagamento_item  BIGINT UNSIGNED NOT NULL,
  id_provento_desconto     BIGINT UNSIGNED NOT NULL,
  valor                    DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_folhas_pagamento_proventos_descontos (id_folha_pagamento_item, id_provento_desconto),
  KEY idx_folhas_pagamento_proventos_descontos_provento (id_provento_desconto),
  CONSTRAINT fk_folhas_pagamento_proventos_descontos_item FOREIGN KEY (id_folha_pagamento_item) REFERENCES folhas_pagamento_itens(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_folhas_pagamento_proventos_descontos_provento FOREIGN KEY (id_provento_desconto) REFERENCES proventos_descontos(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Proventos e descontos por item de folha';
```

---

## 15. Depreciação e provisões

```sql
-- depreciacoes
CREATE TABLE depreciacoes (
  id                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial               BIGINT UNSIGNED NOT NULL,
  id_periodo              BIGINT UNSIGNED NOT NULL,
  id_ativo                BIGINT UNSIGNED NOT NULL,
  valor_depreciacao       DECIMAL(15,2) NOT NULL,
  depreciacao_acumulada   DECIMAL(15,2) NOT NULL,
  valor_contabil_liquido  DECIMAL(15,2) NOT NULL,
  id_lancamento           BIGINT UNSIGNED NULL,
  dados_extras            JSON NULL,
  created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_depreciacoes_id_filial (id_filial),
  KEY idx_depreciacoes_id_periodo (id_periodo),
  KEY idx_depreciacoes_id_ativo (id_ativo),
  CONSTRAINT fk_depreciacoes_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_depreciacoes_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_depreciacoes_ativo FOREIGN KEY (id_ativo) REFERENCES ativos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_depreciacoes_lancamento FOREIGN KEY (id_lancamento) REFERENCES lancamentos(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Depreciação mensal por ativo';

-- provisoes
CREATE TABLE provisoes (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial       BIGINT UNSIGNED NOT NULL,
  id_periodo      BIGINT UNSIGNED NOT NULL,
  id_funcionario  BIGINT UNSIGNED NOT NULL,
  tipo            VARCHAR(20) NOT NULL,
  valor_provisao  DECIMAL(15,2) NOT NULL,
  valor_encargos  DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  id_lancamento   BIGINT UNSIGNED NULL,
  dados_extras    JSON NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_provisoes_id_filial (id_filial),
  KEY idx_provisoes_id_periodo (id_periodo),
  KEY idx_provisoes_id_funcionario (id_funcionario),
  CONSTRAINT fk_provisoes_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_provisoes_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_provisoes_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id) ON UPDATE CASCADE,
  CONSTRAINT fk_provisoes_lancamento FOREIGN KEY (id_lancamento) REFERENCES lancamentos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_provisoes_tipo CHECK (tipo IN ('Ferias','13o'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Provisões de férias e 13º';
```

---

## 16. Classificação

```sql
-- regras_classificacao
CREATE TABLE regras_classificacao (
  id                            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa                    BIGINT UNSIGNED NOT NULL,
  descricao                     VARCHAR(200) NOT NULL,
  prioridade                    INT NOT NULL,
  id_tipo_documento             BIGINT UNSIGNED NULL,
  id_cfop                       BIGINT UNSIGNED NULL,
  id_cst                        BIGINT UNSIGNED NULL,
  id_ncm                        BIGINT UNSIGNED NULL,
  id_servico_lc116              BIGINT UNSIGNED NULL,
  id_pessoa_fornecedor          BIGINT UNSIGNED NULL,
  categoria_fornecedor          VARCHAR(50) NULL,
  historico_palavra_chave       VARCHAR(100) NULL,
  id_conta_destino              BIGINT UNSIGNED NOT NULL,
  id_centro_custo_padrao        BIGINT UNSIGNED NULL,
  id_conta_contrapartida_padrao BIGINT UNSIGNED NULL,
  origem                        VARCHAR(20) NOT NULL,
  id_lancamento_origem          BIGINT UNSIGNED NULL,
  ativo                         TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras                  JSON NULL,
  created_at                    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by                    BIGINT UNSIGNED NULL,
  updated_by                    BIGINT UNSIGNED NULL,
  deleted_at                    DATETIME NULL,
  deleted_by                    BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_regras_classificacao_empresa (id_empresa),
  KEY idx_regras_classificacao_prioridade (prioridade),
  KEY idx_regras_classificacao_tipo_documento (id_tipo_documento),
  KEY idx_regras_classificacao_cfop (id_cfop),
  KEY idx_regras_classificacao_cst (id_cst),
  KEY idx_regras_classificacao_ncm (id_ncm),
  KEY idx_regras_classificacao_servico_lc116 (id_servico_lc116),
  KEY idx_regras_classificacao_fornecedor (id_pessoa_fornecedor),
  KEY idx_regras_classificacao_conta_destino (id_conta_destino),
  KEY idx_regras_classificacao_deleted_at (deleted_at),
  CONSTRAINT fk_regras_classificacao_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_tipo_documento FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_cfop FOREIGN KEY (id_cfop) REFERENCES cfops(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_cst FOREIGN KEY (id_cst) REFERENCES csts(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_ncm FOREIGN KEY (id_ncm) REFERENCES ncms(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_servico_lc116 FOREIGN KEY (id_servico_lc116) REFERENCES servicos_lc116(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_fornecedor FOREIGN KEY (id_pessoa_fornecedor) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_conta_destino FOREIGN KEY (id_conta_destino) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_centro_custo FOREIGN KEY (id_centro_custo_padrao) REFERENCES centros_custo(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_contrapartida FOREIGN KEY (id_conta_contrapartida_padrao) REFERENCES planos_contas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_regras_classificacao_lancamento_origem FOREIGN KEY (id_lancamento_origem) REFERENCES lancamentos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_regras_classificacao_prioridade CHECK (prioridade BETWEEN 1 AND 8),
  CONSTRAINT chk_regras_classificacao_origem CHECK (origem IN ('Manual','Aprendida'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Regras de classificação automática';

-- regras_classificacao_logs
CREATE TABLE regras_classificacao_logs (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_regra_classificacao BIGINT UNSIGNED NOT NULL,
  acao                   VARCHAR(20) NOT NULL,
  id_usuario             BIGINT UNSIGNED NULL,
  justificativa          TEXT NULL,
  dados_anteriores       JSON NULL,
  dados_novos            JSON NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_regras_classificacao_logs_regra (id_regra_classificacao),
  KEY idx_regras_classificacao_logs_usuario (id_usuario),
  CONSTRAINT fk_regras_classificacao_logs_regra FOREIGN KEY (id_regra_classificacao) REFERENCES regras_classificacao(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_regras_classificacao_logs_acao CHECK (acao IN ('Criada','Editada','Desativada','Reativada'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Histórico de alterações das regras de classificação';
```

---

## 17. Parâmetros

```sql
-- parametros_fiscais
CREATE TABLE parametros_fiscais (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa           BIGINT UNSIGNED NULL,  -- NULL = universal
  tipo_imposto         VARCHAR(20) NOT NULL,
  descricao            VARCHAR(100) NOT NULL,
  aliquota             DECIMAL(7,4) NOT NULL,
  base_calculo         VARCHAR(50) NULL,
  data_inicio_validade DATE NOT NULL,
  data_fim_validade    DATE NULL,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by           BIGINT UNSIGNED NULL,
  updated_by           BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_parametros_fiscais_empresa (id_empresa),
  KEY idx_parametros_fiscais_tipo (tipo_imposto),
  KEY idx_parametros_fiscais_vigencia (data_inicio_validade, data_fim_validade),
  CONSTRAINT fk_parametros_fiscais_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Parâmetros fiscais (vigência por período)';

-- tabelas_inss
CREATE TABLE tabelas_inss (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  faixa                INT NOT NULL,
  valor_inicial        DECIMAL(15,2) NOT NULL,
  valor_final          DECIMAL(15,2) NOT NULL,
  aliquota             DECIMAL(7,4) NOT NULL,
  data_inicio_validade DATE NOT NULL,
  data_fim_validade    DATE NULL,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tabelas_inss_vigencia (data_inicio_validade, data_fim_validade),
  KEY idx_tabelas_inss_faixa (faixa),
  CONSTRAINT chk_tabelas_inss_faixa CHECK (valor_final >= valor_inicial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabela INSS (faixas e alíquotas)';

-- tabelas_irrf
CREATE TABLE tabelas_irrf (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  faixa                INT NOT NULL,
  valor_inicial        DECIMAL(15,2) NOT NULL,
  valor_final          DECIMAL(15,2) NOT NULL,
  aliquota             DECIMAL(7,4) NOT NULL,
  deducao              DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  redutor              DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  data_inicio_validade DATE NOT NULL,
  data_fim_validade    DATE NULL,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tabelas_irrf_vigencia (data_inicio_validade, data_fim_validade),
  KEY idx_tabelas_irrf_faixa (faixa),
  CONSTRAINT chk_tabelas_irrf_faixa CHECK (valor_final >= valor_inicial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabela IRRF (faixas, alíquotas, deduções, redutor)';

-- tabelas_encargos
CREATE TABLE tabelas_encargos (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao            VARCHAR(100) NOT NULL,
  aliquota             DECIMAL(7,4) NOT NULL,
  data_inicio_validade DATE NOT NULL,
  data_fim_validade    DATE NULL,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tabelas_encargos_vigencia (data_inicio_validade, data_fim_validade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabela de encargos (RAT, Terceiros, etc.)';
```

---

## 18. Razão de impostos

```sql
-- razoes_impostos
CREATE TABLE razoes_impostos (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial      BIGINT UNSIGNED NOT NULL,
  id_periodo     BIGINT UNSIGNED NOT NULL,
  tipo_imposto   VARCHAR(20) NOT NULL,
  id_lancamento  BIGINT UNSIGNED NULL,
  natureza       VARCHAR(10) NOT NULL,
  valor          DECIMAL(15,2) NOT NULL,
  id_pessoa      BIGINT UNSIGNED NULL,
  id_nota_fiscal BIGINT UNSIGNED NULL,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_razoes_impostos_filial (id_filial),
  KEY idx_razoes_impostos_periodo (id_periodo),
  KEY idx_razoes_impostos_tipo (tipo_imposto),
  KEY idx_razoes_impostos_lancamento (id_lancamento),
  KEY idx_razoes_impostos_natureza (natureza),
  KEY idx_razoes_impostos_pessoa (id_pessoa),
  KEY idx_razoes_impostos_nota_fiscal (id_nota_fiscal),
  CONSTRAINT fk_razoes_impostos_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_razoes_impostos_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_razoes_impostos_lancamento FOREIGN KEY (id_lancamento) REFERENCES lancamentos(id) ON UPDATE CASCADE,
  CONSTRAINT fk_razoes_impostos_pessoa FOREIGN KEY (id_pessoa) REFERENCES pessoas(id) ON UPDATE CASCADE,
  CONSTRAINT fk_razoes_impostos_nota_fiscal FOREIGN KEY (id_nota_fiscal) REFERENCES notas_fiscais(id) ON UPDATE CASCADE,
  CONSTRAINT chk_razoes_impostos_natureza CHECK (natureza IN ('Credito','Debito'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Razão de créditos e débitos de impostos (T7)';
```

---

## 19. Pendências

```sql
-- pendencias
CREATE TABLE pendencias (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial            BIGINT UNSIGNED NOT NULL,
  id_periodo           BIGINT UNSIGNED NOT NULL,
  categoria            VARCHAR(10) NOT NULL,
  tipo                 VARCHAR(50) NOT NULL,
  descricao            VARCHAR(500) NOT NULL,
  id_referencia        BIGINT UNSIGNED NULL,
  tabela_referencia    VARCHAR(50) NULL,
  status               VARCHAR(20) NOT NULL DEFAULT 'Aberta',
  id_usuario_resolucao BIGINT UNSIGNED NULL,
  data_resolucao       DATETIME NULL,
  justificativa        TEXT NULL,
  dados_extras         JSON NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pendencias_filial (id_filial),
  KEY idx_pendencias_periodo (id_periodo),
  KEY idx_pendencias_categoria (categoria),
  KEY idx_pendencias_status (status),
  KEY idx_pendencias_referencia (tabela_referencia, id_referencia),
  CONSTRAINT fk_pendencias_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_pendencias_periodo FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON UPDATE CASCADE,
  CONSTRAINT chk_pendencias_categoria CHECK (categoria IN ('Erro','Aviso')),
  CONSTRAINT chk_pendencias_status CHECK (status IN ('Aberta','Resolvida','Aceita'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Pendências (T6) — Erro/Aviso por filial';
```

---

## 20. Simulação (fase 2)

```sql
-- cenarios_simulacao
CREATE TABLE cenarios_simulacao (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa             BIGINT UNSIGNED NOT NULL,
  nome                   VARCHAR(200) NOT NULL,
  descricao              TEXT NULL,
  periodo_base           CHAR(7) NULL,
  escopo                 VARCHAR(50) NULL,
  variaveis_ajustadas    JSON NULL,
  resultados_persistidos JSON NULL,
  status                 VARCHAR(20) NOT NULL DEFAULT 'Salvo',
  dados_extras           JSON NULL,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by             BIGINT UNSIGNED NULL,
  updated_by             BIGINT UNSIGNED NULL,
  deleted_at             DATETIME NULL,
  deleted_by             BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_cenarios_simulacao_empresa (id_empresa),
  KEY idx_cenarios_simulacao_deleted_at (deleted_at),
  CONSTRAINT fk_cenarios_simulacao_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_cenarios_simulacao_status CHECK (status IN ('Salvo','Rascunho','Finalizado','Aprovado'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Cenários de simulação (fase 2)';
```

---

## 21. Usuários e auditoria

> **Nota D14 (usuarios.senha_hash):** o DDL abaixo é `senha_hash VARCHAR(255)`. **A implementação (Bloco 7)** precisa sobrescrever `getAuthPassword()` no model `Usuario` para retornar `senha_hash` (o Laravel espera `password`). Registrado em P5/D14.

```sql
-- usuarios
CREATE TABLE usuarios (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  nome           VARCHAR(200) NOT NULL,
  email          VARCHAR(200) NOT NULL,
  senha_hash     VARCHAR(255) NOT NULL,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by     BIGINT UNSIGNED NULL,
  updated_by     BIGINT UNSIGNED NULL,
  deleted_at     DATETIME NULL,
  deleted_by     BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_email (email),
  KEY idx_usuarios_empresa (id_empresa),
  KEY idx_usuarios_deleted_at (deleted_at),
  CONSTRAINT fk_usuarios_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuários do sistema';

-- usuarios_filiais (LEGADO; substituído por usuarios_atores)
CREATE TABLE usuarios_filiais (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario     BIGINT UNSIGNED NOT NULL,
  id_filial      BIGINT UNSIGNED NOT NULL,
  perfil         VARCHAR(20) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_filiais (id_usuario, id_filial),
  KEY idx_usuarios_filiais_filial (id_filial),
  CONSTRAINT fk_usuarios_filiais_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_usuarios_filiais_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Permissão de usuário por filial (LEGADO; substituído por usuarios_atores)';

-- usuarios_atores
CREATE TABLE usuarios_atores (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario        BIGINT UNSIGNED NOT NULL,
  id_filial         BIGINT UNSIGNED NOT NULL,
  id_ator_funcional BIGINT UNSIGNED NOT NULL,
  ativo             TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_atores (id_usuario, id_filial, id_ator_funcional),
  KEY idx_usuarios_atores_filial (id_filial),
  KEY idx_usuarios_atores_ator (id_ator_funcional),
  CONSTRAINT fk_usuarios_atores_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_usuarios_atores_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_usuarios_atores_ator FOREIGN KEY (id_ator_funcional) REFERENCES atores_funcionais(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tags de ator por usuário/filial';

-- auditorias
CREATE TABLE auditorias (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario        BIGINT UNSIGNED NULL,
  acao              VARCHAR(50) NOT NULL,
  tabela            VARCHAR(50) NOT NULL,
  id_registro       BIGINT UNSIGNED NULL,
  dados_anteriores  JSON NULL,
  dados_novos       JSON NULL,
  justificativa     TEXT NULL,
  ip                VARCHAR(45) NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_auditorias_usuario (id_usuario),
  KEY idx_auditorias_tabela_registro (tabela, id_registro),
  KEY idx_auditorias_acao (acao),
  KEY idx_auditorias_created_at (created_at),
  CONSTRAINT fk_auditorias_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de auditoria (imutável)';

-- logs_importacao
CREATE TABLE logs_importacao (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial       BIGINT UNSIGNED NOT NULL,
  tipo_documento  VARCHAR(20) NOT NULL,
  caminho_arquivo VARCHAR(500) NULL,
  status          VARCHAR(30) NOT NULL,
  mensagem        TEXT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_logs_importacao_filial (id_filial),
  KEY idx_logs_importacao_status (status),
  KEY idx_logs_importacao_created_at (created_at),
  CONSTRAINT fk_logs_importacao_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de importação de XMLs';
```

---

## 22. Handoff e ordens

```sql
-- configuracoes_handoff
CREATE TABLE configuracoes_handoff (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_empresa     BIGINT UNSIGNED NOT NULL,
  handoff_ativo  TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_configuracoes_handoff_empresa (id_empresa),
  CONSTRAINT fk_configuracoes_handoff_empresa FOREIGN KEY (id_empresa) REFERENCES empresas(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ativação/desativação do handoff por empresa (T8)';

-- documentos_encadeados
CREATE TABLE documentos_encadeados (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_documento_origem   BIGINT UNSIGNED NOT NULL,
  id_documento_destino  BIGINT UNSIGNED NOT NULL,
  tipo_relacao          VARCHAR(30) NOT NULL,
  dados_extras          JSON NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_documentos_encadeados_origem (id_documento_origem),
  KEY idx_documentos_encadeados_destino (id_documento_destino),
  CONSTRAINT chk_documentos_encadeados_tipo CHECK (tipo_relacao IN ('NF-e entrada -> conta a pagar','NF-e entrada -> lancamento','NF-e saida -> conta a receber','NF-e saida -> lancamento','CT-e -> NF-e','Devolucao -> nota original','Complemento -> nota original','Reclassificacao -> lancamento original'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Cadeia de documentos (T8)';

-- tarefas (ordens)
CREATE TABLE tarefas (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_filial           BIGINT UNSIGNED NOT NULL,
  tipo_ordem          VARCHAR(40) NOT NULL,
  id_documento        BIGINT UNSIGNED NOT NULL,
  tipo_documento      VARCHAR(20) NOT NULL,
  id_ator_origem      BIGINT UNSIGNED NOT NULL,
  id_ator_destino     BIGINT UNSIGNED NOT NULL,
  status              VARCHAR(20) NOT NULL DEFAULT 'pendente',
  urgente             TINYINT(1) NOT NULL DEFAULT 0,
  data_criacao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_conclusao      DATETIME NULL,
  id_ordem_anterior   BIGINT UNSIGNED NULL,
  descricao_resumida  VARCHAR(200) NULL,
  prioridade          INT NULL,
  dados_extras        JSON NULL,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          DATETIME NULL,
  deleted_by          BIGINT UNSIGNED NULL,
  PRIMARY KEY (id),
  KEY idx_tarefas_filial (id_filial),
  KEY idx_tarefas_ator_destino_status (id_ator_destino, status),
  KEY idx_tarefas_ator_origem (id_ator_origem),
  KEY idx_tarefas_status (status),
  KEY idx_tarefas_urgente (urgente),
  KEY idx_tarefas_tipo_ordem (tipo_ordem),
  KEY idx_tarefas_data_criacao (data_criacao),
  KEY idx_tarefas_deleted_at (deleted_at),
  CONSTRAINT fk_tarefas_filial FOREIGN KEY (id_filial) REFERENCES filiais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_tarefas_ator_origem FOREIGN KEY (id_ator_origem) REFERENCES atores_funcionais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_tarefas_ator_destino FOREIGN KEY (id_ator_destino) REFERENCES atores_funcionais(id) ON UPDATE CASCADE,
  CONSTRAINT fk_tarefas_ordem_anterior FOREIGN KEY (id_ordem_anterior) REFERENCES tarefas(id) ON UPDATE CASCADE,
  CONSTRAINT chk_tarefas_status CHECK (status IN ('pendente','em_andamento','concluida','cancelada')),
  CONSTRAINT chk_tarefas_tipo_documento CHECK (tipo_documento IN ('NF-e','NFS-e','CT-e','RPA','conta_pagar','conta_receber','folha','periodo','parametro','lancamento'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ordens (T8) — caixa de entrada/saída';
```

---

## 23. Menu (numeração)

> **Nota D17 (menu):** o DDL abaixo chama `menus_itens`/`menus_itens_atores` (plural). O `04_modelo_de_dados.md` chama `menu_item`/`menu_item_ator` (singular). **A implementação seguiu o DDL (plural).** O `04` será atualizado na v1.5.

```sql
-- menus_itens
CREATE TABLE menus_itens (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(10) NOT NULL,
  nome           VARCHAR(100) NOT NULL,
  rota           VARCHAR(200) NOT NULL,
  fase           INT NOT NULL DEFAULT 1,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  dados_extras   JSON NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_menus_itens_codigo (codigo),
  KEY idx_menus_itens_fase (fase),
  CONSTRAINT chk_menus_itens_fase CHECK (fase IN (1,2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Itens do menu (numeração para acesso rápido)';

-- menus_itens_atores (N:N)
CREATE TABLE menus_itens_atores (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_menu_item      BIGINT UNSIGNED NOT NULL,
  id_ator_funcional BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_menus_itens_atores (id_menu_item, id_ator_funcional),
  KEY idx_menus_itens_atores_ator (id_ator_funcional),
  CONSTRAINT fk_menus_itens_atores_item FOREIGN KEY (id_menu_item) REFERENCES menus_itens(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_menus_itens_atores_ator FOREIGN KEY (id_ator_funcional) REFERENCES atores_funcionais(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Relação N:N entre itens de menu e atores';
```

---

## 24. Seeds

```sql
-- Atores funcionais (pré-carregados)
INSERT INTO atores_funcionais (codigo, descricao, ativo) VALUES
  ('configurador',       'Configurador',       1),
  ('administrador',      'Administrador',      1),
  ('contador',           'Contador',           1),
  ('comprador',          'Comprador',          1),
  ('faturista',          'Faturista',          1),
  ('financeiro1',        'Financeiro1',        1),
  ('financeiro2',        'Financeiro2',        1),
  ('gerente_financeiro', 'Gerente Financeiro', 1),
  ('rh',                 'RH',                 1),
  ('auditor',            'Auditor',            1);

-- Tipos de documento
INSERT INTO tipos_documento (codigo, descricao) VALUES
  ('NF-e',  'Nota Fiscal Eletrônica'),
  ('NFS-e', 'Nota Fiscal de Serviço Eletrônica'),
  ('CT-e',  'Conhecimento de Transporte Eletrônico'),
  ('RPA',   'Recibo de Pagamento a Autônomo');

-- UFs
INSERT INTO ufs (sigla, nome) VALUES
  ('AC','Acre'),('AL','Alagoas'),('AP','Amapá'),('AM','Amazonas'),
  ('BA','Bahia'),('CE','Ceará'),('DF','Distrito Federal'),('ES','Espírito Santo'),
  ('GO','Goiás'),('MA','Maranhão'),('MT','Mato Grosso'),('MS','Mato Grosso do Sul'),
  ('MG','Minas Gerais'),('PA','Pará'),('PB','Paraíba'),('PR','Paraná'),
  ('PE','Pernambuco'),('PI','Piauí'),('RJ','Rio de Janeiro'),('RN','Rio Grande do Norte'),
  ('RS','Rio Grande do Sul'),('RO','Rondônia'),('RR','Roraima'),('SC','Santa Catarina'),
  ('SP','São Paulo'),('SE','Sergipe'),('TO','Tocantins');
```

> 💡 **Domínios que precisam ser carregados de arquivos oficiais:**
> - **CFOP:** tabela da Receita Federal (ou `05_apendices.md`, seção A).
> - **CST:** tabela do CONFAZ / Receita Federal (ou `05_apendices.md`, seção B).
> - **NCM:** tabela TIPI (Receita Federal).
> - **LC 116:** anexo da LC 116/2003.
> - **CNAE:** tabela do IBGE.
> - **Municípios:** tabela do IBGE (código IBGE + UF + alíquota ISS padrão).
> - **Bancos:** tabela do Banco Central.

---

## 25. Views auxiliares

> **Multi-empresa (tenant):** as views abaixo **não** filtram por empresa. O filtro de empresa (R2) é aplicado pelo **repositório** ao consumir a view, via `JOIN` com `filiais` ou `WHERE id_filial IN (SELECT id FROM filiais WHERE id_empresa = :t)`. **Não** converter views em procedures parametrizadas (MariaDB não tem parâmetros em views; procedures adicionariam complexidade sem ganho). Ver pendência 42 em `06_pendencias.md`.

> **Nota D21:** as views abaixo **não** filtram por empresa. O filtro de empresa (R2) é aplicado pelo **repositório** ao consumir a view, via `JOIN` com `filiais` ou `WHERE id_filial IN (SELECT id FROM filiais WHERE id_empresa = :t)`. **Não** converter views em procedures parametrizadas (MariaDB não tem parâmetros em views; procedures adicionariam complexidade sem ganho). Ver pendência P75.

> **Status da implementação:** as 3 views foram criadas via `DB::statement` nas migrations `2026_11_02_000052_create_view_vw_saldo_contas_bancarias.php`, `..._000053_create_view_vw_posicao_caixa.php` e `..._000054_create_view_vw_caixa_entrada.php`. SQL fiel ao DDL abaixo.



```sql
-- View: saldo de caixa/bancos por filial
CREATE OR REPLACE VIEW vw_saldo_contas_bancarias AS
SELECT
  cb.id_filial,
  cb.id,
  cb.agencia,
  cb.numero,
  cb.saldo_inicial +
    COALESCE((SELECT SUM(cr.valor_recebido) FROM contas_receber cr WHERE cr.id_conta_bancaria = cb.id AND cr.status = 'Baixada'), 0) -
    COALESCE((SELECT SUM(cp.valor_pago) FROM contas_pagar cp WHERE cp.id_conta_bancaria = cb.id AND cp.status = 'Baixada'), 0) AS saldo_atual
FROM contas_bancarias cb
WHERE cb.deleted_at IS NULL AND cb.ativo = 1;

-- View: posição de caixa consolidada por filial
CREATE OR REPLACE VIEW vw_posicao_caixa AS
SELECT
  f.id AS id_filial,
  COALESCE(SUM(v.saldo_atual), 0) +
    COALESCE((SELECT SUM(cr.valor) FROM contas_receber cr WHERE cr.id_filial = f.id AND cr.status IN ('Aberta','Parcialmente baixada') AND cr.deleted_at IS NULL), 0) -
    COALESCE((SELECT SUM(cp.valor) FROM contas_pagar cp WHERE cp.id_filial = f.id AND cp.status IN ('Aberta','Parcialmente baixada') AND cp.deleted_at IS NULL), 0) AS saldo_projetado
FROM filiais f
LEFT JOIN vw_saldo_contas_bancarias v ON v.id_filial = f.id
WHERE f.deleted_at IS NULL AND f.ativo = 1
GROUP BY f.id;

-- View: caixa de entrada (ordens pendentes/em andamento por ator)
CREATE OR REPLACE VIEW vw_caixa_entrada AS
SELECT
  t.id,
  t.id_filial,
  t.tipo_ordem,
  t.id_documento,
  t.tipo_documento,
  t.id_ator_origem,
  t.id_ator_destino,
  t.status,
  t.urgente,
  t.data_criacao,
  t.descricao_resumida,
  t.prioridade
FROM tarefas t
WHERE t.status IN ('pendente','em_andamento')
  AND t.deleted_at IS NULL
ORDER BY t.urgente DESC, t.prioridade DESC, t.data_criacao ASC;
```

---

## 26. Triggers

> ⚠️ **Recomendação:** **não** usar triggers para `updated_at`. A coluna já tem `ON UPDATE CURRENT_TIMESTAMP` no DDL. Triggers são desnecessárias e adicionam complexidade.

Se ainda assim quiser triggers (ex: para preencher `updated_by` automaticamente a partir do usuário logado), o padrão seria:

```sql
DELIMITER $$

CREATE TRIGGER trg_empresas_updated_by
BEFORE UPDATE ON empresas
FOR EACH ROW
BEGIN
  -- Exemplo: se a aplicação não preencher updated_by, manter o anterior
  IF NEW.updated_by IS NULL THEN
    SET NEW.updated_by = OLD.updated_by;
  END IF;
END$$

DELIMITER ;
```

> 💡 **Alternativa:** a aplicação preenche `updated_by` em todas as operações de escrita. **Mais simples e portável.**

---

## 27. Resumo

| Grupo | Tabelas | Status |
| :--- | :--- | :--- |
| Domínios | 10 | ✅ |
| Configuração | 7 | ✅ |
| Pessoas | 6 | ✅ |
| Produtos e serviços | 4 | ✅ |
| Bancos e contas | 1 | ✅ |
| Formas e condições | 2 | ✅ |
| Ativos | 1 | ✅ |
| Proventos e descontos | 1 | ✅ |
| Documentos fiscais | 4 | ✅ |
| Contas a pagar/receber | 2 | ✅ |
| Lançamentos | 1 | ✅ |
| Folha | 3 | ✅ |
| Depreciação e provisões | 2 | ✅ |
| Classificação | 2 | ✅ |
| Parâmetros | 4 | ✅ |
| Razão de impostos | 1 | ✅ |
| Pendências | 1 | ✅ |
| Simulação | 1 | ✅ |
| Usuários e auditoria | 5 | ✅ |
| Handoff e ordens | 3 | ✅ |
| Menu | 2 | ✅ |
| **Total** | **63 tabelas** | ✅ |

> **Multi-empresa (tenant):** o total de 63 tabelas **não muda**. Nenhuma tabela nova, nenhuma coluna nova. A classificação U/E/A/F/C/H (15 universais + 1 empresa + 13 com `id_empresa` + 18 com `id_filial` + 15 filhas puras + 1 híbrida) está em `04_modelo_de_dados.md` (seção "Multi-empresa (tenant)"). O isolamento é responsabilidade do repositório (R2), não do DDL.

**Extras:**
- ✅ Seed de atores funcionais, tipos de documento e UFs.
- ✅ 3 views (`vw_saldo_contas_bancarias`, `vw_posicao_caixa`, `vw_caixa_entrada`).
- ✅ Recomendação de **não** usar triggers (usar `ON UPDATE CURRENT_TIMESTAMP`).
- ✅ 3 views (`vw_saldo_contas_bancarias`, `vw_posicao_caixa`, `vw_caixa_entrada`), criadas em 6.19.
- ✅ Lint de SQL cru (6.20) — `scripts/check-raw-sql.sh`.

---

## 28. Histórico de versões

| Versão | Data | Mudança |
| :--- | :--- | :--- |
| 1.0 | 2026-10-24 | Criação do documento. DDL completo das 63 tabelas em MariaDB, com tipos, índices, FKs, constraints, seeds, views e recomendações de triggers. **Substitui** a lista de tabelas proposta (rascunho `.txt`). |
| 1.1 | 2026-10-28 | Adoção da regra empresa = tenant (R1–R3). **Nenhuma alteração de DDL.** Notas de convenção: seção 1.8 (multi-empresa), seção 25 (views), seção 27 (resumo). Frontmatter e propósito atualizados. |
| **1.2** | **2026-11-02** | **Sincronização com a implementação:** D1 (NCM hierárquico), D2 (`descricao` → `TEXT`), D3 (CST IBS/CBS), D14 (`senha_hash`), D17 (menu plural), D18 (FKs de `empresas` via ALTER), D21 (views sem filtro de tenant). Novas seções 1.9 (CHECKs e validação — D16) e 1.10 (convenção de datas — D20). Seção 25 nota de implementação. Seção 27 atualizada. |
